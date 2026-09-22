import type { StructureResolver } from "sanity/structure";
import { STUDIO_NS } from "./i18n";

const LOCALES = /* groq */ `*[_type == "locale" && enabled == true] | order(isDefault desc, code asc){code, title}`;

type LocaleRow = { code: string; title: string };

// Locale folders are built from the `locale` documents, not a hardcoded list,
// so publishing a new market adds its folder here with no code change.
export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: "2026-09-19" });
  await context.i18n.loadNamespaces([STUDIO_NS]);
  const t = (key: string) => context.i18n.t(`${STUDIO_NS}:${key}`);
  const locales: LocaleRow[] = await client.fetch(LOCALES);

  const byLocale = (type: string, title: string, id: string) =>
    S.listItem()
      .title(title)
      .id(id)
      .child(
        S.list()
          .title(title)
          .items(
            locales.map((l) =>
              S.listItem()
                .title(l.title)
                .id(l.code)
                .child(
                  S.documentList()
                    .title(`${title} — ${l.title}`)
                    .filter('_type == $type && language == $language')
                    .params({ type, language: l.code })
                    .initialValueTemplates([])
                    .apiVersion("2026-09-19"),
                ),
            ),
          ),
      );

  return S.list()
    .title(t("content"))
    .items([
      byLocale("page", t("pages"), "pages"),
      byLocale("siteSettings", t("settings"), "settings"),
      // Not per-locale: switches and third-party IDs cannot differ by market.
      S.listItem()
        .title(t("global"))
        .id("globalConfig")
        .child(
          S.document()
            .schemaType("globalConfig")
            .documentId("globalConfig")
            .title(t("global")),
        ),
      S.divider(),
      S.listItem()
        .title(t("locales"))
        .child(S.documentTypeList("locale").title(t("locales")).apiVersion("2026-09-19")),
      S.listItem()
        .title(t("translations"))
        .child(
          S.documentTypeList("translation.metadata")
            .title(t("translations"))
            .apiVersion("2026-09-19"),
        ),
    ]);
};
