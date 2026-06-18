# 🔗 Step 5 — API Route 작성 및 프론트-백엔드 연동

---

## [2026-06-17] useRouter 리다이렉트 vs redirect() 차이

**질문:** `useRouter().push()`로 리다이렉트하는 방법과 `redirect()`로 하는 방법의 차이는?

**답변:**
- `useRouter().push()` — 클라이언트에서 실행. `'use client'` 컴포넌트에서만 사용 가능. 브라우저가 JS로 페이지 전환.
- `redirect()` (next/navigation) — 서버에서 실행. Server Action, Server Component에서만 사용 가능. 서버가 HTTP 리다이렉트 응답 전송.

Server Action은 서버에서 실행되므로 `useRouter`를 쓸 수 없고 `redirect()`를 써야 한다.

---

## [2026-06-17] Server Action vs Route Handler 역할 구분

**질문:** Action과 Route 중 어떤 게 브라우저에 보이고 서버에 있는지, 순서 관계가 어떻게 되는지?

**답변:**
- **Server Action** — HTTP 엔드포인트가 아님. React가 내부적으로 관리하는 서버 함수 호출. 브라우저 주소창에 URL 없음, curl로 직접 호출 불가. Client Component에서 호출하면 React가 서버로 요청을 보내고 서버에서 FastAPI를 직접 호출함.
- **Route Handler** — 실제 HTTP 엔드포인트(`/api/todos`). 브라우저나 curl로 직접 호출 가능. Client Component에서 fetch로 호출하면 Route Handler가 FastAPI로 프록시함.

현재 구현(Step 5 최종)은 Client Component → Route Handler → FastAPI 흐름을 사용. Server Action은 사용하지 않음.

---

## [2026-06-17] startTransition이란?

**질문:** `startTransition`은 무엇인가?

**답변:** 비동기 작업이 진행 중인지 `isPending`으로 자동 추적해주는 React 훅.

```ts
const [isPending, startTransition] = useTransition()
startTransition(async () => {
  await createTodo(title)  // 이 동안 isPending = true
})                          // 끝나면 isPending = false
```

Step 4의 `useState(false)`로 loading 상태를 수동 관리하던 방식 대신, `startTransition` 블록이 실행되는 동안 자동으로 `isPending`이 `true`가 됨.

---

## [2026-06-17] Client Component에서 Route Handler를 쓰는 이유

**질문:** 클라이언트 컴포넌트는 보안상 Route Handler를 쓰는 게 더 좋은 것 같다.

**답변:** 맞음. 정리하면:
- **Server Component** — `BACKEND_URL`로 FastAPI 직접 fetch 가능. 서버에서만 실행되므로 주소가 노출되지 않음.
- **Client Component** — 브라우저에서 실행되므로 FastAPI를 직접 부르면 실제 백엔드 주소가 노출됨. Route Handler를 중간에 두면 클라이언트는 `/api/todos`만 보고 FastAPI 주소는 모름.

특히 FastAPI에 인증 토큰이나 내부 API 키가 붙어야 할 때, Route Handler에서 헤더를 붙이면 클라이언트에 키가 노출되지 않음.

---

## [2026-06-18] Server Action vs Route Handler 선택 기준

**질문:** Route Handler와 Server Action 중 언제 어떤 것을 써야 하는지? 현재 구조는 적합한가?

**답변:** 현재 구조(Route Handler)는 적합함.

| 상황 | 추천 |
|---|---|
| JS 없이도 동작해야 하는 폼 (접근성, 점진적 향상) | Server Action |
| 외부 서비스나 앱이 API를 직접 호출해야 함 | Route Handler |
| 일반적인 Next.js 앱 내부 mutation | 둘 다 가능 |

현재 프로젝트는 이벤트 핸들러(`onSubmit`, `onClick`) + fetch로 mutation을 처리하고 있으므로 Route Handler가 적합한 케이스. JS 없이 동작할 필요도 없고, 외부 API로 공개할 계획도 없지만 Next.js 앱 내부 mutation에 Route Handler를 쓰는 것은 일반적인 선택.
