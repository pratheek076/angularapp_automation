import { firefox } from '@playwright/test';

async function globalSetup() {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://rb-wam.bosch.com/dgs-ladb/05-D/labelsearch/#/');
  const isLoginPage =
    (await page.title()).toLowerCase().includes('login') &&
    (await page.locator('input[name="username"]').isVisible());

  if (isLoginPage) {
    await page.fill('input[name="username"]', 'tgg3kor');
    await page.fill('input[name="password"]', 'Bangalore123@#$');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/labelsearch/#/**');
  }

  await context.storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;
