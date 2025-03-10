import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Thiếu ID đơn hàng!" },
        { status: 400 }
      );
    }

    const API_KEY = process.env.PAYOS_API_KEY;
    const CLIENT_ID = process.env.PAYOS_CLIENT_ID;

    if (!API_KEY || !CLIENT_ID) {
      return NextResponse.json(
        { message: "Thiếu API Key hoặc Client ID!" },
        { status: 500 }
      );
    }

    const res = await axios.get(
      `https://api-merchant.payos.vn/v2/payment-requests/${id}`,
      {
        headers: {
          "x-client-id": CLIENT_ID,
          "x-api-key": API_KEY,
        },
      }
    );

    if (res?.data?.code === '00') {
      return NextResponse.json({ status: 200, result: res.data.data });
    } else {
      return NextResponse.json({
        status: 500,
        message: res?.data?.desc,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Lỗi server!",
      error: error,
    });
  }
}
