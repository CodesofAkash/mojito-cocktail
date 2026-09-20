import type { MetadataRoute } from "next";
import { getLocales } from "@/lib/locale";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = await getLocales();
  const now = new Date();

  // The default locale lives at the bare root, not /en-IN, so it must be
  // listed that way or the sitemap advertises a duplicate URL.
  return locales.map((locale) => ({
    url: locale.isDefault ? siteUrl() : siteUrl(locale.code),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: locale.isDefault ? 1 : 0.8,
  }));
}
