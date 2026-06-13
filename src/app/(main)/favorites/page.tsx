"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { useFavorites } from "@/features/favorites/store";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";

export default function FavoritesPage() {
  const loaded = useFavorites((s) => s.loaded);
  const items = useFavorites((s) => s.items);
  const init = useFavorites((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  const favorites = Object.values(items);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 bg-pop-pink border-3 border-ink rounded-brutal shadow-brutal-sm">
          <Heart className="w-5 h-5 fill-ink" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold leading-tight">Oportunidades guardadas</h1>
          <p className="text-sm font-medium text-ink/60">
            {loaded ? `${favorites.length} guardadas` : "Cargando…"}
          </p>
        </div>
      </div>

      {loaded && favorites.length === 0 && (
        <div className="brutal-card p-8 text-center">
          <p className="font-extrabold text-lg mb-2">Aún no tienes favoritos</p>
          <p className="font-medium text-ink/70 mb-6">
            Lanza un barrido y toca &ldquo;Guardar&rdquo; en las ideas que quieras conservar.
          </p>
          <Link href="/dashboard" className="brutal-btn bg-brand text-ink px-5 py-2.5">
            <ArrowLeft className="w-4 h-4" /> Volver a buscar
          </Link>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {favorites.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
