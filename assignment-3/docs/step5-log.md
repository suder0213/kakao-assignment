# 🔗 Step 5 — API Route 작성 및 프론트-백엔드 연동

## 구현 내용

### 생성 파일

| 파일 | 역할 |
|---|---|
| `app/api/todos/route.ts` | API Route: GET(목록) / POST(생성) 프록시 |
| `app/api/todos/[id]/route.ts` | API Route: PUT(수정) / DELETE(삭제) 프록시 |

### 수정 파일

| 파일 | 변경 내용 |
|---|---|
| `app/todos/new/page.tsx` | fetch(`/api/todos`) + useRouter 방식 |
| `app/todos/[todoId]/EditTodoForm.tsx` | fetch(`/api/todos/{id}`) + useRouter 방식 |

---

## 핵심 흐름

```
브라우저 (Client Component)
  └─ fetch("/api/todos")              ← FastAPI 주소 모름
       └─ Route Handler (서버)
            └─ fetch(BACKEND_URL/todos) ← FastAPI 주소는 서버만 앎
                 └─ FastAPI (:8000)
```

### Step 4 대비 변경점

| 항목 | Step 4 | Step 5 |
|---|---|---|
| Client fetch 대상 | FastAPI 직접 (`NEXT_PUBLIC_API_URL`) | Next.js Route Handler (`/api/todos`) |
| FastAPI 주소 노출 | 브라우저에 노출 | 서버 전용 (`BACKEND_URL`) |
| 환경변수 | `NEXT_PUBLIC_API_URL` 필요 | 불필요 (상대경로 `/api/todos` 사용) |

---

## 설계 원칙

- **Server Component**: `BACKEND_URL`로 FastAPI 직접 fetch — 서버에서만 실행되므로 안전
- **Client Component**: Route Handler(`/api/todos`)를 경유 — 브라우저에서 실행되므로 직접 FastAPI를 부르면 실제 주소와 인증 키가 노출됨
- Route Handler가 인증 헤더, API 키 등을 안전하게 붙이고 FastAPI를 호출하는 보안 계층 역할

---

## React(assignment-2) 대비 차이

- assignment-2: 클라이언트에서 외부 API를 직접 fetch — 백엔드 주소가 브라우저에 노출
- assignment-3: Client Component → Route Handler(Next.js 서버) → FastAPI 구조로 백엔드 주소 은닉
