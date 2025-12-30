import { NextRequest } from "next/server";

export function getNow(req: NextRequest) {
  if (process.env.TEST_MODE === "1") {
    const ms = req.headers.get("x-test-now-ms");
    if (ms) {
      return new Date(Number(ms));
    }
  }
  return new Date();
}
