# 2단계 학습 로그 — Todo CRUD 마이그레이션

## 사용한 프롬프트

> 이제 문서를 다시 검토하고 2단계를 구현하자

---

## 핵심 구현 내용 요약

- `App.jsx`에 `todoList` (`useState`), `nextId` (`useRef`) 상태 선언
- `createTodo`, `toggleComplete`, `saveEdit`, `deleteTodo` 함수 구현
- `src/components/TodoInput.jsx` — 제어 컴포넌트 방식의 입력창
- `src/components/TodoList.jsx` — 배열을 `.map()`으로 렌더링
- `src/components/TodoItem.jsx` — `isEditing` 상태로 수정 모드 전환

---

## Vanilla JS와의 핵심 차이

### 1. 상태 변경 → 자동 리렌더

Vanilla JS에서는 상태를 바꾼 뒤 `render()`를 명시적으로 호출해야 했다.

```js
// Vanilla JS
function deleteTodo(id) {
  todoList = todoList.filter(item => item.id !== id)
  saveToStorage()
  render()  // ← 직접 호출해야 화면이 바뀜
}
```

React에서는 `setTodoList`를 호출하는 것만으로 React가 자동으로 리렌더한다.

```jsx
// React
function deleteTodo(id) {
  setTodoList(prev => prev.filter(item => item.id !== id))
  // render() 호출 없음 — 상태 변경이 곧 렌더 트리거
}
```

---

### 2. 상태 불변성 — 직접 수정 금지

Vanilla JS에서는 배열이나 객체를 직접 수정했다.

```js
// Vanilla JS
const todo = todoList.find(item => item.id === id)
todo.completed = !todo.completed  // 직접 변경
```

React에서는 기존 상태를 직접 변경하지 않고 **새 배열/객체를 만들어 전달**한다.
React는 이전 참조와 새 참조를 비교(`===`)하여 변경을 감지하기 때문에, 직접 변경하면 리렌더가 일어나지 않는다.

```jsx
// React
setTodoList(prev =>
  prev.map(item =>
    item.id === id ? { ...item, completed: !item.completed } : item
    //               ↑ 스프레드로 복사 후 completed만 덮어쓴다
  )
)
```

---

### 3. 수정 모드 — DOM 조작 vs 상태 전환

Vanilla JS의 `startEdit()`은 DOM을 직접 조작하여 `<span>`을 `<input>`으로 교체했다.

```js
// Vanilla JS
const textEl = listItem.querySelector('.todo-text')
const editInput = document.createElement('input')
listItem.replaceChild(editInput, textEl)  // DOM 직접 수정
```

React에서는 `isEditing` 상태값 하나만 바꾸면 JSX가 알아서 다른 UI를 렌더링한다.

```jsx
// React — TodoItem.jsx
const [isEditing, setIsEditing] = useState(false)

{isEditing ? (
  <input className="edit-input" ... />  // 수정 모드
) : (
  <span className="todo-text">{todo.text}</span>  // 일반 모드
)}
```

---

### 4. XSS 방지 — 수동 vs 자동

Vanilla JS에서는 `innerHTML`에 값을 삽입할 때 XSS 공격을 막기 위해 `escapeHtml()` 함수를 직접 만들어 써야 했다.

```js
// Vanilla JS
li.innerHTML = `<span class="todo-text">${escapeHtml(todo.text)}</span>`
```

React는 JSX에 삽입되는 모든 값을 자동으로 이스케이프한다.

```jsx
// React — escapeHtml 불필요
<span className="todo-text">{todo.text}</span>
```

---

### 5. 이벤트 핸들러 — 전역 함수 vs props

Vanilla JS에서는 동적으로 생성한 HTML 문자열에 전역 함수 이름을 문자열로 삽입했다.

```js
// Vanilla JS — 전역 함수 참조를 문자열로 삽입
li.innerHTML = `<button onclick="toggleComplete(${todo.id})">완료</button>`
```

React에서는 `onClick`에 함수 참조를 직접 전달한다. 전역 함수가 필요 없다.

```jsx
// React
<button onClick={() => onToggle(todo.id)}>완료</button>
```

---

## 처음 등장한 React 개념

### `useState`

컴포넌트의 상태를 선언한다. `[현재값, 변경함수]` 쌍을 반환한다.
변경 함수를 호출하면 React가 컴포넌트를 다시 렌더링한다.

```jsx
const [todoList, setTodoList] = useState([])
//     ↑ 현재값   ↑ 변경 함수   ↑ 초기값
```

### `useRef`

렌더와 무관하게 값을 유지하는 컨테이너다. `.current` 프로퍼티로 값에 접근한다.
`useState`와 달리 값이 바뀌어도 리렌더를 유발하지 않는다.
화면에 표시되지 않는 `nextId`처럼 순수한 내부 카운터에 적합하다.

```jsx
const nextId = useRef(1)
nextId.current++  // 렌더 없이 값만 증가
```

### 제어 컴포넌트 (Controlled Component)

`input`의 `value`를 state로 연결하고, `onChange`로 state를 업데이트하는 패턴이다.
React가 항상 입력값을 state에서 읽고 쓰기 때문에 "Single Source of Truth"가 유지된다.

```jsx
const [inputValue, setInputValue] = useState('')

<input
  value={inputValue}           // state에서 읽기
  onChange={e => setInputValue(e.target.value)}  // state에 쓰기
/>
```

### props

부모 컴포넌트가 자식 컴포넌트에 데이터나 함수를 전달하는 방법이다.
Vanilla JS에서 전역 변수나 DOM `data-*` 속성으로 데이터를 공유하던 방식을 대체한다.

```jsx
// 부모: 함수를 prop으로 전달
<TodoList onDelete={deleteTodo} />

// 자식: prop으로 받아 사용
function TodoList({ onDelete }) {
  return <button onClick={() => onDelete(id)}>삭제</button>
}
```

### Fragment (`<>...</>`)

여러 요소를 DOM에 추가 노드 없이 묶어야 할 때 사용한다.
JSX는 반드시 하나의 루트 요소를 반환해야 하는데, 불필요한 `<div>`로 감싸고 싶지 않을 때 Fragment를 쓴다.

```jsx
<>
  <button>저장</button>
  <button>삭제</button>
</>
```

### `key` prop

리스트를 렌더링할 때 React가 각 항목을 구분하기 위해 사용하는 고유값이다.
`key`가 없으면 항목이 추가/삭제/이동될 때 React가 어떤 항목이 변했는지 파악하지 못해 불필요한 DOM 업데이트가 일어난다.

```jsx
todoList.map(todo => (
  <TodoItem key={todo.id} todo={todo} />
  //         ↑ 고유한 id를 key로 사용
))
```

---

## 파일 구조 변화

```
src/
├── App.jsx              ← 상태 + CRUD 함수 + 컴포넌트 조립
├── index.css
├── main.jsx
└── components/          ← 신규 생성
    ├── TodoInput.jsx
    ├── TodoList.jsx
    └── TodoItem.jsx
```
