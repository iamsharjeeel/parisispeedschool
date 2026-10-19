import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/lead-schema';
import { createReceipt, LeadError, submitLead } from '@/lib/lead-service';
export const runtime = 'nodejs';
export const maxDuration = 30;
const maxBytes = 8192;
const response = (body: object, status: number) =>
  NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    // Next may use its bind hostname internally; the browser's same-origin Host is authoritative.
    const servedOrigin = `${process.env.VERCEL ? 'https:' : request.nextUrl.protocol}//${request.headers.get('host')}`;
    const allowed = [servedOrigin, process.env.SITE_URL].filter(Boolean);
    if (
      !origin ||
      !allowed.includes(origin) ||
      request.headers.get('sec-fetch-site') === 'cross-site'
    )
      return response({ error: 'Please submit from this website.' }, 403);
    if (!request.headers.get('content-type')?.startsWith('application/json'))
      return response({ error: 'Unsupported request format.' }, 415);
    if (Number(request.headers.get('content-length')) > maxBytes)
      return response({ error: 'Request is too large.' }, 413);
    const reader = request.body?.getReader();
    if (!reader)
      return response({ error: 'Enter your details and try again.' }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > maxBytes) {
        await reader.cancel();
        return response({ error: 'Request is too large.' }, 413);
      }
      chunks.push(value);
    }
    let raw: unknown;
    try {
      raw = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return response({ error: 'Enter your details and try again.' }, 400);
    }
    const parsed = submissionSchema.safeParse(raw);
    if (!parsed.success)
      return response(
        { error: 'Please check your details and try again.' },
        400,
      );
    const result = await submitLead(parsed.data);
    const res = response({ accepted: true, eventId: result.eventId }, 200);
    res.cookies.set('parisi_receipt', createReceipt(result.eventId), {
      httpOnly: true,
      secure:
        Boolean(process.env.VERCEL) || request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/thank-you',
      maxAge: 600,
    });
    return res;
  } catch (error) {
    if (error instanceof LeadError)
      return response({ error: error.publicMessage }, error.status);
    return response(
      {
        error:
          'We couldn’t securely send your request. Please try again or call 215-706-8260.',
      },
      503,
    );
  }
}
