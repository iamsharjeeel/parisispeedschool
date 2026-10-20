# Parisi Speed School Horsham campaign

Next.js 16 / React 19 website with seven linked training pages, an athlete-evaluation form, Kanit headings and Inter body text matching the official Horsham site, and the business-supplied transparent logo.

Production: https://parisispeedschool.vercel.app

## Develop and verify

Use Node 24 and `npm ci`, then `npm run dev`. Run `npm run lint`, `npm test`, and `npm run build`. Run `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` against the production build; Playwright starts a local synthetic webhook. It never sends leads to the business CRM. The managed workspace blocks the external logo CDN, so tests validate its URL and transparent wrapper and verify locally hosted coach images separately.

For Google tag integration tests, build and run the tests with the public identifiers configured (`NEXT_PUBLIC_GOOGLE_ADS_ID=AW-18513687675` and `NEXT_PUBLIC_GA4_ID=G-RRL9JLXCKK`). These identifiers are not secrets. Without them, the tag-specific browser tests are skipped.

## Production settings

- `SITE_URL`: canonical HTTPS origin.
- `SITE_PUBLIC=true`: enables indexing, sitemap, and crawler access. Leave it unset for preview/local builds.
- `CRM_WEBHOOK_URL`: existing server-only LeadConnector webhook; lowercase legacy spellings also work. No Redis, queue, or extra token is required.
- Google tag settings: see [docs/ADS-SETUP.md](docs/ADS-SETUP.md). Conversion actions are account setup; labels are optional until created.
- `MEDIA_APPROVED=true` enables the optional full training-photo layout only when every referenced photo exists. Published coach portraits are shown independently of this switch.

Public builds validate the canonical origin, webhook configuration, tag formats, and any enabled media references. They do not fabricate business/legal approval flags. Keep secrets in Vercel; never commit `.env.local`.

The official site is the source for coach portraits/bios, the attributed parent quote, pricing terms, and schedule links. Portraits are unchanged files from its `/our-team` page. Facility photographs are not published there yet. See [docs/MEDIA.md](docs/MEDIA.md).

## Main files

Page structure: `src/app/page.tsx`, `src/app/[slug]/page.tsx`; content: `src/lib/content.ts`, `src/lib/site-pages.ts`; styling: `src/app/globals.css`; campaign links: `src/components/campaign-link.tsx`; form and webhook: `src/components/lead-form.tsx`, `src/lib/lead-payload.ts`, `src/lib/lead-service.ts`.
