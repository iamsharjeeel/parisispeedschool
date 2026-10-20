'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CampaignLink as Link } from '@/components/campaign-link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ageGroups, leadSchema, type LeadFields } from '@/lib/lead-schema';
import { analyticsAllowed, attribution, track } from '@/lib/tracking';
import { safePagePath } from '@/lib/campaign';
import { Arrow } from './ui';

export function LeadForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const started = useRef(false);
  const request = useRef<{ id: string; fields: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFields>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      guardianName: '',
      email: '',
      phone: '',
      sport: '',
      website: '',
      consent: false,
    },
    shouldFocusError: true,
  });
  async function submit(fields: LeadFields) {
    setServerError('');
    const data = {
      ...fields,
      attribution: attribution(),
      analyticsConsent: analyticsAllowed(),
      pagePath: location.pathname,
      landingPath:
        safePagePath(
          new URLSearchParams(location.search).get('landing_path'),
        ) || location.pathname,
    };
    const serialized = JSON.stringify(data);
    if (!request.current || request.current.fields !== serialized)
      request.current = { id: crypto.randomUUID(), fields: serialized };
    try {
      const result = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, submissionId: request.current.id }),
        signal: AbortSignal.timeout(25000),
      });
      const body = await result.json();
      if (
        !result.ok ||
        body.accepted !== true ||
        typeof body.eventId !== 'string'
      ) {
        setServerError(
          body.error ||
            'We couldn’t confirm your request. Please retry or call the team.',
        );
        return;
      }
      track('evaluation_lead_submitted', { event_id: body.eventId });
      router.push('/thank-you');
    } catch {
      setServerError(
        'We couldn’t confirm receipt. Please retry this request or call 215-706-8260.',
      );
    }
  }
  const error = (name: keyof LeadFields) =>
    errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]?.message}
      </span>
    ) : null;
  const a11y = (name: keyof LeadFields) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });
  return (
    <form
      className="lead-form"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(submit, () => track('form_validation_error'))(event);
      }}
      onFocus={() => {
        if (!started.current) {
          track('form_start');
          started.current = true;
        }
      }}
    >
      <div className="form-heading">
        <span className="eyebrow">YOUR STARTING LINE</span>
        <span className="form-free">FREE EVALUATION</span>
      </div>
      <h3>LET’S GET TO WORK.</h3>
      <p className="form-subtitle">
        Tell us a little about your athlete. We’ll take it from here.
      </p>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="guardianName">
            Parent / guardian full name <span>*</span>
          </label>
          <input
            id="guardianName"
            autoComplete="name"
            maxLength={100}
            placeholder="Your full name"
            {...register('guardianName')}
            {...a11y('guardianName')}
          />
          {error('guardianName')}
        </div>
        <div className="field">
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            {...register('email')}
            {...a11y('email')}
          />
          {error('email')}
        </div>
        <div className="field">
          <label htmlFor="phone">
            Phone <span>*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="(215) 555-0123"
            {...register('phone')}
            {...a11y('phone')}
          />
          {error('phone')}
        </div>
        <div className="field">
          <label htmlFor="ageGroup">
            Athlete age group <span>*</span>
          </label>
          <select
            id="ageGroup"
            defaultValue=""
            {...register('ageGroup')}
            {...a11y('ageGroup')}
          >
            <option value="" disabled>
              Select an age group
            </option>
            {ageGroups.map((age) => (
              <option key={age}>{age}</option>
            ))}
          </select>
          {error('ageGroup')}
        </div>
        <div className="field">
          <label htmlFor="sport">
            Primary sport <span className="optional">optional</span>
          </label>
          <input
            id="sport"
            maxLength={80}
            placeholder="e.g. Soccer"
            {...register('sport')}
            {...a11y('sport')}
          />
          {error('sport')}
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          autoComplete="off"
          tabIndex={-1}
          {...register('website')}
        />
      </div>
      <label className="consent-label" htmlFor="consent">
        <input
          id="consent"
          type="checkbox"
          {...register('consent')}
          {...a11y('consent')}
        />
        <span>
          I’m a parent, guardian, or adult athlete and agree to be contacted by
          Parisi Horsham about this request. I have read the{' '}
          <Link href="/privacy">privacy policy</Link>. This does not subscribe
          me to marketing texts.
        </span>
      </label>
      {error('consent')}
      {serverError && (
        <div className="submission-error" role="alert">
          {serverError}
        </div>
      )}
      <button
        className="button form-submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending your request…' : 'Request my free evaluation'}
        <Arrow />
      </button>
      <p className="form-footnote" aria-live="polite">
        {isSubmitting
          ? 'Please wait while we securely send your request.'
          : 'An evaluation request, not a confirmed appointment.'}
      </p>
    </form>
  );
}
