import { CampaignLink as Link } from '@/components/campaign-link';
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <div className="container">
        <p className="eyebrow">404 / OFF THE TRACK</p>
        <h1>
          LET’S GET YOU
          <br />
          BACK ON TRACK.
        </h1>
        <p>This page isn’t here. Your next step is.</p>
        <Link href="/" className="button">
          Back to Parisi Horsham →
        </Link>
      </div>
    </main>
  );
}
