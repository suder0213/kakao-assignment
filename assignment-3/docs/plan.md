# Assignment-3 구현 계획

## 목표

Assignment-1(Vanilla JS), Assignment-2(React + Vite)로 구현한 Todo 앱을 Next.js + FastAPI 풀스택 구조로 리팩토링한다.

---

## 최종 디렉토리 구조

```
assignment-3/
├── frontend/                          # Next.js 앱
│   ├── app/
│   │   ├── api/todos/route.ts         # API Route — 백엔드 프록시
│   │   ├── todos/
│   │   │   ├── [todoId]/page.tsx      # Todo 수정 페이지
│   │   │   ├── new/page.tsx           # Todo 생성 페이지
│   │   │   ├── error.tsx              # 에러 화면
│   │   │   ├── loading.tsx            # 로딩 화면
│   │   │   └── page.tsx              # Todo 목록 페이지
│   │   ├── actions.ts                 # Server Actions (CRUD)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                   # 루트 → /todos 리다이렉트
│   ├── .env.local
│   ├── next.config.mjs
│   ├── tsconfig.json
│   └── package.json
│
└── backend/                           # FastAPI 앱
    ├── main.py                        # 라우터·DB·모델·스키마 통합
    ├── requirements.txt
    └── .env.local
```

---

## 단계별 구현 계획

### Step 0 — 전체 구조 잡기

**목표:** 빈 프로젝트 뼈대 생성

**작업 목록:**
- `assignment-3/` 디렉토리 생성
- `npx create-next-app@latest frontend` 실행 (TypeScript, App Router, Tailwind 선택)
- `mkdir backend` 실행

**완료 기준:** `assignment-3/frontend/`, `assignment-3/backend/` 두 폴더가 존재한다.

**작성할 문서:** `docs/step0-log.md`

---

### Step 1 — 프론트엔드 프로젝트 세팅

**목표:** `localhost:3000`에서 Next.js 기본 화면 확인

**작업 목록:**
- `create-next-app` 기본 세팅 확인
- `npm run dev` 실행 후 브라우저 접속 확인
- 불필요한 보일러플레이트 코드 정리 (선택)

**완료 기준:** `localhost:3000` 접속 시 Next.js 기본 화면이 렌더링된다.

**작성할 문서:** `docs/step1-log.md`

---

### Step 2 — 백엔드 프로젝트 세팅

**목표:** `localhost:8000`에서 `{"message": "Hello World"}` 응답 확인

**작업 목록:**
- `backend/` 안에서 Python venv 생성 및 활성화
  ```
  python -m venv venv
  venv\Scripts\activate   # Windows
  ```
- `pip install fastapi uvicorn` 후 `requirements.txt` 저장
- `main.py`에 최소 FastAPI 앱 작성
- `uvicorn main:app --reload` 실행 후 확인

**완료 기준:** `GET localhost:8000/` → `{"message": "Hello World"}`

**작성할 문서:** `docs/step2-log.md`

---

### Step 3 — 백엔드 DB 및 CRUD 엔드포인트 구현

**목표:** SQLite + SQLAlchemy로 Todo CRUD API 완성

**작업 목록:**

1. **의존 패키지 설치**
   ```
   pip install sqlalchemy python-dotenv python-multipart
   ```

2. **DB 모델 정의** (`Todo` 테이블)
   | 필드 | 타입 | 설명 |
   |---|---|---|
   | `id` | Integer PK | 자동 증가 |
   | `title` | String | 할 일 제목 |
   | `completed` | Boolean | 완료 여부 (기본 false) |

3. **Pydantic 스키마 정의**
   - `TodoCreate`: `title` (필수)
   - `TodoUpdate`: `title` (선택), `completed` (선택)
   - `TodoResponse`: `id`, `title`, `completed`

4. **CORS 미들웨어 설정** — `localhost:3000` 허용

5. **엔드포인트 구현**
   | 메서드 | 경로 | 설명 |
   |---|---|---|
   | GET | `/todos` | 전체 목록 조회 |
   | POST | `/todos` | 새 Todo 생성 |
   | PUT | `/todos/{id}` | Todo 수정 |
   | DELETE | `/todos/{id}` | Todo 삭제 |

6. **환경변수 적용** — `.env.local`의 `DATABASE_URL` 읽기

**완료 기준:** `curl localhost:8000/todos` → `[]` (빈 배열), 각 CRUD 동작 확인

**작성할 문서:** `docs/step3-log.md`

---

### Step 4 — Next.js Todo 페이지 구현

**목표:** Server Component / Client Component를 적절히 나눠 Todo UI 구현

**작업 목록:**

