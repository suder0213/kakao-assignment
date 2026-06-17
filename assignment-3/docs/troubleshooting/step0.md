# 🏗️ Step 0 — 전체 구조 잡기

---

## [2026-06-17] create-next-app 실행 시 계획서보다 플래그가 많이 붙은 이유

**증상:** 계획서의 명령어는 `npx create-next-app@latest frontend` 였으나, 실제 실행 명령어에는 다수의 플래그가 추가되었다.


```bash
cd "c:\Users\sgpar\OneDrive\Desktop\kakao-tech-campus\assignments\assignment-3" && npx create-next-app@latest frontend --typescript --eslint --tailwind --app --no-src-dir --import-alias "@/*" --yes 2>&1
```

**원인:** `create-next-app`은 대화형(interactive) CLI로, 실행 시 TypeScript·Tailwind 등 옵션을 하나씩 물어본다. 터미널 입력이 불가능한 환경에서는 이 프롬프트에 답할 수 없어 명령이 멈추기 때문에 플래그로 대체해야 했다.

**해결:** `--yes`로 비대화형 실행을 활성화하고, 계획 구조에 맞는 옵션을 나머지 플래그로 명시했다.

| 플래그 | 의미 |
|---|---|
| `--yes` | 모든 프롬프트 자동 응답 (비대화형 실행) |
| `--typescript` | TypeScript 사용 |
| `--eslint` | ESLint 설정 포함 |
| `--tailwind` | Tailwind CSS + postcss 포함 |
| `--app` | App Router 사용 (Server Component 필수) |
| `--no-src-dir` | `src/` 없이 `app/` 직접 사용 (계획 구조 일치) |
| `--import-alias "@/*"` | 경로 별칭 `@/` 설정 (Next.js 관례) |

계획서의 명령어는 대화형으로 직접 선택하는 것을 전제로 한 예시였고, 플래그 방식은 동일한 선택지를 미리 지정한 것이다.

**관련 파일:** `frontend/package.json`, `frontend/tsconfig.json`, `frontend/next.config.ts`

---

## [2026-06-17] frontend/ 아래에 CLAUDE.md, AGENTS.md가 자동 생성된 이유

**증상:** `create-next-app` 실행 후 `frontend/CLAUDE.md`, `frontend/AGENTS.md` 파일이 생성되었다. 직접 만든 적 없는 파일이었다.

**원인:** 최신 `create-next-app` 템플릿에 기본으로 포함된 파일들이다.
- `AGENTS.md` — AI 에이전트(Claude, Cursor 등)에게 "이 Next.js 버전은 학습 데이터와 다를 수 있으니 `node_modules/next/dist/docs/`를 먼저 읽어라"고 안내하는 파일. AI가 구버전 API를 사용하는 실수를 방지하려는 목적이다.
- `CLAUDE.md` — 내용이 `@AGENTS.md` 한 줄뿐인 포워딩 파일. Claude Code가 시작 시 자동으로 `CLAUDE.md`를 읽는 특성을 이용해 `AGENTS.md`로 연결한다.

**해결:** 삭제하지 않아도 무방하다. 오히려 Claude Code가 최신 Next.js API 가이드를 참조하도록 돕는 역할을 한다.

**관련 파일:** `frontend/CLAUDE.md`, `frontend/AGENTS.md`

> # Comment
> Claude Code는 Terminal과 선택지 상호작용이 불가능하므로 위와 같은 명령어를 수행함