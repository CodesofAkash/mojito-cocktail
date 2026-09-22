"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Not the `/next` entry: it imports "next/navigation.js", gets a second
// module instance with empty context, and silently renders nothing.
export function SpeedInsights() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    void import("@vercel/speed-insights").then(({ injectSpeedInsights }) => {
      // It de-duplicates its own script tag, so re-running on a route change
      // updates the route rather than injecting twice.
      if (!cancelled) injectSpeedInsights({ route: pathname ?? "/" });
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
