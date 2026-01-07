import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escape Room - 방탈출 게임 플랫폼",
  description: "몰입감 넘치는 온라인 방탈출 게임을 경험하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
