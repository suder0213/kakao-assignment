# 🗄️ Step 3 — DB & CRUD API 구현

## 핵심 구현 내용

### 구성 요소

**DB 모델 (SQLAlchemy)**

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | Integer PK | 자동 증가 |
| `title` | String | 할 일 제목 |
| `completed` | Boolean | 완료 여부 (기본 false) |

**Pydantic 스키마**

| 스키마 | 용도 | 필드 |
|---|---|---|
| `TodoCreate` | POST 요청 바디 | `title` (필수) |
| `TodoUpdate` | PUT 요청 바디 | `title`, `completed` (모두 선택) |
| `TodoResponse` | 응답 형식 | `id`, `title`, `completed` |

**CRUD 엔드포인트**

| 메서드 | 경로 | 설명 | 상태코드 |
|---|---|---|---|
| GET | `/todos` | 전체 목록 조회 | 200 |
| POST | `/todos` | 새 Todo 생성 | 201 |
| PUT | `/todos/{id}` | Todo 수정 | 200 |
| DELETE | `/todos/{id}` | Todo 삭제 | 204 |

**주요 설정**
- CORS: `localhost:3000` 허용
- 환경변수: `.env.local`의 `DATABASE_URL` 로드 (`python-dotenv`)
- DB 세션: `yield`로 요청마다 열고 닫음 (`get_db` 의존성)

## React(assignment-2) 대비 차이점

| 항목 | Assignment-2 (React) | Assignment-3 (Next.js + FastAPI) |
|---|---|---|
| 데이터 저장 | 없음 (상태만 존재, 새로고침 시 초기화) | SQLite DB에 영구 저장 |
| API | 없음 | FastAPI REST API |
| CRUD 로직 | 클라이언트 `useState`로 처리 | 서버 DB 트랜잭션으로 처리 |
| 데이터 형식 | JS 객체 | Pydantic 스키마로 검증된 JSON |
