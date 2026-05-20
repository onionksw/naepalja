export const CATEGORIES = [
  { id: "total",   label: "오늘의 운세",  desc: "하루 전체의 흐름" },
  { id: "work",    label: "직업 · 재물",  desc: "일과 돈의 흐름" },
  { id: "love",    label: "애정 · 연애",  desc: "관계와 감정" },
  { id: "health",  label: "건강",         desc: "몸과 마음의 상태" },
  { id: "money",   label: "금전운",       desc: "재물과 지출" },
  { id: "social",  label: "대인관계",     desc: "사람과의 인연" },
  { id: "study",   label: "학업운",       desc: "공부와 성장" },
  { id: "caution", label: "오늘의 주의",  desc: "조심할 것들" },
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

export const DEFAULT_PINNED: CategoryId[] = ["total", "love", "work"];
