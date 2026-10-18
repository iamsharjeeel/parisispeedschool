import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/config';
export default function robots(): MetadataRoute.Robots {
  const launched = process.env.LAUNCH_APPROVED === 'true' && Boolean(siteUrl());
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
