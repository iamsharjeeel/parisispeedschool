import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { CampaignLink as Link } from '@/components/campaign-link';
import { validReceipt } from '@/lib/lead-service';
import { Arrow, PhoneIcon } from '@/components/ui';
export const metadata: Metadata = {
  title: 'Your evaluation request',
  robots: { index: false, follow: false },
};
export default async function ThankYou() {
  const received = validReceipt((await cookies()).get('parisi_receipt')?.value);
  return (
    <main id="main" className="thank-you">
      <div className="container">
        <div className="thank-you-inner">
          <p className="eyebrow">
            <span />
            PARISI SPEED SCHOOL / HORSHAM, PA
          </p>
          <h1>
            {received ? (
              <>
                REQUEST RECEIVED.
                <br />
                <span>YOU’RE UP NEXT.</span>
              </>
            ) : (
              <>
                YOUR FIRST STEP.
                <br />
                <span>STARTS HERE.</span>
              </>
            )}
          </h1>
          <p>
            {received
              ? 'Thanks for reaching out. The Parisi Horsham team will contact you to discuss your athlete’s evaluation and next steps. Your appointment is not yet booked; the team will confirm a time with you.'
              : 'Ready to explore what’s next for your athlete? Send an evaluation request or call the Horsham team. A visit to this page does not submit a request or book an appointment.'}
          </p>
          {received ? (
            <a href="tel:+12157068260" className="button">
              <PhoneIcon />
              Call 215-706-8260
              <Arrow />
            </a>
          ) : (
            <Link href="/#evaluation" className="button">
              Request a free evaluation
              <Arrow />
            </Link>
          )}
          <div className="thank-you-note">
            <p>
              400 Horsham Road · Horsham, PA 19044
              <br />
              Have a question? Call 215-706-8260.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
