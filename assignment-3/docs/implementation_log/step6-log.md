# 🔍 Step 6 — 서버 기반 상태 필터링

## 구현 내용

### 수정 파일

| 파일 | 변경 내용 |
|---|---|
| `backend/main.py` | `GET /todos`에 `filter` 쿼리 파라미터 추가 |
| `frontend/app/todos/page.tsx` | `searchParams` 수신, 필터 탭 UI 추가, API 호출에 filter 전달 |

---

## 핵심 흐름

```
브라우저에서 탭 클릭 → URL이 /todos?filter=active 로 변경
  └─ Server Component(page.tsx) 재실행
       └─ searchParams.filter 읽기
            └─ fetch(BACKEND_URL/todos?filter=active)
                 └─ FastAPI: completed == False 필터링 후 반환
```

---

## 설계 포인트

- 필터 상태를 `useState`가 아닌 **URL 쿼리 파라미터**로 관리
  - 새로고침해도 필터 유지, 링크 공유 가능
- 탭은 `<Link>` 컴포넌트로 구현 — JS 없이도 URL 변경 가능
- `searchParams`는 Next.js 16에서 `Promise<{ filter?: string }>` 타입이므로 `await` 필요
- 필터링 로직이 FastAPI 서버에 있으므로 클라이언트는 필터 결과만 수신

---

## React(assignment-2) 대비 차이

- assignment-2: `useState`로 필터 상태 관리 → 클라이언트에서 전체 목록을 받아 JS로 필터링
- assignment-3: URL 쿼리 파라미터 → Server Component 재실행 → FastAPI가 필터링 → 결과만 전송
