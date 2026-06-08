# 4단계 학습 로그 — 일간 뷰 마이그레이션

## 사용한 프롬프트

> 이제 4단계를 구현해줘

> 현재 날짜를 바꿔도 필터상태는 all로 초기화되지 않는거 같은데, 그렇게 되는게 자연스러운거 같으니 해당 기능 추가해줘

> 문서에 반영해

---

## 핵심 구현 내용 요약

- 날짜 유틸 함수(`formatDateKey`, `formatDateDisplay`, `isSameDay`)를 `src/utils/date.js`로 분리
- `App.jsx`에 `currentDate` 상태 추가 (`useState(new Date())`)
- `filteredList` 계산을 날짜 필터(1단계) → 상태 필터(2단계) 순으로 변경
- `createTodo`가 `currentDate` 기준으로 날짜를 저장하도록 수정
- `src/components/DateNav.jsx` 신규 생성 (이전/다음 날 이동)
- 날짜 변경 시 필터를 `'all'`로 초기화 (추가 구현)

---

## Vanilla JS와의 핵심 차이

### 1. 날짜 변경 → 자동 필터 반영

Vanilla JS에서는 날짜가 바뀌면 필터링과 렌더링을 명시적으로 연결해야 했다.

```js
// Vanilla JS
function selectDate(dateKey) {
  setCurrentDate(dateKey)   // 상태 변경
  setCurrentFilter('all')   // 필터 초기화
  render()                  // 렌더 트리거
}
```

React에서는 `setCurrentDate`만 호출하면 `currentDate`를 참조하는 모든 파생 계산이 자동으로 최신화된다.

```jsx
// React — DateNav.jsx
function moveDay(offset) {
  const next = new Date(currentDate)
  next.setDate(next.getDate() + offset)
  onDateChange(next)  // setCurrentDate 호출 — 이후는 React가 처리
}
```

`onDateChange(next)` 한 번으로:
- `currentDate` 상태 변경
- `dateKey` 재계산
- `filteredList` 재계산 (날짜 + 상태 필터 동시 적용)
- `DateNav` 날짜 텍스트 갱신
- `TodoList` 목록 갱신

---

### 2. 2단계 필터링 — 함수 체인 vs 메서드 체이닝

Vanilla JS에서는 `getFilteredList()` 함수 안에서 단계별로 변수에 담았다.

```js
// Vanilla JS
function getFilteredList() {
  const dateKey = formatDateKey(currentDate)
  const byDate  = todoList.filter(item => item.date === dateKey)  // 1단계
  if (currentFilter === 'active') return byDate.filter(...)       // 2단계
  ...
}
```

React에서는 배열 메서드를 체이닝하여 한 표현식으로 작성한다.

```jsx
// React — App.jsx
const dateKey = formatDateKey(currentDate)
const filteredList = todoList
  .filter(item => item.date === dateKey)       // 1단계: 날짜 필터
  .filter(item => {                            // 2단계: 상태 필터
    if (currentFilter === 'active')    return !item.completed
    if (currentFilter === 'completed') return item.completed
    return true
  })
```

`todoList`, `currentDate`, `currentFilter` 중 어느 하나라도 바뀌면 이 계산이 자동으로 다시 실행된다.

---

### 3. 유틸 함수 분리 — 전역 함수 vs ES 모듈

Vanilla JS에서는 `formatDateKey` 같은 유틸 함수가 `app.js` 전역 스코프에 선언되었다.

React 프로젝트에서는 ES 모듈(`import` / `export`)로 파일을 분리하고 필요한 곳에서만 가져다 쓴다.
전역 스코프를 오염시키지 않고, 어디서 사용되는지 명확하게 추적할 수 있다.

```js
// src/utils/date.js
export function formatDateKey(date) { ... }
export function formatDateDisplay(date) { ... }
export function isSameDay(a, b) { ... }

// 사용하는 곳에서 명시적으로 import
import { formatDateKey, formatDateDisplay } from '../utils/date'
```

---

### 4. 날짜 변경 시 필터 초기화

날짜가 바뀌면 이전 날짜에서 선택했던 필터('진행 중', '완료')가 그대로 유지되는 것이 어색하다.
`onDateChange`에 setter를 직접 넘기는 대신 래퍼 함수를 전달하여 두 state를 함께 변경한다.

```jsx
// App.jsx
<DateNav
  currentDate={currentDate}
  onDateChange={(next) => {
    setCurrentDate(next)
    setCurrentFilter('all')  // 날짜 이동 시 필터 초기화
  }}
/>
```

React는 한 이벤트 핸들러 안에서 발생한 여러 state 변경을 하나의 리렌더로 묶어 처리한다.
`setCurrentDate`와 `setCurrentFilter`가 각각 리렌더를 유발하는 것이 아니라,
두 변경이 완료된 뒤 리렌더가 한 번만 실행된다.

---

## 처음 등장한 React 개념

### Date 객체를 state로 관리할 때 주의점

`new Date()` 객체는 참조 타입이다. 날짜를 이동할 때 기존 객체를 직접 수정하면 React가 변경을 감지하지 못한다.

```jsx
// 잘못된 방법 — 같은 참조이므로 React가 변경을 감지하지 못함
function moveDay(offset) {
  currentDate.setDate(currentDate.getDate() + offset)  // 직접 변경
  onDateChange(currentDate)  // 같은 객체 참조 → 리렌더 안 일어남
}

// 올바른 방법 — 새 Date 객체 생성
function moveDay(offset) {
  const next = new Date(currentDate)  // 복사
  next.setDate(next.getDate() + offset)
  onDateChange(next)  // 새 참조 → 리렌더 발생
}
```

---

## 파일 구조 변화

```
src/
├── App.jsx              ← currentDate state 추가, filteredList 2단계 필터링
├── index.css
├── main.jsx
├── components/
│   ├── DateNav.jsx      ← 신규 생성 (step6에서 WeekNav로 교체 예정)
│   ├── FilterTabs.jsx
│   ├── TodoInput.jsx
│   ├── TodoList.jsx
│   └── TodoItem.jsx
└── utils/
    └── date.js          ← 신규 생성 (formatDateKey, formatDateDisplay, isSameDay)
```
