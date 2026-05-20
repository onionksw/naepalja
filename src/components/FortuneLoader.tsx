"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "사주를 천천히 들여다보는 중...",
  "오늘의 기운을 감지하는 중...",
  "하늘의 뜻을 읽고 있어요...",
  "운명의 실을 풀고 있어요...",
  "일진과 일주를 맞춰보는 중...",
  "잠시만요, 거의 다 됐어요...",
  "묵묵히 봐드리겠습니다...",
];

export default function FortuneLoader() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 1900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <div className="loader-bob">
        <SajuMasterSVG />
      </div>
      <p key={idx} className="text-[12px] text-[var(--muted)] text-center fade-in">
        {MESSAGES[idx]}
      </p>
    </div>
  );
}

function SajuMasterSVG() {
  return (
    <svg width="130" height="158" viewBox="0 0 130 158" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* 반짝이 */}
      <circle cx="14"  cy="22" r="2"   fill="#C9A84C" className="twinkle-1" />
      <circle cx="116" cy="18" r="1.5" fill="#C9A84C" className="twinkle-2" />
      <circle cx="120" cy="46" r="2"   fill="#C9A84C" className="twinkle-3" />
      <circle cx="10"  cy="54" r="1.5" fill="#C9A84C" className="twinkle-2" />
      <circle cx="22"  cy="72" r="1.5" fill="#C9A84C" className="twinkle-1" />

      {/* 갓 - 꼭대기 */}
      <circle cx="65" cy="20" r="4" fill="#17171A" />
      {/* 갓 - 모자 몸통 */}
      <rect x="49" y="21" width="32" height="28" rx="3" fill="#17171A" />
      {/* 갓 - 챙 */}
      <ellipse cx="65" cy="49" rx="46" ry="6" fill="#17171A" />

      {/* 얼굴 */}
      <circle cx="65" cy="68" r="20" fill="#F5F4F0" stroke="#17171A" strokeWidth="1.5" />

      {/* 눈썹 (집중) */}
      <path d="M 55 61 L 61 62.5" stroke="#17171A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 69 62.5 L 75 61" stroke="#17171A" strokeWidth="1.6" strokeLinecap="round" />

      {/* 눈 (아래 보는) */}
      <ellipse cx="58" cy="66" rx="2.4" ry="3" fill="#17171A" />
      <ellipse cx="72" cy="66" rx="2.4" ry="3" fill="#17171A" />

      {/* 입 (음... 표정) */}
      <path d="M 60 75 Q 65 73 70 75" stroke="#17171A" strokeWidth="1.5" strokeLinecap="round" />

      {/* 몸 - 도포 */}
      <path d="M 50 88 L 38 138 L 92 138 L 80 88 Q 65 84 50 88 Z" fill="#F5F4F0" stroke="#17171A" strokeWidth="1.5" />
      {/* 옷깃 */}
      <path d="M 65 88 L 60 106" stroke="#17171A" strokeWidth="1" opacity="0.3" />
      <path d="M 65 88 L 70 106" stroke="#17171A" strokeWidth="1" opacity="0.3" />

      {/* 왼팔 */}
      <path d="M 52 100 Q 36 112 28 125" stroke="#17171A" strokeWidth="3.5" strokeLinecap="round" />
      {/* 오른팔 */}
      <path d="M 78 100 Q 94 112 102 125" stroke="#17171A" strokeWidth="3.5" strokeLinecap="round" />

      {/* 족자 - 왼쪽 롤러 */}
      <rect x="16" y="118" width="10" height="36" rx="5" fill="#17171A" opacity="0.85" />
      {/* 족자 - 오른쪽 롤러 */}
      <rect x="104" y="118" width="10" height="36" rx="5" fill="#17171A" opacity="0.85" />
      {/* 족자 - 종이 */}
      <rect x="24" y="120" width="82" height="32" fill="#FFFEF9" stroke="#17171A" strokeWidth="1.2" />
      {/* 족자 - 글자 줄 */}
      <line x1="33" y1="129" x2="97" y2="129" stroke="#9E9EA8" strokeWidth="1.2" opacity="0.6" />
      <line x1="33" y1="135" x2="88" y2="135" stroke="#9E9EA8" strokeWidth="1.2" opacity="0.6" />
      <line x1="33" y1="141" x2="93" y2="141" stroke="#9E9EA8" strokeWidth="1.2" opacity="0.6" />
      {/* 족자 - 한자 흉내 */}
      <text x="37" y="130" fontSize="6" fill="#9E9EA8" opacity="0.45" fontFamily="serif">甲子乙丑丙寅丁卯</text>
      <text x="37" y="136" fontSize="6" fill="#9E9EA8" opacity="0.45" fontFamily="serif">戊辰己巳庚午辛未</text>
      <text x="37" y="142" fontSize="6" fill="#9E9EA8" opacity="0.45" fontFamily="serif">壬申癸酉甲戌乙亥</text>

    </svg>
  );
}
