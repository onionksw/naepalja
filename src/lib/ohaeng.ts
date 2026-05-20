import type { SajuResult } from "./saju";

export type Element5 = "木" | "火" | "土" | "金" | "水";

interface CharInfo { element: Element5; yinYang: "양" | "음" }

const GAN: Record<string, CharInfo> = {
  甲: { element: "木", yinYang: "양" }, 乙: { element: "木", yinYang: "음" },
  丙: { element: "火", yinYang: "양" }, 丁: { element: "火", yinYang: "음" },
  戊: { element: "土", yinYang: "양" }, 己: { element: "土", yinYang: "음" },
  庚: { element: "金", yinYang: "양" }, 辛: { element: "金", yinYang: "음" },
  壬: { element: "水", yinYang: "양" }, 癸: { element: "水", yinYang: "음" },
};

const JI: Record<string, CharInfo> = {
  子: { element: "水", yinYang: "양" }, 丑: { element: "土", yinYang: "음" },
  寅: { element: "木", yinYang: "양" }, 卯: { element: "木", yinYang: "음" },
  辰: { element: "土", yinYang: "양" }, 巳: { element: "火", yinYang: "음" },
  午: { element: "火", yinYang: "양" }, 未: { element: "土", yinYang: "음" },
  申: { element: "金", yinYang: "양" }, 酉: { element: "金", yinYang: "음" },
  戌: { element: "土", yinYang: "양" }, 亥: { element: "水", yinYang: "음" },
};

export const ELEMENT_META: Record<Element5, {
  color: string; bg: string; label: string; keyword: string; strong: string; weak: string;
}> = {
  木: { color: "#2A7A4A", bg: "#E8F5EE", label: "목", keyword: "성장 · 진취",   strong: "추진력이 강하고 창의적이에요.",   weak: "의욕이 부족하거나 우유부단할 수 있어요." },
  火: { color: "#C0392B", bg: "#FDECEA", label: "화", keyword: "열정 · 표현",   strong: "활동적이고 카리스마가 넘쳐요.",    weak: "표현이 서툴거나 내성적일 수 있어요." },
  土: { color: "#A0522D", bg: "#F5EDE3", label: "토", keyword: "중용 · 안정",   strong: "신중하고 믿음직스러운 사람이에요.", weak: "중심을 잡기 어렵거나 변덕스러울 수 있어요." },
  金: { color: "#5D6D7E", bg: "#EAF0F6", label: "금", keyword: "결단 · 의지",   strong: "원칙적이고 단호한 결단력을 가졌어요.", weak: "의지가 약하거나 결정이 어려울 수 있어요." },
  水: { color: "#1A5276", bg: "#EAF2F8", label: "수", keyword: "지혜 · 유연",   strong: "총명하고 뛰어난 적응력을 가졌어요.", weak: "직관이 부족하거나 고집이 셀 수 있어요." },
};

export interface OhaengResult {
  counts: Record<Element5, number>;
  dominant: Element5[];
  lacking: Element5[];
  yinCount: number;
  yangCount: number;
  details: Array<{ char: string; element: Element5; yinYang: "양" | "음"; role: string }>;
}

export function calcOhaeng(saju: SajuResult): OhaengResult {
  const items = [
    { char: saju.yearGan,  role: "연간", info: GAN[saju.yearGan] },
    { char: saju.yearJi,   role: "연지", info: JI[saju.yearJi] },
    { char: saju.monthGan, role: "월간", info: GAN[saju.monthGan] },
    { char: saju.monthJi,  role: "월지", info: JI[saju.monthJi] },
    { char: saju.dayGan,   role: "일간", info: GAN[saju.dayGan] },
    { char: saju.dayJi,    role: "일지", info: JI[saju.dayJi] },
    { char: saju.hourGan,  role: "시간", info: GAN[saju.hourGan] },
    { char: saju.hourJi,   role: "시지", info: JI[saju.hourJi] },
  ];

  const counts: Record<Element5, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  let yinCount = 0, yangCount = 0;

  const details = items.filter(i => i.info).map(i => {
    counts[i.info.element]++;
    if (i.info.yinYang === "음") yinCount++; else yangCount++;
    return { char: i.char, element: i.info.element, yinYang: i.info.yinYang, role: i.role };
  });

  const vals = Object.values(counts);
  const max = Math.max(...vals);
  const dominant = (Object.keys(counts) as Element5[]).filter(e => counts[e] === max && max >= 3);
  const lacking  = (Object.keys(counts) as Element5[]).filter(e => counts[e] === 0);

  return { counts, dominant, lacking, yinCount, yangCount, details };
}
