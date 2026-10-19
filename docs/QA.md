# Current validation and handoff

## Direct webhook form — October 19, 2026

The form uses one setting: `CRM_WEBHOOK_URL`, or the existing `crm_webook_url` spelling. `crm_webhook_url` and `CRM_WEBOOK_URL` also work. No Redis, database, queue, token, or signing-secret configuration is needed. These requirements supersede the earlier infrastructure setup.

The form button is always available except while sending. The unavailable banner and server-configuration prop were removed. Each valid request is sent immediately as a server-side JSON POST with all form fields, attribution, consent metadata, and a submission identifier. No counter or lock prevents a valid submission. Failure responses allow immediate retry; only webhook acceptance produces a success receipt.

TypeScript, lint, the production build, and 21 unit tests passed. All 17 browser/integration tests passed in 40.2 seconds against a synthetic webhook with only the user's lowercase `crm_webook_url` setting. It checks full JSON delivery, the absence of the unavailable banner, more than ten consecutive submissions, concurrent submissions, retry after failure, timeout behavior, mobile layouts, consent, accessibility, and signed thank-you receipts without extra environment variables. See the latest committed browser results.

The webhook URL remains excluded from Git and public browser files. Live webhook receipt cannot be confirmed from this cloud machine because its network policy blocks the host; this cloud restriction does not apply to the user's Vercel deployment. No real test lead was sent.

## Other project status

The source is on `feat/parisi-evaluation-landing`. Redeploy that branch's latest commit in Vercel. The existing webhook environment variable must belong to the scope being deployed (Preview or Production). The previously empty `main` branch remains a review baseline until merged.

Screenshots are in `artifacts/final-1440.png`, `artifacts/final-375.png`, and the viewport images. The previous local Lighthouse measurement was Performance 94, Accessibility 100, Best Practices 100, SEO 63 with intentional review noindex; LCP 3.1s and CLS 0. This measurement predates the form simplification and is not a fresh performance claim.

Genuine approved training photos/logo assets, final domain, business/privacy review, and optional analytics account checks remain separate campaign-publication work. They do not disable the evaluation form. No live-domain change or advertising activation was performed. The draft PR could not be created because the cloud network policy denied GitHub API access; the source branch is pushed for review.
