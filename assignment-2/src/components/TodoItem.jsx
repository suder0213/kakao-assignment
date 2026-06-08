import { useState } from 'react'

// ===========================
// TodoItem — 개별 Todo 항목
// props: todo, onToggle, onSave, onDelete
// ===========================
function TodoItem({ todo, onToggle, onSave, onDelete }) {
  // 수정 모드 여부를 로컬 상태로 관리한다.
  // Vanilla JS에서는 startEdit()이 DOM을 직접 조작하여 <span>을 <input>으로 교체했지만,
  // React에서는 isEditing 상태값에 따라 JSX가 다른 요소를 렌더링한다.
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)

  function handleSave() {
    const text = editValue.trim()
    if (!text) return
    onSave(todo.id, text)
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      {/* isEditing에 따라 텍스트 또는 입력창을 조건부 렌더링 */}
      {isEditing ? (
        <input
          className="edit-input"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          // autoFocus: 수정 모드 진입 시 자동으로 포커스.
          // Vanilla JS의 editInput.focus()에 해당한다.
          autoFocus
        />
      ) : (
        // React는 JSX에 삽입되는 문자열을 자동으로 이스케이프한다.
        // Vanilla JS의 escapeHtml() 함수가 필요 없다.
        <span className="todo-text">{todo.text}</span>
      )}

      <div className="todo-actions">
        {isEditing ? (
          // 수정 모드: 저장 + 삭제 버튼
          // <>...</>는 Fragment — DOM에 추가 노드 없이 여러 요소를 묶는다.
          <>
            <button className="btn btn-save" onClick={handleSave}>저장</button>
            <button className="btn btn-delete" onClick={() => onDelete(todo.id)}>삭제</button>
          </>
        ) : (
          // 일반 모드: 완료 + 수정 + 삭제 버튼
          // Vanilla JS에서는 onclick="toggleComplete(${todo.id})" 처럼 HTML 문자열에 함수명을 삽입했지만,
          // React에서는 onClick에 함수 참조를 직접 전달한다. 전역 함수가 필요 없다.
          <>
            <button className="btn btn-complete" onClick={() => onToggle(todo.id)}>
              {todo.completed ? '취소' : '완료'}
            </button>
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>수정</button>
            <button className="btn btn-delete" onClick={() => onDelete(todo.id)}>삭제</button>
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
