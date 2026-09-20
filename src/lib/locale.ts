import { sanityFetch } from "@/sanity/lib/live";
import { DEFAULT_LOCALE_QUERY, LOCALES_QUERY } from "@/sanity/lib/queries";

export type Locale = {
  _id: string;
  code: string;
  title: string;
  isDefault: boolean | null;
  currency: string;
};

export const LOCALE_PATTERN = /^[a-z]{2}-[A-Z]{2}$/;

export const isLocaleSegment = (segment: string) => LOCALE_PATTERN.test(segment);

export async function getLocales(): Promise<Locale[]> {
  const { data } = await sanityFetch({ query: LOCALES_QUERY });
  return (data ?? []) as unknown as Locale[];
}

export async function getDefaultLocale(): Promise<string> {
  const { data } = await sanityFetch({ query: DEFAULT_LOCALE_QUERY });
  return (data as { code?: string } | null)?.code ?? process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en-IN";
}

export function localePath(code: string, isDefault: boolean, path = "") {
  const suffix = path && path !== "home" ? `/${path}` : "";
  return isDefault ? `/${suffix}`.replace("//", "/") : `/${code}${suffix}`;
}

export function formatPrice(amount: number, localeCode: string, currency: string) {
  try {
    return new Intl.NumberFormat(localeCode, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}
