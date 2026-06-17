import Link from "next/link";
import { notFound } from "next/navigation";
import EditTodoForm from "./EditTodoForm";

type Todo = { id: number; title: string; completed: boolean };

async function getTodo(id: string): Promise<Todo> {
  const res = await fetch(`${process.env.BACKEND_URL}/todos/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("할 일을 불러오지 못했습니다.");
  return res.json();
}

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodo(todoId);

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 16px" }}>
      <header style={{ marginBottom: 32 }}>
        <Link href="/todos" style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", textDecoration: "none" }}>
          ← 목록으로
        </Link>
        <h1 style={{ marginTop: 12, fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)" }}>
          할 일 수정
        </h1>
      </header>

      <section style={{ backgroundColor: "var(--color-white)", borderRadius: 10, boxShadow: "var(--shadow)", padding: "24px 20px" }}>
        <EditTodoForm todo={todo} />
      </section>
    </main>
  );
}
