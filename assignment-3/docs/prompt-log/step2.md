# ⚙️ Step 2 — 백엔드 세팅

---

## [2026-06-17] 프롬프트 17

**요청:** Step 2 구현 요청.

**결과:** `backend/main.py`, `requirements.txt`, `.env.local` 작성. 서버 실행은 사용자 터미널에서 직접 진행 안내.

---

## [2026-06-17] 프롬프트 18

**요청:** venv 활성화의 원리와 적용 범위 질문.

**결과:** PATH 앞에 `venv/Scripts/` 삽입 원리, 터미널 세션 단위 적용 범위, `(venv)` 표시 확인법 설명. `troubleshooting/step2.md` 생성 및 기록.

---

## [2026-06-17] 프롬프트 19

**요청:** venv 없이 `pip install`하면 설치 범위가 컴퓨터 전체인지 질문.

**결과:** 관리자 권한(시스템 전역), 일반 권한(사용자 전역), venv(프로젝트) 세 단계 설치 범위 설명. `node_modules/`와 비교. `troubleshooting/step2.md`에 항목 추가.

---

## [2026-06-17] 프롬프트 20

**요청:** venv 활성화 시 해당 venv/lib의 라이브러리만 사용하는지 확인 질문.

**결과:** 완전 격리 구조 확인. venv 안에 없으면 시스템 전역 폴백 없이 바로 에러. `troubleshooting/step2.md`에 항목 추가.

---

## [2026-06-17] 프롬프트 21

**요청:** .gitignore에 적절한 항목 추가 요청.

**결과:** `backend/.gitignore` 생성 (venv, 캐시, DB, 환경변수, 로그). 루트 `.gitignore` 정리 (OS, IDE, backend 주요 항목).

---

## [2026-06-17] 프롬프트 22

**요청:** .gitignore 항목이 겹치고 있다는 지적.

**결과:** 루트는 OS·IDE 공통 항목만, `backend/.gitignore`는 Python 전용 항목만 담도록 역할 분리. 중복 제거.
