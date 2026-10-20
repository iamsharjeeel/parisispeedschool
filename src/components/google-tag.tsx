/** Render the Google base tag in the initial HTML so installation checks can find it. */
export function GoogleTag({ nonce }: { nonce: string }) {
  // A configured GTM container keeps its separate, consent-gated loader.
  if (process.env.NEXT_PUBLIC_GTM_ID) return null;
  const ads = /^AW-\d+$/.test(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '')
    ? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
    : undefined;
  const ga = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA4_ID || '')
    ? process.env.NEXT_PUBLIC_GA4_ID
    : undefined;
  const id = ads || ga;
  if (!id) return null;
  const bootstrap = `
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
    gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500
    });
    gtag('set', 'ads_data_redaction', true);
    gtag('set', 'url_passthrough', false);
    gtag('js', new Date());
    ${
      ads
        ? `gtag('config', ${JSON.stringify(ads)}, {
      page_location: location.origin + location.pathname, page_referrer: '',
      allow_ad_personalization_signals: false
    });`
        : ''
    }
    ${
      ga
        ? `gtag('config', ${JSON.stringify(ga)}, {
      send_page_view: false, page_location: location.origin + location.pathname,
      page_referrer: '', allow_google_signals: false,
      allow_ad_personalization_signals: false
    });`
        : ''
    }
  `;
  return (
    <>
      <script
        id="parisi-google-tag-config"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: bootstrap }}
      />
      <script
        id="parisi-analytics"
        nonce={nonce}
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
    </>
  );
}
