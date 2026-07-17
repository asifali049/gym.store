import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fitnessplatform.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/checkout', '/account'] },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
