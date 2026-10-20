import { z } from 'zod';
import { attributionKeys, safePagePath } from './campaign';
export { attributionKeys } from './campaign';
// Use Zod's interpreter so validation never attempts eval under the production CSP.
z.config({ jitless: true });
export const ageGroups = [
  '5–11',
  '12–15',
  '16–18',
  'High School / College',
  'Other / Please Discuss',
] as const;
const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(
      (v) => !/[\u0000-\u001f\u007f<>]/.test(v),
      'Please use plain text.',
    );
export const leadSchema = z.object({
  guardianName: text(100).min(2, 'Enter your full name.'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(254)
    .transform((v) => v.toLowerCase()),
  phone: text(30).refine(
    (v) =>
      /^[+()\d\s.\-]+$/.test(v) &&
      v.replace(/\D/g, '').length >= 10 &&
      v.replace(/\D/g, '').length <= 15,
    'Enter a valid phone number.',
  ),
  ageGroup: z.enum(ageGroups, { error: 'Select an age group.' }),
  sport: text(80),
  consent: z
    .boolean()
    .refine((v) => v, 'Please agree so the team can respond to your request.'),
  website: z.string().max(0, 'Unable to submit this request.'),
});
export type LeadFields = z.input<typeof leadSchema>;
export const attributionSchema = z
  .object(
    Object.fromEntries(
      attributionKeys.map((key) => [
        key,
        z
          .string()
          .max(250)
          .regex(/^[^\u0000-\u001f<>]*$/)
          .optional(),
      ]),
    ),
  )
  .strict();
export const submissionSchema = leadSchema
  .extend({
    submissionId: z.uuid(),
    attribution: attributionSchema,
    analyticsConsent: z.boolean(),
    pagePath: z
      .string()
      .refine((value) => Boolean(safePagePath(value)))
      .default('/'),
    landingPath: z
      .string()
      .refine((value) => Boolean(safePagePath(value)))
      .optional(),
  })
  .strict();
export type Submission = z.infer<typeof submissionSchema>;
