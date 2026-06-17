# 🖥️ Step 1 — 프론트엔드 프로젝트 세팅

---

## [2026-06-17] 프롬프트 12

**요청:** plan.md의 Step 1 구현 요청.

**결과:** `npm run dev` 실행 후 `localhost:3000` HTTP 200 응답 확인. `docs/step1-log.md` 작성 완료.

---

## [2026-06-17] 프롬프트 13

**요청:** `npm run dev`가 무엇을 하는지, 실행 조건이 무엇인지 설명 요청.

**결과:** `npm run dev` → `next dev` 동작 원리(개발 서버, HMR, SSR, 타입 체크), scripts 명령어 비교, 실행 조건 3가지 설명.

---

## [2026-06-17] 프롬프트 14

**요청:** `npm install`을 한 적 없는데 `node_modules/`가 있는 이유 질문. 질문 시 자동으로 트러블슈팅에 추가하도록 CLAUDE.md 수정 요청.

**결과:** `create-next-app`이 내부적으로 `npm install`을 자동 실행함을 설명. `CLAUDE.md` 트러블슈팅 규칙에 질문도 기록 대상으로 추가. `troubleshooting/step1.md` 생성 및 기록.

---

## [2026-06-17] 프롬프트 15

**요청:** 백그라운드 서버가 어디서 돌고 있는지, Claude가 자체 터미널을 가지고 있는지 질문.

**결과:** Claude 샌드박스 터미널 구조 설명. 세션 종료 시 서버도 꺼지므로 VS Code 터미널에서 직접 실행 권장. `troubleshooting/step1.md`에 항목 추가.

---

## [2026-06-17] 프롬프트 16

**요청:** VS Code 터미널에서 `npm run dev` 실행 시 "Another next dev server is already running" 오류 발생.

**결과:** Claude 샌드박스 서버가 포트 3000 점유 중임을 확인. `taskkill /PID 31604 /F` 후 재실행 안내. `troubleshooting/step1.md`에 항목 추가.
