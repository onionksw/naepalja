# 내팔자야 — 사주 웹앱 프로젝트

## 프로젝트 개요
AI 기반 사주명리 웹앱. 사용자의 생년월일시를 입력받아 사주팔자를 계산하고,
Claude AI가 매일 새로운 운세 해석을 자동 생성하여 제공하는 서비스.

## 핵심 컨셉
- 비회원도 1회 체험 가능 → 체험 후 회원가입 유도
- 신비롭고 고급스러운 프리미엄 UI/UX
- 매일 자정 스케줄러가 전체 회원 운세를 자동 생성 (Claude API 활용)

---

## 기술 스택

### 백엔드
- **프레임워크**: 전자정부표준프레임워크 (eGovFramework) 기반 또는 Spring Boot 3.x
- **언어**: Java 17
- **ORM**: MyBatis
- **DB**: MySQL 8.x
- **스케줄러**: Spring @Scheduled
- **HTTP 클라이언트**: RestTemplate (Claude API 호출용)
- **JSON 파싱**: Jackson ObjectMapper
- **빌드**: Maven

### 프론트엔드
- **템플릿 엔진**: Thymeleaf
- **스타일**: HTML5 + CSS3 (반응형, 모바일 우선)
- **스크립트**: Vanilla JavaScript (jQuery 최소화)
- **디자인 컨셉**: 검정 배경 + 골드 계열 포인트, 신비로운 분위기

### 외부 API
- **Claude API**: `claude-sonnet-4-5` 모델, POST /v1/messages
- **소셜 로그인**: 카카오 OAuth2, Google OAuth2 (추후)

---

## 디렉토리 구조

```
src/
├── main/
│   ├── java/com/naepalja/
│   │   ├── controller/
│   │   │   ├── MainController.java        # 랜딩, 비회원 체험
│   │   │   ├── UserController.java        # 회원가입, 로그인
│   │   │   ├── SajuController.java        # 사주 입력, 계산
│   │   │   └── FortuneController.java     # 운세 조회, 캘린더
│   │   ├── service/
│   │   │   ├── UserService.java
│   │   │   ├── SajuService.java           # 만세력 기반 사주 계산
│   │   │   ├── FortuneService.java        # 운세 생성 총괄
│   │   │   ├── ClaudeApiService.java      # Claude API 호출
│   │   │   └── SchedulerService.java      # 매일 자정 자동 생성
│   │   ├── mapper/
│   │   │   ├── UserMapper.java
│   │   │   ├── SajuMapper.java
│   │   │   ├── FortuneMapper.java
│   │   │   └── ManjuryokMapper.java
│   │   ├── vo/ (또는 dto/)
│   │   │   ├── UserVO.java
│   │   │   ├── SajuInfoVO.java
│   │   │   ├── DailyFortuneVO.java
│   │   │   └── FortuneResponseVO.java     # Claude API 응답 JSON 매핑
│   │   └── util/
│   │       ├── SajuPromptBuilder.java     # 프롬프트 조립 핵심 클래스
│   │       └── OhaengUtil.java            # 오행 관련 계산 유틸
│   ├── resources/
│   │   ├── mapper/                        # MyBatis XML
│   │   ├── static/
│   │   │   ├── css/style.css
│   │   │   └── js/main.js
│   │   └── templates/
│   │       ├── index.html                 # 랜딩
│   │       ├── saju/input.html            # 생년월일시 입력
│   │       ├── fortune/today.html         # 오늘의 운세
│   │       ├── fortune/calendar.html      # 운세 캘린더
│   │       └── user/login.html
```

---

## DB 테이블 구조

```sql
-- 회원
users (id, email, password, name, created_at)

-- 사주 정보 (8글자)
saju_info (
  user_id, birth_date, birth_time, gender, is_lunar,
  year_gan, year_ji, month_gan, month_ji,
  day_gan, day_ji, hour_gan, hour_ji
)

-- 일일 운세 (AI 생성 결과)
daily_fortune (
  id, user_id, fortune_date,
  total_luck, work_luck, love_luck, health_luck,
  caution, lucky_color, lucky_number, lucky_item,
  created_at
)

-- 만세력 (날짜 → 천간지지 변환)
manjuryok (
  solar_date, lunar_date,
  year_gan, year_ji, month_gan, month_ji, day_gan, day_ji
)

-- 사주 리포트 (최초 1회 생성)
saju_report (user_id, daymaster, ohaeng_score, yongsin, personality, created_at)
```

---

## Claude API 호출 방식

```java
// ClaudeApiService.java 핵심 로직
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: ${claude.api.key}
  anthropic-version: 2023-06-01
  content-type: application/json

Body:
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1500,
  "messages": [{"role": "user", "content": "<프롬프트>"}]
}

// 응답은 반드시 JSON으로 요청
// 파싱: response.content[0].text → ObjectMapper로 FortuneResponseVO에 매핑
```

---

## 운세 출력 항목 (8가지)
1. total_luck — 총운 (2~3문장)
2. work_luck — 직업·재물운
3. love_luck — 애정·인간관계운
4. health_luck — 건강운
5. caution — 오늘 조심할 것
6. lucky_color — 행운의 색상
7. lucky_number — 행운의 숫자
8. lucky_item — 행운의 물건

---

## 코딩 규칙 (반드시 준수)
- 한국어 주석 사용
- VO 클래스는 Lombok @Getter @Setter 사용
- 예외 처리: try-catch + 로그 출력 (log.error)
- MyBatis mapper XML은 resources/mapper/ 아래 위치
- 트랜잭션: @Transactional 서비스 레이어에 적용
- 비밀키(API Key)는 application.properties에서 @Value로 주입, 코드에 하드코딩 금지
- Claude API 응답 JSON 파싱 실패 시 fallback 처리 필수

---

## 개발 단계 (현재 진행 상황)
- [ ] Phase 1: DB 테이블 생성 + 만세력 로직
- [ ] Phase 2: 회원가입/로그인 + Claude API 연동
- [ ] Phase 3: 프론트엔드 (Thymeleaf 템플릿)
- [ ] Phase 4: 스케줄러 + 캘린더
- [ ] Phase 5: 고도화

---

## PM 참고사항
- 개발자가 Java/Spring에 익숙하지 않으므로 코드에 상세한 한국어 주석 필수
- MVC 구조 설명을 항상 포함할 것
- 복잡한 로직은 단계별로 나눠서 설명
- 에러 발생 시 원인과 해결책을 함께 제시
