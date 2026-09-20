import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Browser tab and search result title. Aim for under 60 characters.",
      validation: (r) => r.max(70).warning("Search engines truncate past roughly 60 characters."),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (r) => r.max(170).warning("Usually truncated past about 155 characters."),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Shown when the page is pasted into WhatsApp, Slack or X. Ideally 1200×630.",
    }),
  ],
});
