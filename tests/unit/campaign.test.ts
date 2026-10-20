import { describe, expect, it } from 'vitest';
import { campaignHref, safePagePath } from '../../src/lib/campaign';
import { submissionSchema } from '../../src/lib/lead-schema';
import { buildLeadPayload } from '../../src/lib/lead-payload';

describe('campaign navigation', () => {
  it('keeps click IDs and the original landing path across multiple internal pages', () => {
    const first = campaignHref(
      '/coaching',
      new URLSearchParams('gclid=click&utm_campaign=spring&email=private'),
      '/speed-agility',
    );
    const next = new URL(first, 'https://example.com');
    expect(next.searchParams.get('gclid')).toBe('click');
    expect(next.searchParams.get('landing_path')).toBe('/speed-agility');
    expect(next.searchParams.has('email')).toBe(false);
    const final = new URL(
      campaignHref(
        '/athlete-evaluation#evaluation',
        next.searchParams,
        '/coaching',
      ),
      'https://example.com',
    );
    expect(final.searchParams.get('landing_path')).toBe('/speed-agility');
    expect(final.searchParams.get('gclid')).toBe('click');
    expect(final.hash).toBe('#evaluation');
  });
  it('keeps organic links clean and does not forward campaign data to external sites', () => {
    expect(campaignHref('/coaching', new URLSearchParams(), '/')).toBe(
      '/coaching',
    );
    expect(
      campaignHref(
        'https://other.example/',
        new URLSearchParams('gclid=click'),
        '/',
      ),
    ).toBe('https://other.example/');
    expect(
      campaignHref('#evaluation', new URLSearchParams('gclid=click'), '/'),
    ).toBe('#evaluation');
  });
  it('rejects external, query-bearing, and malformed page paths', () => {
    for (const value of [
      '//other.example/',
      'https://other.example/',
      '/?email=private',
      '/x#fragment',
      '/x\\y',
    ])
      expect(safePagePath(value)).toBeUndefined();
  });
  it('records the real form page and original landing page separately', () => {
    const input = submissionSchema.parse({
      guardianName: 'Test Guardian',
      email: 'test@example.com',
      phone: '2155550123',
      ageGroup: '5–11',
      sport: 'Soccer',
      consent: true,
      website: '',
      submissionId: '123e4567-e89b-42d3-a456-426614174000',
      attribution: { gclid: 'click' },
      analyticsConsent: false,
      pagePath: '/athlete-evaluation',
      landingPath: '/speed-agility',
    });
    const result = buildLeadPayload(input, 'event-id');
    expect(result.page).toMatch(/\/athlete-evaluation$/);
    expect(result.landingPage).toMatch(/\/speed-agility$/);
    expect(result.gclid).toBe('click');
  });
});
