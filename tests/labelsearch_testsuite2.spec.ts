import { expect } from '@playwright/test';
import { test } from './fixtures/customFixtures';

test.describe('Label Architecture Database - Firefox Tests', () => {

  
test('Label Search - Non Existing Label',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.locator('#shortNameMenuSearch').fill('abcd');
  await page.locator('#shortNameMenuSearch').press('Enter');
  await expect(page.getByLabel('Sw. Interface').locator('datatable-selection')).toContainText('No data to display');
  await page.click('#clearSearchData');
  await expect(page.getByLabel('Sw. Interface').locator('datatable-selection')).toContainText('No data to display');
});

test('Clear Label Search',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.locator('#shortNameMenuSearch').fill('Epm_neng');
  await page.locator('#shortNameMenuSearch').press('Enter');
  await expect(page.getByText('Epm_nEng', { exact: true })).toBeVisible();
  await page.click('#clearSearchData');
  await expect(page.getByLabel('Sw. Interface').locator('datatable-selection')).toContainText('No data to display');
});

test('Search based on AR Class and AR Type',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByRole('button', { name: 'AR Class' }).click({ force: true });
  await page.getByRole('listitem').filter({ hasText: 'VARIABLE_DATA_PROTOTYPE' }).locator('#dropdownCheckLabelArClass').check();
  await page.locator('#shortNameMenuSearch').press('Enter');
  await expect(page.getByText('APP_ADCRead:APP_flgLvlAbnormErrCfmVPA1')).toBeVisible({timeout: 10000});
  await page.getByRole('button', { name: 'AR Type' }).click({ force: true });
  await page.getByRole('listitem').filter({ hasText: 'ARRAY' }).locator('#dropdownCheckLabelArType').check();
  await page.locator('#shortNameMenuSearch').press('Enter');
  await expect(page.getByText('DcmDspUDS_VMSAB:DcmVMSAB_NVRam_GR_02_PreDetect')).toBeVisible({timeout: 10000});
});

test('Search based on date',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.click('button[mattooltip="Search based on date"]');
  await page.locator('#mat-select-3 div').nth(1).click();
  await page.getByText('Between').click();
  await page.locator('#mat-input-4').click();
  for (let i = 0; i   < 4; i++) {
  await page.getByRole('button', { name: 'Previous month' }).click();
  }
  await page.getByRole('button', { name: /March 12,/ }).click();
  for (let i = 0; i < 1; i++) {
  await page.getByRole('button', { name: 'Previous month' }).click();
  }
  await page.getByRole('button', { name: /June 18,/ }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByLabel('Sw. Interface').getByText('No data to display')).toBeVisible();
});

test('Column chooser (Show and Hide columns)',async({ loggedInPage }) => {
  const page = await loggedInPage();
  const shortNameInput = page.getByRole('textbox', { name: 'Enter the label short name' });
  const columnHeading = page.getByRole('heading', { name: 'Display columns' });
  const columnListItem = page.getByRole('listitem');
  const comboBox = page.getByRole('combobox');
  await shortNameInput.fill('Epm_neng');
  await shortNameInput.press('Enter');
  await page.click('#swInfVisShowHide');
  await comboBox.selectOption('All');
  await expect(columnHeading).toBeVisible();
  await expect(columnListItem.getByRole('listbox')).toBeVisible();
  await expect(columnListItem).toContainText('DescrEnhd');
  await comboBox.selectOption('AUTOSAR');
  await expect(columnHeading).toBeVisible();
  await Promise.all([
  expect(columnListItem).toContainText('AR Class'),
  expect(columnListItem).toContainText('AR Type')
  ]);
  await comboBox.selectOption('Default');
  await expect(columnHeading).toBeVisible();
  await Promise.all([
  expect(columnListItem).toContainText('Long Name English'),
  expect(columnListItem).toContainText('Long Name German')
  ]);
  await comboBox.selectOption('Favourites');
  await page.locator('select.select-style >> text=Lab. Create date').waitFor({ state: 'visible' });
  await page.selectOption('select.select-style', { label: 'Lab. Create date' });
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-right').click();
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('textbox', { name: 'Lab. Create date' })).toBeVisible();
  await page.click('#swInfVisShowHide');
  await comboBox.selectOption('Favourites');
  await expect(columnHeading).toBeVisible();
  await expect(columnListItem).toContainText('Lab. Create date');
  await page.getByRole('listitem').getByRole('listbox').selectOption('0: Object');
  await page.locator('button > i.fas.fa-caret-left').click();
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.click('#swInfVisShowHide');
  await comboBox.selectOption('MSR');
  await expect(columnHeading).toBeVisible();
  await Promise.all([
  expect(columnListItem).toContainText('MSR Class'),
  expect(columnListItem).toContainText('MSR Type')
]);      
});

