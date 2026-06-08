import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "幸福指数计算器 · 你的生活有多幸福？",
  description: "通过6大维度科学评估你的幸福指数，发现让你更幸福的方向",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
