import type { SajuResult } from "./saju";
import type { CategoryId } from "./categories";
import type { TalismanType } from "./talisman";

// ── 천간 기본 정보 ──────────────────────────────────────────────────────────
const GAN_INFO: Record<string, { element: string; yinYang: string; desc: string }> = {
  "甲": { element: "木", yinYang: "양", desc: "봄 새싹의 기운. 강한 추진력과 독립심, 개척자 기질" },
  "乙": { element: "木", yinYang: "음", desc: "유연한 나무의 기운. 뛰어난 적응력과 협동심, 세심한 배려" },
  "丙": { element: "火", yinYang: "양", desc: "태양의 기운. 밝고 열정적인 카리스마, 뛰어난 표현력" },
  "丁": { element: "火", yinYang: "음", desc: "촛불의 기운. 따뜻한 집중력과 창의성, 예술적 감수성" },
  "戊": { element: "土", yinYang: "양", desc: "큰 산의 기운. 믿음직한 안정감과 포용력, 강한 인내심" },
  "己": { element: "土", yinYang: "음", desc: "비옥한 토지의 기운. 섬세한 현실 감각과 양육력" },
  "庚": { element: "金", yinYang: "양", desc: "강철의 기운. 단호한 결단력과 원칙, 강한 의지" },
  "辛": { element: "金", yinYang: "음", desc: "보석의 기운. 예리한 심미안과 완벽주의, 세련된 감각" },
  "壬": { element: "水", yinYang: "양", desc: "큰 강의 기운. 깊은 지혜와 통찰력, 유연한 포용력" },
  "癸": { element: "水", yinYang: "음", desc: "이슬·샘의 기운. 섬세한 직관력과 깊은 감수성" },
};

// ── 지지 오행 ───────────────────────────────────────────────────────────────
const JI_ELEMENT: Record<string, string> = {
  "子": "水", "丑": "土", "寅": "木", "卯": "木",
  "辰": "土", "巳": "火", "午": "火", "未": "土",
  "申": "金", "酉": "金", "戌": "土", "亥": "水",
};

// ── 오행 상생·상극 ──────────────────────────────────────────────────────────
const GENERATES: Record<string, string> = {
  "木": "火", "火": "土", "土": "金", "金": "水", "水": "木",
};
const CONTROLS: Record<string, string> = {
  "木": "土", "土": "水", "水": "火", "火": "金", "金": "木",
};

// 오행별 행운 속성
const ELEMENT_LUCKY: Record<string, { color: string; numbers: string; items: string }> = {
  "木": { color: "초록색",   numbers: "3·8", items: "나무·화분·책" },
  "火": { color: "빨간색",   numbers: "2·7", items: "초·붉은 물건·조명" },
  "土": { color: "황토색",   numbers: "5·0", items: "도자기·황토 소품·지갑" },
  "金": { color: "흰색",     numbers: "4·9", items: "금속 장식·시계·동전" },
  "水": { color: "파란색",   numbers: "1·6", items: "물·검정 소품·유리" },
};

// ── 핵심 유틸 ───────────────────────────────────────────────────────────────
function getElementRelation(from: string, to: string): string {
  if (from === to)           return "동일";
  if (GENERATES[from] === to) return "생(生)";   // from이 to를 생
  if (GENERATES[to] === from) return "피생(被生)"; // to가 from을 생
  if (CONTROLS[from] === to)  return "극(剋)";   // from이 to를 극
  if (CONTROLS[to] === from)  return "피극(被剋)"; // to가 from을 극
  return "무관";
}

function ganEffect(relation: string, todayGan: string, dayGan: string): string {
  const te = GAN_INFO[todayGan]?.element ?? "?";
  const de = GAN_INFO[dayGan]?.element  ?? "?";
  switch (relation) {
    case "피생(被生)": return `${te}이 ${de}을 도와줌 → 에너지 보충, 귀인 도움, 학습·정보 유리`;
    case "생(生)":     return `${de}이 ${te}으로 흘러감 → 표현·창작·활동·소비 에너지 강함`;
    case "피극(被剋)": return `${te}이 ${de}을 압박 → 외부 도전·긴장·경쟁, 신중 필요`;
    case "극(剋)":     return `${de}이 ${te}을 제어 → 주도적인 날, 재물·목표 관리 기회`;
    case "동일":       return `같은 기운의 날 → 동료·경쟁·협력 관계가 부각됨`;
    default:           return "중립적인 기운";
  }
}

