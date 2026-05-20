import { NextRequest, NextResponse } from "next/server";
import { calcSaju } from "@/lib/saju";
import { buildTalismanPrompt } from "@/lib/prompt";
import { generateFortune } from "@/lib/claude";
import type { TalismanType } from "@/lib/talisman";

export async function POST(req: NextRequest) {
  try {
    const { birthDate, birthHour, type } = await req.json();
    if (!birthDate || !type) return NextResponse.json({ error: "필수 정보 없음" }, { status: 400 });

    const saju = calcSaju(new Date(birthDate), Number(birthHour ?? 12));
    const prompt = buildTalismanPrompt(type as TalismanType, saju);
    const result = await generateFortune(prompt) as unknown as {
      blessingTitle: string;
      blessingText: string;
    };

    return NextResponse.json({
      blessingTitle: result.blessingTitle ?? "心想事成",
      blessingText:  result.blessingText  ?? "모든 소원이 이루어지길 바랍니다",
    });
  } catch (err) {
    console.error("[부적 오류]", err);
    return NextResponse.json({ blessingTitle: "心想事成", blessingText: "모든 소원이 이루어지길 바랍니다" });
  }
}
