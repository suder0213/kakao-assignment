# 🎨 Step 4 — Next.js Todo 페이지 구현

---

## [2026-06-17] React 19에서 React.FormEvent deprecated 경고

**증상:** `onSubmit` 핸들러에 `e: React.FormEvent` 타입을 선언하자 TypeScript가 `'FormEvent' is deprecated (6385)` 힌트를 표시했다.

**원인:** React 19에서 `React.FormEvent` 등 React 네임스페이스의 이벤트 타입들이 deprecated됐다.

**해결:** 핸들러에서 실제로 사용하는 메서드만 포함한 구조 타입으로 교체했다.
- 변경 전: `e: React.FormEvent`
- 변경 후: `e: { preventDefault: () => void }`

**관련 파일:** `frontend/app/todos/new/page.tsx`, `frontend/app/todos/[todoId]/EditTodoForm.tsx`

---

## [2026-06-17] useRouter()는 언제 쓰나요?

**질문:** `useRouter()`는 처음 보는데 언제 쓰는 건지?

**답변:** Client Component에서 코드로 페이지를 이동할 때 씁니다. `<Link>`는 JSX에 직접 작성해야 하지만, 폼 제출 완료처럼 이벤트 핸들러 안에서 프로그래밍적으로 이동해야 할 때 `router.push("/todos")`를 사용합니다. `'use client'`가 붙은 컴포넌트에서만 동작합니다.

---

## [2026-06-17] error.tsx props 타입 설명

**질문:** `error.tsx`의 인자가 복잡하게 많이 돼 있는데 무슨 의미인지?

**답변:** 실제 파일의 타입은 `{ error: Error; reset: () => void }` 입니다.
- `error: Error` — JS 기본 에러 객체. Next.js가 서버 컴포넌트에서 throw된 에러를 잡아서 넘겨줍니다. `error.message`로 메시지를 꺼내 표시합니다.
- `reset: () => void` — Next.js가 자동 주입하는 함수. 호출 시 에러 경계를 초기화하고 해당 구간을 다시 렌더링 시도합니다. "다시 시도" 버튼의 `onClick`에 연결해 사용합니다. `() => void`는 "아무것도 안 한다"는 뜻이 아니라 TypeScript 타입 표기로, "인자 없고 반환값 없는 함수"라는 형태를 선언한 것입니다.

---

## [2026-06-17] preventDefault와 { preventDefault: () => void } 타입

**질문:** `new/page.tsx` handleSubmit 안에 `e.preventDefault()`는 무엇이고, 왜 `{ preventDefault: () => void }` 타입으로 설정했나요?

**답변:**
- `e.preventDefault()` — `<form>`의 기본 동작(페이지 새로고침)을 막습니다. 이 없이 `<button type="submit">`을 누르면 브라우저가 GET/POST로 페이지를 새로고침합니다.
- `{ preventDefault: () => void }` 타입 — React 19에서 `React.FormEvent`가 deprecated됐습니다. 핸들러 안에서 실제로 쓰는 메서드가 `e.preventDefault()` 하나뿐이므로, 필요한 형태만 명시하는 구조 타입으로 대체했습니다. TypeScript 덕 타이핑 덕분에 실제 이벤트 객체가 이 타입을 만족합니다.

---

## [2026-06-17] router.push()와 router.refresh() 역할

**질문:** `onSubmit` 안에 다시 todo 목록으로 돌아가는 로직이 안 보이는데 `router.push()`가 그 역할을 하나요?

**답변:** 맞습니다. fetch 완료 후 두 줄이 함께 동작합니다.
- `router.push("/todos")` — `/todos` 페이지로 클라이언트 사이드 이동
- `router.refresh()` — 서버 컴포넌트(`todos/page.tsx`)의 캐시를 무효화해 목록을 최신 상태로 재조회

두 줄을 같이 써야 이동 후 목록이 변경사항을 반영합니다.

---

## [2026-06-17] TypeScript에서 객체와 함수의 타입 표기 방식

**질문:** `error: Error`는 반환값을 명시 안 하고 `reset: () => void`는 명시하는데, 왜 다르게 쓰나요?

**답변:** `변수명: 타입` 형태는 동일하고, 타입 자리에 오는 표기가 값의 종류에 따라 다릅니다.
- 객체·원시값 → 타입 이름 그대로 (`string`, `number`, `Error`, ...)
- 함수 → `(인자) => 반환값` 형태로 함수의 형태를 직접 표현

```ts
error: Error                          // 객체
name: string                          // 원시값
reset: () => void                     // 인자 없음, 반환값 없음
handler: (e: Event) => void           // 인자 있음, 반환값 없음
getId: () => number                   // 인자 없음, 반환값 있음
add: (a: number, b: number) => number // 인자 있음, 반환값 있음
```