// 오행 카운트
function countElements(saju: SajuResult): Record<string, number> {
  const counts: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  [
    GAN_INFO[saju.yearGan]?.element,  JI_ELEMENT[saju.yearJi],
    GAN_INFO[saju.monthGan]?.element, JI_ELEMENT[saju.monthJi],
    GAN_INFO[saju.dayGan]?.element,   JI_ELEMENT[saju.dayJi],
    GAN_INFO[saju.hourGan]?.element,  JI_ELEMENT[saju.hourJi],
  ].filter(Boolean).forEach(e => { if (e) counts[e]++; });
  return counts;
}

// ── 풍부한 사주 컨텍스트 빌더 ──────────────────────────────────────────────
function buildRichSajuContext(saju: SajuResult, todayGan: string, todayJi: string): string {
  const dayInfo = GAN_INFO[saju.dayGan] ?? { element: "?", yinYang: "?", desc: "" };
  const counts  = countElements(saju);

  const strong  = Object.keys(counts).filter(e => counts[e] >= 3).join("·") || "없음";
  const lacking = Object.keys(counts).filter(e => counts[e] === 0).join("·") || "없음";

  const todayGanElement = GAN_INFO[todayGan]?.element ?? "?";
  const todayJiElement  = JI_ELEMENT[todayJi] ?? "?";
  const ganRel          = getElementRelation(todayGanElement, dayInfo.element);
  const jiRel           = getElementRelation(todayJiElement, dayInfo.element);

  const jiEffectMap: Record<string, string> = {
    "피생(被生)": "지지 환경이 나를 지원하는 분위기",
    "생(生)":     "내 기운이 환경으로 흘러나가는 분위기",
    "피극(被剋)": "환경에서 압박이 오는 분위기",
    "극(剋)":     "내가 환경을 주도하는 분위기",
    "동일":       "같은 기운끼리 공명하는 분위기",
    "무관":       "중립적인 환경",
  };

  return `[사주 프로필]
일간(나): ${saju.dayGan}(${dayInfo.element}·${dayInfo.yinYang}) — ${dayInfo.desc}
사주팔자: 年${saju.yearGan}${saju.yearJi} 月${saju.monthGan}${saju.monthJi} 日${saju.dayGan}${saju.dayJi} 時${saju.hourGan}${saju.hourJi}

[오행 강약 분석]
木:${counts["木"]}개 火:${counts["火"]}개 土:${counts["土"]}개 金:${counts["金"]}개 水:${counts["水"]}개
과한 기운: ${strong} / 부족한 기운: ${lacking}
(과한 기운 → 해당 성향 과잉·충동적 / 부족한 기운 → 해당 영역 취약·보완 필요)

[오늘 일진: ${todayGan}${todayJi}]
天干 ${todayGan}(${todayGanElement}) × 일간 ${saju.dayGan}(${dayInfo.element}): ${ganEffect(ganRel, todayGan, saju.dayGan)}
地支 ${todayJi}(${todayJiElement}) 기운: ${jiEffectMap[jiRel] ?? "중립"}`;
}

// ── 출력 말투 규칙 ──────────────────────────────────────────────────────────
const PLAIN_LANGUAGE_RULE = `
출력 규칙 (반드시 준수):
- 사주 전문 용어(甲木·癸水·편인·식신·비겁·상관·정관·편관·인수·비견·겁재·일간·월지·대운 등) 절대 출력 금지
- 위 분석 결과를 바탕으로 하되, 결론만 쉬운 일상 한국어로 표현할 것
- 예: "오늘은 에너지가 외부로 활발하게 나가는 날이라" / "오늘은 은근한 압박이 있을 수 있어"
- 누구나 즉시 이해할 수 있는 친근하고 따뜻한 말투`.trim();

// ── 카테고리 운세 프롬프트 ──────────────────────────────────────────────────
export type PeriodType = "week" | "month" | "season" | "year" | "nextyear";

