import { test, expect } from '@playwright/test';

test.describe('Toast component in Storybook', () => {
  test('check for success toast display and dismissal', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-toast--success');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const topRightButton = frame.locator('button:has-text("Top-Right")');
    await topRightButton.click();
    const toast = frame.locator('.toast:has-text("Success! Task completed.")'); // Adjust text as necessary
    await expect(toast).toBeVisible();

    // Click to dismiss the toast
    const closeButton = toast.locator('button[aria-label="Close"]');
    await closeButton.click();

    // Ensure the toast is no longer visible
    await expect(toast).not.toBeVisible();
  });

  test('check for error toast display and dismissal', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-toast--error');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    // Trigger an error toast
    const topRightButton = frame.locator('button:has-text("Top-Right")');
    await topRightButton.click();

    // Wait for the toast to appear
    const toast = frame.locator('.toast:has-text("Error! Something went wrong.")'); // Adjust text as necessary
    await expect(toast).toBeVisible();

    // Click to dismiss the toast
    const closeButton = toast.locator('button[aria-label="Close"]');
    await closeButton.click();

    // Ensure the toast is no longer visible
    await expect(toast).not.toBeVisible();
  });

  test('check for warning toast display and dismissal', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-toast--warning');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    // Trigger a warning toast
    const topRightButton = frame.locator('button:has-text("Top-Right")');
    await topRightButton.click();

    // Wait for the toast to appear
    const toast = frame.locator('.toast:has-text("Warning! Proceed with caution.")'); // Adjust text as necessary
    await expect(toast).toBeVisible();

    // Click to dismiss the toast
    const closeButton = toast.locator('button[aria-label="Close"]');
    await closeButton.click();

    // Ensure the toast is no longer visible
    await expect(toast).not.toBeVisible();
  });

  test('check for info toast display and dismissal', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-toast--info');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    // Trigger an info toast
    const topRightButton = frame.locator('button:has-text("Top-Right")');
    await topRightButton.click();

    const toast = frame.locator('.toast:has-text("Info!")');
    await expect(toast).toBeVisible();
    const closeButton = toast.locator('button[aria-label="Close"]');
    await closeButton.click();
    await expect(toast).not.toBeVisible();
  });

  test('check for custom toast display and dismissal', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-toast--custom-toast');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const customToastButton = frame.locator('button:has-text("Show Custom Toast")');
    await customToastButton.click();
    const toast = frame.locator('.toast:has-text("This is a custom toast message.")');
    await expect(toast).toBeVisible();
    const closeButton = toast.locator('button[aria-label="Close"]');
    await closeButton.click();
    await expect(toast).not.toBeVisible();
  });
});
