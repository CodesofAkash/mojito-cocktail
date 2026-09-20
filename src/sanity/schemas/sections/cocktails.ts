import { defineArrayMember, defineField, defineType } from "sanity";

export const cocktailsSection = defineType({
  name: "cocktailsSection",
  title: "Cocktail lists",
  type: "object",
  description:
    "The two-column price list below the hero. Each list is a category — add a third and it renders automatically.",
  fields: [
    defineField({
      name: "lists",
      title: "Categories",
      type: "array",
      description: "One block per category, e.g. 'Most popular cocktails'. Rendered left to right.",
      of: [
        defineArrayMember({
          type: "object",
          name: "drinkList",
          fields: [
            defineField({
              name: "title",
              type: "string",
              description: "Category heading shown above the list.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "items",
              title: "Drinks",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "drink",
                  fields: [
                    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                    defineField({
                      name: "detail",
                      type: "string",
                      description: "Serving size or note, e.g. '750 ml'. Shown under the name.",
                    }),
                    defineField({
                      name: "price",
                      type: "number",
                      description:
                        "Amount only, no symbol. The currency comes from this page's Locale, so 10 renders as ₹10 or $10.",
                      validation: (r) => r.required().min(0),
                    }),
                    defineField({
                      name: "country",
                      type: "string",
                      description: "Two-letter country code, e.g. AU. Shown next to the detail.",
                    }),
                  ],
                  preview: { select: { title: "name", subtitle: "detail" } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} drinks` }),
          },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "leftLeaf",
      title: "Left decoration",
      type: "image",
      description: "Leaf that drifts in from the left as you scroll into this section.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rightLeaf",
      title: "Right decoration",
      type: "image",
      description: "Leaf that drifts in from the right.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "animation",
      type: "animation",
      description: "How this section animates. The leaves use a scroll-linked parallax.",
    }),
  ],
  preview: {
    select: { lists: "lists" },
    prepare: ({ lists }) => ({ title: "Cocktail lists", subtitle: `${lists?.length ?? 0} categories` }),
  },
});
