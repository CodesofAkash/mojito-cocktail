import { defineArrayMember, defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Use 'home' for the landing page — it is served at the locale root.",
      options: {
        source: "title",
        maxLength: 96,
        // Sanity's default uniqueness is global, which rejects three
        // translations all at /home. Scope it to the locale.
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2026-09-19" });
          const id = document?._id.replace(/^drafts\./, "");
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug,
            language: (document as { language?: string })?.language ?? null,
          };
          const query = `!defined(*[
            _type == "page" &&
            !(_id in [$draft, $published]) &&
            slug.current == $slug &&
            language == $language
          ][0]._id)`;
          return client.fetch(query, params);
        },
      },
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
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "cocktailsSection" }),
        defineArrayMember({ type: "aboutSection" }),
        defineArrayMember({ type: "artSection" }),
        defineArrayMember({ type: "menuSection" }),
        defineArrayMember({ type: "contactSection" }),
      ],
      description: "Drag to reorder. The page renders these top to bottom.",
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "title", language: "language", slug: "slug.current" },
    prepare: ({ title, language, slug }) => ({
      title: title ?? "Untitled page",
      subtitle: `/${slug ?? ""} · ${language ?? "no language"}`,
    }),
  },
});
