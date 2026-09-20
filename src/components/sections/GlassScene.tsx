"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

const GlassCanvas = dynamic(() => import("./GlassCanvas").then((m) => m.GlassCanvas), {
  ssr: false,
  loading: () => null,
});

function isLowPowered() {
  if (typeof navigator === "undefined") return true;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  return cores <= 4 || memory <= 4;
}

export function GlassScene() {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  // Device capability never changes, so there is nothing to subscribe to.
  const allowed = useSyncExternalStore(
    () => () => {},
    () => !isLowPowered(),
    () => false,
  );

  // Only mount the canvas once it is actually on screen, so scrolling past the
  // hero never pays for WebGL.
  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const show = visible && allowed && !reduced;

  return (
    <div ref={holder} className="abs-center size-full">
      {show && <GlassCanvas />}
    </div>
  );
}
