import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { leadSchema, submissionSchema } from '../../src/lib/lead-schema';
import { crmWebhookUrl, safeEndpoint } from '../../src/lib/config';
import {
  createReceipt,
  validReceipt,
  submitLead,
} from '../../src/lib/lead-service';
const valid = {
  guardianName: 'Test Guardian',
  email: 'TEST@example.com',
  phone: '(215) 555-0123',
  ageGroup: '5–11',
  sport: 'Soccer',
  contactMethod: 'Email',
  consent: true,
  website: '',
  submissionId: '123e4567-e89b-42d3-a456-426614174000',
  attribution: { gclid: 'synthetic-click' },
  analyticsConsent: false,
};
beforeEach(() => {
  vi.unstubAllEnvs();
  for (const key of [
    'CRM_WEBHOOK_URL',
    'crm_webhook_url',
    'crm_webook_url',
    'CRM_WEBOOK_URL',
  ])
    vi.stubEnv(key, '');
  vi.stubEnv('CRM_WEBHOOK_URL', 'https://crm.example.com/private-hook');
});
afterEach(() => vi.unstubAllGlobals());
describe('Lead validation', () => {
  it('normalizes contact input and accepts the documented fields', () => {
    const result = submissionSchema.parse({
      ...valid,
      guardianName: ' Test Guardian ',
      email: ' TEST@example.com ',
    });
    expect(result.guardianName).toBe('Test Guardian');
    expect(result.email).toBe('test@example.com');
  });
  it.each(['guardianName', 'email', 'phone', 'ageGroup'])(
    'rejects missing required %s',
    (key) => {
      expect(leadSchema.safeParse({ ...valid, [key]: '' }).success).toBe(false);
    },
  );
  it('rejects honeypots, unconsented contact, excess attribution, and injected fields', () => {
    for (const extra of [
      { website: 'spam' },
      { consent: false },
      { guardianName: '<script>bad</script>' },
      { attribution: { email: 'private@example.com' } },
      { childName: 'Unnecessary' },
    ])
      expect(submissionSchema.safeParse({ ...valid, ...extra }).success).toBe(
        false,
      );
  });
  it('rejects too-long data and invalid phone characters', () => {
    expect(
      leadSchema.safeParse({ ...valid, sport: 'x'.repeat(81) }).success,
    ).toBe(false);
    expect(
      leadSchema.safeParse({ ...valid, phone: 'abcd2155550123' }).success,
    ).toBe(false);
  });
});
describe('Safety boundaries', () => {
  it('accepts HTTPS integrations, rejecting insecure and loopback endpoints', () => {
    expect(safeEndpoint('https://crm.example.com/lead')).toBe(true);
    for (const value of [
      'http://crm.example.com',
      'https://localhost/x',
      'https://127.0.0.1',
      'https://192.168.1.1',
      'https://user:pass@crm.example.com',
      'not a URL',
    ])
      expect(safeEndpoint(value)).toBe(false);
  });
  it('never allows local test mode on Vercel', () => {
    vi.stubEnv('LOCAL_INTEGRATION_TEST', 'true');
    vi.stubEnv('VERCEL', '1');
    expect(safeEndpoint('http://127.0.0.1:4319')).toBe(false);
  });
  it('fails closed if delivery is unconfigured', async () => {
    vi.stubEnv('CRM_WEBHOOK_URL', '');
    await expect(
      submitLead(submissionSchema.parse(valid)),
    ).rejects.toMatchObject({ status: 503 });
  });
  it('verifies signed receipts and rejects tampering and expiration', () => {
    const receipt = createReceipt('a'.repeat(32));
    expect(validReceipt(receipt)).toBe(true);
    expect(validReceipt(receipt.replace(/^a/, 'b'))).toBe(false);
    expect(validReceipt('')).toBe(false);
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 601000);
    expect(validReceipt(receipt)).toBe(false);
  });
});

describe('Direct webhook delivery', () => {
  it.each([
    'CRM_WEBHOOK_URL',
    'crm_webhook_url',
    'crm_webook_url',
    'CRM_WEBOOK_URL',
  ])('submits with only %s configured', async (key) => {
    vi.stubEnv('CRM_WEBHOOK_URL', '');
    vi.stubEnv(key, 'https://crm.example.com/private-hook');
    const send = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', send);
    const result = await submitLead(submissionSchema.parse(valid));
    expect(result.eventId).toMatch(/^[a-f0-9]{32}$/);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toBe(crmWebhookUrl());
    expect(send.mock.calls[0][1].method).toBe('POST');
    expect(JSON.parse(send.mock.calls[0][1].body)).toMatchObject({
      guardianName: valid.guardianName,
      email: 'test@example.com',
      phone: valid.phone,
      ageGroup: valid.ageGroup,
      sport: valid.sport,
      contactMethod: valid.contactMethod,
      consent: true,
    });
    expect(validReceipt(createReceipt(result.eventId))).toBe(true);
  });
  it('reports failed delivery and allows an immediate retry', async () => {
    const send = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', send);
    await expect(
      submitLead(submissionSchema.parse(valid)),
    ).rejects.toMatchObject({ status: 502 });
    await expect(
      submitLead(submissionSchema.parse(valid)),
    ).resolves.toHaveProperty('eventId');
    expect(send).toHaveBeenCalledTimes(2);
  });
});
