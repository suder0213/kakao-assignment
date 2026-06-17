# Assignment-3 CLAUDE.md

Next.js + FastAPI Todo 앱 구현 프로젝트. 구현 계획: `docs/plan.md`

---

## 자동화 규칙

### 프롬프트 로그 (`docs/prompt-log/`)

매 대화 턴마다 현재 단계 파일에 항목을 추가한다.

**파일명:** `pre-discussion.md` / `step0.md` / `step1.md` … (단계별 분리)  
**새 파일 생성 시 헤더:** `# <아이콘> Step N — <제목>`  
**항목 형식:**
- 제목: `## [YYYY-MM-DD] 프롬프트 N` (N은 전체 파일 통틀어 순서대로 증가)
- **요청:** 한 줄 요약
- **결과:** 한 줄~세 줄 요약

### 트러블슈팅 (`docs/troubleshooting/`)

아래 두 경우에 현재 단계 파일에 항목을 추가한다. 해당 없는 턴은 수정하지 않는다.

1. **오류·문제가 발생하고 해결된 경우**
2. **사용자가 개념·동작·이유를 질문한 경우** — 질문 내용과 답변을 기록한다

**파일명:** 프롬프트 로그와 동일 패턴  
**항목 형식:**
- 제목: `## [YYYY-MM-DD] 문제 또는 질문 제목`
- **증상/질문 / 원인 / 해결·답변 / 관련 파일**
- 미해결 시: `해결: 미해결 — <현재 상태>`

### 아이콘 기준

📋 사전논의 · 🏗️ Step0 · 🖥️ Step1 · ⚙️ Step2 · 🗄️ Step3 · 🎨 Step4 · 🔗 Step5 · 🔍 Step6 · 🔎 Step7

---

## 개발 규칙

- Step 완료 후 `docs/step{N}-log.md` 작성 (핵심 구현 + React 대비 차이점 포함)
- 파일 수정 시 Read 후 Edit
- 커밋은 명시적 요청 시에만
- 환경변수는 `.env.local` 관리, 하드코딩 금지
- 코드에 주석 추가 금지

---

## 디렉토리 구조

```
assignment-3/
├── docs/
│   ├── plan.md
│   ├── prompt-log/      pre-discussion.md · step{N}.md
│   ├── troubleshooting/ pre-discussion.md · step{N}.md
│   └── step{N}-log.md
├── frontend/
└── backend/
```
