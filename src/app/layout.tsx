import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import ConditionalBottomNav from "@/components/ConditionalBottomNav";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "내팔자야 — 매일 아침, 내 운명을 먼저 읽어",
  description: "사주팔자로 오늘의 흐름을 확인하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen antialiased" style={{ background: "#F7F6F3", color: "#1A1916", fontFamily: "var(--font-sans)" }}>
        {children}
        <ConditionalBottomNav />
      </body>
    </html>
  );
}
