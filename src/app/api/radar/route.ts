import { NextResponse, type NextRequest } from "next/server";
import { runSearch } from "@/features/search/pipeline";
import { getCachedSearch, setCachedSearch } from "@/shared/lib/db";
import { DEFAULT_SOURCES } from "@/features/search/options";
import { collectAppStoreIntel } from "@/features/ingestion/appstore";

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
        intel: cached.intel,
        cached: true,
        createdAt: cached.createdAt,
      });
    }
  }

  try {
    // El panel de inteligencia (App Store) se obtiene en paralelo con la búsqueda del agente.
    const intelPromise = sources.includes("appstore")
      ? collectAppStoreIntel(niche, language, request.signal)
      : Promise.resolve(null);
    const [result, intel] = await Promise.all([
      runSearch(niche, { recency: recency as never, language, sources }, request.signal),
      intelPromise,
    ]);

    setCachedSearch(niche, recency, language, sources, "claude-agent", result.opportunities, intel);
    return NextResponse.json({
      niche: result.niche,
      language,
      provider: "claude-agent",
      opportunities: result.opportunities,
      intel,
      cached: false,
    });
  } catch (err) {
    if (request.signal.aborted) {
      return NextResponse.json({ error: "Búsqueda cancelada" }, { status: 499 });
    }
    console.error("[PainRadar] /api/radar falló:", err);
    const message =
      err instanceof Error && err.message
        ? err.message
        : "La búsqueda falló. Verifica tu token y tu conexión, e intenta de nuevo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
