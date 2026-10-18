import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/config';
export default function sitemap(): MetadataRoute.Sitemap {
  return process.env.LAUNCH_APPROVED === 'true' && siteUrl()
    ? ['', '/privacy', '/terms'].map((path) => ({
        url: `${siteUrl()}${path}`,
        changeFrequency: 'monthly',
        priority: path ? 0.3 : 1,
      }))
    : [];
}
