# Current verification — October 20, 2026

The site uses the official Kanit/Inter font families, the supplied transparent logo without an added background, official coach portraits and short bios, a parent quote attributed to its publication on the official homepage, and links to current official pricing and scheduling.

## Automated checks

- Repository lint passes.
- 27 unit tests pass, including allowlisted campaign forwarding, malicious path rejection, separate landing/form source fields, public robots/sitemap, and webhook payload validation.
- All 22 browser/integration tests pass with the configured public Google tag IDs. They verify all page destinations, mobile navigation, form delivery against a local synthetic webhook, attribution across internal pages without analytics storage, consent-gated tag initialization, retries, errors, concurrency, legal pages, and accessible validation.
- The layout sweep covers eight routes at 11 widths from 320 to 1920px (88 combinations), with no horizontal overflow, off-screen buttons, or page JavaScript errors.
- All 16 axe scans (eight routes × mobile/desktop) report no WCAG A/AA violations. Mobile and desktop form inputs use 16px text and at least 48px height.
- Production-profile checks confirm index/follow metadata, a canonical production origin, crawlable robots, and ten sitemap URLs. Local/preview builds remain unindexed.

## Verification limits

The workspace network blocks the logo CDN and Google-hosted scripts. Browser integration tests isolate the Google SDK while asserting consent behavior and the actual GA4/Ads configuration calls. They verify the logo URL and transparent wrapper separately from locally hosted coach-image loading. Original CDN delivery and live vendor ingestion are not proven by those local tests.

Webhook tests use only synthetic contact details and a local fixture. The actual production webhook is configured in Vercel but no unsolicited live lead is sent. Confirm delivery with contact details you control before activating campaigns.

Performance measurements from the managed workspace are lab checks, not field Core Web Vitals. Remote logo failures affect the lab best-practices result. Review the public domain in PageSpeed Insights after release.
