import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";
import { deDELocale } from "@sanity/locale-de-de";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";
import { StudioNavbar } from "@/sanity/components/StudioNavbar";
import { AnalyticsTool } from "@/sanity/components/AnalyticsTool";
import { studioBundles } from "@/sanity/i18n";

export default defineConfig({
  name: "default",
  title: "Velvet Pour",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  studio: { components: { navbar: StudioNavbar } },
  i18n: { bundles: studioBundles },
  tools: (prev) => [
    ...prev,
    // Reads aggregates from PostHog through our own API route, so the editor
    // sees how the page performs without leaving the Studio or holding a key.
    { name: "analytics", title: "Analytics", component: AnalyticsTool },
  ],
  plugins: [
    // Makes German available for the Studio's own interface; the switcher
    // selects it when the chosen content locale matches.
    deDELocale(),
    structureTool({ structure }),
    // Vision runs GROQ queries against the dataset from inside the Studio —
    // the fastest way to check a query before wiring it into the app.
    visionTool({ defaultApiVersion: apiVersion }),
    documentInternationalization({
      // Read from the `locale` documents so publishing a new market adds it to
      // the translation UI without touching this file.
      supportedLanguages: (client) =>
        client.fetch(
          `*[_type == "locale" && enabled == true] | order(isDefault desc, code asc){"id": code, title}`,
        ),
      schemaTypes: ["page", "siteSettings"],
      languageField: "language",
    }),
  ],
});
