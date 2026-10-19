'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { pageLinks } from '@/lib/site-pages';

const desktopLinks = [
  { href: '/programs', label: 'Programs' },
  { href: '/coaching', label: 'Coaching' },
  { href: '/faqs', label: 'FAQs' },
];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <div
      className="site-navigation"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <nav className="desktop-navigation" aria-label="Main navigation">
        {desktopLinks.map((page) => (
          <Link
            href={page.href}
            key={page.href}
            aria-current={pathname === page.href ? 'page' : undefined}
          >
            {page.label}
          </Link>
        ))}
      </nav>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => setOpen((current) => !current)}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={open ? 'M6 6l12 12M6 18 18 6' : 'M4 7h16M4 12h16M4 17h16'}
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </button>
      <nav
        id="site-menu"
        className="mobile-navigation"
        aria-label="Main navigation"
        hidden={!open}
      >
        <Link href="/" onClick={() => setOpen(false)}>
          Home
        </Link>
        {pageLinks.map((page) => (
          <Link
            href={page.href}
            key={page.href}
            aria-current={pathname === page.href ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {page.label}
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
