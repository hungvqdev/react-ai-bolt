import type { Metadata } from "next";

import "./globals.css";
import Provider from "./provider";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: {
    default: "React Ai",
    template: "React Ai - %s"
  },
  description: "Học React.js dễ dàng với AI! Hướng dẫn từ cơ bản đến nâng cao, tối ưu code và debug tự động. Bắt đầu xây dựng ứng dụng web chuyên nghiệp ngay hôm nay!",
  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <Provider>{children}</Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
