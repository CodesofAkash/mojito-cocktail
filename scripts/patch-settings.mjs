/**
 * Fills the settings fields added after the original seed, without touching
 * anything an editor has since changed. `setIfMissing` is the whole point:
 * re-running this is safe, and it will never overwrite Studio edits.
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
      enabled: false,
      heading: "Back shortly",
      message: "We are polishing the glassware. Please try again in a little while.",
    },
    cookieConsent: {
      enabled: true,
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
      enabled: false,
      heading: "Back shortly",
      message: "We are polishing the glassware. Please try again in a little while.",
    },
    cookieConsent: {
      enabled: true,
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
      enabled: false,
      heading: "Gleich zurück",
      message: "Wir polieren gerade die Gläser. Bitte versuchen Sie es in Kürze erneut.",
    },
    cookieConsent: {
      enabled: true,
      message:
        "Wir verwenden Cookies, um die Nutzung dieser Website zu verstehen. Es wird nichts erfasst, bevor Sie zustimmen.",
      acceptLabel: "Zustimmen",
      declineLabel: "Ablehnen",
    },
  },
};

async function main() {
  // The hero poster doubles as the share card: it is the image the site is
  // already recognised by, and it is the right shape.
  const poster = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename match "hero-poster*"][0]._id`,
  );
  if (!poster) throw new Error("No hero poster asset found — set the OG image in the Studio.");

  const tx = client.transaction();

  for (const [code, copy] of Object.entries(COPY)) {
    tx.patch(`siteSettings-${code}`, (p) =>
      p.setIfMissing({
        notFound: copy.notFound,
        maintenance: copy.maintenance,
        cookieConsent: copy.cookieConsent,
        analytics: {},
        scripts: { requiresConsent: true },
        "defaultSeo.ogImage": { _type: "image", asset: { _type: "reference", _ref: poster } },
      }),
    );
  }

  await tx.commit();
  console.log("Patched 3 siteSettings documents: 404 copy, maintenance, consent, OG image.");
  console.log("Analytics IDs left empty on purpose — nothing loads until you fill them in.");
}

main().catch((error) => {
  console.error("\nPatch failed:", error.message);
  process.exit(1);
});
