import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentPropsWithoutRef<"section"> & {
  id: string;
  as?: "section" | "footer" | "div";
};

// AK-STY-006. Renders the semantic element itself — an extra wrapper box
// breaks every absolute position, because the CSS targets <main>'s children.
export function SectionWrapper({ id, as = "section", className, children, ...rest }: Props) {
  const props = { id, className: cn("section-shell", className), ...rest };

  if (as === "footer") return <footer {...props}>{children}</footer>;
  if (as === "div") return <div {...props}>{children}</div>;
  return <section {...props}>{children}</section>;
}
