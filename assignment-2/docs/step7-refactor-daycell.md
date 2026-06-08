# 7단계 학습 로그 — DayCell 컴포넌트 분리 리팩토링

## 사용한 프롬프트

> DateNav는 이제 안 쓰는거인가?

> 그러면 DateNav는 삭제하고, 차라리 새로운 컴포넌트를 만들어서 분리해보자

> 이건 Step 7으로 따로 기록하는게 좋을거 같네.

---

## 핵심 구현 내용 요약

- `DateNav.jsx` 삭제 (WeekNav로 완전 대체됨)
- `src/components/DayCell.jsx` 신규 생성
- `WeekNav.jsx`의 `.map()` 콜백에서 날짜 셀 렌더링 로직을 `DayCell`로 분리

---

## 리팩토링 전후 비교

### WeekNav.jsx — 분리 전

`.map()` 콜백 안에서 변수 계산과 JSX 렌더링이 함께 있었다.

```jsx
{weekDates.map((date, i) => {
  const dateKey  = formatDateKey(date)
  const count    = todoList.filter(item => item.date === dateKey).length
  const isActive = dateKey === selectedKey
  const isToday  = dateKey === todayKey

  return (
    <button
      key={dateKey}
      className={`day-cell${isActive ? ' active' : ''}${isToday ? ' today' : ''}`}
      onClick={() => onDateChange(date)}
    >
      <span className="day-name">{dayNames[i]}</span>
      <span className="day-number">{date.getDate()}</span>
      {count > 0 && <span className="day-count">{count}</span>}
    </button>
  )
})}
```

### WeekNav.jsx — 분리 후

WeekNav는 값을 계산해서 넘기는 역할만 하고, 렌더링은 DayCell이 담당한다.

```jsx
{weekDates.map((date, i) => {
  const dateKey = formatDateKey(date)
  return (
    <DayCell
      key={dateKey}
      date={date}
      dayName={dayNames[i]}
      count={todoList.filter(item => item.date === dateKey).length}
      isActive={dateKey === selectedKey}
      isToday={dateKey === todayKey}
      onDateChange={onDateChange}
    />
  )
})}
```

---

## 이 리팩토링을 하게 된 배경

`.map()` 콜백 안에 `return` 이 있는 구조를 보고 "안에 있는 버튼을 컴포넌트로 분리할 수 있지 않냐"는 질문에서 출발했다.

`.map()` 콜백 안에서 변수를 계산해야 하면 블록 `{}`이 필요하고, 블록을 쓰면 `return`이 필요하다.
버튼 자체를 컴포넌트로 분리하면 이 중첩 `return` 구조가 사라지지는 않지만,
map 콜백의 역할이 "값 계산 + 넘기기"로 명확해지고 렌더링 로직이 DayCell 안으로 격리된다.

---

## 학습 포인트

### 컴포넌트 분리의 기준

컴포넌트를 분리할 때 흔히 쓰는 기준:

- **재사용 가능성**: 같은 UI를 여러 곳에서 쓰는가
- **책임 분리**: 한 컴포넌트가 너무 많은 일을 하는가
- **가독성**: 분리했을 때 각 파일이 더 읽기 쉬워지는가

DayCell은 현재 WeekNav 하나에서만 쓰이므로 재사용성은 낮다.
하지만 날짜 셀의 렌더링 로직(클래스 계산, 조건부 뱃지)을 격리함으로써 WeekNav의 관심사가 "주간 그리드 조립"으로 명확해졌다.

---

## 파일 구조 변화

```
src/
├── App.jsx
├── index.css
├── main.jsx
├── components/
│   ├── WeekNav.jsx      ← DayCell import 추가, map 콜백 단순화
│   ├── DayCell.jsx      ← 신규 생성
│   ├── FilterTabs.jsx
│   ├── TodoInput.jsx
│   ├── TodoList.jsx
│   └── TodoItem.jsx
│   (DateNav.jsx 삭제)
└── utils/
    └── date.js
```
