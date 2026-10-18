import { createHmac, timingSafeEqual } from 'node:crypto';
import { leadIntegrationReady } from './config';
import type { Submission } from './lead-schema';

export class LeadError extends Error {
  constructor(
    public status: number,
    public publicMessage: string,
    public retryAfter?: number,
  ) {
    super(publicMessage);
  }
}
export function digest(value: string) {
  return createHmac('sha256', process.env.LEAD_HASH_SECRET!)
    .update(value)
    .digest('hex');
}
async function redis<T>(command: (string | number)[]): Promise<T> {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
    redirect: 'error',
  });
  if (!response.ok)
    throw new LeadError(
      503,
      'We couldn’t securely send your request. Please try again or call us.',
    );
  const data = (await response.json()) as { result: T; error?: string };
  if (data.error)
    throw new LeadError(
      503,
      'We couldn’t securely send your request. Please try again or call us.',
    );
  return data.result;
}
export async function checkRateLimit(source: string) {
  const script =
    "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n";
  const count = await redis<number>([
    'EVAL',
    script,
    1,
    `parisi:rate:${digest(source)}`,
  ]);
  if (count > 10)
    throw new LeadError(
      429,
      'Too many requests. Please wait 15 minutes or call the Horsham team.',
      900,
    );
}
export async function submitLead(input: Submission, source: string) {
  if (!leadIntegrationReady())
    throw new LeadError(
      503,
      'Online requests are temporarily unavailable. Please call 215-706-8260 to arrange an evaluation.',
    );
  await checkRateLimit(source);
  const { submissionId, ...fields } = input;
  const key = `parisi:lead:${submissionId}`;
  const payloadHash = digest(JSON.stringify(fields));
  const eventId = digest(`event:${submissionId}`).slice(0, 32);
  const existing = await redis<string | null>(['GET', key]);
  if (existing) {
    const record = JSON.parse(existing) as {
      hash: string;
      status: string;
      eventId: string;
    };
    if (record.hash !== payloadHash)
      throw new LeadError(
        409,
        'This request has changed. Refresh the page before submitting again.',
      );
    if (record.status === 'accepted')
      return { eventId: record.eventId, duplicate: true };
  }
  const lock = await redis<string | null>([
    'SET',
    `${key}:lock`,
    eventId,
    'NX',
    'EX',
    30,
  ]);
  if (!lock)
    throw new LeadError(
      409,
      'Your request is still being processed. Wait 30 seconds before trying again.',
      30,
    );
  try {
    // Bind the ID to a payload before delivery. Concurrent requests cannot change it.
    await redis([
      'SET',
      key,
      JSON.stringify({ hash: payloadHash, status: 'pending', eventId }),
      'NX',
      'EX',
      86400,
    ]);
    const current = JSON.parse(await redis<string>(['GET', key])) as {
      hash: string;
      status: string;
      eventId: string;
    };
    if (current.hash !== payloadHash)
      throw new LeadError(
        409,
        'This request has changed. Refresh the page before submitting again.',
      );
    if (current.status === 'accepted')
      return { eventId: current.eventId, duplicate: true };
    const payload = {
      event: 'evaluation_request',
      eventId,
      idempotencyKey: submissionId,
      source:
        input.attribution.gclid ||
        input.attribution.gbraid ||
        input.attribution.wbraid ||
        (input.attribution.utm_source === 'google' &&
          /^(cpc|ppc|paidsearch)$/.test(input.attribution.utm_medium || ''))
          ? 'Google Ads'
          : 'Website',
      campaign:
        input.attribution.campaign_id || input.attribution.utm_campaign || null,
      page: process.env.SITE_URL
        ? `${new URL(process.env.SITE_URL).origin}/`
        : '/',
      submittedAt: new Date().toISOString(),
      guardian: {
        name: input.guardianName,
        email: input.email,
        phone: input.phone,
      },
      athlete: { ageGroup: input.ageGroup, primarySport: input.sport || null },
      contactPreference: input.contactMethod,
      attribution: input.attribution,
      consent: {
        evaluationContact: true,
        analytics: input.analyticsConsent,
        smsMarketing: false,
        disclosureVersion: '2026-10-18',
      },
    };
    let accepted = false;
    try {
      const response = await fetch(process.env.CRM_WEBHOOK_URL!, {
        method: 'POST',
        redirect: 'error',
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': submissionId,
          ...(process.env.CRM_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });
      // The adapter contract requires a 2xx only after the downstream system accepts the lead.
      accepted = response.ok;
      await response.body?.cancel();
    } catch {
      /* Network failures are deliberately not logged with request data or URLs. */
    }
    if (!accepted)
      throw new LeadError(
        502,
        'We couldn’t confirm receipt of your request. Please retry or call 215-706-8260.',
      );
    await redis([
      'SET',
      key,
      JSON.stringify({ hash: payloadHash, status: 'accepted', eventId }),
      'EX',
      86400,
    ]);
    return { eventId, duplicate: false };
  } finally {
    // Preserve the request record on ambiguous delivery; retries reuse the downstream idempotency key.
    await redis(['DEL', `${key}:lock`]).catch(() => undefined);
  }
}
export function createReceipt(eventId: string) {
  const body = `${eventId}.${Date.now()}`;
  return `${body}.${digest(`receipt:${body}`)}`;
}
export function validReceipt(value: string | undefined): boolean {
  if (!value || !process.env.LEAD_HASH_SECRET) return false;
  const [id, timestamp, signature] = value.split('.');
  if (
    !/^[a-f0-9]{32}$/.test(id ?? '') ||
    !/^\d+$/.test(timestamp ?? '') ||
    !/^[a-f0-9]{64}$/.test(signature ?? '')
  )
    return false;
  const elapsed = Date.now() - Number(timestamp);
  if (elapsed < 0 || elapsed > 600000) return false;
  return timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest(`receipt:${id}.${timestamp}`)),
  );
}
