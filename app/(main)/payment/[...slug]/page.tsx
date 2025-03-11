import { getUserCookie } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PRICING_OPTIONS } from "@/lib/prompt";
import { ConvexHttpClient } from "convex/browser";
import Link from "next/link";
import React, { cache } from "react";

const updateOrderStatus = cache(async (orderCode: number, status: string) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const result = await convex.mutation(api.orders.UpdateOrderStatus, {
    orderCode,
    status,
  });
  return result;
});

const UpdateTokens = cache(async (userId: Id<"users">, token: number) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const result = await convex.mutation(api.users.UpdateToken, {
    userId,
    token,
  });
  return result;
});

const GetOrder = cache(async (orderCode: number) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const result = await convex.query(api.orders.GetOrder, {
    orderCode: orderCode,
  });
  return result;
});

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const timePart = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  const datePart = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  return `${timePart}, ${datePart}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; orderCode?: string }>;
}) {
  const params = await searchParams;
  if (!params.status || !params.orderCode) {
    return {
      title: "Không tim thấy đơn hàng",
    };
  }
  if (params.status === "CANCELLED") {
    return {
      title: `Hủy thanh toán #${params.orderCode}`,
    };
  }
  if (params.status === "PAID") {
    return {
      title: `Thanh toán thành công #${params.orderCode}`,
    };
  }
}

export default async function PaymentStatus({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; status?: string; orderCode?: string }>;
}) {
  const params = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const user = await getUserCookie();
  console.log("cookies trong page", user);

  if (!params.id || !params.status || !params.orderCode) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        ⚠️ Không tìm thấy thông tin đơn hàng
      </div>
    );
  }
  const res = await fetch(`${baseUrl}/api/get-payment/${params.id}`);

  const data = await res.json();
  console.log("Payment data:", data); 

  if (!data || data.status !== 200) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        ❌ {data?.message}
      </div>
    );
  }

  if (data && data.result?.status === "PAID") {
    const order = await GetOrder(Number(params.orderCode));
    if (!order) {
      console.error("❌ Không tìm thấy đơn hàng!");
      return (
        <div className="flex items-center justify-center w-full h-screen">
          ❌ Không tìm thấy đơn hàng!
        </div>
      );
    }
    if ([1, 2, 3, 4].includes(order?.product) && order.status === "PENDING") {
      const product = PRICING_OPTIONS.find(
        (item) => item.product === order.product
      );
      const token = Number(user?.token) + Number(product?.value);
      console.log("userId:", user?._id);
      console.log("token:", token);
      if (!user?._id || !token) {
        console.error("userId hoặc token không hợp lệ!");
        return;
      }
      const resultToken = await UpdateTokens(user?._id as Id<"users">, token);
      console.log(resultToken);
      await updateOrderStatus(Number(params.orderCode), data?.result?.status);
    }

    return (
      <div className="flex flex-col items-center w-full justify-center h-[calc(100vh-72px)]  gap-4 p-4 md:p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <svg
            className="w-16 h-16 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <h1 className="font-semibold text-3xl">Thanh toán thành công</h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/tight dark:text-gray-400">
            Cảm ơn bạn đã ủng hộ tôi.
          </p>
        </div>
        <div className="w-full max-w-sm p-0 border rounded-xl bg-gray-900">
          <div className="p-4 md:p-6">
            <div className="grid gap-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="font-medium">Đơn hàng:</div>
                <div>#{data?.result?.orderCode}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-medium">Ngày giao dịch:</div>
                <div>
                  {formatDate(
                    data?.result?.transactions[0]?.transactionDateTime
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-medium">Số tiền thanh toán:</div>
                <div>
                  {Number(data?.result?.amount).toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="font-medium">Mã giao dịch:</div>
                <div>{data?.result?.transactions[0]?.reference}</div>
              </div>
            </div>
          </div>
          <div className="flex w-full p-4 md:p-6">
            <Button className="mx-auto">
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center w-full justify-center h-[calc(100vh-72px)]  gap-4 p-4 md:p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <svg
            className="w-16 h-16 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="8" x2="16" y2="16" />
            <line x1="16" y1="8" x2="8" y2="16" />
          </svg>
          <h1 className="font-semibold text-3xl">Hủy thanh toán thành công</h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/tight dark:text-gray-400">
            Cảm ơn bạn đã ủng hộ tôi.
          </p>
        </div>
        <div className="flex w-full p-4 md:p-6">
          <Button className="mx-auto">
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }
}
