import { cn } from "@/shared/lib/utils";
import { Slot } from "./slot";

type Variant = "brand" | "ink" | "pink" | "cyan" | "lime" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  brand: "bg-brand text-ink",
  ink: "bg-ink text-white",
  pink: "bg-pop-pink text-ink",
  cyan: "bg-pop-cyan text-ink",
  lime: "bg-pop-lime text-ink",
  ghost: "bg-white text-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export function Button({
  className,
  variant = "brand",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn("brutal-btn", variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
