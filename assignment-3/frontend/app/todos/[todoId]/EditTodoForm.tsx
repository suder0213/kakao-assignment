"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Todo = { id: number; title: string; completed: boolean };

export default function EditTodoForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), completed }),
    });
    router.push("/todos");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("정말 삭제할까요?")) return;
    setLoading(true);
    await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
    router.push("/todos");
    router.refresh();
  }

  const btnBase = {
    flex: 1,
    padding: "8px 14px",
    borderRadius: 10,
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    opacity: loading ? 0.6 : 1,
  } as const;

  return (
    <form onSubmit={handleUpdate}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "2px solid var(--color-primary)",
            borderRadius: 10,
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: "0.9rem", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: "var(--color-primary)" }}
        />
        완료됨
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="submit"
          disabled={loading}
          style={{ ...btnBase, backgroundColor: "var(--color-primary)", color: "white" }}
        >
          저장
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          style={{ ...btnBase, backgroundColor: "var(--color-danger-light)", color: "var(--color-danger)" }}
        >
          삭제
        </button>
      </div>
    </form>
  );
}
