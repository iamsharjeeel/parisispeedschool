import { beforeEach, describe, expect, it, vi } from 'vitest';
import { leadSchema, submissionSchema } from '../../src/lib/lead-schema';
import { safeEndpoint } from '../../src/lib/config';
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
  vi.stubEnv(
    'LEAD_HASH_SECRET',
    'test-only-hash-secret-never-use-in-production',
  );
});
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
      submitLead(submissionSchema.parse(valid), 'local'),
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
