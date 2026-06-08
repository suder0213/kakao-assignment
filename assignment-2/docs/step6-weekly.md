# 6단계 학습 로그 — 주간 뷰 마이그레이션

## 사용한 프롬프트

> 이제 마지막 6번을 구현해줘

---

## 핵심 구현 내용 요약

- `getWeekStart`, `getWeekDates`를 `src/utils/date.js`에 추가
- `src/components/WeekNav.jsx` 신규 생성 (DateNav 대체)
- `App.jsx`에서 `DateNav` → `WeekNav`로 교체, `todoList` prop 추가 전달
- 날짜 셀 클릭 시 `onDateChange` 호출 → 날짜 변경 + 필터 초기화

---

## Vanilla JS와의 핵심 차이

### 1. 주간 그리드 생성 — DOM 직접 조작 vs 배열 map

Vanilla JS의 `updateWeekDisplay()`는 그리드를 초기화(`innerHTML = ''`)한 뒤 `createElement`로 버튼을 하나씩 만들어 `appendChild`로 삽입했다.

```js
// Vanilla JS
weekGridEl.innerHTML = ''

weekDates.forEach((date, i) => {
  const btn = document.createElement('button')
  btn.className = 'day-cell'
  btn.innerHTML = `
    <span class="day-name">${dayNames[i]}</span>
    <span class="day-number">${date.getDate()}</span>
    ${count > 0 ? `<span class="day-count">${count}</span>` : ''}
  `
  btn.addEventListener('click', () => selectDate(dateKey))
  weekGridEl.appendChild(btn)
})
```

React에서는 `getWeekDates()`가 반환한 배열에 `.map()`을 적용하여 JSX 배열로 선언한다.
DOM을 직접 만지는 코드가 전혀 없다.

```jsx
// React — WeekNav.jsx
{weekDates.map((date, i) => (
  <button
    key={dateKey}
    className={`day-cell${isActive ? ' active' : ''}${isToday ? ' today' : ''}`}
    onClick={() => onDateChange(date)}
  >
    <span className="day-name">{dayNames[i]}</span>
    <span className="day-number">{date.getDate()}</span>
    {count > 0 && <span className="day-count">{count}</span>}
  </button>
))}
```

---

### 2. 날짜 셀 클릭 처리 — 전역 함수 vs props 콜백

Vanilla JS에서는 버튼을 만들 때 전역 함수 `selectDate`를 이벤트 리스너로 직접 등록했다.

```js
// Vanilla JS
btn.addEventListener('click', () => selectDate(dateKey))

function selectDate(dateKey) {
  setCurrentDate(dateKey)
  setCurrentFilter('all')
  render()
}
```

React에서는 부모(App)에서 내려준 `onDateChange` 콜백을 호출한다.
WeekNav는 날짜 변경 후 어떤 일이 일어나는지 알 필요가 없다.

```jsx
// App.jsx — 날짜 변경 + 필터 초기화를 래퍼 함수로 전달
<WeekNav
  onDateChange={(next) => {
    setCurrentDate(next)
    setCurrentFilter('all')
  }}
/>

// WeekNav.jsx — 콜백만 호출, 내부 로직 모름
onClick={() => onDateChange(date)}
```

---

### 3. 날짜별 Todo 개수 뱃지 — todoList prop

Vanilla JS에서는 `todoList`가 전역 변수였으므로 `updateWeekDisplay()` 안에서 바로 참조할 수 있었다.

```js
// Vanilla JS — 전역 변수 직접 참조
const count = todoList.filter(item => item.date === dateKey).length
```

React에서는 전역 변수가 없으므로, `App`이 `todoList`를 prop으로 전달해야 한다.
이때 `filteredList`가 아닌 **전체 `todoList`** 를 전달해야 뱃지가 필터 상태와 무관하게 올바른 개수를 보인다.

```jsx
// App.jsx — 필터와 무관한 전체 목록을 전달
<WeekNav todoList={todoList} ... />

// WeekNav.jsx — 날짜별 전체 개수 계산
const count = todoList.filter(item => item.date === dateKey).length
```

---

## 처음 등장한 React 개념

### 배열 .map()으로 반복 UI 생성

React에서 반복되는 UI를 만들 때는 배열의 `.map()`을 사용하여 JSX 배열을 반환한다.
각 항목에는 React가 변경을 추적할 수 있도록 고유한 `key` prop이 필요하다.

```jsx
{weekDates.map((date) => (
  <button key={formatDateKey(date)}>
    {date.getDate()}
  </button>
))}
```

`key`는 같은 레벨의 형제 요소 사이에서만 고유하면 된다.
날짜 문자열(`'2026-06-08'`)은 한 주 안에서 중복될 일이 없으므로 `key`로 적합하다.

---

### 조건부 렌더링 — && 연산자

뱃지처럼 조건이 참일 때만 렌더해야 하는 요소는 `&&` 연산자를 사용한다.

```jsx
{count > 0 && <span className="day-count">{count}</span>}
```

`count > 0`이 `false`면 React는 우변을 렌더하지 않는다.
`count`가 `0`이면 `0`이 화면에 출력되므로 반드시 불리언 조건(`count > 0`)으로 감싸야 한다.

```jsx
// 주의: count가 0이면 '0'이 화면에 출력됨
{count && <span>{count}</span>}

// 올바른 방법
{count > 0 && <span>{count}</span>}
```

---

## 파일 구조 변화

```
src/
├── App.jsx              ← DateNav → WeekNav 교체, todoList prop 추가 전달
├── index.css
├── main.jsx
├── components/
│   ├── WeekNav.jsx      ← 신규 생성 (DateNav 대체)
│   ├── DateNav.jsx      ← 더 이상 사용되지 않음 (삭제 가능)
│   ├── FilterTabs.jsx
│   ├── TodoInput.jsx
│   ├── TodoList.jsx
│   └── TodoItem.jsx
└── utils/
    └── date.js          ← getWeekStart, getWeekDates 추가
```
