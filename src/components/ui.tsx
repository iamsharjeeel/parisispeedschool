import Image from 'next/image';
import { CampaignLink as Link } from './campaign-link';
import { assets } from '@/lib/assets';
import { business } from '@/lib/content';
import { PrivacySettings } from './analytics';
import { SiteNavigation } from './site-navigation';
import { pageLinks } from '@/lib/site-pages';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
export function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m8 3 3 5-2 2a13 13 0 0 0 5 5l2-2 5 3c0 3-2 5-4 5C10 20 4 14 3 7c0-2 2-4 5-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function CTA({
  children = 'Request a free evaluation',
  placement = 'page',
  className = '',
  href = '#evaluation',
}: {
  children?: React.ReactNode;
  placement?: string;
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href} className={`button ${className}`} data-cta={placement}>
      {children}
      <Arrow />
    </Link>
  );
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${footer ? 'brand-footer' : ''}`}
      aria-label="Parisi Speed School Horsham Pennsylvania home"
    >
      <span className="brand-mark">
        <Image
          src={assets.logo}
          width={448}
          height={107}
          alt="Parisi Speed School of Horsham"
          sizes="(max-width: 600px) 152px, 224px"
          preload={!footer}
          unoptimized
        />
      </span>
    </Link>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <SiteNavigation />
        <div className="header-actions">
          <a
            className="header-phone"
            aria-label="Call Parisi Horsham at 215-706-8260"
            href={`tel:${business.telephone}`}
          >
            <PhoneIcon />
            <span>{business.phone}</span>
          </a>
          <Link
            className="button header-cta"
            href="/athlete-evaluation#evaluation"
            data-cta="header"
          >
            <span>
              Free <span className="header-cta-full">athlete </span>evaluation
            </span>
            <Arrow />
          </Link>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Brand footer />
          <p>
            Building better athletes.
            <br />
            Right here in Horsham.
          </p>
        </div>
        <div className="footer-contact">
          <span className="eyebrow">COME TRAIN WITH US</span>
          <a href={business.maps} target="_blank" rel="noreferrer">
            {business.street}
            <br />
            {business.locality}
            <Arrow diagonal />
          </a>
        </div>
        <div className="footer-contact">
          <span className="eyebrow">LET’S TALK PERFORMANCE</span>
          <a href={`tel:${business.telephone}`}>{business.phone}</a>
          <a className="email" href={`mailto:${business.email}`}>
            {business.email}
          </a>
        </div>
      </div>
      <nav
        className="container footer-pages"
        aria-label="Explore Parisi Horsham"
      >
        <span>EXPLORE PARISI HORSHAM</span>
        <div>
          {pageLinks.map((page) => (
            <Link href={page.href} key={page.href}>
              {page.label}
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </nav>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {business.name}
        </span>
        <nav aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <PrivacySettings />
          <a href={business.website} target="_blank" rel="noreferrer">
            Official website
            <Arrow diagonal />
          </a>
        </nav>
      </div>
    </footer>
  );
}

export function MobileActions() {
  return (
    <div className="mobile-bottom">
      <a href={`tel:${business.telephone}`} aria-label="Call Parisi Horsham">
        <PhoneIcon />
        <span>CALL</span>
      </a>
      <Link href="/athlete-evaluation#evaluation" data-cta="mobile">
        FREE ATHLETE EVALUATION
        <Arrow />
      </Link>
    </div>
  );
}
export function SectionHeading({
  label,
  title,
  children,
  light = false,
}: {
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`section-heading ${light ? 'light' : ''}`}>
      <p className="eyebrow">
        <span />
        {label}
      </p>
      <h2>{title}</h2>
      {children && <p className="section-intro">{children}</p>}
    </div>
  );
}
