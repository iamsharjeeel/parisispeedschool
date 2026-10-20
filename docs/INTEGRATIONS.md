# Lead adapter and measurement

## Delivery contract

The form sends a direct server-side JSON POST to the private webhook. **Only one environment variable is needed:** `CRM_WEBHOOK_URL`. Existing `crm_webook_url`, `crm_webhook_url`, and `CRM_WEBOOK_URL` spellings are also accepted, with the canonical uppercase name taking precedence.

There is no Redis, database, queue, rate-limit service, bearer-token requirement, or separate signing-secret setting. The submit button is enabled and only disables while sending. Normal field validation still applies. The server retains request validation, a size limit, same-origin checks, and the hidden spam trap.

The webhook gets `Content-Type: application/json`, `Accept: application/json`, and `Idempotency-Key: <submission UUID>`. Only a successful webhook HTTP response produces the thank-you flow. Failed deliveries display an error and permit immediate retry. Requests are not silently discarded or reported as successful.

In Vercel, keep the supplied webhook URL in the variable already configured, select the deployment's environment scope, and redeploy the latest feature-branch commit. The private URL is not committed or included in browser code.

All visible form fields use their original names at the top level for LeadConnector field mapping: `guardianName`, `email`, `phone`, `ageGroup`, `sport`, and `consent`. `analyticsConsent` and every supported campaign parameter are also included. Blank sport stays an empty string; absent campaign values are `null`. The hidden spam honeypot is validated locally/server-side and never forwarded. Map the email and phone fields to the workflow's contact fields and the remaining fields to the corresponding custom fields or workflow actions.

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

## Delivery behavior

Each valid submission is forwarded immediately to the webhook. There are no infrastructure locks, counters, or storage prerequisites. The browser prevents double-clicks while a request is in flight, and keeps the submission identifier for retries. Deduplication across requests, if desired, belongs to the receiving workflow using that identifier; the application does not claim exactly-once delivery. A network timeout can leave receipt uncertain, and the error allows the visitor to retry.

## Confirmed success

After confirmed delivery, the API issues a signed, HttpOnly, SameSite=Lax receipt cookie for `/thank-you` lasting 10 minutes (Secure over HTTPS). The signing key is derived on the server from the private webhook URL; no additional environment variable is needed. The thank-you page verifies the signature and time; a direct visit without a receipt shows a neutral request prompt. The page never claims a booking. No conversion is fired on thank-you page views or refreshes.

## Consent and analytics

Configure **GTM or direct gtag**, not both. Tags load only after explicit analytics permission. Consent defaults deny analytics, ad storage, user-data transmission, and ad personalization. Permission allows analytics/ad measurement storage; `ad_user_data` and `ad_personalization` stay denied. Declining never blocks the form. Preference persists 180 days, with a footer control to change it; revocation updates Consent Mode, clears recognizable first-party Google cookies, clears attribution, and reloads to remove loaded scripts. Third-party cookies remain governed by browser/provider controls.

Events: `primary_cta_click`, `click_to_call`, `form_start`, `form_validation_error`, `evaluation_lead_submitted`. The primary event fires only after the server confirms CRM acceptance and only with analytics consent. A session-storage event marker deduplicates it. The event ID is also the direct Ads `transaction_id`. No guardian/athlete data or click IDs are attached to analytics events; conversion tracking can be unavailable when visitors block storage, scripts, or connectivity.

For GTM, create one Custom Event trigger named `evaluation_lead_submitted`, map `event_id` to the Ads transaction ID, and avoid also importing the same GA4 event as a second primary Ads conversion. Require consent for every tag. Use a **sanitized page URL** variable containing origin plus pathname, not the full URL, and clear referrer/query fields. Disable automatic form interactions and user-provided-data collection. Review every GTM tag: a container is arbitrary executable code, and the site cannot make a misconfigured third-party container privacy-safe. Current direct-tag setup is documented in `docs/ADS-SETUP.md`.

For direct GA4, automatic `config` receives a query-free `page_location` and blank referrer. Disable automatic form-interaction measurement and any overlapping automatic events in the GA4 property. Direct Ads needs both the ID and conversion label; the primary event is sent after acceptance using the same transaction ID.

Enhanced conversions are deliberately **not activated**. Adding them requires separate business/legal approval, explicit user-data consent, appropriate normalization/hashing, and Google policy review. There is no raw-PII analytics hook to accidentally enable.

## Attribution retention

Accepted parameters: `gclid`, `gbraid`, `wbraid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `campaign_id`, `adgroup_id`. With analytics consent, the most recent tagged page is retained in first-party session storage up to 30 minutes. Without consent, allowlisted parameters travel in internal links rather than browser storage. The request records the form path and original landing path separately; other query fields are not forwarded. Lead retention after delivery belongs to the business's approved CRM policy.
