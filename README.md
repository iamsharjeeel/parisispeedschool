# Parisi Speed School Horsham

A dedicated athlete-evaluation campaign page built with Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, React Hook Form, and Zod. Deploys natively to Vercel using Node 24.

**The review site builds without credentials. Public advertising is not launch-ready until the real media, CRM, domain, and business/privacy approvals below are complete.** Unconfigured submissions are disabled, and the API returns an error rather than pretending to collect a lead. Review builds are `noindex`.

## Run locally

```sh
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open the development server on port 3000. No backend credentials are needed to inspect the design. To exercise successful submissions locally, use the synthetic integration tests below; do not invent production credentials.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

The lockfile is committed. `npm ci` is the intended install command. ESLint 9 is pinned because the current Next.js React/accessibility/import plugins declare support through ESLint 9; upgrading to 10 currently creates incompatible peer dependencies. No `--legacy-peer-deps` is needed.

## Deploy a review to Vercel

The implementation is on **`feat/parisi-evaluation-landing`**. `main` is an empty baseline for reviewing this previously empty repository. Select the feature branch for the review deployment, or merge it after review before importing `main`. If the Vercel import flow only offers the default branch, deploy a preview from this feature checkout with the Vercel CLI (`npx vercel`), or configure the project's Git deployment branch before redeploying. Do not import the empty baseline expecting it to contain the app.

1. Import this GitHub repository into a Vercel project. Root Directory: repository root. Framework: **Next.js**. Node.js: **24.x**.
2. Use `npm ci` for installation and `npm run build` for the build. Leave Output Directory at the Next.js default. Do not use static export; the form requires a server function.
3. Keep `LAUNCH_APPROVED=false` (the default). You can deploy and inspect all pages without any environment values. Enable Vercel Deployment Protection for review URLs.
4. Add required server values through **Project Settings → Environment Variables**, using the intended Preview or Production scope, then redeploy. Never commit `.env.local` or place secrets in `NEXT_PUBLIC_` variables.
5. Follow the public-launch steps below before removing deployment protection or sending advertising traffic.

No deployment, live-domain change, or advertising activation is performed by this repository.

## Environment variables

The supplied LeadConnector webhook is configured locally in ignored `.env.local`. For a Vercel deployment, put that supplied URL in the **server-only `CRM_WEBHOOK_URL`** variable and redeploy. The JSON POST includes every visible form field at the top level, plus attribution, consent metadata, and submission identifiers. See `docs/INTEGRATIONS.md` for the exact payload and field mapping. Redis credentials and the signing secret are still required for the existing submission protections.

| Variable                                                     | Purpose                                                                                                                                                                             |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`                                                   | The approved campaign origin, e.g. an HTTPS domain you control. No path or query. Used for canonical, sitemap, schema, and lead page mapping. No original Parisi domain is assumed. |
| `CRM_WEBHOOK_URL`                                            | Server-only HTTPS endpoint accepting the contract in `docs/INTEGRATIONS.md`.                                                                                                        |
| `CRM_WEBHOOK_TOKEN`                                          | Optional bearer token for that endpoint. A signed webhook URL may already authenticate; review with the provider.                                                                   |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`        | Redis REST service for shared rate limits and idempotency. Required for delivery; process memory is never used as a production substitute.                                          |
| `LEAD_HASH_SECRET`                                           | At least 32 random characters; generate using `openssl rand -hex 32`. Signs receipts and hashes abuse/deduplication records.                                                        |
| `MEDIA_APPROVED`                                             | `true` only after adding and inspecting every required photo and the official logo. See `docs/MEDIA.md`.                                                                            |
| `PRIVACY_APPROVED`                                           | `true` only after the business reviews the policy, processors, retention, and terms.                                                                                                |
| `OFFER_APPROVED`                                             | `true` after the business confirms current free-evaluation eligibility and page claims.                                                                                             |
| `CRM_IDEMPOTENCY_CONFIRMED`                                  | `true` after the receiving adapter is proven to deduplicate `Idempotency-Key`, including timeout/retry scenarios.                                                                   |
| `LAUNCH_APPROVED`                                            | Enables indexing and strict build-time launch validation. Keep false for review.                                                                                                    |
| `NEXT_PUBLIC_GTM_ID`                                         | Optional GTM container ID. Use GTM **or** the direct tags below.                                                                                                                    |
| `NEXT_PUBLIC_GA4_ID`                                         | Optional direct GA4 measurement ID.                                                                                                                                                 |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` / `NEXT_PUBLIC_GOOGLE_ADS_LABEL` | Optional direct Ads conversion ID and label.                                                                                                                                        |
| `ANALYTICS_APPROVED`                                         | Required for launch when tags are configured, following consent and data-collection review.                                                                                         |

