import { defineField, defineType } from "sanity";

export const locale = defineType({
  name: "locale",
  title: "Locale",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "BCP-47 code",
      type: "string",
      description:
        "Language-REGION, e.g. en-IN, en-US, de-DE. This is the URL segment. " +
        "It must be valid BCP-47 — hreflang is ignored by search engines otherwise, " +
        "so codes like 'EU' or 'USA' would silently cost you international SEO.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z]{2}-[A-Z]{2}$/, {
            name: "BCP-47",
            invert: false,
          })
          .error("Must look like en-IN, en-US or de-DE — lowercase language, uppercase region."),
    }),
    defineField({
      name: "title",
      title: "Display name",
      type: "string",
      description: "Shown in the language switcher, e.g. 'India (English)'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isDefault",
      title: "Default locale",
      type: "boolean",
      description:
        "The default is served at the bare '/' with no URL prefix. Exactly one locale should have this.",
      initialValue: false,
    }),
    defineField({
      name: "enabled",
      title: "Published to the site",
      type: "boolean",
      description: "Turn off to build a market's content without exposing it yet.",
      initialValue: true,
    }),
    defineField({
      name: "currency",
      title: "Currency code",
      type: "string",
      description: "ISO 4217, e.g. INR, USD, EUR. Drives price formatting.",
      validation: (rule) => rule.required().regex(/^[A-Z]{3}$/).error("Three uppercase letters, e.g. INR."),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "code", isDefault: "isDefault" },
    prepare: ({ title, subtitle, isDefault }) => ({
      title: isDefault ? `${title} (default)` : title,
      subtitle,
    }),
  },
});
