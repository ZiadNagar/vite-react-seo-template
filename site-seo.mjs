/**
 * site-seo.mjs — Single source of truth for all SEO configuration.
 *
 * This file is consumed by:
 *   1. The Vite plugin (build-time injection into index.html + sitemap.xml)
 *   2. The React app (runtime per-route SEO via re-export in src/seo/config.js)
 *
 * HOW TO USE:
 *   Replace every YOUR_* placeholder with your actual values.
 *   Keep ROUTE_SEO keys in sync with your react-router-dom route paths.
 */

// ─── Site Identity ───────────────────────────────────────────────────────────

/** Production origin — no trailing slash. e.g. "https://example.com" */
export const SITE_ORIGIN = "https://YOUR_PRODUCTION_DOMAIN";

/** Brand / company name. Used in og:site_name, JSON-LD schema name, etc. */
export const SITE_NAME = "YOUR_SITE_NAME";

/** Short brand name for mobile labels (web manifest, etc.). e.g. "Acme" */
export const SITE_SHORT_NAME = "YOUR_SHORT_NAME";

/** One-line slogan or tagline for Organization JSON-LD. */
export const ORG_SLOGAN = "YOUR_SITE_SLOGAN_OR_TAGLINE";

/** Default language code for <html lang>. e.g. "en", "en-US", "ar". */
export const SITE_LANGUAGE = "en";

/** Site author for meta author tag. e.g. "Acme Corp" */
export const SITE_AUTHOR = "YOUR_SITE_AUTHOR";

// ─── Open Graph / Social Images ──────────────────────────────────────────────

/** Absolute URL to the default Open Graph share image. */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

/** OG image dimensions in pixels. */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Absolute URL to the Organization logo for JSON-LD. */
export const SITE_LOGO_URL = `${SITE_ORIGIN}/logo.png`;

// ─── Keywords ────────────────────────────────────────────────────────────────

/**
 * Global keywords applied to every page.
 * These populate the <meta name="keywords"> tag on all routes.
 * Per-route keywords (below) are merged with these.
 */
export const SITE_KEYWORDS = [
  "your primary keyword",
  "your secondary keyword",
  "your industry term",
  "your brand name",
];

// ─── Geo / Local SEO ────────────────────────────────────────────────────────

/** ISO 3166-2 region code. e.g. "US-NY", "GB-LND", omit if not applicable. */
export const GEO_REGION = "YOUR_COUNTRY_REGION";

/** City or placename. e.g. "New York", omit if not applicable. */
export const GEO_PLACENAME = "YOUR_CITY";

/** Latitude;longitude as a string. e.g. "40.7128;-74.0060", omit if not applicable. */
export const GEO_POSITION = "YOUR_LATITUDE;YOUR_LONGITUDE";

// ─── Social Profiles (for JSON-LD sameAs) ───────────────────────────────────

/**
 * Social media profile URLs. Each entry becomes a "sameAs" item
 * in the Organization JSON-LD schema.
 */
export const SOCIAL_PROFILES = [
  { platform: "LinkedIn", url: "https://linkedin.com/company/YOUR_LINKEDIN" },
  { platform: "Twitter", url: "https://twitter.com/YOUR_TWITTER" },
  { platform: "Facebook", url: "https://facebook.com/YOUR_FACEBOOK" },
  { platform: "Instagram", url: "https://instagram.com/YOUR_INSTAGRAM" },
  { platform: "YouTube", url: "https://youtube.com/@YOUR_YOUTUBE" },
];

// ─── Contact Information (for JSON-LD ContactPoint) ─────────────────────────

/** Customer service phone with country code. e.g. "+1-800-555-0100" */
export const CONTACT_PHONE = "+1-YOUR-PHONE-NUMBER";

/** Customer service email. e.g. "support@example.com" */
export const CONTACT_EMAIL = "YOUR_CONTACT_EMAIL";

// ─── Site Verification ──────────────────────────────────────────────────────

/** Google Search Console verification code (from HTML tag method). */
export const VERIFICATION_GOOGLE = "YOUR_GOOGLE_VERIFICATION_CODE";

/** Bing Webmaster Tools verification code. */
export const VERIFICATION_BING = "YOUR_BING_VERIFICATION_CODE";

/** Pinterest verification code (if applicable). */
export const VERIFICATION_PINTEREST = "YOUR_PINTEREST_VERIFICATION_CODE";

// ─── Sitelinks Searchbox ────────────────────────────────────────────────────

/**
 * URL template for the site's internal search.
 * Use {search_term_string} as the placeholder — Google replaces it.
 * e.g. "https://example.com/search?q={search_term_string}"
 * Set to null to disable Sitelinks Searchbox JSON-LD.
 */
export const SEARCH_ACTION_URL =
  "https://YOUR_PRODUCTION_DOMAIN/search?q={search_term_string}";

// ─── Per-Route SEO ──────────────────────────────────────────────────────────

/**
 * Route SEO configuration.
 * Keys MUST match your react-router-dom route paths (no trailing slash).
 * Each entry: { title, description, keywords?, breadcrumb }
 *
 * - title: Page title (shown in browser tab + search results)
 * - description: Meta description (shown in search results snippet)
 * - keywords: Route-specific keywords (merged with SITE_KEYWORDS)
 * - breadcrumb: Label used in BreadcrumbList JSON-LD
 */
export const ROUTE_SEO = {
  "/": {
    title: "YOUR_SITE_NAME | Home",
    description:
      "A concise description of your site's primary value proposition. This appears in search engine results and social media previews.",
    keywords: ["home", "landing page", "your brand"],
    breadcrumb: "Home",
  },
  "/about": {
    title: "YOUR_SITE_NAME | About",
    description:
      "Learn about our mission, team, and what drives us to deliver exceptional results.",
    keywords: ["about us", "mission", "team", "company"],
    breadcrumb: "About",
  },
  "/services": {
    title: "YOUR_SITE_NAME | Services",
    description:
      "Explore our full range of professional services designed to help you succeed.",
    keywords: ["services", "solutions", "consulting", "professional services"],
    breadcrumb: "Services",
  },
  "/products": {
    title: "YOUR_SITE_NAME | Products",
    description:
      "Discover our product suite built with cutting-edge technology to solve real-world problems.",
    keywords: ["products", "software", "platform", "tools"],
    breadcrumb: "Products",
  },
  "/blog": {
    title: "YOUR_SITE_NAME | Blog",
    description:
      "Insights, news, and expert perspectives on industry trends and best practices.",
    keywords: ["blog", "insights", "news", "articles", "thought leadership"],
    breadcrumb: "Blog",
  },
};

// ─── Derived Home Values (used by Vite plugin) ──────────────────────────────

export const HOME_TITLE = ROUTE_SEO["/"].title;
export const HOME_DESCRIPTION = ROUTE_SEO["/"].description;
export const HOME_KEYWORDS = ROUTE_SEO["/"].keywords ?? SITE_KEYWORDS;

// ─── Sitemap Entries ────────────────────────────────────────────────────────

/**
 * Indexable routes for sitemap.xml generation.
 * Only include pages that should appear in search results.
 * - changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
 * - priority: "0.0" to "1.0" (relative importance within your site)
 */
export const SITEMAP_ENTRIES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/products", changefreq: "monthly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the absolute URL for a given route path.
 * Home ("/") gets a trailing slash; other paths do not.
 */
export function pageLoc(path) {
  if (path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path}`;
}