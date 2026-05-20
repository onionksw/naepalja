# 내팔자야 — 사주 웹앱

> **슬로건: 매일 아침, 내 운명을 먼저 읽어**

## 기술 스택
- **Next.js 15** (App Router, Turbopack) · TypeScript · Tailwind CSS v4
- **AI**: Google Gemini (`gemini-2.5-flash`) via `@google/genai`
- **상태**: localStorage (프로필 + 날짜별 캐시) — DB 없음

## 핵심 규칙
- API 키는 절대 클라이언트 코드에 노출 금지 → `.env.local`에서만 관리
- 모든 AI 호출은 `src/app/api/` Route Handler에서만 수행
- 운세 캐시 키 형식: `fortune_*_YYYY-MM-DD` (하루 1회 갱신)
- `PLAIN_LANGUAGE_RULE` — 사주 한자·전문용어 출력 금지 (prompt.ts 참고)

## 주요 경로
| 경로 | 설명 |
|------|------|
| `/` | 메인 대시보드 (키워드 칩 + 카테고리) |
| `/setup` | 최초 정보 입력 (이름·생년월일·시간) |
| `/fortune/[categoryId]` | 카테고리별 오늘 운세 상세 |
| `/period` | 기간운 선택 메뉴 |
| `/period/[type]` | 주·월·계절·연·내년 운세 |
| `/talisman` | 부적 선택 메뉴 |
| `/talisman/[type]` | Canvas 부적 생성·저장·공유 |
| `/chat` | AI 사주 상담 챗봇 |
| `/mypage` | 음양오행 분석 + 사주 정보 |

## 코딩 규칙
- TypeScript strict 모드
- Claude API 응답 JSON 파싱 실패 시 fallback 처리 필수
- 에러는 콘솔 출력 후 사용자에게 친절한 메시지 반환
