# 🎨 Step 4 — Next.js Todo 페이지 구현

## 핵심 구현 내용

### 파일 구조

```
app/
├── page.tsx                     ← /todos로 redirect
├── todos/
│   ├── page.tsx                 ← Server Component: 목록 fetch + 렌더링
│   ├── loading.tsx              ← 스켈레톤 UI (자동 Suspense)
│   ├── error.tsx                ← 'use client' Error Boundary
│   ├── new/
│   │   └── page.tsx             ← 'use client' 생성 폼
│   └── [todoId]/
│       ├── page.tsx             ← Server Component: 단건 fetch
│       └── EditTodoForm.tsx     ← 'use client' 수정·삭제 폼
```

### Server / Client 컴포넌트 구분

| 파일 | 종류 | 이유 |
|---|---|---|
| `todos/page.tsx` | Server Component | 데이터 fetch만, 인터랙션 없음 |
| `todos/loading.tsx` | — | Next.js가 자동으로 Suspense 처리 |
| `todos/error.tsx` | Client Component | Error Boundary는 클라이언트 전용 |
| `todos/new/page.tsx` | Client Component | `useState`, 이벤트 핸들러 필요 |
| `todos/[todoId]/page.tsx` | Server Component | 단건 데이터 fetch |
| `todos/[todoId]/EditTodoForm.tsx` | Client Component | `useState`, 이벤트 핸들러 필요 |

### 데이터 흐름 (Step 4 기준)

- **읽기**: Server Component → `fetch(BACKEND_URL)` → 렌더링
- **쓰기**: Client Component → `fetch(NEXT_PUBLIC_API_URL)` → Step 5에서 Server Action으로 교체 예정

### 기타

- `backend/main.py`에 `GET /todos/{id}` 단건 조회 엔드포인트 추가 (수정 페이지 진입 시 필요)
- `frontend/.env.local` 생성 (`BACKEND_URL`, `NEXT_PUBLIC_API_URL`)

## React(assignment-2) 대비 차이점

| 항목 | Assignment-2 (React) | Assignment-3 (Next.js) |
|---|---|---|
| 라우팅 | `<Route path="/todos/:id">` | `app/todos/[todoId]/page.tsx` 파일 위치 |
| 데이터 fetch | `useEffect` + 클라이언트 fetch | Server Component `async` 함수 |
| 로딩 처리 | `useState(isLoading)` | `loading.tsx` 자동 적용 |
| 에러 처리 | `try/catch` + 조건부 렌더 | `error.tsx` Error Boundary 자동 적용 |
| 컴포넌트 분리 | 모두 클라이언트 | 서버/클라이언트 명시적 구분 |
