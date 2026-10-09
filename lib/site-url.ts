// The site's public URL. Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the
// production domain, so this follows automatically once a custom domain is added.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://in-flu-ential.vercel.app";
