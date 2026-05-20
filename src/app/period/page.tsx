"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryId } from "@/lib/categories";

interface Profile { pinnedCategories: CategoryId[] }

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth() + 1;
const week = Math.ceil(now.getDate() / 7);

function seasonLabel() {
  if (m >= 3 && m <= 5) return `봄 (3~5월)`;
  if (m >= 6 && m <= 8) return `여름 (6~8월)`;
  if (m >= 9 && m <= 11) return `가을 (9~11월)`;
  return `겨울 (12~2월)`;
}

const PERIODS = [
  {
    type: "week",
    label: "이번 주",
    tag: `${m}월 ${week}주차`,
    desc: "이번 주의 전체 흐름과 조심할 것",
  },
  {
    type: "month",
    label: "이번 달",
    tag: `${y}년 ${m}월`,
    desc: "이달의 주요 운세와 방향",
  },
  {
    type: "season",
    label: "이번 계절",
    tag: seasonLabel(),
    desc: "현재 계절의 기운과 살아가는 방식",
  },
  {
    type: "year",
    label: "올해",
    tag: `${y}년`,
    desc: "올해 전반적인 운의 큰 흐름",
  },
  {
    type: "nextyear",
    label: "내년",
    tag: `${y + 1}년`,
    desc: `${y + 1}년을 미리 엿보는 운세`,
  },
];

export default function PeriodPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("naepalja_profile");
    if (!raw) { router.replace("/setup"); return; }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto px-5 pb-24">

      <nav className="flex items-center justify-between py-5 shrink-0">
        <span className="text-[11px] tracking-[0.4em] text-[var(--muted)] uppercase">내팔자야</span>
      </nav>

      <header className="pb-6 border-b border-[var(--line)] fade-up">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-2">기간별 운세</p>
        <h1 className="font-serif font-light text-[1.75rem] text-[var(--fg)] leading-snug">
          어느 기간이<br />궁금하세요?
        </h1>
      </header>

      <section className="pt-5 flex flex-col gap-[6px]">
        {PERIODS.map((p, i) => (
          <Link
            key={p.type}
            href={`/period/${p.type}`}
            className={`flex items-center justify-between px-4 py-[16px] bg-[var(--surface)] fade-up delay-${Math.min(i + 1, 3)} hover:opacity-75 transition-opacity`}
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div>
              <div className="flex items-baseline gap-2 mb-[3px]">
                <p className="text-[14px] text-[var(--fg)]">{p.label}</p>
                <span className="text-[10px] text-[var(--muted)]">{p.tag}</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">{p.desc}</p>
            </div>
            <span className="text-[var(--muted)] text-[18px] ml-4 leading-none shrink-0">›</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
