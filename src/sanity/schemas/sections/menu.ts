import { defineArrayMember, defineField, defineType } from "sanity";

export const menuSection = defineType({
  name: "menuSection",
  title: "Menu slider",
  type: "object",
  description:
    "The interactive cocktail carousel. Tabs across the top, arrows either side, one drink shown at a time.",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      description: "Screen-reader heading for the section. Not shown visually.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "recipeLabel",
      type: "string",
      description: "Small label above the drink name, e.g. 'Recipe for:'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "drinks",
      type: "array",
      description: "Each becomes a tab. Order here is the carousel order.",
      of: [
        defineArrayMember({
          type: "object",
          name: "featuredDrink",
          fields: [
            defineField({
              name: "name",
              type: "string",
              description: "Tab label and the name shown under 'Recipe for:'.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              description: "Cut-out of the drink, shown centre stage.",
              validation: (r) => r.required(),
            }),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name", subtitle: "title", media: "image" } },
        }),
      ],
      validation: (r) => r.required().min(2),
    }),
    defineField({
      name: "leftLeaf",
      title: "Left decoration",
      type: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rightLeaf",
      title: "Right decoration",
      type: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "prevIcon",
      title: "Previous arrow",
      type: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "nextIcon",
      title: "Next arrow",
      type: "image",
      validation: (r) => r.required(),
    }),
    defineField({ name: "animation", type: "animation" }),
  ],
  preview: {
    select: { title: "heading", drinks: "drinks" },
    prepare: ({ title, drinks }) => ({ title: title ?? "Menu", subtitle: `${drinks?.length ?? 0} drinks` }),
  },
});
