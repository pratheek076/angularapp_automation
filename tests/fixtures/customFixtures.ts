import { test as baseTest, Page, BrowserContext } from '@playwright/test';
import { performLogin } from '../helpers/login';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;

type MyFixtures = {
  loggedInPage: (url?: string) => Promise<Page>;
};

export const test = baseTest.extend<MyFixtures>({
  loggedInPage: async ({ browser }, use) => {
    let context: BrowserContext | undefined;

    const fn = async (targetUrl?: string): Promise<Page> => {
      context = await browser.newContext();
      const page = await context.newPage();


      await page.goto(BASE_URL);
      await performLogin(page);

  
      if (targetUrl && targetUrl !== BASE_URL) {
        await page.goto(targetUrl);
      }

      return page;
    };

    await use(fn);

    if (context) {
      await context.close(); 
    }
  }
});
