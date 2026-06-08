import { useState, useRef } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import FilterTabs from './components/FilterTabs'
import DateNav from './components/DateNav'
import { formatDateKey } from './utils/date'

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

  // 현재 선택된 필터 상태
  const [currentFilter, setCurrentFilter] = useState('all')

  // 현재 선택된 날짜 상태 — 앱 시작 시 오늘로 초기화
  const [currentDate, setCurrentDate] = useState(new Date())

  // ── 파생 상태 (Derived State) ─────────────────────────
  // filteredList는 별도의 state가 아니라 매 렌더마다 계산한다.
  // step4부터 날짜 필터(1단계)와 상태 필터(2단계)를 순서대로 적용한다.
  const dateKey = formatDateKey(currentDate)
  const filteredList = todoList
    // 1단계: 선택된 날짜의 Todo만 추린다
    .filter(item => item.date === dateKey)
    // 2단계: 상태 필터 적용
    .filter(item => {
      if (currentFilter === 'active')    return !item.completed
      if (currentFilter === 'completed') return item.completed
      return true
    })

  const countLabelMap = {
    all:       '의 할 일',
    active:    '의 진행 중인 할 일',
    completed: '의 완료된 할 일',
  }

  // ── Create ──────────────────────────────────────────
  function createTodo(text) {
    const newTodo = {
      id: nextId.current++,
      text,
      completed: false,
      // 현재 선택된 날짜에 Todo를 추가한다.
      // step3까지는 항상 오늘 날짜였지만, step4부터 currentDate를 기준으로 한다.
      date: formatDateKey(currentDate),
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

      {/* 일간 날짜 네비게이터 — step6에서 WeekNav로 교체 예정 */}
      {/* 날짜가 바뀌면 필터를 'all'로 초기화한다. */}
      <DateNav
        currentDate={currentDate}
        onDateChange={(next) => {
          setCurrentDate(next)
          setCurrentFilter('all')
        }}
      />

      <TodoInput onAdd={createTodo} />

      <section className="list-section">
        {/* 필터 탭: 현재 필터값과 변경 함수를 props로 전달 */}
        <FilterTabs currentFilter={currentFilter} onFilterChange={setCurrentFilter} />

        <div className="list-header">
          <span className="todo-count">{filteredList.length}개</span>
          <span className="todo-count-label">{countLabelMap[currentFilter]}</span>
        </div>

        {/* filteredList를 전달하므로 TodoList는 필터 로직을 알 필요가 없다 */}
        <TodoList
          todoList={filteredList}
          currentFilter={currentFilter}
          onToggle={toggleComplete}
          onSave={saveEdit}
          onDelete={deleteTodo}
        />
      </section>
    </div>
  )
}

export default App
