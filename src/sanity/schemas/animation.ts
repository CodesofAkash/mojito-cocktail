import { defineField, defineType } from "sanity";

export const animation = defineType({
  name: "animation",
  title: "Animation",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "enabled",
      type: "boolean",
      title: "Animate this section",
      initialValue: true,
    }),
    defineField({
      name: "preset",
      type: "string",
      title: "Effect",
      options: {
        list: [
          { title: "Fade in", value: "fade" },
          { title: "Slide up", value: "slideUp" },
          { title: "Split by character", value: "splitChars" },
          { title: "Split by line", value: "splitLines" },
          { title: "Parallax on scroll", value: "parallax" },
        ],
        layout: "radio",
      },
      initialValue: "fade",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "speed",
      type: "number",
      title: "Speed",
      description: "Multiplier. 0.5 is half speed (slower), 2 is double speed (snappier).",
      initialValue: 1,
      validation: (rule) => rule.min(0.25).max(3),
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "delay",
      type: "number",
      title: "Delay (seconds)",
      initialValue: 0,
      validation: (rule) => rule.min(0).max(3),
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "stagger",
      type: "number",
      title: "Stagger between items (seconds)",
      initialValue: 0.05,
      validation: (rule) => rule.min(0).max(1),
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "scrubbed",
      type: "boolean",
      title: "Tie progress to scroll position",
      description: "On: the animation follows the scrollbar. Off: it plays once on entry.",
      initialValue: false,
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "disableOnMobile",
      type: "boolean",
      title: "Skip on mobile",
      description: "Heavy effects can stutter on low-powered phones.",
      initialValue: false,
      hidden: ({ parent }) => !parent?.enabled,
    }),
  ],
});
