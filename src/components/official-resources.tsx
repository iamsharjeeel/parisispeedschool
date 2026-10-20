import { business } from '@/lib/content';
import { Arrow } from './ui';
import { MainWebsiteLink } from './main-website-link';

export function OfficialResources() {
  return (
    <aside
      className="official-resources"
      aria-label="Pricing and class schedule"
    >
      <h3>Plan your training.</h3>
      <p>
        The official Horsham site lists current membership options and live
        class availability. Memberships currently start with a three-month
        commitment, then continue month to month. Check the current terms before
        enrolling.
      </p>
      <MainWebsiteLink className="resource-main-site">
        Explore our main website
      </MainWebsiteLink>
      <div>
        <a
          className="text-link"
          href={`${business.website}/speed-pricing`}
          target="_blank"
          rel="noreferrer"
        >
          View pricing & membership terms
          <Arrow diagonal />
        </a>
        <a
          className="text-link"
          href={`${business.website}/schedule`}
          target="_blank"
          rel="noreferrer"
        >
          View the live class schedule
          <Arrow diagonal />
        </a>
      </div>
    </aside>
  );
}
