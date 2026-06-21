import Link from "next/link";
import NewTodoForm from "./NewTodoForm";
import { formatDateKey } from "../utils/date";

export default async function NewTodoPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const today = formatDateKey(new Date());
  const defaultDate = date ?? today;

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 16px" }}>
      <header style={{ marginBottom: 32 }}>
        <Link href={`/todos?date=${defaultDate}`} style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", textDecoration: "none" }}>
          ← 목록으로
        </Link>
        <h1 style={{ marginTop: 12, fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)" }}>
          새 할 일
        </h1>
        <p style={{ marginTop: 4, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          {defaultDate}
        </p>
      </header>

      <NewTodoForm defaultDate={defaultDate} />
    </main>
  );
}
