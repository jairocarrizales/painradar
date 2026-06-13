import { cloneElement, isValidElement } from "react";
import { cn } from "@/shared/lib/utils";

/**
 * Minimal Slot: merges its own props/className onto a single child element.
 * Lets <Button asChild><Link/></Button> render an anchor with button styles.
 */
export function Slot({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) {
  if (!isValidElement(children)) return null;
  const child = children as React.ReactElement<Record<string, unknown>>;
  return cloneElement(child, {
    ...props,
    ...child.props,
    className: cn(className, child.props.className as string | undefined),
  });
}
