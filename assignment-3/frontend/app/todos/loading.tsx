export default function Loading() {
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ height: 36, width: 80, backgroundColor: "#e0d4f7", borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 16, width: 160, backgroundColor: "#ede8f9", borderRadius: 6 }} />
      </div>
      <div style={{ backgroundColor: "white", borderRadius: 10, boxShadow: "var(--shadow)", overflow: "hidden" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 52, margin: "0 20px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 14, backgroundColor: "#f0eafc", borderRadius: 6 }} />
            <div style={{ width: 52, height: 22, backgroundColor: "#f0eafc", borderRadius: 20 }} />
          </div>
        ))}
      </div>
    </main>
  );
}
