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
        CRM_WEBHOOK_URL: 'http://127.0.0.1:4319/crm',
        CRM_WEBHOOK_TOKEN: 'local-crm-token',
        UPSTASH_REDIS_REST_URL: 'http://127.0.0.1:4319/redis',
        UPSTASH_REDIS_REST_TOKEN: 'local-test-token',
        LEAD_HASH_SECRET: 'test-only-hash-secret-never-use-in-production',
        SITE_URL: '',
        MEDIA_APPROVED: 'false',
        LAUNCH_APPROVED: 'false',
      },
    },
  ],
});
