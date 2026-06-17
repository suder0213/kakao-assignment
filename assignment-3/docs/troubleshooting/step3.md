# 🗄️ Step 3 — DB & CRUD API 구현

---

## [2026-06-17] declarative_base() 함수 콜 방식 vs DeclarativeBase 상속 방식의 차이

**질문:** `Base = declarative_base()` 형태로 쓴 이유와 `class Base(DeclarativeBase)` 직접 상속과의 차이.

**답변:** 같은 기능을 하는 다른 시대의 문법이다.

| | `declarative_base()` | `DeclarativeBase` 상속 |
|---|---|---|
| SQLAlchemy 버전 | 1.x ~ 2.x 호환 | 2.0+ 권장 |
| 방식 | 팩토리 함수 호출 → 클래스 동적 생성 | 직접 클래스 상속 |
| 경고 | `LegacyAPIWarning` 발생 가능 | 없음 |

현재 코드에서 구버전을 쓴 이유는 FastAPI 공식 튜토리얼 대부분이 구버전 문법을 따르기 때문이다. 이후 필요 시 신버전으로 교체 가능하다.

**관련 파일:** `backend/main.py`

---

## [2026-06-17] get_db의 yield 기반 동작 원리

**질문:** `get_db` 함수에서 `yield`를 쓰는 정확한 동작 원리가 궁금했다.

**답변:** `yield`가 있는 함수는 제너레이터가 된다. FastAPI의 `Depends(get_db)`는 이를 아래 순서로 처리한다.

```
요청 들어옴
  → db = SessionLocal()  # DB 연결 생성
  → yield db             # 멈추고 db를 엔드포인트 인자로 전달
  → 엔드포인트 로직 실행 (쿼리, 커밋 등)
  → 응답 반환
  → finally: db.close()  # 성공·실패 무관하게 항상 실행
```

`try/finally`를 쓰는 이유는 엔드포인트에서 예외가 발생해도 `db.close()`가 반드시 실행되게 하기 위해서다. `return db`로 썼다면 close 시점을 제어할 수 없다.

**관련 파일:** `backend/main.py`

---

## [2026-06-17] class Config와 Base.metadata.create_all의 동작 흐름

**질문:** `class Config`의 `from_attributes = True`와 `Base.metadata.create_all`이 어떤 흐름으로 작동하는지 궁금했다.

**답변:**

`class Config` — Pydantic은 기본적으로 딕셔너리만 처리할 수 있다. SQLAlchemy가 반환하는 것은 객체이므로 `from_attributes = True` 없이 `return todo`(객체)를 하면 직렬화에 실패한다. 이 설정이 "객체의 속성도 읽을 수 있다"고 허용한다.

`Base.metadata.create_all` — `Base`를 상속받은 모든 모델이 `Base.metadata`에 테이블 설계도로 등록된다. `create_all`은 앱 시작 시 이 설계도를 순회하며 테이블이 없으면 `CREATE TABLE`을 실행하고, 있으면 건너뛴다. 단, 기존 테이블의 컬럼 변경은 반영되지 않는다 (스키마 변경은 Alembic 같은 마이그레이션 도구 필요).

**관련 파일:** `backend/main.py`
