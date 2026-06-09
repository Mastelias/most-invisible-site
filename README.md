# Most Invisible — Studio Website

The Most Invisible® studio site, built with **Astro** (frontend) + **Sanity** (CMS),
deployed on **Vercel**. The hand-coded design is preserved 1:1; blog and portfolio
content is managed in Sanity.

## Stack at a glance

| Layer | Tech |
|---|---|
| Frontend | Astro (static output) |
| CMS | Sanity (embedded Studio at `/admin`) |
| Hosting | Vercel |
| Forms | Formspree (contact page) |

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

Until Sanity is configured, the site runs on **sample content** in
`src/lib/sampleData.ts`, so every page renders immediately.

```bash
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## Content model

Two collections, both editable in the Studio at `/admin`:

- **Blog Posts** (`post`) — title, slug, publish date, excerpt, cover (gradient
  style or uploaded image), body (rich text). Drives `/blog` and `/blog/[slug]`.
- **Portfolio Projects** (`project`) — title, slug, client, year, role, industry,
  tags, description, cover, gallery, and a **`Featured on home page`** toggle.
  Drives `/work`, `/work/[slug]`, and the home page work grid.

> The home page work grid shows projects with **Featured** turned on (ordered by
> the `Order` field). One source of truth — no double entry.

## Going live — one-time setup

### 1. Create the Sanity project (~2 min)

```bash
npx sanity login           # opens browser; sign in / create a free account
npx sanity init --env      # creates a project + dataset, writes a .env
```

Or create it at <https://sanity.io/manage>, then copy `.env.example` to `.env`
and fill in:

```
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SITE_URL=https://mostinvisible.com
```

Restart `npm run dev`, open **http://localhost:4321/admin**, and add your real
Posts and Projects. (Mark a few Projects as *Featured* for the home page.)

> CORS: in <https://sanity.io/manage> → API → CORS origins, add your local URL
> (`http://localhost:4321`) and your production domain so the Studio can connect.

### 2. Contact form (Formspree)

Create a free form at <https://formspree.io>, then set in `.env`:

```
PUBLIC_FORMSPREE_ID=xxxxxxx     # the part after /f/ in your endpoint
```

Without it, the contact form falls back to opening the visitor's mail client.

### 3. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel → **New Project** → import the repo. Framework preset: **Astro**
   (auto-detected). Build: `npm run build`, output: `dist`.
3. Add the same env vars (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`,
   `PUBLIC_SITE_URL`, `PUBLIC_FORMSPREE_ID`) under Vercel → Settings → Environment
   Variables.
4. Deploy.

### 4. Point the domain

In Vercel → Settings → Domains, add `mostinvisible.com` and follow the DNS
instructions. HTTPS is provisioned automatically.

### 5. Rebuild on publish (so CMS edits go live)

This is a static site, so new/edited content needs a rebuild:

1. Vercel → Settings → Git → **Deploy Hooks** → create a hook, copy the URL.
2. Sanity → <https://sanity.io/manage> → API → **Webhooks** → add the Vercel
   deploy-hook URL, trigger on create/update/delete.

Now publishing in the Studio triggers a fresh deploy (~1 min) automatically.

## Editing with Claude

Everything here is plain code Claude can edit:

- **Pages / layout / styles** — `src/pages/`, `src/layouts/`, `public/*.css`
- **CMS schemas** — `src/sanity/schemaTypes/`
- **Queries / data layer** — `src/lib/sanity.ts`
- **Sample/seed content** — `src/lib/sampleData.ts`

Content itself lives in Sanity and can be scripted via the Sanity API/token.