const CATEGORY_FOCUS: Record<CategoryId, string> = {
  total: `[해석 지침]
오늘 일진의 천간이 일간에게 미치는 영향(에너지 보충·표현·압박·주도 중 해당 것)을 중심으로
하루 전체의 흐름과 분위기를 2~3문장으로 해석하세요.`,

  work: `[해석 지침 — 직업·재물운]
사주명리에서 재물은 "일간이 통제하는 오행(재성)"과 관련됩니다.
- 오늘 일진이 재성 기운을 강화하는지 약화하는지 판단하세요
- 부족한 오행이 업무 집중력·성과에 미치는 영향을 반영하세요
- 2~3문장으로 직업 운세와 재물 흐름을 해석하세요`,

  love: `[해석 지침 — 애정운]
일간의 오행·음양 특성이 감정 표현 방식과 인연에 영향을 줍니다.
- 오늘 일진이 일간을 生(도움)하면 감정이 풍부하고 인연 기회가 있음
- 오늘 일진이 일간을 剋(압박)하면 감정 기복이나 긴장이 있을 수 있음
- 2~3문장으로 오늘의 애정·인연 흐름을 해석하세요`,

  health: `[해석 지침 — 건강운]
사주명리에서 체력과 건강은 "일간을 생해주는 오행(인성)"의 강약과 관련됩니다.
- 오늘 일진이 일간을 生하면 체력 회복, 剋하면 피로·면역 주의
- 과한 오행이 있으면 해당 장기(木=간·담, 火=심장, 土=위장, 金=폐, 水=신장)에 부담이 올 수 있음
- 2~3문장으로 몸과 마음 상태, 주의사항을 해석하세요`,

  money: `[해석 지침 — 금전운]
- 오늘 일진이 일간을 剋하는 날은 외부 지출 압박이 있을 수 있음
- 일간이 일진을 剋하는 날은 수입·재물 기회가 있음
- 부족한 오행의 행운 물건·숫자를 활용할 것을 조언에 담으세요
- 2~3문장으로 오늘의 금전 흐름과 투자 타이밍을 해석하세요`,

  social: `[해석 지침 — 대인관계운]
- 오늘 일진이 일간과 같은 오행이면 경쟁·협력 관계가 부각됨
- 일진이 일간을 生하면 귀인이 나타날 수 있음
- 일진이 일간을 剋하면 의견 충돌·갈등 조심
- 2~3문장으로 오늘의 인간관계 흐름과 주의 대상을 해석하세요`,

  study: `[해석 지침 — 학업운]
사주명리에서 학업·지식은 "일간을 생해주는 오행(인성)"과 관련됩니다.
- 오늘 일진이 인성 기운을 강화하면 집중력·암기력이 좋은 날
- 인성이 부족한 사주는 학습에 꾸준한 노력이 필요함을 반영하세요
- 2~3문장으로 오늘의 학업·집중력·시험 흐름을 해석하세요`,

  caution: `[해석 지침 — 주의사항]
- 오늘 일진이 일간을 剋(압박)하는 경우라면 가장 조심해야 할 구체적 상황을 명시하세요
- 과한 오행에서 오는 충동적 행동(木 과잉=조급함, 火 과잉=과열, 金 과잉=독단 등)을 경고하세요
- 부족한 오행 영역(해당 장기·감정)에서 오늘 특히 조심해야 할 점을 제시하세요
- 2~3문장, 실용적이고 구체적으로 작성하세요`,
};

export function buildCategoryPrompt(
  categoryId: CategoryId,
  saju: SajuResult,
  todayGan: string,
  todayJi: string,
): string {
  const context = buildRichSajuContext(saju, todayGan, todayJi);
  return `당신은 사주명리 전문가입니다. 아래 분석 데이터를 바탕으로 운세를 해석하세요.

${context}

${CATEGORY_FOCUS[categoryId]}

${PLAIN_LANGUAGE_RULE}

반드시 아래 JSON 형식으로만 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요.
친근하고 따뜻한 말투로, 부정적 내용은 완곡하게 표현하세요.

{"text": "운세 내용"}`;
}

