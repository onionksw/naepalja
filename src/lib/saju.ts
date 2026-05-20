// 천간 (10개)
export const GAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
// 지지 (12개)
export const JI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

// 시간대별 시주 지지 (자시~해시)
const HOUR_JI = [
  { label: "자시", range: [23, 1], ji: "자" },
  { label: "축시", range: [1, 3],  ji: "축" },
  { label: "인시", range: [3, 5],  ji: "인" },
  { label: "묘시", range: [5, 7],  ji: "묘" },
  { label: "진시", range: [7, 9],  ji: "진" },
  { label: "사시", range: [9, 11], ji: "사" },
  { label: "오시", range: [11, 13],ji: "오" },
  { label: "미시", range: [13, 15],ji: "미" },
  { label: "신시", range: [15, 17],ji: "신" },
  { label: "유시", range: [17, 19],ji: "유" },
  { label: "술시", range: [19, 21],ji: "술" },
  { label: "해시", range: [21, 23],ji: "해" },
];

// 일간 기준 시간 천간 조견표
const HOUR_GAN_TABLE: Record<string, string[]> = {
  갑: ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계", "갑", "을"],
  을: ["병", "정", "무", "기", "경", "신", "임", "계", "갑", "을", "병", "정"],
  병: ["무", "기", "경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"],
  정: ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기", "경", "신"],
  무: ["임", "계", "갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"],
  기: ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계", "갑", "을"],
  경: ["병", "정", "무", "기", "경", "신", "임", "계", "갑", "을", "병", "정"],
  신: ["무", "기", "경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"],
  임: ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기", "경", "신"],
  계: ["임", "계", "갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"],
};

export interface SajuResult {
  yearGan: string; yearJi: string;
  monthGan: string; monthJi: string;
  dayGan: string; dayJi: string;
  hourGan: string; hourJi: string;
}

// 양력 날짜 기준 일진 계산 (갑자일 = 1900-01-01 기준)
export function calcDayGanji(date: Date): { gan: string; ji: string } {
  const BASE = new Date(1900, 0, 1); // 갑자일
  const diff = Math.floor((date.getTime() - BASE.getTime()) / 86400000);
  const ganIdx = ((diff % 10) + 10) % 10;
  const jiIdx  = ((diff % 12) + 12) % 12;
  return { gan: GAN[ganIdx], ji: JI[jiIdx] };
}

// 시주 계산
export function calcHourGanji(hour: number, dayGan: string): { gan: string; ji: string } {
  const jiIdx = HOUR_JI.findIndex(({ range }) =>
    range[0] < range[1]
      ? hour >= range[0] && hour < range[1]
      : hour >= range[0] || hour < range[1]
  );
  const safeIdx = jiIdx === -1 ? 0 : jiIdx;
  const ganList = HOUR_GAN_TABLE[dayGan] ?? HOUR_GAN_TABLE["갑"];
  return { gan: ganList[safeIdx], ji: HOUR_JI[safeIdx].ji };
}

// 만세력 없이 연/월주 근사 계산 (DB에 만세력 있으면 DB 우선 사용)
export function calcYearGanji(year: number): { gan: string; ji: string } {
  const ganIdx = ((year - 4) % 10 + 10) % 10;
  const jiIdx  = ((year - 4) % 12 + 12) % 12;
  return { gan: GAN[ganIdx], ji: JI[jiIdx] };
}

export function calcMonthGanji(year: number, month: number): { gan: string; ji: string } {
  const total = year * 12 + (month - 1);
  const ganIdx = ((total - 2) % 10 + 10) % 10;
  const jiIdx  = ((month + 1) % 12 + 12) % 12;
  return { gan: GAN[ganIdx], ji: JI[jiIdx] };
}

export function calcSaju(
  birthDate: Date,
  birthHour: number,
): SajuResult {
  const year  = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;

  const yearGanji  = calcYearGanji(year);
  const monthGanji = calcMonthGanji(year, month);
  const dayGanji   = calcDayGanji(birthDate);
  const hourGanji  = calcHourGanji(birthHour, dayGanji.gan);

  return {
    yearGan: yearGanji.gan, yearJi: yearGanji.ji,
    monthGan: monthGanji.gan, monthJi: monthGanji.ji,
    dayGan: dayGanji.gan, dayJi: dayGanji.ji,
    hourGan: hourGanji.gan, hourJi: hourGanji.ji,
  };
}
