import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderCode, description, buyerName, buyerEmail, title } =
      body;

    if (!amount || !orderCode || !description) {
      console.error("⚠️ Thiếu dữ liệu bắt buộc!");
      return NextResponse.json(
        { message: "Thiếu dữ liệu bắt buộc!" },
        { status: 400 }
      );
    }

    const API_KEY = process.env.PAYOS_API_KEY;
    const CLIENT_ID = process.env.PAYOS_CLIENT_ID;
    const CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

    if (!API_KEY || !CLIENT_ID || !CHECKSUM_KEY) {
      console.error("❌ Thiếu API Key, Client ID hoặc Checksum Key!");
      return NextResponse.json(
        { message: "Thiếu API Key, Client ID hoặc Checksum Key!" },
        { status: 500 }
      );
    }

    // ✅ Tạo signature bằng HMAC_SHA256
    function generateSignature(
      amount: number,
      orderCode: number,
      description: string,
      cancelUrl: string,
      returnUrl: string,
      CHECKSUM_KEY: string
    ) {
      const data = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
      return crypto
        .createHmac("sha256", CHECKSUM_KEY)
        .update(data)
        .digest("hex");
    }

    const cancelUrl =
      (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") +
      "/payment/cancel";
    const returnUrl =
      (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") +
      "/payment/success";

    const signature = generateSignature(
      amount,
      orderCode,
      description,
      cancelUrl,
      returnUrl,
      CHECKSUM_KEY
    );

    const requestBody = {
      orderCode,
      amount,
      description,
      buyerName,
      buyerEmail,
      title,
      items: [
        {
          name: title,
          price: amount,
          quantity: 1,
        },
      ],
      cancelUrl,
      returnUrl,
      expiredAt: Math.floor(Date.now() / 1000) + 600,
      signature,
    };

    const res = await axios.post(
      "https://api-merchant.payos.vn/v2/payment-requests",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CLIENT_ID,
          "x-api-key": API_KEY,
        },
      }
    );

    if (res.data.desc === "success") {
      return NextResponse.json({ status: 200, result: res.data.data });
    } else {
      return NextResponse.json({
        status: 500,
        message: "Lỗi từ PayOS",
        error: res.data,
      });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, result: error });
  }
}
