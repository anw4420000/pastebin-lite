import { notFound } from "next/navigation";

type ApiResponse = {
  content: string;
};

async function getPaste(id: string): Promise<ApiResponse> {
  const res = await fetch(`/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const { content } = await getPaste(params.id);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Paste</h1>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {content}
      </pre>
    </main>
  );
}
