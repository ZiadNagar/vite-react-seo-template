import fs from "node:fs";
import path from "node:path";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  DEFAULT_OG_IMAGE,
  GEO_PLACENAME,
  GEO_POSITION,
  GEO_REGION,
  HOME_DESCRIPTION,
  HOME_KEYWORDS,
  HOME_TITLE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  ORG_SLOGAN,
  SEARCH_ACTION_URL,
  SITEMAP_ENTRIES,
  SITE_AUTHOR,
  SITE_KEYWORDS,
  SITE_LANGUAGE,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_PROFILES,
  VERIFICATION_BING,
  VERIFICATION_GOOGLE,
  VERIFICATION_PINTEREST,
  pageLoc,
} from "./site-seo.mjs";

function homeCanonical() {
  return `${SITE_ORIGIN}/`;
}

/**
 * Build the homepage JSON-LD structured data.
 * Includes: Organization (with sameAs, contactPoint, logo),
 * WebSite (with SearchAction for Sitelinks Searchbox).
 */
function buildJsonLd() {
  const sameAs = SOCIAL_PROFILES.map((p) => p.url).filter(Boolean);

  const organization = {
    "@type": "Organization",
    name: SITE_NAME,
    url: homeCanonical(),
    description: HOME_DESCRIPTION,
    slogan: ORG_SLOGAN,
    logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
  };

  // Add sameAs if social profiles are configured
  if (sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  // Add contactPoint if phone or email is configured
  if (CONTACT_PHONE || CONTACT_EMAIL) {
    organization.contactPoint = {
      "@type": "ContactPoint",
      ...(CONTACT_PHONE && { telephone: CONTACT_PHONE }),
      ...(CONTACT_EMAIL && { email: CONTACT_EMAIL }),
      contactType: "customer service",
    };
  }

  const webSite = {
    "@type": "WebSite",
    name: SITE_NAME,
    url: homeCanonical(),
    publisher: { "@type": "Organization", name: SITE_NAME },
    inLanguage: SITE_LANGUAGE,
  };

  // Add SearchAction for Sitelinks Searchbox
  if (SEARCH_ACTION_URL) {
    webSite.potentialAction = {
      "@type": "SearchAction",
      target: SEARCH_ACTION_URL,
      "query-input": "required name=search_term_string",
    };
  }

  return JSON.stringify(
    { "@context": "https://schema.org", "@graph": [organization, webSite] },
    null,
    2,
  );
}

/** Build sitemap.xml content from SITEMAP_ENTRIES. */
function buildSitemapXml(lastmod) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const entry of SITEMAP_ENTRIES) {
    lines.push("  <url>");
    lines.push(`    <loc>${pageLoc(entry.path)}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    lines.push(`    <priority>${entry.priority}</priority>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return `${lines.join("\n")}\n`;
}

/**
 * Vite plugin: injects homepage SEO tags into index.html at build/dev time
 * and writes sitemap.xml to the output directory.
 */
export function siteSeoPlugin() {
  return {
    name: "site-seo",

    transformIndexHtml() {
      const jsonLd = buildJsonLd();
      const allKeywords = [...new Set([...SITE_KEYWORDS, ...HOME_KEYWORDS])];

      return {
        tags: [
          // ─── Core SEO ────────────────────────────────────────────────
          {
            tag: "title",
            injectTo: "head",
            children: HOME_TITLE,
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { name: "description", content: HOME_DESCRIPTION },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { name: "keywords", content: allKeywords.join(", ") },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { name: "author", content: SITE_AUTHOR },
          },
          {
            tag: "link",
            injectTo: "head",
            attrs: { rel: "canonical", href: homeCanonical() },
          },

          // ─── Geo / Local SEO ─────────────────────────────────────────
          ...(GEO_REGION
            ? [
                {
                  tag: "meta",
                  injectTo: "head",
                  attrs: { name: "geo.region", content: GEO_REGION },
                },
              ]
            : []),
          ...(GEO_PLACENAME
            ? [
                {
                  tag: "meta",
                  injectTo: "head",
                  attrs: { name: "geo.placename", content: GEO_PLACENAME },
                },
              ]
            : []),
          ...(GEO_POSITION
            ? [
                {
                  tag: "meta",
                  injectTo: "head",
                  attrs: { name: "geo.position", content: GEO_POSITION },
                },
                {
                  tag: "meta",
                  injectTo: "head",
                  attrs: { name: "ICBM", content: GEO_POSITION },
                },
              ]
            : []),

          // ─── Verification ────────────────────────────────────────────
          ...(VERIFICATION_GOOGLE
            ? [
                {
                  tag: "meta",
                  injectTo: "head",
                  attrs: {
                    name: "google-site-verification",
                    content: VERIFICATION_GOOGLE,
                  },
                },
              ]
            : []),
          ...(VERIFICATION_BING
            ? [
                {
                  tag: "meta",
                  injectTo: "head",
                  attrs: {
                    name: "msvalidate.01",
                    content: VERIFICATION_BING,
                  },
                },
              ]
            : []),
          ...(VERIFICATION_PINTEREST
            ? [
                {
                  tag: "meta",
                  injectTo: "head",
                  attrs: {
                    name: "p:domain_verify",
                    content: VERIFICATION_PINTEREST,
                  },
                },
              ]
            : []),

          // ─── Open Graph ──────────────────────────────────────────────
          {
            tag: "meta",
            injectTo: "head",
            attrs: { property: "og:title", content: HOME_TITLE },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { property: "og:description", content: HOME_DESCRIPTION },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { property: "og:url", content: homeCanonical() },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { property: "og:image", content: DEFAULT_OG_IMAGE },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: {
              property: "og:image:width",
              content: String(OG_IMAGE_WIDTH),
            },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: {
              property: "og:image:height",
              content: String(OG_IMAGE_HEIGHT),
            },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { property: "og:type", content: "website" },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { property: "og:site_name", content: SITE_NAME },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { property: "og:locale", content: SITE_LANGUAGE },
          },

          // ─── Twitter Card ────────────────────────────────────────────
          {
            tag: "meta",
            injectTo: "head",
            attrs: { name: "twitter:card", content: "summary_large_image" },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { name: "twitter:title", content: HOME_TITLE },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: {
              name: "twitter:description",
              content: HOME_DESCRIPTION,
            },
          },
          {
            tag: "meta",
            injectTo: "head",
            attrs: { name: "twitter:image", content: DEFAULT_OG_IMAGE },
          },

          // ─── Web App Manifest ────────────────────────────────────────
          {
            tag: "link",
            injectTo: "head",
            attrs: { rel: "manifest", href: "/site.webmanifest" },
          },

          // ─── JSON-LD Structured Data ─────────────────────────────────
          {
            tag: "script",
            injectTo: "head",
            attrs: { type: "application/ld+json" },
            children: jsonLd,
          },
        ],
      };
    },

    /** Generate sitemap.xml in the build output directory. */
    writeBundle(options) {
      if (!options.dir) return;
      const lastmod = new Date().toISOString().slice(0, 10);
      const xml = buildSitemapXml(lastmod);
      fs.writeFileSync(path.join(options.dir, "sitemap.xml"), xml, "utf8");
    },
  };
}
