"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createPaste() {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Content cannot be empty");
      return;
    }

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
          content: trimmedContent,
          ttl_seconds: 3600, // 1 hour
          max_views: 5,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create paste");

      setResult(data.url);
      setContent("");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#4a90e2" }}>Pastebin Lite</h1>

      <textarea
        rows={8}
        placeholder="Enter your paste content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          fontSize: "1rem",
          marginBottom: "1rem",
          resize: "vertical",
        }}
      />

      <button
        onClick={createPaste}
        disabled={loading || content.trim() === ""}
        style={{
          width: "100%",
          padding: "0.8rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#4a90e2",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
        }}
      >
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {error && (
        <p
          style={{
            color: "red",
            marginTop: "1rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      {result && (
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            backgroundColor: "#f0f8ff",
            padding: "1rem",
            borderRadius: "8px",
            wordBreak: "break-word",
          }}
        >
          Paste URL:{" "}
          <a
            href={result}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4a90e2", textDecoration: "underline" }}
          >
            {result}
          </a>
        </p>
      )}
    </main>
  );
}
