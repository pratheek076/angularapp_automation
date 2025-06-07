import { firefox } from '@playwright/test';
import path from 'path';
import readline from 'readline';

(async () => {
  // Launch Firefox with visible browser
  const browser = await firefox.launch({ 
    headless: false,
    slowMo: 100 // Slows down for better visibility
  });
  
  const context = await browser.newContext({
    viewport: null // This will use the browser's default viewport size
  });
  
  const page = await context.newPage();

  console.log('Navigating to login page...');
  await page.goto('https://rb-wam.bosch.com/dgs-ladb/05-D/labelsearch/#/', {
    waitUntil: 'domcontentloaded'
  });

  console.log('\n=== MANUAL LOGIN REQUIRED ===');
  console.log('1. Enter your credentials in the Firefox window');
  console.log('2. Complete any 2FA/MFA steps if required');
  console.log('3. Wait until you reach the application dashboard');
  console.log('4. Return here and press Enter\n');

  // Set up terminal input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Wait for user confirmation
  await new Promise<void>(resolve => {
    rl.question('Press Enter AFTER completing login in browser...', () => {
      rl.close();
      resolve();
    });
  });

  // Quick verification
  try {
    await page.waitForURL(/labelsearch/i, { timeout: 5000 });
    console.log('✔ Login URL verified');
  } catch {
    console.log('⚠ Could not verify dashboard URL - continuing anyway');
  }

  // Save state
  const authStatePath = path.join(process.cwd(), 'storageState.json');
  await context.storageState({ path: authStatePath });
  console.log(`\nAuth state saved to: ${authStatePath}`);

  await browser.close();
  console.log('✅ Setup complete! Use storageState.json in your tests');
})();