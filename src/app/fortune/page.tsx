"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FortuneResult } from "@/lib/claude";
import type { SajuResult } from "@/lib/saju";

interface FortuneData {
  saju: SajuResult;
  fortune: FortuneResult;
}

const COLOR_HEX: Record<string, string> = {
  붉은색: "#C0392B", 빨간색: "#C0392B",
  파란색: "#2471A3", 남색: "#1A3A5C",
  노란색: "#D4AC0D", 골드: "#B7950B",
  초록색: "#1E8449", 흰색: "#F8F7F4",
  검정색: "#18181A", 보라색: "#6C3483",
  주황색: "#CA6F1E", 분홍색: "#A93266",
  은색: "#828B8E", 회색: "#707070",
};

const SECTIONS = [
  { key: "workLuck",   label: "직업 · 재물" },
  { key: "loveLuck",   label: "애정 · 관계" },
  { key: "healthLuck", label: "건강" },
  { key: "caution",    label: "주의사항" },
] as const;

export default function FortunePage() {
  const [data, setData] = useState<FortuneData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("fortune");
    if (stored) {
      setData(JSON.parse(stored));
      setTimeout(() => setVisible(true), 50);
    }
  }, []);

  if (!data) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-5">
          <p className="text-[13px] text-[var(--muted)]">운세 정보가 없습니다.</p>
          <Link href="/saju" className="block text-[12px] text-[var(--fg)] underline underline-offset-4">
            사주 입력하기
          </Link>
        </div>
      </main>
    );
  }

  const { saju, fortune } = data;
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
  const colorHex = COLOR_HEX[fortune.luckyColor] ?? "#828B8E";

  return (
    <main
      className="flex flex-col min-h-screen max-w-sm mx-auto px-6 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* 네비 */}
      <nav className="flex items-center justify-between py-6 shrink-0">
        <Link href="/" className="text-[11px] tracking-[0.4em] text-[var(--muted)] uppercase">
          내팔자야
        </Link>
        <Link href="/saju" className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
          다시 보기
        </Link>
      </nav>

      <div className="flex-1 pb-16">

        {/* 헤더 */}
        <header className="py-10 border-b border-[var(--line)]">
          <p className="text-[11px] tracking-[0.2em] text-[var(--muted)] mb-4">{today}</p>
          <h1 className="font-serif font-light text-[2rem] leading-[1.3] text-[var(--fg)]">
            {saju.dayGan}일간,<br />
            오늘의 이야기
          </h1>
          <p className="text-[11px] text-[var(--muted)] mt-3 tracking-wide">
            {saju.yearGan}{saju.yearJi} · {saju.monthGan}{saju.monthJi} · {saju.dayGan}{saju.dayJi} · {saju.hourGan}{saju.hourJi}
          </p>
        </header>

        {/* 총운 */}
        <section className="py-10 border-b border-[var(--line)]">
          <p className="text-[10px] tracking-[0.35em] text-[var(--muted)] uppercase mb-5">총운</p>
          <p className="font-serif text-[1.2rem] leading-[2] text-[var(--fg)] font-light">
            {fortune.totalLuck}
          </p>
        </section>

        {/* 운세 섹션 */}
        <section className="py-2">
          {SECTIONS.map(({ key, label }, i) => (
            <div
              key={key}
              className="py-7 border-b border-[var(--line)]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <p className="text-[10px] tracking-[0.35em] text-[var(--muted)] uppercase mb-3">
                {label}
              </p>
              <p className="text-[14px] leading-[1.85] text-[var(--fg-soft)]">
                {fortune[key]}
              </p>
            </div>
          ))}
        </section>

        {/* 오늘의 행운 */}
        <section className="py-8 border-b border-[var(--line)]">
          <p className="text-[10px] tracking-[0.35em] text-[var(--muted)] uppercase mb-6">오늘의 행운</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <div
                className="w-8 h-8 rounded-full border border-[var(--line)]"
                style={{ backgroundColor: colorHex }}
              />
              <p className="text-[10px] text-[var(--muted)] mt-1">색상</p>
              <p className="text-[13px] text-[var(--fg)]">{fortune.luckyColor}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-serif text-[2rem] leading-none text-[var(--fg)]">{fortune.luckyNumber}</p>
              <p className="text-[10px] text-[var(--muted)] mt-1">숫자</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-[var(--muted)] mt-9">물건</p>
              <p className="text-[13px] text-[var(--fg)]">{fortune.luckyItem}</p>
            </div>
          </div>
        </section>

        {/* 회원가입 유도 */}
        <section className="py-10">
          <p className="font-serif font-light text-[1.4rem] text-[var(--fg)] leading-snug mb-3">
            내일도<br />확인하고 싶다면
          </p>
          <p className="text-[12px] text-[var(--muted)] leading-relaxed mb-7">
            가입하면 매일 아침 운세가 자동으로 준비됩니다.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center w-full py-4 border border-[var(--fg)] text-[var(--fg)] text-[12px] tracking-[0.25em] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all duration-200"
          >
            무료로 시작하기
          </Link>
        </section>

      </div>
    </main>
  );
}