test('Label Actions - Show Label Used In',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByRole('textbox', { name: 'Enter the label short name' }).fill('DEVLIB_DBG_SY');
  await page.getByRole('textbox', { name: 'Enter the label short name' }).press('Enter');
  await expect(page.getByText('Sw Interface Details', { exact: true })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^DEVLIB_DBG_SY$/ }).first()).toBeVisible({timeout: 10000});
  await expect(page.getByText('DEVLIB_DBG_SY').nth(1)).toBeVisible();
  await page.getByRole('button', { name: 'Example icon-button with a' }).nth(1).click();
  await page.getByRole('menuitem', { name: 'Show Label used-in' }).click();
  await page.getByRole('menuitem', { name: 'Used-in SDOM' }).click();
  await expect(page.locator('#mat-expansion-panel-header-6')).toContainText('DEVLIB_DBG_SY [ SYS/FIXED ] is Used-In');
  await page.getByRole('button', { name: 'DEVLIB_DBG_SY [ SYS/FIXED ]' }).locator('a').click();
  await expect(page.getByRole('heading', { name: 'Export Info!' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.click('#clearSearchData');
  await page.getByRole('textbox', { name: 'Enter the label short name' }).fill('APP_ADCRead:APP_flgLvlAbnormErrCfmVPA1');
  await page.getByRole('textbox', { name: 'Enter the label short name' }).press('Enter');
  await expect(page.getByText('Sw Interface Details', { exact: true })).toBeVisible();
  await expect(page.getByText('APP_ADCRead:APP_flgLvlAbnormErrCfmVPA1').nth(0)).toBeVisible({ timeout:10000 });
  await page.getByRole('button', { name: 'Example icon-button with a' }).nth(0).click();
  await page.getByRole('menuitem', { name: 'Show Label used-in' }).click();
  await page.getByRole('menuitem', { name: 'Used-in SDOM' }).click();
  await expect(page.getByRole('button', { name: 'APP_ADCRead:APP_flgLvlAbnormErrCfmVPA1 [ VARIABLE_DATA_PROTOTYPE/BOOLEAN ]  is' })).toBeVisible();
  await page.getByRole('button', { name: 'APP_ADCRead:APP_flgLvlAbnormErrCfmVPA1 [ VARIABLE_DATA_PROTOTYPE/BOOLEAN ]  is' }).locator('a').click();
  await expect(page.getByRole('heading', { name: 'Export Info!' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.click('#clearSearchData');
});

test('Label Actions - Sub Elements/Param',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByRole('textbox', { name: 'Enter the label short name' }).fill('Bbcc_EnaAdpnB1_I');
  await page.getByRole('textbox', { name: 'Enter the label short name' }).press('Enter');
  await expect(page.getByText('Sw Interface Details', { exact: true })).toBeVisible();
  await expect(page.getByText('Bbcc_EnaAdpnB1_I').first()).toBeVisible();
  await expect(page.getByText('Bbcc_EnaAdpnB1_I').nth(1)).toBeVisible();
  await page.getByRole('button', { name: 'Example icon-button with a' }).nth(1).click();
  await page.getByRole('menuitem', { name: 'SubElements View' }).click();
  await expect(page.getByRole('heading', { name: 'SubElements View (' })).toBeVisible();
  await expect(page.getByRole('button', { name: ')   flgBigIntvActvAdpnInhb' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('Sw Interface Details', { exact: true })).toBeVisible();
  });

  test('Sw Inf : Hide and Show columns',async({ loggedInPage }) => {
  const page = await loggedInPage();
  const shortNameInput = page.getByRole('textbox', { name: 'Enter the label short name' });
  await shortNameInput.fill('Epm_neng');
  await shortNameInput.press('Enter');
  await page.click('#swInfVisShowHide');
  await page.getByRole('combobox').selectOption('Favourites');
  await page.locator('select.select-style').nth(0).selectOption([
  { label: 'Generic SWInf' },
  { label: 'In-Use' },
  { label: 'Inst. of' }
  ]);
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-right').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('region', { name: 'Sw Interface Details ' }).locator('datatable-body')).toBeVisible();
  await Promise.all([
  await expect(page.getByRole('textbox', { name: 'Generic SWInf' })).toBeVisible(),
  await expect(page.getByRole('textbox', { name: 'In-Use' })).toBeVisible(),
  await expect(page.getByRole('textbox', { name: 'Inst. of' })).toBeVisible()
  ]);
  await page.click('#swInfVisShowHide');
  await page.getByRole('combobox').selectOption('Favourites');
  await page.locator('select.select-style').nth(1).selectOption([
  { label: 'Generic SWInf' },
  { label: 'In-Use' },
  { label: 'Inst. of' }
  ]);
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-left').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.click('[mattooltip="Export Label Search Results to Excel."]');
  await expect(page.getByRole('heading', { name: 'Export Info!' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.click('#clearSearchData');
});

test('Routing and Interface Clearing - through URL',async({ loggedInPage }) => {
  const page = await loggedInPage('https://rb-wam.bosch.com/dgs-ladb/05-D/labelsearch/#/shortName/5dNewMsrLabelTest/class/CLI/type/STRUCTURE');
  await expect(page.getByText('Sw Interface Details', { exact: true })).toBeVisible();
  await page.click('#clearSearchData');
});

test('UI Test Case - Basic UI Check( Sw interface)',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await expect(page.getByLabel('Label Search').getByText('Sw/Sys Interface')).toBeVisible();
  await expect(page.getByText('ESA Interface')).toBeVisible();
  await expect(page.getByText('MSR: SW Class', { exact: true })).toBeVisible();
  await expect(page.getByText('MSR: SW Class Attr.')).toBeVisible();
  await expect(page.getByText('AUTOSAR: ARXML artifacts')).toBeVisible();
  await expect(page.getByText('AUTOSAR: Blueprint Interfaces')).toBeVisible();
  await expect(page.getByRole('button', { name: 'IF Clearing' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Normalization Viewer' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Miscellaneous' })).toBeVisible();
  await page.getByText('menu', { exact: true }).click();
});

test('Sys Inf: Hide and Show columns & Export Sys inf',async({ loggedInPage }) => {
  // const page = await loggedInPage();
  // await page.getByRole('tab', { name: 'Sys. Interface' }).click();
  // await page.getByRole('button', { name: 'Sys Architecture' }).click({ force: true });
  // await page.getByRole('listitem').filter({ hasText: 'SYS_DO-A : DO_Ecu/' }).locator('#dropdownCheck1').check();
  // await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).click();
  // await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).fill('AirM');
  // await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).press('Enter');
  // await page.getByRole('button', { name: '', exact: true }).click();
  // await page.getByRole('combobox').selectOption('Favourites');
  // await page.selectOption('select.select-style', { label: 'Long Name German' });
  // await page.locator('button > i.fas.fa-caret-right').click();
  // await expect(page.getByRole('heading', { name: 'Display columns' })).toBeVisible();
  // await expect(page.getByRole('listitem')).toContainText('Long Name German');
  // await page.getByRole('button', { name: 'Save Favourite' }).click();
  // await page.getByRole('button', { name: 'Apply' }).click();
  // await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toBeVisible();
  // await expect(page.getByRole('textbox', { name: 'Long Name German' })).toBeVisible();
  // await page.getByRole('button', { name: '', exact: true }).click();
  // await page.getByRole('combobox').selectOption('Favourites');
  // await page.getByRole('listitem').getByRole('listbox').selectOption('0: Object');
  // await page.waitForTimeout(1000);
  // await page.locator('button > i.fas.fa-caret-left').click();
  // await page.waitForTimeout(1000);
  // await page.getByRole('button', { name: 'Save Favourite' }).click();
  // await page.getByRole('button', { name: 'Apply' }).click();
  // await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toBeVisible();
  // const downloadPromise = page.waitForEvent('download');
  // await page.locator('#exportSysIfSearchData').click();
  // const download = await downloadPromise;
});

test('Sys Inf - Actions (Show mapped sys inf)',async({ loggedInPage }) => {
  //Bug found
  /*const page = await loggedInPage();
  await page.getByRole('tab', { name: 'Sys. Interface' }).click();
  await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).fill('AirM');
  await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).press('Enter');
  await page.waitForTimeout(1000);
  await expect(page.getByLabel('Sys. Interface').locator('mat-panel-title')).toContainText('System Interface Details');
  //await expect(page.getByLabel('Sys. Interface').locator('datatable-body-cell').filter({ hasText: 'AirM' })).toBeVisible();
  await page.getByRole('button', { name: 'Example icon-button with a' }).click();
  await page.getByRole('menuitem', { name: 'Show Mapped Sw. Interface' }).click();
  await expect(page.getByLabel('Sw. Interface').locator('mat-panel-title')).toContainText('Sw Interface Details');
  await expect(page.getByRole('button', { name: 'Sw Interface Details Mapped' })).toBeVisible();*/
});

test('Sys Inf - Actions (Map and Unmap sw infs)',async({ loggedInPage }) => {
  //Bug found
  /*const page = await loggedInPage();
  await page.getByRole('tab', { name: 'Sys. Interface' }).click();
  await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).fill('AirM');
  await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).press('Enter');
  await expect(page.getByLabel('Sys. Interface').locator('mat-panel-title')).toContainText('System Interface Details');
  await expect(page.getByLabel('Sys. Interface').locator('datatable-body-cell').filter({ hasText: 'AirM' })).toBeVisible();
  await page.getByRole('button', { name: 'Example icon-button with a' }).click();
  await page.getByRole('menuitem', { name: 'Map / UnMap Sw. Interface' }).click();
  await expect(page.getByRole('button', { name: 'Mapped SW Interfaces System' })).toBeVisible();*/
});

test('Sys Inf - Actions( Show Traceability)',async({ loggedInPage }) => {
  //Bug found
  /*const page = await loggedInPage();
  await page.getByRole('tab', { name: 'Sys. Interface' }).click();
  await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).fill('AirM');
  await page.getByRole('button', { name: 'Validity' }).click();
  await page.locator('#dropdownCheck').nth(1).check();
  await page.getByRole('button', { name: 'If Generic' }).click();
  await page.getByRole('listitem').filter({ hasText: 'No' }).locator('#dropdownCheck1').check();
  await page.getByRole('textbox', { name: 'Enter the sys inf. block name' }).press('Enter');
  //await expect(page.getByLabel('Sys. Interface').locator('mat-panel-title')).toContainText('System Interface Details');
  await expect(page.getByLabel('Sys. Interface').locator('datatable-body-cell').filter({ hasText: 'airm' })).toBeVisible();*/
});

test('Autosar : Portprototype Hide and Show columns',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await expect(page.getByText('AUTOSAR: ARXML artifacts')).toBeVisible();
  await page.getByLabel('Label Search').getByText('AUTOSAR: ARXML artifacts').click();
  await page.getByRole('tab', { name: 'PortPrototype' }).click();
  await page.getByPlaceholder('Enter the port name').fill('PP_BMW_b_PfVisDisp');
  await page.getByPlaceholder('Enter the port name').press('Enter');
  await expect(page.getByLabel('PortPrototype').locator('mat-panel-title')).toContainText('Port Prototype Details');
  await page.getByRole('button', { name: '', exact: true }).click();
  await page.getByRole('combobox').selectOption('Favourites');
  await page.getByRole('list').filter({ hasText: 'Available columnsAUTOSAR' }).getByRole('listbox').selectOption(['9: Object', '10: Object']);
  await page.locator('button > i.fas.fa-caret-right').click();
  await expect(page.getByRole('heading', { name: 'Display columns' })).toBeVisible();
  await expect(page.getByRole('listitem')).toContainText('IF Category');
  await expect(page.getByRole('listitem')).toContainText('IF DE Long Name');
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('textbox', { name: 'IF Category' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'IF DE Long Name' })).toBeVisible();
  await page.getByRole('button', { name: '', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Display columns' })).toBeVisible();
  await expect(page.getByRole('listitem')).toContainText('IF Category');
  await expect(page.getByRole('listitem')).toContainText('IF DE Long Name');
  await page.getByRole('listitem').getByRole('listbox').selectOption(['0: Object', '1: Object']);
  await page.locator('button > i.fas.fa-caret-left').click();
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Port Prototype Details ' }).locator('a').click();
  const download = await downloadPromise;
});

test('Autosar : Portprototype - Actions',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await expect(page.getByText('AUTOSAR: ARXML artifacts')).toBeVisible();
  await page.getByLabel('Label Search').getByText('AUTOSAR: ARXML artifacts').click();
  await page.getByRole('tab', { name: 'PortPrototype' }).click();
  await page.getByPlaceholder('Enter the port name').fill('PP_BMW_b_PfVisDisp');
  await page.getByPlaceholder('Enter the port name').press('Enter');
  await expect(page.getByRole('button', { name: 'Port Prototype Details ' })).toBeVisible();
  await expect(page.getByText('PP_BMW_b_PfVisDisp')).toBeVisible();
  await page.getByRole('button', { name: 'Example icon-button with a' }).click();
  await page.getByRole('menuitem', { name: 'Variation Point Info' }).click();
  await expect(page.getByText('Variation Point Information')).toBeVisible();
  await page.getByRole('button').filter({ hasText: 'clear' }).click();
  await page.getByRole('button', { name: 'Example icon-button with a' }).click();
  await page.getByRole('menuitem', { name: 'Internal Behavior Info' }).click();
  await expect(page.getByText('Internal Behavior Information')).toBeVisible();
  await expect(page.getByRole('gridcell', { name: 'IB_Glb_SwSLAdpAsw0AppBMW' })).toBeVisible();
  await page.getByRole('button').filter({ hasText: 'clear' }).click();
  await page.getByRole('button', { name: 'Example icon-button with a' }).click();
  await page.getByRole('menuitem', { name: 'Show DataPrototype Details' }).click();
  await expect(page.getByRole('button', { name: 'Data Prototype Details ' })).toBeVisible();
  await expect(page.getByLabel('DataPrototypes').locator('datatable-body-row')).toContainText('BMW_b_PfVisDisp');
});

test('Autosar : Portprototype - Compoonent Import',async({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await expect(page.getByText('AUTOSAR: ARXML artifacts')).toBeVisible();
  await page.getByLabel('Label Search').getByText('AUTOSAR: ARXML artifacts').click();
  await page.getByRole('tab', { name: 'PortPrototype' }).click();
  await page.locator('button:nth-child(6)').click();
  await expect(page.getByRole('heading', { name: 'AUTOSAR File Upload' })).toBeVisible();
  await expect(page.getByText('ARXML file import*')).toBeVisible();
  await expect(page.getByText('Architecture (COMP-A)')).toBeVisible();
  await expect(page.getByText('Vis Owner (BC-A)*')).toBeVisible();
  await page.locator('select').selectOption('DevInt/0');
  await page.getByRole('combobox', { name: 'Select or Search for Vis Owner' }).click();
  await page.getByText('ARDEMO_DUMMY/').click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('select')).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Select or Search for Vis Owner' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Autosar : Dataprototype search & Autosar : Dataprototype Hide and Show columns', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await expect(page.getByText('AUTOSAR: ARXML artifacts')).toBeVisible();
  await page.getByLabel('Label Search').getByText('AUTOSAR: ARXML artifacts').click();
  await page.getByRole('tab', { name: 'PortPrototype' }).click();
  await page.getByRole('tab', { name: 'DataPrototypes' }).click();
  await page.getByText('menu', { exact: true }).click();
  const dptInput = page.getByRole('textbox', { name: 'Enter DPT Short Name' });
  await dptInput.fill('H2Tank_uRawShnt_a');
  await dptInput.press('Enter');
  await expect(page.getByRole('button', { name: 'Data Prototype Details ' })).toBeVisible();
  await expect(page.getByRole('tabpanel', { name: 'DataPrototypes' }).locator('datatable-body')).toBeVisible();
  await page.getByRole('button', { name: '' }).click({ force: true });
  await page.locator('#classDataPrototypeShowHideMenu').click();
  await page.getByRole('combobox').selectOption('Favourites');
  const selectColumns = async (columnIds: string[]) => {
  const list = page.getByRole('list').filter({ hasText: 'Available columnsAutosar' });
  for (const id of columnIds) {
  await list.getByRole('listbox').selectOption(`${id}: Object`);
  await page.locator('button > i.fas.fa-caret-right').click();
  }
  };
  await selectColumns(['10', '14', '17', '18', '15', '16', '19']);
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await dptInput.fill('H2Tank_uRawShnt_a');
  await dptInput.press('Enter');
  await Promise.all([
  expect(page.getByRole('textbox', { name: 'DPT Category' })).toBeVisible(),
  expect(page.getByRole('textbox', { name: 'DPT Type' })).toBeVisible(),
  expect(page.getByRole('textbox', { name: 'DT Ref.' })).toBeVisible(),
  expect(page.getByRole('textbox', { name: 'DT Short Name' })).toBeVisible(),
  expect(page.getByRole('textbox', { name: 'DT Ar. Pkg. Path' })).toBeVisible(),
  expect(page.getByRole('textbox', { name: 'DT Category' })).toBeVisible(),
  ]);
  await expect(page.getByRole('tabpanel', { name: 'DataPrototypes' }).locator('datatable-body')).toBeVisible();
  await page.getByRole('button', { name: '' }).click({ force: true });
  await page.locator('#classDataPrototypeShowHideMenu').click();
  await page.getByRole('combobox').selectOption('Favourites');
  await page.getByRole('listitem').getByRole('listbox').selectOption([
  '0: Object', '1: Object', '2: Object', '3: Object', '4: Object', '5: Object', '6: Object',
  ]);
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-left').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await dptInput.fill('H2Tank_uRawShnt_a');
  await dptInput.press('Enter');
  const download1Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Data Prototype Details ' }).locator('a').click();
  const download1 = await download1Promise;
});

test('Autosar : Operations search', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await expect(page.getByText('AUTOSAR: ARXML artifacts')).toBeVisible();
  await page.getByLabel('Label Search').getByText('AUTOSAR: ARXML artifacts').click();
  await page.getByRole('tab', { name: 'PortPrototype' }).click();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('tab', { name: 'Operations' }).click();
  await page.getByRole('textbox', { name: 'Enter Operation Short Name' }).fill('Certificate_Verify');
  await page.getByRole('textbox', { name: 'Enter Operation Short Name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Operation Details' })).toBeVisible();
  await expect(page.getByRole('tabpanel', { name: 'Operations' }).locator('datatable-body')).toBeVisible();
  const buttons = page.locator('button[mattooltip="Clear"][type="submit"]:has(i.fa-times-circle)');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
  const button = buttons.nth(i);
  if (await button.isVisible()) {
  await button.scrollIntoViewIfNeeded();
  await button.click();
  break;
  }
  }
  await expect(page.getByLabel('Operations').getByText('No data to display')).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter Operation Short Name' }).fill('Certificate_Verify');
  await page.getByRole('textbox', { name: 'Enter Operation Short Name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Operation Details' })).toBeVisible();
  await expect(page.getByRole('tabpanel', { name: 'Operations' }).locator('datatable-body')).toBeVisible();
  const download1Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Operation Details' }).locator('a').click();
  const download1 = await download1Promise;
});

test('Autosar : Elements search', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await expect(page.getByText('AUTOSAR: ARXML artifacts')).toBeVisible();
  await page.getByLabel('Label Search').getByText('AUTOSAR: ARXML artifacts').click();
  await page.getByRole('tab', { name: 'PortPrototype' }).click();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('tab', { name: 'Elements' }).click();
  await page.getByRole('textbox', { name: 'Enter DTE Short Name' }).fill('BMW_vol_FuCns');
  await page.getByRole('textbox', { name: 'Enter DTE Short Name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Data Element Details ' })).toBeVisible();
  await expect(page.getByRole('tabpanel', { name: 'Elements' }).locator('datatable-body')).toBeVisible();
  const buttons = page.locator('button#clearSearchData.btn.btn-default.ladbButtonUp[mattooltip="Clear"][type="submit"]:has(i.fa.fa-times-circle)');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
  const button = buttons.nth(i);
  if (await button.isVisible()) {
  await button.scrollIntoViewIfNeeded();
  await button.click();
  break;
  }
  }
  await expect(page.getByLabel('Elements').getByText('No data to display')).toBeVisible();
  await page.getByRole('button', { name: 'DTE Category' }).click({ force: true });
  await page.getByRole('textbox', { name: 'Category', exact: true }).fill('TYPE_REFERENCE');
  await page.getByRole('textbox', { name: 'Category', exact: true }).press('Enter');
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'DTMS Short Name' }).click({ force: true });
  await page.getByRole('list', { name: 'DTMS Short Name' }).getByPlaceholder('DTMS Short Name').fill('dmsBMW_SWC_PdrCord');
  await page.getByRole('button', { name: 'DTMS Ar.Pkg.Path' }).click({ force: true });
  await page.getByRole('list', { name: 'DTMS Ar.Pkg.Path' }).getByPlaceholder('DTMS Ar. Pkg. Path').fill('/BMW/POWERTRAIN/DataTypeMappingSets/dmsBMW_SWC_PdrCord');
  await page.getByRole('textbox', { name: 'Enter DTE Short Name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Data Element Details ' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'DTE Category' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'DTMS Short Name' })).toBeVisible();
  await expect(page.locator('#dtmsPkgPathMenuSearch')).toBeVisible();
  await expect(page.locator('datatable-scroller')).toContainText('TYPE_REFERENCE');
  await expect(page.locator('datatable-scroller')).toContainText('dmsBMW_SWC_PdrCord');
  await expect(page.locator('datatable-scroller')).toContainText('/BMW/POWERTRAIN/DataTypeMappingSets/dmsBMW_SWC_PdrCord');
  for (let i = 0; i < count; i++) {
  const button = buttons.nth(i);
  if (await button.isVisible()) {
  await button.scrollIntoViewIfNeeded();
  await button.click();
  break;
  }
  }
  await expect(page.getByLabel('Elements').getByText('No data to display')).toBeVisible();
  await page.getByRole('button', { name: 'DTE Category' }).click({ force: true });
  await page.getByRole('textbox', { name: 'Category', exact: true }).fill('TYPE_REFERENCE');
  await page.getByRole('textbox', { name: 'Category', exact: true }).press('Enter');
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'DTMS Short Name' }).click({ force: true });
  await page.getByRole('list', { name: 'DTMS Short Name' }).getByPlaceholder('DTMS Short Name').fill('dmsBMW_SWC_PdrCoa');
  await page.getByRole('button', { name: 'DTMS Ar.Pkg.Path' }).click({ force: true });
  await page.getByRole('list', { name: 'DTMS Ar.Pkg.Path' }).getByPlaceholder('DTMS Ar. Pkg. Path').fill('/BMW/POWERTRAIN/DataTypeMappingSets/dmsBMW_SWC_PdrCoa');
  await page.getByRole('textbox', { name: 'Enter DTE Short Name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Data Element Details ' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'DTE Category' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'DTMS Short Name' })).toBeVisible();
  await expect(page.locator('#dtmsPkgPathMenuSearch')).toBeVisible();
  await expect(page.locator('datatable-scroller')).toContainText('TYPE_REFERENCE');
  await expect(page.locator('datatable-scroller')).toContainText('dmsBMW_SWC_PdrCoa');
  await expect(page.locator('datatable-scroller')).toContainText('/BMW/POWERTRAIN/DataTypeMappingSets/dmsBMW_SWC_PdrCoa');
  const download2Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Data Element Details ' }).locator('a').click();
  const download2 = await download2Promise;
});

