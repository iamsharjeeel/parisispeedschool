import type { Metadata } from 'next';
import Link from 'next/link';
import { siteUrl } from '@/lib/config';
export const metadata: Metadata = {
  title: 'Terms of use',
  ...(siteUrl() ? { alternates: { canonical: `${siteUrl()}/terms` } } : {}),
};
export default function Terms() {
  return (
    <main id="main" className="legal-main">
      <article className="legal-inner">
        <p className="eyebrow">
          <span />
          PARISI SPEED SCHOOL HORSHAM
        </p>
        <h1>
          A CLEAR
          <br />
          STARTING POINT.
        </h1>
        <p className="legal-intro">Terms of use · Updated October 18, 2026</p>
        <h2>Evaluation requests</h2>
        <p>
          This page lets adults request an athlete evaluation from Parisi Speed
          School Horsham. Submitting a request does not reserve an appointment,
          enroll an athlete, or create an obligation to purchase training. The
          business confirms eligibility, availability, and evaluation details
          directly.
        </p>
        <h2>The free evaluation</h2>
        <p>
          The approximately 60-minute evaluation is offered free for eligible
          new athletes, subject to current business confirmation. Program
          recommendations, participation requirements, scheduling, and any
          subsequent paid training are discussed with the team. No performance
          outcome is guaranteed.
        </p>
        <h2>Training information</h2>
        <p>
          Content on this page describes athletic development and general
          training assessments. It is not medical advice. A mobility screening
          is not a medical examination or diagnosis. Discuss participation
          questions with the team and an appropriate healthcare professional
          when needed.
        </p>
        <h2>Using this website</h2>
        <p>
          Provide accurate adult contact information and use the form only for
          legitimate evaluation requests. Do not submit medical information or
          unnecessary information about children. Do not misuse, disrupt, or
          attempt unauthorized access to the site or its services.
        </p>
        <h2>Brand and external links</h2>
        <p>
          Parisi names and brand materials belong to their respective owners.
          This is a dedicated campaign page for Parisi Speed School Horsham. It
          does not replace the existing business website. External links are
          provided for convenience and are subject to their own terms.
        </p>
        <h2>Contact</h2>
        <p>
          Parisi Speed School Horsham
          <br />
          400 Horsham Road, Horsham, PA 19044
          <br />
          <a href="tel:+12157068260">215-706-8260</a>
          <br />
          <a href="mailto:info@parisispeedschoolhorsham.com">
            info@parisispeedschoolhorsham.com
          </a>
        </p>
        <Link href="/" className="button">
          Back to Parisi Horsham →
        </Link>
      </article>
    </main>
  );
}
