# Google Ads and measurement

Production uses the user-supplied Google Ads base tag `AW-18513687675` and the existing official-site GA4 property `G-RRL9JLXCKK`. These are public tag identifiers, configured in Vercel Production. Google scripts load only after analytics consent. Contact fields never enter analytics events.

A confirmed webhook acceptance sends `evaluation_lead_submitted` and the standard GA4 `generate_lead` event. Direct thank-you visits do not count as leads. `click_to_call` records a phone-link click, not a connected call. Internal page views are recorded after consent, without query strings.

Choose one primary lead-conversion method to avoid counting a lead twice:

1. Link the existing GA4 property to Google Ads and import `generate_lead` as the primary lead conversion; or
2. Create a Website lead conversion in Google Ads and set its event label in `NEXT_PUBLIC_GOOGLE_ADS_LABEL`, then redeploy. The application sends `AW-18513687675/<label>` once per confirmed request with a transaction ID.

`NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL` optionally supports a separate click-to-call conversion. Keep it secondary unless calls are the intended primary outcome. Actual call-duration tracking requires separate Google Ads phone-call configuration.

Before campaign activation, submit a test request with contact information you control, confirm it arrives in LeadConnector, and check the conversion in Google Tag Assistant after accepting analytics. No live test lead is sent automatically by the repository's tests.

Campaign IDs are forwarded only through allowlisted URL fields across internal links. Without analytics consent, they are not stored in browser storage. The CRM receives the real form page and landing page paths separately, without arbitrary query parameters.
