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
  consent: true,
  website: '',
  submissionId: crypto.randomUUID(),
  attribution: {},
  analyticsConsent: false,
});
async function completeForm(page: Page) {
  await expect(page.getByLabel('Preferred contact method')).toHaveCount(0);
  await page.getByLabel('Parent / guardian full name').fill('Test Guardian');
  await page
    .getByLabel('Email', { exact: false })
    .first()
    .fill('test@example.com');
  await page.getByLabel('Phone', { exact: false }).first().fill('2155550123');
  await page.getByLabel('Athlete age group').selectOption('5–11');
  await page.getByLabel('Primary sport').fill('Soccer');
  await page.locator('#consent').check();
}
async function recordedAnalytics(page: Page) {
  return page.evaluate(() => [
    ...((window as unknown as { recordedEvents: unknown[][] }).recordedEvents ||
      []),
    ...(window.dataLayer || []).flatMap((entry) =>
      entry && typeof entry === 'object' && 'event' in entry
        ? [['event', entry.event, entry]]
        : [],
    ),
  ]);
}
test.beforeEach(async ({ request, page }) => {
  await request.post(`${fixture}/reset`, { data: {} });
  await page.addInitScript(() =>
    localStorage.setItem(
      'parisi-consent',
      JSON.stringify({ allowed: false, at: Date.now() }),
    ),
  );
  await page.route(
    /https:\/\/www\.googletagmanager\.com\/(?:gtag\/js|gtm\.js)\?/,
    (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: '/* Google script isolated in local integration tests; queue calls remain observable. */',
      }),
  );
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
    for (const img of await page.locator('img').all()) {
      const src = (await img.getAttribute('src')) || '';
      if (src.startsWith('https://assets.cdn.filesafe.space/')) {
        test.info().annotations.push({
          type: 'limitation',
          description:
            'The workspace blocks the external logo CDN; original URL and transparent styling are checked separately.',
        });
        continue;
      }
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate((node) => (node as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
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
  await expect(
    page.getByText('Online requests are temporarily unavailable.', {
      exact: false,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Request my free evaluation' }),
  ).toBeEnabled();
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
  const events = await recordedAnalytics(page);
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
  expect(received[0]).not.toHaveProperty('contactMethod');
  expect(received[0].idempotencyKey).toBe(received[0].submissionId);
  await page.reload();
  const reloaded = await recordedAnalytics(page);
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
  const loaders = await page
    .locator('script[src^="https://www.googletagmanager.com/"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => (script as HTMLScriptElement).src),
    );
  expect([...new Set(external)]).toEqual(loaders);
  const events = await page.evaluate(() =>
    (window.dataLayer || [])
      .map((entry) => Array.from(entry as ArrayLike<unknown>))
      .filter((entry) => entry[0] === 'event'),
  );
  expect(events).toEqual([]);
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
test('valid submissions are not blocked by infrastructure counters', async ({
  request,
}) => {
  for (let i = 0; i < 12; i++) {
    expect(
      (
        await request.post('/api/leads', {
          headers: { origin: base },
          data: lead(),
        })
      ).status(),
    ).toBe(200);
  }
  expect(
    (await (await request.get(`${fixture}/leads`)).json()).requests,
  ).toHaveLength(12);
});
test('CRM errors re-enable the submit button and allow retry', async ({
  page,
  request,
}) => {
  await request.post(`${fixture}/mode`, { data: { mode: 'failure' } });
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Cookie preferences', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Allow analytics', exact: true })
    .click();
  await completeForm(page);
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page.locator('.submission-error[role="alert"]')).toContainText(
    'couldn’t send',
  );
  await expect(page).not.toHaveURL(/thank-you/);
  expect(
    (await recordedAnalytics(page)).filter(
      (entry) => entry[1] === 'evaluation_lead_submitted',
    ),
  ).toHaveLength(0);
  expect(
    (await (await request.get(`${fixture}/leads`)).json()).leads,
  ).toHaveLength(0);
  await request.post(`${fixture}/mode`, { data: { mode: 'success' } });
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page).toHaveURL(/thank-you/);
  expect(
    (await recordedAnalytics(page)).filter(
      (entry) => entry[1] === 'evaluation_lead_submitted',
    ),
  ).toHaveLength(1);
});
test('CRM timeout shows an error and allows retry', async ({ request }) => {
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
test('concurrent submissions are forwarded without infrastructure locks', async ({
  request,
}) => {
  await request.post(`${fixture}/mode`, { data: { mode: 'slow' } });
  const data = lead();
  const headers = { origin: base };
  const responses = await Promise.all([
    request.post('/api/leads', { headers, data }),
    request.post('/api/leads', { headers, data }),
  ]);
  expect(responses.map((r) => r.status()).sort()).toEqual([200, 200]);
  expect((await request.post('/api/leads', { headers, data })).status()).toBe(
    200,
  );
  expect(
    (await (await request.get(`${fixture}/leads`)).json()).leads,
  ).toHaveLength(1);
});

test('campaign context survives internal navigation without analytics storage', async ({
  page,
  request,
}) => {
  await page.goto(
    '/speed-agility?gclid=synthetic-click&utm_campaign=spring&email=private',
  );
  await page
    .locator('.desktop-navigation')
    .getByRole('link', { name: 'Coaching', exact: true })
    .click();
  await expect(page).toHaveURL(/\/coaching\?/);
  await expect(page).not.toHaveURL(/email=/);
  await page.locator('[data-cta="coaching-hero"]').click();
  await expect(page).toHaveURL(/\/athlete-evaluation\?/);
  expect(
    await page.evaluate(() => sessionStorage.getItem('parisi-attribution')),
  ).toBeNull();
  await completeForm(page);
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page).toHaveURL(/\/thank-you$/);
  const received = (await (await request.get(`${fixture}/leads`)).json()).leads;
  expect(received).toHaveLength(1);
  expect(received[0]).toMatchObject({
    gclid: 'synthetic-click',
    utm_campaign: 'spring',
    page: '/athlete-evaluation',
    landingPage: '/speed-agility',
    analyticsConsent: false,
  });
});

test('only the supplied GTM container is installed in the head and immediately after body', async ({
  request,
}) => {
  for (const path of [
    '/',
    '/programs',
    '/speed-agility',
    '/strength-conditioning',
    '/athlete-evaluation',
    '/coaching',
    '/faqs',
    '/contact',
    '/privacy',
    '/terms',
    '/thank-you',
  ]) {
    const response = await request.get(path);
    const html = await response.text();
    const head = html.split('</head>')[0];
    expect(head, path).toContain('GTM-KP59SXS6');
    expect(head, path).toContain('https://www.googletagmanager.com/gtm.js?id=');
    const bodyStart = html.match(/<body[^>]*>([\s\S]{0,500})/)?.[1] || '';
    // Next inserts its hidden streaming boundary before authored body content.
    expect(bodyStart, path).toMatch(
      /^(?:<div hidden="">[\s\S]*?<\/div>)?<noscript><iframe src="https:\/\/www.googletagmanager.com\/ns.html\?id=GTM-KP59SXS6"/,
    );
    expect(html, path).not.toContain('AW-18513687675');
    expect(html, path).not.toContain('G-RRL9JLXCKK');
    expect(html, path).not.toContain('googletagmanager.com/gtag/js');
  }
});

test('the supplied GTM head snippet executes once without CSP errors or duplicate loaders', async ({
  browser,
}) => {
  const context = await browser.newContext();
  await context.route('https://www.googletagmanager.com/gtm.js?*', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: 'window.__parisiGtmLoads = (window.__parisiGtmLoads || 0) + 1;',
    }),
  );
  const page = await context.newPage();
  const errors: string[] = [];
  const cspIssues: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const devtools = await context.newCDPSession(page);
  await devtools.send('Audits.enable');
  devtools.on('Audits.issueAdded', ({ issue }) => {
    if (issue.code === 'ContentSecurityPolicyIssue') cspIssues.push(issue.code);
  });
  await page.goto('/');
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { __parisiGtmLoads?: number })
            .__parisiGtmLoads || 0,
      ),
    )
    .toBe(1);
  const defaults = await page.evaluate(() =>
    Array.from((window.dataLayer || [])[0] as ArrayLike<unknown>),
  );
  expect(defaults).toMatchObject([
    'consent',
    'default',
    {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    },
  ]);
  await expect(
    page.locator('script[src*="googletagmanager.com/gtm.js"]'),
  ).toHaveAttribute(
    'src',
    'https://www.googletagmanager.com/gtm.js?id=GTM-KP59SXS6',
  );
  await page
    .getByRole('button', { name: 'Allow analytics', exact: true })
    .click();
  const updated = await page.evaluate(() =>
    (window.dataLayer || [])
      .map((entry) => Array.from(entry as ArrayLike<unknown>))
      .filter((entry) => entry[0] === 'consent' && entry[1] === 'update')
      .at(-1),
  );
  expect(updated).toMatchObject([
    'consent',
    'update',
    {
      analytics_storage: 'granted',
      ad_storage: 'granted',
    },
  ]);
  await page
    .locator('.desktop-navigation')
    .getByRole('link', { name: 'Programs', exact: true })
    .click();
  await expect(page).toHaveURL(/\/programs$/);
  await expect(
    page.locator('script[src*="googletagmanager.com/gtm.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __parisiGtmLoads?: number }).__parisiGtmLoads,
    ),
  ).toBe(1);
  expect(errors).toEqual([]);
  expect(cspIssues).toEqual([]);
  await context.close();
});
