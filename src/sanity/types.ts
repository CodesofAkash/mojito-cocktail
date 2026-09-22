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
  builtBy?: {
    name?: string | null;
    url?: string | null;
    label?: string | null;
    sameAs?: string[] | null;
  } | null;
  defaultSeo?: SeoData;
  cookieConsent?: {
    message?: string | null;
    acceptLabel?: string | null;
    declineLabel?: string | null;
    policyUrl?: string | null;
  } | null;
  notFound?: {
    heading?: string | null;
    message?: string | null;
    linkLabel?: string | null;
  } | null;
  maintenance?: {
    heading?: string | null;
    message?: string | null;
  } | null;
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

export type GlobalConfigData = {
  analytics?: {
    googleAnalyticsId?: string | null;
    googleTagManagerId?: string | null;
    facebookPixelId?: string | null;
  } | null;
  postHog?: {
    projectApiKey?: string | null;
    apiHost?: string | null;
    sessionReplay?: boolean | null;
  } | null;
  verification?: { google?: string | null; bing?: string | null } | null;
  scripts?: {
    head?: string | null;
    bodyEnd?: string | null;
    requiresConsent?: boolean | null;
  } | null;
  consentEnabled?: boolean | null;
  maintenanceEnabled?: boolean | null;
} | null;
