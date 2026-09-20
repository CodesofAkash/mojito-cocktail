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
  ],
  preview: { select: { title: "name", subtitle: "language" } },
});
