"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// On the server we assume motion is allowed, then correct after hydration.
const getServerSnapshot = () => false;

export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

// `serverValue` is what the hydration render sees, before a media query can be
// read. It defaults to false — treat the visit as desktop and correct after —
// but a caller that would rather over-restrict than under-restrict on a phone
// can pass true.
export function useIsMobile(maxWidth = 767, serverValue = false) {
  const query = `(max-width: ${maxWidth}px)`;
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
