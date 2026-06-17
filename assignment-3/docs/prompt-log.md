# 프롬프트 로그

## [2026-06-17] 프롬프트 1

**요청:** assignment-3 구현 계획을 docs 아래에 작성해달라.

**결과:** `docs/plan.md` 생성. Step 0~7 단계별 작업 목록·완료 기준·문서화 계획과 React(assignment-2) 대비 차이 비교표 포함.

---

## [2026-06-17] 프롬프트 2

**요청:** 모든 프롬프트를 기록하고 결과를 요약하는 문서, 트러블슈팅 자동화를 위한 CLAUDE.md 작성 요청.

**결과:** `CLAUDE.md` 생성. 프롬프트 로그(`docs/prompt-log.md`) 및 트러블슈팅(`docs/troubleshooting.md`) 자동 작성 규칙, 일반 개발 규칙 포함. `docs/prompt-log.md` 초기 파일 생성.

---

## [2026-06-17] 프롬프트 3

**요청:** 계획 문서 검토 중 생긴 5가지 아키텍처 의문(venv 이유, new 페이지 구조, 서버+클라이언트 혼합, error.tsx 클라이언트 이유, API Route 노출 여부)에 대한 답변 및 트러블슈팅 문서 추가 요청.

**결과:** 각 질문에 답변 후 `docs/troubleshooting.md` 생성. 5개 항목(venv, new 페이지, 혼합 컴포넌트 구조, Error Boundary, API Route vs Server Actions) 추가.

---

## [2026-06-17] 프롬프트 4

**요청:** `[todoId]/page.tsx`와 `EditTodoForm.tsx`가 브라우저에 HTML로 각각 전달되는지 확인.

**결과:** 둘 다 서버에서 HTML로 렌더링되어 하나의 초기 응답에 포함됨을 설명. Client Component는 추가로 JS 번들(hydration용)이 전송되는 구조. `troubleshooting.md`의 관련 항목 보완.
