# 🔗 Step 5 — API Route 작성 및 프론트-백엔드 연동

---

## [2026-06-17] 프롬프트 30

**요청:** plan.md의 Step 5 구현 요청.

**결과:** `app/actions.ts`(Server Actions: createTodo/updateTodo/deleteTodo), `app/api/todos/route.ts`(GET/POST 프록시), `app/api/todos/[id]/route.ts`(PUT/DELETE 프록시) 생성. `new/page.tsx`와 `EditTodoForm.tsx`에서 직접 fetch 제거, Server Action + useTransition 방식으로 교체. `docs/step5-log.md` 작성 완료.

---

## [2026-06-18] 프롬프트 31

**요청:** Route Handler 방식(Client → /api/todos → FastAPI)으로 리팩토링 요청. 보안상 Client Component에서 FastAPI 직접 호출 대신 Route Handler를 프록시로 쓰는 구조.

**결과:** `actions.ts` 삭제. `new/page.tsx`와 `EditTodoForm.tsx`를 fetch(`/api/todos`) + useRouter 방식으로 교체. Route Handler가 BACKEND_URL을 숨기는 구조로 정리됨.

---

## [2026-06-18] 프롬프트 32

**요청:** 클라이언트 컴포넌트에서 Route Handler 사용이 보안상 더 좋겠다는 의견.

**결과:** 동의 및 이유 설명. troubleshooting/step5.md 작성.
