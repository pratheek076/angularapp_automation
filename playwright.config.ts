import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 95000,
  /* Run tests in files serially, not in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Run only one worker (disable parallel tests) */
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
   //storageState: 'storageState.json',
    // Other use configurations...
    headless: process.env.CI ? true : false,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
         //...devices['Desktop Chrome'],
             launchOptions: {
      args: ['--start-maximized'], 
      },
        viewport: null,
       },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: null,
      },
    },
  ],

  /* Run your local dev server before starting the tests (optional) */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

