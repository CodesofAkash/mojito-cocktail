"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useGsap } from "./useGsap";
import { useReducedMotion } from "./useReducedMotion";

export function NavbarMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mod = useGsap(!reduced);

  useEffect(() => {
    if (!mod) return;
    const nav = scope.current?.querySelector("nav");
    if (!nav) return;

    const ctx = mod.gsap.context(() => {
      mod.gsap
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
    }, scope);

    return () => ctx.revert();
  }, [mod]);

  return (
    <div ref={scope} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
