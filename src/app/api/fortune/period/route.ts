import { NextRequest, NextResponse } from "next/server";
import { calcSaju } from "@/lib/saju";
import { buildPeriodPrompt, type PeriodType } from "@/lib/prompt";
import { generateFortune } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { birthDate, birthHour, period } = await req.json();
    if (!birthDate || !period) return NextResponse.json({ error: "필수 정보 없음" }, { status: 400 });

    const saju = calcSaju(new Date(birthDate), Number(birthHour ?? 12));
    const prompt = buildPeriodPrompt(period as PeriodType, saju);
    const result = await generateFortune(prompt);
    const text = (result as unknown as { text: string }).text ?? result.totalLuck;

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[기간 운세 오류]", err);
    return NextResponse.json({ error: "운세 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
