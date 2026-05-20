"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TALISMAN_META, TALISMAN_ORDER } from "@/lib/talisman";

export default function TalismanMenuPage() {
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
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-2">부적</p>
        <h1 className="font-serif font-light text-[1.75rem] text-[var(--fg)] leading-snug">
          어떤 부적이<br />필요하세요?
        </h1>
        <p className="text-[12px] text-[var(--muted)] mt-2">
          사주를 바탕으로 나만의 부적을 만들어요
        </p>
      </header>

      <section className="pt-5 flex flex-col gap-[6px]">
        {TALISMAN_ORDER.map((type, i) => {
          const meta = TALISMAN_META[type];
          return (
            <Link
              key={type}
              href={`/talisman/${type}`}
              className={`flex items-center gap-4 px-4 py-[14px] fade-up delay-${Math.min(i + 1, 3)} hover:opacity-85 transition-opacity`}
              style={{ background: meta.bg }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center shrink-0"
                style={{ border: `1px solid ${meta.accent}55` }}
              >
                <span className="font-serif text-[12px] leading-tight text-center" style={{ color: meta.accent }}>
                  {meta.headerChar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-[2px]">
                  <p className="text-[13px] font-medium" style={{ color: meta.accent }}>{meta.label}</p>
                  <span className="text-[10px] opacity-60" style={{ color: meta.accent }}>{meta.tag}</span>
                </div>
                <p className="text-[11px] opacity-55 truncate" style={{ color: meta.accent }}>{meta.desc}</p>
              </div>
              <span className="text-[18px] leading-none shrink-0 opacity-50" style={{ color: meta.accent }}>›</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
