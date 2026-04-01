import { Helmet } from "react-helmet-async";

export default function NotFoundSeo() {
  return (
    <Helmet prioritizeSeoTags>
      <title>Page Not Found | YOUR_SITE_NAME</title>
      <meta
        name="description"
        content="The page you are looking for does not exist or has been moved."
      />
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}