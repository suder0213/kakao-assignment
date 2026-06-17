# 🖥️ Step 1 — 프론트엔드 프로젝트 세팅

---

## [2026-06-17] npm install을 한 적 없는데 node_modules가 있는 이유

**질문:** `npm install`을 직접 실행한 적이 없는데 `node_modules/`가 이미 존재했다.

**원인:** `create-next-app`이 프로젝트 생성 마지막 단계에서 `npm install`을 자동으로 실행한다. Step 0 실행 로그에서 확인 가능하다.

**답변:** `npm install`을 별도로 실행할 필요가 없었다. `npx create-next-app@latest`는 프로젝트 파일 생성 → 의존성 설치까지 한 번에 처리한다.  
`npm install`이 별도로 필요한 시점은 **git clone 이후**다. `node_modules/`는 `.gitignore`에 포함되어 저장소에 올라가지 않으므로, 다른 환경에서 프로젝트를 받으면 반드시 직접 실행해야 한다.

**관련 파일:** `frontend/package.json`, `frontend/node_modules/`

---

## [2026-06-17] Claude가 백그라운드로 실행한 서버는 어디서 돌고 있는가

**질문:** `npm run dev`를 백그라운드로 실행했는데 어디서 돌고 있는지, Claude가 자체 터미널을 가지고 있는지 궁금했다.

**답변:** Claude는 자체 샌드박스 터미널을 가지고 있다. 사용자의 VS Code 터미널과 완전히 별개다. 실행 로그는 `C:\Users\sgpar\AppData\Local\Temp\claude\...\tasks\{id}.output` 파일에 기록된다.  
단, 이 서버는 **Claude 세션이 살아있는 동안만 유지**되며, 세션이 끊기면 함께 종료된다.  
개발 서버는 VS Code 터미널(`Ctrl + `` ` ``)에서 직접 실행하는 것이 안전하다.

**관련 파일:** 해당 없음

---

## [2026-06-17] VS Code 터미널에서 npm run dev 실행 시 "Another next dev server is already running" 오류

**증상:** 사용자 터미널에서 `npm run dev` 실행 시 아래 오류 발생.
```
⨯ Another next dev server is already running.
- Local: http://localhost:3000
- PID:   31604
```

**원인:** Step 1에서 Claude 샌드박스가 백그라운드로 실행한 서버가 세션 종료 후에도 살아있어 포트 3000을 점유하고 있었다.

**해결:** 점유 중인 프로세스를 강제 종료 후 재실행.
```bash
taskkill /PID 31604 /F
npm run dev
```

**관련 파일:** 해당 없음
