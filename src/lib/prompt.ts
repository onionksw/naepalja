import type { SajuResult } from "./saju";
import type { CategoryId } from "./categories";

const SAJU_CONTEXT = (saju: SajuResult, todayGan: string, todayJi: string) => `
사주팔자: ${saju.yearGan}${saju.yearJi}년 ${saju.monthGan}${saju.monthJi}월 ${saju.dayGan}${saju.dayJi}일 ${saju.hourGan}${saju.hourJi}시 (일간: ${saju.dayGan})
오늘 일진: ${todayGan}${todayJi}
`.trim();

// 모든 프롬프트에 공통 적용되는 말투 규칙
const PLAIN_LANGUAGE_RULE = `
말투 규칙 (반드시 지켜주세요):
- 한자나 사주 전문 용어를 절대 쓰지 마세요 (甲木, 癸水, 편인, 식신, 비겁, 상관, 정관, 편관, 인수, 비견, 겁재, 일간, 월지, 대운 등 금지)
- 사주 용어 대신 결과와 의미만 쉬운 말로 풀어주세요
- 예시: "癸수 편인의 영향으로" → "오늘은 직관력이 높아지는 날이라" 처럼 바꿔 쓰세요
- 누구나 바로 이해할 수 있는 일상적인 한국어로만 쓰세요`.trim();

const CATEGORY_PROMPTS: Record<CategoryId, string> = {
  total:   "오늘 하루 전체의 운세와 흐름을 2~3문장으로 해석해주세요.",
  work:    "오늘의 직업운과 재물운을 2~3문장으로 해석해주세요. 일의 성과, 직장 환경, 사업 흐름을 포함하세요.",
  love:    "오늘의 애정운과 연애운을 2~3문장으로 해석해주세요. 감정의 흐름과 관계 변화를 포함하세요.",
  health:  "오늘의 건강운을 2~3문장으로 해석해주세요. 몸과 마음 상태, 주의할 신체 부위를 포함하세요.",
  money:   "오늘의 금전운을 2~3문장으로 해석해주세요. 수입, 지출, 투자 타이밍을 포함하세요.",
  social:  "오늘의 대인관계운을 2~3문장으로 해석해주세요. 만남의 질, 갈등 가능성, 귀인 여부를 포함하세요.",
  study:   "오늘의 학업운을 2~3문장으로 해석해주세요. 집중력, 시험, 새로운 배움의 흐름을 포함하세요.",
  caution: "오늘 특별히 조심해야 할 사항을 2~3문장으로 알려주세요. 구체적이고 실용적으로 표현하세요.",
};

export type PeriodType = "week" | "month" | "season" | "year" | "nextyear";

import type { TalismanType } from "./talisman";

export function buildTalismanPrompt(type: TalismanType, saju: SajuResult): string {
  const purposeMap: Record<TalismanType, string> = {
    today:      "오늘 하루 종합적인 보호와 행운",
    protection: "액운 차단과 나쁜 기운으로부터 보호",
    wealth:     "재물과 금전운 상승",
    love:       "좋은 인연과 애정운 성취",
    health:     "건강 수호와 회복력 향상",
    exam:       "시험·취업·면접 합격과 목표 달성",
  };

  return `당신은 부적 전문 도사입니다.

사주팔자: ${saju.yearGan}${saju.yearJi}년 ${saju.monthGan}${saju.monthJi}월 ${saju.dayGan}${saju.dayJi}일 ${saju.hourGan}${saju.hourJi}시
부적 목적: ${purposeMap[type]}

이 사람의 사주에 어울리는 부적 문구를 만들어주세요.

반드시 아래 JSON 형식으로만 응답하세요:
- blessingTitle: 목적에 맞는 한자 정확히 4글자 (예: 萬事亨通, 財物大吉, 健康長壽, 良緣成就)
- blessingText: 이 부적의 효험을 한국어 한 줄로 (25자 이내, 따뜻하고 힘이 되는 문장)

{"blessingTitle":"한자4글자","blessingText":"한국어 한 줄"}`;
}

