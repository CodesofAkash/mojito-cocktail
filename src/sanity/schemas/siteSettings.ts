import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description:
    "Everything outside the page content: brand, navigation, socials and default SEO. One document per locale, so the German site can carry its own nav wording.",
  fields: [
    defineField({ name: "name", title: "Brand name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slogan", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "logo",
      type: "image",
      description: "Shown beside the brand name in the navbar.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "noiseTexture",
      title: "Grain overlay",
      type: "image",
      description:
        "Tiled film-grain laid over the dark sections. A small tileable PNG — a large one is wasted bytes.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      description: "Set by the internationalization plugin.",
    }),
    defineField({
      name: "navLinks",
      type: "array",
      description: "Navbar links. Each jumps to a section on the page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "navLink",
          fields: [
            defineField({
              name: "id",
              type: "string",
              description: "Section anchor without the #, e.g. cocktails, about, art, contact.",
              validation: (r) => r.required(),
            }),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "id" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "socials",
      type: "array",
      description: "Rendered in the footer under the socials heading.",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
            defineField({ name: "icon", type: "image", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name", subtitle: "url", media: "icon" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "builtBy",
      title: "Built by",
      type: "object",
      description:
        "Credit line in the footer, and the schema.org creator of the site. Note that a link between two sites you own does not build ranking authority — this is for humans and for attribution.",
      fields: [
        defineField({ name: "name", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "url",
          type: "url",
          description: "Your portfolio.",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "label",
          type: "string",
          description: "Wording of the credit, e.g. 'Designed and built by'.",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "sameAs",
          title: "Other profiles",
          type: "array",
          of: [{ type: "url" }],
          description:
            "GitHub, LinkedIn, X. Published as schema.org sameAs, which is how a search engine ties these identities to one person.",
        }),
      ],
    }),
    defineField({
      name: "defaultSeo",
      type: "seo",
      description: "Used for any page that has not set its own SEO.",
    }),
    defineField({
      name: "analytics",
      title: "Analytics and tracking",
      type: "object",
      description:
        "Leave a field empty and that tool is never loaded — no script, no request, no cost. Each one only runs after a visitor accepts cookies below.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "googleAnalyticsId",
          title: "Google Analytics 4 measurement ID",
          type: "string",
          description: "Looks like G-XXXXXXXXXX. From Admin > Data streams in GA4.",
          validation: (r) =>
            r.regex(/^G-[A-Z0-9]{6,12}$/, { name: "GA4 ID" }).error("Must look like G-XXXXXXXXXX."),
        }),
        defineField({
          name: "googleTagManagerId",
          title: "Google Tag Manager container ID",
          type: "string",
          description:
            "Looks like GTM-XXXXXX. Use this OR the GA4 ID above — putting GA4 in both double-counts every page view.",
          validation: (r) =>
            r.regex(/^GTM-[A-Z0-9]{6,8}$/, { name: "GTM ID" }).error("Must look like GTM-XXXXXX."),
        }),
        defineField({
          name: "facebookPixelId",
          title: "Meta (Facebook) Pixel ID",
          type: "string",
          description: "A 15–16 digit number, from Events Manager.",
          validation: (r) =>
            r.regex(/^\d{15,16}$/, { name: "Pixel ID" }).error("15 or 16 digits, no spaces."),
        }),
      ],
    }),
    defineField({
      name: "scripts",
      title: "Custom scripts",
      type: "object",
      description:
        "Raw markup pasted from a third party — a chat widget, a verification tag, a booking embed. Anything you paste here runs on every page, so only paste what you trust.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "head",
          title: "In <head>",
          type: "text",
          rows: 4,
          description: "For anything that must load before the page renders.",
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
          description:
            "On by default. Turn off only for a script that sets no cookies and tracks nobody.",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "cookieConsent",
      title: "Cookie consent",
      type: "object",
      description:
        "Required before analytics may run for visitors in the EU and UK. The German locale means this site has such visitors, so leaving it off while analytics is filled in is a legal risk, not a style choice.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "enabled",
          title: "Ask for consent",
          type: "boolean",
          description:
            "When off, nothing in Analytics above will ever load — consent cannot be assumed.",
          initialValue: true,
        }),
        defineField({
          name: "message",
          type: "text",
          rows: 2,
          description: "Say plainly what is collected and why.",
        }),
        defineField({ name: "acceptLabel", type: "string", description: "e.g. 'Accept'." }),
        defineField({ name: "declineLabel", type: "string", description: "e.g. 'Decline'." }),
        defineField({
          name: "policyUrl",
          title: "Privacy policy link",
          type: "url",
          description: "Optional. Shown beside the buttons.",
        }),
      ],
    }),
    defineField({
      name: "notFound",
      title: "404 page",
      type: "object",
      description:
        "Shown when a visitor reaches a URL that does not exist. Worth writing: a mistyped or stale link is a real visitor who can still be kept.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "heading",
          type: "string",
          description: "e.g. 'This page has left the bar'.",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "message",
          type: "text",
          rows: 2,
          description: "One sentence explaining what happened.",
        }),
        defineField({
          name: "linkLabel",
          type: "string",
          description: "Wording of the link home, e.g. 'Back to the bar'.",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: "maintenance",
      title: "Maintenance mode",
      type: "object",
      description:
        "Takes the public site down and shows a holding page instead. The Studio and any preview session stay reachable, so you can keep editing while it is on.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "enabled",
          title: "Site is in maintenance",
          type: "boolean",
          description: "Publish this document for the change to take effect.",
          initialValue: false,
        }),
        defineField({
          name: "heading",
          type: "string",
          description: "Shown large on the holding page, e.g. 'Back shortly'.",
        }),
        defineField({
          name: "message",
          type: "text",
          rows: 3,
          description: "One or two sentences telling a visitor when to come back.",
        }),
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "language" } },
});
