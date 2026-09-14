import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MUTE 色研所｜你的个人色彩测试",
  description: "在浏览器本地完成的 12 季个人色彩分析、虚拟试色与色彩校准。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