function getSeasonName(month: number) {
  if (month >= 3 && month <= 5) return "봄";
  if (month >= 6 && month <= 8) return "여름";
  if (month >= 9 && month <= 11) return "가을";
  return "겨울";
}

export function buildPeriodPrompt(period: PeriodType, saju: SajuResult): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;

  const ctxMap: Record<PeriodType, { label: string; ctx: string }> = {
    week:    { label: "이번 주",              ctx: `${y}년 ${m}월 ${Math.ceil(now.getDate() / 7)}주차` },
    month:   { label: "이번 달",              ctx: `${y}년 ${m}월` },
    season:  { label: `이번 ${getSeasonName(m)}`, ctx: `${y}년 ${getSeasonName(m)}` },
    year:    { label: "올해",                 ctx: `${y}년` },
    nextyear:{ label: "내년",                 ctx: `${y + 1}년` },
  };
  const { label, ctx } = ctxMap[period];

  return `당신은 사주명리 전문가입니다.

사주팔자: ${saju.yearGan}${saju.yearJi}년 ${saju.monthGan}${saju.monthJi}월 ${saju.dayGan}${saju.dayJi}일 ${saju.hourGan}${saju.hourJi}시 (일간: ${saju.dayGan})
기간: ${ctx}

${label} 전반적인 운세와 흐름을 3~4문장으로 해석해주세요.
총운, 대표 조언, 이 기간 특히 주의할 점을 포함하세요.

${PLAIN_LANGUAGE_RULE}

반드시 아래 JSON 형식으로만 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요.
친근하고 따뜻한 말투로, 부정적 내용은 완곡하게 표현하세요.

{"text": "운세 내용"}`;
}

export function buildChatSystemPrompt(saju: SajuResult, birthDate: string): string {
  return `당신은 내팔자야 서비스의 사주명리 상담 전문가입니다.
아래 사용자의 사주 정보를 바탕으로 질문에 답해주세요.

사주팔자: ${saju.yearGan}${saju.yearJi}년 ${saju.monthGan}${saju.monthJi}월 ${saju.dayGan}${saju.dayJi}일 ${saju.hourGan}${saju.hourJi}시
생년월일: ${birthDate}
일간(자신의 주인공): ${saju.dayGan}

규칙:
- 항상 사주 맥락을 바탕으로 답변하세요
- 친근하고 따뜻하게, 존댓말로 답변하세요
- 너무 단정짓지 말고 가능성으로 표현하세요
- 부정적 내용은 완곡하게, 조언 위주로 표현하세요
- 답변은 2~4문장 정도로 간결하게 해주세요
- AI임을 드러내지 마세요
${PLAIN_LANGUAGE_RULE}`;
}

export function buildSummaryPrompt(saju: SajuResult, todayGan: string, todayJi: string): string {
  return `당신은 사주명리 전문가입니다.

${SAJU_CONTEXT(saju, todayGan, todayJi)}

오늘의 행운 키워드를 짧게 뽑아주세요.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요.

{"luckyColor":"색상명 한 단어","luckyNumber":"숫자","luckyItem":"물건명 한 단어","caution":"두 단어 이내"}`;
}

export function buildCategoryPrompt(
  categoryId: CategoryId,
  saju: SajuResult,
  todayGan: string,
  todayJi: string,
): string {
  return `당신은 사주명리 전문가입니다. 아래 사주 정보를 바탕으로 운세를 해석해주세요.

${SAJU_CONTEXT(saju, todayGan, todayJi)}

${CATEGORY_PROMPTS[categoryId]}

${PLAIN_LANGUAGE_RULE}

반드시 아래 JSON 형식으로만 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요.
친근하고 따뜻한 말투로, 부정적 내용은 완곡하게 표현하세요.

{"text": "운세 내용"}`;
}
