// ===========================
// 상태 관리
// ===========================

// Todo 항목 배열 (각 항목: { id, text, completed, date })
let todoList = [];

// 고유 ID 생성을 위한 카운터
let nextId = 1;

// 현재 선택된 필터 ('all' | 'active' | 'completed')
let currentFilter = 'all';

// 현재 선택된 날짜 (Date 객체) — 앱 시작 시 오늘 날짜로 초기화
let currentDate = new Date();


// ===========================
// DOM 요소 참조
// ===========================

// DOM이란?: HTML 문서의 구조화된 표현으로, JavaScript에서 HTML 요소를 조작할 수 있게 해주는 인터페이스
// 즉 HTML의 부모 자식관계를 기반으로 요소를 객체 형태로 표현한 것

const todoInput       = document.getElementById('todoInput');
const addButton       = document.getElementById('addButton');
const errorMessage    = document.getElementById('errorMessage');
const todoListEl      = document.getElementById('todoList');
const todoCountEl     = document.getElementById('todoCount');
const todoCountLabel  = document.getElementById('todoCountLabel');
const emptyStateEl    = document.getElementById('emptyState');
// querySelectorAll: 조건에 맞는 모든 요소를 NodeList로 반환
const filterTabEls    = document.querySelectorAll('.filter-tab');
const prevDateButton  = document.getElementById('prevDateButton');
const nextDateButton  = document.getElementById('nextDateButton');
const currentDateText = document.getElementById('currentDateText');
const todayBadge      = document.getElementById('todayBadge');


// ===========================
// 날짜 유틸리티 함수
// ===========================

/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
 * Todo 저장 및 날짜 비교에 사용
 * @param {Date} date
 * @returns {string} 'YYYY-MM-DD'
 */