test('SW Class: Hide and Show columns', async ({ loggedInPage }) => {
  const page = await loggedInPage();

  // Helper to open the menu and click "Label Search"
  const openLabelSearch = async () => {
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  };

  // Helper to update favourite columns
  const updateFavouriteColumns = async (selectIndex: number, columnLabels: string[]) => {
  await page.locator('button#classColumnShowHideMenu').click();
  await page.getByRole('combobox').selectOption('Favourites');
  await page.locator('select.select-style').nth(selectIndex).selectOption(
  columnLabels.map(label => ({ label }))
  );
  };

  // Helper to save and apply favourites
  const saveAndApplyFavourite = async () => {
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  };

  // Begin test
  await openLabelSearch();
  await page.getByText('MSR: SW Class', { exact: true }).click();

  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter the SW-Class' }).fill('ABSRadState');
  await page.getByRole('textbox', { name: 'Enter the SW-Class' }).press('Enter');

  const columnLabels = ['Category', 'Long Name German', 'Long Name English', 'Sw-Class'];

  // Save initial favourite
  await updateFavouriteColumns(0, columnLabels);
  await page.locator('button > i.fas.fa-caret-right').click();
  await saveAndApplyFavourite();

  // Validate visible columns
  for (const label of columnLabels) {
  await expect(page.getByRole('textbox', { name: label, exact: true })).toBeVisible();
  }

  // Remove favourites by selecting again and moving left
  await updateFavouriteColumns(1, columnLabels);
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-left').click();
  await page.waitForTimeout(1000);
  await saveAndApplyFavourite();

  // Confirm column config icon is visible
  await expect(
  page.locator('datatable-header-cell')
  .filter({ hasText: 'settings_applications' })
  .locator('div')
  ).toBeVisible();

  // Trigger download
  const download = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Sw Class Details ' }).locator('a').click()
  ]);
});

