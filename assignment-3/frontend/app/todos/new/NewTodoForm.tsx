"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTodoForm({ defaultDate }: { defaultDate: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!title.trim()) {
      setError("할 일을 입력해주세요.");
      return;
    }
    setLoading(true);
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), date: defaultDate }),
    });
    router.push(`/todos?date=${defaultDate}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(""); }}
          placeholder="할 일을 입력하세요"
          autoFocus
          style={{
            flex: 1,
            padding: "12px 16px",
            border: `2px solid ${error ? "var(--color-danger)" : "var(--color-border)"}`,
            borderRadius: 10,
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "저장 중..." : "추가"}
        </button>
      </div>
      {error && <p style={{ marginTop: 8, fontSize: "0.82rem", color: "var(--color-danger)" }}>{error}</p>}
    </form>
  );
}
