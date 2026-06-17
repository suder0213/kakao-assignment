# 📋 사전 논의 — 계획 수립 및 구조 이해

---

## [2026-06-17] venv는 왜 backend에만 설정하는가?

**증상/질문:** Frontend에는 venv가 없고 backend에만 venv를 설정하는 이유가 불명확했다. Docker를 쓰면 venv가 불필요한지도 궁금했다.

**원인:** 런타임이 다르다.
- Frontend(Node.js): `package.json`이 의존성을 프로젝트 단위로 격리한다.
- Backend(Python): Python은 패키지를 시스템 전역에 설치하는 것이 기본이므로, 프로젝트별 격리를 위해 venv가 필요하다.

**해결:** 로컬 개발 기준으로 venv를 사용한다. Docker를 쓰면 컨테이너 자체가 격리 환경이 되므로 venv는 불필요하다.

**관련 파일:** `backend/` 디렉토리

---

## [2026-06-17] `/todos/new/page.tsx`는 새 페이지인가, 새 컴포넌트인가?

**증상/질문:** `app/todos/new/page.tsx`가 별도 페이지인지, 기존 목록 페이지에 추가되는 컴포넌트인지 불명확했다.

**원인:** Next.js App Router에서 `page.tsx`의 역할을 혼동했다.

**해결:** `page.tsx`는 URL에 1:1 대응하는 실제 페이지다. `/todos/new`로 이동하면 해당 파일이 렌더링된다. 인라인 모달이나 컴포넌트 토글이 아니라 완전한 라우트 전환이다.

**관련 파일:** `frontend/app/todos/new/page.tsx`

---

## [2026-06-17] `[todoId]/page.tsx`의 서버+클라이언트 혼합 구조

**증상/질문:** 하나의 페이지가 어떻게 Server Component와 Client Component를 동시에 가질 수 있는지 불명확했다.

**원인:** Server Component와 Client Component는 같은 파일이 아닌, 파일을 분리하여 조합한다는 개념이 생소했다.

**해결:** 파일을 분리하여 조합한다.

```
app/todos/[todoId]/
├── page.tsx          ← async Server Component: params에서 id를 꺼내 DB fetch
└── EditTodoForm.tsx  ← 'use client' Client Component: 입력 폼 + 이벤트 핸들러
```

`page.tsx`가 서버에서 Todo 데이터를 가져온 뒤, `<EditTodoForm todo={todo} />`처럼 props로 클라이언트 컴포넌트에 전달한다.

**브라우저로 전달되는 방식:**

`EditTodoForm`의 HTML도 서버에서 미리 렌더링되어 초기 HTML 응답에 함께 포함된다. 별도 파일로 따로 전달되는 것이 아니다.

```
1단계 — 초기 HTML 응답 (서버 → 브라우저)
  └── page.tsx 렌더링 결과 + EditTodoForm 렌더링 결과가 합쳐진 HTML 하나

2단계 — JS 번들 추가 전송 (서버 → 브라우저)
  └── EditTodoForm.js (이벤트 핸들러, useState 등 JS 로직)
      → 브라우저에서 기존 HTML에 붙음 (= Hydration)
```

| | Server Component (`page.tsx`) | Client Component (`EditTodoForm.tsx`) |
|---|---|---|
| 서버에서 HTML 생성 | O | O |
| JS 번들 전송 | X | O (hydration용) |
| 브라우저에서 JS 실행 | X | O |

`'use client'`의 의미는 "클라이언트로만 보낸다"가 아니라, "이 컴포넌트의 JS 로직도 브라우저에서 실행될 수 있도록 번들에 포함시킨다"에 가깝다.

**관련 파일:** `frontend/app/todos/[todoId]/page.tsx`, `frontend/app/todos/[todoId]/EditTodoForm.tsx`

---

## [2026-06-17] `error.tsx`는 왜 반드시 Client Component인가?

**증상/질문:** 에러 화면만 표시하는 단순한 UI인데 왜 `'use client'`를 선언해야 하는지 불명확했다.

**원인:** React의 Error Boundary 메커니즘이 클라이언트 전용이다.

**해결:** Next.js 스펙상 `error.tsx`는 반드시 `'use client'`여야 한다.
1. Error Boundary는 React의 클라이언트 전용 기능이다 (서버 렌더링 중 발생한 에러를 클라이언트에서 캐치하는 구조).
2. `reset()` 함수(재시도 버튼)가 클라이언트 상호작용을 필요로 한다.

**관련 파일:** `frontend/app/todos/error.tsx`

---

## [2026-06-17] API Route URL은 클라이언트에 노출되는가? actions.ts와의 차이는?

**증상/질문:** `app/api/todos/route.ts`의 경로가 브라우저에서 보이는지, Server Actions(`actions.ts`)와 어떻게 다른지 불명확했다.

**원인:** API Route와 Server Actions의 호출 방식 및 노출 범위 차이가 생소했다.

**해결:**

| 항목 | API Route (`route.ts`) | Server Actions (`actions.ts`) |
|---|---|---|
| URL 노출 | `/api/todos` 경로가 브라우저에서 보임 | URL 없음, 함수처럼 호출 |
| 실행 위치 | 서버 (Node.js) | 서버 |
| 호출 방식 | `fetch('/api/todos')` | `createTodo(formData)` 직접 호출 |
| 스타일 | REST 엔드포인트 | RPC 스타일 |

핵심: 실제 FastAPI 주소(`BACKEND_URL`)는 `NEXT_PUBLIC_` prefix가 없는 환경변수로 관리되므로 서버에서만 읽힌다. 브라우저는 `/api/todos`까지만 알고, 그 뒤의 실제 백엔드 주소는 알 수 없다.

**관련 파일:** `frontend/app/api/todos/route.ts`, `frontend/app/actions.ts`, `frontend/.env.local`
