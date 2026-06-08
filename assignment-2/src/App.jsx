import { useState, useRef } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'

// 날짜 키 생성 (YYYY-MM-DD) — step4에서 src/utils/date.js로 분리 예정
function formatDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ===========================
// App — 최상위 컴포넌트
// 상태를 보유하고, CRUD 함수를 자식 컴포넌트에 props로 전달한다.
// ===========================
function App() {
  // useState: 상태를 선언한다. 값이 바뀌면 React가 자동으로 컴포넌트를 다시 렌더링한다.
  // Vanilla JS의 `let todoList = []` + `render()` 호출에 해당한다.
  const [todoList, setTodoList] = useState([])

  // useRef: 렌더와 무관하게 값을 유지하는 컨테이너.
  // useState와 달리 값이 바뀌어도 리렌더를 유발하지 않는다.
  // nextId는 화면에 표시되지 않으므로 useRef가 적합하다.
  const nextId = useRef(1)

  // ── Create ──────────────────────────────────────────
  function createTodo(text) {
    const newTodo = {
      id: nextId.current++,
      text,
      completed: false,
      // 날짜는 데이터 모델에 포함하되, 필터링은 step4(일간 뷰)에서 구현한다.
      date: formatDateKey(new Date()),
    }
    // 상태를 직접 변경하지 않고 새 배열을 만들어 setTodoList에 전달한다.
    // React는 이전 배열과 새 배열을 비교하여 변경된 부분만 DOM에 반영한다.
    setTodoList(prev => [...prev, newTodo])
  }

  // ── Toggle Complete ──────────────────────────────────
  function toggleComplete(id) {
    // map으로 새 배열을 만든다. 해당 id만 completed를 반전시키고 나머지는 그대로 둔다.
    // 스프레드 연산자(...)로 기존 객체를 복사한 뒤 completed만 덮어쓴다.
    setTodoList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  // ── Save Edit ────────────────────────────────────────
  function saveEdit(id, newText) {
    setTodoList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, text: newText } : item
      )
    )
  }

  // ── Delete ───────────────────────────────────────────
  function deleteTodo(id) {
    // filter로 새 배열을 만든다. 해당 id를 제외한 나머지만 남긴다.
    setTodoList(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">Todo</h1>
        <p className="app-subtitle">오늘 할 일을 정리해보세요</p>
      </header>

      {/* TodoInput에 createTodo를 onAdd prop으로 전달 */}
      <TodoInput onAdd={createTodo} />

      <section className="list-section">
        <div className="list-header">
          <span className="todo-count">{todoList.length}개</span>
          <span className="todo-count-label">의 할 일</span>
        </div>
        {/* CRUD 핸들러를 모두 props로 전달한다. */}
        <TodoList
          todoList={todoList}
          onToggle={toggleComplete}
          onSave={saveEdit}
          onDelete={deleteTodo}
        />
      </section>
    </div>
  )
}

export default App
