import { cn } from "@/shared/lib/utils";

type ScoreTone = "pain" | "freq" | "gap";

const toneFill: Record<ScoreTone, string> = {
  pain: "bg-pop-red",
  freq: "bg-pop-cyan",
  gap: "bg-pop-lime",
};

const toneLabel: Record<ScoreTone, string> = {
  pain: "Dolor",
  freq: "Frecuencia",
  gap: "Hueco",
};

interface ScoreBarProps {
  tone: ScoreTone;
  /** 0–100 */
  value: number;
  className?: string;
}

export function ScoreBar({ tone, value, className }: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wide">
          {toneLabel[tone]}
        </span>
        <span className="font-mono text-sm font-extrabold">{clamped}</span>
      </div>
      <div className="h-4 w-full border-3 border-ink bg-white rounded-brutal overflow-hidden">
        <div
          className={cn("h-full border-r-3 border-ink", toneFill[tone])}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={toneLabel[tone]}
        />
      </div>
    </div>
  );
}
