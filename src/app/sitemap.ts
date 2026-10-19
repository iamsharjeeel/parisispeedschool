import type { MetadataRoute } from 'next';
import { siteIsPublic, siteUrl } from '@/lib/config';
import { pageLinks } from '@/lib/site-pages';
export default function sitemap(): MetadataRoute.Sitemap {
  return siteIsPublic()
    ? ['', ...pageLinks.map((page) => page.href), '/privacy', '/terms'].map(
        (path) => ({
          url: `${siteUrl()}${path || '/'}`,
          changeFrequency: 'monthly',
          priority:
            path === ''
              ? 1
              : path === '/athlete-evaluation'
                ? 0.9
                : path === '/privacy' || path === '/terms'
                  ? 0.3
                  : 0.8,
        }),
      )
    : [];
}
