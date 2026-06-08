// ===========================
// 날짜 유틸리티 함수
// step4에서 App.jsx 인라인 함수를 이 파일로 분리.
// step6(주간 뷰)에서 getWeekStart, getWeekDates가 추가될 예정.
// ===========================

/**
 * Date 객체를 'YYYY-MM-DD' 문자열로 변환
 * Todo 저장 및 날짜 비교의 기준값으로 사용한다.
 */
export function formatDateKey(date) {
  const y = date.getFullYear()
  // getMonth()는 0부터 시작하므로 +1, padStart로 한 자리 숫자 앞에 0 추가 (ex. 5 → '05')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Date 객체를 화면 표시용 문자열로 변환
 * ex) 2026년 6월 8일 (월)
 */
export function formatDateDisplay(date) {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const y       = date.getFullYear()
  const m       = date.getMonth() + 1
  const d       = date.getDate()
  // getDay()는 요일을 0(일)~6(토) 숫자로 반환 — dayNames 배열의 인덱스로 사용
  const dayName = dayNames[date.getDay()]
  return `${y}년 ${m}월 ${d}일 (${dayName})`
}

/**
 * 두 Date 객체가 같은 날짜인지 비교 (시간 제외)
 */
export function isSameDay(a, b) {
  return formatDateKey(a) === formatDateKey(b)
}

/**
 * 주어진 날짜가 속한 주의 월요일을 반환
 * JS의 getDay()는 0(일)~6(토)이므로 월요일 기준으로 보정
 */
export function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  // 일요일(0)이면 -6, 나머지는 -(day-1)을 더해 월요일로 이동
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

/**
 * 주어진 날짜가 속한 주의 월~일 배열(7개)을 반환
 */
export function getWeekDates(date) {
  const monday = getWeekStart(date)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}