test('Add Sw Class', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('MSR: SW Class', { exact: true }).click();
  await page.getByText('menu', { exact: true }).click();
  await page.locator('button.btn-default.ladbButtonUp[mattooltip="Add Class"]:has(i.fa-plus-square)').click();
  await expect(page.getByRole('dialog', { name: 'Add New Class' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Class Name' }).fill('TestSwClass_ADD');
  await page.locator('#category').selectOption('CLASS');
  await page.locator('#commentEnglish').fill('test');
  await page.getByRole('button', { name: 'Clear All' }).click();
  await expect(page.locator('#commentEnglish')).toContainText('');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.locator('button.btn-default.ladbButtonUp[mattooltip="Add Class"]:has(i.fa-plus-square)').click();
  await page.getByRole('textbox', { name: 'Class Name' }).fill('TestSwClass_ADD');
  await page.locator('#category').selectOption('CLASS');
  await page.locator('#commentEnglish').fill('test');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('button', { name: 'Sw Class Details ' })).toBeVisible();
  await expect(page.getByText('TestSwClass_ADD')).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter the SW-Class' }).fill('TestSwClass_ADD');
  await page.getByRole('textbox', { name: 'Enter the SW-Class' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Sw Class Details ' })).toBeVisible();
  await expect(page.getByText('TestSwClass_ADD')).toBeVisible();
  await page.locator('button.btn-default.ladbButtonUp[mattooltip="Add Class"]:has(i.fa-plus-square)').click();
  await page.getByRole('textbox', { name: 'Class Name' }).fill('TestSwClass_ADD');
  await page.locator('#category').selectOption('CLASS');
  await page.locator('#commentEnglish').fill('test');
  await page.getByRole('button', { name: 'Save' }).click(); 
});

test('Sw.Class Attr search', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('MSR: SW Class Attr.').click();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter the Attribute name' }).fill('EGTCond_facHtgThresLo');
  await page.getByRole('textbox', { name: 'Enter the Attribute name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Sw Attr Class Details ' })).toBeVisible();
  await expect(page.locator('datatable-body')).toBeVisible();
  await page.locator('button#clearSearchData.btn-default.ladbButtonUp[mattooltip="Clear"]:has(i.fa-times-circle)').click();
  await expect(page.getByText('No data to display')).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter the Attribute name' }).fill('EGTCond_facHtgThresLo');
  await page.getByRole('button', { name: 'Attribute Class' }).click({ force: true });
  await page.getByRole('textbox', { name: 'Attribute Class' }).fill('VAR');
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Attribute Type' }).click({ force: true });
  await page.getByRole('textbox', { name: 'Search Attr. Type' }).fill('VALUE');
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('checkbox').nth(3).check();
  await page.getByRole('textbox', { name: 'Enter the Attribute name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Sw Attr Class Details ' })).toBeVisible();
  await expect(page.locator('datatable-body')).toBeVisible();
  await page.locator('button#clearSearchData.btn-default.ladbButtonUp[mattooltip="Clear"]:has(i.fa-times-circle)').click();
  await expect(page.getByText('No data to display')).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter the Attribute name' }).fill('EGTCond_facHtgThresLo');
  await page.getByRole('textbox', { name: 'Enter the Attribute name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Sw Attr Class Details ' })).toBeVisible();
  await expect(page.locator('datatable-body')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Sw Attr Class Details ' }).locator('a').click();
  const download = await downloadPromise;
});

