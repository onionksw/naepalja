"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import FortuneLoader from "@/components/FortuneLoader";
import type { PeriodType } from "@/lib/prompt";
import type { SajuResult } from "@/lib/saju";
import type { CategoryId } from "@/lib/categories";

interface Profile {
  birthDate: string;
  birthHour: number;
  saju: SajuResult;
  pinnedCategories: CategoryId[];
}

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth() + 1;
const week = Math.ceil(now.getDate() / 7);

function getSeasonName() {
  if (m >= 3 && m <= 5) return "봄";
  if (m >= 6 && m <= 8) return "여름";
  if (m >= 9 && m <= 11) return "가을";
  return "겨울";
}

const META: Record<string, { label: string; tag: string; desc: string; cacheKey: string }> = {
  week:    { label: "이번 주",    tag: `${m}월 ${week}주차`,    desc: "이번 주의 전체 흐름",      cacheKey: `fortune_period_week_${y}-${m}-W${week}` },
  month:   { label: "이번 달",    tag: `${y}년 ${m}월`,         desc: "이달의 주요 운세",          cacheKey: `fortune_period_month_${y}-${m}` },
  season:  { label: `이번 ${getSeasonName()}`, tag: `${y}년 ${getSeasonName()}`, desc: "현재 계절의 기운", cacheKey: `fortune_period_season_${y}-${getSeasonName()}` },
  year:    { label: "올해",       tag: `${y}년`,                desc: "연간 전체 흐름",            cacheKey: `fortune_period_year_${y}` },
  nextyear:{ label: "내년",       tag: `${y + 1}년`,            desc: `${y + 1}년 미리 보기`,      cacheKey: `fortune_period_nextyear_${y + 1}` },
};

const VALID_TYPES: PeriodType[] = ["week", "month", "season", "year", "nextyear"];

export default function PeriodDetailPage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as string;
  const meta = META[type];

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!meta || !VALID_TYPES.includes(type as PeriodType)) { router.replace("/period"); return; }

    const raw = localStorage.getItem("naepalja_profile");
    if (!raw) { router.replace("/setup"); return; }
    const profile: Profile = JSON.parse(raw);

    const cached = localStorage.getItem(meta.cacheKey);
    if (cached) {
      setText(cached);
      setLoaded(true);
      return;
    }

    setLoading(true);
    fetch("/api/fortune/period", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ birthDate: profile.birthDate, birthHour: profile.birthHour, period: type }),
    })
      .then(r => r.json())
      .then(data => {
        const result = data.text ?? "운세를 불러오지 못했습니다.";
        localStorage.setItem(meta.cacheKey, result);
        setText(result);
        setLoaded(true);
      })
      .catch(() => {
        setText("잠시 후 다시 시도해주세요.");
        setLoaded(true);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (!meta) return null;

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto px-5">

      <nav className="flex items-center justify-between py-5 shrink-0">
        <button
          onClick={() => router.back()}
          className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          ← 뒤로
        </button>
        <span className="text-[11px] tracking-[0.4em] text-[var(--muted)] uppercase">내팔자야</span>
      </nav>

      <header className="pb-7 border-b border-[var(--line)] fade-up">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-3">{meta.tag}</p>
        <h1 className="font-serif font-light text-[2rem] text-[var(--fg)] leading-snug mb-1">
          {meta.label}
        </h1>
        <p className="text-[12px] text-[var(--muted)]">{meta.desc}</p>
      </header>

      <main className="pt-4 pb-16">
        {loading && <FortuneLoader />}
        {loaded && (
          <p className="font-serif text-[1.05rem] leading-[2.1] text-[var(--fg)] fade-up pt-4">
            {text}
          </p>
        )}
      </main>
    </div>
  );
}
