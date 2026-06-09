import { defineType, defineField } from "sanity";

const MESH_OPTIONS = [
  { title: "Obsidian (dark)", value: "mesh-obsidian" },
  { title: "Midnight (blue)", value: "mesh-midnight" },
  { title: "Graphite (grey)", value: "mesh-graphite" },
  { title: "Ember (warm)", value: "mesh-ember" },
  { title: "Bone (light)", value: "mesh-bone" },
];

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short summary shown in the article hero and previews.",
      type: "text",
      rows: 3,
      validation: (r) => r.max(300),
    }),
    defineField({
      name: "coverStyle",
      title: "Cover gradient style",
      description: "Used as the cover when no cover image is uploaded.",
      type: "string",
      options: { list: MESH_OPTIONS, layout: "radio" },
      initialValue: "mesh-obsidian",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image (optional)",
      description: "Overrides the gradient style if provided.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Article body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "metaTitle", title: "Meta title", type: "string" },
        { name: "metaDescription", title: "Meta description", type: "text", rows: 2 },
      ],
    }),
  ],
  orderings: [
    {
      title: "Publish date, newest",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
  },
});
