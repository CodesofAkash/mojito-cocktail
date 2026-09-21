"use client";

import { useEffect } from "react";

export type PostHogConfig = {
  projectApiKey?: string | null;
  apiHost?: string | null;
  sessionReplay?: boolean | null;
} | null;

// Imported dynamically, and this component is only rendered after consent, so
// none of posthog-js's 176 kB is fetched for a visitor who has not accepted.
export function PostHog({ config, locale }: { config: PostHogConfig; locale: string }) {
  const key = config?.projectApiKey?.trim();
  const host = config?.apiHost?.trim() || "https://eu.i.posthog.com";
  const replay = config?.sessionReplay === true;

  useEffect(() => {
    if (!key) return;
    let cancelled = false;

    void import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;

      posthog.init(key, {
        api_host: host,
        // One page, no client-side routing, so the automatic listener has
        // nothing to catch that the initial capture does not.
        capture_pageview: true,
        capture_pageleave: true,
        // Web Vitals from real visitors, alongside the events below.
        capture_performance: true,
        // Records a DOM snapshot stream — another 108 kB, so it is opt-in.
        disable_session_recording: !replay,
        persistence: "localStorage+cookie",
        person_profiles: "always",
      });

      // Which market a visitor actually landed on is the interesting question
      // with three of them, and it is not derivable from the URL alone.
      posthog.register({ locale });
    });

    return () => {
      cancelled = true;
    };
  }, [key, host, replay, locale]);

  return null;
}
