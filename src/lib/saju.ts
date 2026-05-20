// 천간 (10개) — 한자
export const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
// 지지 (12개) — 한자
export const JI  = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 시간대별 시주 지지
const HOUR_JI = [
  { label: "자시", range: [23, 1], ji: "子" },
  { label: "축시", range: [1,  3], ji: "丑" },
  { label: "인시", range: [3,  5], ji: "寅" },
  { label: "묘시", range: [5,  7], ji: "卯" },
  { label: "진시", range: [7,  9], ji: "辰" },
  { label: "사시", range: [9,  11], ji: "巳" },
  { label: "오시", range: [11, 13], ji: "午" },
  { label: "미시", range: [13, 15], ji: "未" },
  { label: "신시", range: [15, 17], ji: "申" },
  { label: "유시", range: [17, 19], ji: "酉" },
  { label: "술시", range: [19, 21], ji: "戌" },
  { label: "해시", range: [21, 23], ji: "亥" },
];

// 일간 기준 시간 천간 조견표 (한자 키)
const HOUR_GAN_TABLE: Record<string, string[]> = {
  甲: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
  乙: ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
  丙: ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
  丁: ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
  戊: ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
  己: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
  庚: ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
  辛: ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
  壬: ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
  癸: ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
};

export interface SajuResult {
  yearGan: string; yearJi: string;
  monthGan: string; monthJi: string;
  dayGan: string; dayJi: string;
  hourGan: string; hourJi: string;
}

export function calcDayGanji(date: Date): { gan: string; ji: string } {
  const BASE = new Date(1900, 0, 1); // 甲子일 기준
  const diff = Math.floor((date.getTime() - BASE.getTime()) / 86400000);
  const ganIdx = ((diff % 10) + 10) % 10;
  const jiIdx  = ((diff % 12) + 12) % 12;
  return { gan: GAN[ganIdx], ji: JI[jiIdx] };
}

export function calcHourGanji(hour: number, dayGan: string): { gan: string; ji: string } {
  const jiIdx = HOUR_JI.findIndex(({ range }) =>
    range[0] < range[1]
      ? hour >= range[0] && hour < range[1]
      : hour >= range[0] || hour < range[1]
  );
  const safeIdx = jiIdx === -1 ? 0 : jiIdx;
  const ganList = HOUR_GAN_TABLE[dayGan] ?? HOUR_GAN_TABLE["甲"];
  return { gan: ganList[safeIdx], ji: HOUR_JI[safeIdx].ji };
}

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

export function calcSaju(birthDate: Date, birthHour: number): SajuResult {
  const year  = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;

  const yearGanji  = calcYearGanji(year);
  const monthGanji = calcMonthGanji(year, month);
  const dayGanji   = calcDayGanji(birthDate);
  const hourGanji  = calcHourGanji(birthHour, dayGanji.gan);

  return {
    yearGan: yearGanji.gan,   yearJi: yearGanji.ji,
    monthGan: monthGanji.gan, monthJi: monthGanji.ji,
    dayGan: dayGanji.gan,     dayJi: dayGanji.ji,
    hourGan: hourGanji.gan,   hourJi: hourGanji.ji,
  };
}
