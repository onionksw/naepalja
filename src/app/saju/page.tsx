"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BIRTH_HOURS = [
  { value: 0,  label: "자시",  time: "23–01시" },
  { value: 2,  label: "축시",  time: "01–03시" },
  { value: 4,  label: "인시",  time: "03–05시" },
  { value: 6,  label: "묘시",  time: "05–07시" },
  { value: 8,  label: "진시",  time: "07–09시" },
  { value: 10, label: "사시",  time: "09–11시" },
  { value: 12, label: "오시",  time: "11–13시" },
  { value: 14, label: "미시",  time: "13–15시" },
  { value: 16, label: "신시",  time: "15–17시" },
  { value: 18, label: "유시",  time: "17–19시" },
  { value: 20, label: "술시",  time: "19–21시" },
  { value: 22, label: "해시",  time: "21–23시" },
];

export default function SajuPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState("");
  const [birthHour, setBirthHour] = useState<number | null>(null);
  const [gender, setGender] = useState<"M" | "F">("M");
  const [unknownTime, setUnknownTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/fortune/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate,
          birthHour: unknownTime ? 12 : (birthHour ?? 12),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      sessionStorage.setItem("fortune", JSON.stringify(data));
      router.push("/fortune");
    } catch (err) {
      setError(err instanceof Error ? err.message : "잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = birthDate && (unknownTime || birthHour !== null);

  return (
    <main className="flex flex-col min-h-screen max-w-sm mx-auto px-6">

      {/* 네비 */}
      <nav className="flex items-center justify-between py-6">
        <Link href="/" className="text-[11px] tracking-[0.4em] text-[var(--muted)] uppercase">
          내팔자야
        </Link>
      </nav>

      <div className="flex-1 flex flex-col justify-center py-10 animate-fade-up">

        <h1 className="font-serif font-light text-[2rem] text-[var(--fg)] leading-snug mb-12">
          언제<br />태어나셨나요?
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">

          {/* 생년월일 */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase">
              생년월일
            </label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="bg-transparent border-b border-[var(--line)] pb-3 text-[15px] text-[var(--fg)] focus:outline-none focus:border-[var(--fg)] transition-colors duration-200 w-full"
            />
          </div>

          {/* 태어난 시간 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase">
                태어난 시간
              </label>
              <button
                type="button"
                onClick={() => { setUnknownTime(!unknownTime); setBirthHour(null); }}
                className={`text-[10px] tracking-wide transition-colors ${unknownTime ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}
              >
                {unknownTime ? "✓ 모름" : "모름"}
              </button>
            </div>

            {!unknownTime && (
              <div className="grid grid-cols-4 gap-2 animate-fade-up">
                {BIRTH_HOURS.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => setBirthHour(h.value)}
                    className={`flex flex-col items-center py-3 text-center border transition-all duration-150 ${
                      birthHour === h.value
                        ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                        : "border-[var(--line)] text-[var(--fg-soft)] hover:border-[var(--fg-soft)]"
                    }`}
                  >
                    <span className="text-[12px] font-medium">{h.label}</span>
                    <span className={`text-[9px] mt-[2px] ${birthHour === h.value ? "text-[var(--bg)] opacity-60" : "text-[var(--muted)]"}`}>
                      {h.time}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 성별 */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase">성별</label>
            <div className="flex gap-3">
              {(["M", "F"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-3 text-[13px] border transition-all duration-150 ${
                    gender === g
                      ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                      : "border-[var(--line)] text-[var(--fg-soft)] hover:border-[var(--fg-soft)]"
                  }`}
                >
                  {g === "M" ? "남성" : "여성"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[12px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full py-4 bg-[var(--fg)] text-[var(--bg)] text-[12px] tracking-[0.3em] font-light disabled:opacity-25 transition-opacity hover:opacity-80 active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border border-[var(--bg)] border-t-transparent rounded-full animate-spin" />
                읽는 중
              </span>
            ) : "오늘 운세 보기"}
          </button>

        </form>
      </div>
    </main>
  );
}
