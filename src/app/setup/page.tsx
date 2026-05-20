"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calcSaju } from "@/lib/saju";
import { DEFAULT_PINNED } from "@/lib/categories";

const BIRTH_HOURS = [
  { value: 0,  label: "자시", time: "23–01" },
  { value: 2,  label: "축시", time: "01–03" },
  { value: 4,  label: "인시", time: "03–05" },
  { value: 6,  label: "묘시", time: "05–07" },
  { value: 8,  label: "진시", time: "07–09" },
  { value: 10, label: "사시", time: "09–11" },
  { value: 12, label: "오시", time: "11–13" },
  { value: 14, label: "미시", time: "13–15" },
  { value: 16, label: "신시", time: "15–17" },
  { value: 18, label: "유시", time: "17–19" },
  { value: 20, label: "술시", time: "19–21" },
  { value: 22, label: "해시", time: "21–23" },
];

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthHour, setBirthHour] = useState<number | null>(null);
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<"M" | "F">("M");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) return;

    const date = new Date(birthDate);
    const hour = unknownTime ? 12 : (birthHour ?? 12);
    const saju = calcSaju(date, hour);

    localStorage.setItem("naepalja_profile", JSON.stringify({
      name: name.trim(), birthDate, birthHour: hour, gender, saju,
      pinnedCategories: DEFAULT_PINNED,
    }));

    router.push("/");
  }

  return (
    <main className="flex flex-col min-h-screen max-w-sm mx-auto px-6">
      <nav className="py-6">
        <span className="text-[11px] tracking-[0.4em] text-[var(--muted)] uppercase">내팔자야</span>
      </nav>

      <div className="flex-1 flex flex-col justify-center py-8 fade-up">
        <p className="text-[11px] tracking-[0.3em] text-[var(--muted)] uppercase mb-4">처음 시작하기</p>
        <h1 className="font-serif font-light text-[2rem] text-[var(--fg)] leading-snug mb-2">
          안녕하세요, 처음이시군요
        </h1>
        <p className="text-[12px] text-[var(--muted)] mb-10 leading-relaxed">
          한 번만 입력하면 매일 자동으로 운세를 확인할 수 있어요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-9">

          {/* 이름 */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase">이름</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="bg-transparent border-b border-[var(--line)] pb-3 text-[15px] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--fg)] transition-colors"
            />
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase">생년월일</label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={{ colorScheme: "light" }}
              className="bg-transparent border-b border-[var(--line)] pb-3 text-[15px] text-[var(--fg)] focus:outline-none focus:border-[var(--fg)] transition-colors"
            />
          </div>

          {/* 태어난 시간 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase">태어난 시간</label>
              <button
                type="button"
                onClick={() => { setUnknownTime(!unknownTime); setBirthHour(null); }}
                className={`text-[11px] transition-colors ${unknownTime ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}
              >
                {unknownTime ? "✓ 모름" : "모름"}
              </button>
            </div>
            {!unknownTime && (
              <div className="grid grid-cols-4 gap-2">
                {BIRTH_HOURS.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => setBirthHour(h.value)}
                    className={`flex flex-col items-center py-[10px] border transition-all duration-150 ${
                      birthHour === h.value
                        ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                        : "border-[var(--line)] text-[var(--fg-soft)] hover:border-[var(--fg-soft)]"
                    }`}
                  >
                    <span className="text-[12px] font-medium">{h.label}</span>
                    <span className={`text-[9px] mt-[1px] ${birthHour === h.value ? "opacity-60" : "text-[var(--muted)]"}`}>
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

          <button
            type="submit"
            disabled={!name.trim() || !birthDate || (!unknownTime && birthHour === null)}
            className="mt-2 py-4 bg-[var(--fg)] text-[var(--bg)] text-[12px] tracking-[0.3em] disabled:opacity-25 transition-opacity hover:opacity-80"
          >
            시작하기
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] text-[var(--muted)] leading-relaxed">
          입력하신 정보는 기기에만 저장되며<br />서버로 전송되지 않아요
        </p>
      </div>
    </main>
  );
}
