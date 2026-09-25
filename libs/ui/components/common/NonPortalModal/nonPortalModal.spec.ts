import { expect, test } from '@playwright/test';

test.describe('NonPortalModal Component', () => {
  test('opens and closes in default story', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-nonportalmodal--default');

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const openButton = frame.locator('#non-portal-modal-open-btn');
    await openButton.waitFor({ state: 'visible', timeout: 60000 });
    await openButton.click();

    const modal = frame.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible' });
    await expect(modal).toBeVisible();

    const title = modal.getByText('Non Portal Modal');
    await expect(title).toBeVisible();

    const closeButton = frame.locator('button[aria-label="Close dialog"]');
    await closeButton.click();
    await expect(modal).toBeHidden();
  });

  test('applies the expected size class for 2xl story', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-nonportalmodal--two-extra-large');

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const openButton = frame.locator('#non-portal-modal-open-btn');
    await openButton.waitFor({ state: 'visible', timeout: 60000 });
    await openButton.click();

    const panel = frame.locator('[role="dialog"] > div.relative').first();
    await expect(panel).toHaveClass(/max-w-2xl/);
  });
});
