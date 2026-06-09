// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SITE_URL } = loadEnv(
  process.env.NODE_ENV || "development",
  process.cwd(),
  ""
);

// The Sanity integration (and embedded Studio at /admin) only loads once a
// project ID is configured. Until then the site still builds and runs on the
// sample content in src/lib/sampleData.ts.
const integrations = [react(), sitemap()];
if (PUBLIC_SANITY_PROJECT_ID) {
  integrations.unshift(
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || "production",
      useCdn: true,
      studioBasePath: "/admin",
    })
  );
}

export default defineConfig({
  site: PUBLIC_SITE_URL || "https://mostinvisible.com",
  integrations,
});
