import type { MetadataRoute } from 'next';
import { siteIsPublic, siteUrl } from '@/lib/config';
export default function robots(): MetadataRoute.Robots {
  const launched = siteIsPublic();
  return {
    rules: {
      userAgent: '*',
      ...(launched
        ? { allow: '/', disallow: ['/api/', '/thank-you'] }
        : { disallow: '/' }),
    },
    ...(launched ? { sitemap: `${siteUrl()}/sitemap.xml` } : {}),
  };
}
