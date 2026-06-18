// Seeds the Sanity "project" collection with editable starter entries.
//
// Usage:
//   1. Create a write token: sanity.io/manage → project → API → Tokens →
//      "Add API token" → name it, permission "Editor" → copy it.
//   2. Add it to .env as:  SANITY_WRITE_TOKEN=sk...
//   3. Run:  npm run seed:portfolio
//
// Re-running is safe (idempotent) — it uses fixed _ids and createOrReplace.
// Images are intentionally left empty; add them per project in the Studio.

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("✗ Missing SANITY_WRITE_TOKEN. Add it to .env (see header of this file).");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "gsgxzh76",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const g = (size, orientation, mesh) => ({
  _key: `${size}-${orientation}-${Math.random().toString(36).slice(2, 8)}`,
  _type: "galleryItem",
  size,
  orientation,
  mesh,
});

const projects = [
  {
    _id: "project-obsidian-lumen-os",
    title: "Obsidian × Lumen OS",
    slug: "obsidian-lumen-os",
    client: "Lumen Inc.",
    year: "2025",
    role: "Product Design, UI/UX",
    industry: "Technology",
    tags: ["Product Design", "UI/UX", "Design System"],
    description:
      "A unified design system and operating interface for next-generation smart devices, blending dark aesthetics with intuitive navigation patterns.",
    coverStyle: "mesh-obsidian",
    featured: true,
    order: 1,
    gallery: [
      g("large", "portrait", "mesh-graphite"),
      g("medium", "landscape", "mesh-midnight"),
      g("full", "landscape", "mesh-obsidian"),
      g("small", "square", "mesh-bone"),
      g("large", "landscape", "mesh-ember"),
    ],
  },
  {
    _id: "project-vessel-studio",
    title: "Vessel Studio",
    slug: "vessel-studio",
    client: "Vessel",
    year: "2024",
    role: "Brand Identity",
    industry: "Architecture",
    tags: ["Brand Identity", "Art Direction"],
    description:
      "A refined brand identity for an architecture studio, built on quiet typography and a restrained material palette.",
    coverStyle: "mesh-bone",
    featured: true,
    order: 2,
    gallery: [g("full", "landscape", "mesh-bone"), g("medium", "portrait", "mesh-graphite")],
  },
  {
    _id: "project-kin-and-co",
    title: "Kin & Co.",
    slug: "kin-and-co",
    client: "Kin & Co.",
    year: "2024",
    role: "Packaging",
    industry: "Consumer Goods",
    tags: ["Packaging", "Brand Identity"],
    description:
      "Packaging and identity for a modern household-goods brand, balancing warmth with editorial precision.",
    coverStyle: "mesh-graphite",
    featured: true,
    order: 3,
    gallery: [g("full", "landscape", "mesh-graphite")],
  },
  {
    _id: "project-small-reading-app",
    title: "Small",
    slug: "small-reading-app",
    client: "Small Inc.",
    year: "2025",
    role: "Product Design",
    industry: "Media",
    tags: ["Product Design", "UI/UX"],
    description:
      "A focused reading app that strips away everything but the words, designed around calm and concentration.",
    coverStyle: "mesh-midnight",
    featured: true,
    order: 4,
    gallery: [g("full", "portrait", "mesh-midnight")],
  },
  {
    _id: "project-arc-studio",
    title: "Arc Studio",
    slug: "arc-studio",
    client: "Arc",
    year: "2025",
    role: "Website Design",
    industry: "Creative Agency",
    tags: ["Website", "Art Direction"],
    description:
      "A portfolio website for a motion studio, pairing bold type with restrained, performance-first interactions.",
    coverStyle: "mesh-ember",
    featured: true,
    order: 5,
    gallery: [g("full", "landscape", "mesh-ember")],
  },
  {
    _id: "project-nova-health",
    title: "Nova Health",
    slug: "nova-health",
    client: "Nova",
    year: "2026",
    role: "Product Design",
    industry: "Healthcare",
    tags: ["Product Design", "Design System"],
    description:
      "A patient-facing platform for a digital health provider, built on clarity, accessibility, and trust.",
    coverStyle: "mesh-graphite",
    featured: true,
    order: 6,
    gallery: [g("full", "landscape", "mesh-graphite")],
  },
];

const docs = projects.map((p) => ({
  _id: p._id,
  _type: "project",
  title: p.title,
  slug: { _type: "slug", current: p.slug },
  client: p.client,
  year: p.year,
  role: p.role,
  industry: p.industry,
  tags: p.tags,
  description: p.description,
  coverStyle: p.coverStyle,
  featured: p.featured,
  order: p.order,
  gallery: p.gallery,
}));

const run = async () => {
  console.log(`Seeding ${docs.length} projects into ${client.config().projectId}/${client.config().dataset}…`);
  let tx = client.transaction();
  docs.forEach((d) => tx = tx.createOrReplace(d));
  await tx.commit();
  console.log("✓ Done. Open /admin → Portfolio Projects to edit them and add images.");
};

run().catch((err) => {
  console.error("✗ Seed failed:", err.message);
  process.exit(1);
});
