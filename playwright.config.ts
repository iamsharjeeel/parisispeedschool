import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    browserName: 'chromium',
    launchOptions: {
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : {}),
      args: ['--no-sandbox'],
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node tests/fixtures/integration-server.mjs',
      url: 'http://127.0.0.1:4319/health',
      reuseExistingServer: false,
    },
    {
      command: 'npm run start',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: false,
      timeout: 90000,
      env: {
        LOCAL_INTEGRATION_TEST: 'true',
        CRM_WEBHOOK_URL: '',
        crm_webhook_url: '',
        CRM_WEBOOK_URL: '',
        crm_webook_url: 'http://127.0.0.1:4319/crm',
        SITE_URL: '',
        MEDIA_APPROVED: 'false',
        LAUNCH_APPROVED: 'false',
      },
    },
  ],
});
