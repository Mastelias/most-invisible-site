import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";

// Studio configuration — embedded at /admin via @sanity/astro.
// projectId / dataset come from the PUBLIC_SANITY_* env vars.
export default defineConfig({
  name: "most-invisible",
  title: "Most Invisible — Content",
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("project").title("Portfolio Projects"),
            S.documentTypeListItem("post").title("Blog Posts"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
