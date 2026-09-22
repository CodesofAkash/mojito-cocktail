"use client";

import { useEffect, useState } from "react";

const EVENTS = ["scroll", "pointerdown", "keydown"] as const;

// GSAP is 118 kB that evaluates for ~800 ms on a throttled phone, all of it
// inside the Total Blocking Time window, for motion nobody has asked to see.
// Waiting for the first scroll hides nothing: every entrance is a `gsap.from`,
// so the resting state is what the CSS already renders. The one exception is
// the Art reveal, which starts at opacity 0 — and that section is unreachable
// without scrolling, which is the event that opens this gate.
export function useInteractionGate(wait: boolean) {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (!wait || interacted) return;

    const fire = () => setInteracted(true);
    for (const event of EVENTS) {
      window.addEventListener(event, fire, { once: true, passive: true });
    }
    return () => {
      for (const event of EVENTS) window.removeEventListener(event, fire);
    };
  }, [wait, interacted]);

  // Derived, not stored: `wait` comes from a media query that reads false
  // during hydration and corrects straight after.
  return !wait || interacted;
}
