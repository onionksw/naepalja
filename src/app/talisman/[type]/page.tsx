"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TALISMAN_META, type TalismanType } from "@/lib/talisman";
import type { SajuResult } from "@/lib/saju";
import type { CategoryId } from "@/lib/categories";

interface Profile {
  name?: string;
  birthDate: string;
  birthHour: number;
  saju: SajuResult;
  pinnedCategories: CategoryId[];
}

const TODAY_KEY = new Date().toISOString().slice(0, 10);
const TODAY_DISPLAY = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

function getCacheKey(type: TalismanType) {
  return type === "today"
    ? `fortune_talisman_today_${TODAY_KEY}`
    : `fortune_talisman_${type}`;
}

export default function TalismanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as TalismanType;
  const meta = TALISMAN_META[type];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [blessing, setBlessing] = useState<{ blessingTitle: string; blessingText: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!meta) { router.replace("/talisman"); return; }
    const raw = localStorage.getItem("naepalja_profile");
    if (!raw) { router.replace("/setup"); return; }
    const p: Profile = JSON.parse(raw);
    setProfile(p);

    const cached = localStorage.getItem(getCacheKey(type));
    if (cached) {
      setBlessing(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchBlessing(p);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  async function fetchBlessing(p: Profile) {
    setLoading(true);
    setDrawn(false);
    try {
      const res = await fetch("/api/talisman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: p.birthDate, birthHour: p.birthHour, type }),
      });
      const data = await res.json();
      localStorage.setItem(getCacheKey(type), JSON.stringify(data));
      setBlessing(data);
    } catch {
      setBlessing({ blessingTitle: "心想事成", blessingText: "모든 소원이 이루어지길 바랍니다" });
    } finally {
      setLoading(false);
    }
  }

  function handleRegenerate() {
    if (!profile) return;
    localStorage.removeItem(getCacheKey(type));
    setBlessing(null);
    fetchBlessing(profile);
  }

  useEffect(() => {
    if (!profile || !blessing || !canvasRef.current || loading) return;
    drawTalisman(canvasRef.current, profile.saju, blessing.blessingTitle, blessing.blessingText, meta);
    setDrawn(true);
  }, [profile, blessing, loading, meta]);

  async function handleDownload() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${meta.label}_${TODAY_KEY}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function handleShare() {
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `${meta.label}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: meta.label }); } catch { /* cancelled */ }
      } else {
        handleDownload();
      }
    }, "image/png");
  }

  if (!meta) return null;

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto px-5">
      <nav className="flex items-center justify-between py-5 shrink-0">
        <button onClick={() => router.back()} className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
          ← 뒤로
        </button>
        <button onClick={handleRegenerate} disabled={loading} className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors disabled:opacity-30">
          다시 만들기
        </button>
      </nav>

      <header className="pb-5 fade-up">
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase mb-1">{meta.tag}</p>
        <h1 className="font-serif font-light text-[1.75rem] text-[var(--fg)]">{meta.label}</h1>
      </header>

      <div className="flex-1 flex flex-col items-center gap-5 pb-20">
        {loading ? (
          <div className="w-full fade-up">
            <div className="skeleton w-full rounded-none" style={{ aspectRatio: "2/3" }} />
            <p className="text-[11px] text-[var(--muted)] text-center mt-4">부적을 만드는 중...</p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={600}
            height={900}
            className="w-full shadow-2xl fade-in"
          />
        )}

        {drawn && (
          <div className="flex gap-3 w-full fade-up">
            <button onClick={handleShare} className="flex-1 py-4 bg-[var(--fg)] text-[var(--bg)] text-[12px] tracking-[0.3em] hover:opacity-80 transition-opacity">
              공유하기
            </button>
            <button onClick={handleDownload} className="px-6 py-4 border border-[var(--line)] text-[var(--fg-soft)] text-[12px] tracking-[0.2em] hover:border-[var(--fg)] hover:text-[var(--fg)] transition-all">
              저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Canvas ──────────────────────────────────────────────────────────────────

function drawTalisman(
  canvas: HTMLCanvasElement,
  saju: SajuResult,
  blessingTitle: string,
  blessingText: string,
  meta: typeof TALISMAN_META[TalismanType],
) {
  const W = 600, H = 900;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const A = meta.accent;

  // Background
  ctx.fillStyle = meta.bg;
  ctx.fillRect(0, 0, W, H);

  // Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, W * 0.9);
  vig.addColorStop(0, "rgba(255,255,255,0.07)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Outer border
  ctx.strokeStyle = A;
  ctx.lineWidth = 5;
  ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, W - 64, H - 64);

  // Corner ornaments
  [
    [32, 32, 1, 1], [W - 32, 32, -1, 1],
    [32, H - 32, 1, -1], [W - 32, H - 32, -1, -1],
  ].forEach(([x, y, dx, dy]) => {
    ctx.strokeStyle = A;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 16); ctx.lineTo(x, y); ctx.lineTo(x + dx * 16, y);
    ctx.stroke();
    ctx.fillStyle = A;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();
  });

  // Side dots
  for (let i = 0; i < 8; i++) {
    const y = 120 + i * 85;
    ctx.fillStyle = A + "55";
    circle(ctx, 52, y, 2);
    circle(ctx, W - 52, y, 2);
  }

  // ── Header ─────────────────────────────────────────────
  ctx.fillStyle = A;
  ctx.font = "500 16px serif";
  ctx.textAlign = "center";
  ctx.fillText(`${meta.headerChar}  符  籙`, W / 2, 78);
  hline(ctx, 60, 96, W - 60, A + "55");

  // ── 사주 4주 ────────────────────────────────────────────
  const pillars = [
    { stem: "年", gan: saju.yearGan,  ji: saju.yearJi  },
    { stem: "月", gan: saju.monthGan, ji: saju.monthJi },
    { stem: "日", gan: saju.dayGan,   ji: saju.dayJi   },
    { stem: "時", gan: saju.hourGan,  ji: saju.hourJi  },
  ];
  const cellW = (W - 80) / 4;
  pillars.forEach((p, i) => {
    const cx = 40 + i * cellW + cellW / 2;
    ctx.fillStyle = A + "88";
    ctx.font = "12px serif";
    ctx.textAlign = "center";
    ctx.fillText(p.stem, cx, 130);
    ctx.fillStyle = A + "EE";
    ctx.font = "bold 64px serif";
    ctx.fillText(p.gan, cx, 200);
    ctx.fillText(p.ji, cx, 278);
  });

  hline(ctx, 60, 310, W - 60, A + "55");

  // ── Blessing Title (AI 4자) ─────────────────────────────
  const chars = blessingTitle.slice(0, 4).split("");
  const totalW = chars.length * 70;
  const startX = W / 2 - totalW / 2 + 35;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 62px serif";
  ctx.textAlign = "center";
  chars.forEach((ch, i) => ctx.fillText(ch, startX + i * 70, 390));

  // ── Blessing Text (Korean) ──────────────────────────────
  ctx.fillStyle = A + "CC";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(blessingText, W / 2, 430);

  hline(ctx, 60, 458, W - 60, A + "55");

  // ── Center motif (팔괘) ─────────────────────────────────
  bagua(ctx, W / 2, 570, 78, A, meta.bg);

  hline(ctx, 60, 660, W - 60, A + "55");

  // ── Footer ──────────────────────────────────────────────
  ctx.fillStyle = A;
  ctx.font = "500 14px serif";
  ctx.textAlign = "center";
  ctx.fillText("내팔자야", W / 2, 700);

  ctx.fillStyle = A + "88";
  ctx.font = "11px sans-serif";
  ctx.fillText(TODAY_DISPLAY, W / 2, 720);

  ctx.strokeStyle = A + "66";
  ctx.lineWidth = 1;
  ctx.strokeRect(W / 2 - 64, 736, 128, 32);
  ctx.fillStyle = A + "22";
  ctx.fillRect(W / 2 - 64, 736, 128, 32);
  ctx.fillStyle = A + "CC";
  ctx.font = "bold 11px serif";
  ctx.fillText("매일 아침 내 운명", W / 2, 757);
}

function hline(ctx: CanvasRenderingContext2D, x1: number, y: number, x2: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function bagua(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, bg: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = color + "33";
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2); ctx.stroke();

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 8;
    ctx.lineWidth = 1;
    ctx.strokeStyle = color + "AA";
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r * 0.65, cy + Math.sin(angle) * r * 0.65);
    ctx.lineTo(cx + Math.cos(angle) * r * 0.97, cy + Math.sin(angle) * r * 0.97);
    ctx.stroke();
  }

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const dist = r * 0.82;
    const bx = cx + Math.cos(angle) * dist;
    const by = cy + Math.sin(angle) * dist;
    const perp = angle + Math.PI / 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(bx + Math.cos(perp) * 10, by + Math.sin(perp) * 10);
    ctx.lineTo(bx - Math.cos(perp) * 10, by - Math.sin(perp) * 10);
    ctx.stroke();

    if (i % 2 === 1) {
      ctx.strokeStyle = bg;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx + Math.cos(perp) * 3, by + Math.sin(perp) * 3);
      ctx.lineTo(bx - Math.cos(perp) * 3, by - Math.sin(perp) * 3);
      ctx.stroke();
    }
  }

  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
}

