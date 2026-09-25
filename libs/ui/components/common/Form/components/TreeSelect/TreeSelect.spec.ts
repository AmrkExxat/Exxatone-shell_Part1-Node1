import { test, expect } from '@playwright/test';

test.describe('TreeSelect Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=form-treeselect--default');
  });
  test.setTimeout(30000);

  test('should render TreeSelect component', async ({ page }) => {
    const label = await page.locator('label:has-text("Discipline")');
    await expect(label).toBeVisible();
  });

  test('should display placeholder text initially', async ({ page }) => {
    const placeholder = await page.locator('input[placeholder="Please select an option"]');
    await expect(placeholder).toBeVisible();
  });

  test('should handle scenario when default values are not provided', async ({ page }) => {
    await page.reload();
    const selectedCheckbox = await page.locator('input:checked');
    await expect(selectedCheckbox).not.toBeVisible();
  });

  test('should display appropriate message when search does not match any nodes', async ({
    page,
  }) => {
    const dropdownButton = await page.locator('button[aria-expanded="false"]');
    await dropdownButton.click();
    await page.fill('input[type="text"]', 'Non-existent Node');
    const noRecordMessage = await page.locator('div.flex-flex-row');
    await expect(noRecordMessage).toBeVisible();
  });
});
