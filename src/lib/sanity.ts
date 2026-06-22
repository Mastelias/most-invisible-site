// Sanity data access layer.
//
// Reads PUBLIC_SANITY_PROJECT_ID / PUBLIC_SANITY_DATASET from the environment.
// When Sanity is not configured (or a query returns nothing) every helper
// gracefully falls back to the seed content in sampleData.ts, so the site
// always renders — before, during, and after CMS setup.

import { createClient, type SanityClient } from "@sanity/client";
import type { Post, Project } from "./types";
import { samplePosts, sampleProjects } from "./sampleData";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || "production";

export const sanityConfigured = Boolean(projectId);

const client: SanityClient | null = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  : null;

/** Format an ISO date (or any Date-parsable string) as "May 20, 2026". */
export function formatDate(input: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return input; // already human-readable
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const POST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  "date": publishedAt,
  excerpt,
  category,
  coverStyle,
  "coverImage": coverImage.asset->url,
  body[]{
    ...,
    _type == "image" => { "url": asset->url, "alt": alt }
  }
`;

const PROJECT_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  client,
  year,
  role,
  industry,
  tags,
  description,
  detailDescription,
  coverStyle,
  "coverImage": coverImage.asset->url,
  featured,
  order,
  "gallery": gallery[]{
    size,
    mesh,
    "url": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }
`;

async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!client) return fallback;
  try {
    const result = await client.fetch<T>(query, params);
    if (result == null || (Array.isArray(result) && result.length === 0)) return fallback;
    return result;
  } catch (err) {
    console.warn("[sanity] query failed, using sample data:", (err as Error).message);
    return fallback;
  }
}

// ─── Posts ────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const posts = await safeFetch<Post[]>(
    `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc){${POST_FIELDS}}`,
    {},
    samplePosts
  );
  return posts.map((p) => ({ ...p, date: formatDate(p.date) }));
}

export async function getPost(slug: string): Promise<Post | null> {
  const sampleMatch = samplePosts.find((p) => p.slug === slug) ?? null;
  const post = await safeFetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0]{${POST_FIELDS}}`,
    { slug },
    sampleMatch
  );
  return post ? { ...post, date: formatDate(post.date) } : null;
}

// ─── Projects ─────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  return safeFetch<Project[]>(
    `*[_type == "project" && !(_id in path("drafts.**"))] | order(order asc){${PROJECT_FIELDS}}`,
    {},
    sampleProjects
  );
}

export async function getProject(slug: string): Promise<Project | null> {
  const sampleMatch = sampleProjects.find((p) => p.slug === slug) ?? null;
  return safeFetch<Project | null>(
    `*[_type == "project" && slug.current == $slug][0]{${PROJECT_FIELDS}}`,
    { slug },
    sampleMatch
  );
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, 6);
}

/** The most recent project — newest year, then most recently added/launched. */
export async function getLatestProject(): Promise<Project | null> {
  const fallback =
    [...sampleProjects].sort(
      (a, b) => (b.year || "").localeCompare(a.year || "") || a.order - b.order
    )[0] ?? null;
  return safeFetch<Project | null>(
    `*[_type == "project" && !(_id in path("drafts.**"))] | order(year desc, _createdAt desc)[0]{${PROJECT_FIELDS}}`,
    {},
    fallback
  );
}
