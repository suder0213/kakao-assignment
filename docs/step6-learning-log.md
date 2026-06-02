# 6단계 학습 로그 — 리팩토링: 상태 변경과 렌더링 분리

## 구현 요약

- 상태만 변경하는 순수 setter 함수 분리 (`setCurrentDate`, `setCurrentFilter`)
- 단일 렌더링 진입점 `render()` 추가
- 기존 `setFilter()`가 수행하던 탭 DOM 업데이트를 `updateFilterTabs()`로 분리
- 모든 액션 함수가 "상태 변경 → `render()` 호출" 패턴을 명시적으로 따르도록 변경

---

## 기존 구조와 문제

### 함수 역할이 섞여 있었다

기존에는 상태를 변경하는 일과 화면을 그리는 일이 한 함수 안에 뒤섞여 있었다.

```js
// setFilter: 상태 변경 + 탭 DOM 업데이트 + 렌더링까지 한 번에
function setFilter(filter) {
  currentFilter = filter;         // ← 상태 변경
  filterTabEls.forEach((tab) => { // ← DOM 업데이트
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  renderTodoList();               // ← 렌더링 트리거
}
```

```js
// renderTodoList: 목록 렌더링 + 주간 그리드 렌더링까지 담당
function renderTodoList() {
  // ...목록 DOM 업데이트...
  updateWeekDisplay(); // ← 왜 여기서 주간 그리드를?
}
```

### 암묵적인 호출 체인이 형성되었다

`selectDate` 하나를 호출하면 내부에서 연쇄적으로 함수가 호출되었다.

```
selectDate(dateKey)
  → setFilter('all')          ← 암묵적으로 렌더링을 유발
      → renderTodoList()
          → updateWeekDisplay()
```

각 함수가 다음 함수를 암묵적으로 호출하는 구조여서, 어느 함수를 호출했을 때 어떤 부작용이 생기는지 코드를 끝까지 따라가야만 알 수 있었다.

### 문제점 정리

| 문제 | 설명 |
|---|---|
| 역할 혼재 | `setFilter`가 상태 변경, DOM 업데이트, 렌더 트리거를 모두 수행 |
| 암묵적 의존 | `selectDate`가 렌더링되는 이유가 `setFilter` 내부 구현에 숨어 있음 |
| 부분 렌더 | `renderTodoList`만 호출하면 주간 그리드도 갱신되고, `updateWeekDisplay`만 호출하면 목록은 갱신되지 않는 비대칭 구조 |
| 파악 비용 | 새 기능을 추가할 때 "이 함수를 호출하면 화면이 어떻게 바뀌는지" 체인 전체를 읽어야 함 |

---

## 새로운 구조와 개선점

### 함수 역할을 세 가지로 분리

```
상태 변경 함수   →   render() 호출   →   렌더링 함수들
(setter)                                  (DOM 업데이트)
```

**상태 변경 함수** — 상태 변수만 바꾸고, 렌더링은 하지 않는다.

```js
function setCurrentDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  currentDate = new Date(y, m - 1, d);
}

function setCurrentFilter(filter) {
  currentFilter = filter;
}
```

**렌더링 함수** — 상태를 읽어 DOM을 업데이트한다. 상태를 바꾸지 않는다.

```js
function updateFilterTabs() { /* currentFilter 읽어 탭 DOM 업데이트 */ }
function renderTodoList()   { /* todoList, currentFilter 읽어 목록 DOM 업데이트 */ }
function updateWeekDisplay(){ /* todoList, currentDate 읽어 주간 그리드 업데이트 */ }
```

**단일 렌더 진입점** — 상태를 변경한 뒤 반드시 이 함수를 호출한다.

```js
function render() {
  updateFilterTabs();
  renderTodoList();
  updateWeekDisplay();
}
```

### 호출 흐름이 명시적으로 바뀌었다

```js
// 이전
function selectDate(dateKey) {
  currentDate = new Date(y, m - 1, d);
  setFilter('all');  // ← 내부에서 렌더링이 일어난다는 것을 알아야 함
}

// 이후
function selectDate(dateKey) {
  setCurrentDate(dateKey);    // 상태 변경
  setCurrentFilter('all');    // 상태 변경
  render();                   // 렌더링 — 명시적
}
```

어느 함수를 열어봐도 "상태를 바꾸고, render()를 호출한다"는 패턴이 일관되게 보인다.

### 개선점 정리

| 항목 | 이전 | 이후 |
|---|---|---|
| 상태 변경 위치 | `setFilter`, `selectDate`, `moveWeek`, CRUD 함수 등 분산 | `setCurrentDate`, `setCurrentFilter` + 각 액션 함수 내 직접 |
| 렌더 트리거 | `renderTodoList()` 호출 또는 `setFilter()` 경유 | 항상 `render()` 단일 경로 |
| 렌더 범위 | `renderTodoList`가 주간 그리드까지 암묵적으로 갱신 | `render()`가 세 함수를 명시적으로 순서대로 호출 |
| 코드 가독성 | 함수를 끝까지 따라가야 부작용 파악 가능 | 함수 본문만 봐도 무슨 일이 일어나는지 명확 |

---

## 트레이드 오프

### 얻은 것

- **예측 가능성**: 어느 액션 함수를 열어도 "상태 변경 → `render()`" 패턴이 보인다.
- **확장 용이성**: 새 상태 변수가 생겨도 `setCurrentX()`를 추가하고 렌더 함수에서 읽으면 된다. 기존 체인을 건드릴 필요가 없다.
- **렌더 함수 테스트 용이성**: 상태를 직접 세팅한 뒤 렌더 함수만 따로 호출해서 결과를 확인할 수 있다.

### 잃은 것 / 주의할 점

- **`render()` 호출 누락 위험**: 상태를 바꾼 뒤 `render()`를 빠뜨리면 화면이 갱신되지 않는다. 이전 구조에서는 `setFilter()`나 `renderTodoList()`를 부르면 자동으로 전체가 갱신되었다.

  ```js
  // 이런 실수를 해도 에러가 나지 않아 버그를 찾기 어렵다
  function someAction() {
    setCurrentFilter('completed');
    // render() 호출을 빠뜨림 → 화면이 바뀌지 않음
  }
  ```

- **전체 재렌더**: `render()`는 매번 세 함수를 모두 호출한다. Todo가 수백 개라면 완료 토글 하나에도 목록 전체와 주간 그리드를 다시 그린다. 현재 규모에서는 문제없지만, 대규모 앱에서는 변경된 부분만 갱신하는 최적화가 필요해진다.

### React와의 비교

이번 구조는 React의 상태 관리 패턴과 유사하다.

| | 이번 리팩토링 | React |
|---|---|---|
| 상태 변경 | `setCurrentDate()`, `setCurrentFilter()` 직접 호출 | `useState`의 setter 호출 |
| 렌더 트리거 | `render()` 명시적 호출 필요 | 상태 변경 시 자동 리렌더링 |
| 렌더 함수 | 개발자가 직접 관리 | 컴포넌트 함수가 자동 실행 |

React는 "상태가 바뀌면 렌더가 자동으로 따라온다"는 보장을 프레임워크가 제공하기 때문에, `render()` 호출 누락이라는 실수 자체가 불가능하다. Vanilla JS에서는 이 규칙을 개발자 스스로 지켜야 한다.
