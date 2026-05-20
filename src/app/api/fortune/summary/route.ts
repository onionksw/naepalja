import { NextRequest, NextResponse } from "next/server";
import { calcSaju, calcDayGanji } from "@/lib/saju";
import { buildSummaryPrompt } from "@/lib/prompt";
import { generateFortune } from "@/lib/claude";

const FALLBACK = { luckyColor: "하늘색", luckyNumber: "7", luckyItem: "열쇠", caution: "급한 결정" };

export async function POST(req: NextRequest) {
  try {
    const { birthDate, birthHour } = await req.json();
    if (!birthDate) return NextResponse.json(FALLBACK);

    const saju = calcSaju(new Date(birthDate), Number(birthHour ?? 12));
    const todayGanji = calcDayGanji(new Date());
    const prompt = buildSummaryPrompt(saju, todayGanji.gan, todayGanji.ji);
    const result = await generateFortune(prompt) as unknown as typeof FALLBACK;

    return NextResponse.json({
      luckyColor: result.luckyColor ?? FALLBACK.luckyColor,
      luckyNumber: result.luckyNumber ?? FALLBACK.luckyNumber,
      luckyItem:   result.luckyItem   ?? FALLBACK.luckyItem,
      caution:     result.caution     ?? FALLBACK.caution,
    });
  } catch (err) {
    console.error("[요약 운세 오류]", err);
    return NextResponse.json(FALLBACK);
  }
}
