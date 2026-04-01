import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_OG_IMAGE,
  GEO_PLACENAME,
  GEO_POSITION,
  GEO_REGION,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  ROUTE_SEO,
  SITE_AUTHOR,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_LANGUAGE,
} from "@/seo/config";

function pageUrl(pathname) {
  if (pathname === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${pathname}`;
}

export default function RouteSeo() {
  const { pathname } = useLocation();
  const pathKey = pathname.replace(/\/$/, "") || "/";
  const seo = ROUTE_SEO[pathKey] ?? ROUTE_SEO["/"];
  const url = pageUrl(pathKey);

  // Merge global + per-route keywords, deduplicated
  const routeKeywords = seo.keywords ?? [];
  const allKeywords = [...new Set([...SITE_KEYWORDS, ...routeKeywords])];

  const webPageJsonLd = {
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url,
    inLanguage: SITE_LANGUAGE,
    ...(allKeywords.length > 0 && { keywords: allKeywords.join(", ") }),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
    },
  };

  const graph = [webPageJsonLd];

  if (pathKey !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_ORIGIN}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: seo.breadcrumb,
          item: url,
        },
      ],
    });
  }

  const linkedData = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <Helmet prioritizeSeoTags>
      {/* Core SEO */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={allKeywords.join(", ")} />
      <meta name="author" content={SITE_AUTHOR} />
      <link rel="canonical" href={url} />

      {/* Geo / Local SEO */}
      {GEO_REGION && <meta name="geo.region" content={GEO_REGION} />}
      {GEO_PLACENAME && <meta name="geo.placename" content={GEO_PLACENAME} />}
      {GEO_POSITION && (
        <>
          <meta name="geo.position" content={GEO_POSITION} />
          <meta name="ICBM" content={GEO_POSITION} />
        </>
      )}

      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={SITE_LANGUAGE} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(linkedData)}</script>
    </Helmet>
  );
}
