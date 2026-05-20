export type TalismanType = "today" | "protection" | "wealth" | "love" | "health" | "exam";

export const TALISMAN_META: Record<TalismanType, {
  label: string;
  tag: string;
  desc: string;
  bg: string;
  accent: string;
  headerChar: string;
}> = {
  today:      { label: "오늘의 부적",  tag: "오늘 맞춤",      desc: "오늘 운세를 담아 만드는 하루 부적",      bg: "#6B0E0E", accent: "#C9A84C", headerChar: "今日" },
  protection: { label: "보호 부적",    tag: "액운 차단",      desc: "나쁜 기운을 막고 평온함을 지켜줘요",      bg: "#3A0707", accent: "#FF8C42", headerChar: "護身" },
  wealth:     { label: "재물 부적",    tag: "금전운 상승",    desc: "재물이 들어오는 흐름을 열어줘요",          bg: "#0D2A0D", accent: "#FFD700", headerChar: "財物" },
  love:       { label: "애정 부적",    tag: "인연·연애운",    desc: "좋은 인연을 부르고 애정운을 높여줘요",     bg: "#35091C", accent: "#FFB7C5", headerChar: "良緣" },
  health:     { label: "건강 부적",    tag: "건강 수호",      desc: "몸과 마음을 지키는 건강 수호 부적",        bg: "#071B35", accent: "#7EC8E3", headerChar: "健康" },
  exam:       { label: "합격 부적",    tag: "시험·취업·면접", desc: "목표를 이루고 합격을 기원하는 부적",       bg: "#150935", accent: "#C8B8FF", headerChar: "合格" },
};

export const TALISMAN_ORDER: TalismanType[] = ["today", "protection", "wealth", "love", "health", "exam"];
