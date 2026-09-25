import { test, expect } from '@playwright/test';

test.describe('ShowMore component in Storybook', () => {
  test('check for showmore without Hyper link', async ({ page }) => {
    await page.goto(
      'http://localhost:6006/?path=/story/common-showmore--showmore-without-hyper-link'
    );
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const showMoreButton = frame.locator('#Show_More_Icon'); //find showMore button

    await showMoreButton.waitFor({ state: 'visible', timeout: 60000 });

    await showMoreButton.hover(); //hover on showMore button

    //check if tooltip is visible or not.
    const tooltip = frame.locator('div.show_more_tooltip'); // find tooltip div with classname.
    await expect(tooltip).toBeVisible();
  });

  test('check for showmore with Hyper link', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-showmore--showmore-with-hyper-link');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const hyperlink = frame.locator('text = Angular');

    // Click on hyperlink
    await hyperlink.click();

    // Wait for navigation to complete
    await page.waitForLoadState('load');

    // Assert that the page URL is correct
    // await expect(page).toHaveURL('http://localhost:6006/?path=/docs/common-table--docs');

    // Go back to the previous URL
    // await page.goBack();

    // Wait for the navigation to complete
    // await page.waitForLoadState('load');

    // Assert the URL has returned to the initial URL
    // await expect(page).toHaveURL('http://localhost:6006/?path=/story/common-showmore--showmore-with-hyper-link');

    const showMoreButton = frame.locator('#Show_More_Icon'); //find showMore button

    await showMoreButton.waitFor({ state: 'visible', timeout: 60000 });

    await showMoreButton.hover(); //hover on showMore button

    //check if tooltip is visible or not.
    const tooltip = frame.locator('div.show_more_tooltip'); // find tooltip div with classname.
    await expect(tooltip).toBeVisible();

    const tooltipHyperlink = frame.locator('text = JavaScript'); // find name in tooltip

    // Click on that name
    await tooltipHyperlink.click();

    // Wait for navigation to complete
    await page.waitForLoadState('load');

    // Assert that the page URL is correct
    // await expect(page).toHaveURL('http://localhost:6006/?path=/docs/common-button--docs');
  });
});
