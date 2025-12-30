"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createPaste() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          ttl_seconds: 3600, // 1 hour
          max_views: 5,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create paste");
      }

      setResult(data.url);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        rows={6}
        placeholder="Enter your paste content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <button onClick={createPaste} disabled={loading}>
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <p>
          Paste URL:{" "}
          <a href={result} target="_blank">
            {result}
          </a>
        </p>
      )}
    </main>
  );
}