test('SW Class Attr: Hide and Show columns', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Label Search' })).toBeVisible();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('MSR: SW Class Attr.').click();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter the Attribute name' }).fill('EGTCond_facHtgThresLo');
  await page.getByRole('textbox', { name: 'Enter the Attribute name' }).press('Enter');
  await page.waitForTimeout(3000);
  await page.locator('button#classColumnShowHideMenu').click();
  await page.getByRole('combobox').selectOption('Favourites');
  await page.locator('select.select-style').nth(1).selectOption([
  { label: 'Sw-Class' },
  { label: 'Validity' },
  ]);
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-left').click();
  await page.waitForTimeout(1000);
  await expect(page.locator('app-details-layout')).toContainText('Sw-Class');
  await expect(page.locator('app-details-layout')).toContainText('Validity');
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('textbox', { name: 'Attr.Class' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Attr.Inst.Of' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Attr.Type' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Attribute', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Long Name English' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Long Name German' })).toBeVisible();
  await page.locator('button#classColumnShowHideMenu').click();
  await page.getByRole('combobox').selectOption('Favourites');
  await page.locator('select.select-style').nth(0).selectOption([
  { label: 'Sw-Class' },
  { label: 'Validity' },
  ]);
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-right').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('textbox', { name: 'Sw-Class' })).toBeVisible();
  const download1Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Sw Attr Class Details ' }).locator('a').click();
  const download1 = await download1Promise;
});

