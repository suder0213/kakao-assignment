"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 16px", textAlign: "center" }}>
      <p style={{ color: "var(--color-danger)", marginBottom: 16, fontSize: "0.95rem" }}>
        {error.message}
      </p>
      <button
        onClick={reset}
        style={{
          backgroundColor: "var(--color-primary)",
          color: "white",
          border: "none",
          padding: "10px 24px",
          borderRadius: 10,
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        다시 시도
      </button>
    </main>
  );
}
