import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface FortuneResult {
  totalLuck: string;
  workLuck: string;
  loveLuck: string;
  healthLuck: string;
  caution: string;
  luckyColor: string;
  luckyNumber: string;
  luckyItem: string;
}

const FALLBACK: FortuneResult = {
  totalLuck: "오늘은 차분히 내면을 돌아보는 하루가 될 것입니다.",
  workLuck: "꾸준함이 빛을 발하는 날입니다.",
  loveLuck: "소중한 인연에 감사하는 마음을 전해보세요.",
  healthLuck: "충분한 휴식이 최고의 보약입니다.",
  caution: "급한 결정은 잠시 미루세요.",
  luckyColor: "하늘색",
  luckyNumber: "7",
  luckyItem: "열쇠",
};

export type ChatTurn = { role: "user" | "model"; text: string };

export async function generateChatResponse(
  systemPrompt: string,
  history: ChatTurn[],
  userMessage: string,
): Promise<string> {
  try {
    const contents = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: "user" as const, parts: [{ text: userMessage }] },
    ];
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: { systemInstruction: systemPrompt },
      contents,
    });
    return response.text ?? "죄송합니다, 다시 시도해주세요.";
  } catch (err) {
    console.error("[채팅 API 오류]", err);
    return "잠시 후 다시 시도해주세요.";
  }
}

export async function generateFortune(prompt: string): Promise<FortuneResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) throw new Error("JSON 형식 응답 없음");

    return JSON.parse(jsonMatch[0]) as FortuneResult;
  } catch (err) {
    console.error("[Gemini API 오류]", err);
    return FALLBACK;
  }
}
