"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Compass, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LANGUAGES, SOURCES, DEFAULT_SOURCES } from "../options";
import { NicheBrowser } from "./niche-browser";

const RECENCY = [
  { value: "month", label: "Último mes" },
  { value: "year", label: "Último año" },
  { value: "all", label: "Siempre" },
];

interface SearchBarProps {
  initialNiche?: string;
  initialRecency?: string;
  initialLang?: string;
  initialSources?: string[];
}

export function SearchBar({
  initialNiche = "",
  initialRecency = "year",
  initialLang = "es",
  initialSources,
}: SearchBarProps) {
  const router = useRouter();
  const [niche, setNiche] = useState(initialNiche);
  const [recency, setRecency] = useState(initialRecency);
  const [language, setLanguage] = useState(initialLang);
  const [sources, setSources] = useState<string[]>(initialSources ?? DEFAULT_SOURCES);
  const [showBrowser, setShowBrowser] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggleSource(id: string) {
    setSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function run(targetNiche: string) {
    const value = targetNiche.trim();
    if (value.length < 2) return;
    const chosen = sources.length ? sources : DEFAULT_SOURCES;
    const params = new URLSearchParams({
      niche: value,
      recency,
      lang: language,
      sources: chosen.join(","),
    });
    startTransition(() => router.push(`/dashboard?${params.toString()}`));
  }

  return (
    <div className="brutal-card p-5 md:p-6 space-y-5">
      {/* Buscador */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(niche);
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
          <Input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Escribe un nicho, palabra clave o tema…"
            className="pl-11"
            aria-label="Nicho, palabra clave o tema"
          />
        </div>
        <Button type="submit" variant="ink" size="lg" disabled={pending} className="sm:w-auto">
          {pending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Buscando…
            </>
          ) : (
            <>
              <Search className="w-5 h-5" /> Buscar
            </>
          )}
        </Button>
      </form>

      {/* Idioma + Recencia */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink/60 mb-2">
            Idioma de búsqueda
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`brutal-tag transition-transform ${
                  language === l.code ? "bg-brand" : "bg-white hover:-translate-y-0.5"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink/60 mb-2">Recencia</p>
          <div className="flex flex-wrap gap-2">
            {RECENCY.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRecency(r.value)}
                className={`brutal-tag transition-transform ${
                  recency === r.value ? "bg-pop-cyan" : "bg-white hover:-translate-y-0.5"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fuentes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wide text-ink/60">
            Dónde buscar ({sources.length})
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSources(SOURCES.map((s) => s.id))}
              className="text-xs font-bold underline decoration-2 underline-offset-2 hover:text-pop-pink"
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setSources([])}
              className="text-xs font-bold underline decoration-2 underline-offset-2 hover:text-pop-pink"
            >
              Ninguna
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => {
            const on = sources.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSource(s.id)}
                aria-pressed={on}
                className={`brutal-tag transition-transform hover:-translate-y-0.5 ${
                  on ? `bg-${s.tone}` : "bg-white opacity-60"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navegador de nichos */}
      <div>
        <button
          type="button"
          onClick={() => setShowBrowser((v) => !v)}
          className="brutal-btn bg-pop-lime text-ink px-4 py-2 text-sm"
        >
          <Compass className="w-4 h-4" />
          {showBrowser ? "Ocultar nichos" : "¿Sin ideas? Explora nichos"}
          <ChevronDown className={`w-4 h-4 transition-transform ${showBrowser ? "rotate-180" : ""}`} />
        </button>
        {showBrowser && (
          <div className="mt-3">
            <NicheBrowser
              onPick={(term) => {
                setNiche(term);
                run(term);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