// ── 오늘의 키워드 (요약) 프롬프트 ──────────────────────────────────────────
export function buildSummaryPrompt(saju: SajuResult, todayGan: string, todayJi: string): string {
  const context = buildRichSajuContext(saju, todayGan, todayJi);
  const counts  = countElements(saju);
  const lacking = Object.keys(counts).filter(e => counts[e] === 0);
  const dominant = Object.keys(counts).filter(e => counts[e] >= 3);

  // 행운 오행 = 부족한 오행이 있으면 그것, 없으면 일간을 생하는 오행
  const dayElement = GAN_INFO[saju.dayGan]?.element ?? "水";
  const luckyElement = lacking.length > 0
    ? lacking[0]
    : (Object.keys(GENERATES).find(k => GENERATES[k] === dayElement) ?? dayElement);

  const lucky = ELEMENT_LUCKY[luckyElement] ?? ELEMENT_LUCKY["水"];

  // 주의 오행 = 과한 오행이 일간을 극하면 그 관계
  const cautionHint = dominant.length > 0 && CONTROLS[dominant[0]] === dayElement
    ? "과한 " + dominant[0] + " 기운으로 인한 과욕·충동 주의"
    : "오늘 일진의 압박에 주의";

  return `당신은 사주명리 전문가입니다.

${context}

오늘의 행운 키워드를 추출하세요.

추출 기준:
- luckyColor: 부족한 오행(${lacking.join("·") || "없음"})을 보완하는 색상 → 추천색: ${lucky.color}
- luckyNumber: 해당 오행 배속 수 → 추천: ${lucky.numbers} 중 하나
- luckyItem: 부족한 오행을 상징하는 물건 → 추천군: ${lucky.items} 중 하나
- caution: ${cautionHint} (두 단어 이내로 압축)

위 추천을 기반으로 오늘 일진과 사주 상황에 가장 잘 맞는 값을 선택하세요.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요.
{"luckyColor":"색상 한 단어","luckyNumber":"숫자","luckyItem":"물건 한 단어","caution":"두 단어 이내"}`;
}

// ── 기간운 프롬프트 ─────────────────────────────────────────────────────────
function getSeasonName(month: number) {
  if (month >= 3 && month <= 5) return "봄";
  if (month >= 6 && month <= 8) return "여름";
  if (month >= 9 && month <= 11) return "가을";
  return "겨울";
}

// 계절별 왕성한 오행
const SEASON_ELEMENT: Record<string, string> = {
  봄: "木", 여름: "火", 가을: "金", 겨울: "水",
};

export function buildPeriodPrompt(period: PeriodType, saju: SajuResult): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const season = getSeasonName(m);
  const seasonElement = SEASON_ELEMENT[season];
  const dayInfo = GAN_INFO[saju.dayGan] ?? { element: "?", yinYang: "?", desc: "" };
  const counts  = countElements(saju);
  const lacking = Object.keys(counts).filter(e => counts[e] === 0).join("·") || "없음";
  const strong  = Object.keys(counts).filter(e => counts[e] >= 3).join("·") || "없음";

  const seasonEffect = getElementRelation(seasonElement, dayInfo.element);
  const seasonDesc = {
    "피생(被生)": `현재 계절(${season}·${seasonElement})이 일간을 도와주는 시기`,
    "생(生)":     `일간의 기운이 계절 에너지로 활발히 나가는 시기`,
    "피극(被剋)": `계절 기운(${seasonElement})이 일간을 압박하는 시기, 체력·의지 관리 중요`,
    "극(剋)":     `일간이 계절 기운을 주도하는 시기, 적극적 행동 유리`,
    "동일":       `일간과 같은 계절 기운, 강한 에너지지만 과잉 주의`,
  }[seasonEffect] ?? "중립적 계절";

  const ctxMap: Record<PeriodType, { label: string; ctx: string }> = {
    week:     { label: "이번 주",              ctx: `${y}년 ${m}월 ${Math.ceil(now.getDate() / 7)}주차` },
    month:    { label: "이번 달",              ctx: `${y}년 ${m}월` },
    season:   { label: `이번 ${season}`,       ctx: `${y}년 ${season}` },
    year:     { label: "올해",                 ctx: `${y}년` },
    nextyear: { label: "내년",                 ctx: `${y + 1}년` },
  };
  const { label, ctx } = ctxMap[period];

  return `당신은 사주명리 전문가입니다.

[사주 프로필]
일간(나): ${saju.dayGan}(${dayInfo.element}·${dayInfo.yinYang}) — ${dayInfo.desc}
사주팔자: 年${saju.yearGan}${saju.yearJi} 月${saju.monthGan}${saju.monthJi} 日${saju.dayGan}${saju.dayJi} 時${saju.hourGan}${saju.hourJi}
오행분포: 木${counts["木"]} 火${counts["火"]} 土${counts["土"]} 金${counts["金"]} 水${counts["水"]}
과한 기운: ${strong} / 부족한 기운: ${lacking}

[기간 컨텍스트]
기간: ${ctx} (${label})
현재 계절: ${season}(${seasonElement}) — ${seasonDesc}

[해석 지침]
위 일간의 특성과 오행 강약, 계절 기운의 상호작용을 바탕으로
${label} 전반적인 흐름과 기회·주의사항을 3~4문장으로 해석하세요.
총운, 핵심 조언, 이 기간 특히 보완해야 할 점을 포함하세요.

${PLAIN_LANGUAGE_RULE}

반드시 아래 JSON 형식으로만 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요.
친근하고 따뜻한 말투로, 부정적 내용은 완곡하게 표현하세요.

{"text": "운세 내용"}`;
}