| 파일 | 컴포넌트 종류 | 역할 |
|---|---|---|
| `app/todos/page.tsx` | Server Component | Todo 목록 fetch 후 렌더링 |
| `app/todos/new/page.tsx` | Client Component | 새 Todo 입력 폼 |
| `app/todos/[todoId]/page.tsx` | Server + Client | 특정 Todo fetch → 수정 폼 |
| `app/todos/error.tsx` | Client Component | 에러 바운더리 UI |
| `app/todos/loading.tsx` | — (자동 Suspense) | 스켈레톤·스피너 |

**구분 기준:**
- 서버에서 데이터를 가져오는 부분 → Server Component (`async` 함수)
- `useState`, `useEffect`, 이벤트 핸들러가 필요한 부분 → `'use client'` Client Component

**완료 기준:** 각 페이지가 브라우저에서 정상 렌더링되고, 로딩/에러 상태가 표시된다.

**작성할 문서:** `docs/step4-log.md`

---

### Step 5 — API Route 작성 및 프론트-백엔드 연동

**목표:** Next.js가 백엔드 프록시 역할을 하도록 연결

**작업 목록:**

1. **`app/api/todos/route.ts` 작성**
   - `GET` → FastAPI `GET /todos` 프록시
   - `POST` → FastAPI `POST /todos` 프록시
   - `PUT` / `DELETE` → `app/api/todos/[id]/route.ts`로 분리

2. **`app/actions.ts` 작성** (Server Actions)
   ```ts
   'use server'
   export async function createTodo(formData: FormData) { ... }
   export async function updateTodo(id: number, data: Partial<Todo>) { ... }
   export async function deleteTodo(id: number) { ... }
   ```

3. **각 페이지에서 Server Action 호출**
   - 폼 `action={createTodo}` 또는 `startTransition`으로 연결
   - 변경 후 `revalidatePath('/todos')` 호출로 캐시 무효화

4. **`.env.local` 환경변수 설정**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   BACKEND_URL=http://localhost:8000
   ```

**완료 기준:** 브라우저에서 Todo 생성·수정·삭제가 실제 DB에 반영된다.

**작성할 문서:** `docs/step5-log.md`

---

### Step 6 (심화) — 서버 기반 상태 필터링

**목표:** URL 파라미터로 필터 상태를 관리하고, 필터링을 FastAPI 서버에서 처리

**작업 목록:**
- FastAPI `GET /todos?filter=active|completed` 쿼리 파라미터 처리
- `app/todos/page.tsx`에서 `searchParams.filter`를 읽어 API 호출
- 필터 탭 UI (전체 / 진행 중 / 완료) 구현 — URL 변경 시 Server Component 재실행

**완료 기준:** 탭 클릭 시 URL이 `?filter=active` 등으로 바뀌고 목록이 서버 필터링 결과로 갱신된다.

**작성할 문서:** `docs/step6-log.md`

---

### Step 7 (심화) — 서버 기반 Todo 검색

**목표:** `?search=키워드` URL 파라미터로 서버 측 키워드 검색

**작업 목록:**
- FastAPI `GET /todos?search=keyword` 쿼리 파라미터 처리 (SQLAlchemy `LIKE`)
- 필터와 검색 동시 적용 (`?filter=active&search=밥`)
- 검색 입력 UI 구현 (Server Action 또는 URL push)

**완료 기준:** 검색어 입력 시 서버에서 필터링된 결과만 표시된다.

**작성할 문서:** `docs/step7-log.md`

---

## React(assignment-2)와의 핵심 차이 미리 보기

| 항목 | Assignment-2 (React + Vite) | Assignment-3 (Next.js + FastAPI) |
|---|---|---|
| 렌더링 | 100% CSR (클라이언트) | Server Component로 SSR/SSG 혼합 |
| 라우팅 | React Router (클라이언트) | App Router (파일시스템 기반, 서버) |
| 데이터 페칭 | `useEffect` + `fetch` | `async` Server Component에서 직접 fetch |
| 상태 관리 | `useState` | 서버 상태는 URL/DB, 클라이언트 상태만 `useState` |
| API | 없음 (프론트만 존재) | Next.js API Route (프록시) + FastAPI (실제 백엔드) |
| 데이터 변경 | 클라이언트 fetch → state 업데이트 | Server Action → DB → `revalidatePath` |
| 환경변수 | Vite `VITE_` prefix | Next.js `NEXT_PUBLIC_` (클라이언트) / 없음 (서버) |

---

## 진행 체크리스트

- [ ] Step 0 — 프로젝트 뼈대 생성
- [ ] Step 1 — 프론트엔드 기본 화면 확인
- [ ] Step 2 — 백엔드 Hello World 확인
- [ ] Step 3 — FastAPI CRUD 엔드포인트 완성
- [ ] Step 4 — Next.js 페이지 구현
- [ ] Step 5 — API Route + Server Actions 연동
- [ ] Step 6 (심화) — 서버 필터링
- [ ] Step 7 (심화) — 서버 검색
