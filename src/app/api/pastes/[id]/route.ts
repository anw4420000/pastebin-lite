import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNow } from "@/lib/time";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; 

  const now = getNow(req);

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  // Not found
  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // TTL expired
  if (paste.expiresAt && now >= paste.expiresAt) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // View limit exceeded
  if (
    paste.maxViews !== null &&
    paste.viewCount >= paste.maxViews
  ) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // Increment view count
  const updated = await prisma.paste.update({
    where: { id },
    data: {
      viewCount: { increment: 1 },
    },
  });

  const remainingViews =
    updated.maxViews === null
      ? null
      : Math.max(updated.maxViews - updated.viewCount, 0);

  return NextResponse.json({
    content: updated.content,
    remaining_views: remainingViews,
    expires_at: updated.expiresAt
      ? updated.expiresAt.toISOString()
      : null,
  });
}
