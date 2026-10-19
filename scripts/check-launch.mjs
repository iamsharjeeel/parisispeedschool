import { existsSync } from 'node:fs';
for (const file of [
  '.env.production.local',
  '.env.local',
  '.env.production',
  '.env',
]) {
  if (existsSync(file)) process.loadEnvFile(file);
}
const strict =
  process.argv.includes('--strict') ||
  process.env.SITE_PUBLIC === 'true' ||
  process.env.LAUNCH_APPROVED === 'true';
if (!strict) {
  console.log(
    'Local/preview build: indexing disabled. Production uses SITE_PUBLIC and SITE_URL; form delivery uses the server-only CRM webhook.',
  );
  process.exit(0);
}
const failures = [];
const webhookUrl =
  process.env.CRM_WEBHOOK_URL?.trim() ||
  process.env.crm_webhook_url?.trim() ||
  process.env.crm_webook_url?.trim() ||
  process.env.CRM_WEBOOK_URL?.trim();
for (const [name, value] of [
  ['SITE_URL', process.env.SITE_URL],
  ['CRM_WEBHOOK_URL', webhookUrl],
]) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.hostname === 'localhost' ||
      url.hash
    )
      throw Error();
  } catch {
    failures.push(`${name}: valid HTTPS URL required`);
  }
}
if (process.env.LOCAL_INTEGRATION_TEST)
  failures.push(
    'LOCAL_INTEGRATION_TEST must not be set for a public deployment',
  );
if (
  process.env.NEXT_PUBLIC_GTM_ID &&
  (process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID)
)
  failures.push('Choose GTM or direct Google tags to avoid duplicate tags');
for (const [name, pattern] of [
  ['NEXT_PUBLIC_GTM_ID', /^GTM-[A-Z0-9]+$/],
  ['NEXT_PUBLIC_GA4_ID', /^G-[A-Z0-9]+$/],
  ['NEXT_PUBLIC_GOOGLE_ADS_ID', /^AW-\d+$/],
  ['NEXT_PUBLIC_GOOGLE_ADS_LABEL', /^[A-Za-z0-9_-]+$/],
  ['NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL', /^[A-Za-z0-9_-]+$/],
])
  if (process.env[name] && !pattern.test(process.env[name]))
    failures.push(`${name}: invalid format`);
// A Google Ads base tag works before a conversion action/label is created.
for (const name of [
  'NEXT_PUBLIC_GOOGLE_ADS_LABEL',
  'NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL',
]) {
  if (process.env[name] && !process.env.NEXT_PUBLIC_GOOGLE_ADS_ID)
    failures.push(`${name} requires NEXT_PUBLIC_GOOGLE_ADS_ID`);
}
// Typography-only pages are supported. Validate photos only when that layout is enabled.
if (process.env.MEDIA_APPROVED === 'true') {
  for (const name of [
    'sprint-acceleration',
    'resisted-sprint',
    'strength-conditioning',
    'agility-training',
    'individual-coaching',
    'group-training',
    'horsham-facility',
  ]) {
    if (!existsSync(`public/media/${name}.webp`))
      failures.push(
        `Photo layout enabled but public/media/${name}.webp is missing`,
      );
  }
}
if (failures.length) {
  console.error('Launch configuration errors:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(
  'Public URL, CRM configuration, media references, and Google tag formats validated.',
);
if (
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID &&
  !process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL
)
  console.log(
    'Google Ads base tag configured. Add the lead conversion label when that conversion action is created.',
  );
