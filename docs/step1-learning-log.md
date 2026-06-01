# 1단계 학습 로그 — Todo 앱 기본 CRUD

## HTML

### `<meta>` 태그의 name / content / initial-scale
- `name="viewport"` : 이 태그가 뷰포트(화면 영역) 설정임을 브라우저에 알려주는 식별자
- `content` : name에 해당하는 실제 설정값을 담는 속성, 쉼표로 여러 설정을 이어 씀
- `width=device-width` : 페이지 너비를 기기 실제 화면 너비에 맞춤. 없으면 모바일에서 PC 레이아웃으로 축소되어 글씨가 작아짐
- `initial-scale=1.0` : 페이지를 처음 열었을 때 확대/축소 배율을 100%로 고정

### `hidden` 클래스로 요소 숨기기
- HTML에 요소를 미리 작성해두고, CSS `.hidden { display: none; }` 으로 숨김
- JS에서 `classList.add('hidden')` / `classList.remove('hidden')` 으로 가시성을 토글
- 대안인 JS로 요소를 동적으로 생성/삭제하는 방식보다 코드가 단순하고, 문구를 HTML에서만 관리할 수 있어 유지보수가 쉬움

---

## CSS

### 선택자 종류

| 기호 | 이름 | 선택 기준 | 예시 |
|---|---|---|---|
| `.` | 클래스 선택자 | HTML `class` 속성 | `.hidden { display: none; }` |
| `#` | ID 선택자 | HTML `id` 속성 | `#todoInput { ... }` |
| `:` | 가상 클래스 | 요소의 상태 | `.btn:hover`, `.todo-input:focus` |
| `::` | 가상 요소 | CSS로 생성된 가상 위치 | `*::before`, `*::after` |

### `*, *::before, *::after { box-sizing: border-box; }`
- `*` 는 실제 HTML 요소만 선택하고, `::before` / `::after` 가상 요소는 포함하지 않음
- 세 가지를 함께 써야 가상 요소에도 `box-sizing`이 적용됨
- `border-box` : padding과 border를 너비 안에 포함시켜 레이아웃 계산을 직관적으로 만듦

### `:root`와 CSS 변수
- `:root` 는 HTML 문서의 최상위 요소(`<html>`)를 가리키는 가상 클래스
- 모든 요소의 조상이므로 여기서 선언한 `--변수명` 은 페이지 전체에서 `var(--변수명)` 으로 사용 가능
- 메인 컬러 등 반복되는 값을 한 곳에서 관리할 수 있어, 변경 시 한 줄만 수정하면 전체 반영됨

```css
:root { --color-primary: #672be0; }
.app-title { color: var(--color-primary); }
```

### `rem` 단위
- 브라우저 루트(`<html>`)의 폰트 크기를 기준으로 하는 상대 단위
- 기본값 `16px` 기준: `1rem = 16px`, `0.9rem = 14.4px`, `2rem = 32px`
- `px`는 고정값이라 사용자가 브라우저 폰트 크기를 키워도 무시되지만, `rem`은 함께 커져 접근성에 유리

### `list-style: none`
- `<ul>` 기본값인 `●` 불릿을 제거하는 속성
- Todo 항목을 직접 디자인할 때 브라우저 기본 불릿이 필요 없으므로 제거

---

## JavaScript

### DOM (Document Object Model)
- HTML 문서의 구조화된 표현으로, JS에서 HTML 요소를 조작할 수 있게 해주는 인터페이스
- HTML의 부모-자식 관계를 기반으로 요소를 객체 형태로 표현한 것

### `getElementById` vs `querySelector`

```js
document.getElementById('todoInput')       // id로만 탐색
document.querySelector('#todoInput')        // CSS 선택자로 탐색
document.querySelector('.todo-text')        // 클래스
document.querySelector('[data-id="3"]')     // 속성값
listItem.querySelector('.todo-text')        // 특정 요소 내부에서만 탐색
```

