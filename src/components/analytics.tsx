'use client';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { CampaignLink as Link } from '@/components/campaign-link';
import { usePathname } from 'next/navigation';
import { analyticsAllowed, attribution, track } from '@/lib/tracking';
function loadAnalytics(nonce: string) {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const loadContainer =
    Boolean(gtm && /^GTM-[A-Z0-9]+$/.test(gtm)) &&
    !document.getElementById('parisi-analytics');
  // Direct Google tags are already present in the head with denied storage.
  if (!window.gtag && !loadContainer) return;
  window.dataLayer = window.dataLayer || [];
  // This is Google's documented queue format; gtag reads Arguments objects.
  window.gtag ||= function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  if (loadContainer)
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  if (!loadContainer) return;
  const script = document.createElement('script');
  script.id = 'parisi-analytics';
  script.async = true;
  script.nonce = nonce;
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtm}`;
  document.head.appendChild(script);
}
export function Analytics({ nonce }: { nonce: string }) {
  const pathname = usePathname();
  const lastPageView = useRef('');
  const pageView = useCallback(() => {
    if (!analyticsAllowed() || lastPageView.current === pathname) return;
    const page_location = `${location.origin}${pathname}`;
    if (process.env.NEXT_PUBLIC_GTM_ID) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'virtual_page_view',
        page_location,
        page_title: document.title,
      });
    } else {
      window.gtag?.('event', 'page_view', {
        page_location,
        page_title: document.title,
        page_referrer: '',
      });
    }
    lastPageView.current = pathname;
  }, [pathname]);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hasChoice = useSyncExternalStore(
    subscribeConsent,
    consentSnapshot,
    () => true,
  );
  useEffect(() => {
    if (analyticsAllowed()) {
      loadAnalytics(nonce);
      attribution();
      pageView();
    }
    const preferences = () => setOpen(true);
    const click = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a');
      if (link?.href.startsWith('tel:')) track('click_to_call');
      if (link?.dataset.cta)
        track('primary_cta_click', { placement: link.dataset.cta });
    };
    window.addEventListener('parisi:privacy', preferences);
    document.addEventListener('click', click);
    return () => {
      window.removeEventListener('parisi:privacy', preferences);
      document.removeEventListener('click', click);
    };
  }, [nonce, pageView]);
  const choose = (allowed: boolean) => {
    try {
      localStorage.setItem(
        'parisi-consent',
        JSON.stringify({ allowed, at: Date.now() }),
      );
      if (!allowed) {
        sessionStorage.removeItem('parisi-attribution');
        window.gtag?.('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
        for (const cookie of document.cookie.split(';')) {
          const key = cookie.split('=')[0].trim();
          if (/^(_ga|_gid|_gat|_gcl)/.test(key)) {
            document.cookie = `${key}=; Max-Age=0; Path=/`;
            const parts = location.hostname.split('.');
            for (let i = 0; i < parts.length - 1; i++)
              document.cookie = `${key}=; Max-Age=0; Path=/; Domain=.${parts.slice(i).join('.')}`;
          }
        }
      }
    } catch {
      /* Declined by default if storage is unavailable. */
    }
    setOpen(false);
    setDismissed(true);
    if (allowed && analyticsAllowed()) {
      loadAnalytics(nonce);
      attribution();
      pageView();
    }
    if (
      !allowed &&
      process.env.NEXT_PUBLIC_GTM_ID &&
      document.getElementById('parisi-analytics')
    )
      location.reload();
  };
  const configured = Boolean(
    process.env.NEXT_PUBLIC_GTM_ID ||
      process.env.NEXT_PUBLIC_GA4_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  );
  if (!open && (dismissed || hasChoice || !configured)) return null;
  return (
    <section className="consent-panel" aria-label="Cookie preferences">
      <div>
        <strong>Your privacy. Your choice.</strong>
        <p>
          We use Google’s tag with cookie storage denied by default. Allow
          analytics and advertising cookies to help us understand visits and
          evaluation requests. Your choice won’t affect your request.{' '}
          <Link href="/privacy">Privacy policy</Link>
        </p>
      </div>
      <div className="consent-actions">
        <button onClick={() => choose(false)}>Essential only</button>
        <button onClick={() => choose(true)}>Allow analytics</button>
      </div>
    </section>
  );
}
export function PrivacySettings() {
  return (
    <button
      className="text-button"
      onClick={() => window.dispatchEvent(new Event('parisi:privacy'))}
    >
      Cookie preferences
    </button>
  );
}
function subscribeConsent(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}
function consentSnapshot() {
  try {
    const choice = JSON.parse(localStorage.getItem('parisi-consent') || 'null');
    return Boolean(choice && Date.now() - choice.at < 180 * 86400000);
  } catch {
    return false;
  }
}
