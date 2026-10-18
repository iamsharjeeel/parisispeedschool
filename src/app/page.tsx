import Image from 'next/image';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Arrow, CTA, PhoneIcon, SectionHeading } from '@/components/ui';
import { LeadForm } from '@/components/lead-form';
import { assets } from '@/lib/assets';
import { assessments, business, faqs, programs } from '@/lib/content';
import { leadIntegrationReady, siteUrl } from '@/lib/config';
export const metadata: Metadata = {
  ...(siteUrl() ? { alternates: { canonical: `${siteUrl()}/` } } : {}),
};

export default async function Home() {
  const nonce = (await headers()).get('x-nonce') || '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: business.name,
    telephone: business.telephone,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      addressLocality: 'Horsham',
      addressRegion: 'PA',
      postalCode: '19044',
      addressCountry: 'US',
    },
    ...(siteUrl() ? { url: siteUrl() } : {}),
  };
  return (
    <main id="main">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <section
        className={`hero ${assets.approved ? 'hero-with-photo' : ''}`}
        aria-labelledby="hero-title"
      >
        {assets.approved && (
          <Image
            className="hero-photo"
            src={assets.hero}
            fill
            sizes="100vw"
            alt="An athlete practicing sprint acceleration at Parisi Horsham"
            priority
            quality={85}
          />
        )}
        <div className="hero-track" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="eyebrow">
              <span />
              PARISI SPEED SCHOOL <b>/</b> HORSHAM, PA
            </p>
            <h1 id="hero-title">
              TRAIN
              <br />
              TO <em>WIN.</em>
            </h1>
            <h2>BUILD SPEED. STRENGTH. CONFIDENCE.</h2>
            <p className="hero-description">
              Better athletes start here. Youth performance training built on
              expert coaching, purposeful movement, and measurable progress.
            </p>
            <div className="hero-actions">
              <CTA placement="hero">Request a free athlete evaluation</CTA>
              <a href={`tel:${business.telephone}`} className="hero-phone">
                <PhoneIcon />
                {business.phone}
              </a>
            </div>
            <p className="hero-note">
              For eligible new athletes. Your first step starts with a
              conversation.
            </p>
          </div>
          {!assets.approved && (
            <div className="hero-editorial" aria-hidden="true">
              <span className="vertical-label">
                HORSHAM, PENNSYLVANIA · ATHLETE DEVELOPMENT
              </span>
              <div className="editorial-word">
                EVERY
                <br />
                ATHLETE.
                <br />
                <span>
                  MORE
                  <br />
                  POSSIBLE.
                </span>
              </div>
              <div className="hero-cross">+</div>
              <div className="editorial-footer">
                <span>PUT IN THE WORK.</span>
                <span>FIND YOUR NEXT LEVEL. ↗</span>
              </div>
            </div>
          )}
          <a className="hero-scroll" href="#the-evaluation">
            <span>BUILT FOR WHAT’S NEXT</span>
            <span>SCROLL TO DISCOVER ↓</span>
          </a>
        </div>
      </section>
      <div className="trust-strip">
        <div className="container">
          <div>
            <b>60</b>
            <span>
              MINUTE
              <br />
              EVALUATION
            </span>
          </div>
          <span className="trust-divider" />
          <div>
            <b>VALD</b>
            <span>
              SMARTSPEED
              <br />
              LASER TIMING
            </span>
          </div>
          <span className="trust-divider" />
          <div>
            <span className="trust-check">✓</span>
            <span>
              CERTIFIED
              <br />
              PARISI COACHES
            </span>
          </div>
          <span className="trust-caption">
            A STRONGER START.
            <br />A CLEARER PATH FORWARD.
          </span>
        </div>
      </div>

      <section className="section evaluation-benefits" id="the-evaluation">
        <div className="container">
          <div className="intro-split">
            <SectionHeading
              label="THE FREE ATHLETE EVALUATION"
              title={
                <>
                  YOUR STARTING POINT
                  <br />
                  TO <span>BETTER PERFORMANCE.</span>
                </>
              }
            />
            <div className="intro-copy">
              <p>
                Every athlete has a starting line.
                <br />
                Let’s find yours.
              </p>
              <p>
                In approximately 60 minutes, we’ll assess how your athlete
                moves, identify a baseline, and talk through the next step in
                their development.
              </p>
            </div>
          </div>
          <div className="assessment-grid">
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
          <div className="assessment-bottom">
            <p>
              <b>Leave with perspective.</b> Get performance insights and
              guidance on the right training path.
            </p>
            <a className="text-link" href="#evaluation" data-cta="assessment">
              Find your starting point
              <Arrow />
            </a>
          </div>
          <p className="small-note">
            The mobility screening is a training assessment, not a medical
            evaluation or diagnosis.
          </p>
        </div>
      </section>

      <section className="section why-section">
        <div className="container">
          <div className="intro-split">
            <SectionHeading
              light
              label="THE PARISI DIFFERENCE"
              title={
                <>
                  NOT JUST TRAINING.
                  <br />
                  <span>MEASURABLE PROGRESS.</span>
                </>
              }
            />
            <p className="section-intro">
              A purposeful approach to athletic development. Coaches who see the
              individual. Training that builds beyond the game.
            </p>
          </div>
          <div className="benefit-grid">
            {[
              {
                name: 'SPEED',
                label: 'MOVE WITH PURPOSE.',
                text: 'Build acceleration, sprint mechanics, and movement efficiency. Turn better technique into more confident movement.',
                image: assets.speed,
                alt: 'Resisted sprint training at Parisi Horsham',
                number: '01',
                graphic: 'speed',
              },
              {
                name: 'STRENGTH',
                label: 'BUILD YOUR FOUNDATION.',
                text: 'Develop age-appropriate strength and athletic power, guided by coaches who put good movement first.',
                image: assets.strength,
                alt: 'Strength and conditioning at Parisi Horsham',
                number: '02',
                graphic: 'strength',
              },
              {
                name: 'PERFORMANCE',
                label: 'KNOW YOUR NEXT STEP.',
                text: 'Use structured coaching and available testing technology to understand your starting point and follow your progress.',
                image: assets.performance,
                alt: 'Agility drills at Parisi Horsham',
                number: '03',
                graphic: 'performance',
              },
            ].map((item) => (
              <article className="benefit" key={item.name}>
                <div className={`benefit-visual ${item.graphic}`}>
                  {assets.approved ? (
                    <Image
                      src={item.image}
                      fill
                      sizes="(max-width: 700px) 100vw, 33vw"
                      alt={item.alt}
                    />
                  ) : (
                    <div className="benefit-motif" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  )}
                  <span className="visual-number">/{item.number}</span>
                  <h3>{item.name}</h3>
                </div>
                <div className="benefit-copy">
                  <h4>{item.label}</h4>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section facility-section">
        <div className="container">
          <div className="intro-split">
            <SectionHeading
              label="WELCOME TO YOUR HOME TURF"
              title={
                <>
                  REAL ATHLETES.
                  <br />
                  REAL COACHING.
                  <br />
                  <span>REAL TRAINING.</span>
                </>
              }
            />
            <div className="facility-intro">
              <div className="facility-stat">
                <strong>70</strong>
                <span>
                  YARDS OF
                  <br />
                  TRAINING TURF
                </span>
              </div>
              <p>
                Room to move. Space to grow. A dedicated training environment
                right here in Horsham, built around athletic development.
              </p>
              <a
                className="text-link"
                href={business.maps}
                target="_blank"
                rel="noreferrer"
              >
                400 Horsham Road, Horsham, PA
                <Arrow diagonal />
              </a>
            </div>
          </div>
          {assets.approved ? (
            <div className="facility-gallery">
              <figure>
                <Image
                  src={assets.facility}
                  width={1200}
                  height={800}
                  sizes="(max-width: 700px) 100vw, 60vw"
                  alt="The actual training environment at Parisi Speed School Horsham"
                />
                <figcaption>ROOM TO PUT IN THE WORK.</figcaption>
              </figure>
              <figure>
                <Image
                  src={assets.group}
                  width={800}
                  height={800}
                  sizes="(max-width: 700px) 100vw, 40vw"
                  alt="Athletes training together at Parisi Horsham"
                />
                <figcaption>BETTER, TOGETHER.</figcaption>
              </figure>
            </div>
          ) : (
            <div className="facility-track">
              <div className="track-lanes" aria-hidden="true">
                <span>01</span>
                <span>02</span>
                <span>03</span>
              </div>
              <div>
                <p className="eyebrow">400 HORSHAM ROAD</p>
                <p className="facility-statement">
                  YOUR GAME.
                  <br />
                  OUR HOME TURF.
                </p>
                <span>
                  HORSHAM, PA 19044 <Arrow diagonal />
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section programs-section">
        <div className="container">
          <SectionHeading
            label="FIND YOUR PROGRAM"
            title={
              <>
                BUILT FOR EVERY STAGE
                <br />
                OF <span>DEVELOPMENT.</span>
              </>
            }
          >
            From first steps to the next level. A clear path, with the right
            challenge at the right time.
          </SectionHeading>
          <div className="program-grid">
            {programs.map((program) => (
              <article className="program" key={program.name}>
                <div className="program-top">
                  <span>{program.ages}</span>
                  <b>{program.number}</b>
                </div>
                <h3>{program.name}</h3>
                <h4>{program.text}</h4>
                <p>{program.detail}</p>
                <a
                  href="#evaluation"
                  data-cta={`program-${program.number}`}
                  aria-label={`Start with an evaluation for ${program.name}`}
                >
                  START WITH AN EVALUATION
                  <Arrow />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="coaching-section">
        <div className="container coaching-grid">
          <div className="coaching-visual">
            {assets.approved ? (
              <Image
                src={assets.coaching}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Individual coaching during a Parisi Horsham training session"
              />
            ) : (
              <div className="coaching-type" aria-hidden="true">
                <span>SHOW UP.</span>
                <span>
                  PUT IN
                  <br />
                  THE WORK.
                </span>
                <span className="red">
                  GROW
                  <br />
                  TOGETHER.
                </span>
                <b>THE PARISI APPROACH ↗</b>
              </div>
            )}
          </div>
          <div className="coaching-copy">
            <SectionHeading
              label="GOOD COACHING CHANGES EVERYTHING"
              title={
                <>
                  COACHING THAT
                  <br />
                  MAKES THE
                  <br />
                  <span>DIFFERENCE.</span>
                </>
              }
            />
            <p>
              Behind every drill is a purpose. Behind every athlete is a coach
              who’s paying attention.
            </p>
            <p>
              Certified Parisi Speed Coaches bring structure, personal
              attention, and a focus on athletic development to each session.
              Your athlete gets guidance that helps them understand the work—and
              confidence to keep going.
            </p>
            <ul>
              <li>Certified Parisi Speed Coaches</li>
              <li>Age-appropriate, structured training</li>
              <li>A focus on the individual athlete</li>
            </ul>
            <CTA placement="coaching">Meet your next step</CTA>
          </div>
        </div>
      </section>

      <section className="section lead-section" id="evaluation">
        <div className="container lead-layout">
          <div className="lead-copy">
            <p className="eyebrow">
              <span />
              YOUR NEXT LEVEL STARTS HERE
            </p>
            <h2>
              TAKE THE
              <br />
              <span>FIRST STEP.</span>
            </h2>
            <p>
              Request a free athlete evaluation at Parisi Speed School Horsham.
              Our team will contact you to discuss the next steps.
            </p>
            <ol className="next-steps">
              <li>
                <span>01</span>
                <div>
                  <h3>SEND YOUR REQUEST</h3>
                  <p>A few details. One clear next step.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>CONNECT WITH OUR TEAM</h3>
                  <p>We’ll discuss eligibility and arrange a time.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>FIND YOUR STARTING LINE</h3>
                  <p>Meet your coach. Explore your potential.</p>
                </div>
              </li>
            </ol>
            <div className="lead-call">
              <span>RATHER TALK IT THROUGH?</span>
              <a href={`tel:${business.telephone}`}>
                <PhoneIcon />
                {business.phone}
                <Arrow diagonal />
              </a>
            </div>
            <p className="lead-disclaimer">
              Free for eligible new athletes, subject to current business
              confirmation. No paid enrollment is required to send a request.
            </p>
          </div>
          <LeadForm available={leadIntegrationReady()} />
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-layout">
          <SectionHeading
            label="GOOD QUESTIONS. STRAIGHT ANSWERS."
            title={
              <>
                BEFORE YOU
                <br />
                <span>GET STARTED.</span>
              </>
            }
          />
          <div className="faq-list">
            {faqs.map((item, i) => (
              <details key={item.question}>
                <summary>
                  <span className="faq-number">0{i + 1}</span>
                  <span>{item.question}</span>
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <p className="eyebrow">MORE THAN A WORKOUT. A WAY FORWARD.</p>
          <h2>
            YOUR ATHLETE’S NEXT LEVEL
            <br />
            STARTS <span>HERE.</span>
          </h2>
          <div>
            <CTA placement="final" className="button-white">
              Request a free athlete evaluation
            </CTA>
            <a href={`tel:${business.telephone}`} className="final-call">
              Call Parisi Horsham
              <Arrow diagonal />
            </a>
          </div>
          <span className="final-coordinate" aria-hidden="true">
            HORSHAM, PA / TRAIN WITH PURPOSE
          </span>
        </div>
      </section>
      <div className="mobile-bottom">
        <a href={`tel:${business.telephone}`} aria-label="Call Parisi Horsham">
          <PhoneIcon />
          <span>CALL</span>
        </a>
        <a href="#evaluation" data-cta="mobile">
          FREE ATHLETE EVALUATION
          <Arrow />
        </a>
      </div>
    </main>
  );
}
