# 📅 Step 8 — 주간 날짜 뷰 및 일별 Todo 관리

## 구현 내용

### 생성 파일

| 파일 | 역할 |
|---|---|
| `frontend/app/todos/utils/date.ts` | 날짜 유틸리티 함수 모음 |
| `frontend/app/todos/WeekBar.tsx` | 주간 날짜 네비게이터 Client Component |
| `frontend/app/todos/new/NewTodoForm.tsx` | 새 Todo 입력 폼 Client Component (page.tsx에서 분리) |

### 수정 파일

| 파일 | 변경 내용 |
|---|---|
| `backend/main.py` | `date` 컬럼 추가, 런타임 마이그레이션, `GET /todos`에 date 파라미터, `GET /todos/week-counts` 신규, `POST /todos`에 date 수신 |
| `frontend/app/todos/page.tsx` | `date` searchParam 추가, `getTodos`/`getWeekCounts` 병렬 호출, WeekBar 렌더링, 필터 탭·검색·"새 할 일" 링크에 date 보존 |
| `frontend/app/todos/new/page.tsx` | Server Component로 전환: `searchParams.date` 읽어 `NewTodoForm`에 전달 |
| `frontend/app/todos/SearchInput.tsx` | 검색 시 date 파라미터 보존 |

---

## 핵심 흐름

```
URL: /todos?date=2026-06-21&filter=active
  └─ Server Component(page.tsx)
       ├─ Promise.all([
       │    getTodos(filter, search, "2026-06-21") → FastAPI GET /todos?date=2026-06-21&filter=active
       │    getWeekCounts("2026-06-16")            → FastAPI GET /todos/week-counts?week_start=2026-06-16
       │  ])
       └─ WeekBar(weekDates, weekCounts, ...)       ← Client Component, props로만 수신

WeekBar에서 다른 날짜 클릭:
  └─ router.push("/todos?date=2026-06-22&filter=active")
       └─ Server Component 재실행 → 새 날짜의 목록 fetch
```

---

## 설계 포인트

- `GET /todos/week-counts`는 FastAPI에서 `/todos/{todo_id}` 보다 **앞에** 정의 — 그렇지 않으면 `week-counts`를 todo_id로 파싱
- 기존 DB 호환: `ALTER TABLE todos ADD COLUMN date TEXT`를 서버 시작 시 실행, 이미 있으면 예외 무시
- `WeekBar`는 Pure Display Component — 날짜 계산(weekDates, rangeText 등)은 Server Component에서 수행, WeekBar는 props를 받아 표시+네비게이션만
- `Promise.all`로 todo 목록과 주간 카운트를 병렬 fetch
- `new/page.tsx` → Server Component 전환: `searchParams.date`를 읽어 `NewTodoForm`에 prop으로 전달 (useSearchParams 없이 해결)
- 날짜 URL 파라미터가 없으면 오늘 날짜로 초기화

---

## Assignment-2 대비 차이

| 항목 | Assignment-2 | Assignment-3 |
|---|---|---|
| 날짜 상태 | `useState(new Date())` — 클라이언트 메모리 | URL `?date=YYYY-MM-DD` — 서버 상태 |
| Todo 필터링 | 전체 목록을 클라이언트에서 `.filter(item => item.date === dateKey)` | URL → Server Component → FastAPI `WHERE date = ?` |
| 주간 카운트 | `todoList.filter(item => item.date === dateKey).length` (클라이언트) | FastAPI `GET /todos/week-counts` → Server Component가 fetch 후 WeekBar에 props로 전달 |
| 날짜 변경 시 | `useState` 업데이트 → 리렌더링만 | URL 변경 → Server Component 재실행 → DB 재조회 |
