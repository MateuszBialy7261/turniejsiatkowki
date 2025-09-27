"use client";

export default function EnvTest() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Test ENV</h2>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ brak"}</p>
      <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ jest" : "❌ brak"}</p>
    </div>
  );
}
