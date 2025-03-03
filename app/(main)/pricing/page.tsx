import PricingView from "@/components/custom/PricingView";
import ToggleSidebar from "@/components/custom/ToggleSidebar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title :  "Bảng giá",
  description: "Tăng tốc học React.js với AI! Chọn gói phù hợp từ cơ bản đến chuyên nghiệp, nhận token và trải nghiệm hướng dẫn AI xây dựng ứng dụng React nhanh chóng, hiệu quả."


}

function Pricing() {
    
  return (
    <div className="px-3 w-full">
      <ToggleSidebar />
      <div className="mt-8 xl:mt-10  flex flex-col items-center px-10 lg:px-32 xl:px-48">
        <h2 className="font-bold text-4xl">Bảng giá dịch vụ</h2>
        <div className="text-lg text-gray-400 mt-3 font-semibold">Danh cho thành viên</div>
        <PricingView />
      </div>
    </div>
  );
}

export default Pricing;
