# Parisi Speed School Horsham

A Next.js 16 / React 19 athlete-evaluation page with TypeScript, Tailwind CSS, and a direct server-side JSON webhook form. Node 24.

## Vercel: one setting for submissions

Set **`CRM_WEBHOOK_URL`** to the supplied LeadConnector webhook URL and redeploy. The existing **`crm_webook_url`** spelling also works, as do `crm_webhook_url` and `CRM_WEBOOK_URL`. Only one of these is needed; uppercase `CRM_WEBHOOK_URL` takes precedence if multiple values exist.

**No Redis, database, queue, token, or signing-secret configuration is required.** The form is enabled and sends directly to the webhook. Its button disables only while sending. Failed requests show an error and allow retry; success is shown only after the webhook responds successfully.

The implementation is on **`feat/parisi-evaluation-landing`**. Deploy the latest commit from that branch; `main` remains the empty review baseline until merged. In Vercel use Next.js, Node 24, repository root, `npm ci`, and `npm run build`. Keep the default Next.js output; do not use static export.

Set the webhook variable in the environment scope used by the deployment (Preview or Production). Never prefix it with `NEXT_PUBLIC_` or commit its value. Local configuration belongs in ignored `.env.local`.

All form fields are sent as JSON, including contact details, age group, sport, contact preference, consent, campaign attribution, timestamp, and a submission identifier. See [the exact payload](docs/INTEGRATIONS.md).

## Local development

```sh
nvm use
npm ci
# Create .env.local with your CRM_WEBHOOK_URL; preserve any existing file.
npm run dev
```

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

## Tests

```sh
npx playwright install --with-deps chromium
npm run build
npm run test:e2e
```

If Chromium is already installed, use `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e`. Browser tests run the production app on port 3000 and a local synthetic webhook on port 4319. They use only `crm_webook_url`, with no extra infrastructure. They send no real leads to the business.

## Editing and optional settings

- Business details, programs, FAQ: `src/lib/content.ts`.
- Sections and styling: `src/app/page.tsx`, `src/app/globals.css`.
- Form: `src/components/lead-form.tsx`; validation: `src/lib/lead-schema.ts`.
- Direct webhook handler: `src/lib/lead-service.ts`; JSON mapping: `src/lib/lead-payload.ts`.
- Approved genuine media: `src/lib/assets.ts` and `docs/MEDIA.md`.
- Optional `SITE_URL` controls canonical URLs and business metadata.
- Optional analytics IDs and consent behavior are described in `docs/INTEGRATIONS.md`.
- Media, offer/privacy review, indexing, and advertising approval are separate from form delivery. `LAUNCH_APPROVED` defaults false and keeps review indexing off. `npm run check:launch` checks those publication requirements, without Redis or signing-secret requirements.

The privacy/terms pages, genuine-photo requirements, and final-domain review remain documented in `docs/QA.md`. Nothing is automatically deployed to the business domain or used to activate advertising.
