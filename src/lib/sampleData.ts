// Fallback / seed content used when Sanity is not yet configured (or empty).
// Once real content exists in Sanity, these are ignored. They also serve as
// a reference for the kind of entries to create in the Studio.

import type { Post, Project } from "./types";

export const samplePosts: Post[] = [
  {
    _id: "sample-post-1",
    title: "The Future of Brand Identity in AI",
    slug: "future-of-brand-identity-in-ai",
    date: "May 20, 2026",
    excerpt:
      "Exploring how artificial intelligence is reshaping the way brands communicate their identity and connect with audiences in an increasingly automated world.",
    coverStyle: "mesh-obsidian",
    coverImage: null,
    body: `
      <p>The relationship between artificial intelligence and brand identity is entering a new phase. As AI systems become more capable of generating visual content, writing copy, and even making design decisions, the role of the human designer is shifting from executor to curator and strategist.</p>
      <h2>The Changing Landscape</h2>
      <p>For decades, brand identity has been built on consistency — the same logo, the same colors, the same typeface, applied uniformly across every touchpoint. But AI introduces the possibility of dynamic identity systems that can adapt in real time to different contexts, audiences, and platforms while maintaining a coherent brand essence.</p>
      <p>This doesn't mean brand guidelines become irrelevant. If anything, they become more important as the guardrails within which AI operates. The challenge is defining those guardrails in a way that preserves brand integrity while allowing for the flexibility that AI makes possible.</p>
      <h2>Human-AI Collaboration</h2>
      <p>The most promising approach isn't about replacing human designers with AI, but about creating new collaborative workflows. Designers bring taste, judgment, cultural awareness, and strategic thinking. AI brings speed, scale, and the ability to explore a vast solution space quickly.</p>
      <p>When these strengths are combined thoughtfully, the result is brand work that is both more efficient and more creative.</p>
      <h2>Looking Forward</h2>
      <p>The brands that will thrive in this new landscape are the ones that embrace AI as a creative tool while maintaining a strong human point of view. Technology changes, but the fundamental need for authentic, meaningful brand experiences remains constant.</p>
    `,
  },
  {
    _id: "sample-post-2",
    title: "Designing for Trust",
    slug: "designing-for-trust",
    date: "Apr 12, 2026",
    excerpt:
      "Trust is the quiet foundation of every great brand experience. How considered design decisions build credibility before a single word is read.",
    coverStyle: "mesh-midnight",
    coverImage: null,
    body: `<p>Trust is the quiet foundation of every great brand experience. Long before a user reads your copy or tests your product, they have already formed an impression based on how your design feels.</p><h2>Signals of Credibility</h2><p>Clarity, consistency, and restraint are the signals that communicate competence. When every element feels intentional, users relax — they sense they are in capable hands.</p>`,
  },
  {
    _id: "sample-post-3",
    title: "The Power of Restraint",
    slug: "the-power-of-restraint",
    date: "Mar 5, 2025",
    excerpt:
      "In a world of visual noise, the most powerful design choice is often what you choose to leave out.",
    coverStyle: "mesh-graphite",
    coverImage: null,
    body: `<p>In a world of visual noise, the most powerful design choice is often what you choose to leave out. Restraint is not the absence of design — it is design at its most confident.</p>`,
  },
  {
    _id: "sample-post-4",
    title: "Web Performance as Design",
    slug: "web-performance-as-design",
    date: "Feb 18, 2025",
    excerpt:
      "Speed is a feature, and an experience. Why performance belongs in the design conversation from day one.",
    coverStyle: "mesh-ember",
    coverImage: null,
    body: `<p>Speed is a feature, and an experience. A fast site feels respectful of the user's time and attention, while a slow one quietly erodes confidence.</p>`,
  },
  {
    _id: "sample-post-5",
    title: "Typography in Motion",
    slug: "typography-in-motion",
    date: "Jan 22, 2025",
    excerpt:
      "How movement gives type a voice — and the discipline required to keep it from shouting.",
    coverStyle: "mesh-bone",
    coverImage: null,
    body: `<p>How movement gives type a voice — and the discipline required to keep it from shouting. Motion can add hierarchy, rhythm, and personality when used with intention.</p>`,
  },
  {
    _id: "sample-post-6",
    title: "Systems Over Screens",
    slug: "systems-over-screens",
    date: "Dec 10, 2024",
    excerpt:
      "Great products are designed as systems, not collections of screens. A look at building scalable design foundations.",
    coverStyle: "mesh-midnight",
    coverImage: null,
    body: `<p>Great products are designed as systems, not collections of screens. When you design the rules, the screens design themselves.</p>`,
  },
];

export const sampleProjects: Project[] = [
  {
    _id: "sample-project-1",
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
    coverImage: null,
    featured: true,
    order: 1,
    gallery: [
      { url: null, size: "large", orientation: "portrait", mesh: "mesh-graphite" },
      { url: null, size: "medium", orientation: "landscape", mesh: "mesh-midnight" },
      { url: null, size: "full", orientation: "landscape", mesh: "mesh-obsidian" },
      { url: null, size: "small", orientation: "square", mesh: "mesh-bone" },
      { url: null, size: "large", orientation: "landscape", mesh: "mesh-ember" },
    ],
  },
  {
    _id: "sample-project-2",
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
    coverImage: null,
    featured: true,
    order: 2,
    gallery: [
      { url: null, size: "full", orientation: "landscape", mesh: "mesh-bone" },
      { url: null, size: "medium", orientation: "portrait", mesh: "mesh-graphite" },
    ],
  },
  {
    _id: "sample-project-3",
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
    coverImage: null,
    featured: true,
    order: 3,
    gallery: [{ url: null, size: "full", orientation: "landscape", mesh: "mesh-graphite" }],
  },
  {
    _id: "sample-project-4",
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
    coverImage: null,
    featured: true,
    order: 4,
    gallery: [{ url: null, size: "full", orientation: "portrait", mesh: "mesh-midnight" }],
  },
  {
    _id: "sample-project-5",
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
    coverImage: null,
    featured: true,
    order: 5,
    gallery: [{ url: null, size: "full", orientation: "landscape", mesh: "mesh-ember" }],
  },
  {
    _id: "sample-project-6",
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
    coverImage: null,
    featured: true,
    order: 6,
    gallery: [{ url: null, size: "full", orientation: "landscape", mesh: "mesh-graphite" }],
  },
];
