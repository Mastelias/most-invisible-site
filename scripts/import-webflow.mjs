// Imports prepped Webflow posts (scripts/webflow-posts.json) into Sanity.
//
//  - downloads each Webflow-hosted image and uploads it to Sanity (self-hosted)
//  - converts the HTML body to Portable Text (with inline images as image blocks)
//  - createOrReplace with a deterministic _id (idempotent — safe to re-run)
//
// Usage:  npm run import:webflow        (reads .env for SANITY_WRITE_TOKEN)

import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { htmlToBlocks } from "@sanity/block-tools";
import { Schema } from "@sanity/schema";
import { JSDOM } from "jsdom";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("✗ Missing SANITY_WRITE_TOKEN in .env");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "gsgxzh76",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// Block content type used by htmlToBlocks (mirrors the Post `body` field).
const schema = Schema.compile({
  name: "default",
  types: [
    {
      name: "post",
      type: "document",
      fields: [{ name: "body", type: "array", of: [{ type: "block" }, { type: "image" }] }],
    },
  ],
});
const blockContentType = schema.get("post").fields.find((f) => f.name === "body").type;

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);
const imageRef = (ref) => ({ _type: "image", asset: { _type: "reference", _ref: ref } });

const imageCache = new Map(); // url -> assetId
async function uploadImage(url) {
  if (!url) return null;
  if (imageCache.has(url)) return imageCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  let filename = "image";
  try {
    filename = decodeURIComponent(new URL(url).pathname.split("/").pop()) || "image";
  } catch {}
  const asset = await client.assets.upload("image", buf, { filename });
  imageCache.set(url, asset._id);
  return asset._id;
}

// Ensure every block / child / markDef has a _key (Sanity requires it).
function ensureKeys(blocks) {
  for (const b of blocks) {
    if (!b._key) b._key = key();
    if (Array.isArray(b.children)) for (const c of b.children) if (!c._key) c._key = key();
    if (Array.isArray(b.markDefs)) for (const m of b.markDefs) if (!m._key) m._key = key();
  }
  return blocks;
}

async function convertBody(html) {
  if (!html || !html.trim()) return [];
  // The page already renders an <h1>; downgrade body h1s to h2 for semantics.
  html = html.replace(/<(\/?)h1(\s|>)/gi, "<$1h2$2");

  // Pre-upload inline images, building a url -> assetId map.
  const doc = new JSDOM(html).window.document;
  const urlToRef = {};
  for (const img of doc.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    if (!src || urlToRef[src] !== undefined) continue;
    try {
      urlToRef[src] = await uploadImage(src);
    } catch {
      urlToRef[src] = null;
    }
  }

  const blocks = htmlToBlocks(html, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    rules: [
      {
        deserialize(el, next, block) {
          if (el.nodeName && el.nodeName.toLowerCase() === "img") {
            const ref = urlToRef[el.getAttribute("src")];
            if (ref) return block(imageRef(ref));
          }
          return undefined;
        },
      },
    ],
  });
  return ensureKeys(blocks);
}

async function importPost(p) {
  const heroRef = await uploadImage(p.heroImage).catch(() => null);
  const body = await convertBody(p.content || "");
  const doc = {
    _id: `post-${p.itemId}`,
    _type: "post",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    publishedAt: p.publishedAt,
    coverStyle: "mesh-graphite",
    body,
  };
  if (p.excerpt) doc.excerpt = p.excerpt;
  if (p.category) doc.category = p.category;
  if (heroRef) doc.coverImage = imageRef(heroRef);
  await client.createOrReplace(doc);
}

const posts = JSON.parse(readFileSync("scripts/webflow-posts.json", "utf-8"));
console.log(`Importing ${posts.length} posts into ${client.config().projectId}/${client.config().dataset}…\n`);

// SKIP_EXISTING=1 → only process posts not already in Sanity (resume/extend).
const skipExisting = process.env.SKIP_EXISTING === "1";
const existingIds = skipExisting
  ? new Set(await client.fetch(`*[_type=="post"]._id`))
  : new Set();
if (skipExisting) console.log(`Skip-existing on: ${existingIds.size} posts already present.\n`);

const failures = [];
let done = 0;
let skipped = 0;
for (const p of posts) {
  if (skipExisting && existingIds.has(`post-${p.itemId}`)) {
    skipped++;
    continue;
  }
  try {
    await importPost(p);
    done++;
    console.log(`✓ [${done}/${posts.length}] ${p.title.slice(0, 60)}`);
  } catch (e) {
    failures.push({ title: p.title, slug: p.slug, error: e.message });
    console.log(`✗ ${p.title.slice(0, 60)} — ${e.message}`);
  }
}

console.log(`\nDone: ${done} imported, ${skipped} skipped, ${failures.length} failed. Images uploaded: ${imageCache.size}.`);
if (failures.length) console.log(JSON.stringify(failures, null, 2));
