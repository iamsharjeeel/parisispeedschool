# Security and privacy review

The final production-only npm audit found zero known vulnerabilities. The full audit found five high entries in the development-only Next ESLint → fast-glob → micromatch → braces chain, all rooted in [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), a stack-exhaustion issue with deeply nested patterns. The current braces release is 3.0.3 and no compatible patched version was available. These packages process repository lint patterns, not public form input, and are not production dependencies. Do not feed attacker-controlled glob patterns to development tools; track the upstream patch. An unrelated older sharp development dependency was removed; Next uses patched sharp 0.35.5. No force downgrade or integrity bypass was used to silence audit findings.

Implemented protections: strict server/client Zod validation, length and character limits, 8 KiB streaming request-body cap, same-origin checks, no CORS grants, honeypot, shared atomic rate limits, durable replay records, HTTPS-only external integrations, redirect refusal, outbound timeouts, explicit success confirmation, signed short-lived receipts, generic errors, and no application logging of lead bodies or secrets.

CSP uses a fresh request nonce and `strict-dynamic` for Next/approved analytics scripts. Script `unsafe-inline` is not enabled. Styles permit inline styling needed by Next Image; objects, framing, base URI, and form actions are constrained. Additional headers include HSTS, nosniff, frame denial, strict-origin referrers, and disabled camera/microphone/location/payment capabilities. Vercel provides HTTPS; production CSP upgrades insecure requests. Review any custom-domain subdomains before inheriting HSTS policy.

Credentials remain server-only. The test fixture and credentials are local synthetic fixtures. No secrets are bundled under `NEXT_PUBLIC_`. No remote URL is accepted from a form field. Optional analytics are denied until consent. No child names, birth dates, or health details are requested. No SMS marketing enrollment is offered. The JSON-LD is generated only from controlled business configuration and escapes `<` before insertion.

Limitations requiring operations/business review:

- Real CRM and Redis account operation, permissions, retention, downstream idempotency, data-processing terms, and deletion workflow need live verification.
- The privacy and terms copy is a review draft describing the implementation; legal compliance is not claimed. The business must confirm processor identities and a concrete CRM retention policy before `PRIVACY_APPROVED=true`.
- Honeypot and rate limiting are low-friction controls, not proof of a human. If abuse occurs, add an approved managed challenge and update CSP/privacy after testing.
- Credential-bearing webhook URLs must be treated as secrets. Allowlisted deployment administrators control endpoints; endpoint restrictions are not a universal DNS-rebinding defense for untrusted administrators.
- GTM must be reviewed independently; arbitrary third-party tags can defeat otherwise privacy-safe analytics configuration.
- Review deployments must use Vercel Deployment Protection; `noindex` is not access control.
- API/browser automated tests do not constitute a full penetration test, screen-reader audit, or legal review.
