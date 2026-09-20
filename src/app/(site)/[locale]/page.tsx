import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import {
  ALL_PAGE_PATHS_QUERY,
  LOCALE_BY_CODE_QUERY,
  PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/SectionRenderer";
import { Navbar } from "@/components/Navbar";
import { JsonLd } from "@/components/JsonLd";
import type { PageData, PagePath, SiteSettingsData } from "@/sanity/types";

type Params = { locale: string };

export async function generateStaticParams() {
  try {
    const { data } = await sanityFetch({
      query: ALL_PAGE_PATHS_QUERY,
      perspective: "published",
      stega: false,
    });
    const paths = (data ?? []) as unknown as PagePath[];
    const locales = new Set(paths.map((p) => p.language).filter(Boolean) as string[]);
    return [...locales].map((locale) => ({ locale }));
  } catch {
    // Sanity unreachable at build time: pre-render nothing and let
    // `dynamicParams` serve every locale on demand.
    return [];
  }
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_QUERY, params: { slug: "home", locale }, stega: false }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, params: { locale }, stega: false }),
  ]);

  const typedPage = page as PageData;
  const typedSettings = settings as SiteSettingsData;
  const seo = typedPage?.seo ?? typedSettings?.defaultSeo;
  const ogRef = seo?.ogImage?.ref;

  return {
    title: seo?.title ?? typedSettings?.name,
    description: seo?.description ?? undefined,
    openGraph: {
      title: seo?.title ?? undefined,
      description: seo?.description ?? undefined,
      locale,
      type: "website",
      images: ogRef ? [{ url: urlFor({ asset: { _ref: ogRef } } as never).width(1200).height(630).url() }] : undefined,
    },
  };
}

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;

  const [{ data: page }, { data: settings }, { data: localeDoc }] = await Promise.all([
    sanityFetch({ query: PAGE_QUERY, params: { slug: "home", locale } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, params: { locale } }),
    sanityFetch({ query: LOCALE_BY_CODE_QUERY, params: { locale } }),
  ]);

  // An unknown locale, or one with no content yet, is a genuine 404 rather
  // than a blank page.
  const typedPage = page as PageData;
  const typedSettings = settings as SiteSettingsData;
  const locale_ = localeDoc as { currency?: string } | null;

  // No silent defaults: an unknown locale, missing settings or a locale with
  // no currency is a content error, and 404 makes it visible immediately.
  if (!typedPage || !typedSettings || !locale_?.currency) notFound();

  const currency = locale_.currency;
  const socials = typedSettings.socials ?? [];

  return (
    <>
      <Navbar settings={typedSettings} locale={locale} />
      <main>
        {typedPage.sections?.map((section) => (
          <SectionRenderer
            key={section._key}
            section={section}
            locale={locale}
            currency={currency}
            socials={socials}
          />
        ))}
      </main>
      <JsonLd page={typedPage} settings={typedSettings} locale={locale} />
    </>
  );
}
