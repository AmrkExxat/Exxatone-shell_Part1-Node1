import { expect, test } from '@playwright/test';

// Function to wait for the iframe and get the frame locator
async function waitForIframeAndGetFrame(page) {
  await page.waitForSelector('iframe#storybook-preview-iframe', { timeout: 30000 });
  return page.frameLocator('iframe#storybook-preview-iframe');
}

// Extend Playwright's default timeout
test.setTimeout(60000);

test.describe('Accordion component', () => {
  const baseURL = 'http://localhost:6006/?path=/story';

  test('renders the simple accordion', async ({ page }) => {
    await page.goto(`${baseURL}/common-accordion--simple-accordion`);
    const frame = await waitForIframeAndGetFrame(page);
    const accordion = frame.locator('.accordion');
    await expect(accordion).toBeVisible({ timeout: 20000 });
  });

  test('toggles the simple accordion', async ({ page }) => {
    await page.goto(`${baseURL}/common-accordion--simple-accordion`);
    const frame = await waitForIframeAndGetFrame(page);
    const accordionHeader = frame.locator('#accordion_example');
    const accordionContent = frame.locator('.accordion-content');

    await expect(accordionContent).toBeHidden({ timeout: 20000 });
    await accordionHeader.click();
    await expect(accordionContent).toBeVisible({ timeout: 20000 });
    await accordionHeader.click();
    await expect(accordionContent).toBeHidden({ timeout: 20000 });
  });

  test('accordion with action header', async ({ page }) => {
    await page.goto(`${baseURL}/common-accordion--accordion-with-action-header`);
    const frame = await waitForIframeAndGetFrame(page);
    const accordionHeader = frame.locator('#accordion_example');
    const checkbox = accordionHeader.locator('input[type="checkbox"]');

    await expect(checkbox).toBeVisible({ timeout: 20000 });
    await checkbox.check();
    await expect(checkbox).toBeChecked({ timeout: 20000 });
  });
});
