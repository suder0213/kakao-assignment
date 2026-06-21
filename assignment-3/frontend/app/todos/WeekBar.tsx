"use client";

import { useRouter } from "next/navigation";

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

type WeekBarProps = {
  weekDates: string[];
  weekCounts: Record<string, number>;
  selectedDate: string;
  prevWeekDate: string;
  nextWeekDate: string;
  rangeText: string;
  currentFilter: string;
  currentSearch: string;
};

export default function WeekBar({
  weekDates,
  weekCounts,
  selectedDate,
  prevWeekDate,
  nextWeekDate,
  rangeText,
  currentFilter,
  currentSearch,
}: WeekBarProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  function buildUrl(date: string) {
    const params = new URLSearchParams();
    params.set("date", date);
    if (currentFilter) params.set("filter", currentFilter);
    if (currentSearch) params.set("search", currentSearch);
    return `/todos?${params.toString()}`;
  }

  const navBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
    color: "var(--color-text-muted)",
    padding: "4px 10px",
    borderRadius: 8,
    lineHeight: 1,
  };

  return (
    <section style={{ marginBottom: 20, backgroundColor: "var(--color-white)", borderRadius: 12, boxShadow: "var(--shadow)", padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button style={navBtnStyle} onClick={() => router.push(buildUrl(prevWeekDate))}>&#8249;</button>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{rangeText}</span>
        <button style={navBtnStyle} onClick={() => router.push(buildUrl(nextWeekDate))}>&#8250;</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {weekDates.map((date, i) => {
          const isActive = date === selectedDate;
          const isToday = date === today;
          const count = weekCounts[date] ?? 0;
          const dayNum = new Date(date + "T00:00:00").getDate();

          return (
            <button
              key={date}
              onClick={() => router.push(buildUrl(date))}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "8px 4px",
                borderRadius: 10,
                border: isToday && !isActive ? "1.5px solid var(--color-primary)" : "1.5px solid transparent",
                backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                color: isActive ? "white" : isToday ? "var(--color-primary)" : "var(--color-text)",
                cursor: "pointer",
                fontWeight: isActive || isToday ? 700 : 400,
                transition: "background-color 0.15s",
              }}
            >
              <span style={{ fontSize: "0.72rem" }}>{DAY_NAMES[i]}</span>
              <span style={{ fontSize: "1rem", marginTop: 2 }}>{dayNum}</span>
              {count > 0 && (
                <span style={{
                  fontSize: "0.65rem",
                  backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--color-primary-bg)",
                  color: isActive ? "white" : "var(--color-primary)",
                  padding: "1px 5px",
                  borderRadius: 10,
                  marginTop: 3,
                  fontWeight: 600,
                  minWidth: 18,
                  textAlign: "center",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
