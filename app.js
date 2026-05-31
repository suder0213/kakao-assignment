// ===========================
// 상태 관리
// ===========================

// Todo 항목 배열 (각 항목: { id, text, completed })
let todoList = [];

// 고유 ID 생성을 위한 카운터
let nextId = 1;


// ===========================
// DOM 요소 참조
// ===========================

const todoInput    = document.getElementById('todoInput');
const addButton    = document.getElementById('addButton');
const errorMessage = document.getElementById('errorMessage');
const todoListEl   = document.getElementById('todoList');
const todoCountEl  = document.getElementById('todoCount');
const emptyStateEl = document.getElementById('emptyState');


// ===========================
// 핵심 CRUD 함수
// ===========================

/**
 * Todo 생성
 * - 입력값이 비어있으면 에러 메시지를 표시하고 중단
 * - 공백만 있는 입력도 빈 값으로 처리
 */
function createTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    showError('할 일을 입력해주세요.');
    return;
  }

  // 새 Todo 객체 생성
  const newTodo = {
    id: nextId++,
    text: text,
    completed: false,
  };

  todoList.push(newTodo);
  todoInput.value = '';
  hideError();
  renderTodoList();
}

/**
 * Todo 완료 토글
 * @param {number} id - 완료 상태를 바꿀 Todo의 ID
 */
function toggleComplete(id) {
  const todo = todoList.find((item) => item.id === id);
  if (!todo) return;

  todo.completed = !todo.completed;
  renderTodoList();
}

/**
 * Todo 수정 시작 — 텍스트를 인라인 입력창으로 교체
 * @param {number} id - 수정할 Todo의 ID
 */
function startEdit(id) {
  const todo = todoList.find((item) => item.id === id);
  if (!todo) return;

  const listItem = document.querySelector(`[data-id="${id}"]`);
  if (!listItem) return;

  // 텍스트 영역을 인라인 입력창으로 교체
  const textEl = listItem.querySelector('.todo-text');
  const actionsEl = listItem.querySelector('.todo-actions');

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = todo.text;
  editInput.maxLength = 100;

  // 기존 텍스트 요소를 입력창으로 교체
  listItem.replaceChild(editInput, textEl);
  editInput.focus();

  // 버튼을 '저장' 하나로 교체
  actionsEl.innerHTML = `
    <button class="btn btn-save" onclick="saveEdit(${id})">저장</button>
    <button class="btn btn-delete" onclick="deleteTodo(${id})">삭제</button>
  `;

  // Enter 키로도 저장 가능
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit(id);
  });
}

/**
 * Todo 수정 저장
 * @param {number} id - 저장할 Todo의 ID
 */
function saveEdit(id) {
  const listItem = document.querySelector(`[data-id="${id}"]`);
  if (!listItem) return;

  const editInput = listItem.querySelector('.edit-input');
  const newText = editInput ? editInput.value.trim() : '';

  if (!newText) {
    editInput.focus();
    return;
  }

  const todo = todoList.find((item) => item.id === id);
  if (todo) todo.text = newText;

  renderTodoList();
}

/**
 * Todo 삭제
 * @param {number} id - 삭제할 Todo의 ID
 */
function deleteTodo(id) {
  todoList = todoList.filter((item) => item.id !== id);
  renderTodoList();
}


// ===========================
// 렌더링 함수
// ===========================

/**
 * todoList 배열을 기반으로 전체 목록을 다시 그림
 */
function renderTodoList() {
  // 목록 초기화
  todoListEl.innerHTML = '';

  // 빈 상태 / 목록 가시성 제어
  if (todoList.length === 0) {
    emptyStateEl.classList.remove('hidden');
  } else {
    emptyStateEl.classList.add('hidden');
  }

  // 카운터 업데이트
  todoCountEl.textContent = `${todoList.length}개`;

  // 각 Todo 항목을 <li>로 생성하여 목록에 추가
  todoList.forEach((todo) => {
    const li = createTodoElement(todo);
    todoListEl.appendChild(li);
  });
}

/**
 * Todo 객체 하나를 <li> DOM 요소로 변환
 * @param {object} todo - { id, text, completed }
 * @returns {HTMLElement} 생성된 <li> 요소
 */
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' completed' : ''}`;
  li.dataset.id = todo.id; // 이후 DOM 탐색 시 ID로 항목 식별

  // 완료 버튼 텍스트: 완료 여부에 따라 다르게 표시
  const completeLabel = todo.completed ? '취소' : '완료';

  li.innerHTML = `
    <span class="todo-text">${escapeHtml(todo.text)}</span>
    <div class="todo-actions">
      <button class="btn btn-complete" onclick="toggleComplete(${todo.id})">${completeLabel}</button>
      <button class="btn btn-edit" onclick="startEdit(${todo.id})">수정</button>
      <button class="btn btn-delete" onclick="deleteTodo(${todo.id})">삭제</button>
    </div>
  `;

  return li;
}


// ===========================
// 유틸리티 함수
// ===========================

/**
 * XSS 방지를 위해 HTML 특수문자를 이스케이프
 * @param {string} str - 원본 문자열
 * @returns {string} 이스케이프된 문자열
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** 에러 메시지 표시 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

/** 에러 메시지 숨김 */
function hideError() {
  errorMessage.classList.add('hidden');
}


// ===========================
// 이벤트 리스너 등록
// ===========================

// 추가 버튼 클릭
addButton.addEventListener('click', createTodo);

// 입력창에서 Enter 키로 추가
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') createTodo();
});

// 입력 시작 시 에러 메시지 자동 제거
todoInput.addEventListener('input', () => {
  if (todoInput.value.trim()) hideError();
});


// ===========================
// 초기 렌더링
// ===========================
renderTodoList();
