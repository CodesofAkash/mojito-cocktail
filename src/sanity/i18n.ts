import type { LocaleResourceBundle } from "sanity";

// Sanity's own bundles only translate Sanity's strings. The Structure titles
// below are ours, so they need their own namespace or they stay English while
// the rest of the Studio switches.
export const STUDIO_NS = "velvetPour";

const resources = {
  "en-US": {
    pages: "Pages",
    settings: "Site settings",
    locales: "Locales",
    translations: "Translation links",
    content: "Content",
  },
  "de-DE": {
    pages: "Seiten",
    settings: "Website-Einstellungen",
    locales: "Sprachen",
    translations: "Übersetzungs-Verknüpfungen",
    content: "Inhalt",
  },
} as const;

export const studioBundles: LocaleResourceBundle[] = Object.entries(resources).map(
  ([locale, res]) => ({ locale, namespace: STUDIO_NS, resources: res }),
);
