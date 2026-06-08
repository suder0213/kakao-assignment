# 5단계 학습 로그 — 주간 뷰

## 구현 요약

- 날짜 네비게이터를 주간 뷰로 교체 (월~일 7개 셀)
- 이전 / 다음 주 버튼으로 주 단위 이동
- 날짜 셀 클릭 시 해당 날짜의 Todo만 목록에 표시
- 각 날짜 셀 아래에 해당 날짜의 Todo 개수 뱃지 표시
- 오늘 날짜는 primary 색상으로 강조, 선택된 날짜는 primary 배경으로 강조

---

## 심화 정리

### 날짜 클릭 시 전체 흐름

날짜 셀 클릭 하나가 어떤 순서로 화면을 바꾸는지 추적하면 아래와 같다.

```
날짜 셀 클릭
  → btn.addEventListener('click', () => selectDate(dateKey))
  → selectDate(dateKey)
      currentDate = new Date(y, m - 1, d)   ← currentDate 변경
      setFilter('all')
  → setFilter('all')
      currentFilter = 'all'
      renderTodoList()
  → renderTodoList()
      getFilteredList()   ← 변경된 currentDate 기준으로 필터링
      목록 DOM 갱신
      updateWeekDisplay() ← 주간 그리드 재렌더링
  → updateWeekDisplay()
      selectedKey = formatDateKey(currentDate)  ← 변경된 currentDate 읽기
      새 날짜에 .active 클래스 적용
```

`currentDate`는 `selectDate()`에서 단 한 번만 바뀐다. 이후 모든 렌더링 함수는 그 값을 읽기만 하는 구조다.

---

### `forEach` 콜백의 매개변수

`date`는 별도로 선언한 변수가 아니라 `forEach` 콜백의 매개변수다. `forEach`는 배열을 순회하면서 현재 요소를 콜백의 첫 번째 인자로 자동으로 넘겨준다.

```js
weekDates.forEach((date, i) => {
  // date → weekDates[i] 가 자동으로 들어옴
  // i    → 현재 인덱스 (0~6)
});
```

`forEach`가 콜백에 넘기는 인자는 순서대로 `(현재요소, 인덱스, 원본배열)` 세 가지다. 필요한 것만 앞에서부터 받아 쓰면 된다.

---

### `getWeekStart()`에서 월요일을 구하는 방법

JS의 `getDay()`는 `0(일) ~ 6(토)` 순서로 요일을 반환한다. 한국은 월요일을 한 주의 시작으로 보기 때문에 보정이 필요하다.

```js
const day  = d.getDay();
const diff = day === 0 ? -6 : 1 - day;
d.setDate(d.getDate() + diff);
```

| 요일 | getDay() | diff 계산 | 이동 방향 |
|---|---|---|---|
| 월 | 1 | 1 - 1 = 0 | 이동 없음 |
| 화 | 2 | 1 - 2 = -1 | 하루 전 |
| 일 | 0 | 예외처리 -6 | 6일 전 |

---

### `'YYYY-MM-DD'` 문자열을 직접 파싱한 이유

`new Date('2026-06-01')`은 UTC 자정 기준으로 파싱한다. 한국(UTC+9)에서는 문제없지만 UTC-5 같은 환경에서는 전날로 밀릴 수 있다.

```js
new Date('2026-06-01')           // UTC 자정 → 타임존에 따라 날짜가 달라질 수 있음

const [y, m, d] = '2026-06-01'.split('-').map(Number);
new Date(y, m - 1, d)            // 로컬 시간 기준 → 항상 해당 날짜
```

로컬 시간 기준으로 명시적으로 생성하면 타임존 영향을 받지 않는다.

---

### `grid-template-columns: repeat(7, 1fr)`

CSS Grid로 7개의 셀을 균등하게 나누는 방법이다.

```css
.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7개 열, 각각 동일 비율 */
}
```

`1fr`은 가용 공간을 균등하게 나눈 1조각을 의미한다. `repeat(7, 1fr)`은 `1fr 1fr 1fr 1fr 1fr 1fr 1fr`을 축약한 것이다.
