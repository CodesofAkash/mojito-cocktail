import { defineField, defineType } from "sanity";

export const artSection = defineType({
  name: "artSection",
  title: "The Art",
  type: "object",
  description:
    "The pinned scroll-reveal. The lists and title fade out, the masked image expands, and the hidden message appears behind it.",
  fields: [
    defineField({
      name: "mainTitle",
      type: "string",
      description: "Huge grey word behind everything, e.g. 'The ART'. Fades out as you scroll.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "goodList",
      title: "Left list",
      type: "array",
      of: [{ type: "string" }],
      description: "Ticked points down the left side.",
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "featureList",
      title: "Right list",
      type: "array",
      of: [{ type: "string" }],
      description: "Ticked points down the right side.",
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "checkIcon",
      type: "image",
      description: "Tick used by both lists.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "maskShape",
      title: "Reveal mask shape",
      type: "image",
      description:
        "Greyscale stencil the masked image is revealed through. White shows, black hides. Not seen directly.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "maskImage",
      title: "Masked image",
      type: "image",
      description: "Revealed through the expanding mask as you scroll. A full-bleed photo works best.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "revealTitle",
      type: "string",
      description: "Appears once the mask has opened.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "revealSubtitle", type: "string", validation: (r) => r.required() }),
    defineField({ name: "revealDescription", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({
      name: "show3dGlass",
      title: "Use the 3D glass instead of the masked image",
      type: "boolean",
      description:
        "Renders a real-time WebGL glass. Loads only when scrolled into view, and is skipped on low-power devices and for reduced-motion users.",
      initialValue: false,
    }),
    defineField({ name: "animation", type: "animation" }),
  ],
  preview: { select: { title: "mainTitle" }, prepare: ({ title }) => ({ title: "The Art", subtitle: title }) },
});
