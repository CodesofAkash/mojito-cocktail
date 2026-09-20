import { defineArrayMember, defineField, defineType } from "sanity";

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact / footer",
  type: "object",
  description:
    "The closing footer. Address, phone, opening hours and socials — all of it also feeds the schema.org markup that search engines and AI assistants read.",
  fields: [
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "addressLabel",
      type: "string",
      description: "Heading above the address, e.g. 'Visit Our Bar'. Translate this per locale.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "address",
      type: "text",
      rows: 2,
      description: "Published as schema.org PostalAddress.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "contactLabel",
      type: "string",
      description: "Heading above phone and email, e.g. 'Contact Us'.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "phone", type: "string", validation: (r) => r.required() }),
    defineField({ name: "email", type: "string", validation: (r) => r.required().email() }),
    defineField({
      name: "hoursLabel",
      type: "string",
      description: "Heading above the hours, e.g. 'Open Everyday'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "openingHours",
      type: "array",
      description: "One row per day range. Published as schema.org OpeningHoursSpecification.",
      of: [
        defineArrayMember({
          type: "object",
          name: "openingHour",
          fields: [
            defineField({ name: "day", type: "string", description: "e.g. Mon–Thu" }),
            defineField({ name: "time", type: "string", description: "e.g. 11:00am – 12am" }),
          ],
          preview: { select: { title: "day", subtitle: "time" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "socialsLabel",
      type: "string",
      description: "Heading above the social icons, e.g. 'Socials'. The links live in Site settings.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "leftLeaf", title: "Left decoration", type: "image", validation: (r) => r.required() }),
    defineField({ name: "rightLeaf", title: "Right decoration", type: "image", validation: (r) => r.required() }),
    defineField({ name: "animation", type: "animation" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: "Contact", subtitle: title }) },
});
