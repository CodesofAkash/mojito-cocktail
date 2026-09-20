import { defineField, defineType } from "sanity";

export const aboutSection = defineType({
  name: "aboutSection",
  title: "About",
  type: "object",
  description:
    "Headline, customer rating and the photo collage. Two rows: the first three images sit on the top row, the next two on the bottom.",
  fields: [
    defineField({
      name: "badge",
      type: "string",
      description: "Small white pill above the heading, e.g. 'Best Cocktails'.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description: "Paragraph shown to the right of the heading.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rating",
      type: "number",
      description: "Out of 5. Also published as schema.org AggregateRating for search and AI answers.",
      validation: (r) => r.required().min(0).max(5),
    }),
    defineField({
      name: "customerCount",
      type: "string",
      description: "Free text under the rating, e.g. 'More than +1200 customers'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "profileImages",
      title: "Customer avatars",
      type: "array",
      of: [{ type: "image" }],
      description: "Small round faces shown beside the rating. Four works best.",
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "images",
      title: "Collage images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "Exactly five. The first three form the top row (middle one is wider), the last two the bottom row.",
      validation: (r) => r.required().length(5),
    }),
    defineField({ name: "animation", type: "animation" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: "About", subtitle: title }) },
});
