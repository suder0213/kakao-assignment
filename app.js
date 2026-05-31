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

// DOM이란?: HTML 문서의 구조화된 표현으로, JavaScript에서 HTML 요소를 조작할 수 있게 해주는 인터페이스
// 즉 HTML의 부모 자식관계를 기반으로 요소를 객체 형태로 표현한 것

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
    // 에러를 보여주는 기능이 메서드로 분리되어 있어서 재사용 가능
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
  // 새로운 TOdo가 추가된 후 전체 목록을 다시 렌더링하여 화면에 반영
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


// 아래 주석은 JSDoc이라는 주석 큐칙 (개발자와 도구가 함수의 목적과 매개변수, 반환값 등을 명확히 이해할 수 있도록 돕는 표준화된 형식)
/**
 * Todo 수정 시작 — 텍스트를 인라인 입력창으로 교체
 * @param {number} id - 수정할 Todo의 ID
 */
function startEdit(id) {
  // 이 함수가 호출되면 todolist에서 해당 ID를 가진 항목을 찾아서 그 항목의 텍스트를 인라인 입력창으로 바꿔주는 역할
  const todo = todoList.find((item) => item.id === id);
  if (!todo) return;

  // DOM에서 해당 ID를 가진 <li> 요소를 찾아서 텍스트 부분을 입력창으로 교체
  // querySelecotor: CSS 선택자를 사용하여 DOM에서 요소를 찾는 메서드, 여기서는 data-id 속성을 이용하여 특정 ID를 가진 요소를 찾음
  const listItem = document.querySelector(`[data-id="${id}"]`);
  if (!listItem) return;

  // 텍스트 영역을 인라인 입력창으로 교체
  // querySelector로 listItem 내부의 클래스에서만 탐색하여 텍스트 요소와 버튼 영역을 각각 찾음
  const textEl = listItem.querySelector('.todo-text');
  const actionsEl = listItem.querySelector('.todo-actions');

  // 수정시 표시할 입력창 생성
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
  // EventListener: 특정 이벤트가 발생했을 때 실행하는 함수를 등록하는 메서드, 여기서는 입력창에서 키보드 이벤트를 감지하여 Enter 키가 눌렸을 때 saveEdit 함수를 호출하도록 설정
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
    // 수정 버튼 눌렀을 때 텍스트가 없으면 다시 입력창으로 '포커스'를 잡아줌
    // 포커스란?: 사용자가 입력할 수 있도록 특정 요소를 활성화하는 것
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
  // 위에서는 find를 썼는데, 여기선 filter를 사용.
  // splice보다 filter를 사용하는 것이 더 간결하고, 불변성을 유지하는 방식이기 때문에 선호됨
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
    // todolist 안에 child로 li를 추가하는 형태로 DOM 트리에 삽입
    // html에 <li> 요소가 실제로 추가되는 방식(문서가 실제로 수정됨)
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
  // ex ) 77번 라인, const listItem = document.querySelector(`[data-id="${id}"]`); 에서 사용됨

  // 완료 버튼 텍스트: 완료 여부에 따라 다르게 표시
  const completeLabel = todo.completed ? '취소' : '완료';

  // ui에 삽입할 HTML 구조를 문자열로 작성, 템플릿 리터럴을 사용하여 변수와 표현식을 쉽게 삽입
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

// XSS란?: 악의적인 사용자가 웹 페이지에 악성 스크립트를 삽입하여 다른 사용자의 브라우저에서 실행되도록 하는 공격 기법
// SQL 인젝션과 유사한 개념으로, 웹 애플리케이션의 취약점을 이용하여 악성 코드를 삽입하는 공격 방식
function escapeHtml(str) {
  return str
    // / / 사이에 있는 패턴을 찾앚서, 문자열 전체에서 (g) 찾아 바꾼다는 의미
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** 에러 메시지 표시 */
function showError(message) {
  errorMessage.textContent = message;
  // 클래스에서 hidden을 넣었다 뺐다 하는 방식으로 에러 메시지의 가시성을 제어
  errorMessage.classList.remove('hidden');
}

/** 에러 메시지 숨김 */
// 클래스에서 hidden을 넣었다 뺐다 하는 방식으로 에러 메시지의 가시성을 제어
function hideError() {
  errorMessage.classList.add('hidden');
}


// ===========================
// 이벤트 리스너 등록
// ===========================
// 이벤트 리스너란?: 사용자의 행동(클릭, 키 입력 등)에 반응하여 특정 함수를 실행하도록 설정하는 것

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