function formatDateKey(date) {
  const year  = date.getFullYear();
  // getMonth()는 0부터 시작하므로 +1, padStart로 한 자리 숫자 앞에 0 추가 (ex. 5 → '05')
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Date 객체를 화면에 표시할 형식으로 변환
 * @param {Date} date
 * @returns {string} 'YYYY년 M월 D일 (요일)'
 */
function formatDateDisplay(date) {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const year    = date.getFullYear();
  const month   = date.getMonth() + 1;
  const day     = date.getDate();
  // getDay()는 요일을 0(일)~6(토) 숫자로 반환 — dayNames 배열의 인덱스로 사용
  const dayName = dayNames[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

/**
 * 두 Date 객체가 같은 날짜인지 비교 (시간 제외)
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
function isSameDay(a, b) {
  // 두 날짜를 모두 'YYYY-MM-DD' 문자열로 변환하여 비교
  return formatDateKey(a) === formatDateKey(b);
}


// ===========================
// 날짜 네비게이터 함수
// ===========================

/**
 * 날짜를 하루 앞뒤로 이동
 * @param {number} offset - 이동할 일수 (+1: 다음날, -1: 이전날)
 */
function moveDate(offset) {
  // 현재 날짜를 복사한 뒤 offset만큼 날짜를 이동
  const next = new Date(currentDate);
  next.setDate(next.getDate() + offset);
  currentDate = next;

  // 날짜가 바뀌면 필터를 '전체'로 초기화
  setFilter('all');
  updateDateDisplay();
  renderTodoList();
}

/**
 * 날짜 네비게이터 UI 업데이트
 * - 날짜 텍스트 갱신
 * - 오늘 날짜일 때만 '오늘' 뱃지 표시
 */
function updateDateDisplay() {
  currentDateText.textContent = formatDateDisplay(currentDate);

  // 현재 선택된 날짜가 오늘이면 뱃지 표시, 아니면 숨김
  if (isSameDay(currentDate, new Date())) {
    todayBadge.classList.remove('hidden');
  } else {
    todayBadge.classList.add('hidden');
  }
}


// ===========================
// 핵심 CRUD 함수
// ===========================

/**
 * Todo 생성
 * - 입력값이 비어있으면 에러 메시지를 표시하고 중단
 * - 공백만 있는 입력도 빈 값으로 처리
 * - 현재 선택된 날짜를 date 필드에 함께 저장
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
    // 'YYYY-MM-DD' 문자열로 저장 — 날짜 비교 및 필터링에 사용
    date: formatDateKey(currentDate),
  };

  todoList.push(newTodo);
  todoInput.value = '';
  hideError();
  // 새로운 Todo가 추가된 후 전체 목록을 다시 렌더링하여 화면에 반영
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


// 아래 주석은 JSDoc이라는 주석 규칙 (개발자와 도구가 함수의 목적과 매개변수, 반환값 등을 명확히 이해할 수 있도록 돕는 표준화된 형식)
/**
 * Todo 수정 시작 — 텍스트를 인라인 입력창으로 교체
 * @param {number} id - 수정할 Todo의 ID
 */
function startEdit(id) {
  // 이 함수가 호출되면 todoList에서 해당 ID를 가진 항목을 찾아서 그 항목의 텍스트를 인라인 입력창으로 바꿔주는 역할
  const todo = todoList.find((item) => item.id === id);
  if (!todo) return;

  // DOM에서 해당 ID를 가진 <li> 요소를 찾아서 텍스트 부분을 입력창으로 교체
  // querySelector: CSS 선택자를 사용하여 DOM에서 요소를 찾는 메서드, 여기서는 data-id 속성을 이용하여 특정 ID를 가진 요소를 찾음
  const listItem = document.querySelector(`[data-id="${id}"]`);
  if (!listItem) return;

  // querySelector로 listItem 내부에서만 탐색하여 텍스트 요소와 버튼 영역을 각각 찾음
  const textEl    = listItem.querySelector('.todo-text');
  const actionsEl = listItem.querySelector('.todo-actions');

  // 수정 시 표시할 입력창 생성
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
  // addEventListener: 특정 이벤트가 발생했을 때 실행하는 함수를 등록하는 메서드, 여기서는 입력창에서 키보드 이벤트를 감지하여 Enter 키가 눌렸을 때 saveEdit 함수를 호출하도록 설정
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
// 필터 함수
// ===========================

/**
 * 현재 필터 상태를 변경하고 화면을 다시 그림
 * @param {string} filter - 'all' | 'active' | 'completed'
 */
function setFilter(filter) {
  currentFilter = filter;

  // 모든 탭에서 active 클래스를 제거하고, 클릭된 탭에만 active 클래스를 추가
  filterTabEls.forEach((tab) => {
    if (tab.dataset.filter === filter) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  renderTodoList();
}

/**
 * 현재 날짜 + 현재 필터를 모두 적용하여 목록 반환
 * @returns {Array} 필터링된 Todo 배열
 */
function getFilteredList() {
  // 1단계: 선택된 날짜의 Todo만 추림
  const dateKey = formatDateKey(currentDate);
  const byDate  = todoList.filter((item) => item.date === dateKey);

  // 2단계: 상태 필터 적용
  if (currentFilter === 'active')    return byDate.filter((item) => !item.completed);
  if (currentFilter === 'completed') return byDate.filter((item) => item.completed);
  // 'all'이면 날짜 필터만 적용된 전체 반환
  return byDate;
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

  const filteredList = getFilteredList();

  // 빈 상태 / 목록 가시성 제어
  if (filteredList.length === 0) {
    emptyStateEl.classList.remove('hidden');
    updateEmptyMessage();
  } else {
    emptyStateEl.classList.add('hidden');
  }

  // 카운터 업데이트
  updateCounter(filteredList.length);

  // 각 Todo 항목을 <li>로 생성하여 목록에 추가
  filteredList.forEach((todo) => {
    const li = createTodoElement(todo);
    // todoList 안에 child로 li를 추가하는 형태로 DOM 트리에 삽입
    // html에 <li> 요소가 실제로 추가되는 방식(문서가 실제로 수정됨)
    todoListEl.appendChild(li);
  });
}

/**
 * 카운터 텍스트를 현재 필터에 맞게 업데이트
 * @param {number} count - 표시 중인 항목 수
 */
function updateCounter(count) {
  todoCountEl.textContent = `${count}개`;

  const labelMap = {
    all: '의 할 일',
    active: '의 진행 중인 할 일',
    completed: '의 완료된 할 일',
  };
  todoCountLabel.textContent = labelMap[currentFilter];
}

/**
 * 빈 상태 메시지를 현재 필터에 맞게 업데이트
 */
function updateEmptyMessage() {
  const messageMap = {
    all: '<p>이 날의 할 일이 없어요.</p><p>새로운 할 일을 추가해보세요!</p>',
    active: '<p>진행 중인 할 일이 없어요.</p>',
    completed: '<p>완료된 할 일이 없어요.</p>',
  };
  emptyStateEl.innerHTML = messageMap[currentFilter];
}

/**
 * Todo 객체 하나를 <li> DOM 요소로 변환
 * @param {object} todo - { id, text, completed, date }
 * @returns {HTMLElement} 생성된 <li> 요소
 */
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' completed' : ''}`;
  li.dataset.id = todo.id; // 이후 DOM 탐색 시 ID로 항목 식별
  // ex) querySelector(`[data-id="${id}"]`) 에서 사용됨

  // 완료 버튼 텍스트: 완료 여부에 따라 다르게 표시
  const completeLabel = todo.completed ? '취소' : '완료';

  // UI에 삽입할 HTML 구조를 문자열로 작성, 템플릿 리터럴을 사용하여 변수와 표현식을 쉽게 삽입
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

// XSS란?: 악의적인 사용자가 웹 페이지에 악성 스크립트를 삽입하여 다른 사용자의 브라우저에서 실행되도록 하는 공격 기법
// SQL 인젝션과 유사한 개념으로, 웹 애플리케이션의 취약점을 이용하여 악성 코드를 삽입하는 공격 방식
/**
 * XSS 방지를 위해 HTML 특수문자를 이스케이프
 * @param {string} str - 원본 문자열
 * @returns {string} 이스케이프된 문자열
 */
function escapeHtml(str) {
  return str
    // / / 사이에 있는 패턴을 찾아서, 문자열 전체에서 (g) 찾아 바꾼다는 의미
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

// 필터 탭 클릭 — dataset.filter 값을 읽어서 setFilter에 전달
filterTabEls.forEach((tab) => {
  tab.addEventListener('click', () => setFilter(tab.dataset.filter));
});

// 이전 / 다음 날짜 버튼
prevDateButton.addEventListener('click', () => moveDate(-1));
nextDateButton.addEventListener('click', () => moveDate(+1));


// ===========================
// 초기 렌더링
// ===========================
updateDateDisplay();
renderTodoList();
