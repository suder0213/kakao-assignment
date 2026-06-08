import { formatDateKey, getWeekDates } from '../utils/date'

// ===========================
// WeekNav — 주간 날짜 네비게이터
// props:
//   currentDate  — 현재 선택된 날짜 (Date 객체)
//   todoList     — 전체 Todo 배열 (날짜별 개수 뱃지 계산용)
//   onDateChange — 날짜 변경 함수 (App의 래퍼 함수: setCurrentDate + setCurrentFilter 초기화)
// ===========================
function WeekNav({ currentDate, todoList, onDateChange }) {
  const weekDates  = getWeekDates(currentDate)
  const todayKey   = formatDateKey(new Date())
  const selectedKey = formatDateKey(currentDate)
  const dayNames   = ['월', '화', '수', '목', '금', '토', '일']

  // 주간 범위 텍스트 (ex. "6월 2일 - 6월 8일")
  const start = weekDates[0]
  const end   = weekDates[6]
  const rangeText = `${start.getMonth() + 1}월 ${start.getDate()}일 - ${end.getMonth() + 1}월 ${end.getDate()}일`

  function moveWeek(offset) {
    // 현재 날짜에서 ±7일 이동 — 새 Date 객체를 만들어 불변성 유지
    const next = new Date(currentDate)
    next.setDate(next.getDate() + offset * 7)
    onDateChange(next)
  }

  return (
    <section className="week-nav">
      <div className="week-nav-header">
        <button className="week-nav-btn" onClick={() => moveWeek(-1)}>&#8249;</button>
        <span className="week-range-text">{rangeText}</span>
        <button className="week-nav-btn" onClick={() => moveWeek(+1)}>&#8250;</button>
      </div>

      <div className="week-grid">
        {weekDates.map((date, i) => {
          const dateKey = formatDateKey(date)
          // 해당 날짜의 Todo 개수 — filteredList가 아닌 전체 todoList 기준
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
              {/* count가 0이면 뱃지를 렌더하지 않는다 */}
              {count > 0 && <span className="day-count">{count}</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default WeekNav
