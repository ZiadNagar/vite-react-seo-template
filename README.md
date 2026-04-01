# Vite + React SEO Template

A reusable, fully generic SEO pattern for **Vite + React SPAs**. Drop it into any project and configure with your own values.

## What this solves

Client-rendered SPAs have a well-known SEO problem: the initial HTML is an empty shell. Search crawlers and social preview bots that don't execute JavaScript see nothing. This template provides a **three-layer SEO system** that ensures:

1. **Build-time**: Homepage SEO tags are injected into the raw `index.html` so crawlers see them immediately.
2. **Runtime**: Per-route `<title>`, meta, and JSON-LD update dynamically when users navigate client-side.
3. **Discovery**: `robots.txt`, `sitemap.xml`, `llms.txt`, and web app manifest help crawlers find and understand your site.

## Quick Start

### 1. Copy the files into your project

Copy everything from this template into your Vite + React project root:

```
your-project/
├── site-seo.mjs                    ← single source of truth
├── vite-plugin-site-seo.mjs        ← build-time SEO injection
├── vite.config.js                  ← merge plugin into your config
├── index.html                      ← clean shell (merge with yours)
├── public/
│   ├── robots.txt
│   ├── llms.txt
│   ├── llms-full.txt
│   └── site.webmanifest
└── src/
    ├── main.jsx                    ← wrap in HelmetProvider
    ├── seo/
    │   └── config.js               ← re-export barrel
    └── components/
        └── seo/
            ├── RouteSeo.jsx
            └── NotFoundSeo.jsx
```

### 2. Install dependencies

```bash
npm install react-helmet-async react-router-dom
```

### 3. Configure `site-seo.mjs`

