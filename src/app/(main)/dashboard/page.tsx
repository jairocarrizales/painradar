import type { Metadata } from "next";
import { SearchBar } from "@/features/search/components/search-bar";
import { EmptyState } from "@/features/opportunities/components/empty-state";
import { ResultsView } from "@/features/opportunities/components/results-view";
import { SearchHistory } from "@/features/search/components/search-history";
import { DEFAULT_SOURCES } from "@/features/search/options";

export const metadata: Metadata = { title: "Buscar — PainRadar" };

interface PageProps {
  searchParams: Promise<{
    niche?: string;
    recency?: string;
    lang?: string;
    sources?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const niche = (sp.niche ?? "").trim();
  const recency = sp.recency ?? "year";
  const lang = sp.lang ?? "es";
  const sources = sp.sources ? sp.sources.split(",").filter(Boolean) : DEFAULT_SOURCES;
  const hasQuery = niche.length >= 2;

  return (
    <div className="space-y-6">
      <SearchBar
        initialNiche={niche}
        initialRecency={recency}
        initialLang={lang}
        initialSources={sources}
      />
      {hasQuery ? (
        <ResultsView
          key={`${niche}|${recency}|${lang}|${sources.join(",")}`}
          niche={niche}
          recency={recency}
          lang={lang}
          sources={sources}
        />
      ) : (
        <>
          <EmptyState />
          <SearchHistory />
        </>
      )}
    </div>
  );
}
