import { attributionKeys } from './campaign';
export type AnalyticsEvent =
  | 'evaluation_lead_submitted'
  | 'click_to_call'
  | 'form_start'
  | 'form_validation_error'
  | 'primary_cta_click';
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function analyticsAllowed() {
  try {
    const state = JSON.parse(localStorage.getItem('parisi-consent') || 'null');
    return state?.allowed === true && Date.now() - state.at < 180 * 86400000;
  } catch {
    return false;
  }
}
export function track(
  event: AnalyticsEvent,
  extra: { event_id?: string; placement?: string } = {},
) {
  if (!analyticsAllowed()) return;
  if (event === 'evaluation_lead_submitted' && extra.event_id) {
    try {
      const key = `parisi-conversion:${extra.event_id}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      return;
    } // No deduplication storage: do not risk duplicate conversions.
  }
  if (process.env.NEXT_PUBLIC_GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...extra });
  } else {
    window.gtag?.('event', event, { ...extra });
    if (
      event === 'evaluation_lead_submitted' &&
      process.env.NEXT_PUBLIC_GA4_ID
    ) {
      window.gtag?.('event', 'generate_lead', {
        ...extra,
        send_to: process.env.NEXT_PUBLIC_GA4_ID,
      });
    }
    if (
      event === 'evaluation_lead_submitted' &&
      process.env.NEXT_PUBLIC_GOOGLE_ADS_ID &&
      process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL
    ) {
      window.gtag?.('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL}`,
        transaction_id: extra.event_id,
      });
    }
    if (
      event === 'click_to_call' &&
      process.env.NEXT_PUBLIC_GOOGLE_ADS_ID &&
      process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL
    ) {
      window.gtag?.('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL}`,
      });
    }
  }
}
export function attribution() {
  const current = Object.fromEntries(
    attributionKeys.flatMap((key) => {
      const value = new URLSearchParams(location.search).get(key);
      return value && value.length <= 250 && !/[\u0000-\u001f<>]/.test(value)
        ? [[key, value]]
        : [];
    }),
  );
  // Without analytics consent, use only this request's URL values; no attribution storage.
  if (!analyticsAllowed()) return current;
  try {
    if (Object.keys(current).length)
      sessionStorage.setItem(
        'parisi-attribution',
        JSON.stringify({ at: Date.now(), values: current }),
      );
    const stored = JSON.parse(
      sessionStorage.getItem('parisi-attribution') || 'null',
    );
    if (stored && Date.now() - stored.at < 1800000)
      return stored.values as Record<string, string>;
    sessionStorage.removeItem('parisi-attribution');
  } catch {
    /* Storage is optional. */
  }
  return current;
}
