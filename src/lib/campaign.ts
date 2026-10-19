export const attributionKeys = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'campaign_id',
  'adgroup_id',
] as const;

export function safePagePath(
  value: string | null | undefined,
): string | undefined {
  return value &&
    value.length <= 250 &&
    /^\/(?!\/)[^?#\\\u0000-\u0020<>]*$/.test(value)
    ? value
    : undefined;
}

/** Carry only allowlisted campaign data in URLs; no pre-consent browser storage. */
export function campaignHref(
  href: string,
  query: Pick<URLSearchParams, 'get'>,
  pathname: string,
): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const target = new URL(href, 'https://internal.invalid');
  let campaign = false;
  for (const key of attributionKeys) {
    const value = query.get(key);
    if (value && value.length <= 250 && !/[\u0000-\u001f<>]/.test(value)) {
      campaign = true;
      if (!target.searchParams.has(key)) target.searchParams.set(key, value);
    }
  }
  if (campaign)
    target.searchParams.set(
      'landing_path',
      safePagePath(query.get('landing_path')) || safePagePath(pathname) || '/',
    );
  return `${target.pathname}${target.search}${target.hash}`;
}