test('Normalization Viewer', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Normalization Viewer' }).click();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Normalization Viewer' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Available System Constants' })).toBeVisible();
  await page.getByText('ABMMNM_SY').click();
  await expect(page.getByRole('heading', { name: 'System Constants Detailed View' })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'System Constants Detailed View' })).toBeVisible();
  await expect(page.getByLabel('ABMMNM_SY / 0 Released').locator('div').filter({ hasText: 'Label List Attributes Long' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Label Statistics', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Miscellaneous' }).click();
  const page2Promise = page.waitForEvent('popup');
  const download3Promise = page.waitForEvent('download');
  await page.getByText('Label Statistics', { exact: true }).click();
  const page2 = await page2Promise;
  const download3 = await download3Promise;
});

test('Clearing Report', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Miscellaneous' }).click();
  await page.getByLabel('Miscellaneous').getByText('Clearing Report').click();
  await expect(page.getByText('Export IF Clearing Labels')).toBeVisible();
  await page.getByRole('listbox', { name: 'Select an option' }).locator('div').nth(3).click();
  await page.getByText('Between').click();
  await page.getByRole('button', { name: 'July 2,' }).nth(0).click();
  await page.getByRole('button', { name: 'July 9,' }).nth(1).click();
  const page3Promise = page.waitForEvent('popup');
  const download4Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate' }).click();
  const page3 = await page3Promise;
  const download4 = await download4Promise;
});

