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
  process.argv.includes('--strict') || process.env.LAUNCH_APPROVED === 'true';
if (!strict) {
  console.log(
    'Review build: indexing disabled. Lead collection requires configured server credentials. Run npm run check:launch before public advertising.',
  );
  process.exit(0);
}
const failures = [];
const requireFlag = (name) => {
  if (process.env[name] !== 'true') failures.push(`${name}=true after review`);
};
for (const name of [
  'MEDIA_APPROVED',
  'PRIVACY_APPROVED',
  'OFFER_APPROVED',
  'CRM_IDEMPOTENCY_CONFIRMED',
  'LAUNCH_APPROVED',
])
  requireFlag(name);
for (const name of ['SITE_URL', 'CRM_WEBHOOK_URL', 'UPSTASH_REDIS_REST_URL']) {
  try {
    const u = new URL(process.env[name]);
    if (
      u.protocol !== 'https:' ||
      u.username ||
      u.password ||
      u.hostname === 'localhost' ||
      u.hash
    )
      throw Error();
  } catch {
    failures.push(`${name}: valid approved HTTPS URL required`);
  }
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN)
  failures.push('UPSTASH_REDIS_REST_TOKEN required');
if ((process.env.LEAD_HASH_SECRET?.length ?? 0) < 32)
  failures.push('LEAD_HASH_SECRET: at least 32 random characters');
if (process.env.LOCAL_INTEGRATION_TEST)
  failures.push('LOCAL_INTEGRATION_TEST must not be set for launch');
if (
  process.env.NEXT_PUBLIC_GTM_ID &&
  (process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID)
)
  failures.push('Choose GTM or direct Google tags, not both');
for (const [name, pattern] of [
  ['NEXT_PUBLIC_GTM_ID', /^GTM-[A-Z0-9]+$/],
  ['NEXT_PUBLIC_GA4_ID', /^G-[A-Z0-9]+$/],
  ['NEXT_PUBLIC_GOOGLE_ADS_ID', /^AW-\d+$/],
  ['NEXT_PUBLIC_GOOGLE_ADS_LABEL', /^[A-Za-z0-9_-]+$/],
]) {
  if (process.env[name] && !pattern.test(process.env[name]))
    failures.push(`${name}: invalid format`);
}
if (
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID &&
  !process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL
)
  failures.push('NEXT_PUBLIC_GOOGLE_ADS_LABEL required with Ads ID');
if (
  process.env.NEXT_PUBLIC_GTM_ID ||
  process.env.NEXT_PUBLIC_GA4_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
)
  requireFlag('ANALYTICS_APPROVED');
for (const name of [
  'parisi-logo',
  'sprint-acceleration',
  'resisted-sprint',
  'strength-conditioning',
  'agility-training',
  'individual-coaching',
  'group-training',
  'horsham-facility',
]) {
  if (!existsSync(`public/media/${name}.webp`))
    failures.push(`Approved asset public/media/${name}.webp missing`);
}
if (!existsSync('src/app/icon.png'))
  failures.push('Approved logo favicon src/app/icon.png missing');
if (failures.length) {
  console.error('Public launch blocked:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(
  'Launch configuration validated. Still verify the deployed CRM, consent tags, and approved domain before enabling advertising.',
);
