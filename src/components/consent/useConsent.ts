"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ConsentState = "granted" | "denied" | "unset";

const KEY = "velvet-pour:cookie-consent";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  // Another tab answering the banner should settle this one too.
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ConsentState {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === "granted" || raw === "denied" ? raw : "unset";
  } catch {
    // Private mode and blocked site data both throw. No stored answer is the
    // same as no answer given, which is the safe reading.
    return "unset";
  }
}

// The server cannot know this visitor's answer, so it renders as if unasked
// and the real value arrives with hydration.
const getServerSnapshot = (): ConsentState => "unset";

export function useConsent() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const decide = useCallback((next: Exclude<ConsentState, "unset">) => {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // A refused write only means we ask again next visit.
    }
    for (const listener of listeners) listener();
  }, []);

  return { state, decide };
}
