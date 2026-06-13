import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Users, Search, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Metodología — PainRadar" };

const METRICS = [
  {
    icon: Flame,
    name: "Dolor",
    tone: "bg-pop-red",
    weight: "45%",
    mide: "Qué tan frustrados o molestos están los usuarios con el problema (la intensidad de la emoción negativa).",
    sube: 'Lenguaje fuerte como “lo odio”, “es una pesadilla”, “me rendí”, “llevo años sufriendo esto”.',
  },
  {
    icon: Users,
    name: "Frecuencia",
    tone: "bg-pop-cyan",
    weight: "35%",
    mide: "Cuánta gente distinta menciona el mismo problema (qué tan extendido y recurrente es).",
    sube: "El mismo dolor repetido por muchas personas en muchos hilos, videos o reseñas.",
  },
  {
    icon: Search,
    name: "Hueco de mercado",
    tone: "bg-pop-lime",
    weight: "20%",
    mide: "Qué tan SIN resolver está el problema hoy (el espacio libre / la oportunidad).",
    sube: 'Frases como “no existe ninguna app que haga esto” o quejas de que las soluciones actuales son malas.',
  },
];

export default function MetodologiaPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 bg-brand border-3 border-ink rounded-brutal shadow-brutal-sm">
          <Sparkles className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold leading-tight">Cómo se calcula la puntuación</h1>
          <p className="text-sm font-medium text-ink/60">
            Qué significa cada métrica y cómo se obtiene el ranking.
          </p>
        </div>
      </div>

      <div className="brutal-card p-5">
        <p className="font-medium text-ink/80">
          Cada oportunidad recibe <strong>3 puntuaciones de 0 a 100</strong> (equivalen a una escala de
          0 a 10 multiplicada por 10: por ejemplo <strong>76/100 = 7.6/10</strong>). En modo agente, es
          el propio <strong>Claude</strong> quien asigna estas puntuaciones leyendo las quejas reales
          que encuentra. Con ellas se calcula una <strong>puntuación global</strong> y se ordenan los
          resultados.
        </p>
      </div>

      {/* Las 3 métricas */}
      <div className="space-y-4">
        {METRICS.map((m) => (
          <div key={m.name} className="brutal-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center justify-center w-10 h-10 ${m.tone} border-3 border-ink rounded-brutal shadow-brutal-sm`}>
                <m.icon className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold">{m.name}</h2>
              <span className="brutal-tag bg-white ml-auto">peso {m.weight}</span>
            </div>
            <p className="font-medium text-ink/80 mb-2">
              <span className="font-extrabold">Qué mide:</span> {m.mide}
            </p>
            <p className="font-medium text-ink/70 text-sm">
              <span className="font-extrabold">Qué la sube:</span> {m.sube}
            </p>
          </div>
        ))}
      </div>

      {/* Fórmula */}
      <div className="brutal-card p-5 bg-pop-lime/40">
        <h2 className="text-xl font-extrabold mb-3">Puntuación global (overall)</h2>
        <p className="font-medium text-ink/80 mb-3">
          Es la combinación ponderada de las tres. El <strong>dolor pesa más</strong> (un problema muy
          doloroso es la mejor señal de oportunidad), luego la frecuencia, y por último el hueco:
        </p>
        <pre className="border-3 border-ink rounded-brutal bg-white p-4 font-mono text-sm font-bold overflow-x-auto shadow-brutal-sm">
{`global = Dolor × 0.45  +  Frecuencia × 0.35  +  Hueco × 0.20`}
        </pre>
        <p className="font-medium text-ink/70 text-sm mt-3">
          Ejemplo: Dolor 90, Frecuencia 80, Hueco 60 →
          {" "}<strong>90×0.45 + 80×0.35 + 60×0.20 = 40.5 + 28 + 12 = 80.5 ≈ 81/100</strong>.
        </p>
      </div>

      {/* Ranking */}
      <div className="brutal-card p-5">
        <h2 className="text-xl font-extrabold mb-2">El ranking (#1, #2, #3…)</h2>
        <p className="font-medium text-ink/80">
          Las oportunidades se ordenan de <strong>mayor a menor puntuación global</strong>. La{" "}
          <strong>#1</strong> es la de mayor puntuación: el problema más doloroso, frecuente y menos
          resuelto. Así, lo primero que ves arriba es lo que más vale la pena construir.
        </p>
      </div>

      <Link href="/dashboard" className="brutal-btn bg-brand text-ink px-5 py-2.5 inline-flex">
        Volver a buscar <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
