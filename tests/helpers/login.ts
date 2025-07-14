import { Page } from '@playwright/test';

export async function performLogin(page: Page) {
  const isLoginPage = (await page.title()).toLowerCase().includes('login') &&
                      await page.locator('input[name="username"]').count() > 0;

  if (isLoginPage) {
    await page.locator('input[name="username"]').fill('tgg3kor');
    await page.locator('input[name="password"]').fill('Bangalore123@#$');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
  }
}

