import { test, expect } from '@playwright/test';

test.describe('Tooltip component in Storybook', () => {
  test('simple tooltip', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-tooltip--tooltip-story');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    // Locate the div element with text "hello"
    const text = frame.locator('div.cursor-pointer');

    await text.waitFor({ state: 'visible', timeout: 60000 });

    // Trigger mouse hover
    await text.hover();

    //check if tooltip is visible or not.
    const tooltip = frame.locator('#tooltip-content'); // find tooltip div with id.
    await expect(tooltip).toBeVisible();

    //trigger mouse leave event
    await page.mouse.move(0, 0);
    // check if tooltip disapperas or not.
    await expect(tooltip).not.toBeVisible();
  });

  test('tooltip with content', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-tooltip--tooltip-with-content');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    // Locate the div element with text "hello"
    const text = frame.locator('div.cursor-pointer');
    await text.waitFor({ state: 'visible', timeout: 60000 });

    // Trigger mouse hover
    await text.hover();

    //check if tooltip is visible or not.
    const tooltip = frame.locator('#tooltip-content');
    await expect(tooltip).toBeVisible();

    //trigger mouse leave event
    await page.mouse.move(0, 0);
    await expect(tooltip).not.toBeVisible();

    //test tooltip content

    await text.hover();
    const headertext = frame.locator('h2');
    await expect(headertext).toHaveText('Card Title');

    const actionButton = frame.locator('#action');
    await actionButton.click();
  });
});
