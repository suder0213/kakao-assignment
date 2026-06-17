# 🗄️ Step 3 — DB & CRUD API 구현

---

## [2026-06-17] 프롬프트 23

**요청:** plan.md의 Step 3 구현 요청.

**결과:** `backend/main.py`에 SQLAlchemy DB 모델, Pydantic 스키마, CORS 미들웨어, CRUD 엔드포인트(GET·POST·PUT·DELETE) 구현. `requirements.txt`에 `sqlalchemy`, `python-dotenv` 추가. `docs/step3-log.md` 작성 완료.

---

## [2026-06-17] 프롬프트 24

**요청:** `declarative_base()` 함수 콜 방식 vs `DeclarativeBase` 상속 방식 차이, `get_db`의 `yield` 동작 원리 질문.

**결과:** 구버전·신버전 문법 차이 설명. `yield` 제너레이터 기반 DB 세션 생명주기 설명. `troubleshooting/step3.md` 생성 및 기록.

---

## [2026-06-17] 프롬프트 25

**요청:** `class Config`의 `from_attributes`와 `Base.metadata.create_all` 동작 흐름 질문.

**결과:** Pydantic 객체 직렬화 허용 원리, `metadata` 테이블 등록 및 `CREATE TABLE IF NOT EXISTS` 실행 흐름 설명. `troubleshooting/step3.md`에 항목 추가.
