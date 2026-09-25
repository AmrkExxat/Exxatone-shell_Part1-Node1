import test, { expect } from '@playwright/test';

test.describe('Testcase for Tabs component', () => {
  const tabSelector = 'button[role="tab"], a[role="tab"]'; // Updated to include both button and link

  test('should render with the default selected tab', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-tabs--default-tabs');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const selectedTab = await frame.locator(`${tabSelector}[aria-selected="true"]`);
    await selectedTab.waitFor({ state: 'visible', timeout: 60000 });
    await expect(selectedTab).toBeVisible();
  });

  test('should update the active tab on click', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-tabs--default-tabs');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const tabToClick = frame.locator(`${tabSelector} >> text=School Requests`);
    await tabToClick.waitFor({ state: 'visible', timeout: 60000 });
    await tabToClick.click();
    const selectedTab = await frame.locator(`${tabSelector}[aria-selected="true"]`);
    await expect(selectedTab).toHaveText('School Requests');
  });

  test('should have href attributes for each tab if they are links', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-tabs--default-tabs');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const tabs = frame.locator(tabSelector);
    const tabCount = await tabs.count();

    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      const href = await tab.getAttribute('href');
      // Only check href for link tabs
      if (await tab.evaluate((el) => el.tagName === 'A')) {
        expect(href).not.toBeNull();
      }
    }
  });
});
