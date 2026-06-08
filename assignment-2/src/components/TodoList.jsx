import TodoItem from './TodoItem'

// ===========================
// TodoList — Todo 목록
// props: todoList, onToggle, onSave, onDelete
// ===========================
function TodoList({ todoList, onToggle, onSave, onDelete }) {
  if (todoList.length === 0) {
    return (
      <div className="empty-state">
        <p>아직 할 일이 없어요.</p>
        <p>새로운 할 일을 추가해보세요!</p>
      </div>
    )
  }

  return (
    // todoList 배열을 .map()으로 순회하여 각 항목을 TodoItem 컴포넌트로 변환한다.
    // Vanilla JS의 filteredList.forEach(todo => { todoListEl.appendChild(li) })에 해당한다.
    <ul className="todo-list">
      {todoList.map(todo => (
        // key: React가 리스트 항목을 구분하기 위해 필요한 고유값.
        // key가 없으면 항목 순서가 바뀔 때 React가 어떤 항목이 변했는지 파악하지 못한다.
        // key는 렌더링 시 React 내부에서만 사용되며 props로 전달되지 않는다.
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
