const containerId = 'GTM-KP59SXS6';

export function GoogleTag({ nonce }: { nonce: string }) {
  return (
    // eslint-disable-next-line @next/next/next-script-for-ga -- Preserve the supplied GTM snippet with the request CSP nonce.
    <script
      id="parisi-analytics"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
gtag('consent', 'default', {
  analytics_storage: 'denied', ad_storage: 'denied',
  ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500
});
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(containerId)});`,
      }}
    />
  );
}

export function GoogleTagBody() {
  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe>`,
      }}
    />
  );
}
