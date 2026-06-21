export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function getWeekStart(dateStr: string): Date {
  const date = new Date(dateStr + "T00:00:00")
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  return date
}

export function getWeekDates(dateStr: string): string[] {
  const monday = getWeekStart(dateStr)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return formatDateKey(d)
  })
}

export function getWeekRangeText(weekDates: string[]): string {
  const start = new Date(weekDates[0] + "T00:00:00")
  const end = new Date(weekDates[6] + "T00:00:00")
  return `${start.getMonth() + 1}월 ${start.getDate()}일 - ${end.getMonth() + 1}월 ${end.getDate()}일`
}

export function shiftWeek(mondayStr: string, offset: number): string {
  const d = new Date(mondayStr + "T00:00:00")
  d.setDate(d.getDate() + offset * 7)
  return formatDateKey(d)
}
