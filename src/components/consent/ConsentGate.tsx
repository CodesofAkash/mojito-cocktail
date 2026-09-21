"use client";

import { Analytics, type AnalyticsIds } from "./Analytics";
import { InjectedScripts } from "./InjectedScripts";
import { useConsent } from "./useConsent";

type Copy = {
  enabled?: boolean | null;
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
  scripts,
  copy,
}: {
  ids: AnalyticsIds;
  scripts: Scripts;
  copy: Copy;
}) {
  const { state, decide } = useConsent();

  const hasTags = Boolean(
    ids?.googleAnalyticsId || ids?.googleTagManagerId || ids?.facebookPixelId,
  );
  const hasScripts = Boolean(scripts?.head || scripts?.bodyEnd);
  const asking = copy?.enabled !== false;

  // With no banner configured, consent has not been given and cannot be
  // assumed — so nothing that sets a cookie is allowed to load at all.
  const granted = asking ? state === "granted" : false;
  const scriptsAllowed = scripts?.requiresConsent === false || granted;

  return (
    <>
      {granted && hasTags && <Analytics ids={ids} />}
      {scriptsAllowed && <InjectedScripts html={scripts?.head ?? null} target="head" />}
      {scriptsAllowed && <InjectedScripts html={scripts?.bodyEnd ?? null} target="bodyEnd" />}

      {asking && state === "unset" && (hasTags || hasScripts) && (
        <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
          <p>{copy?.message}</p>
          <div className="cookie-banner__actions">
            {copy?.policyUrl && (
              <a href={copy.policyUrl} target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            )}
            <button type="button" onClick={() => decide("denied")}>
              {copy?.declineLabel}
            </button>
            <button type="button" data-variant="accept" onClick={() => decide("granted")}>
              {copy?.acceptLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
