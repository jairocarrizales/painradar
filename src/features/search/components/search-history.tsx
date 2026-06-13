"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { languageLabel } from "../options";

interface HistoryItem {
  niche: string;
  recency: string;
  language: string;
  sources: string[];
  provider: string;
  count: number;
  createdAt: number;
}

export function SearchHistory() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((d) => setItems(d.history ?? []))
      .catch(() => setItems([]));
  }, []);

  if (!items || items.length === 0) return null;

  const recent = items.slice(0, 6);

  return (
    <div className="brutal-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5" />
          <h3 className="font-extrabold">Búsquedas recientes</h3>
        </div>
        <Link
          href="/historial"
          className="text-sm font-extrabold underline decoration-2 underline-offset-2 hover:text-pop-pink inline-flex items-center gap-1"
        >
          Ver todo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex flex-col divide-y-3 divide-ink/15">
        {recent.map((it, i) => {
          const params = new URLSearchParams({
            niche: it.niche,
            recency: it.recency,
            lang: it.language,
            sources: it.sources.join(","),
          });
          return (
            <Link
              key={`${it.niche}-${i}`}
              href={`/dashboard?${params.toString()}`}
              className="group flex items-center justify-between gap-3 py-2.5 hover:text-pop-pink"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="font-bold truncate">{it.niche}</span>
                <span className="brutal-tag bg-white text-[10px] shrink-0">
                  {languageLabel(it.language)}
                </span>
                <span className="text-xs font-medium text-ink/50 shrink-0">
                  {it.count} resultados
                </span>
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
