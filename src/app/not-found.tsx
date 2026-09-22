import Link from "next/link";
import { DM_Serif_Text, Mona_Sans } from "next/font/google";

import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { getLocales } from "@/lib/locale";
import type { SiteSettingsData } from "@/sanity/types";
import "./globals.css";


const monaSans = Mona_Sans({ subsets: ["latin"], display: "swap", variable: "--font-sans-loaded" });
const dmSerif = DM_Serif_Text({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-serif-loaded",
});

// An unmatched URL belongs to neither route group, so it reaches no root
// layout and this file has to supply <html> and <body> itself.
export default async function NotFound() {
  const locales = await getLocales();
  // There is no valid locale param on a 404, so the default locale's copy is
  // the only sound choice.
  const fallback = locales.find((l) => l.isDefault) ?? locales[0];
  const { data } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    params: { locale: fallback?.code ?? "" },
  });
  const settings = data as SiteSettingsData;
  const copy = settings?.notFound;

  return (
    <html lang={fallback?.code} className={`${monaSans.variable} ${dmSerif.variable}`}>
      <body>
        <main className="standalone-page">
          <h1>{copy?.heading}</h1>
          {copy?.message && <p>{copy.message}</p>}
          {copy?.linkLabel && <Link href="/">{copy.linkLabel}</Link>}
        </main>
      </body>
    </html>
  );
}
