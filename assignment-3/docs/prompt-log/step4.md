# 🎨 Step 4 — Next.js Todo 페이지 구현

---

## [2026-06-17] 프롬프트 26

**요청:** plan.md의 Step 4 구현 요청.

**결과:** `app/page.tsx`(redirect), `todos/page.tsx`(Server), `todos/loading.tsx`, `todos/error.tsx`(Client), `todos/new/page.tsx`(Client), `todos/[todoId]/page.tsx`(Server), `todos/[todoId]/EditTodoForm.tsx`(Client) 생성. `backend/main.py`에 `GET /todos/{id}` 추가. `frontend/.env.local` 생성. `docs/step4-log.md` 작성 완료.

---

## [2026-06-17] 프롬프트 27

**요청:** 화면이 검은색이어서 assignment-2 스타일로 변경 요청.

**결과:** `globals.css`에 assignment-2의 CSS 변수(`#672be0` 보라 테마) 추가. 모든 페이지·컴포넌트 스타일 전면 교체.

---

## [2026-06-17] 프롬프트 28

**요청:** `React.FormEvent` deprecated 힌트 수정.

**결과:** `new/page.tsx`, `EditTodoForm.tsx` 두 파일에서 `React.FormEvent` → `{ preventDefault: () => void }` 로 교체. React 19에서 FormEvent가 deprecated됨.

---

## [2026-06-17] 프롬프트 29

**요청:** useRouter() 용도, error.tsx props 구조, preventDefault와 타입 이유, router.push() 역할 질문.

**결과:** 4가지 개념 질문에 답변. troubleshooting/step4.md에 항목 4개 추가.
