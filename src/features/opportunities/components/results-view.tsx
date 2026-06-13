"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radar,
  Loader2,
  AlertTriangle,
  RotateCw,
  Timer,
  Database,
  CircleStop,
  Play,
  Trash2,
} from "lucide-react";
import type { Opportunity } from "@/shared/types/domain";
import { OpportunityCard } from "./opportunity-card";
import { ExportButton } from "@/features/export/components/export-button";

interface ResultsViewProps {
  niche: string;
  recency: string;
  lang: string;
  sources: string[];
}

type State =
  | { kind: "loading" }
  | { kind: "stopped" }
  | { kind: "error"; message: string }
  | {
      kind: "done";
      opportunities: Opportunity[];
      provider: string;
      cached: boolean;
      durationSec: number;
    };

const LOADING_STEPS = [
  "Despachando al agente radar…",
  "Buscando quejas reales en las fuentes…",
  "Leyendo lo que de verdad molesta a la gente…",
  "Agrupando dolores en oportunidades…",
  "Puntuando dolor × frecuencia × hueco de mercado…",
  "Redactando ideas de app para cada hueco…",
  "Traduciendo y rankeando tus oportunidades…",
];

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ResultsView({ niche, recency, lang, sources }: ResultsViewProps) {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const reqId = useRef(0);
  const secondsRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    (refresh = false) => {
      const id = ++reqId.current;
      secondsRef.current = 0;
      const ac = new AbortController();
      abortRef.current = ac;
      const params = new URLSearchParams({ niche, recency, lang, sources: sources.join(",") });
      if (refresh) params.set("refresh", "1");
      fetch(`/api/radar?${params.toString()}`, { signal: ac.signal })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.error ?? "La búsqueda falló");
          }
          return res.json();
        })
        .then((data) => {
          if (id !== reqId.current) return;
          setState({
            kind: "done",
            opportunities: data.opportunities,
            provider: data.provider,
            cached: Boolean(data.cached),
            durationSec: secondsRef.current,
          });
        })
        .catch((err) => {
          if (id !== reqId.current) return;
          if (ac.signal.aborted) {
            setState({ kind: "stopped" }); // user stopped it on purpose
            return;
          }
          setState({ kind: "error", message: String(err.message ?? err) });
        });
    },
    [niche, recency, lang, sources],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Cronómetro + narrativa mientras carga (setState solo en el callback del intervalo).
  useEffect(() => {
    if (state.kind !== "loading") return;
    const t = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
      setStep((s) => (secondsRef.current % 4 === 0 ? (s + 1) % LOADING_STEPS.length : s));
    }, 1000);
    return () => clearInterval(t);
  }, [state.kind]);

  function stop() {
    abortRef.current?.abort();
  }
  function restart() {
    setSeconds(0);
    setState({ kind: "loading" });
    load(true);
  }
  function discard() {
    abortRef.current?.abort();
    router.push("/dashboard");
  }

  if (state.kind === "loading") {
    return (
      <div className="brutal-card p-8 text-center">
        <span className="inline-flex items-center justify-center w-16 h-16 bg-brand border-3 border-ink rounded-brutal shadow-brutal mb-4">
          <Radar className="w-8 h-8 animate-spin" strokeWidth={2.5} />
        </span>
        <h2 className="text-xl font-extrabold mb-2">Buscando &ldquo;{niche}&rdquo;</h2>
        <div className="inline-flex items-center gap-2 bg-ink text-white font-mono font-extrabold border-3 border-ink rounded-brutal px-4 py-2 shadow-brutal-sm mb-3">
          <Timer className="w-5 h-5" /> {fmt(seconds)}
        </div>
        <p className="flex items-center justify-center gap-2 font-medium text-ink/70">
          <Loader2 className="w-4 h-4 animate-spin" />
          {LOADING_STEPS[step]}
        </p>
        <div className="mt-5">
          <button type="button" onClick={stop} className="brutal-btn bg-pop-red text-ink px-5 py-2.5">
            <CircleStop className="w-5 h-5" /> Detener búsqueda
          </button>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-ink/40">
          El agente puede tardar unos minutos — lee hilos reales antes de responder.
        </p>
      </div>
    );
  }

  if (state.kind === "stopped") {
    return (
      <div className="brutal-card p-8 text-center">
        <span className="inline-flex items-center justify-center w-14 h-14 bg-pop-orange border-3 border-ink rounded-brutal shadow-brutal mb-4">
          <CircleStop className="w-7 h-7" />
        </span>
        <h2 className="text-xl font-extrabold mb-1">Búsqueda detenida</h2>
        <p className="font-medium text-ink/70 mb-6">
          Cancelaste la búsqueda de &ldquo;{niche}&rdquo;. Puedes reanudarla (se ejecuta de nuevo)
          o descartarla.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={restart} className="brutal-btn bg-brand text-ink px-5 py-2.5">
            <Play className="w-4 h-4" /> Reanudar
          </button>
          <button type="button" onClick={discard} className="brutal-btn bg-white text-ink px-5 py-2.5">
            <Trash2 className="w-4 h-4" /> Descartar
          </button>
        </div>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="brutal-card p-8 text-center">
        <span className="inline-flex items-center justify-center w-14 h-14 bg-pop-red border-3 border-ink rounded-brutal shadow-brutal mb-4">
          <AlertTriangle className="w-7 h-7" />
        </span>
        <h2 className="text-xl font-extrabold mb-1">La búsqueda falló</h2>
        <p className="font-medium text-ink/70 mb-6">{state.message}</p>
        <button type="button" onClick={restart} className="brutal-btn bg-brand text-ink px-5 py-2.5">
          <RotateCw className="w-4 h-4" /> Reintentar
        </button>
      </div>
    );
  }

  const { opportunities, cached, durationSec } = state;
  const providerLabel = "investigación web en vivo";

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 brutal-card p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 bg-pop-cyan border-3 border-ink rounded-brutal shadow-brutal-sm">
            <Radar className="w-5 h-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="font-extrabold leading-tight">
              {opportunities.length} oportunidades para &ldquo;{niche}&rdquo;
            </p>
            <p className="text-sm font-medium text-ink/60 flex flex-wrap items-center gap-x-2">
              <span>
                Rankeadas por dolor × frecuencia × hueco · {providerLabel} ·{" "}
                <Link href="/metodologia" className="underline decoration-2 underline-offset-2 hover:text-pop-pink">
                  ¿cómo se calcula?
                </Link>
              </span>
              {cached ? (
                <span className="inline-flex items-center gap-1 text-ink/50">
                  <Database className="w-3.5 h-3.5" /> desde caché
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-ink/50">
                  <Timer className="w-3.5 h-3.5" /> {fmt(durationSec)}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={restart}
            className="brutal-btn bg-white text-ink px-4 py-2 text-sm"
            title="Volver a ejecutar la búsqueda (ignora la caché)"
          >
            <RotateCw className="w-4 h-4" /> Refrescar
          </button>
          <ExportButton niche={niche} opportunities={opportunities} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {opportunities.map((opp, i) => (
          <OpportunityCard key={opp.id} opportunity={opp} rank={i + 1} />
        ))}
      </div>
    </>
  );
}
