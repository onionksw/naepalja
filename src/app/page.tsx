"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, DEFAULT_PINNED, type CategoryId } from "@/lib/categories";
import type { SajuResult } from "@/lib/saju";

interface Profile {
  name?: string;
  birthDate: string;
  birthHour: number;
  gender: "M" | "F";
  saju: SajuResult;
  pinnedCategories: CategoryId[];
}

interface DailySummary {
  luckyColor: string;
  luckyNumber: string;
  luckyItem: string;
  caution: string;
}

const TODAY_LABEL = new Date().toLocaleDateString("ko-KR", {
  year: "numeric", month: "long", day: "numeric", weekday: "long",
});
const TODAY_KEY = new Date().toISOString().slice(0, 10);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6)  return "고요한 새벽이에요";
  if (h < 11) return "좋은 아침이에요";
  if (h < 14) return "좋은 오전이에요";
  if (h < 18) return "좋은 오후예요";
  if (h < 22) return "좋은 저녁이에요";
  return "오늘 하루 수고했어요";
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pinned, setPinned] = useState<CategoryId[]>(DEFAULT_PINNED);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [ready, setReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("naepalja_profile");
    if (!raw) { router.replace("/setup"); return; }
    const p: Profile = JSON.parse(raw);
    setProfile(p);
    setPinned(p.pinnedCategories ?? DEFAULT_PINNED);

    const summaryKey = `fortune_summary_${TODAY_KEY}`;
    const cached = localStorage.getItem(summaryKey);
    if (cached) {
      setSummary(JSON.parse(cached));
    } else {
      fetch("/api/fortune/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: p.birthDate, birthHour: p.birthHour }),
      })
        .then((r) => r.json())
        .then((data: DailySummary) => {
          setSummary(data);
          localStorage.setItem(summaryKey, JSON.stringify(data));
        })
        .catch(() => {});
    }

    setReady(true);
  }, [router]);

  function handleReset() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("fortune_"))
      .forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem("naepalja_profile");
    router.replace("/setup");
  }

  if (!ready || !profile) return null;

  const { saju } = profile;
  const pinnedCats   = CATEGORIES.filter((c) => pinned.includes(c.id));
  const unpinnedCats = CATEGORIES.filter((c) => !pinned.includes(c.id));

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto px-5 pb-20">

      {/* 네비 */}
      <nav className="flex items-center justify-between py-5 shrink-0">
        <span className="text-[11px] tracking-[0.4em] text-[var(--muted)] uppercase">내팔자야</span>
        <button
          onClick={() => setShowSettings((v) => !v)}
          className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          {showSettings ? "닫기" : "설정"}
        </button>
      </nav>

      {/* 설정 패널 */}
      {showSettings && (
        <div className="mb-4 p-4 bg-[var(--surface)] fade-up" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p className="text-[12px] text-[var(--fg)] mb-1">
            {profile.name && <span className="mr-2">{profile.name}</span>}
            {profile.birthDate} · {profile.gender === "M" ? "남성" : "여성"}
          </p>
          <p className="text-[11px] text-[var(--muted)] mb-4">
            {saju.yearGan}{saju.yearJi} {saju.monthGan}{saju.monthJi} {saju.dayGan}{saju.dayJi} {saju.hourGan}{saju.hourJi}
          </p>
          <button onClick={handleReset} className="text-[11px] text-red-500 hover:opacity-70 transition-opacity">
            정보 초기화 후 다시 입력
          </button>
        </div>
      )}

      {/* 헤더 */}
      <header className="pt-2 pb-6 border-b border-[var(--line)] fade-up">
        <p className="text-[11px] text-[var(--muted)] mb-3">{TODAY_LABEL}</p>
        <h1 className="font-serif font-light text-[1.75rem] leading-snug text-[var(--fg)] mb-1">
          {getGreeting()}{profile.name ? `, ${profile.name}님` : ""}
        </h1>
        <p className="text-[12px] text-[var(--muted)]">
          {saju.dayGan}일간의 오늘
        </p>
      </header>

      {/* 오늘의 키워드 */}
      <section className="py-5 border-b border-[var(--line)]">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-3">오늘의 키워드</p>
        {!summary ? (
          <div className="flex gap-2">
            {[72, 56, 68, 88].map((w, i) => (
              <div key={i} className="skeleton h-[54px] rounded-none" style={{ width: w }} />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap fade-in">
            <Chip label="색상" value={summary.luckyColor} />
            <Chip label="숫자" value={summary.luckyNumber} />
            <Chip label="물건" value={summary.luckyItem} />
            <Chip label="주의" value={summary.caution} accent />
          </div>
        )}
      </section>

      {/* 고정된 운세 */}
      {pinnedCats.length > 0 && (
        <section className="pt-5 pb-2">
          <SectionLabel>고정된 운세</SectionLabel>
          <div className="flex flex-col gap-[6px] mt-3">
            {pinnedCats.map((cat, i) => (
              <CategoryRow key={cat.id} id={cat.id} label={cat.label} desc={cat.desc} pinned delay={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* 오늘 더 보기 */}
      {unpinnedCats.length > 0 && (
        <section className="pb-4 mt-5">
          <SectionLabel>오늘 더 보기</SectionLabel>
          <div className="flex flex-col gap-[6px] mt-3">
            {unpinnedCats.map((cat) => (
              <CategoryRow key={cat.id} id={cat.id} label={cat.label} desc={cat.desc} pinned={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase shrink-0">{children}</span>
      <div className="flex-1 border-t border-[var(--line)]" />
    </div>
  );
}

function Chip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-3 min-w-[60px] ${
        accent ? "bg-[var(--fg)]" : "bg-[var(--surface)]"
      }`}
      style={{ boxShadow: accent ? "none" : "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <span className={`text-[9px] tracking-[0.2em] uppercase mb-1 ${accent ? "text-[var(--bg)] opacity-50" : "text-[var(--muted)]"}`}>
        {label}
      </span>
      <span className={`text-[13px] font-medium whitespace-nowrap ${accent ? "text-[var(--bg)]" : "text-[var(--fg)]"}`}>
        {value}
      </span>
    </div>
  );
}

function CategoryRow({ id, label, desc, pinned, delay }: {
  id: CategoryId; label: string; desc: string; pinned: boolean; delay?: number;
}) {
  return (
    <Link
      href={`/fortune/${id}`}
      className={`flex items-center justify-between px-4 py-[14px] fade-up transition-opacity hover:opacity-70 ${
        delay ? `delay-${Math.min(delay, 3)}` : ""
      } ${pinned ? "bg-[var(--surface)]" : "border border-[var(--line)]"}`}
      style={pinned ? { boxShadow: "0 1px 3px rgba(0,0,0,0.05)" } : {}}
    >
      <div>
        <p className="text-[13px] text-[var(--fg)]">{label}</p>
        <p className="text-[11px] text-[var(--muted)] mt-[2px]">{desc}</p>
      </div>
      <span className="text-[var(--muted)] text-[18px] ml-4 leading-none">›</span>
    </Link>
  );
}
