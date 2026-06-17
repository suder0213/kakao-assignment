# ⚙️ Step 2 — 백엔드 세팅

---

## [2026-06-17] venv 활성화의 원리와 적용 범위

**질문:** venv를 활성화하면 어떤 원리로 환경이 분리되는지, 적용 범위가 어떻게 되는지 궁금했다.

**답변:** venv 활성화는 셸의 `PATH` 환경변수 맨 앞에 `venv/Scripts/`를 추가하는 것이 전부다. 셸은 명령어를 PATH 앞에서부터 탐색하므로 시스템 Python보다 venv Python이 먼저 실행된다. `pip install`도 venv의 pip가 실행되어 패키지가 `venv/Lib/site-packages/`에만 설치된다.

적용 범위는 **해당 터미널 세션에만** 유효하다. 새 터미널을 열면 PATH가 초기화되므로 매번 `source venv/Scripts/activate`를 다시 실행해야 한다. 활성화 여부는 프롬프트 앞의 `(venv)` 표시로 확인한다. `deactivate`는 PATH에서 `venv/Scripts/`를 제거해 원래 상태로 돌아간다 (파일 삭제 아님).

**관련 파일:** `backend/venv/`

---

## [2026-06-17] pip install의 기본 설치 범위는 어디인가

**질문:** venv 없이 `pip install`하면 컴퓨터 전체가 아닌 어디에 설치되는지 궁금했다.

**답변:** 설치 범위는 세 단계로 나뉜다.

| 상황 | 설치 위치 | 범위 |
|---|---|---|
| 관리자 권한으로 `pip install` | `C:\Python312\Lib\site-packages\` | 컴퓨터 전체 |
| 일반 권한으로 `pip install` | `C:\Users\sgpar\AppData\Roaming\Python\...\site-packages\` | 현재 사용자 전체 |
| venv 활성화 후 `pip install` | `backend\venv\Lib\site-packages\` | 해당 프로젝트만 |

venv가 필요한 이유: 프로젝트마다 같은 라이브러리의 다른 버전이 필요할 때 전역 설치는 한 버전만 유지할 수 있어 충돌이 생긴다. venv는 프로젝트별 독립된 `site-packages`를 제공해 이를 방지한다. Node.js의 `node_modules/`가 프로젝트 안에 있는 것과 같은 이유다.

**관련 파일:** `backend/venv/Lib/site-packages/`

---

## [2026-06-17] venv 활성화 시 해당 venv/lib 안의 라이브러리만 사용하는가

**질문:** venv를 활성화한 터미널에서는 해당 venv/lib 안의 라이브러리만 사용하는 것인지 확인.

**답변:** 맞다. 단, "venv 안에 없으면 시스템 전역으로 폴백"하는 것이 아니라 완전히 격리된다. venv 안에 없으면 `ModuleNotFoundError`가 발생한다. 반대로 venv 비활성화 상태에서는 시스템 전역만 보고 venv 안은 아예 탐색하지 않는다. 따라서 `uvicorn main:app --reload`는 반드시 `(venv)`가 붙은 터미널에서 실행해야 한다.

**관련 파일:** `backend/venv/`
