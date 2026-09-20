import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { getLocales } from "@/lib/locale";
import { siteUrl } from "@/lib/site";
import type { PageData, SiteSettingsData } from "@/sanity/types";

type Section = { _type: string } & Record<string, unknown>;

// llms.txt tells language models how to read the site. The Agentic Browsing
// audit expects Markdown with at least one H1.
export async function GET() {
  const locales = await getLocales();
  const defaultLocale = locales.find((l) => l.isDefault) ?? locales[0];

  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({
      query: PAGE_QUERY,
      params: { slug: "home", locale: defaultLocale?.code ?? "en-IN" },
      stega: false,
    }),
    sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params: { locale: defaultLocale?.code ?? "en-IN" },
      stega: false,
    }),
  ]);

  const typedPage = page as PageData;
  const typedSettings = settings as SiteSettingsData;
  const sections = (typedPage?.sections ?? []) as Section[];

  const contact = sections.find((s) => s._type === "contactSection") as
    | { address?: string; phone?: string; email?: string }
    | undefined;
  const cocktails = sections.find((s) => s._type === "cocktailsSection") as
    | { lists?: Array<{ title?: string; items?: Array<{ name?: string }> }> }
    | undefined;

  const lines = [
    `# ${typedSettings?.name ?? "Velvet Pour"}`,
    "",
    typedSettings?.tagline ?? "",
    "",
    "## Languages",
    ...locales.map((l) => `- [${l.title}](${l.isDefault ? siteUrl() : siteUrl(l.code)})`),
    "",
    "## Menu",
    ...(cocktails?.lists ?? []).flatMap((list) => [
      `### ${list.title ?? ""}`,
      ...(list.items ?? []).map((i) => `- ${i.name ?? ""}`),
    ]),
    "",
    "## Contact",
    contact?.address ? `- Address: ${contact.address}` : "",
    contact?.phone ? `- Phone: ${contact.phone}` : "",
    contact?.email ? `- Email: ${contact.email}` : "",
    "",
    "## Notes",
    "- Structured data is published as schema.org BarOrPub with a full Menu.",
    `- Sitemap: ${siteUrl("sitemap.xml")}`,
  ].filter((l) => l !== "");

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
