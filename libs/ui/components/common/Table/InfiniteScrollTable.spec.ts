import { expect, test } from '@playwright/test';

test.describe('InfiniteScrollTable component', () => {
  // Extend Playwright's default timeout
  test.setTimeout(60000);

  const storybookURL = 'http://localhost:6006/?path=/story/common-table--table';

  test('renders the table with initial data', async ({ page }) => {
    await page.goto(storybookURL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const table = frame.locator('table').nth(1);

    await expect(table).toBeVisible({ timeout: 20000 });
    const rowCount = await table.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0); // Check if there are any data rows
  });

  test('checks if email column is hidden on mobile view', async ({ page }) => {
    await page.goto(storybookURL);
    await page.setViewportSize({ width: 375, height: 812 });
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const emailHeader = frame.locator('th:has-text("Email")');
    await expect(emailHeader).toBeHidden({ timeout: 20000 });
  });

  test('checks if email column is visible on desktop view', async ({ page }) => {
    await page.goto(storybookURL);
    await page.setViewportSize({ width: 1440, height: 900 }); // Desktop resolution
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const emailHeader = frame.locator('th:has-text("Email")');
    await expect(emailHeader).toBeVisible({ timeout: 20000 });
  });
});
