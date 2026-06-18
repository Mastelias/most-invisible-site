import { defineType, defineField } from "sanity";

const MESH_OPTIONS = [
  { title: "Obsidian (dark)", value: "mesh-obsidian" },
  { title: "Midnight (blue)", value: "mesh-midnight" },
  { title: "Graphite (grey)", value: "mesh-graphite" },
  { title: "Ember (warm)", value: "mesh-ember" },
  { title: "Bone (light)", value: "mesh-bone" },
];

export const project = defineType({
  name: "project",
  title: "Portfolio Project",
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
      name: "featured",
      title: "Featured on home page",
      description: "When on, this project appears in the home page work grid.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Lower numbers appear first in Selected Work and on the home grid.",
      type: "number",
      initialValue: 99,
    }),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({
      name: "role",
      title: "Role",
      description: 'e.g. "Product Design, UI/UX"',
      type: "string",
    }),
    defineField({ name: "industry", title: "Industry", type: "string" }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "description",
      title: "Summary",
      description: "Short one-liner shown ONLY on the Selected Work list (preview).",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "detailDescription",
      title: "Detailed description",
      description:
        "The longer write-up shown on the project's own page. Supports multiple paragraphs.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "coverStyle",
      title: "Cover gradient style",
      description: "Used as the cover/hero when no cover image is uploaded.",
      type: "string",
      options: { list: MESH_OPTIONS, layout: "radio" },
      initialValue: "mesh-obsidian",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image (optional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Case study gallery",
      type: "array",
      of: [
        {
          type: "object",
          name: "galleryItem",
          fields: [
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            {
              name: "size",
              title: "Size",
              type: "string",
              options: {
                list: [
                  { title: "Large", value: "large" },
                  { title: "Medium", value: "medium" },
                  { title: "Full width", value: "full" },
                  { title: "Small", value: "small" },
                ],
              },
              initialValue: "full",
            },
            {
              name: "mesh",
              title: "Fallback gradient",
              description: "Shown only if no image is uploaded for this slot.",
              type: "string",
              options: { list: MESH_OPTIONS },
              initialValue: "mesh-graphite",
            },
          ],
          preview: {
            select: { media: "image", size: "size" },
            prepare({ media, size }) {
              return { title: size ? `${size} width` : "Gallery image", media };
            },
          },
        },
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
    { title: "Order, ascending", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "coverImage" },
  },
});
