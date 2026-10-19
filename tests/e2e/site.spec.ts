import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = 'http://127.0.0.1:3000';
const fixture = 'http://127.0.0.1:4319';
const lead = () => ({
  guardianName: 'Test Guardian',
  email: 'test@example.com',
  phone: '2155550123',
  ageGroup: '5–11',
  sport: 'Soccer',
  contactMethod: 'Email',
  consent: true,
  website: '',
  submissionId: crypto.randomUUID(),
  attribution: {},
  analyticsConsent: false,
});
async function completeForm(page: Page) {
  await page.getByLabel('Parent / guardian full name').fill('Test Guardian');
  await page
    .getByLabel('Email', { exact: false })
    .first()
    .fill('test@example.com');
  await page.getByLabel('Phone', { exact: false }).first().fill('2155550123');
  await page.getByLabel('Athlete age group').selectOption('5–11');
  await page.getByLabel('Primary sport').fill('Soccer');
  await page.getByLabel('Preferred contact method').selectOption('Email');
  await page.locator('#consent').check();
}
test.beforeEach(async ({ request }) => {
  await request.post(`${fixture}/reset`, { data: {} });
});

test('all public routes, metadata, security headers, and unknown route', async ({
  request,
}) => {
  for (const path of [
    '/',
    '/privacy',
    '/terms',
    '/thank-you',
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',
  ])
    expect((await request.get(path)).status(), path).toBe(200);
  const home = await request.get('/');
  expect(home.headers()['content-security-policy']).toContain(
    "object-src 'none'",
  );
  expect(home.headers()['content-security-policy']).toContain("'nonce-");
  expect(home.headers()['content-security-policy']).not.toContain(
    "script-src 'self' 'unsafe-inline'",
  );
  expect(home.headers()['x-content-type-options']).toBe('nosniff');
  expect(home.headers()['x-robots-tag']).toContain('noindex');
  expect(home.headers()['referrer-policy']).toBe(
    'strict-origin-when-cross-origin',
  );
  expect((await request.get('/missing')).status()).toBe(404);
});
for (const width of [375, 390, 768, 1024, 1440, 1920]) {
  test(`responsive layout and accessibility at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const pageErrors: string[] = [];
    const cspIssues: string[] = [];
    const devtools = await page.context().newCDPSession(page);
    await devtools.send('Audits.enable');
    devtools.on('Audits.issueAdded', ({ issue }) => {
      if (issue.code === 'ContentSecurityPolicyIssue')
        cspIssues.push(issue.code);
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole('heading', { name: 'TRAIN TO WIN.' }),
    ).toBeVisible();
    const controls = await page.locator('.button').evaluateAll((nodes) =>
      nodes.map((node) => {
        const r = node.getBoundingClientRect();
        return { left: r.left, right: r.right, width: r.width };
      }),
    );
    expect(
      controls.every((r) => r.left >= 0 && r.right <= width && r.width > 0),
    ).toBe(true);
    if (await page.locator('img').count()) {
      expect(
        await page
          .locator('img')
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      ).toBe(true);
    } else {
      test.info().annotations.push({
        type: 'limitation',
        description:
          'Genuine media unavailable: photographic image-load and crop checks are unrun.',
      });
    }
    expect(pageErrors).toEqual([]);
    expect(cspIssues).toEqual([]);
    if (width === 375 || width === 1440) {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await page.screenshot({ path: `artifacts/viewport-${width}.png` });
      await page.screenshot({
        path: `artifacts/final-${width}.png`,
        fullPage: true,
      });
    }
  });
}
test('CTAs, FAQ keyboard interaction, and accessible validation', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-cta="hero"]').click();
  await expect(page).toHaveURL(/#evaluation/);
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page.getByText('Enter your full name.')).toBeVisible();
  await expect(page.locator('#guardianName')).toBeFocused();
  await expect(page.getByText('Select an age group.')).toBeVisible();
  const question = page.locator('summary').first();
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await expect(
    page.getByRole('link', { name: 'Privacy', exact: true }),
  ).toHaveAttribute('href', '/privacy');
});
test('confirmed lead preserves attribution, fires one event, and shows signed receipt', async ({
  page,
  request,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'parisi-consent',
      JSON.stringify({ allowed: true, at: Date.now() }),
    );
    (window as unknown as { recordedEvents: unknown[][] }).recordedEvents = [];
    window.gtag = (...args: unknown[]) =>
      (
        window as unknown as { recordedEvents: unknown[][] }
      ).recordedEvents.push(args);
  });
  await page.goto(
    '/?gclid=synthetic-click&utm_source=google&utm_campaign=test-campaign&campaign_id=123&gbraid=test-gbraid&wbraid=test-wbraid&adgroup_id=456',
  );
  await completeForm(page);
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(
    page.getByRole('heading', { name: /REQUEST RECEIVED/ }),
  ).toBeVisible();
  const events = await page.evaluate(
    () => (window as unknown as { recordedEvents: unknown[][] }).recordedEvents,
  );
  expect(
    events.filter((e) => e[1] === 'evaluation_lead_submitted'),
  ).toHaveLength(1);
  expect(JSON.stringify(events)).not.toContain('test@example.com');
  expect(JSON.stringify(events)).not.toContain('Test Guardian');
  const received = (await (await request.get(`${fixture}/leads`)).json()).leads;
  expect(received).toHaveLength(1);
  expect(received[0].attribution).toMatchObject({
    gclid: 'synthetic-click',
    utm_campaign: 'test-campaign',
    campaign_id: '123',
    gbraid: 'test-gbraid',
    wbraid: 'test-wbraid',
    adgroup_id: '456',
  });
  expect(received[0]).toMatchObject({
    guardianName: 'Test Guardian',
    email: 'test@example.com',
    phone: '2155550123',
    ageGroup: '5–11',
    sport: 'Soccer',
    contactMethod: 'Email',
    consent: true,
    analyticsConsent: true,
    gclid: 'synthetic-click',
    utm_campaign: 'test-campaign',
    campaign_id: '123',
    gbraid: 'test-gbraid',
    wbraid: 'test-wbraid',
    adgroup_id: '456',
    consentPreferences: {
      evaluationContact: true,
      analytics: true,
      smsMarketing: false,
    },
  });
  expect(received[0]).not.toHaveProperty('website');
  expect(received[0].idempotencyKey).toBe(received[0].submissionId);
  await page.reload();
  const reloaded = await page.evaluate(
    () => (window as unknown as { recordedEvents: unknown[][] }).recordedEvents,
  );
  expect(
    reloaded.filter((e) => e[1] === 'evaluation_lead_submitted'),
  ).toHaveLength(0);
});
test('direct thank-you visits cannot claim success or record conversions', async ({
  page,
}) => {
  await page.goto('/thank-you');
  await expect(
    page.getByRole('heading', { name: /YOUR FIRST STEP/ }),
  ).toBeVisible();
  await expect(
    page.getByText('REQUEST RECEIVED.', { exact: false }),
  ).toHaveCount(0);
});
test('declining consent keeps analytics and attribution storage off', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (
      /google-analytics|googletagmanager|googleadservices/.test(request.url())
    )
      external.push(request.url());
  });
  await page.goto('/?gclid=synthetic-click');
  await page
    .getByRole('button', { name: 'Cookie preferences', exact: true })
    .click();
  await page.getByRole('button', { name: 'Essential only' }).click();
  expect(
    await page.evaluate(() => sessionStorage.getItem('parisi-attribution')),
  ).toBeNull();
  expect(external).toEqual([]);
  await expect(
    page.getByRole('button', { name: 'Request my free evaluation' }),
  ).toBeEnabled();
});
test('server rejects invalid input, cross-origin requests, oversized bodies and bots', async ({
  request,
}) => {
  const headers = { origin: base };
  expect(
    (
      await request.post('/api/leads', {
        headers,
        data: { ...lead(), email: 'bad' },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/leads', {
        headers,
        data: { ...lead(), website: 'spam' },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/leads', {
        headers: { origin: 'https://evil.example' },
        data: lead(),
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post('/api/leads', {
        headers,
        data: { ...lead(), sport: 'x'.repeat(9000) },
      })
    ).status(),
  ).toBe(413);
  expect(
    (
      await request.post('/api/leads', {
        headers: { origin: base, 'content-type': 'text/plain' },
        data: 'test',
      })
    ).status(),
  ).toBe(415);
});
test('idempotency survives repeated requests and rejects changed payloads', async ({
  request,
}) => {
  const data = lead();
  const headers = { origin: base };
  const first = await request.post('/api/leads', { headers, data });
  expect(first.status()).toBe(200);
  const second = await request.post('/api/leads', { headers, data });
  expect(second.status()).toBe(200);
  expect(await second.json()).toEqual(await first.json());
  expect(
    (await (await request.get(`${fixture}/leads`)).json()).leads,
  ).toHaveLength(1);
  expect(
    (
      await request.post('/api/leads', {
        headers,
        data: { ...data, sport: 'Hockey' },
      })
    ).status(),
  ).toBe(409);
});
test('rate limiting applies to server submissions', async ({ request }) => {
  for (let i = 0; i < 10; i++)
    expect(
      (
        await request.post('/api/leads', {
          headers: { origin: base },
          data: lead(),
        })
      ).status(),
    ).toBe(200);
  const rejected = await request.post('/api/leads', {
    headers: { origin: base },
    data: lead(),
  });
  expect(rejected.status()).toBe(429);
  expect(rejected.headers()['retry-after']).toBe('900');
});
test('CRM errors never show success and allow a safe retry', async ({
  page,
  request,
}) => {
  await request.post(`${fixture}/mode`, { data: { mode: 'failure' } });
  await page.goto('/');
  await completeForm(page);
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page.locator('.submission-error[role="alert"]')).toContainText(
    'couldn’t confirm',
  );
  await expect(page).not.toHaveURL(/thank-you/);
  expect(
    (await (await request.get(`${fixture}/leads`)).json()).leads,
  ).toHaveLength(0);
  await request.post(`${fixture}/mode`, { data: { mode: 'success' } });
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page).toHaveURL(/thank-you/);
});
test('CRM timeout with ambiguous acceptance retries without duplicate delivery', async ({
  request,
}) => {
  await request.post(`${fixture}/mode`, { data: { mode: 'timeout' } });
  const data = lead();
  const response = await request.post('/api/leads', {
    headers: { origin: base },
    data,
  });
  expect(response.status()).toBe(502);
  await request.post(`${fixture}/mode`, { data: { mode: 'success' } });
  expect(
    (
      await request.post('/api/leads', { headers: { origin: base }, data })
    ).status(),
  ).toBe(200);
  expect(
    (await (await request.get(`${fixture}/leads`)).json()).leads,
  ).toHaveLength(1);
});
test('mobile request flow and legal-page accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await completeForm(page);
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page).toHaveURL(/thank-you/);
  for (const path of ['/thank-you', '/privacy', '/terms']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => v.id),
      path,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test('concurrent retries deliver a single lead', async ({ request }) => {
  await request.post(`${fixture}/mode`, { data: { mode: 'slow' } });
  const data = lead();
  const headers = { origin: base };
  const responses = await Promise.all([
    request.post('/api/leads', { headers, data }),
    request.post('/api/leads', { headers, data }),
  ]);
  expect(responses.map((r) => r.status()).sort()).toEqual([200, 409]);
  expect((await request.post('/api/leads', { headers, data })).status()).toBe(
    200,
  );
  expect(
    (await (await request.get(`${fixture}/leads`)).json()).leads,
  ).toHaveLength(1);
});
