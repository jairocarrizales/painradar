"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { History, Search, ArrowRight, Calendar } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { LANGUAGES, languageLabel } from "@/features/search/options";

interface HistoryItem {
  niche: string;
  recency: string;
  language: string;
  sources: string[];
  provider: string;
  count: number;
  createdAt: number;
}

function fmtDate(ms: number): string {
  try {
    return new Date(ms).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "";
  }
}

export default function HistorialPage() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("all");

  useEffect(() => {
    fetch("/api/history?limit=500")
      .then((r) => r.json())
      .then((d) => setItems(d.history ?? []))
      .catch(() => setItems([]));
  }, []);

  // Idiomas presentes en el historial (para no mostrar filtros vacíos).
  const langsPresent = useMemo(() => {
    const set = new Set((items ?? []).map((i) => i.language));
    return LANGUAGES.filter((l) => set.has(l.code));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? []).filter((it) => {
      const okLang = lang === "all" || it.language === lang;
      const okText = !q || it.niche.toLowerCase().includes(q);
      return okLang && okText;
    });
  }, [items, query, lang]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 bg-pop-cyan border-3 border-ink rounded-brutal shadow-brutal-sm">
          <History className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold leading-tight">Historial de búsquedas</h1>
          <p className="text-sm font-medium text-ink/60">
            {items === null
              ? "Cargando…"
              : `${filtered.length} de ${items.length} búsquedas guardadas`}
          </p>
        </div>
      </div>

      {/* Buscador + filtros */}
      <div className="brutal-card p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar por nicho…"
            className="pl-11"
            aria-label="Filtrar por nicho"
          />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink/60 mb-2">Idioma</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLang("all")}
              className={`brutal-tag transition-transform ${
                lang === "all" ? "bg-brand" : "bg-white hover:-translate-y-0.5"
              }`}
            >
              Todos
            </button>
            {langsPresent.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`brutal-tag transition-transform ${
                  lang === l.code ? "bg-brand" : "bg-white hover:-translate-y-0.5"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista */}
      {items !== null && filtered.length === 0 && (
        <div className="brutal-card p-8 text-center">
          <p className="font-extrabold text-lg mb-2">
            {items.length === 0 ? "Aún no hay búsquedas" : "Nada coincide con el filtro"}
          </p>
          <p className="font-medium text-ink/70 mb-6">
            {items.length === 0
              ? "Haz una búsqueda y aparecerá aquí guardada."
              : "Prueba con otro texto o idioma."}
          </p>
          <Link href="/dashboard" className="brutal-btn bg-brand text-ink px-5 py-2.5">
            Ir a buscar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="brutal-card divide-y-3 divide-ink/10">
          {filtered.map((it, i) => {
            const params = new URLSearchParams({
              niche: it.niche,
              recency: it.recency,
              lang: it.language,
              sources: it.sources.join(","),
            });
            return (
              <Link
                key={`${it.niche}-${it.language}-${i}`}
                href={`/dashboard?${params.toString()}`}
                className="group flex items-center justify-between gap-3 p-4 hover:bg-paper"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold truncate">{it.niche}</span>
                    <span className="brutal-tag bg-pop-cyan text-[10px]">
                      {languageLabel(it.language)}
                    </span>
                    <span className="text-xs font-bold text-ink/50">{it.count} resultados</span>
                  </div>
                  <p className="text-xs font-medium text-ink/50 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {fmtDate(it.createdAt)}
                    {it.sources.length ? ` · ${it.sources.length} fuentes` : ""}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
