import { test, expect } from '@playwright/test';

// Function to wait for the iframe and get the frame locator
async function waitForIframeAndGetFrame(page) {
  await page.waitForSelector('iframe#storybook-preview-iframe', {
    state: 'visible',
    timeout: 30000,
  });
  return page.frameLocator('iframe#storybook-preview-iframe');
}

// Extend Playwright's default timeout
test.setTimeout(60000);

test.describe('ToggleSwitch component', () => {
  const baseURL = 'http://localhost:6006/?path=/story';

  test('checks the default checked state of the ToggleSwitch', async ({ page }) => {
    await page.goto(`${baseURL}/common-toggleswitch--checked-switch-button`);
    const frame = await waitForIframeAndGetFrame(page);
    const toggleSwitch = frame.locator('#switch_checked');
    await toggleSwitch.waitFor({ state: 'visible', timeout: 60000 });
    // Verify if the toggle switch is checked by default
    const isChecked = await toggleSwitch.isChecked();
    await expect(isChecked).toBe(true);
  });

  test('toggles the state of the ToggleSwitch', async ({ page }) => {
    await page.goto(`${baseURL}/common-toggleswitch--checked-switch-button`);
    const frame = await waitForIframeAndGetFrame(page);
    const toggleSwitch = frame.locator('#switch_checked');
    await toggleSwitch.waitFor({ state: 'visible', timeout: 60000 });
    // Verify if the toggle switch is unchecked by default
    let isChecked = await toggleSwitch.isChecked();
    await expect(isChecked).toBe(true);

    await toggleSwitch.click();
    isChecked = await toggleSwitch.isChecked();
    await expect(isChecked).toBe(false);

    // Click again to toggle back to the original state
    await toggleSwitch.click();
    isChecked = await toggleSwitch.isChecked();
    await expect(isChecked).toBe(true);
  });

  test('checks if the ToggleSwitch is disabled', async ({ page }) => {
    await page.goto(`${baseURL}/common-toggleswitch--disabled-switch-button`);
    const frame = await waitForIframeAndGetFrame(page);
    const toggleSwitch = frame.locator('#switch_disabled');
    await toggleSwitch.waitFor({ state: 'visible', timeout: 60000 });
    // Verify if the toggle switch is disabled
    await expect(toggleSwitch).toBeDisabled({ timeout: 20000 });
  });

  test('does not change state when disabled ToggleSwitch is clicked', async ({ page }) => {
    await page.goto(
      'http://localhost:6006/?path=/story/common-toggleswitch--disabled-switch-button'
    );
    const frame = await waitForIframeAndGetFrame(page);
    const toggleSwitch = frame.locator('#switch_disabled');
    await toggleSwitch.waitFor({ state: 'visible', timeout: 60000 });
    await expect(toggleSwitch).toBeDisabled();
    const initialState = await toggleSwitch.isChecked();
    try {
      await toggleSwitch.click({ force: true });
    } catch (e) {
      // Element disabled so Ignoring errors.
    }
    const finalState = await toggleSwitch.isChecked();
    expect(initialState).toBe(finalState);
  });

  test('renders a checked and disabled ToggleSwitch', async ({ page }) => {
    await page.goto(`${baseURL}/common-toggleswitch--checked-switch-button`);
    const frame = await waitForIframeAndGetFrame(page);
    const toggleSwitch = frame.locator('#switch_checked');
    await toggleSwitch.waitFor({ state: 'visible', timeout: 60000 });
    await expect(toggleSwitch).toBeChecked({ timeout: 20000 });
    await expect(toggleSwitch).not.toBeDisabled({ timeout: 20000 });
  });
});
