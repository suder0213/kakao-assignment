# 📅 Step 8 — 주간 날짜 뷰 및 일별 Todo 관리

---

## [2026-06-21] 프롬프트 35

**요청:** plan.md에 Step 8(주간 날짜 뷰 + 일별 Todo) 추가 및 구현 요청.

**결과:** `backend/main.py`에 `date` 컬럼 추가, 런타임 마이그레이션, `GET /todos?date=`, `GET /todos/week-counts` 엔드포인트 추가. `todos/utils/date.ts` 유틸리티 생성. `WeekBar.tsx` Client Component 생성. `todos/page.tsx`에 date searchParam, 병렬 fetch, WeekBar 렌더링 추가. `new/page.tsx` Server Component 전환 + `NewTodoForm.tsx` 분리. `SearchInput.tsx`에 date 보존 추가. `docs/step8-log.md` 작성 완료.
