import Image from 'next/image';
import Link from 'next/link';
import { assets } from '@/lib/assets';
import { business } from '@/lib/content';
import { PrivacySettings } from './analytics';

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
}: {
  children?: React.ReactNode;
  placement?: string;
  className?: string;
}) {
  return (
    <a
      href="#evaluation"
      className={`button ${className}`}
      data-cta={placement}
    >
      {children}
      <Arrow />
    </a>
  );
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${footer ? 'brand-footer' : ''}`}
      aria-label="Parisi Speed School Horsham Pennsylvania home"
    >
      {assets.approved ? (
        <Image
          src={assets.logo}
          width={240}
          height={62}
          alt="Parisi Speed School"
          priority={!footer}
        />
      ) : (
        <span className="brand-type">
          PARISI <span>SPEED SCHOOL</span>
        </span>
      )}
      <span className="brand-location">
        HORSHAM <span>PENNSYLVANIA</span>
      </span>
    </Link>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
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
            href="/#evaluation"
            data-cta="header"
          >
            Free athlete evaluation
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