- `querySelector` 는 CSS 선택자 문법을 그대로 사용할 수 있어 더 유연
- 특정 요소에서 호출하면 그 요소 내부에서만 탐색 (전체 문서 탐색 방지)
- `id` 는 페이지에 유일한 요소에만 붙이고, 반복되는 요소에는 `class` 를 사용하는 것이 원칙

### `dataset`과 `data-*` 속성
- `li.dataset.id = todo.id` → HTML에 `<li data-id="3">` 형태로 표식을 심음
- 나중에 `querySelector('[data-id="3"]')` 로 해당 요소를 찾을 때 사용
- 데이터를 DOM에 직접 보관하여 JS 배열과 DOM 요소를 연결하는 역할

### 데이터(배열)와 화면(DOM)을 따로 찾는 이유

```js
const todo     = todoList.find(...)              // 값(text 등)을 읽고 수정할 때 필요
const listItem = document.querySelector(...)     // 화면 요소를 직접 조작할 때 필요
```

- 앱은 데이터(`todoList` 배열)와 화면(DOM `<li>`)을 별도로 관리
- 둘은 역할이 다르므로 각각 따로 참조해야 함

### `focus()`
- 해당 입력 요소에 커서를 자동으로 이동시키는 메서드
- 수정 버튼 클릭 시 입력창이 생기면 바로 타이핑할 수 있도록 UX 편의를 제공
- 빈 값으로 저장 시도 시 입력창으로 다시 커서를 돌려 재입력을 유도

### `filter` vs `splice`로 삭제

```js
// splice: 인덱스를 먼저 찾고 제거 (2단계)
const index = todoList.findIndex((item) => item.id === id);
todoList.splice(index, 1);

// filter: 남길 것만 걸러내기 (1단계, 더 간결)
todoList = todoList.filter((item) => item.id !== id);
```

- "삭제할 것을 찾아 제거"가 아닌 "살릴 것만 걸러내기" 방식
- 불변성을 유지(원본 배열 수정 없이 새 배열 반환)하여 예측 가능한 코드가 됨

### 함수 분리 (단일 책임 원칙)
- `createTodo` 는 Todo 생성만, `showError` 는 에러 표시만 담당
- 같은 에러 표시 로직을 여러 곳에서 쓸 때 재사용 가능
- 함수 이름이 의도를 드러내어 코드를 읽을 때 세부 구현을 몰라도 흐름 파악 가능

### JSDoc 주석

```js
/**
 * @param {number} id - 수정할 Todo의 ID
 * @returns {HTMLElement} 생성된 <li> 요소
 */
```

- JS 엔진은 무시하고 개발자와 VSCode 같은 에디터가 읽는 표준화된 주석 형식
- 함수에 마우스를 올리면 매개변수와 반환값 설명이 툴팁으로 표시됨

### 정규식 (Regular Expression)

```js
str.replace(/&/g, '&amp;')
//          ↑ ↑
//          │ └─ g 플래그: 문자열 전체에서 모두 교체 (없으면 첫 번째만 교체)
//          └─── 찾을 패턴
```

- `/ /` 슬래시 사이에 패턴을 작성하고 뒤에 플래그를 붙임
- `g` 플래그 없이는 일치하는 첫 번째만 교체됨

### XSS (Cross-Site Scripting)
- 입력창에 `<script>alert('해킹')</script>` 같은 악성 코드를 삽입하는 공격
- `innerHTML`에 그대로 넣으면 브라우저가 스크립트를 실행함
- `escapeHtml()` 로 `<`, `>` 등 특수문자를 `&lt;`, `&gt;` 로 변환하여 실행을 차단
- SQL 인젝션과 유사한 개념으로, 웹 애플리케이션의 취약점을 이용한 공격 방식

### `addEventListener`
- 사용자 행동(클릭, 키 입력 등)에 반응하여 특정 함수를 실행하도록 등록하는 메서드

```js
addButton.addEventListener('click', createTodo);       // 클릭 이벤트
todoInput.addEventListener('keydown', (e) => { ... }); // 키보드 이벤트
todoInput.addEventListener('input', () => { ... });    // 값 변경 이벤트
```
