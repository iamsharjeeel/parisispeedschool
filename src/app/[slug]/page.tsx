import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, CTA, PhoneIcon } from '@/components/ui';
import { LeadForm } from '@/components/lead-form';
import { assessments, business, faqs, programs } from '@/lib/content';
import { pageLinks, trainingPages } from '@/lib/site-pages';
import { siteUrl } from '@/lib/config';

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(trainingPages).map((slug) => ({ slug }));
}

function getPage(slug: string) {
  if (!Object.hasOwn(trainingPages, slug)) notFound();
  return trainingPages[slug];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  const origin = siteUrl();
  return {
    title: page.title,
    description: page.description,
    ...(origin ? { alternates: { canonical: `${origin}/${slug}` } } : {}),
    openGraph: {
      title: page.title,
      description: page.description,
      ...(origin ? { url: `${origin}/${slug}` } : {}),
    },
  };
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPage(slug);
  const evaluation = slug === 'athlete-evaluation';
  const ctaHref = evaluation ? '#evaluation' : '/athlete-evaluation#evaluation';
  const related = pageLinks
    .filter((item) => item.href !== `/${slug}`)
    .slice(0, 3);
  return (
    <main id="main" className={`detail-page detail-${slug}`}>
      <section className="detail-hero" aria-labelledby="detail-title">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">
              {pageLinks.find((item) => item.href === `/${slug}`)?.label}
            </span>
          </nav>
          <div className="detail-hero-grid">
            <div>
              <p className="eyebrow">
                <span />
                {page.eyebrow}
              </p>
              <h1 id="detail-title">
                {page.heading}
                <br />
                <span>{page.emphasis}</span>
              </h1>
              <p className="detail-intro">{page.intro}</p>
              <div className="detail-hero-actions">
                <CTA href={ctaHref} placement={`${slug}-hero`}>
                  Request a free evaluation
                </CTA>
                <a className="detail-call" href={`tel:${business.telephone}`}>
                  <PhoneIcon />
                  {business.phone}
                </a>
              </div>
              <p className="detail-eligibility">
                For eligible new athletes. Your appointment is arranged with our
                team.
              </p>
            </div>
            <aside
              className="detail-hero-panel"
              aria-label="Training at Parisi Horsham"
            >
              <span className="eyebrow">PARISI SPEED SCHOOL / HORSHAM</span>
              <span className="detail-marker">{page.marker}</span>
              <span className="detail-marker-label">{page.markerLabel}</span>
              <div className="detail-panel-bottom">
                <span>TRAIN WITH PURPOSE.</span>
                <Arrow diagonal />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="section detail-content"
        aria-labelledby="detail-section-title"
      >
        <div className="container">
          <div className="detail-section-heading">
            <div>
              <p className="eyebrow">
                <span />
                {page.sectionLabel}
              </p>
              <h2 id="detail-section-title">{page.sectionTitle}</h2>
            </div>
            <p>{page.sectionIntro}</p>
          </div>

          {page.features.length > 0 && (
            <div className="detail-feature-grid">
              {page.features.map((feature, index) => (
                <article className="detail-feature" key={feature.title}>
                  <span className="detail-feature-number">
                    0{index + 1}
                    <Arrow diagonal />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          )}

          {slug === 'programs' && (
            <div className="program-grid detail-programs">
              {programs.map((program) => (
                <article className="program" key={program.name}>
                  <div className="program-top">
                    <span>{program.ages}</span>
                    <b>{program.number}</b>
                  </div>
                  <h3>{program.name}</h3>
                  <h4>{program.text}</h4>
                  <p>{program.detail}</p>
                  <Link
                    href="/athlete-evaluation#evaluation"
                    data-cta={`program-page-${program.number}`}
                    aria-label={`Request an evaluation for ${program.name}`}
                  >
                    FIND YOUR STARTING POINT
                    <Arrow />
                  </Link>
                </article>
              ))}
            </div>
          )}

          {evaluation && (
            <div className="assessment-grid detail-assessments">
              {assessments.map((item) => (
                <article className="assessment" key={item.number}>
                  <div className="assessment-top">
                    <span>{item.number}</span>
                    <Arrow diagonal />
                  </div>
                  <h3>{item.title}</h3>
                  <h4>{item.subtitle}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          )}

          {slug === 'faqs' && (
            <div className="faq-list detail-faqs">
              {faqs.map((item, index) => (
                <details key={item.question}>
                  <summary>
                    <span className="faq-number">0{index + 1}</span>
                    <span>{item.question}</span>
                    <span className="faq-plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
              <details>
                <summary>
                  <span className="faq-number">07</span>
                  <span>How do I find current pricing and class times?</span>
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>
                  Contact the Horsham team at{' '}
                  <a href={`tel:${business.telephone}`}>{business.phone}</a> to
                  discuss current pricing, schedules, and availability for your
                  athlete’s program.
                </p>
              </details>
              <details>
                <summary>
                  <span className="faq-number">08</span>
                  <span>
                    Do I need to choose a program before requesting an
                    evaluation?
                  </span>
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>
                  No. Share your athlete’s age, sport, and experience in your
                  request. The team can discuss program fit and training
                  priorities with you.
                </p>
              </details>
            </div>
          )}

          {slug === 'contact' && (
            <div className="contact-grid">
              <a className="contact-card" href={`tel:${business.telephone}`}>
                <PhoneIcon />
                <span>CALL THE TEAM</span>
                <h3>{business.phone}</h3>
                <p>
                  Programs, evaluations, and questions about getting started.
                </p>
                <Arrow diagonal />
              </a>
              <a className="contact-card" href={`mailto:${business.email}`}>
                <span>EMAIL PARISI HORSHAM</span>
                <h3>Drop us a line.</h3>
                <p className="contact-email">{business.email}</p>
                <Arrow diagonal />
              </a>
              <a
                className="contact-card contact-address"
                href={business.maps}
                target="_blank"
                rel="noreferrer"
              >
                <span>GET DIRECTIONS</span>
                <h3>{business.street}</h3>
                <p>{business.locality}</p>
                <span className="contact-map-label">
                  Open in Google Maps <Arrow diagonal />
                </span>
              </a>
            </div>
          )}

          {page.note && <p className="detail-note">{page.note}</p>}
        </div>
      </section>

      {page.steps && (
        <section
          className="section detail-steps-section"
          aria-labelledby="steps-title"
        >
          <div className="container">
            <p className="eyebrow">
              <span />A CLEAR WAY FORWARD
            </p>
            <h2 id="steps-title">{page.stepsTitle}</h2>
            <ol className="detail-steps">
              {page.steps.map((step, index) => (
                <li key={step.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {evaluation && (
        <section
          className="section lead-section"
          id="evaluation"
          aria-labelledby="evaluation-request-title"
        >
          <div className="container lead-layout">
            <div className="lead-copy">
              <p className="eyebrow">
                <span />
                YOUR NEXT LEVEL STARTS HERE
              </p>
              <h2 id="evaluation-request-title">
                TAKE THE
                <br />
                <span>FIRST STEP.</span>
              </h2>
              <p>
                Request your free athlete evaluation. The Horsham team will
                contact you to discuss eligibility and arrange your next step.
              </p>
              <div className="lead-call">
                <span>RATHER TALK IT THROUGH?</span>
                <a href={`tel:${business.telephone}`}>
                  <PhoneIcon />
                  {business.phone}
                  <Arrow diagonal />
                </a>
              </div>
              <p className="lead-disclaimer">
                No paid enrollment is required to send a request. Sending this
                form does not confirm an appointment.
              </p>
            </div>
            <LeadForm />
          </div>
        </section>
      )}

      {!evaluation && (
        <section className="detail-next-section">
          <div className="container detail-next-panel">
            <div>
              <p className="eyebrow">YOUR ATHLETE. YOUR NEXT STEP.</p>
              <h2>
                START WITH
                <br />
                <span>A CONVERSATION.</span>
              </h2>
              <p>
                Meet your starting point with a free athlete evaluation for
                eligible new athletes.
              </p>
            </div>
            <div>
              <CTA href={ctaHref} placement={`${slug}-bottom`}>
                Request a free evaluation
              </CTA>
              <a className="detail-call" href={`tel:${business.telephone}`}>
                Or call {business.phone}
                <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
      )}

      <section
        className="section detail-related"
        aria-labelledby="related-title"
      >
        <div className="container">
          <p className="eyebrow">KEEP EXPLORING</p>
          <h2 id="related-title">
            FIND YOUR <span>WAY FORWARD.</span>
          </h2>
          <div className="explore-grid">
            {related.map((item) => (
              <Link className="explore-card" href={item.href} key={item.href}>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
                <Arrow diagonal />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
