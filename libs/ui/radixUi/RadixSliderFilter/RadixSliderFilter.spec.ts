import { expect, test } from '@playwright/test';

// Helper to reliably get the Storybook preview iframe
async function waitForIframeAndGetFrame(page) {
  await page.waitForSelector('iframe#storybook-preview-iframe', { timeout: 30000 });
  return page.frameLocator('iframe#storybook-preview-iframe');
}

// Increase default timeout for slower Storybook loads
test.setTimeout(60000);

test.describe('RadixSlider in Storybook', () => {
  const baseURL = 'http://localhost:6006/?path=/story';

  test('renders the default slider trigger with label', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixslider--default`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.getByRole('button', { name: 'Price range' });
    await expect(trigger).toBeVisible({ timeout: 20000 });
  });

  test('applies object defaultValue and displays correct range with suffix unit', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/radix-ui-radixslider--suffix-unit`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.getByRole('button', { name: 'Weight range' });
    await expect(trigger).toBeVisible();

    // Open the popover
    await trigger.click();

    // Scope to the dialog to avoid strict-mode ambiguity
    const dialog = frame.getByRole('dialog');
    const rangeSummary = dialog.getByText('50kg – 150kg');
    await expect(rangeSummary).toBeVisible();
  });
  test('respects disabled state', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixslider--disabled`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.getByRole('button', { name: 'Disabled range' });
    await expect(trigger).toBeVisible({ timeout: 20000 });
    await expect(trigger).toBeDisabled();
  });

  test('applies custom styling to the trigger', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixslider--custom-styling`);
    const frame = await waitForIframeAndGetFrame(page);

    const trigger = frame.getByRole('button', { name: 'Custom styled range' });
    await expect(trigger).toBeVisible({ timeout: 20000 });

    const triggerClass = await trigger.getAttribute('class');
    expect(triggerClass).toBeTruthy();
    expect(triggerClass).toContain('border-0');
    expect(triggerClass).toContain('bg-gray-900');
  });

  test('updates controlled value text when slider changes', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-radixslider--controlled`);
    const frame = await waitForIframeAndGetFrame(page);

    // Verify initial controlled text from { min: 10, max: 90 }
    const valueText = frame.getByText('Current value:', { exact: false });
    await expect(valueText).toContainText('10% – 90%', { timeout: 20000 });

    const trigger = frame.getByRole('button', { name: 'Controlled range' });
    await trigger.click();

    // Get the second thumb (max handle) and move it left to reduce max value
    const thumbs = frame.getByRole('slider');
    await thumbs.nth(1).click();

    // Move max thumb 10 steps left (from 90 to 80 with step=1)
    for (let i = 0; i < 10; i++) {
      await thumbs.nth(1).press('ArrowLeft');
    }

    await expect(valueText).toContainText('10% – 80%', { timeout: 20000 });
  });
});
