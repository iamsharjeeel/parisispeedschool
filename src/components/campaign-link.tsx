'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ComponentProps } from 'react';
import { campaignHref } from '@/lib/campaign';

export function CampaignLink({
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const query = useSearchParams();
  const pathname = usePathname();
  return <Link {...props} href={campaignHref(href, query, pathname)} />;
}
