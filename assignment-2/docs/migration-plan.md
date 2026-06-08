# Vanilla JS → React 마이그레이션 계획

## 사용한 프롬프트

> 지금부터 할 것은 assignment-1에서 구현한 TODO 시스템을 react 구조를 사용하여 마이그레이션 하는 것이야. 작업할 프로젝트 폴더는 assignment-2로, 현재 템플릿 파일들이 들어가 있어. 이 파일들 중 필요한 것을 제외하고는 모두 삭제하여 작업에 편리하게 하는 것이 1단계야.
>
> 그 다음은, 각 단계 별로 리펙토링을 수행할 예정이야.
> 2. Todo CRUD (Create, Read, Update, Delete) 기능 마이그레이션하기
> 3. 상태별 필터링 기능 마이그레이션하기
> 4. Todo 일간 뷰 마이그레이션하기
> 5. 로컬 스토리지 연동 마이그레이션하기
> 6. Todo 주간 뷰 마이그레이션하기
>
> 이는 단순 구현에 그치지 않고, 나의 리액트 구조 학습에 도움이 되는 형태로 각 단계마다 주석과 문서를 꼼꼼히 남길 계획이야. 따라서 이번주에 배운 개념인 useState, useEffect와 같은 주요 리액트 개념이 이전의 방식과 비교해 어떤 차이점을 만들어 내고 있고, 어떤 식으로 개선이 되고 있는지 매 단계마다 코드 작성 후 "핵심 구현 내용"을 포함하여 설명하는 문서를 docs/ 아래에 만들어줘.
>
> 각 단계는 한 번에 진행하지 말고, 문서를 만든 이후 단계 별로 검토하면서 진행할 거야. 이를 수행하기 위해, 네가 이해한 바와 구현 계획을 assignment-2/docs 아래에 정리해서 하나의 md 파일로 만들어줘.

> 구현 계획에 "각 단계 구현 마다 핵심 구현, 내용 요약 문서를 만든다" 라는 내용을 명시해. 또한 문서를 수정할 때, 내가 입력한 프롬프트를 추가해서 추가적인 질문이 있었다는 것도 명시하도록 해줘

---

## 문서 작성 규칙

- **각 단계 구현 완료 후 반드시 `docs/step{N}-*.md` 문서를 생성한다.**
- 문서에는 다음 항목을 포함한다:
  - 핵심 구현 내용 요약
  - Vanilla JS와의 차이점 (코드 비교 포함)
  - 해당 단계에서 처음 등장한 React 개념 설명
  - 이 단계에서 사용된 프롬프트 (추가 질문 포함)
- 이 계획 문서(`migration-plan.md`)도 단계가 진행될 때마다 사용된 프롬프트를 "사용한 프롬프트" 섹션에 누적하여 기록한다.

---

## 전체 목표

assignment-1에서 구현한 Todo 앱(Vanilla JS)을 React 구조로 다시 작성한다.
단순 포팅이 아니라, **React가 Vanilla JS의 어떤 문제를 어떻게 해결하는지** 체감하는 것이 핵심이다.

---

## 1단계: 템플릿 정리

Vite가 생성한 파일 중 필요 없는 것을 제거하고 작업 환경을 만든다.

### 남길 파일

| 파일 | 이유 |
|---|---|
| `index.html` | React 앱의 진입점. `<div id="root">`가 여기 있다 |
| `src/main.jsx` | React 루트를 DOM에 마운트하는 파일 |
| `src/App.jsx` | 앱 전체를 담을 최상위 컴포넌트. 내용은 전면 교체 |
| `src/index.css` | 전역 스타일. assignment-1의 style.css를 이식 |
| `vite.config.js` | Vite 빌드 설정 |
| `package.json` | 의존성 정의 |
| `eslint.config.js` | 린트 설정 |
| `.gitignore` | Git 제외 목록 |

### 삭제할 파일

| 파일 | 이유 |
|---|---|
| `src/App.css` | Vite 템플릿 전용 스타일, 사용 안 함 |
| `src/assets/hero.png` | 템플릿 이미지 |
| `src/assets/react.svg` | 템플릿 이미지 |
| `src/assets/vite.svg` | 템플릿 이미지 |
| `public/icons.svg` | 템플릿 아이콘 |
| `README.md` | Vite 기본 README |

---

## 컴포넌트 구조 설계

Vanilla JS에서는 모든 로직이 `app.js` 한 파일에 있었다.
React에서는 UI를 기능 단위로 **컴포넌트**로 쪼개어 관리한다.

```
App.jsx                     ← 상태 전체 보유, 컴포넌트 조립
├── WeekNav.jsx             ← 주간 뷰 네비게이터
├── TodoInput.jsx           ← 입력창 + 추가 버튼
├── FilterTabs.jsx          ← 전체 / 진행 중 / 완료 탭
└── TodoList.jsx            ← Todo 목록
    └── TodoItem.jsx        ← 개별 Todo 항목
```

---

## Vanilla JS → React 핵심 개념 대응표

