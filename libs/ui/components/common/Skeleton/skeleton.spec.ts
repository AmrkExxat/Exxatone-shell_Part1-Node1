import { expect, test } from '@playwright/test';

test.describe('skeleton component in Storybook', () => {
  test('Default skeleton', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-skeleton--default');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const skeleton = frame.locator('div[role="status"]');
    await skeleton.waitFor({ state: 'visible', timeout: 60000 });
    await expect(skeleton).toBeVisible();
  });

  test('Card skeleton', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-skeleton--card');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const skeleton = frame.locator('div[role="status"]');
    await skeleton.waitFor({ state: 'visible', timeout: 60000 });
    await expect(skeleton).toBeVisible();
  });

  test('Text skeleton', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-skeleton--text');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const skeleton = frame.locator('div[role="status"]');
    await skeleton.waitFor({ state: 'visible', timeout: 60000 });
    await expect(skeleton).toBeVisible();
  });

  test('Image skeleton', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-skeleton--image');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const skeleton = frame.locator('div[role="status"]');
    await skeleton.waitFor({ state: 'visible', timeout: 60000 });
    await expect(skeleton).toBeVisible();
  });

  test('Widget skeleton', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-skeleton--widget');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const skeleton = frame.locator('div[role="status"]');
    await skeleton.waitFor({ state: 'visible', timeout: 60000 });
    await expect(skeleton).toBeVisible();
  });

  test('List skeleton', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-skeleton--list');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const skeleton = frame.locator('div[role="status"]');
    await skeleton.waitFor({ state: 'visible', timeout: 60000 });
    await expect(skeleton).toBeVisible();
  });
});
