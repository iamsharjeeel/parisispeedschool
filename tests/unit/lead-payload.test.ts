import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildLeadPayload } from '../../src/lib/lead-payload';
import { attributionKeys, submissionSchema } from '../../src/lib/lead-schema';

const input = {
  guardianName: 'Test Guardian',
  email: 'test@example.com',
  phone: '+12155550123',
  ageGroup: '12–15',
  sport: 'Soccer',
  contactMethod: 'Email',
  consent: true,
  website: '',
  submissionId: '123e4567-e89b-42d3-a456-426614174000',
  analyticsConsent: false,
  attribution: {},
};

beforeEach(() => vi.unstubAllEnvs());

describe('LeadConnector JSON payload', () => {
  it('sends every visible form field by its original name at the top level', () => {
    const payload = buildLeadPayload(submissionSchema.parse(input), 'event-id');
    for (const key of [
      'guardianName',
      'email',
      'phone',
      'ageGroup',
      'sport',
      'contactMethod',
      'consent',
      'analyticsConsent',
    ] as const) {
      expect(payload[key]).toBe(input[key]);
    }
    expect(payload.submissionId).toBe(input.submissionId);
    expect(payload.idempotencyKey).toBe(input.submissionId);
    expect(payload.consentPreferences).toEqual({
      evaluationContact: true,
      analytics: false,
      smsMarketing: false,
      disclosureVersion: '2026-10-18',
    });
  });

  it('includes every attribution field and preserves supplied values', () => {
    const attribution = Object.fromEntries(
      attributionKeys.map((key) => [key, `synthetic-${key}`]),
    );
    const payload = buildLeadPayload(
      submissionSchema.parse({ ...input, attribution }),
      'event-id',
    );
    for (const key of attributionKeys)
      expect(payload[key]).toBe(attribution[key]);
    expect(payload.attribution).toEqual(attribution);
    expect(payload.source).toBe('Google Ads');
    expect(payload.campaign).toBe('synthetic-campaign_id');
  });

  it('represents missing attribution explicitly and preserves blank optional fields', () => {
    const payload = buildLeadPayload(
      submissionSchema.parse({
        ...input,
        sport: '',
        contactMethod: 'No preference',
      }),
      'event-id',
    );
    for (const key of attributionKeys) expect(payload[key]).toBeNull();
    expect(payload.sport).toBe('');
    expect(payload.contactMethod).toBe('No preference');
    expect(payload.source).toBe('Website');
    expect(payload.campaign).toBeNull();
  });

  it('excludes the honeypot and credentials from the transmitted JSON', () => {
    vi.stubEnv('CRM_WEBHOOK_URL', 'https://example.com/private-hook');
    vi.stubEnv('CRM_WEBHOOK_TOKEN', 'synthetic-private-token');
    const payload = buildLeadPayload(submissionSchema.parse(input), 'event-id');
    expect(payload).not.toHaveProperty('website');
    expect(JSON.stringify(payload)).not.toContain('private-hook');
    expect(JSON.stringify(payload)).not.toContain('synthetic-private-token');
  });

  it('includes a server timestamp and a query-free configured page origin', () => {
    vi.stubEnv('SITE_URL', 'https://campaign.example/path?email=private');
    const payload = buildLeadPayload(submissionSchema.parse(input), 'event-id');
    expect(payload.page).toBe('https://campaign.example/');
    expect(Number.isNaN(Date.parse(payload.submittedAt))).toBe(false);
    expect(payload.event).toBe('evaluation_request');
    expect(payload.eventId).toBe('event-id');
  });
});
