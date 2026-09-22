/**
 * Fills settings fields added after the original seed, and creates the global
 * configuration singleton. `setIfMissing` is the point: re-running this is
 * safe and will never overwrite a Studio edit.
 *
 *   node scripts/patch-settings.mjs
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const [k, ...rest] = line.split("=");
  if (k && rest.length && !process.env[k.trim()]) process.env[k.trim()] = rest.join("=").trim();
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const COPY = {
  "en-IN": {
    notFound: {
      heading: "This page has left the bar",
      message: "The link you followed is out of date, or the page has moved.",
      linkLabel: "Back to the bar",
    },
    maintenance: {
      heading: "Back shortly",
      message: "We are polishing the glassware. Please try again in a little while.",
    },
    cookieConsent: {
      message:
        "We use cookies to understand how this site is used. Nothing is collected until you agree.",
      acceptLabel: "Accept",
      declineLabel: "Decline",
    },
  },
  "en-US": {
    notFound: {
      heading: "This page has left the bar",
      message: "The link you followed is out of date, or the page has moved.",
      linkLabel: "Back to the bar",
    },
    maintenance: {
      heading: "Back shortly",
      message: "We are polishing the glassware. Please try again in a little while.",
    },
    cookieConsent: {
      message:
        "We use cookies to understand how this site is used. Nothing is collected until you agree.",
      acceptLabel: "Accept",
      declineLabel: "Decline",
    },
  },
  "de-DE": {
    notFound: {
      heading: "Diese Seite hat die Bar verlassen",
      message: "Der Link ist veraltet oder die Seite wurde verschoben.",
      linkLabel: "Zurück zur Bar",
    },
    maintenance: {
      heading: "Gleich zurück",
      message: "Wir polieren gerade die Gläser. Bitte versuchen Sie es in Kürze erneut.",
    },
    cookieConsent: {
      message:
        "Wir verwenden Cookies, um die Nutzung dieser Website zu verstehen. Es wird nichts erfasst, bevor Sie zustimmen.",
      acceptLabel: "Zustimmen",
      declineLabel: "Ablehnen",
    },
  },
};

async function main() {
  const poster = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename match "hero-poster*"][0]._id`,
  );
  if (!poster) throw new Error("No hero poster asset found — set the OG image in the Studio.");

  const tx = client.transaction();

  // Switches and third-party IDs cannot differ per market, so they live in one
  // document rather than being duplicated across the three locales.
  tx.createIfNotExists({
    _id: "globalConfig",
    _type: "globalConfig",
    consentEnabled: true,
    maintenanceEnabled: false,
    analytics: {},
    postHog: { apiHost: "https://eu.i.posthog.com", sessionReplay: false },
    verification: {},
    scripts: { requiresConsent: true },
  });

  for (const [code, copy] of Object.entries(COPY)) {
    tx.patch(`siteSettings-${code}`, (p) =>
      p
        .setIfMissing({
          notFound: copy.notFound,
          maintenance: copy.maintenance,
          cookieConsent: copy.cookieConsent,
          "defaultSeo.ogImage": { _type: "image", asset: { _type: "reference", _ref: poster } },
        })
        // These moved to globalConfig; leaving them behind means two places
        // disagree about whether the site is down.
        .unset(["analytics", "scripts", "maintenance.enabled", "cookieConsent.enabled"]),
    );
  }

  await tx.commit();
  console.log("globalConfig created; 3 siteSettings patched and de-duplicated.");
  console.log("Analytics and PostHog keys left empty — nothing loads until you fill them in.");
}

main().catch((error) => {
  console.error("\nPatch failed:", error.message);
  process.exit(1);
});
