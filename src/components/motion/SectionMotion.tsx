"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInteractionGate } from "./useInteractionGate";
import { useNearViewport } from "./useNearViewport";
import { useIsMobile, useReducedMotion } from "./useReducedMotion";
import { EASE, PRESET_FROM, resolve, type AnimationSettings } from "@/lib/animation";

type SectionKind = "hero" | "cocktails" | "about" | "art" | "menu" | "contact";

type Props = {
  kind: SectionKind;
  settings: AnimationSettings;
  children: ReactNode;
};

export function SectionMotion({ kind, settings, children }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const a = resolve(settings);

  const skip = !a.enabled || reduced || (a.disableOnMobile && isMobile);
  const near = useNearViewport(scope);
  // Desktop opens immediately; a phone waits for the first scroll. Assume a
  // phone until the media query can be read, or hydration's optimistic
  // "desktop" opens the gate and fires the import before the correction lands.
  const gated = useInteractionGate(useIsMobile(767, true));
  const [mod, setMod] = useState<typeof import("./gsap-init") | null>(null);

  useEffect(() => {
    if (skip || !near || !gated || mod) return;
    let alive = true;
    void import("./gsap-init").then((m) => {
      if (alive) setMod(m);
    });
    return () => {
      alive = false;
    };
  }, [skip, near, gated, mod]);

  useEffect(() => {
    if (!mod || skip || !scope.current) return;
    const { gsap, SplitText } = mod;

    // gsap.context scopes every selector to this section and reverts the whole
    // timeline on cleanup — `useGSAP` cannot be used here because the module
    // arrives asynchronously and hooks cannot be called conditionally.
    // display:contents has no box, so ScrollTrigger measures the section.
    const root = scope.current?.firstElementChild as HTMLElement | null;
    if (!root) return;

    const ctx = gsap.context(() => {
      const common = { duration: a.duration, delay: a.delay, ease: EASE };

      if (kind === "cocktails") {
        gsap
          .timeline({
            scrollTrigger: { trigger: root, start: "top 30%", end: "bottom 80%", scrub: true },
          })
          .from("#c-left-leaf", { x: -100, y: 100 })
          .from("#c-right-leaf", { x: 100, y: 100 });
        return;
      }

      if (kind === "about" || kind === "contact") {
        const heading = scope.current?.querySelector("h2");
        const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 85%" } });
        if (heading) {
          const split = SplitText.create(heading, { type: "words" });
          tl.from(split.words, { ...common, opacity: 0, yPercent: 100, stagger: Math.min(a.stagger, 0.02) });
        }
        // Absolute 0.1s: runs alongside the heading rather than after it.
        tl.from(".js-stagger", { ...common, opacity: 0, stagger: Math.min(a.stagger, 0.04) }, 0.1);
        return;
      }

      if (kind === "art") {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: isMobile ? "top 20%" : "top top",
              end: "bottom center",
              scrub: 1.5,
              pin: true,
            },
          })
          .to(".will-fade", { opacity: 0, stagger: 0.2, ease: "power1.inOut" })
          .to(".masked-img", { scale: 1.3, maskPosition: "center", maskSize: "400%", duration: 1, ease: "power1.inOut" })
          .to(".js-masked-content", { opacity: 1, duration: 1, ease: "power1.inOut" });
        return;
      }

      const targets = scope.current?.querySelectorAll(".js-animate");
      if (!targets?.length) return;

      gsap.from(targets, {
        ...PRESET_FROM[a.preset],
        ...common,
        stagger: a.stagger,
        scrollTrigger: a.scrubbed
          ? { trigger: root, start: "top bottom", end: "bottom top", scrub: true }
          : { trigger: root, start: "top 92%" },
      });
    }, scope);

    return () => ctx.revert();
  }, [mod, skip, kind, isMobile, a.duration, a.delay, a.stagger, a.preset, a.scrubbed]);

  // display:contents — the ref needs an element, but the CSS positions
  // sections as direct children of <main>, so this box must not exist.
  return (
    <div ref={scope} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
