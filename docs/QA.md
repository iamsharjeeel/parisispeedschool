# Validation and handoff

## LeadConnector webhook update — October 19, 2026

The user-supplied webhook is configured as `CRM_WEBHOOK_URL` in ignored local configuration. A signing secret was generated locally without printing it. Neither value is committed. Every visible form field is now sent by its original name at the top level of the JSON POST, together with campaign identifiers, consent metadata, a server timestamp, and submission IDs. See `INTEGRATIONS.md` for the exact payload and Vercel setup.

Validation for this update: TypeScript, lint, production build, **16 unit tests** and **18 browser/integration tests** passed (browser run: 31.1s). The fixture verifies POST, JSON Content-Type and Accept headers, complete field values, attribution, consent, and idempotency. The real webhook URL was checked against public production assets and was absent. The production dependency declarations were unchanged.

Live receipt is **unverified**: the cloud proxy denied access to `services.leadconnectorhq.com` with CONNECT 403. The required host addition was saved to the environment draft, preserving existing allowed domains. No live webhook request or test lead was sent. Redis variables are still absent locally. On Vercel, set the supplied URL as the server-only `CRM_WEBHOOK_URL` plus `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `LEAD_HASH_SECRET`, then redeploy. Existing launch/media/privacy requirements and the need to confirm downstream idempotency still apply.

## Original campaign validation

Tested October 18, 2026. The implementation is ready for a **Vercel review deployment**, with public launch explicitly gated on the external requirements below. Nothing has been deployed to Vercel, connected to the existing business domain, or used to launch ads.

## Executed checks

| Check | Observed result |
| --- | --- |
| Clean `npm ci` | Passed; lockfile installs without legacy peer-dependency flags. A final lockfile dry-run also passed after removing an unnecessary development dependency. |
| `npm run lint` | Passed. Generated browser reports are excluded from source linting. |
| `npm run typecheck` | Passed; strict TypeScript is also checked during build. |
| `npm test` | **11 passed**, 0 failed. Schema normalization, invalid fields, honeypots, consent, endpoint safety, missing integration, signed receipt integrity/expiry. |
| `npm run build` | Passed with Next.js 16.4.2 / Node 24.19.0. App routes and server lead endpoint compile for native Vercel hosting. |
| `npm run test:e2e` | **18 passed**, 0 failed, 24.6 seconds in the final source run. Production Next server with a local synthetic CRM/Redis REST fixture. |
| Responsive checks | 375, 390, 768, 1024, 1440, 1920px; no horizontal overflow or clipped buttons. |
| Accessibility | Axe WCAG 2 A/AA, 2.1 AA, 2.2 AA checks: no violations on 375px/1440px home or mobile privacy, terms, and thank-you pages. Keyboard FAQ and validation focus checked. This is not a full manual screen-reader audit. |
| Browser runtime | No uncaught page errors or CSP issues in the final six-viewport checks. Zod JIT compilation is disabled to preserve the production policy without permitting eval. |
| Lead flow | Invalid fields, honeypot, bad origin, oversized bodies, rate limits, accepted requests, repeated IDs, changed payloads, simultaneous retries, upstream errors and timeouts all exercised. One downstream lead on retry scenarios. |
| Tracking | Synthetic consented events verified after confirmed delivery, with attribution mapping and no raw contact details. Thank-you refresh/direct visits do not fire conversions. Declining analytics does not load Google tags. Real Google account delivery is untested because no IDs were supplied. |
| Unconfigured production server | Form submission control disabled; otherwise-valid API submission returns **503**, with no fake receipt. |
| HTTP / metadata | Home, privacy, terms, thank-you, robots, sitemap, and neutral review favicon respond successfully; unknown routes return 404. Security headers and nonce CSP checked. |
| Development startup | `npm run dev -- --port 3001` started and returned the hero, business content, and evaluation form. |
| Production dependency audit | **0 known vulnerabilities** at test time. |
| Full dependency audit | **5 high findings**, all from one development lint-tool dependency chain: eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces. See `SECURITY.md`. |
| Public-launch validation | `npm run check:launch` fails as expected, listing missing approved media, credentials, domain, and review flags. |

## Performance measurement

Final measured scores: **Performance 94, Accessibility 100, Best Practices 100, SEO 63**. FCP: **0.9s**. LCP: **3.1s**, above the requested 2.5s target. CLS: **0**. Total Blocking Time: **40ms** (not INP). No console or browser Inspector issues were reported in that run. These results are reported as measured; the LCP target remains unmet and photographic-page performance is unverified.

The raw mobile Lighthouse report is saved in `artifacts/lighthouse-mobile.json`. Its exact scores and timing are recorded in `artifacts/performance-summary.json`. This is a local production review build with simulated mobile throttling, no live analytics, and **no photographic media**. It is not field Core Web Vitals data. The SEO score is intentionally reduced by review-mode indexing protection. Re-measure on the approved deployment with genuine images and configured tags; no INP result or future score is promised.

The first measured run exposed font-related layout shift (CLS 0.136). Local font preloads and metric-adjusted fallbacks eliminated the measured shift. Lighthouse also exposed an attempted schema-library eval; the supported Zod interpreter setting removed it without weakening CSP. Actual accessibility labels and the neutral missing-favicon response were corrected as part of testing.

## Visual evidence

- `artifacts/final-1440.png`: full desktop page.
- `artifacts/final-375.png`: full mobile page.
- `artifacts/viewport-1440.png`, `artifacts/viewport-375.png`: first-screen views.

Screenshots were inspected. These show the typographic review treatment and the synthetic test environment's enabled form. The default unconfigured site instead disables submission and displays a call alternative. No reference-site screenshots or real-photo crop/loading claims are made: access to the reference site is blocked, and originals were not attached. Those checks remain **unrun**, rather than being counted as passing empty-image tests.

## Outstanding external requirements

1. **Genuine media:** original approved logo, training photos, favicon, and optional social image. See `MEDIA.md`. The present typography and track geometry do not fulfill the brief's genuine-photography acceptance criterion.
2. **Live delivery:** an approved HTTPS CRM adapter with durable idempotency, a real Redis REST account/token, and a random signing secret. Verify actual service acceptance and timeout recovery; the local fixture is not proof of live GHL/Upstash readiness.
3. **Business review:** confirm current evaluation eligibility, claims, brand/media rights, privacy/terms, processor identities, and concrete CRM retention policy.
4. **Approved domain:** configure the authorized HTTPS campaign origin and actual Vercel project. Actual Vercel deployment/custom-domain operation is unrun.
5. **Analytics, if desired:** real Google IDs, approved consent/tag configuration, and Tag Assistant/live-account checks. Enhanced conversions remain disabled pending separate approval.
6. **Reference access:** apply the saved reference-domain changes in cloud environment settings to audit the six original pages and compare authentic media/layouts.
7. **Pull request:** both `main` and `feat/parisi-evaluation-landing` were successfully pushed through the platform Git proxy. The draft PR creation attempt failed with `Post https://api.github.com/graphql: Forbidden`. Apply the saved `api.github.com` domain addition and retry PR creation, or open the branch comparison through GitHub. No new token value is requested in chat. Review before merging; `main` remains an empty baseline until then.

Reusable `install_script` and `start_skill` were saved in the cloud environment draft. Network additions for the two reference hosts and GitHub API were also saved, but the running policy remained unchanged. Review/save those settings and publish the environment through the product when appropriate. Saving configuration is not publication, deployment, or proof of fresh-task restoration. Source and complete-history archives were also created outside the checkout as a handoff backup.
