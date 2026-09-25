import { expect, test } from '@playwright/test';

// Function to wait for the iframe and get the frame locator
async function waitForIframeAndGetFrame(page) {
  await page.waitForSelector('iframe#storybook-preview-iframe', { timeout: 30000 });
  return page.frameLocator('iframe#storybook-preview-iframe');
}

// Extend Playwright's default timeout
test.setTimeout(60000);

test.describe('RadixAccordion component in Storybook', () => {
  const baseURL = 'http://localhost:6006/?path=/story';

  test('renders the accordion with title', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const accordion = frame.locator('.radix-import-accordion-wrapper');
    await expect(accordion).toBeVisible({ timeout: 20000 });

    const title = frame.locator('.radix-import-accordion-title-text');
    await expect(title).toBeVisible({ timeout: 20000 });
    await expect(title).toContainText('What is Radix UI?');
  });

  test('renders the accordion with subtitle', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const accordion = frame.locator('.radix-import-accordion-wrapper');
    await expect(accordion).toBeVisible({ timeout: 20000 });

    const subtitle = frame.locator('.radix-import-accordion-title').locator('span').last();
    await expect(subtitle).toBeVisible({ timeout: 20000 });
  });

  test('toggles the accordion on click', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.locator('.radix-import-accordion-trigger');
    await trigger.waitFor({ state: 'visible', timeout: 20000 });

    const content = frame.locator('.radix-import-accordion-content');

    // Initially closed
    await expect(content).toBeHidden({ timeout: 5000 });

    // Click to open
    await trigger.click();
    await expect(content).toBeVisible({ timeout: 5000 });

    // Click to close
    await trigger.click();
    await expect(content).toBeHidden({ timeout: 5000 });
  });

  test('displays content when expanded', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.locator('.radix-import-accordion-trigger');
    await trigger.waitFor({ state: 'visible', timeout: 20000 });

    // Click to open
    await trigger.click();

    const content = frame.locator('.radix-import-accordion-body');
    await expect(content).toBeVisible({ timeout: 5000 });
    await expect(content).toContainText('Radix UI is a low-level UI component library');
  });

  test('accordion has correct width styling', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const accordion = frame.locator('.radix-import-accordion-wrapper');
    await accordion.waitFor({ state: 'visible', timeout: 20000 });

    const style = await accordion.getAttribute('style');
    expect(style).toContain('width');
  });

  test('accordion trigger is clickable', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.locator('.radix-import-accordion-trigger');
    await trigger.waitFor({ state: 'visible', timeout: 20000 });

    const isEnabled = await trigger.isEnabled();
    expect(isEnabled).toBe(true);
  });

  test('accordion contains chevron icon', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.locator('.radix-import-accordion-trigger');
    await trigger.waitFor({ state: 'visible', timeout: 20000 });

    const icon = trigger.locator('svg');
    await expect(icon).toBeVisible({ timeout: 5000 });
  });

  test('accordion header structure is correct', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const header = frame.locator('.radix-import-accordion-header');
    await expect(header).toBeVisible({ timeout: 20000 });

    const item = frame.locator('.radix-import-accordion-item');
    await expect(item).toBeVisible({ timeout: 20000 });

    const root = frame.locator('.radix-import-accordion');
    await expect(root).toBeVisible({ timeout: 20000 });
  });

  test('accordion can be opened and closed multiple times', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.locator('.radix-import-accordion-trigger');
    await trigger.waitFor({ state: 'visible', timeout: 20000 });

    const content = frame.locator('.radix-import-accordion-content');

    // First cycle
    await trigger.click();
    await expect(content).toBeVisible({ timeout: 5000 });
    await trigger.click();
    await expect(content).toBeHidden({ timeout: 5000 });

    // Second cycle
    await trigger.click();
    await expect(content).toBeVisible({ timeout: 5000 });
    await trigger.click();
    await expect(content).toBeHidden({ timeout: 5000 });

    // Third cycle
    await trigger.click();
    await expect(content).toBeVisible({ timeout: 5000 });
  });

  test('accordion wrapper has correct class names', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixaccordion--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const wrapper = frame.locator('.radix-import-accordion-wrapper');
    await wrapper.waitFor({ state: 'visible', timeout: 20000 });

    const className = await wrapper.getAttribute('class');
    expect(className).toContain('radix-import-accordion-wrapper');
  });
});
