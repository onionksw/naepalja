import { NextRequest, NextResponse } from "next/server";
import { buildChatSystemPrompt } from "@/lib/prompt";
import { generateChatResponse } from "@/lib/claude";
import type { ChatTurn } from "@/lib/claude";
import type { SajuResult } from "@/lib/saju";

export async function POST(req: NextRequest) {
  try {
    const { saju, birthDate, history, message } = await req.json() as {
      saju: SajuResult;
      birthDate: string;
      history: ChatTurn[];
      message: string;
    };

    if (!message) return NextResponse.json({ error: "메시지 없음" }, { status: 400 });

    const systemPrompt = buildChatSystemPrompt(saju, birthDate);
    const text = await generateChatResponse(systemPrompt, history ?? [], message);

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[채팅 오류]", err);
    return NextResponse.json({ text: "잠시 후 다시 시도해주세요." });
  }
}
