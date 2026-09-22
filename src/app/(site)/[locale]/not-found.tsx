import Link from "next/link";

import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { getLocales } from "@/lib/locale";
import type { SiteSettingsData } from "@/sanity/types";


// A 404 is reached with no valid route params, so the locale that produced it
// is not knowable here — the default locale's copy is the only sound choice.
export default async function NotFound() {
  const locales = await getLocales();
  const fallback = locales.find((l) => l.isDefault) ?? locales[0];
  const { data } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    params: { locale: fallback?.code ?? "" },
  });
  const copy = (data as SiteSettingsData)?.notFound;

  return (
    <main className="standalone-page noisy">
      <h1>{copy?.heading}</h1>
      {copy?.message && <p>{copy.message}</p>}
      {copy?.linkLabel && <Link href="/">{copy.linkLabel}</Link>}
    </main>
  );
}