Only tag identifiers are public. `.env.example` contains no credentials. `LOCAL_INTEGRATION_TEST` is restricted to local test execution, refuses HTTP endpoints on Vercel, and must never be added to a deployment.

## Before public launch

1. Supply genuine original media, verify usage rights and identities, generate the approved derivatives, and set `MEDIA_APPROVED=true`. No training photos were attached to the supplied brief, so the current review is typographic; no generated athlete/facility substitutes are presented as real photographs.
2. Configure the approved CRM adapter and Redis. Use a secure test contact and verify actual receipt, field mapping, timeout behavior, and durable deduplication. Confirm provider retention and deletion practices.
3. Obtain business review of the free offer, brand use, all claims, privacy policy, terms, processors, and retention. Set the corresponding approval flags only after review.
4. Set the approved HTTPS `SITE_URL`, configure the custom domain in Vercel, and ensure the Google Ads display and final URLs use that same domain. Do not point at an existing Parisi domain without authorization.
5. If using analytics, review the consent/tag configuration in `docs/INTEGRATIONS.md`. Verify actual IDs in Google Tag Assistant. Enhanced conversions stay off pending a separate approved implementation.
6. Set `LAUNCH_APPROVED=true` and run `npm run check:launch`. The build then fails with a readable list if required settings or approved assets are missing.
7. Redeploy. Verify the live form, thank-you flow, Google AdsBot access, HTTPS, canonical, sitemap, mobile view, and consent behavior on the final domain. Remove deployment protection only for the approved public launch. Enabling ads remains a separate authorized action.

## Browser and integration tests

```sh
npx playwright install --with-deps chromium
npm run build
npm run test:e2e
```

If Chromium is already installed, run `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e`. Tests start a production Next.js server and a **local synthetic** CRM/Redis REST test double on ports 3000 and 4319. Stop other processes on those ports first. They never contact the business CRM or send real personal data. The Redis fixture verifies the REST contract; it does not replace testing an actual Upstash account before launch.

Tests cover six viewports, keyboard interaction, automated accessibility, validation, anti-spam, origin/size guards, success, rate limits, idempotency, CRM errors/timeouts, attribution, consent, direct thank-you visits, and conversion deduplication. Screenshots are saved to `artifacts/final-375.png` and `artifacts/final-1440.png`; failures produce Playwright traces. See `docs/QA.md` for measured results and limitations.

## Editing and maintenance

- Business details, program content, assessments, and FAQs: `src/lib/content.ts`.
- Asset names and approvals: `src/lib/assets.ts`; original-to-derivative workflow: `docs/MEDIA.md`.
- Section layout and campaign copy: `src/app/page.tsx`; visual tokens and responsive styling: `src/app/globals.css`.
- Form fields and validation: `src/lib/lead-schema.ts` and `src/components/lead-form.tsx`.
- Backend delivery: `src/lib/lead-service.ts`; route protections: `src/app/api/leads/route.ts`.
- Privacy and terms: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`. Changes need business/legal review.
- CSP and security headers: `src/proxy.ts`, `next.config.ts`. Approved new tag vendors may need explicit CSP additions.

See `docs/RESEARCH.md`, `docs/INTEGRATIONS.md`, and `docs/SECURITY.md`. This is an independently implemented advertising page, not a replacement for or a modification of the existing Parisi Horsham website.