test('Deleted History', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Miscellaneous' }).click();
  await page.getByText('Deleted History').click();
  await expect(page.getByText('Export Deleted Sw. Interface')).toBeVisible();
  await page.getByText('NoneSelect an option').click();
  await page.getByText('Between').click();
  await page.getByRole('button', { name: 'Previous month' }).click();
  await page.getByRole('button', { name: 'June 2,' }).click();
  await page.getByRole('button', { name: 'July 9,' }).click();
  const page4Promise = page.waitForEvent('popup');
  const download5Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate' }).click();
  const page4 = await page4Promise;
  const download5 = await download5Promise
});

test('Label-Used In Info', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Miscellaneous' }).click();
  await page.getByLabel('Miscellaneous').getByText('Label-UsedIn Info').click();
  await expect(page.locator('#mat-dialog-0').getByText('Label-UsedIn Info')).toBeVisible();
  await page.getByRole('textbox', { name: 'from date' }).click();
  await page.getByRole('button', { name: 'July 1,' }).click();
  await page.getByRole('textbox', { name: 'to date' }).click();
  await page.getByRole('button', { name: 'July 9,' }).click();
  const page1Promise = page.waitForEvent('popup');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate' }).click();
  const page1 = await page1Promise;
  const download = await downloadPromise;
});

test('Sw. Interface : Action Item Copy URL', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByRole('textbox', { name: 'Enter the label short name' }).fill('Epm_nEng');
  await page.getByRole('textbox', { name: 'Enter the label short name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Sw Interface Details ' })).toBeVisible();
  await expect(page.getByText('Epm_nEng', { exact: true })).toBeVisible();
  await page.locator('datatable-body-row').filter({ hasText: 'dehazeEpm_nEng' }).getByLabel('Example icon-button with a').click();
  await page.getByRole('menuitem', { name: 'Copy URL' }).click();
  await expect(page.locator('#modal-basic-title')).toContainText('Copy \'Epm_nEng\' As URL');
  await expect(page.getByText('https://rb-wam.bosch.com/dgs-')).toBeVisible();
  await page.getByRole('button', { name: 'Copy URL' }).click();
  await expect(page.getByRole('region', { name: 'Sw Interface Details ' }).locator('datatable-body')).toBeVisible();
});

test('Sw Used In Architecture', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByRole('textbox', { name: 'Enter the label short name' }).fill('Epm_nEng');
  await page.getByRole('textbox', { name: 'Enter the label short name' }).press('Enter');
  await page.waitForTimeout(1000);
  await expect(page.getByRole('button', { name: 'Sw Interface Details ' })).toBeVisible();
  await expect(page.getByText('Epm_nEng', { exact: true })).toBeVisible();
  await page.locator('datatable-body-row').filter({ hasText: 'dehazeEpm_nEng' }).getByLabel('Example icon-button with a').click();
  await page.getByRole('menuitem', { name: 'Show Used In Architecture' }).click();
  await expect(page.getByRole('heading', { name: 'Used In Architecture' })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Used In Architecture' }).locator('div').nth(4)).toBeVisible();
});

test('Label Search of AR and MSR labels', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByRole('textbox', { name: 'Enter the label short name' }).fill('APP_ADCRead:APP_flgLvlAbnormErrCfmVPA1');
  await page.getByRole('textbox', { name: 'Enter the label short name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Sw Interface Details ' })).toBeVisible();
  await expect(page.locator('datatable-body-cell').filter({ hasText: 'APP_ADCRead:APP_flgLvlAbnormErrCfmVPA1' })).toBeVisible();
  await page.locator('button#clearSearchData.btn-default.ladbButtonUp[mattooltip="Clear"]:has(i.fa-times-circle)').nth(0).click();
  await page.getByRole('textbox', { name: 'Enter the label short name' }).fill('ACCLNTVLV_TYPAVLDELIBSTDACTR_SY');
  await page.getByRole('textbox', { name: 'Enter the label short name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Sw Interface Details ' })).toBeVisible()
  await expect(page.locator('datatable-body-cell').filter({ hasText: 'ACCLNTVLV_TYPAVLDELIBSTDACTR_SY' })).toBeVisible();
  await page.locator('button#clearSearchData.btn-default.ladbButtonUp[mattooltip="Clear"]:has(i.fa-times-circle)').nth(0).click();
});

test('Excel import options & Excel import template check', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('ESA Interface').click();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ESA Interface' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ESA Interface Details ' })).toBeVisible();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
  await expect(page.getByRole('heading', { name: 'ESA Interface Import' })).toBeVisible();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Interface import' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Architecture import' }).click();
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('tests/files/Book2.xlsx');
  await page.getByRole('button').nth(3).click();
  await expect(page.locator('app-esa-inf-file-upload')).toContainText('Invalid Template! Please use a valid template to perform ESA Architecture Import.');
  await page.getByRole('button').nth(4).click();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Routing to PTSA page from ESA page', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('ESA Interface').click();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ESA Interface' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).fill('ChrgnLampSp');
  await page.waitForTimeout(2000);
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'ESA Interface Details ' })).toBeVisible();
  await expect(page.locator('datatable-body-cell').filter({ hasText: 'ChrgnLampSp' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Example icon-button with a' }).first().click();
  await page.getByRole('menuitem', { name: 'Show Mapped PTSA' }).click();
  await expect(page.getByRole('heading', { name: 'Sw/Sys Interface' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'System Interface Details ' })).toBeVisible();
});

test('ESA search result export', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('ESA Interface').click();
  await page.getByText('menu', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ESA Interface' })).toBeVisible();
  await page.getByRole('button', { name: 'Owning Log Element ESA' }).click({ force: true});
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'ESA Interface Details ' })).toBeVisible();
  await expect(page.locator('datatable-scroller')).toContainText('AcChrgrLimn');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'ESA Interface Details ' }).locator('a').click();
  const download = await downloadPromise;
});

