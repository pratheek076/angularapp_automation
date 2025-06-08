import { test, expect } from '@playwright/test';

test.describe('Label Architecture Database - Firefox Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://rb-wam.bosch.com/dgs-ladb/05-D/labelsearch/#/');
    await page.locator('input[name="username"]').fill('tgg3kor');
    await page.locator('input[name="password"]').fill('Bangalore123@#$');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test('Page title should contain "labelsearch"', async ({ page }) => {
    await expect(page).toHaveTitle('Labelsearch');
  });

  test('Search functionality',async({ page }) => {
    await page.locator('#shortNameMenuSearch').fill('Epm_nEng');
    await page.locator('#shortNameMenuSearch').press('Enter');
    await expect(page.locator('#mat-dialog-1').getByText('Searching software interfaces.')).toBeVisible();
    await expect(page.locator('datatable-scroller')).toContainText('Epm_nEng');
  });

  test('Long Name English Test',async({ page }) => {
    await page.locator('#shortNameMenuSearch').fill('Epm_nEng');
    await page.locator('#shortNameMenuSearch').press('Enter');
    await expect(page.locator('#mat-dialog-1').getByText('Searching software interfaces.')).toBeVisible();
    await expect(page.locator('datatable-scroller')).toContainText('Epm_nEng');
    await page.locator('#swInfVisShowHide').click();
    await page.getByRole('list').filter({ hasText: 'Available columnsAR ClassAR' }).getByRole('listbox').selectOption('12: Object');
    await page.locator('button > i.fas.fa-caret-right').click();
    await expect(page.getByRole('list').filter({ hasText: 'Display columnsLong Name' }).getByRole('listbox')).toBeVisible();
    await expect(page.locator('app-details-layout')).toContainText('Long Name English');
    await page.getByRole('button', { name: 'Apply' }).click();
    const editButton = page.locator('div.col-md-12:has-text("TEST12") #editEngCmtId');
    await editButton.evaluate(el => el.style.visibility = 'visible');
    await editButton.click();
    await page.locator('#commentEngId').fill('TEST12');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('datatable-scroller')).toContainText('TEST12');
    await page.getByLabel('Sw. Interface').locator('#clearSearchData').click();
  });

  test('Show Used in Architecture',async({ page }) => {
    await page.locator('#shortNameMenuSearch').fill('Epm_nEng');
    await page.locator('#shortNameMenuSearch').press('Enter');
    await expect(page.locator('#mat-dialog-1').getByText('Searching software interfaces.')).toBeVisible();
    await expect(page.locator('datatable-scroller')).toContainText('Epm_nEng');
    await page.locator('datatable-body-row').filter({ hasText: 'dehazeEpm_nEng' }).getByLabel('Example icon-button with a').click();
    await page.getByRole('menuitem', { name: 'Show Used In Architecture' }).click();
    await expect(page.getByRole('heading', { name: 'Used In Architecture' })).toBeVisible();
    await expect(page.getByRole('list')).toContainText('COMP-A : RefArch_MDG1evo/34000');
    await expect(page.getByRole('list')).toContainText('COMP-A : PL_M1/0');
  });

  test('Show Mapped System and Software interface',async({ page }) => {
    await page.locator('#shortNameMenuSearch').fill('Epm_nEngDiff');
    await page.locator('#shortNameMenuSearch').press('Enter');
    await expect(page.locator('#mat-dialog-1').getByText('Searching software interfaces.')).toBeVisible();
    await expect(page.locator('datatable-scroller')).toContainText('Epm_nEngDiff');
    await page.getByRole('button', { name: 'Example icon-button with a' }).nth(2).click();
    await page.getByRole('menuitem', { name: 'Show Mapped Sys. Interface' }).click();
    await expect(page.getByRole('button', { name: 'System Interface Details' })).toBeVisible();
    await page.getByRole('button', { name: 'Example icon-button with a' }).click();
    await page.getByRole('menuitem', { name: 'Show Mapped Sw. Interface' }).click();
    await expect(page.getByRole('button', { name: 'Sw Interface Details Mapped' })).toBeVisible();
  });
  
});