import { NextRequest, NextResponse } from "next/server";
import { calcSaju, calcDayGanji } from "@/lib/saju";
import { buildCategoryPrompt } from "@/lib/prompt";
import { generateFortune } from "@/lib/claude";
import type { CategoryId } from "@/lib/categories";

export async function POST(req: NextRequest) {
  try {
    const { birthDate, birthHour, categoryId } = await req.json();

    if (!birthDate || !categoryId) {
      return NextResponse.json({ error: "필수 정보가 없습니다." }, { status: 400 });
    }

    const date = new Date(birthDate);
    const saju = calcSaju(date, Number(birthHour ?? 12));
    const todayGanji = calcDayGanji(new Date());
    const prompt = buildCategoryPrompt(categoryId as CategoryId, saju, todayGanji.gan, todayGanji.ji);

    const result = await generateFortune(prompt);
    const text = (result as unknown as { text: string }).text ?? result.totalLuck;

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[카테고리 운세 오류]", err);
    return NextResponse.json({ error: "운세 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
