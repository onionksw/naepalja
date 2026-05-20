"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calcOhaeng, ELEMENT_META, type Element5, type OhaengResult } from "@/lib/ohaeng";
import type { SajuResult } from "@/lib/saju";
import type { CategoryId } from "@/lib/categories";

interface Profile {
  name?: string;
  birthDate: string;
  birthHour: number;
  gender: "M" | "F";
  saju: SajuResult;
  pinnedCategories: CategoryId[];
}

const ELEMENTS: Element5[] = ["木", "火", "土", "金", "水"];

export default function MyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ohaeng, setOhaeng] = useState<OhaengResult | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("naepalja_profile");
    if (!raw) { router.replace("/setup"); return; }
    const p: Profile = JSON.parse(raw);
    setProfile(p);
    setOhaeng(calcOhaeng(p.saju));
  }, [router]);

  function handleReset() {
    Object.keys(localStorage).filter(k => k.startsWith("fortune_")).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem("naepalja_profile");
    router.replace("/setup");
  }

  if (!profile || !ohaeng) return null;

  const { saju } = profile;
  const total = ohaeng.details.length;

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto px-5 pb-24">

      {/* 네비 */}
      <nav className="flex items-center justify-between py-5 shrink-0">
        <span className="text-[11px] tracking-[0.4em] text-[var(--muted)] uppercase">내팔자야</span>
      </nav>

      {/* 프로필 헤더 */}
      <header className="pb-6 border-b border-[var(--line)] fade-up">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-3">내 정보</p>
        <h1 className="font-serif font-light text-[1.75rem] text-[var(--fg)] leading-snug mb-1">
          {profile.name || "이름 없음"}
        </h1>
        <p className="text-[12px] text-[var(--muted)]">
          {profile.birthDate} · {profile.gender === "M" ? "남성" : "여성"} · {saju.dayGan}일간
        </p>
      </header>

      {/* 사주 4주 */}
      <section className="py-5 border-b border-[var(--line)] fade-up delay-1">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-4">사주팔자</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { stem: "年", gan: saju.yearGan,  ji: saju.yearJi  },
            { stem: "月", gan: saju.monthGan, ji: saju.monthJi },
            { stem: "日", gan: saju.dayGan,   ji: saju.dayJi   },
            { stem: "時", gan: saju.hourGan,  ji: saju.hourJi  },
          ].map((p) => (
            <div key={p.stem} className="flex flex-col items-center py-3 bg-[var(--surface)]"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <span className="text-[9px] text-[var(--muted)] mb-2">{p.stem}</span>
              <span className="font-serif text-[1.3rem] text-[var(--fg)] leading-none">{p.gan}</span>
              <span className="font-serif text-[1.3rem] text-[var(--fg)] leading-none mt-1">{p.ji}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 음양 균형 */}
      <section className="py-5 border-b border-[var(--line)] fade-up delay-2">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-4">음양 균형</p>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[11px] text-[var(--muted)] w-4">양</span>
          <div className="flex-1 h-[6px] bg-[var(--line)] overflow-hidden">
            <div
              className="h-full bg-[var(--fg)] transition-all duration-700"
              style={{ width: `${(ohaeng.yangCount / total) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-[var(--fg)] w-4 text-right">{ohaeng.yangCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--muted)] w-4">음</span>
          <div className="flex-1 h-[6px] bg-[var(--line)] overflow-hidden">
            <div
              className="h-full bg-[var(--fg-soft)] transition-all duration-700"
              style={{ width: `${(ohaeng.yinCount / total) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-[var(--fg)] w-4 text-right">{ohaeng.yinCount}</span>
        </div>
        <p className="text-[11px] text-[var(--muted)] mt-3">
          {ohaeng.yangCount > ohaeng.yinCount
            ? "양기가 강해 적극적이고 활동적인 기질이에요."
            : ohaeng.yinCount > ohaeng.yangCount
            ? "음기가 강해 섬세하고 내면이 깊은 기질이에요."
            : "음양이 균형 잡혀 안정적인 기질이에요."}
        </p>
      </section>

      {/* 오행 분포 */}
      <section className="py-5 border-b border-[var(--line)] fade-up">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-4">오행 분포</p>
        <div className="flex flex-col gap-3">
          {ELEMENTS.map((el) => {
            const meta = ELEMENT_META[el];
            const count = ohaeng.counts[el];
            const pct = (count / total) * 100;
            return (
              <div key={el} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-16 shrink-0">
                  <span className="font-serif text-[15px]" style={{ color: meta.color }}>{el}</span>
                  <span className="text-[10px] text-[var(--muted)]">{meta.label}</span>
                </div>
                <div className="flex-1 h-[5px] bg-[var(--line)] overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: meta.color }}
                  />
                </div>
                <span className="text-[11px] text-[var(--muted)] w-4 text-right shrink-0">{count}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 강한 오행 / 부족한 오행 해석 */}
      <section className="py-5 border-b border-[var(--line)] fade-up">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-4">오행 해석</p>
        <div className="flex flex-col gap-3">
          {ELEMENTS.filter(e => ohaeng.counts[e] >= 2).map(el => {
            const meta = ELEMENT_META[el];
            return (
              <div key={el} className="p-4" style={{ background: meta.bg }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-serif text-[15px]" style={{ color: meta.color }}>{el}</span>
                  <span className="text-[11px] font-medium" style={{ color: meta.color }}>{meta.keyword}</span>
                  {ohaeng.dominant.includes(el) && (
                    <span className="text-[9px] px-2 py-[2px] rounded-full" style={{ background: meta.color, color: "#fff" }}>강함</span>
                  )}
                </div>
                <p className="text-[12px] text-[var(--fg-soft)] leading-relaxed">{meta.strong}</p>
              </div>
            );
          })}
          {ohaeng.lacking.map(el => {
            const meta = ELEMENT_META[el];
            return (
              <div key={el} className="p-4 border border-[var(--line)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-serif text-[15px]" style={{ color: meta.color }}>{el}</span>
                  <span className="text-[11px] font-medium" style={{ color: meta.color }}>{meta.keyword}</span>
                  <span className="text-[9px] px-2 py-[2px] bg-[var(--line)] text-[var(--muted)]">부족</span>
                </div>
                <p className="text-[12px] text-[var(--fg-soft)] leading-relaxed">{meta.weak}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 초기화 */}
      <section className="py-6">
        <button
          onClick={handleReset}
          className="text-[11px] text-red-400 hover:text-red-600 transition-colors"
        >
          정보 초기화 후 다시 입력
        </button>
      </section>
    </div>
  );
}
