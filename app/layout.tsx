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
  openGraph: {
    title: "Học React AI cực dễ!",
    description: "Bắt đầu học React.js với AI ngay hôm nay!",
    type: "website",
    url: "https://react-ai-bolt.vercel.app",
    siteName: "React AI",
    images: [
      {
        url: "/opengraph-image.png", 
        width: 1200,
        height: 630,
        alt: "React AI OG Image",
      },
    ],
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Học React AI cực dễ!",
    description: "Bắt đầu học React.js với AI ngay hôm nay!",
    images: ["/opengraph-image.png"], 
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
