import { afterEach, describe, expect, it, vi } from 'vitest';
import { siteIsPublic } from '../../src/lib/config';
import robots from '../../src/app/robots';
import sitemap from '../../src/app/sitemap';

afterEach(() => vi.unstubAllEnvs());
describe('public campaign destinations', () => {
  it('allows crawling and includes all internal destinations for the public production URL', () => {
    vi.stubEnv('SITE_URL', 'https://parisispeedschool.vercel.app');
    vi.stubEnv('SITE_PUBLIC', 'true');
    expect(siteIsPublic()).toBe(true);
    expect(robots().rules).toMatchObject({ userAgent: '*', allow: '/' });
    expect(sitemap().map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        'https://parisispeedschool.vercel.app/',
        'https://parisispeedschool.vercel.app/athlete-evaluation',
        'https://parisispeedschool.vercel.app/coaching',
      ]),
    );
    expect(sitemap()).toHaveLength(10);
  });
  it('keeps previews unindexed when a production origin is available but publication is off', () => {
    vi.stubEnv('SITE_URL', 'https://parisispeedschool.vercel.app');
    vi.stubEnv('SITE_PUBLIC', 'false');
    vi.stubEnv('LAUNCH_APPROVED', 'false');
    expect(siteIsPublic()).toBe(false);
    expect(robots().rules).toMatchObject({ disallow: '/' });
    expect(sitemap()).toEqual([]);
  });
});
