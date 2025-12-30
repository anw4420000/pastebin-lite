import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    return Response.json(
      { ok: true },
      { status: 200 }
    );
  } catch (error) {
  return Response.json(
    { ok: false, error: "Database not reachable" },
    { status: 500 }
  );
}

}
