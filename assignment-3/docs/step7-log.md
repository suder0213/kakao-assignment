# 🔎 Step 7 — 서버 기반 Todo 검색

## 구현 내용

### 생성 파일

| 파일 | 역할 |
|---|---|
| `frontend/app/todos/SearchInput.tsx` | 검색 입력 Client Component |

### 수정 파일

| 파일 | 변경 내용 |
|---|---|
| `backend/main.py` | `GET /todos`에 `search` 쿼리 파라미터 추가 (SQLAlchemy LIKE) |
| `frontend/app/todos/page.tsx` | `search` searchParam 수신, getTodos에 전달, SearchInput 렌더링, 필터 탭에 search 보존 |

---

## 핵심 흐름

```
검색어 입력 후 제출
  └─ SearchInput(Client Component): router.push("/todos?filter=active&search=키워드")
       └─ Server Component(page.tsx) 재실행
            └─ searchParams에서 filter, search 읽기
                 └─ fetch(BACKEND_URL/todos?filter=active&search=키워드)
                      └─ FastAPI: LIKE 쿼리 + filter 동시 적용
```

---

## 설계 포인트

- `SearchInput`은 `useSearchParams`로 현재 filter 값을 읽어 검색 시 보존
- 필터 탭 링크도 현재 search 값을 포함해 탭 변경 시 검색어 유지
- `useSearchParams`를 쓰는 Client Component는 `<Suspense>`로 감싸야 함 (Next.js 요구사항)
- filter + search 동시 적용: FastAPI에서 두 조건을 AND로 처리

---

## React(assignment-2) 대비 차이

- assignment-2: 클라이언트에서 전체 목록을 받아 JS로 문자열 필터링
- assignment-3: 검색어를 URL에 담아 서버로 전송 → FastAPI가 LIKE 쿼리로 DB에서 직접 필터링 → 결과만 반환
