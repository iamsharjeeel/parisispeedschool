import { createHmac, timingSafeEqual } from 'node:crypto';
import { crmWebhookUrl, safeEndpoint } from './config';
import { buildLeadPayload } from './lead-payload';
import type { Submission } from './lead-schema';

export class LeadError extends Error {
  constructor(
    public status: number,
    public publicMessage: string,
  ) {
    super(publicMessage);
  }
}

// Signed receipts need no separate setting: derive a purpose-specific key from
// the private webhook capability URL. The URL never leaves server-side code.
export function digest(value: string) {
  const key = createHmac('sha256', crmWebhookUrl() || '')
    .update('parisi-lead-signing-v1')
    .digest('hex');
  return createHmac('sha256', key).update(value).digest('hex');
}

export async function submitLead(input: Submission) {
  const webhook = crmWebhookUrl();
  if (!safeEndpoint(webhook))
    throw new LeadError(
      503,
      'We couldn’t send your request. Please try again shortly.',
    );
  const eventId = digest(`event:${input.submissionId}`).slice(0, 32);
  try {
    const response = await fetch(webhook!, {
      method: 'POST',
      redirect: 'error',
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Idempotency-Key': input.submissionId,
      },
      body: JSON.stringify(buildLeadPayload(input, eventId)),
    });
    const accepted = response.ok;
    await response.body?.cancel();
    if (accepted) return { eventId };
  } catch {
    /* Keep webhook URLs and contact details out of logs. */
  }
  throw new LeadError(502, 'We couldn’t send your request. Please try again.');
}

export function createReceipt(eventId: string) {
  const body = `${eventId}.${Date.now()}`;
  return `${body}.${digest(`receipt:${body}`)}`;
}

export function validReceipt(value: string | undefined): boolean {
  if (!value || !safeEndpoint(crmWebhookUrl())) return false;
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
