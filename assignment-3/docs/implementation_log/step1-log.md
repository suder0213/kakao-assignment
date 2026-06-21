# 🖥️ Step 1 — 프론트엔드 프로젝트 세팅

## 핵심 구현 내용

Step 0에서 생성된 Next.js 프로젝트를 개발 서버로 실행하여 `localhost:3000` 기본 화면을 확인했다.

**실행 명령어:**

```bash
cd frontend
npm run dev
```

**확인 결과:** `localhost:3000` → HTTP 200 응답

## React(assignment-2) 대비 차이점

| 항목 | Assignment-2 (React + Vite) | Assignment-3 (Next.js) |
|---|---|---|
| 실행 명령어 | `npm run dev` | `npm run dev` (동일) |
| 기본 포트 | 5173 | 3000 |
| 번들러 | Vite | Turbopack |
| 초기 화면 | Vite + React 기본 템플릿 | Next.js App Router 기본 템플릿 |
| 렌더링 방식 | CSR (클라이언트) | SSR (서버에서 HTML 생성 후 전달) |
