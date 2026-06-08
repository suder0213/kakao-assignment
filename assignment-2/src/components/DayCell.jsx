import { formatDateKey } from '../utils/date'

// ===========================
// DayCell — 주간 그리드의 날짜 셀 하나
// props:
//   date         — 이 셀이 나타내는 날짜 (Date 객체)
//   dayName      — 요일 문자 ('월' ~ '일')
//   count        — 해당 날짜의 Todo 개수
//   isActive     — 현재 선택된 날짜 여부
//   isToday      — 오늘 날짜 여부
//   onDateChange — 셀 클릭 시 호출할 함수
// ===========================
function DayCell({ date, dayName, count, isActive, isToday, onDateChange }) {
  return (
    <button
      className={`day-cell${isActive ? ' active' : ''}${isToday ? ' today' : ''}`}
      onClick={() => onDateChange(date)}
    >
      <span className="day-name">{dayName}</span>
      <span className="day-number">{date.getDate()}</span>
      {count > 0 && <span className="day-count">{count}</span>}
    </button>
  )
}

export default DayCell
