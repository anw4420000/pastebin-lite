import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getNow } from "../../../lib/time";

export async function POST(req: NextRequest) {
  let body: unknown;

  // ---- Parse JSON ----
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body as {
    content?: unknown;
    ttl_seconds?: unknown;
    max_views?: unknown;
  };

  // ---- Validation ----
  if (typeof content !== "string" || content.trim().length === 0) {
    return Response.json(
      { error: "content must be a non-empty string" },
      { status: 400 }
    );
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return Response.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return Response.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  // ---- Expiry calculation ----
  const now = getNow(req);
  const expiresAt =
    ttl_seconds !== undefined
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null;

  // ---- Create paste ----
  const paste = await prisma.paste.create({
    data: {
      content,
      expiresAt,
      maxViews: max_views ?? null,
    },
  });

  const url = `${req.nextUrl.origin}/p/${paste.id}`;

  // ---- Success response ----
  return Response.json(
    { id: paste.id, url },
    { status: 201 }
  );
}
