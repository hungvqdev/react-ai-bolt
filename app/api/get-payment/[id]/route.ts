import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { PRICING_OPTIONS } from "@/lib/prompt";

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

    if (res?.data?.code === "00") {
      const paymentData = res.data.data;
      const orderCode = paymentData?.orderCode;
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      const order = await convex.query(api.orders.GetOrder, { orderCode });

      if (order) {
        const user = await convex.query(api.users.GetUser, {
          email: order?.email,
        });

        if (
          paymentData?.status === "PAID" &&
          [1, 2, 3, 4].includes(order?.product)
        ) {
          const product = PRICING_OPTIONS.find(
            (item) => item.product === order.product
          );
          const token = Number(user?.token) + Number(product?.value);

          await convex.mutation(api.users.UpdateToken, {
            userId: user?._id,
            token,
          });
          await convex.mutation(api.orders.UpdateOrderStatus, {
            orderCode,
            status: "PAID",
          });
        }
      }

      return NextResponse.json({ status: 200, result: paymentData });
    } else {
      return NextResponse.json({ status: 500, message: res?.data?.desc });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Lỗi server!", error });
  }
}
