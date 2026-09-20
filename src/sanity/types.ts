import type { SanityImageValue } from "@/components/SanityImage";

export type LocaleDoc = {
  _id: string;
  code: string;
  title: string;
  isDefault: boolean | null;
  currency: string;
};

export type SeoData = {
  title?: string | null;
  description?: string | null;
  ogImage?: SanityImageValue;
} | null;

export type SiteSettingsData = {
  name?: string | null;
  tagline?: string | null;
  slogan?: string | null;
  logo?: SanityImageValue;
  noiseTexture?: SanityImageValue;
  navLinks?: Array<{ id?: string | null; title?: string | null }> | null;
  socials?: Array<{ name?: string | null; url?: string | null; icon?: SanityImageValue }> | null;
  defaultSeo?: SeoData;
} | null;

export type SectionData = { _key: string; _type: string } & Record<string, unknown>;

export type PageData = {
  title?: string | null;
  slug?: string | null;
  language?: string | null;
  seo?: SeoData;
  sections?: SectionData[] | null;
} | null;

export type PagePath = { slug: string | null; language: string | null };
