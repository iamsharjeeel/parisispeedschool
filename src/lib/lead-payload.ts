import { attributionKeys, type Submission } from './lead-schema';
import { siteUrl } from './config';

/** Flat form fields are directly selectable in LeadConnector's webhook mapper. */
export function buildLeadPayload(input: Submission, eventId: string) {
  const attribution = Object.fromEntries(
    attributionKeys.map((key) => [key, input.attribution[key] ?? null]),
  ) as Record<(typeof attributionKeys)[number], string | null>;
  return {
    event: 'evaluation_request',
    eventId,
    submissionId: input.submissionId,
    idempotencyKey: input.submissionId,
    guardianName: input.guardianName,
    email: input.email,
    phone: input.phone,
    ageGroup: input.ageGroup,
    sport: input.sport,
    contactMethod: input.contactMethod,
    consent: input.consent,
    analyticsConsent: input.analyticsConsent,
    ...attribution,
    source:
      input.attribution.gclid ||
      input.attribution.gbraid ||
      input.attribution.wbraid ||
      (input.attribution.utm_source === 'google' &&
        /^(cpc|ppc|paidsearch)$/.test(input.attribution.utm_medium || ''))
        ? 'Google Ads'
        : 'Website',
    campaign:
      input.attribution.campaign_id || input.attribution.utm_campaign || null,
    page: `${siteUrl() || ''}${input.pagePath}`,
    landingPage: `${siteUrl() || ''}${input.landingPath || input.pagePath}`,
    submittedAt: new Date().toISOString(),
    attribution: input.attribution,
    consentPreferences: {
      evaluationContact: input.consent,
      analytics: input.analyticsConsent,
      smsMarketing: false,
      disclosureVersion: '2026-10-18',
    },
  };
}
