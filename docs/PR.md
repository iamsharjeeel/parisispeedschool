# Proposed pull request

**Title:** Build Parisi Horsham evaluation campaign page for Vercel

Parisi Horsham needs a dedicated advertising destination for free athlete evaluation requests. This adds a responsive Next.js landing page, parent/guardian form, secure server-side CRM adapter, shared rate limiting and idempotency, signed thank-you receipts, consent-gated measurement hooks, and configurable SEO/business metadata. Vercel review deployments build without credentials; unconfigured submissions fail closed and public launch requires explicit approval flags and real assets.

Validation: clean npm install, lint, strict TypeScript, production build, 11 unit tests, and 18 production-browser/integration tests passed. Browser tests cover six widths, accessibility, mobile submissions, attribution, server validation, errors/timeouts, and simultaneous retries. Screenshots and the measured Lighthouse report are included. Production dependency audit: zero known findings; the development lint dependency advisory is documented.

Review limitations: genuine photos and the official downloadable logo were not supplied, and reference-site access was denied by the cloud network policy. The review therefore uses typography and track geometry, with approved media placements already wired. Live CRM/Redis, domain, analytics IDs, business/legal review, and real-service verification are still required. No site or advertising was deployed. See `docs/QA.md` and `README.md` for exact readiness and deployment steps.

The empty repository has a local empty `main` baseline and a feature branch `feat/parisi-evaluation-landing`. Commits use author `iamsharjeeel <iamsharjeeel+github@gmail.com>` as requested. GitHub push/PR publication requires restored repository authentication and API access. After access is restored, push without force, then create a draft PR with this description for user review; do not merge or deploy automatically.
