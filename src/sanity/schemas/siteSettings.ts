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
      name: "cookieConsent",
      title: "Cookie consent",
      type: "object",
      description:
        "The banner's wording, in this language. Whether it is shown at all is in Global configuration, because that switch cannot differ per market.",
      options: { collapsible: true, collapsed: true },
      fields: [
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
        "The holding page's wording, in this language. Whether the site is actually down is in Global configuration, because it cannot be true in one market and false in another.",
      options: { collapsible: true, collapsed: true },
      fields: [
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
