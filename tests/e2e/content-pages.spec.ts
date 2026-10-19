import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'parisi-consent',
      JSON.stringify({ allowed: false, at: Date.now() }),
    ),
  );
});

const paths = [
  '/programs',
  '/speed-agility',
  '/strength-conditioning',
  '/athlete-evaluation',
  '/coaching',
  '/faqs',
  '/contact',
];

test('each linked destination has its own content and complete navigation', async ({
  page,
  request,
}) => {
  const headings = new Set<string>();
  const titles = new Set<string>();
  for (const path of paths) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('.brand-mark').first()).toHaveCSS(
      'background-color',
      'rgba(0, 0, 0, 0)',
    );
    headings.add((await page.locator('main h1').textContent()) || '');
    titles.add(await page.title());
    for (const destination of paths)
      await expect(
        page.locator(`.footer-pages a[href="${destination}"]`),
      ).toBeVisible();
    await expect(page.locator('.brand img').first()).toHaveAttribute(
      'src',
      'https://assets.cdn.filesafe.space/OvJwbyYdrzzTkNVRnie5/media/6ad69a053b8fa9783e767b62.png',
    );
  }
  expect(headings.size).toBe(paths.length);
  expect(titles.size).toBe(paths.length);
  expect((await request.get('/unknown-training-page')).status()).toBe(404);
});

test('mobile navigation opens, closes with Escape, and follows a page link', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .locator('#site-menu')
    .getByRole('link', { name: 'Speed & agility' })
    .click();
  await expect(page).toHaveURL(/\/speed-agility$/);
  await expect(page.locator('h1')).toContainText('NEXT GEAR.');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.locator('.mobile-bottom [data-cta="mobile"]').click();
  await expect(page).toHaveURL(/\/athlete-evaluation#evaluation$/);
  await expect(page.locator('#guardianName')).toBeVisible();
});

test('the dedicated evaluation page submits to the synthetic webhook and confirms receipt', async ({
  page,
  request,
}) => {
  await request.post('http://127.0.0.1:4319/reset', { data: {} });
  await page.goto('/athlete-evaluation#evaluation');
  await page.getByLabel('Parent / guardian full name').fill('Test Guardian');
  await page
    .getByLabel('Email', { exact: false })
    .first()
    .fill('test@example.com');
  await page.getByLabel('Phone', { exact: false }).first().fill('2155550123');
  await page.getByLabel('Athlete age group').selectOption('5–11');
  await page.getByLabel('Primary sport').fill('Soccer');
  await page.locator('#consent').check();
  await page
    .getByRole('button', { name: 'Request my free evaluation' })
    .click();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(page.locator('h1')).toContainText('REQUEST RECEIVED.');
});
