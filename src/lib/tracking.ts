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
// Keep deduplication working when browsers block sessionStorage. Scope the
// fallback to this window; no conversions are replayed on the receipt page.
const emittedConversions = new WeakMap<Window, Set<string>>();
export function track(
  event: AnalyticsEvent,
  extra: { event_id?: string; placement?: string } = {},
) {
  if (!analyticsAllowed()) return;
  if (event === 'evaluation_lead_submitted') {
    if (!extra.event_id) return;
    const emitted = emittedConversions.get(window) || new Set<string>();
    emittedConversions.set(window, emitted);
    if (emitted.has(extra.event_id)) return;
    try {
      const key = `parisi-conversion:${extra.event_id}`;
      if (sessionStorage.getItem(key)) return;
    } catch {
      // Storage is optional; in-memory deduplication still prevents repeats.
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...extra });
    emitted.add(extra.event_id);
    try {
      sessionStorage.setItem(`parisi-conversion:${extra.event_id}`, '1');
    } catch {
      // The event was queued and is already deduplicated in memory.
    }
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...extra });
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
