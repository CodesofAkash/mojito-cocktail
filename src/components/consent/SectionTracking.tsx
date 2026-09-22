"use client";

import { useEffect } from "react";

const SECTIONS = ["hero", "cocktails", "about", "art", "menu", "contact"] as const;

// A pageview count cannot tell you whether anyone reached the Art reveal,
// which is the thing this whole build exists for.
export function SectionTracking() {
  useEffect(() => {
    let cancelled = false;
    const seen = new Set<string>();
    let observer: IntersectionObserver | undefined;

    void import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const id = entry.target.id;
            // Once per visit: this answers "did they reach it", not "how many
            // times did it scroll past".
            if (seen.has(id)) continue;
            seen.add(id);
            posthog.capture("section_reached", { section: id, depth: SECTIONS.indexOf(id as never) });
          }
        },
        { threshold: 0.4 },
      );

      for (const id of SECTIONS) {
        const node = document.getElementById(id);
        if (node) observer.observe(node);
      }
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  return null;
}
