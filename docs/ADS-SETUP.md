# Google Tag Manager and measurement

The only installed container is `GTM-KP59SXS6`, using the official head loader and body noscript iframe on every page. Previous direct Google Ads and GA4 installations are removed. Neither installation nor the site's dataLayer events relies on tag environment variables.

Consent defaults deny analytics/ad storage, ad user data, and personalization before GTM loads. Accepting analytics updates measurement storage to granted; ad user data and personalization stay denied. Attribution and form submissions continue to work without analytics consent.

After the CRM webhook accepts a lead, the site pushes `evaluation_lead_submitted` with the server `event_id` to `window.dataLayer`, subject to analytics consent. The same event ID is suppressed on repeat attempts and receipt-page refreshes. Rejected submissions and direct thank-you visits do not count.

Configure the Google Ads/GA4 tags inside this GTM container using the `evaluation_lead_submitted` Custom Event trigger. Use `event_id` as the Ads transaction ID and avoid counting both a direct Ads conversion and an imported GA4 conversion as primary for the same lead. Require consent for each tag.

GCLID and allowlisted UTM/campaign parameters remain attached to the CRM request. Browser attribution storage remains consent-controlled. No contact or athlete details are included in site analytics events.
