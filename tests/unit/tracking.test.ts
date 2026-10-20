import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { track } from '../../src/lib/tracking';

beforeEach(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal('window', { dataLayer: [] });
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ allowed: true, at: Date.now() }),
  });
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  vi.stubEnv('NEXT_PUBLIC_GTM_ID', undefined);
  vi.stubEnv('NEXT_PUBLIC_GA4_ID', undefined);
  vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_ID', undefined);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('confirmed lead dataLayer events', () => {
  it('pushes the confirmed event without any tag environment variables', () => {
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    expect(window.dataLayer).toEqual([
      { event: 'evaluation_lead_submitted', event_id: 'accepted-lead' },
    ]);
  });
  it('deduplicates by the server event ID and requires that ID', () => {
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    track('evaluation_lead_submitted');
    expect(window.dataLayer).toHaveLength(1);
  });
  it('does not emit a conversion without analytics consent', () => {
    vi.stubGlobal('localStorage', { getItem: () => null });
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    expect(window.dataLayer).toEqual([]);
  });
  it('emits once per accepted ID when deduplication storage reads fail', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
    });
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    track('evaluation_lead_submitted', { event_id: 'another-lead' });
    expect(window.dataLayer).toEqual([
      { event: 'evaluation_lead_submitted', event_id: 'accepted-lead' },
      { event: 'evaluation_lead_submitted', event_id: 'another-lead' },
    ]);
  });
  it('emits once when deduplication storage writes fail', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => null,
      setItem: () => { throw new Error('quota'); },
    });
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    expect(window.dataLayer).toHaveLength(1);
  });
  it('does not mark a lead before the event is successfully queued', () => {
    window.dataLayer = [];
    vi.spyOn(window.dataLayer, 'push').mockImplementationOnce(() => {
      throw new Error('queue unavailable');
    });
    expect(() => track('evaluation_lead_submitted', { event_id: 'accepted-lead' })).toThrow();
    track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
    expect(window.dataLayer).toHaveLength(1);
  });
  it.each([null, { allowed: false, at: Date.now() }, { allowed: true, at: 0 }])(
    'requires current consent even if sessionStorage is blocked (%j)', (choice) => {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(choice) });
      vi.stubGlobal('sessionStorage', { getItem: () => { throw new Error('blocked'); } });
      track('evaluation_lead_submitted', { event_id: 'accepted-lead' });
      expect(window.dataLayer).toEqual([]);
    },
  );
});
