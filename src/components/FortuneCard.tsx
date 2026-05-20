"use client";

import { useEffect, useState } from "react";
import type { CategoryId } from "@/lib/categories";

interface Props {
  categoryId: CategoryId;
  label: string;
  desc: string;
  pinned: boolean;
  autoLoad?: boolean;
  cachedText?: string;
  profile: { birthDate: string; birthHour: number };
  onTogglePin: (id: CategoryId) => void;
  onCacheText: (id: CategoryId, text: string) => void;
}

export default function FortuneCard({
  categoryId, label, desc, pinned, autoLoad, cachedText, profile, onTogglePin, onCacheText,
}: Props) {
  const [text, setText] = useState(cachedText ?? "");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(!!cachedText);

  // 고정 카드는 마운트 시 자동 로드
  useEffect(() => {
    if (autoLoad && !cachedText && !loaded) fetchFortune();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad]);

  async function fetchFortune() {
    if (loading || loaded) return;
    setLoading(true);
    try {
      const res = await fetch("/api/fortune/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: profile.birthDate, birthHour: profile.birthHour, categoryId }),
      });
      const data = await res.json();
      const result = data.text ?? "운세를 불러오지 못했습니다.";
      setText(result);
      setLoaded(true);
      onCacheText(categoryId, result);
    } catch {
      setText("잠시 후 다시 시도해주세요.");
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  /* ── 고정 카드 ─────────────────────────────────────── */
  if (pinned) {
    return (
      <div className="bg-[var(--surface)] p-5 fade-up" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] tracking-[0.25em] text-[var(--muted)] uppercase">{label}</p>
          <button
            onClick={() => onTogglePin(categoryId)}
            className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            고정 해제
          </button>
        </div>

        {loading && (
          <div className="flex flex-col gap-[10px]">
            <div className="skeleton h-[14px] w-full" />
            <div className="skeleton h-[14px] w-[85%]" />
            <div className="skeleton h-[14px] w-[70%]" />
          </div>
        )}

        {loaded && (
          <p className="font-serif text-[1rem] leading-[1.95] text-[var(--fg)] fade-in">
            {text}
          </p>
        )}
      </div>
    );
  }

  /* ── 선택 카드 (오늘 더 보기 섹션) ──────────────────── */
  return (
    <div className="border border-[var(--line)] p-4 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--fg)]">{label}</p>
          {!loaded && <p className="text-[11px] text-[var(--muted)] mt-[2px]">{desc}</p>}
        </div>

        {!loaded && !loading && (
          <button
            onClick={fetchFortune}
            className="ml-4 shrink-0 text-[11px] tracking-[0.15em] px-3 py-[6px] border border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--surface)] transition-all duration-150"
          >
            보기
          </button>
        )}

        {loading && (
          <span className="ml-4 w-4 h-4 border border-[var(--muted)] border-t-transparent rounded-full animate-spin shrink-0" />
        )}

        {loaded && (
          <button
            onClick={() => onTogglePin(categoryId)}
            className="ml-4 shrink-0 text-[11px] tracking-[0.1em] text-[var(--muted)] hover:text-[var(--fg)] transition-colors border-b border-transparent hover:border-[var(--fg)] pb-px"
          >
            고정
          </button>
        )}
      </div>

      {loaded && (
        <p className="text-[13px] leading-[1.85] text-[var(--fg-soft)] mt-4 fade-in">
          {text}
        </p>
      )}
    </div>
  );
}
