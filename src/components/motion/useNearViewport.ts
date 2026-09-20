"use client";

import { useEffect, useState, type RefObject } from "react";

const supported = () => typeof window !== "undefined" && "IntersectionObserver" in window;

// GSAP is ~184 kB parsed. Loading it before a section is anywhere near the
// viewport is the single largest contributor to Total Blocking Time.
export function useNearViewport(ref: RefObject<HTMLElement | null>, rootMargin = "1400px") {
  // Without IntersectionObserver there is nothing to wait for, so start true.
  const [near, setNear] = useState(() => !supported());

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;

    // display:contents has no layout box, so IntersectionObserver would get a
    // zero rect and never fire. Observe the section itself.
    const target =
      getComputedStyle(node).display === "contents" && node.firstElementChild instanceof HTMLElement
        ? node.firstElementChild
        : node;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [ref, rootMargin, near]);

  return near;
}
