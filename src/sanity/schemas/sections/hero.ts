import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  description:
    "The opening screen. The video behind it stays put across this section and the next, scrubbing through as the visitor scrolls.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "The giant word across the top. One word reads best.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "subtitle",
      type: "string",
      description: "Large gold line. Split across two lines after the third word.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "ctaText", title: "Button label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "ctaLink",
      title: "Button target",
      type: "string",
      description: "An anchor such as #cocktails, or a full URL.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "video",
      title: "Scroll video",
      type: "file",
      options: { accept: "video/*" },
      description:
        "Scrubbed by scroll position, so encode it all-intra (every frame a keyframe) or seeking stutters. See .claude-local/perf-baseline.md.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "poster",
      title: "Video poster",
      type: "image",
      description:
        "Paints instantly while the video loads, and is what the browser measures as LCP — keep it small.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "leftLeaf", title: "Left decoration", type: "image", validation: (r) => r.required() }),
    defineField({ name: "rightLeaf", title: "Right decoration", type: "image", validation: (r) => r.required() }),
    defineField({ name: "animation", type: "animation" }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: `Hero — ${title ?? ""}`, subtitle: "heroSection" }),
  },
});