| Vanilla JS | React | 역할 |
|---|---|---|
| `let todoList = []` | `useState([])` | 상태 선언 |
| `let currentFilter = 'all'` | `useState('all')` | 상태 선언 |
| `let currentDate = new Date()` | `useState(new Date())` | 상태 선언 |
| `let nextId = 1` | `useRef(1)` | 렌더와 무관한 변경 가능 값 |
| `render()` 명시적 호출 | 상태 변경 → 자동 리렌더 | 렌더 트리거 |
| `todoListEl.innerHTML = ''` + DOM 조작 | JSX 반환 | UI 표현 |
| `loadFromStorage()` / `saveToStorage()` | `useEffect` | 사이드 이펙트 처리 |
| `document.getElementById(...)` | props / state | 데이터 전달 |

---

## 단계별 구현 계획

### 2단계: CRUD 마이그레이션

**구현 내용**
- `App.jsx`에 `todoList`, `nextId` 상태 설정
- `createTodo`, `toggleComplete`, `startEdit`, `saveEdit`, `deleteTodo` 함수 구현
- `TodoInput.jsx`, `TodoList.jsx`, `TodoItem.jsx` 컴포넌트 생성
- assignment-1의 `style.css`를 `index.css`로 이식

**Vanilla JS와의 핵심 차이**
- 상태 변경 시 `render()`를 명시적으로 호출하지 않아도 React가 자동으로 리렌더
- DOM을 직접 조작하는 대신 JSX로 "어떻게 보일지"만 선언
- `innerHTML`로 HTML 문자열을 삽입하던 방식이 JSX 표현식으로 대체됨 → XSS 방지도 React가 자동 처리

**학습 포인트**: `useState`, JSX, props, 이벤트 핸들러

---

### 3단계: 필터링 마이그레이션

**구현 내용**
- `App.jsx`에 `currentFilter` 상태 추가
- `FilterTabs.jsx` 컴포넌트 생성
- `getFilteredList()` 로직을 렌더 내부 계산으로 이동

**Vanilla JS와의 핵심 차이**
- 기존: `setCurrentFilter()` → `render()` 명시적 호출
- React: `setCurrentFilter()` 하나만 호출하면 자동 리렌더
- 필터링된 목록을 별도 변수로 관리하지 않고, 렌더 시점에 `todoList.filter()`로 즉시 계산

**학습 포인트**: 파생 상태(derived state) — 별도 state 없이 기존 state에서 계산

---

### 4단계: 일간 뷰 마이그레이션

**구현 내용**
- `App.jsx`에 `currentDate` 상태 추가
- 날짜 유틸 함수(`formatDateKey`, `isSameDay` 등)를 `src/utils/date.js`로 분리
- 날짜 선택 시 `currentDate` 변경 → 필터링 자동 반영

**Vanilla JS와의 핵심 차이**
- 기존: `selectDate()` → `setCurrentDate()` → `setCurrentFilter()` → `render()` 체인
- React: `setCurrentDate(dateKey)` 하나로 상태 변경 → 리렌더 시 날짜 기준 필터링 자동 적용

**학습 포인트**: 상태 하나가 여러 UI 영역에 동시에 반영되는 구조

---

### 5단계: 로컬스토리지 마이그레이션

**구현 내용**
- `todoList` 변경 시마다 로컬스토리지에 저장: `useEffect([todoList])`
- 앱 최초 로드 시 로컬스토리지에서 복원: `useEffect([], [])` (의존성 배열 비움)
- `nextId` 재설정 로직 유지

**Vanilla JS와의 핵심 차이**
- 기존: CRUD 함수마다 `saveToStorage()` 명시적 호출
- React: `useEffect`로 `todoList`가 바뀔 때마다 자동으로 저장 — 저장 로직을 한 곳에서만 관리

**학습 포인트**: `useEffect`의 의존성 배열, 사이드 이펙트의 선언적 관리

---

### 6단계: 주간 뷰 마이그레이션

**구현 내용**
- `WeekNav.jsx` 컴포넌트 생성
- 주간 유틸 함수(`getWeekStart`, `getWeekDates`)를 `src/utils/date.js`에 추가
- 날짜별 Todo 개수 뱃지: `todoList.filter(item => item.date === dateKey).length`로 계산

**Vanilla JS와의 핵심 차이**
- 기존: `updateWeekDisplay()`가 DOM에 직접 버튼을 생성(`createElement`, `appendChild`)
- React: `getWeekDates(currentDate).map(date => <button ...>)` — 배열을 JSX로 선언적으로 표현
- 날짜 셀 클릭 → `currentDate` 변경 → 주간 그리드 + Todo 목록 동시 자동 갱신

**학습 포인트**: 배열의 `.map()`으로 반복 UI 생성, `key` prop의 역할

---

## 파일 구조 목표 (6단계 완료 시)

```
assignment-2/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── index.css          ← assignment-1 style.css 이식
│   ├── App.jsx            ← 상태 관리 + 컴포넌트 조립
│   ├── components/
│   │   ├── WeekNav.jsx
│   │   ├── TodoInput.jsx
│   │   ├── FilterTabs.jsx
│   │   ├── TodoList.jsx
│   │   └── TodoItem.jsx
│   └── utils/
│       └── date.js        ← 날짜 유틸 함수 모음
└── docs/
    ├── migration-plan.md  ← 이 문서
    ├── step2-crud.md
    ├── step3-filter.md
    ├── step4-daily.md
    ├── step5-storage.md
    └── step6-weekly.md
```
