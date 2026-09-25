import test, { expect } from '@playwright/test';

test.describe('Test cases for WeekView component', () => {
  test('Default', async ({ page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?args=&id=common-weekview--default&viewMode=story'
    );

    let container = await page.waitForSelector('div#weekview-component');

    let dayComponents = await container.$$('div');

    for (const dayComponent of dayComponents) {
      expect(await dayComponent.getAttribute('class')).toContain('bg-gray-300');
    }
  });

  test('Selected days', async ({ page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?args=&id=common-weekview--selected-days&viewMode=story'
    );

    let container = await page.waitForSelector('div#weekview-component');

    let dayComponents = await container.$$('div');

    for (let index = 0; index < dayComponents.length; index++) {
      const dayComponent = dayComponents[index];

      if (index === 1 || index === 3) {
        expect(await dayComponent.getAttribute('class')).toContain('bg-primary');
      } else {
        expect(await dayComponent.getAttribute('class')).toContain('bg-gray-300');
      }
    }
  });

  test('All days', async ({ page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?args=&id=common-weekview--all-days&viewMode=story'
    );

    let container = await page.waitForSelector('div#weekview-component');

    let dayComponents = await container.$$('div');

    for (const dayComponent of dayComponents) {
      expect(await dayComponent.getAttribute('class')).toContain('bg-primary');
    }
  });
});
