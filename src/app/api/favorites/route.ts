import { NextResponse, type NextRequest } from "next/server";
import { OpportunitySchema } from "@/shared/types/domain";
import { listFavorites, removeFavorite, toggleFavorite } from "@/shared/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ favorites: listFavorites() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = OpportunitySchema.safeParse(body?.opportunity);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid opportunity" }, { status: 400 });
  }
  const { saved } = toggleFavorite(parsed.data);
  return NextResponse.json({ saved });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  removeFavorite(id);
  return NextResponse.json({ ok: true });
}
