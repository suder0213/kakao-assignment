# 3단계 학습 로그 — 상태별 필터링 마이그레이션

## 사용한 프롬프트

> 이제 3단계를 구현해줘

> 현재 filter 관련하여 전달되는 props 구조를 정리해줘

> 해당 내용에서 순서별로 보기 쉽게 정리한 다이어그램을 추가하여 문서에 삽입해줘



## 핵심 구현 내용 요약

- `App.jsx`에 `currentFilter` 상태 추가 (`useState('all')`)
- `filteredList`를 별도 state 없이 렌더 시점에 즉석 계산 (파생 상태 패턴)
- `src/components/FilterTabs.jsx` 신규 생성
- `TodoList.jsx`에 필터별 빈 상태 메시지 추가

---

## Vanilla JS와의 핵심 차이

### 1. 필터 탭 활성화 — DOM 순회 vs 조건식

Vanilla JS의 `updateFilterTabs()`는 모든 탭을 순회하며 직접 클래스를 추가/제거했다.

```js
// Vanilla JS
function updateFilterTabs() {
  filterTabEls.forEach(tab => {
    if (tab.dataset.filter === currentFilter) tab.classList.add('active')
    else tab.classList.remove('active')
  })
}
```

React에서는 렌더 시점에 조건식으로 클래스명을 계산한다. DOM을 건드리는 코드가 없다.

```jsx
// React — FilterTabs.jsx
<button className={`filter-tab${currentFilter === tab.key ? ' active' : ''}`}>
```

---

### 2. 파생 상태 (Derived State) — 별도 변수 vs 즉석 계산

Vanilla JS에서는 `getFilteredList()` 함수를 만들고 `render()` 안에서 호출하여 필터링된 배열을 얻었다.

```js
// Vanilla JS
function getFilteredList() {
  const byDate = todoList.filter(item => item.date === dateKey)
  if (currentFilter === 'active')    return byDate.filter(item => !item.completed)
  if (currentFilter === 'completed') return byDate.filter(item => item.completed)
  return byDate
}
// render() 안에서 호출
const filteredList = getFilteredList()
```

React에서 `filteredList`는 별도의 `useState`가 아니라 렌더 함수 본문에서 즉석으로 계산한다.
`todoList`나 `currentFilter`가 바뀌면 렌더가 자동으로 다시 실행되고, `filteredList`도 자연스럽게 최신 값이 된다.

```jsx
// React — App.jsx
// state가 아닌 일반 변수 — 렌더마다 새로 계산된다
const filteredList = todoList.filter(item => {
  if (currentFilter === 'active')    return !item.completed
  if (currentFilter === 'completed') return item.completed
  return true
})
```

이처럼 기존 state에서 계산할 수 있는 값을 별도 state로 관리하지 않는 것을
**파생 상태(Derived State)** 패턴이라고 한다.
`filteredList`를 state로 만들면 `todoList`와 `filteredList`가 동기화되지 않는 버그가 생길 수 있다.

---

### 3. 필터 변경 시 연쇄 호출 제거

Vanilla JS에서는 필터를 바꾸면 탭 업데이트 → 목록 렌더 → 주간 그리드 갱신까지 명시적으로 호출해야 했다.

```js
// Vanilla JS
function setCurrentFilter(filter) {
  currentFilter = filter
}
// 이벤트 리스너
tab.addEventListener('click', () => {
  setCurrentFilter(tab.dataset.filter)
  render()  // 모든 UI를 수동으로 갱신
})
```

React에서는 `setCurrentFilter` 하나만 호출하면 모든 관련 UI가 자동으로 갱신된다.

```jsx
// React — FilterTabs.jsx
<button onClick={() => onFilterChange(tab.key)}>

// App.jsx에서 onFilterChange로 setCurrentFilter를 그대로 전달
<FilterTabs currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
```

`setCurrentFilter(tab.key)` 한 번으로:
- `currentFilter` 상태 변경
- `filteredList` 재계산 (파생 상태)
- `FilterTabs` 탭 하이라이트 갱신
- `TodoList` 목록 갱신
- 카운터 숫자·레이블 갱신

이 모두가 하나의 리렌더에서 처리된다.

---

## 처음 등장한 React 개념

### setter 함수를 props로 직접 전달

`setCurrentFilter`는 React가 만들어준 함수다. 이것을 그대로 `onFilterChange` prop으로 넘겨줄 수 있다.
별도의 래퍼 함수를 만들지 않아도 된다.

```jsx
// 래퍼 함수 없이 setter를 직접 전달
<FilterTabs onFilterChange={setCurrentFilter} />

// FilterTabs 내부에서 호출하면 App의 state가 바뀐다
onClick={() => onFilterChange(tab.key)
```

### JSX에서 객체로 분기 처리

여러 조건에 따라 다른 JSX를 보여줄 때, `if/else` 대신 객체 맵을 활용하면 간결하다.

```jsx
const emptyMessageMap = {
  all:       <><p>아직 할 일이 없어요.</p><p>추가해보세요!</p></>,
  active:    <p>진행 중인 할 일이 없어요.</p>,
  completed: <p>완료된 할 일이 없어요.</p>,
}

return <div className="empty-state">{emptyMessageMap[currentFilter]}</div>
```

---

## 파일 구조 변화

```
src/
├── App.jsx              ← currentFilter state, filteredList 계산 추가
├── index.css
├── main.jsx
└── components/
    ├── FilterTabs.jsx   ← 신규 생성
    ├── TodoInput.jsx
    ├── TodoList.jsx     ← currentFilter prop 추가, 빈 상태 메시지 분기
    └── TodoItem.jsx
```


---

---

## 필터 props 흐름 다이어그램

### 컴포넌트 트리와 props

```
App
│  state: currentFilter
│  derived: filteredList = todoList.filter(...)
│
├── <FilterTabs
│     currentFilter={currentFilter}      → 탭 하이라이트 표시
│     onFilterChange={setCurrentFilter}  → 탭 클릭 시 state 변경
│   />
│
└── <section>
      <div class="list-header">
        {filteredList.length}개 · {countLabelMap[currentFilter]}
      </div>
      <TodoList
        todoList={filteredList}          → 이미 걸러진 배열
        currentFilter={currentFilter}   → 빈 메시지 분기용
      />
      └── <TodoItem />                  → 필터 관련 props 없음
```

---
> 
> ### 탭 클릭 시 순서별 흐름
> 
> ```
> ① 사용자가 "진행 중" 탭 클릭
>         │
>         ▼
> ② FilterTabs: onClick={() => onFilterChange('active')} 실행
>         │
>         ▼
> ③ App: setCurrentFilter('active') — currentFilter 상태 변경
>         │
>         ▼
> ④ React가 App 리렌더 실행
>         │
>         ├─▶ ⑤ filteredList 재계산
>         │         todoList.filter(item => !item.completed)
>         │
>         ├─▶ ⑥ FilterTabs 리렌더
>         │         'active' 탭에 .active 클래스 적용
>         │
>         ├─▶ ⑦ 카운터 갱신
>         │         filteredList.length + countLabelMap['active']
>         │
>         └─▶ ⑧ TodoList 리렌더
>                   filteredList(진행 중 항목만) 표시
>                   빈 상태면 "진행 중인 할 일이 없어요." 메시지
> ```
> 
> **핵심:** ③에서 state가 바뀌면 ④~⑧이 React에 의해 자동으로 실행된다.
> Vanilla JS에서는 `render()`를 명시적으로 호출해야 했고, 내부에서 각 함수를 순서대로 부르는 체인이 필요했다.
> 
---