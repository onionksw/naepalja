import { NextRequest, NextResponse } from "next/server";
import { calcSaju, calcDayGanji } from "@/lib/saju";
import { buildFortunePrompt } from "@/lib/prompt";
import { generateFortune } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { birthDate, birthHour } = await req.json();

    if (!birthDate || birthHour === undefined) {
      return NextResponse.json({ error: "생년월일과 태어난 시간을 입력해주세요." }, { status: 400 });
    }

    const date = new Date(birthDate);
    const saju = calcSaju(date, Number(birthHour));

    const today = new Date();
    const todayGanji = calcDayGanji(today);
    const prompt = buildFortunePrompt(saju, todayGanji.gan, todayGanji.ji);

    const fortune = await generateFortune(prompt);

    return NextResponse.json({ saju, fortune });
  } catch (err) {
    console.error("[비회원 운세 오류]", err);
    return NextResponse.json({ error: "운세 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