// ── 부적 프롬프트 ───────────────────────────────────────────────────────────
export function buildTalismanPrompt(type: TalismanType, saju: SajuResult): string {
  const dayInfo = GAN_INFO[saju.dayGan] ?? { element: "?", yinYang: "?", desc: "" };
  const counts  = countElements(saju);
  const lacking = Object.keys(counts).filter(e => counts[e] === 0).join("·") || "없음";

  const purposeMap: Record<TalismanType, string> = {
    today:      "오늘 하루 전체적인 보호와 행운",
    protection: "액운 차단과 나쁜 기운으로부터 보호",
    wealth:     "재물과 금전운 상승",
    love:       "좋은 인연과 애정운 성취",
    health:     "건강 수호와 회복력 향상",
    exam:       "시험·취업·면접 합격과 목표 달성",
  };

  return `당신은 사주명리 부적 전문 도사입니다.

[사주 분석]
일간: ${saju.dayGan}(${dayInfo.element}·${dayInfo.yinYang}) — ${dayInfo.desc}
사주팔자: ${saju.yearGan}${saju.yearJi}년 ${saju.monthGan}${saju.monthJi}월 ${saju.dayGan}${saju.dayJi}일 ${saju.hourGan}${saju.hourJi}시
부족한 기운: ${lacking} (부적이 보완해야 할 방향)
부적 목적: ${purposeMap[type]}

[부적 문구 작성 기준]
- blessingTitle: 부족한 기운(${lacking})과 목적에 맞는 한자 정확히 4글자
  예시: 財物大吉(재물), 萬事亨通(총운), 健康長壽(건강), 良緣成就(인연), 登科及第(합격), 百邪不侵(보호)
- blessingText: 이 사주에 맞춰 부족한 기운을 채워주는 효험을 한국어 한 줄로 (25자 이내, 따뜻하고 힘이 되는 문장)

반드시 아래 JSON 형식으로만 응답하세요:
{"blessingTitle":"한자4글자","blessingText":"한국어 한 줄"}`;
}

// ── AI 상담 챗봇 시스템 프롬프트 ───────────────────────────────────────────
export function buildChatSystemPrompt(saju: SajuResult, birthDate: string): string {
  const dayInfo = GAN_INFO[saju.dayGan] ?? { element: "?", yinYang: "?", desc: "" };
  const counts  = countElements(saju);
  const lacking = Object.keys(counts).filter(e => counts[e] === 0).join("·") || "없음";
  const strong  = Object.keys(counts).filter(e => counts[e] >= 3).join("·") || "없음";

  return `당신은 내팔자야 서비스의 사주명리 상담 전문가입니다.

[상담 대상자 사주]
일간: ${saju.dayGan}(${dayInfo.element}·${dayInfo.yinYang}) — ${dayInfo.desc}
사주팔자: ${saju.yearGan}${saju.yearJi}년 ${saju.monthGan}${saju.monthJi}월 ${saju.dayGan}${saju.dayJi}일 ${saju.hourGan}${saju.hourJi}시
생년월일: ${birthDate}
오행분포: 木${counts["木"]} 火${counts["火"]} 土${counts["土"]} 金${counts["金"]} 水${counts["水"]}
강한 기운: ${strong} / 부족한 기운: ${lacking}

[상담 지침]
- 위 사주 분석을 바탕으로 질문에 답변하세요
- 사주 이론(오행 강약, 일간 특성, 계절 기운 등)을 내부 논리로 활용하되 결론은 쉬운 말로
- 친근하고 따뜻하게, 존댓말로 답변하세요
- 너무 단정짓지 말고 가능성으로 표현하세요
- 부정적 내용은 완곡하게, 조언 위주로 표현하세요
- 답변은 2~4문장 정도로 간결하게 해주세요
${PLAIN_LANGUAGE_RULE}`;
}
