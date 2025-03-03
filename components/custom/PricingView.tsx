"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { PRICING_OPTIONS } from "@/lib/prompt";
import React, { useContext } from "react";
import { Button } from "../ui/button";

function PricingView() {
  const userDetailContext = useContext(UserDetailContext);

  if (!userDetailContext) {
    throw new Error("2");
  }

  const { userDetail } = userDetailContext;
  return (
    <div className="w-full">
      <div className="p-5 border rounded-xl flex justify-between w-full mt-4 bg-gray-900">
        <div className="text-gray-400 flex items-center gap-1">
          Còn{" "}
          <span className="font-bold text-white ">
            {Number(userDetail?.token).toLocaleString("vi-VN")}
          </span>{" "}
          Token
        </div>
        <div>
          <h2 className="font-medium">Bạn cẩn thêm token không?</h2>
          <h2 className="text-gray-400 text-sm">
            Nâng cấp gói của bạn ở bên dưới
          </h2>
        </div>
      </div>{" "}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {PRICING_OPTIONS.map((op, index) => (
          <div key={index} className="border p-4 flex flex-col gap-3">
            <h2 className="font-bold text-xl">{op.name}</h2>
            <div className="flex gap-2 items-center">
              <h2 className="text-lg font-medium text-green-600">
                {Number(op.price).toLocaleString("vi-VN")}đ
              </h2>
              <h2 className="text-gray-400 line-through">{Number(op.original_price).toLocaleString("vi-VN")}đ</h2>
            </div>

            <p className="text-gray-400 min-h-[80px]">{op.desc}</p>
            <h2 className="text-xl font-bold text-center">
              {op.tokens} Tokens
            </h2>
            <Button className="mt-2">Mua ngay</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingView;
