import { Radar } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-extrabold", className)}>
      <span className="inline-flex items-center justify-center w-9 h-9 bg-brand border-3 border-ink rounded-brutal shadow-brutal-sm">
        <Radar className="w-5 h-5" strokeWidth={2.5} />
      </span>
      <span className="text-xl tracking-tight">
        Pain<span className="text-pop-pink">Radar</span>
      </span>
    </span>
  );
}
