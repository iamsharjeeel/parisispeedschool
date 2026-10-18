# Proposed pull request

**Title:** Build Parisi Horsham evaluation campaign page for Vercel

Parisi Horsham needs a dedicated advertising destination for free athlete evaluation requests. This adds a responsive Next.js landing page, parent/guardian form, secure server-side CRM adapter, shared rate limiting and idempotency, signed thank-you receipts, consent-gated measurement hooks, and configurable SEO/business metadata. Vercel review deployments build without credentials; unconfigured submissions fail closed and public launch requires explicit approval flags and real assets.

Validation: clean npm install, lint, strict TypeScript, production build, 11 unit tests, and 18 production-browser/integration tests passed. Browser tests cover six widths, accessibility, mobile submissions, attribution, server validation, errors/timeouts, and simultaneous retries. Screenshots and the measured Lighthouse report are included. Production dependency audit: zero known findings; the development lint dependency advisory is documented.

Review limitations: genuine photos and the official downloadable logo were not supplied, and reference-site access was denied by the cloud network policy. The review therefore uses typography and track geometry, with approved media placements already wired. Live CRM/Redis, domain, analytics IDs, business/legal review, and real-service verification are still required. No site or advertising was deployed. See `docs/QA.md` and `README.md` for exact readiness and deployment steps.

The previously empty repository now has a pushed empty `main` baseline and a pushed feature branch `feat/parisi-evaluation-landing`. Commits use author `iamsharjeeel <iamsharjeeel+github@gmail.com>` as requested. The draft PR attempt failed because `https://api.github.com/graphql` returned Forbidden under the cloud network policy. After API access is available, create the draft PR for user review; do not merge or deploy automatically. Alternatively, open the GitHub comparison for `main...feat/parisi-evaluation-landing` directly in the GitHub UI.
