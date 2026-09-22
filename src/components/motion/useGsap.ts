"use client";

import { useEffect, useState } from "react";
import { useInteractionGate } from "./useInteractionGate";
import { useIsMobile } from "./useReducedMotion";

export type GsapModule = typeof import("./gsap-init");

// The only route to GSAP. `gsap-init` must never be imported statically from a
// component: one static import anywhere puts all 118 kB back into the initial
// bundle and silently undoes the deferral everywhere else — which is exactly
// what NavbarMotion, Menu and HeroVideo were doing while SectionMotion
// imported it dynamically and appeared to have solved the problem.
export function useGsap(enabled: boolean) {
  // Assume a phone until the media query can be read; hydration's optimistic
  // "desktop" would otherwise open the gate before the correction lands.
  const gated = useInteractionGate(useIsMobile(767, true));
  const [mod, setMod] = useState<GsapModule | null>(null);

  useEffect(() => {
    if (!enabled || !gated || mod) return;
    let alive = true;
    void import("./gsap-init").then((m) => {
      if (alive) setMod(m);
    });
    return () => {
      alive = false;
    };
  }, [enabled, gated, mod]);

  return mod;
}
