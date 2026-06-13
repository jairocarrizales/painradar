import { Lightbulb, Sparkles } from "lucide-react";
import type { Opportunity } from "@/shared/types/domain";
import { ScoreBar } from "@/shared/components/ui/score-bar";
import { Tag } from "@/shared/components/ui/tag";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { CitationList } from "./citation-list";

interface OpportunityCardProps {
  opportunity: Opportunity;
  rank?: number;
}

export function OpportunityCard({ opportunity, rank }: OpportunityCardProps) {
  const {
    title,
    titleEs,
    problemSummary,
    problemSummaryEs,
    scores,
    overall,
    appIdea,
    citations,
  } = opportunity;

  return (
    <article className="brutal-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {rank != null && (
            <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 bg-ink text-white font-extrabold font-mono rounded-brutal border-3 border-ink">
              {rank}
            </span>
          )}
          <div>
            <h3 className="text-lg font-extrabold tracking-tight leading-tight">{title}</h3>
            {titleEs && (
              <p className="text-sm font-bold text-ink/55 leading-tight mt-0.5">🇪🇸 {titleEs}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-brand border-3 border-ink rounded-brutal px-2 py-1 shadow-brutal-sm">
            <Sparkles className="w-4 h-4" />
            <span className="font-mono font-extrabold leading-none">{overall}</span>
          </div>
          <FavoriteButton opportunity={opportunity} />
        </div>
      </div>

      <div>
        <p className="font-medium text-ink/80">{problemSummary}</p>
        {problemSummaryEs && (
          <p className="font-medium italic text-ink/55 mt-1">🇪🇸 {problemSummaryEs}</p>
        )}
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ScoreBar tone="pain" value={scores.pain} />
        <ScoreBar tone="freq" value={scores.frequency} />
        <ScoreBar tone="gap" value={scores.marketGap} />
      </div>

      {/* App idea */}
      <div className="border-3 border-ink rounded-brutal bg-pop-lime/60 p-4 shadow-brutal-sm">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wide">Idea de app</span>
          <span className="font-extrabold">{appIdea.name}</span>
        </div>
        <p className="font-medium text-sm">{appIdea.pitch}</p>
        {appIdea.pitchEs && (
          <p className="font-medium italic text-sm text-ink/60 mt-1">🇪🇸 {appIdea.pitchEs}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {appIdea.keyFeatures.map((f) => (
            <Tag key={f} tone="white">
              {f}
            </Tag>
          ))}
        </div>
        {appIdea.keyFeaturesEs && appIdea.keyFeaturesEs.length > 0 && (
          <p className="text-xs italic text-ink/55 mt-2">
            🇪🇸 {appIdea.keyFeaturesEs.join(" · ")}
          </p>
        )}
      </div>

      {/* Citations */}
      <CitationList citations={citations} />
    </article>
  );
}
