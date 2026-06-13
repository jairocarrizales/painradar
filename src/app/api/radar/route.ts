import { NextResponse, type NextRequest } from "next/server";
import { runSearch } from "@/features/search/pipeline";
import { aiProvider } from "@/shared/lib/utils";
import { getCachedSearch, setCachedSearch } from "@/shared/lib/db";
import { DEFAULT_SOURCES } from "@/features/search/options";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const niche = (sp.get("niche") ?? "").trim();
  const recency = sp.get("recency") ?? "year";
  const language = sp.get("lang") ?? "es";
  const sourcesRaw = sp.get("sources");
  const sources = sourcesRaw ? sourcesRaw.split(",").filter(Boolean) : DEFAULT_SOURCES;
  const refresh = sp.get("refresh") === "1";

  if (niche.length < 2) {
    return NextResponse.json({ error: "Falta el nicho" }, { status: 400 });
  }

  if (!refresh) {
    const cached = getCachedSearch(niche, recency, language, sources);
    if (cached) {
      return NextResponse.json({
        niche,
        language,
        provider: cached.provider,
        opportunities: cached.opportunities,
        cached: true,
        createdAt: cached.createdAt,
      });
    }
  }

  try {
    const result = await runSearch(
      niche,
      { recency: recency as never, language, sources },
      request.signal, // cancelling the request stops the agent
    );
    const provider = aiProvider();
    setCachedSearch(niche, recency, language, sources, provider, result.opportunities);
    return NextResponse.json({
      niche: result.niche,
      language,
      provider,
      opportunities: result.opportunities,
      cached: false,
    });
  } catch (err) {
    console.error("[PainRadar] /api/radar falló:", err);
    return NextResponse.json({ error: "La búsqueda falló" }, { status: 500 });
  }
}
