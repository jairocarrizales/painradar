import { cn } from "@/shared/lib/utils";

type Tone = "brand" | "pink" | "cyan" | "lime" | "violet" | "orange" | "white";

const tones: Record<Tone, string> = {
  brand: "bg-brand",
  pink: "bg-pop-pink",
  cyan: "bg-pop-cyan",
  lime: "bg-pop-lime",
  violet: "bg-pop-violet",
  orange: "bg-pop-orange",
  white: "bg-white",
};

export function Tag({
  tone = "white",
  className,
  ...props
}: { tone?: Tone } & React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("brutal-tag", tones[tone], className)} {...props} />;
}
