import { test, expect } from '@playwright/test';

test.describe('Label Architecture Database - Firefox Tests', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('https://rb-wam.bosch.com/dgs-ladb/05-D/labelsearch/#/');
  });

  test('Page title should contain "labelsearch"', async ({ page }) => {
    await expect(page).toHaveTitle('Labelsearch');
  });
});