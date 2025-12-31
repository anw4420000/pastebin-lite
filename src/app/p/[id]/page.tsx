import Link from "next/link";
import { notFound } from "next/navigation";

type ApiResponse = {
  content: string;
};

async function getPaste(id: string): Promise<ApiResponse> {
  if (!id) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // Unwrap params if it's a promise
  const resolvedParams = params instanceof Promise ? await params : params;

  if (!resolvedParams?.id) notFound();

  const { content } = await getPaste(resolvedParams.id);

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#4a90e2", marginBottom: "2rem" }}>
        Paste Content
      </h1>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          color: "#333",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: "1rem",
          lineHeight: 1.5,
        }}
      >
        {content}
      </div>

      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link
          href="/"
          style={{
            color: "#4a90e2",
            textDecoration: "underline",
            fontWeight: "bold",
          }}
        >
          ← Create New Paste
        </Link>
      </p>
    </main>
  );
}
