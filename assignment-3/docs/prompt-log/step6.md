# 🔍 Step 6 — 서버 기반 상태 필터링

---

## [2026-06-18] 프롬프트 33

**요청:** plan.md의 Step 6 구현 요청.

**결과:** `backend/main.py`의 `GET /todos`에 `filter` 쿼리 파라미터(active/completed) 추가. `todos/page.tsx`에 `searchParams` 수신, 필터 탭 UI(전체/진행 중/완료), API 호출 시 filter 전달 구현. `docs/step6-log.md` 작성 완료.
