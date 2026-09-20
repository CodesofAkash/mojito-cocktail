// A trailing slash on NEXT_PUBLIC_SITE_URL produces "https://host//sitemap.xml".
// Normalise once, here, rather than at every call site.
export function siteUrl(path = ""): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  if (!path) return base;
  return `${base}/${path.replace(/^\/+/, "")}`;
}
