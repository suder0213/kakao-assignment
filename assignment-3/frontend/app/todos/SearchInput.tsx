"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    const params = new URLSearchParams();
    const filter = searchParams.get("filter");
    if (filter) params.set("filter", filter);
    if (value.trim()) params.set("search", value.trim());
    const query = params.toString();
    router.push(`/todos${query ? `?${query}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 6, marginBottom: 12 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="검색..."
        style={{
          flex: 1,
          padding: "8px 14px",
          border: "1.5px solid var(--color-border)",
          borderRadius: 10,
          fontSize: "0.9rem",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: 10,
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        검색
      </button>
    </form>
  );
}