Open `site-seo.mjs` and replace every `YOUR_*` placeholder with your actual values. See the [Configuration Guide](#configuration-guide) below for details.

### 4. Wire into your router

Mount `RouteSeo` once on your main layout and `NotFoundSeo` on your catch-all route:

```jsx
import { Outlet, useLocation } from "react-router-dom";
import RouteSeo from "@/components/seo/RouteSeo";

function AppShell() {
  return (
    <>
      <RouteSeo />
      <Outlet />
    </>
  );
}
```

---

## Architecture

```
site-seo.mjs (constants)
  ├──→ src/seo/config.js (re-export barrel)
  │       └──→ RouteSeo.jsx / NotFoundSeo.jsx (client-side Helmet)
  └──→ vite-plugin-site-seo.mjs (build-time injection + sitemap)
          └──→ vite.config.js (plugin registration)
                └──→ index.html (tags injected at build)
```

### Three layers

| Layer | When | What |
|-------|------|------|
| **Data** | Always | `site-seo.mjs` — all SEO constants, keywords, routes |
| **Build** | `vite build` / `vite dev` | Plugin injects homepage SEO into `index.html` + writes `sitemap.xml` |
| **Runtime** | Client navigation | `RouteSeo` updates `<head>` per route via `react-helmet-async` |

---

## Configuration Guide

### `site-seo.mjs` — every export explained

#### Site Identity

| Export | Type | Example | Required? |
|--------|------|---------|-----------|
| `SITE_ORIGIN` | `string` | `"https://example.com"` | Yes |
| `SITE_NAME` | `string` | `"Acme Corp"` | Yes |
| `SITE_SHORT_NAME` | `string` | `"Acme"` | Recommended |
| `ORG_SLOGAN` | `string` | `"Innovation delivered"` | Recommended |
| `SITE_LANGUAGE` | `string` | `"en"`, `"en-US"`, `"ar"` | Yes |
| `SITE_AUTHOR` | `string` | `"Acme Corp"` | Recommended |

#### Images

| Export | Type | Example | Required? |
|--------|------|---------|-----------|
| `DEFAULT_OG_IMAGE` | `string` | `"https://example.com/og-image.png"` | Yes |
| `OG_IMAGE_WIDTH` | `number` | `1200` | Yes |
| `OG_IMAGE_HEIGHT` | `number` | `630` | Yes |
| `SITE_LOGO_URL` | `string` | `"https://example.com/logo.png"` | Yes |

#### Keywords

| Export | Type | Example | Required? |
|--------|------|---------|-----------|
| `SITE_KEYWORDS` | `string[]` | `["brand", "industry", "service"]` | Recommended |

Each route in `ROUTE_SEO` also accepts a `keywords` array that merges with `SITE_KEYWORDS`.

#### Geo / Local SEO

| Export | Type | Example | Required? |
|--------|------|---------|-----------|
| `GEO_REGION` | `string` | `"US-NY"` | Optional |
| `GEO_PLACENAME` | `string` | `"New York"` | Optional |
| `GEO_POSITION` | `string` | `"40.7128;-74.0060"` | Optional |

#### Social Profiles

| Export | Type | Example | Required? |
|--------|------|---------|-----------|
| `SOCIAL_PROFILES` | `{ platform, url }[]` | See file | Optional |

Populates the `sameAs` field in Organization JSON-LD.

#### Contact

| Export | Type | Example | Required? |
|--------|------|---------|-----------|
| `CONTACT_PHONE` | `string` | `"+1-800-555-0100"` | Optional |
| `CONTACT_EMAIL` | `string` | `"info@example.com"` | Optional |

#### Verification

| Export | Type | Example | Required? |
|--------|------|---------|-----------|
| `VERIFICATION_GOOGLE` | `string` | `"abc123..."` | Optional |
| `VERIFICATION_BING` | `string` | `"abc123..."` | Optional |
| `VERIFICATION_PINTEREST` | `string` | `"abc123..."` | Optional |

#### Sitelinks Searchbox

| Export | Type | Example | Required? |
|--------|------|---------|-----------|
| `SEARCH_ACTION_URL` | `string \| null` | `"https://example.com/search?q={search_term_string}"` | Optional |

Set to `null` to disable.

#### Per-Route SEO

| Export | Type | Required? |
|--------|------|-----------|
| `ROUTE_SEO` | `Record<string, { title, description, keywords?, breadcrumb }>` | Yes |

Keys must match your `react-router-dom` route paths (no trailing slash).

#### Sitemap

| Export | Type | Required? |
|--------|------|-----------|
| `SITEMAP_ENTRIES` | `{ path, changefreq, priority }[]` | Yes |

Only include pages that should appear in search results.

---

## What's Included

### SEO Tags (Build-Time — Homepage)

- `<title>` and `<meta name="description">`
- `<meta name="keywords">` (global + home route keywords)
- `<meta name="author">`
- `<link rel="canonical">`
- Full Open Graph: `og:title`, `og:description`, `og:url`, `og:image`, `og:image:width`, `og:image:height`, `og:type`, `og:site_name`, `og:locale`
- Full Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Geo meta: `geo.region`, `geo.placename`, `geo.position`, `ICBM`
- Verification: `google-site-verification`, `msvalidate.01`, `p:domain_verify`
- `<link rel="manifest">` for web app manifest

### JSON-LD Structured Data (Build-Time — Homepage)

- **Organization**: name, URL, description, slogan, logo, `sameAs` (social profiles), `contactPoint`
- **WebSite**: name, URL, publisher, `inLanguage`, `potentialAction` (SearchAction for Sitelinks Searchbox)

### Per-Route SEO (Runtime — Client Navigation)

- `<title>`, `<meta name="description">`, `<meta name="keywords">`
- `<link rel="canonical">` (full URL per route)
- Open Graph + Twitter Card (updated per route)
- **WebPage** JSON-LD with `isPartOf` WebSite
- **BreadcrumbList** JSON-LD for all non-home routes

### Discovery Files

- `robots.txt` — allows all, points to sitemap
- `sitemap.xml` — auto-generated at build time
- `llms.txt` — short LLM-readable site summary
- `llms-full.txt` — expanded LLM-readable site documentation
- `site.webmanifest` — PWA web app manifest

---

## Adding a New Route

1. Add the route path to `ROUTE_SEO` in `site-seo.mjs`:

```js
"/contact": {
  title: "YOUR_SITE_NAME | Contact",
  description: "Get in touch with our team.",
  keywords: ["contact", "support", "get in touch"],
  breadcrumb: "Contact",
},
```

2. Add it to `SITEMAP_ENTRIES`:

```js
{ path: "/contact", changefreq: "monthly", priority: "0.6" },
```

3. Add the route to your `react-router-dom` configuration.

That's it — `RouteSeo` picks it up automatically.

---

## JSON-LD Reference

### Organization Schema

Injected into the homepage `index.html` at build time:

```json
{
  "@type": "Organization",
  "name": "YOUR_SITE_NAME",
  "url": "https://YOUR_PRODUCTION_DOMAIN/",
  "description": "...",
  "slogan": "...",
  "logo": { "@type": "ImageObject", "url": "..." },
  "sameAs": ["https://linkedin.com/...", "https://twitter.com/..."],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "...",
    "email": "...",
    "contactType": "customer service"
  }
}
```

### WebSite Schema

```json
{
  "@type": "WebSite",
  "name": "YOUR_SITE_NAME",
  "url": "https://YOUR_PRODUCTION_DOMAIN/",
  "publisher": { "@type": "Organization", "name": "YOUR_SITE_NAME" },
  "inLanguage": "en",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://YOUR_PRODUCTION_DOMAIN/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### WebPage Schema (Per-Route)

Injected at runtime via `react-helmet-async`:

```json
{
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page description",
  "url": "https://YOUR_PRODUCTION_DOMAIN/page",
  "inLanguage": "en",
  "keywords": "keyword1, keyword2, keyword3",
  "isPartOf": {
    "@type": "WebSite",
    "name": "YOUR_SITE_NAME",
    "url": "https://YOUR_PRODUCTION_DOMAIN/"
  }
}
```

### BreadcrumbList Schema (Per-Route, Non-Home)

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://YOUR_PRODUCTION_DOMAIN/" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://YOUR_PRODUCTION_DOMAIN/about" }
  ]
}
```

---

## Verification Checklist

After configuration and build:

1. **`npm run build`** — should complete without errors
2. **Open `dist/index.html`** — confirm:
   - `<title>` matches your home title
   - `<meta name="description">` is present
   - `<meta name="keywords">` contains your keywords
   - `<link rel="canonical">` points to your origin
   - All `og:*` and `twitter:*` meta tags are present
   - `<meta name="google-site-verification">` (if configured)
   - `<meta name="geo.*">` tags (if configured)
   - `<link rel="manifest">` points to `/site.webmanifest`
   - `<script type="application/ld+json">` contains valid Organization + WebSite
3. **Open `dist/sitemap.xml`** — confirm:
   - All `<loc>` URLs match your `SITE_ORIGIN`
   - `<lastmod>` is present
   - Only indexable routes are listed
4. **`npm run dev`**, load `/` — inspect `<head>` in DevTools for injected tags
5. **Client-navigate** to `/about` (etc.) — confirm document title and meta change
6. **Validate JSON-LD** — paste `dist/index.html` content into [Google Rich Results Test](https://search.google.com/test/rich-results)
7. **Check `robots.txt`** — confirm sitemap URL uses your production domain

---

## Limitations

- **Non-home URLs**: Full per-route tags exist in the DOM **after** JavaScript runs. Google executes JS, but some bots or social preview fetchers may only see the shell HTML. Homepage injection mitigates this for `/`.
- **Perfect parity** for every path in raw HTML requires **prerender**, **SSR**, or **edge HTML rewriting**.
- **Keywords meta tag**: Google ignores `<meta name="keywords">` for ranking. It's included for completeness and other search engines that may still use it.

---

## File Reference

| File | Purpose |
|------|---------|
| `site-seo.mjs` | Single source of truth — all constants, routes, keywords |
| `vite-plugin-site-seo.mjs` | Vite plugin — injects SEO tags + generates sitemap |
| `vite.config.js` | Registers the plugin + `@` alias |
| `index.html` | Clean HTML shell — no duplicate SEO tags |
| `public/robots.txt` | Crawler instructions |
| `public/llms.txt` | Short LLM-readable summary |
| `public/llms-full.txt` | Expanded LLM-readable documentation |
| `public/site.webmanifest` | PWA manifest |
| `src/main.jsx` | Wraps app in `HelmetProvider` |
| `src/seo/config.js` | Re-export barrel for `@/seo/config` imports |
| `src/components/seo/RouteSeo.jsx` | Per-route SEO via Helmet |
| `src/components/seo/NotFoundSeo.jsx` | 404 page SEO (noindex) |