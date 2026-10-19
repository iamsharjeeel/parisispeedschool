import type { Metadata } from 'next';
import { headers } from 'next/headers';
import localFont from 'next/font/local';
import './globals.css';
import { Analytics } from '@/components/analytics';
import { Header, Footer, MobileActions } from '@/components/ui';
import { siteUrl } from '@/lib/config';
const display = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2',
      weight: '600',
    },
    {
      path: '../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2',
      weight: '700',
    },
    {
      path: '../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2',
      weight: '800',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: 'Arial',
});
const body = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2',
      weight: '400',
    },
    {
      path: '../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2',
      weight: '500',
    },
    {
      path: '../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2',
      weight: '600',
    },
  ],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: 'Arial',
});
const url = siteUrl();
export const metadata: Metadata = {
  ...(url ? { metadataBase: new URL(url) } : {}),
  title: {
    default: 'Free Athlete Evaluation | Parisi Speed School Horsham',
    template: '%s | Parisi Speed School Horsham',
  },
  description:
    'Build speed, strength and agility at Parisi Speed School Horsham. Request a free 60-minute athlete evaluation in Horsham, PA.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Train to win. | Parisi Speed School Horsham',
    description:
      'Speed. Strength. Confidence. Your athlete’s next level starts in Horsham.',
    ...(url ? { url } : {}),
    siteName: 'Parisi Speed School Horsham',
  },
  robots:
    process.env.LAUNCH_APPROVED === 'true'
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get('x-nonce') || '';
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <MobileActions />
        <Analytics nonce={nonce} />
      </body>
    </html>
  );
}
