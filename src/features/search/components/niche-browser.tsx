"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { NICHE_CATALOG, type Category } from "../niche-catalog";
import { Tag } from "@/shared/components/ui/tag";

interface NicheBrowserProps {
  /** Called with the chosen term (niche / subnicho / micronicho). */
  onPick: (term: string) => void;
}

export function NicheBrowser({ onPick }: NicheBrowserProps) {
  const [active, setActive] = useState<Category>(NICHE_CATALOG[0]);

  return (
    <div className="border-3 border-ink rounded-brutal bg-white shadow-brutal-sm overflow-hidden">
      {/* Categorías */}
      <div className="flex flex-wrap gap-2 p-3 border-b-3 border-dashed border-ink/20">
        {NICHE_CATALOG.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat)}
            className={`brutal-tag transition-transform ${
              active.id === cat.id ? "bg-brand" : "bg-white hover:-translate-y-0.5"
            }`}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Nichos → subnichos → micronichos de la categoría activa */}
      <div className="p-4 space-y-4 max-h-[22rem] overflow-y-auto">
        {active.niches.map((niche) => (
          <div key={niche.label}>
            <button
              type="button"
              onClick={() => onPick(niche.label)}
              className="inline-flex items-center gap-1 font-extrabold text-base hover:text-pop-pink"
            >
              <ChevronRight className="w-4 h-4" />
              {niche.label}
            </button>
            <div className="mt-2 pl-5 space-y-2">
              {niche.subniches.map((sub) => (
                <div key={sub.label} className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPick(sub.label)}
                    className="text-sm font-bold text-ink/80 hover:text-pop-pink underline decoration-2 underline-offset-2"
                  >
                    {sub.label}
                  </button>
                  <span className="text-ink/30">·</span>
                  {sub.micro.map((m) => (
                    <button key={m} type="button" onClick={() => onPick(m)}>
                      <Tag tone="cyan" className="hover:-translate-y-0.5 transition-transform">
                        {m}
                      </Tag>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
