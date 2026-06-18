# 🔎 Step 7 — 서버 기반 Todo 검색

---

## [2026-06-18] 프롬프트 34

**요청:** plan.md의 Step 7 구현 요청.

**결과:** `backend/main.py`의 `GET /todos`에 `search` 쿼리 파라미터(SQLAlchemy LIKE) 추가. `todos/SearchInput.tsx`(Client Component) 생성. `todos/page.tsx`에 search searchParam 수신, SearchInput 렌더링, 필터 탭에 search 보존, 검색 결과 표시 추가. `docs/step7-log.md` 작성 완료.