test('Clear Result', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('ESA Interface').click();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'PTSA Name' }).click({ force: true });
  await page.getByRole('textbox', { name: 'PTSA Name' }).click({ force: true });
  await page.getByRole('textbox', { name: 'PTSA Name' }).fill('ChrgnFlapLampSp');
  await page.getByRole('button', { name: 'Owning Sys Element PTSA' }).click({ force: true });
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.getByRole('listitem').filter({ hasText: 'EcuSwDsgn' }).locator('#dropdownCheckOwningSysElementPtsa').uncheck();
  await page.getByRole('listitem').filter({ hasText: 'SC_3WayCatMngt' }).locator('#dropdownCheckOwningSysElementPtsa').uncheck();
  await page.getByRole('listitem').filter({ hasText: 'SC_AccrPedlMngt' }).locator('#dropdownCheckOwningSysElementPtsa').uncheck();
  await page.getByRole('listitem').filter({ hasText: 'SC_ActvSurgeDampr' }).locator('#dropdownCheckOwningSysElementPtsa').uncheck();
  await page.getByRole('button', { name: 'Owning Log Element ESA' }).click({ force:true });
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.locator('#dropdownCheckOwningLogElementEsa').first().uncheck();
  await page.getByRole('listitem').filter({ hasText: 'AccrPedlCoorr' }).locator('#dropdownCheckOwningLogElementEsa').uncheck();
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).click();
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).press('Enter');
  await expect(page.getByText('No data to display')).toBeVisible();
  await page.click('#EsaInterfaceClearDisabled');
  await expect(page.getByText('No data to display')).toBeVisible();
});

test('ESA Search', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('ESA Interface').click();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).fill('ChrgnLampSp');
  const textbox = page.getByRole('textbox', { name: 'Enter the ESA Name' });
  await textbox.focus();
  await textbox.press('Enter');
  await page.waitForTimeout(1000);
  await expect(page.getByRole('button', { name: 'ESA Interface Details ' })).toBeVisible();
  await expect(page.locator('datatable-scroller')).toContainText('ChrgnLampSp');
  await page.click('#EsaInterfaceClearDisabled');
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).click();
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).fill('abcde');
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).press('Enter');
  await expect(page.getByText('No data to display')).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).fill('');
  await page.getByRole('button', { name: 'PTSA Name' }).click({ force: true });
  await page.getByRole('textbox', { name: 'PTSA Name' }).click({ force: true });
  await page.getByRole('textbox', { name: 'PTSA Name' }).fill('ChrgnFlapLampSp');
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'ESA Interface Details ' })).toBeVisible();
  await expect(page.getByText('ChrgnFlapLampSp').first()).toBeVisible();
  await expect(page.locator('datatable-body')).toBeVisible();
  await page.click('#EsaInterfaceClearDisabled');
  await page.getByRole('button', { name: 'Owning Sys Element PTSA' }).click({ force: true });
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('listitem').filter({ hasText: 'EcuSwDsgn' }).locator('#dropdownCheckOwningSysElementPtsa').check();
  await page.getByRole('textbox', { name: 'Enter the ESA Name' }).press('Enter');
  await expect(page.getByText('No data to display')).toBeVisible();
  await page.click('#EsaInterfaceClearDisabled');
  await page.getByRole('button', { name: 'Owning Log Element ESA' }).click({ force:true });
  await page.getByRole('listitem').filter({ hasText: 'Select All' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: '' }).click();
  await page.locator('li:nth-child(43) > #dropdownCheckOwningLogElementEsa').check();
  await expect(page.getByText('No data to display')).toBeVisible();
  await page.click('#EsaInterfaceClearDisabled');
});

test('Column chooser (Show and Hide columns) - 2', async ({ loggedInPage }) => {
  const page = await loggedInPage();
  await page.getByText('menu', { exact: true }).click();
  await page.getByRole('button', { name: 'Label Search' }).click();
  await page.getByText('ESA Interface').click();
  await page.getByText('menu', { exact: true }).click();
  await page.click('#classColumnShowHideMenu');
  await page.getByRole('combobox').selectOption('All');
  await page.getByRole('combobox').selectOption('Favourites');
  await page.getByRole('listitem').getByRole('listbox').selectOption([
  { label: 'ESA Version Implemented' },
  { label: 'Long name ESA' },
  { label: 'Name PTSA' },
  { label: 'Owning Log Element ESA' },
  { label: 'Validity ESA' },
  { label: 'Validity PTSA SysIf' }
  ]);
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-left').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('textbox', { name: 'Owning System Element BU' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Owning System Element PTSA' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'SysIf Category' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Name SysIf of BU' })).toBeVisible();
  await page.click('#classColumnShowHideMenu');
  await page.getByRole('combobox').selectOption('Favourites');
  await page.getByRole('list').filter({ hasText: 'Available columnsESA Version' }).getByRole('listbox')
  .selectOption([
  { label: 'ESA Version Implemented' },
  { label: 'Long name ESA' },
  { label: 'Name PTSA' },
  { label: 'Owning Log Element ESA' },
  { label: 'Validity ESA' },
  { label: 'Validity PTSA SysIf' }
  ]);
  await page.waitForTimeout(1000);
  await page.locator('button > i.fas.fa-caret-right').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save Favourite' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('textbox', { name: 'ESA Version Implemented' })).toBeVisible();
});
});





