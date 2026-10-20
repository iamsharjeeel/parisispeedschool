import type { Metadata } from 'next';
import { CampaignLink as Link } from '@/components/campaign-link';
import { PrivacySettings } from '@/components/analytics';
import { siteUrl } from '@/lib/config';
export const metadata: Metadata = {
  title: 'Privacy policy',
  ...(siteUrl() ? { alternates: { canonical: `${siteUrl()}/privacy` } } : {}),
};
export default function Privacy() {
  return (
    <main id="main" className="legal-main">
      <article className="legal-inner">
        <p className="eyebrow">
          <span />
          PARISI SPEED SCHOOL HORSHAM
        </p>
        <h1>
          YOUR PRIVACY
          <br />
          MATTERS.
        </h1>
        <p className="legal-intro">Privacy policy · Updated October 20, 2026</p>
        <h2>Who this page is for</h2>
        <p>
          This evaluation request page identifies Parisi Speed School Horsham,
          400 Horsham Road, Horsham, PA 19044. Contact us at{' '}
          <a href="mailto:info@parisispeedschoolhorsham.com">
            info@parisispeedschoolhorsham.com
          </a>{' '}
          or <a href="tel:+12157068260">215-706-8260</a> with questions about
          your request or personal information.
        </p>
        <h2>Information you choose to provide</h2>
        <p>
          The form asks for a parent, guardian, or adult athlete’s name, email,
          phone number, athlete age group, and optional sport. Please do not
          send a child’s full name, date of birth, medical history, or other
          sensitive information. Children should have a parent or guardian make
          the request.
        </p>
        <h2>How we use an evaluation request</h2>
        <p>
          We use your details to respond, discuss eligibility, and arrange next
          steps. When the submission service is enabled, your request is
          securely sent to the business’s configured lead-handling provider. A
          successful submission means that provider has accepted the request; it
          does not confirm an appointment. Consent to follow up on a request is
          separate from optional marketing. This form does not enroll you in SMS
          marketing.
        </p>
        <h2>Campaign information and cookies</h2>
        <p>
          The page may include campaign parameters such as UTM tags and Google
          click identifiers. We attach the current page’s relevant campaign
          parameters to an evaluation request so the business can understand
          where the request came from. Allowlisted campaign parameters may stay
          in internal page links to preserve that context. We also send the
          landing page and form page paths, without other query parameters.
          Without analytics consent, campaign parameters are not saved by the
          site in browser storage.
        </p>
        <p>
          If you allow analytics, campaign attribution may be held in your
          browser’s session storage for up to 30 minutes, or until the tab
          closes. Your cookie preference is stored locally for 180 days.
          Optional Google analytics and advertising tags load only after you opt
          in. No guardian name, email, phone number, or athlete details are
          included in the site’s analytics events. Enhanced conversions and
          advertising personalization are disabled by default.
        </p>
        <p>
          You can change your choice at any time using <PrivacySettings />.
          Declining analytics does not prevent you from sending an evaluation
          request. Browser controls can also delete cookies and local storage.
        </p>
        <h2>Security and technical records</h2>
        <p>
          The submission service sends your request directly to the business’s
          configured lead-handling provider. This application does not keep a
          separate lead database or log your form details. A submission
          identifier is included with the request. Hosting and service providers
          may process technical connection information under their own policies.
        </p>
        <p>
          After a successful request, a signed, essential receipt cookie lasts
          up to 10 minutes. It contains an event identifier and timestamp, not
          your contact details, and lets the thank-you page confirm receipt.
        </p>
        <h2>Providers, retention, and your choices</h2>
        <p>
          Approved hosting, lead-handling, and security providers process
          information needed to operate this page and respond to requests. If
          enabled with your consent, Google receives analytics and advertising
          events. The business is responsible for the retention of submitted
          contact information in its lead-handling system. Contact the business
          to ask about retention, access, correction, or deletion, and any
          rights available to you under applicable law.
        </p>
        <p>
          We do not intentionally collect children’s personal contact
          information through this form. If you believe a child submitted
          personal information without an adult’s involvement, contact the
          business so it can review the request.
        </p>
        <h2>Changes and other websites</h2>
        <p>
          This policy describes this campaign page. Other websites, including
          the existing Parisi Horsham website and mapping services, have their
          own privacy practices. Updates to this policy will appear here with a
          revised date.
        </p>
        <Link href="/" className="button">
          Back to Parisi Horsham →
        </Link>
      </article>
    </main>
  );
}
