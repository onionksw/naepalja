"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import FortuneLoader from "@/components/FortuneLoader";

interface Profile {
  birthDate: string;
  birthHour: number;
  pinnedCategories: CategoryId[];
}

const TODAY_KEY = new Date().toISOString().slice(0, 10);
const TODAY_LABEL = new Date().toLocaleDateString("ko-KR", {
  year: "numeric", month: "long", day: "numeric",
});

export default function FortunePage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as CategoryId;
  const category = CATEGORIES.find((c) => c.id === categoryId);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!category) { router.replace("/"); return; }

    const raw = localStorage.getItem("naepalja_profile");
    if (!raw) { router.replace("/setup"); return; }
    const profile: Profile = JSON.parse(raw);
    setPinned((profile.pinnedCategories ?? []).includes(categoryId));

    const cacheKey = `fortune_cat_${categoryId}_${TODAY_KEY}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setText(cached);
      setLoaded(true);
      return;
    }

    setLoading(true);
    fetch("/api/fortune/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ birthDate: profile.birthDate, birthHour: profile.birthHour, categoryId }),
    })
      .then((r) => r.json())
      .then((data) => {
        const result = data.text ?? "운세를 불러오지 못했습니다.";
        setText(result);
        setLoaded(true);
        localStorage.setItem(cacheKey, result);
      })
      .catch(() => {
        setText("잠시 후 다시 시도해주세요.");
        setLoaded(true);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  function togglePin() {
    const raw = localStorage.getItem("naepalja_profile");
    if (!raw) return;
    const profile: Profile = JSON.parse(raw);
    const cats = profile.pinnedCategories ?? [];
    const next = pinned
      ? cats.filter((c) => c !== categoryId)
      : [...cats, categoryId];
    localStorage.setItem("naepalja_profile", JSON.stringify({ ...profile, pinnedCategories: next }));
    setPinned(!pinned);
  }

  if (!category) return null;

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto px-5">

      {/* 네비 */}
      <nav className="flex items-center justify-between py-5 shrink-0">
        <button
          onClick={() => router.back()}
          className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          ← 뒤로
        </button>
        <button
          onClick={togglePin}
          className={`text-[11px] transition-colors ${
            pinned
              ? "text-[var(--fg)]"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          {pinned ? "✓ 고정됨" : "고정"}
        </button>
      </nav>

      {/* 헤더 */}
      <header className="pb-7 border-b border-[var(--line)] fade-up">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-3">{TODAY_LABEL}</p>
        <h1 className="font-serif font-light text-[2rem] text-[var(--fg)] leading-snug mb-1">
          {category.label}
        </h1>
        <p className="text-[12px] text-[var(--muted)]">{category.desc}</p>
      </header>

      {/* 운세 본문 */}
      <main className="pt-4 pb-16">
        {loading && <FortuneLoader />}
        {loaded && (
          <p className="font-serif text-[1.05rem] leading-[2.1] text-[var(--fg)] fade-up">
            {text}
          </p>
        )}
      </main>
    </div>
  );
}
