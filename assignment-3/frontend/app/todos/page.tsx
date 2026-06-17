import Link from "next/link";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/todos`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("할 일 목록을 불러오지 못했습니다.");
  return res.json();
}

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 16px" }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)", letterSpacing: "-0.5px" }}>
          Todo
        </h1>
        <p style={{ marginTop: 4, fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          오늘 할 일을 정리해보세요
        </p>
      </header>

      <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
        <Link
          href="/todos/new"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            padding: "10px 20px",
            borderRadius: 10,
            fontSize: "0.9rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          + 새 할 일
        </Link>
      </div>

      <section style={{ backgroundColor: "var(--color-white)", borderRadius: 10, boxShadow: "var(--shadow)", overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--color-border)", fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
          <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{todos.length}개</span>의 할 일
        </div>

        {todos.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            할 일이 없습니다
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <Link
                  href={`/todos/${todo.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span style={{
                    fontSize: "0.95rem",
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "var(--color-text-muted)" : "var(--color-text)",
                  }}>
                    {todo.title}
                  </span>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 20,
                    backgroundColor: todo.completed ? "#e6faf0" : "var(--color-primary-bg)",
                    color: todo.completed ? "#2be068" : "var(--color-primary)",
                  }}>
                    {todo.completed ? "완료" : "진행 중"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
