# 🏗️ Step 0 — 전체 구조 잡기

## 핵심 구현 내용

`npx create-next-app@latest frontend` 로 Next.js 프로젝트를 생성하고, `backend/` 빈 디렉토리를 추가하여 프론트-백엔드 분리 구조를 완성했다.

**생성된 구조:**

```
assignment-3/
├── frontend/          ← Next.js (TypeScript, App Router, Tailwind)
│   ├── app/
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
└── backend/           ← FastAPI (Step 2에서 세팅)
```

**선택한 create-next-app 옵션:**

| 옵션 | 선택 | 이유 |
|---|---|---|
| TypeScript | Yes | 타입 안전성 |
| ESLint | Yes | 코드 품질 |
| Tailwind CSS | Yes | 빠른 스타일링 |
| App Router | Yes | Server Component 사용을 위한 필수 선택 |
| `src/` 디렉토리 | No | 계획 구조와 일치 (`app/` 바로 사용) |

## React(assignment-2) 대비 차이점

| 항목 | Assignment-2 (React + Vite) | Assignment-3 (Next.js) |
|---|---|---|
| 프로젝트 생성 | `npm create vite@latest` | `npx create-next-app@latest` |
| 라우터 | React Router (별도 설치) | App Router (내장, 파일시스템 기반) |
| 백엔드 | 없음 (프론트만) | `backend/` 디렉토리 분리 |
| 설정 파일 | `vite.config.js` | `next.config.ts` |
| 번들러 | Vite | Turbopack (Next.js 내장) |
