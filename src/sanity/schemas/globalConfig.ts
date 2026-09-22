import { defineField, defineType } from "sanity";

export const globalConfig = defineType({
  name: "globalConfig",
  title: "Global configuration",
  type: "document",
  description:
    "Settings that are the same in every language. Anything with words in it lives in Site settings instead, because that is translated.",
  fields: [
    defineField({
      name: "analytics",
      title: "Analytics and tracking",
      type: "object",
      description:
        "Leave a field empty and that tool is never loaded — no script, no request, no cost. Nothing here runs until a visitor accepts cookies.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "googleAnalyticsId",
          title: "Google Analytics 4 measurement ID",
          type: "string",
          description:
            "Looks like G-XXXXXXXXXX. GA4 > Admin > Data streams > your web stream. Leave empty if you use Tag Manager below.",
          validation: (r) =>
            r.regex(/^G-[A-Z0-9]{6,12}$/, { name: "GA4 ID" }).error("Must look like G-XXXXXXXXXX."),
        }),
        defineField({
          name: "googleTagManagerId",
          title: "Google Tag Manager container ID",
          type: "string",
          description:
            "Looks like GTM-XXXXXX. Use this OR the GA4 ID above — filling both counts every page view twice.",
          validation: (r) =>
            r.regex(/^GTM-[A-Z0-9]{6,8}$/, { name: "GTM ID" }).error("Must look like GTM-XXXXXX."),
        }),
        defineField({
          name: "facebookPixelId",
          title: "Meta (Facebook) Pixel ID",
          type: "string",
          description:
            "15–16 digits, from Events Manager. Only useful if you run Facebook or Instagram ads.",
          validation: (r) =>
            r.regex(/^\d{15,16}$/, { name: "Pixel ID" }).error("15 or 16 digits, no spaces."),
        }),
      ],
    }),
    defineField({
      name: "postHog",
      title: "PostHog",
      type: "object",
      description:
        "Product analytics: events, funnels, heatmaps and session replay. Heavier than the tags above, and loaded only after a visitor accepts cookies — so it costs nothing until then.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "projectApiKey",
          title: "Project API key",
          type: "string",
          description:
            "Starts with phc_. PostHog > Settings > Project > Project API key. Safe to expose — it can only write events.",
          validation: (r) =>
            r.regex(/^phc_[A-Za-z0-9]{20,}$/, { name: "PostHog key" }).error("Must start with phc_."),
        }),
        defineField({
          name: "apiHost",
          title: "API host",
          type: "string",
          description:
            "https://eu.i.posthog.com for the EU region, https://us.i.posthog.com for the US. Pick EU if any of your markets are — it keeps the data in the EU.",
          initialValue: "https://eu.i.posthog.com",
        }),
        defineField({
          name: "sessionReplay",
          title: "Record sessions",
          type: "boolean",
          description:
            "Replays what a visitor did, which is the best way to see whether the scroll story lands. Costs another 108 kB on top, so turn it off once you have watched enough.",
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: "verification",
      title: "Search engine verification",
      type: "object",
      description:
        "Proves you own the site so you can see its search traffic. These render as meta tags and set no cookies, so they load for everyone.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "google",
          title: "Google Search Console",
          type: "string",
          description:
            "Search Console > URL prefix > HTML tag. Paste only the content value, not the whole tag.",
        }),
        defineField({
          name: "bing",
          title: "Bing Webmaster Tools",
          type: "string",
          description: "Optional. Bing also feeds some AI answer engines.",
        }),
      ],
    }),
    defineField({
      name: "scripts",
      title: "Custom scripts",
      type: "object",
      description:
        "Raw markup pasted from a third party — a chat widget, a booking embed. It runs on every page, so only paste what you trust.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "head",
          title: "In <head>",
          type: "text",
          rows: 4,
          description: "Only for something that must load before the page renders.",
        }),
        defineField({
          name: "bodyEnd",
          title: "End of <body>",
          type: "text",
          rows: 4,
          description: "Prefer this. It cannot delay the page appearing.",
        }),
        defineField({
          name: "requiresConsent",
          title: "Wait for cookie consent",
          type: "boolean",
          description: "On by default. Turn off only for a script that sets no cookies.",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "consentEnabled",
      title: "Ask for cookie consent",
      type: "boolean",
      description:
        "When off, nothing in Analytics above will ever load — consent cannot be assumed from an absent banner. The banner's wording is per-language, in Site settings.",
      initialValue: true,
    }),
    defineField({
      name: "maintenanceEnabled",
      title: "Site is in maintenance",
      type: "boolean",
      description:
        "Takes every language down at once and shows the holding page. The Studio and any preview session stay reachable. Wording is per-language, in Site settings.",
      initialValue: false,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Global configuration" }),
  },
});
