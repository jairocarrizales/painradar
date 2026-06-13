"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import type { Opportunity } from "@/shared/types/domain";
import { useFavorites } from "../store";
import { cn } from "@/shared/lib/utils";

export function FavoriteButton({ opportunity }: { opportunity: Opportunity }) {
  const loaded = useFavorites((s) => s.loaded);
  const items = useFavorites((s) => s.items);
  const toggle = useFavorites((s) => s.toggle);
  const init = useFavorites((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  const saved = loaded && Boolean(items[opportunity.id]);

  return (
    <button
      type="button"
      onClick={() => toggle(opportunity)}
      aria-pressed={saved}
      aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={cn(
        "brutal-btn px-3 py-2 text-sm shrink-0",
        saved ? "bg-pop-pink text-ink" : "bg-white text-ink",
      )}
    >
      <Heart className={cn("w-4 h-4", saved && "fill-ink")} />
      {saved ? "Guardada" : "Guardar"}
    </button>
  );
}
