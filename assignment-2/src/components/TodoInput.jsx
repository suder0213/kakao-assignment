import { useState } from 'react'

// ===========================
// TodoInput — 입력창 + 추가 버튼
// props: onAdd(text) — 텍스트를 받아 Todo를 생성하는 함수 (App에서 전달)
// ===========================
function TodoInput({ onAdd }) {
  // 입력창 값을 React 상태로 관리한다 — "제어 컴포넌트(Controlled Component)" 방식.
  // input의 value를 state와 동기화하여 React가 항상 입력값을 알고 있도록 한다.
  // Vanilla JS에서는 `document.getElementById('todoInput').value`로 직접 읽었지만,
  // React에서는 state에서 읽는다.
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(false)

  function handleAdd() {
    const text = inputValue.trim()
    if (!text) {
      setError(true)
      return
    }
    onAdd(text)
    setInputValue('')
    setError(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  function handleChange(e) {
    setInputValue(e.target.value)
    // 입력이 생기면 에러 메시지를 즉시 제거한다.
    if (e.target.value.trim()) setError(false)
  }

  return (
    <section className="input-section">
      <div className="input-wrapper">
        <input
          type="text"
          className="todo-input"
          placeholder="할 일을 입력하세요"
          maxLength={100}
          // value와 onChange를 함께 써야 제어 컴포넌트가 된다.
          // value만 있고 onChange가 없으면 읽기 전용이 된다.
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-add" onClick={handleAdd}>추가</button>
      </div>
      {/* 조건부 렌더링: error가 true일 때만 에러 메시지를 렌더링한다.
          Vanilla JS의 classList.add/remove('hidden') 대신
          JSX에서는 표현식으로 요소 자체를 조건부로 포함시킨다. */}
      {error && <p className="error-message">할 일을 입력해주세요.</p>}
    </section>
  )
}

export default TodoInput
