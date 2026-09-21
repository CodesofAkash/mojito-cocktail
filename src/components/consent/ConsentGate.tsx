"use client";

import { Button } from "@/components/ui/button";
import { Analytics, type AnalyticsIds } from "./Analytics";
import { InjectedScripts } from "./InjectedScripts";
import { PostHog, type PostHogConfig } from "./PostHog";
import { SectionTracking } from "./SectionTracking";
import { useConsent } from "./useConsent";

type Copy = {
  message?: string | null;
  acceptLabel?: string | null;
  declineLabel?: string | null;
  policyUrl?: string | null;
} | null;

type Scripts = {
  head?: string | null;
  bodyEnd?: string | null;
  requiresConsent?: boolean | null;
} | null;

export function ConsentGate({
  ids,
  postHog,
  scripts,
  copy,
  consentEnabled,
  locale,
}: {
  ids: AnalyticsIds;
  postHog: PostHogConfig;
  scripts: Scripts;
  copy: Copy;
  consentEnabled: boolean;
  locale: string;
}) {
  const { state, decide } = useConsent();

  const hasTags = Boolean(
    ids?.googleAnalyticsId || ids?.googleTagManagerId || ids?.facebookPixelId,
  );
  const hasPostHog = Boolean(postHog?.projectApiKey);
  const hasScripts = Boolean(scripts?.head || scripts?.bodyEnd);

  // Consent not being asked for is not consent. Nothing that sets a cookie
  // may load, because silence cannot be read as agreement.
  const granted = consentEnabled ? state === "granted" : false;
  const scriptsAllowed = scripts?.requiresConsent === false || granted;
  const anythingToConsentTo = hasTags || hasPostHog || hasScripts;

  return (
    <>
      {granted && hasTags && <Analytics ids={ids} />}
      {granted && hasPostHog && (
        <>
          <PostHog config={postHog} locale={locale} />
          <SectionTracking />
        </>
      )}
      {scriptsAllowed && <InjectedScripts html={scripts?.head ?? null} target="head" />}
      {scriptsAllowed && <InjectedScripts html={scripts?.bodyEnd ?? null} target="bodyEnd" />}

      {consentEnabled && state === "unset" && anythingToConsentTo && (
        <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
          <p>{copy?.message}</p>
          <div className="cookie-banner__actions">
            {copy?.policyUrl && (
              <a href={copy.policyUrl} target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            )}
            <Button variant="ghost" size="none" onClick={() => decide("denied")}>
              {copy?.declineLabel}
            </Button>
            <Button variant="ghost" size="none" data-variant="accept" onClick={() => decide("granted")}>
              {copy?.acceptLabel}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
