import { NextResponse, type NextRequest } from "next/server";
import { listSearchHistory } from "@/shared/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 500) : 50;
  return NextResponse.json({ history: listSearchHistory(safeLimit) });
}
