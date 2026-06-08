// ===========================
// FilterTabs — 상태별 필터 탭 (전체 / 진행 중 / 완료)
// props:
//   currentFilter  — 현재 선택된 필터 ('all' | 'active' | 'completed')
//   onFilterChange — 필터 변경 함수 (App의 setCurrentFilter를 그대로 전달받음)
// ===========================
function FilterTabs({ currentFilter, onFilterChange }) {
  const tabs = [
    { key: 'all',       label: '전체' },
    { key: 'active',    label: '진행 중' },
    { key: 'completed', label: '완료' },
  ]

  return (
    <div className="filter-tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          // currentFilter와 일치하는 탭에만 active 클래스를 추가한다.
          // Vanilla JS의 updateFilterTabs()가 classList.add/remove('active')를 반복하던 것과 달리,
          // JSX에서는 렌더 시점에 조건식으로 클래스를 계산한다.
          className={`filter-tab${currentFilter === tab.key ? ' active' : ''}`}
          onClick={() => onFilterChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
