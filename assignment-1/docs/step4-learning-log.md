# 4단계 학습 로그 — 로컬스토리지 연동

## 구현 요약

- `saveToStorage()` — CRUD 발생 시마다 `todoList`를 로컬스토리지에 저장
- `loadFromStorage()` — 페이지 로드 시 저장된 데이터를 불러와 `todoList` 복원
- `nextId` 재설정 — 불러온 항목 중 가장 큰 id + 1로 초기화하여 ID 충돌 방지
- `STORAGE_KEY` 상수로 키 이름 관리하여 오타 방지

---

## 심화 정리

### 로컬스토리지란?

브라우저가 제공하는 클라이언트 사이드 저장소. 같은 도메인 내에서만 접근 가능하며, 서버와는 무관하게 브라우저 로컬에 저장된다.

```js
localStorage.setItem('key', 'value') // 저장
localStorage.getItem('key')          // 읽기
localStorage.removeItem('key')       // 특정 항목 삭제
localStorage.clear()                 // 전체 삭제
```

**실제 저장 위치**

브라우저가 관리하는 로컬 데이터베이스 파일에 저장된다. 크롬 기준으로 아래 경로에 위치한다.

```
C:\Users\{사용자명}\AppData\Local\Google\Chrome\User Data\Default\Local Storage\
```

**브라우저를 닫아도 유지되나?**

유지된다. 파일에 저장되기 때문에 브라우저를 닫거나 컴퓨터를 재시작해도 사라지지 않는다. 명시적으로 삭제하거나 크롬 개발자 도구 → Application → Local Storage에서 직접 지우기 전까지 반영구적으로 남는다.

**쿠키 / 캐시 / 세션스토리지와의 차이**

| | 로컬스토리지 | 쿠키 | 캐시 | 세션스토리지 |
|---|---|---|---|---|
| 서버 전송 | 안 됨 | 매 요청마다 자동 전송 | 안 됨 | 안 됨 |
| 만료 기한 | 없음 (영구) | 설정 가능 | 브라우저 자동 관리 | 탭 닫으면 삭제 |
| 용량 | 약 5MB | 약 4KB | 브라우저 설정에 따라 다름 | 약 5MB |
| 저장 목적 | JS 앱 데이터 | 인증 토큰, 세션 | 이미지/CSS/JS 파일 | 탭 단위 임시 데이터 |

- **쿠키** — 서버에 요청할 때마다 헤더에 자동으로 붙어 전송된다. 로그인 상태 유지에 쓰이는 이유다.
- **캐시** — 이미지, CSS, JS 같은 정적 파일을 재다운로드하지 않도록 임시 보관하는 곳으로, 데이터 저장 용도가 아니다.
- **세션스토리지** — API는 로컬스토리지와 동일하지만 탭(브라우저 창)을 닫으면 삭제된다.

### 로컬스토리지는 문자열만 저장 가능

로컬스토리지는 문자열만 저장할 수 있다. JS 배열/객체를 그대로 넣으면 `[object Object]`로 변환되어 데이터가 깨진다.

```js
localStorage.setItem('list', todoList) // → "[object Object]" 로 저장됨 (잘못된 방법)
```

`JSON.stringify` / `JSON.parse`로 변환하여 저장하고 불러온다.

```js
// 저장: 배열 → JSON 문자열
localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList))
// '[{"id":1,"text":"공부","completed":false,"date":"2026-06-01"}]'

// 읽기: JSON 문자열 → 배열
todoList = JSON.parse(localStorage.getItem(STORAGE_KEY))
```

### `nextId` 재설정이 필요한 이유

`nextId`는 메모리에만 존재하는 변수라 페이지를 새로고침하면 `1`로 초기화된다. 저장된 Todo가 이미 id `1`, `2`, `3`을 쓰고 있는데 `nextId`가 `1`이면, 새로 추가한 Todo의 id가 기존 항목과 충돌한다.

```js
// 불러온 항목 중 가장 큰 id를 찾아 그 다음 값으로 설정
nextId = Math.max(...todoList.map((item) => item.id)) + 1;
```

`...` (스프레드 연산자)로 배열을 개별 값으로 펼쳐서 `Math.max`에 전달한다.

```js
todoList.map((item) => item.id)     // [1, 2, 3]
Math.max(...[1, 2, 3])              // Math.max(1, 2, 3) → 3
nextId = 3 + 1                      // 4
```

### `STORAGE_KEY`를 상수로 분리한 이유

키 이름을 문자열로 여러 곳에 직접 쓰면 오타가 생겼을 때 데이터를 읽지 못하는 버그가 생긴다. 상수 하나로 관리하면 오타가 있어도 에러가 발생해서 바로 발견할 수 있다.

```js
const STORAGE_KEY = 'todo-app-list';

localStorage.setItem(STORAGE_KEY, ...)  // 일관되게 같은 키 사용
localStorage.getItem(STORAGE_KEY)
```
