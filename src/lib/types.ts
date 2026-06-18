// Shared content types for blog Posts and portfolio Projects.
// These mirror the Sanity schemas in src/sanity/schemaTypes.

export type Mesh =
  | "mesh-obsidian"
  | "mesh-midnight"
  | "mesh-graphite"
  | "mesh-ember"
  | "mesh-bone";

export interface PortableBlock {
  _type: string;
  style?: string;
  children?: { text: string; marks?: string[] }[];
  [key: string]: unknown;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  date: string; // human-readable, e.g. "May 20, 2026"
  excerpt: string;
  category?: string;
  coverStyle: Mesh;
  coverImage: string | null;
  /** Either Sanity Portable Text blocks or a plain-HTML string (sample data). */
  body: PortableBlock[] | string;
}

export interface GalleryItem {
  url: string | null;
  /** Natural pixel dimensions from Sanity (used to show images at true ratio). */
  width?: number | null;
  height?: number | null;
  /** Item width on the page: full / large / medium / small. */
  size: "large" | "medium" | "full" | "small";
  mesh?: Mesh;
  /** Legacy — no longer used for real images (they auto-size). */
  orientation?: "portrait" | "landscape" | "square";
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  client: string;
  year: string;
  role: string;
  industry: string;
  tags: string[];
  /** Short summary — Selected Work list preview only. */
  description: string;
  /** Longer write-up shown on the project's own page (Portable Text or HTML). */
  detailDescription?: PortableBlock[] | string;
  coverStyle: Mesh;
  coverImage: string | null;
  gallery: GalleryItem[];
  featured: boolean;
  order: number;
}
