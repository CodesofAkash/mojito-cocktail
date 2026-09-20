import type { Metadata } from "next";
import type { ReactNode } from "react";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

import { sanityFetch } from "@/sanity/lib/live";
import { SanityLive } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getLocales } from "@/lib/locale";
import type { SiteSettingsData } from "@/sanity/types";
import "../../globals.css";

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const locales = await getLocales();

  // hreflang tells search engines these pages are translations of one another.
  // It only works with valid BCP-47 codes, which is why the Studio enforces them.
  const languages = Object.fromEntries(
    locales.map((l) => [l.code, l.isDefault ? "/" : `/${l.code}`]),
  );

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    alternates: { canonical: `/${locale}`, languages },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY, params: { locale } });
  const settings = data as SiteSettingsData;

  // The grain overlay is a CMS asset. Exposed as a custom property on <body>
  // so every `.noisy` element inherits it without prop-drilling.
  const noiseRef = settings?.noiseTexture?.ref;
  const noise = noiseRef
    // Grain tiles, so a small tile stays crisp at any size: 1.74 MB -> ~11 kB.
    ? `url(${urlFor({ asset: { _ref: noiseRef } } as never).width(400).quality(35).format("webp").url()})`
    : undefined;

  return (
    <html lang={locale}>
      <body style={noise ? ({ "--noise": noise } as React.CSSProperties) : undefined}>
        {children}
        {isDraft && <SanityLive />}
        {isDraft && <VisualEditing />}
      </body>
    </html>
  );
}
