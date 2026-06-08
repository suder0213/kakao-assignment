# 최종 구조 검토 및 평가

## 현재 파일 구조

```
src/
├── App.jsx
├── index.css
├── main.jsx
├── components/
│   ├── WeekNav.jsx
│   ├── DayCell.jsx
│   ├── FilterTabs.jsx
│   ├── TodoInput.jsx
│   ├── TodoList.jsx
│   └── TodoItem.jsx
└── utils/
    └── date.js
```

---

## 잘 된 점

### 1. 상태 소유 위치가 명확하다

앱 전체에서 공유되는 상태(`todoList`, `currentDate`, `currentFilter`)는 모두 `App`이 소유하고,
컴포넌트 내부에서만 필요한 상태(`isEditing`, `editValue`, `inputValue`, `error`)는 각 컴포넌트가 소유한다.

```
App                         ← todoList, currentDate, currentFilter
├── WeekNav / DayCell       ← 상태 없음 (props만 사용)
├── TodoInput               ← inputValue, error (입력창 로컬 상태)
├── FilterTabs              ← 상태 없음
└── TodoList
    └── TodoItem            ← isEditing, editValue (수정 모드 로컬 상태)
```

상태가 필요 이상으로 위로 올라가거나(과도한 끌어올리기),
아래에서 직접 공유 상태를 건드리는 경우가 없다.

---

### 2. 컴포넌트 책임이 단일하다

| 컴포넌트 | 하는 일 |
|---|---|
| `App` | 상태 소유, CRUD 함수 정의, 컴포넌트 조립 |
| `WeekNav` | 주간 그리드 조립, 주 이동 |
| `DayCell` | 날짜 셀 하나 렌더링 |
| `FilterTabs` | 필터 탭 렌더링 |
| `TodoInput` | 입력창 + 추가 버튼 |
| `TodoList` | 목록 렌더링 + 빈 상태 메시지 |
| `TodoItem` | 항목 하나 렌더링 + 수정 모드 |

각 컴포넌트가 한 가지 일에만 집중하고 있다.

---

### 3. 유틸 함수가 적절히 분리되어 있다

날짜 관련 순수 함수(`formatDateKey`, `formatDateDisplay`, `isSameDay`, `getWeekStart`, `getWeekDates`)가
`utils/date.js`로 분리되어 있다.
컴포넌트 파일은 UI 로직에만 집중하고, 날짜 계산 로직은 독립적으로 테스트하거나 재사용할 수 있다.

---

### 4. 사이드 이펙트가 한 곳에 있다

`useEffect` 하나로 `todoList` 변경 시 저장을 처리한다.
Vanilla JS처럼 CRUD 함수마다 `saveToStorage()`를 호출하지 않아 누락 가능성이 없다.

---

## 개선 여지가 있는 점

### 1. WeekNav에서 count 계산이 인라인에 있다

```jsx
count={todoList.filter(item => item.date === dateKey).length}
```

현재 7개 셀마다 `todoList` 전체를 순회하므로 `todoList`가 많아지면 비효율적이다.
학습 목적의 규모에서는 문제없지만, 실제 서비스라면 `useMemo`로 날짜별 개수를 미리 계산해두는 방법을 고려할 수 있다.

```jsx
// 개선 예시
const countByDate = useMemo(() => {
  return todoList.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1
    return acc
  }, {})
}, [todoList])
```

---

### 2. TodoItem의 editValue 초기화 문제

`TodoItem`은 마운트 시 `useState(todo.text)`로 `editValue`를 초기화한다.
수정을 취소하지 않고 다른 날짜로 이동했다가 돌아오면 `TodoItem`이 재마운트되어 초기화된다.
이 경우에는 문제없지만, 같은 날짜 안에서 필터를 바꿔도 `TodoItem`이 언마운트되지 않으므로
수정 중인 상태(`isEditing`)가 필터 전환 후에도 남아 있을 수 있다.

실제 앱에서는 수정 중인 항목 ID를 `App`에서 관리하여 필터 전환 시 초기화하는 방법이 있다.
현재 규모와 학습 목적에서는 허용 가능한 수준이다.

---

### 3. App.jsx의 countLabelMap이 렌더마다 재생성된다

```jsx
const countLabelMap = {
  all: '의 할 일',
  active: '의 진행 중인 할 일',
  completed: '의 완료된 할 일',
}
```

매 렌더마다 객체가 새로 만들어진다.
변하지 않는 상수이므로 컴포넌트 밖으로 꺼내는 것이 정석이다.

```jsx
// App 함수 밖으로 이동
const COUNT_LABEL_MAP = {
  all: '의 할 일',
  ...
}
```

---

## 종합 평가

학습 목적의 마이그레이션 프로젝트로서 구조는 전반적으로 건전하다.

- 상태 관리 위치, 컴포넌트 책임 분리, 유틸 분리, 사이드 이펙트 처리 모두 React 관례를 따르고 있다.
- 개선 여지로 꼽은 세 가지(`useMemo`, `editValue` 초기화, 상수 위치)는 실제 서비스에서는 챙겨야 할 사항이지만, 현재 규모에서 동작에 문제를 일으키지는 않는다.
- 다음 단계에서 배울 개념(`useMemo`, `useCallback`, 전역 상태 관리)을 적용할 자연스러운 지점이 이미 코드 안에 존재한다는 점에서 학습 연속성도 좋다.
