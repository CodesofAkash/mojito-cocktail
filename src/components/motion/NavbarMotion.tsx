"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "./gsap-init";
import { useReducedMotion } from "./useReducedMotion";

export function NavbarMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const nav = scope.current?.querySelector("nav");
      if (!nav) return;

      gsap
        .timeline({ scrollTrigger: { trigger: nav, start: "bottom top" } })
        .fromTo(
          nav,
          { backgroundColor: "transparent", backdropFilter: "blur(0px)" },
          {
            backgroundColor: "#00000050",
            backdropFilter: "blur(10px)",
            duration: 1,
            ease: "power1.inOut",
          },
        );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <div ref={scope} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
