# Lead adapter and measurement

## Delivery contract

`POST /api/leads` validates the JSON body, same-origin request, size (8 KiB maximum), honeypot, and consent. It rate-limits by a keyed source hash (10 validated requests / 15 minutes). Vercel's platform-overwritten `x-forwarded-for` is used on Vercel; local/unconfigured self-hosted requests share a conservative bucket. Configure a trusted source policy before non-Vercel hosting.

Server-only HTTPS `CRM_WEBHOOK_URL` receives JSON with optional `Authorization: Bearer …` and `Idempotency-Key: <submission UUID>`. It must return a 2xx **only after accepting the lead**. Redirects are refused; timeouts are 8 seconds. The browser receives only a generic error or `{ accepted: true, eventId }`.

The supplied LeadConnector inbound webhook is configured in ignored `.env.local` for this checkout. To enable it on Vercel, set **`CRM_WEBHOOK_URL`** to the supplied URL in Project Settings → Environment Variables and redeploy. The URL itself is not committed or exposed to the browser. Leave `CRM_WEBHOOK_TOKEN` empty unless the webhook explicitly requires additional bearer authentication. Redis and `LEAD_HASH_SECRET` remain required; a webhook URL alone does not enable unprotected collection.

All visible form fields use their original names at the top level for LeadConnector field mapping: `guardianName`, `email`, `phone`, `ageGroup`, `sport`, `contactMethod`, and `consent`. `analyticsConsent` and every supported campaign parameter are also included. Blank sport stays an empty string; absent campaign values are `null`. The hidden spam honeypot is validated locally/server-side and never forwarded. Map the email and phone fields to the workflow's contact fields and the remaining fields to the corresponding custom fields or workflow actions.

Payload example (synthetic data only):

```json
{
  "event": "evaluation_request",
  "eventId": "opaque-server-generated-id",
  "submissionId": "client-request-uuid",
  "idempotencyKey": "client-request-uuid",
  "guardianName": "Test Guardian",
  "email": "test@example.com",
  "phone": "2155550123",
  "ageGroup": "5–11",
  "sport": "Soccer",
  "contactMethod": "Email",
  "consent": true,
  "analyticsConsent": false,
  "gclid": "synthetic-click",
  "gbraid": null,
  "wbraid": null,
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "test-campaign",
  "utm_content": null,
  "utm_term": null,
  "campaign_id": "captured-campaign-id",
  "adgroup_id": null,
  "source": "Google Ads",
  "campaign": "captured-campaign-id",
  "page": "https://approved-campaign-domain.example/",
  "submittedAt": "ISO timestamp",
  "attribution": {
    "gclid": "synthetic-click",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "test-campaign",
    "campaign_id": "captured-campaign-id"
  },
  "consentPreferences": {
    "evaluationContact": true,
    "analytics": false,
    "smsMarketing": false,
    "disclosureVersion": "2026-10-18"
  }
}
```

Source is Google Ads when a Google ad click identifier is present or Google has a paid-search medium; other traffic is Website. Campaign values are not invented. The campaign page stored with the lead is the configured origin, not a visitor-controlled full URL.

## Idempotency and reliability

Upstash Redis REST stores an opaque request ID, keyed payload hash, event ID, and state for 24 hours. Atomic `SET NX` establishes a 30-second delivery lock. No raw lead fields are stored in Redis. Accepted submissions return their original event ID. A changed payload under an existing UUID is rejected. The UI keeps its UUID for retries of unchanged data.

**The receiving CRM adapter must durably honor `Idempotency-Key` for at least 24 hours.** An upstream timeout can occur after the CRM already accepted a lead, and a process can fail before recording acceptance. Retrying with the same key is safe only if the downstream adapter deduplicates. A generic GoHighLevel inbound webhook must not be assumed to do this; use an approved middleware adapter if its native endpoint lacks that guarantee. Set `CRM_IDEMPOTENCY_CONFIRMED=true` only after testing this behavior. No claim of exactly-once delivery across arbitrary third parties is made.

This implementation fails closed when Redis or the CRM is unavailable. It does not queue a discarded request or display a false success. Operational availability should be monitored using provider tools without logging personal data. The local fixture tests this contract, not a real GHL/Redis account.

## Confirmed success

After confirmed delivery, the API issues a signed, HttpOnly, SameSite=Lax receipt cookie for `/thank-you` lasting 10 minutes (Secure over HTTPS). The thank-you page verifies the signature and time; a direct visit without a receipt shows a neutral request prompt. The page never claims a booking. No conversion is fired on thank-you page views or refreshes.

## Consent and analytics

Configure **GTM or direct gtag**, not both. Tags load only after explicit analytics permission. Consent defaults deny analytics, ad storage, user-data transmission, and ad personalization. Permission allows analytics/ad measurement storage; `ad_user_data` and `ad_personalization` stay denied. Declining never blocks the form. Preference persists 180 days, with a footer control to change it; revocation updates Consent Mode, clears recognizable first-party Google cookies, clears attribution, and reloads to remove loaded scripts. Third-party cookies remain governed by browser/provider controls.

Events: `primary_cta_click`, `click_to_call`, `form_start`, `form_validation_error`, `evaluation_lead_submitted`. The primary event fires only after the server confirms CRM acceptance and only with analytics consent. A session-storage event marker deduplicates it. The event ID is also the direct Ads `transaction_id`. No guardian/athlete data or click IDs are attached to analytics events; conversion tracking can be unavailable when visitors block storage, scripts, or connectivity.

For GTM, create one Custom Event trigger named `evaluation_lead_submitted`, map `event_id` to the Ads transaction ID, and avoid also importing the same GA4 event as a second primary Ads conversion. Require consent for every tag. Use a **sanitized page URL** variable containing origin plus pathname, not the full URL, and clear referrer/query fields. Disable automatic form interactions and user-provided-data collection. Review every GTM tag: a container is arbitrary executable code, and the site cannot make a misconfigured third-party container privacy-safe. Set `ANALYTICS_APPROVED=true` only after this review.

For direct GA4, automatic `config` receives a query-free `page_location` and blank referrer. Disable automatic form-interaction measurement and any overlapping automatic events in the GA4 property. Direct Ads needs both the ID and conversion label; the primary event is sent after acceptance using the same transaction ID.

Enhanced conversions are deliberately **not activated**. Adding them requires separate business/legal approval, explicit user-data consent, appropriate normalization/hashing, and Google policy review. There is no raw-PII analytics hook to accidentally enable.

## Attribution retention

Accepted parameters: `gclid`, `gbraid`, `wbraid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `campaign_id`, `adgroup_id`. With analytics consent, the most recent tagged page is retained in first-party session storage up to 30 minutes. Without consent, only parameters present on the current form page are sent with that request and are not persisted by the site. Lead retention after delivery belongs to the business's approved CRM policy.
