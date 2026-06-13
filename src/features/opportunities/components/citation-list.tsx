import { ExternalLink, Quote } from "lucide-react";
import type { Citation } from "@/shared/types/domain";
import { sourceLabel, sourceTone } from "@/features/search/options";

export function CitationList({ citations }: { citations: Citation[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wide text-ink/60">
        Citas reales ({citations.length})
      </p>
      {citations.map((c, i) => (
        <blockquote
          key={i}
          className="border-3 border-ink rounded-brutal bg-paper p-3 shadow-brutal-sm"
        >
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 mt-1 shrink-0" />
            <div>
              <p className="text-sm font-medium leading-snug">&ldquo;{c.text}&rdquo;</p>
              {c.textEs && (
                <p className="text-sm font-medium italic text-ink/60 leading-snug mt-1">
                  🇪🇸 &ldquo;{c.textEs}&rdquo;
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pl-6 gap-2">
            <span className="flex items-center gap-2 text-xs font-bold min-w-0">
              <span
                className={`border-2 border-ink rounded-full px-2 py-0.5 bg-${sourceTone(c.platform)}`}
              >
                {sourceLabel(c.platform)}
              </span>
              <span className="text-ink/70 truncate">
                {c.author}
                {c.context ? ` · ${c.context}` : ""}
              </span>
            </span>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-extrabold underline decoration-2 underline-offset-2 hover:text-pop-pink shrink-0"
            >
              Fuente <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </blockquote>
      ))}
    </div>
  );
}
