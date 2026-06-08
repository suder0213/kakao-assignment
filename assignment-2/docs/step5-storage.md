# 5단계 학습 로그 — 로컬스토리지 연동 마이그레이션

## 사용한 프롬프트

> 이제 다시 문서와 코드를 검토하고 5단계를 구현해줘

---

## 핵심 구현 내용 요약

- `useState` lazy initializer로 로컬스토리지에서 초기 데이터 로드
- `nextId` 초기값을 로드된 데이터 기반으로 계산 (ID 충돌 방지)
- `useEffect([todoList])`로 `todoList`가 바뀔 때마다 자동 저장
- 각 CRUD 함수에서 `saveToStorage()` 직접 호출하던 방식 제거

---

## Vanilla JS와의 핵심 차이

### 1. 저장 — 분산 호출 vs 중앙 집중 처리

Vanilla JS에서는 상태를 바꾸는 모든 함수 끝마다 `saveToStorage()`를 직접 호출해야 했다.

```js
// Vanilla JS — CRUD 함수마다 명시적 호출 필요
function createTodo() {
  todoList.push(newTodo)
  saveToStorage()  // ← 잊으면 저장 안 됨
  render()
}

function toggleComplete(id) {
  todo.completed = !todo.completed
  saveToStorage()  // ← 잊으면 저장 안 됨
  render()
}

function deleteTodo(id) {
  todoList = todoList.filter(...)
  saveToStorage()  // ← 잊으면 저장 안 됨
  render()
}
```

React에서는 `useEffect`로 `todoList`가 바뀔 때마다 자동으로 저장한다.  
CRUD 함수에는 저장 로직이 전혀 없어도 된다.

```jsx
// React — 한 곳에서만 관리
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList))
}, [todoList])

// createTodo, toggleComplete, deleteTodo — saveToStorage() 호출 없음
```

---

### 2. 초기 로드 — 함수 호출 vs lazy initializer

Vanilla JS에서는 파일 맨 아래에서 `loadFromStorage()`를 명시적으로 호출하여 초기화했다.

```js
// Vanilla JS — 스크립트 최하단에서 순서를 맞춰 실행
loadFromStorage()  // 1. 먼저 데이터 복원
render()           // 2. 그 다음 화면 그리기
```

React에서는 `useState`의 **lazy initializer**를 사용한다.  
초기값 자리에 함수를 전달하면 첫 렌더 시 딱 한 번만 실행되고, 이후 리렌더에서는 실행되지 않는다.

```jsx
// React — 상태 선언과 초기 로드를 한 줄로
const [todoList, setTodoList] = useState(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
})
```

---

### 3. nextId 재설정 — useEffect vs 즉시 계산

Vanilla JS에서는 `loadFromStorage()` 안에서 `nextId`를 재설정했다.

```js
// Vanilla JS
function loadFromStorage() {
  todoList = JSON.parse(saved)
  if (todoList.length > 0) {
    nextId = Math.max(...todoList.map(item => item.id)) + 1
  }
}
```

React에서는 hooks가 선언 순서대로 실행되는 특성을 이용한다.  
`useState`가 먼저 실행되어 `todoList`가 확정된 뒤 `useRef`가 실행되므로,  
`useRef`의 초기값 계산식에서 `todoList`를 바로 참조할 수 있다.

```jsx
// React — hooks 실행 순서를 활용한 초기화
const [todoList, setTodoList] = useState(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
})

// todoList가 이미 확정된 상태이므로 바로 참조 가능
const nextId = useRef(
  todoList.length > 0
    ? Math.max(...todoList.map(item => item.id)) + 1
    : 1
)
```

---

## 처음 등장한 React 개념

### useEffect와 의존성 배열

`useEffect(fn, deps)`는 렌더 결과가 화면에 반영된 뒤 `fn`을 실행한다.  
`deps`(의존성 배열)의 값이 이전 렌더와 달라졌을 때만 재실행된다.

```
deps 패턴       실행 시점
────────────────────────────────────────
[]             마운트 시 딱 한 번
[todoList]     마운트 + todoList가 바뀔 때마다
(생략)          매 렌더마다 (무한 루프 위험)
```

이번 단계에서 `[todoList]`를 의존성으로 쓰면:
- 마운트 시 한 번 (초기 빈 배열 or 로드된 데이터를 저장)
- 이후 todoList가 변경될 때마다 자동 저장

---

### useState lazy initializer

`useState(initialValue)`에 값 대신 **함수**를 전달하면 lazy initializer로 동작한다.

```jsx
// 값 전달: 매 렌더마다 표현식이 평가됨 (무거운 계산이면 낭비)
const [list, setList] = useState(JSON.parse(localStorage.getItem(KEY)) || [])

// 함수 전달: 첫 렌더 시 한 번만 실행됨 (lazy)
const [list, setList] = useState(() => {
  const saved = localStorage.getItem(KEY)
  return saved ? JSON.parse(saved) : []
})
```

`localStorage.getItem()`은 실제로 가벼운 작업이지만,  
초기화 목적임을 명시하고 불필요한 반복 실행을 막기 위해 lazy initializer가 관례적으로 사용된다.

---

## 파일 구조 변화

```
src/
├── App.jsx              ← useEffect 추가, useState lazy initializer로 초기 로드
├── index.css
├── main.jsx
├── components/
│   ├── DateNav.jsx
│   ├── FilterTabs.jsx
│   ├── TodoInput.jsx
│   ├── TodoList.jsx
│   └── TodoItem.jsx
└── utils/
    └── date.js
```

이번 단계에서 신규 파일은 없고, `App.jsx`에만 변경이 생겼다.
