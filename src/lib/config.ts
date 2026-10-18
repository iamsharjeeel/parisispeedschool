export function siteUrl(): string | undefined {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.origin : undefined;
  } catch {
    return undefined;
  }
}
export function safeEndpoint(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    if (u.username || u.password || u.hash) return false;
    const localTest =
      process.env.LOCAL_INTEGRATION_TEST === 'true' && !process.env.VERCEL;
    if (localTest && u.protocol === 'http:' && u.hostname === '127.0.0.1')
      return true;
    return (
      u.protocol === 'https:' &&
      !/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[|172\.(1[6-9]|2\d|3[01])\.)/i.test(
        u.hostname,
      )
    );
  } catch {
    return false;
  }
}
export function leadIntegrationReady() {
  return (
    safeEndpoint(process.env.CRM_WEBHOOK_URL) &&
    safeEndpoint(process.env.UPSTASH_REDIS_REST_URL) &&
    Boolean(process.env.UPSTASH_REDIS_REST_TOKEN) &&
    (process.env.LEAD_HASH_SECRET?.length ?? 0) >= 32
  );
}
