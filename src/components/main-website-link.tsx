import type { ComponentProps } from 'react';
import { business } from '@/lib/content';

export function MainWebsiteLink({
  children,
  className = '',
  onClick,
}: Pick<ComponentProps<'a'>, 'children' | 'className' | 'onClick'>) {
  return (
    <a
      className={`main-site-link ${className}`}
      href={`${business.website}/`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 19 19 5M5 5h14v14"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    </a>
  );
}
