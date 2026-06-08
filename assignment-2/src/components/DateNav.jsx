import { formatDateDisplay } from '../utils/date'

// ===========================
// DateNav — 일간 날짜 네비게이터
// step6(주간 뷰)에서 WeekNav로 교체될 예정.
// props:
//   currentDate  — 현재 선택된 날짜 (Date 객체)
//   onDateChange — 날짜 변경 함수 (App의 setCurrentDate를 전달받음)
// ===========================
function DateNav({ currentDate, onDateChange }) {
  function moveDay(offset) {
    // 기존 Date 객체를 직접 변경하지 않고 새 Date 객체를 만든다.
    // React 상태 불변성 원칙과 동일한 이유: 직접 변경하면 참조가 바뀌지 않아 리렌더가 일어나지 않는다.
    const next = new Date(currentDate)
    next.setDate(next.getDate() + offset)
    onDateChange(next)
  }

  return (
    <section className="week-nav">
      <div className="week-nav-header">
        <button className="week-nav-btn" onClick={() => moveDay(-1)}>&#8249;</button>
        <span className="week-range-text">{formatDateDisplay(currentDate)}</span>
        <button className="week-nav-btn" onClick={() => moveDay(+1)}>&#8250;</button>
      </div>
    </section>
  )
}

export default DateNav
