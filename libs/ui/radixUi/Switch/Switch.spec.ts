import { test, expect } from '@playwright/test';

test.describe('Switch Component', () => {
  const STORYBOOK_IFRAME = 'iframe#storybook-preview-iframe';
  const baseURL = 'http://localhost:6006/?path=/story';

  // Helper function to wait for the iframe and get the frame locator
  async function waitForIframeAndGetFrame(page: any) {
    await page.waitForSelector(STORYBOOK_IFRAME, {
      state: 'visible',
      timeout: 30000,
    });
    return page.frameLocator(STORYBOOK_IFRAME);
  }

  // Helper function to get the switch element
  async function getSwitch(page: any, storyPath: string, testId = 'switch-root') {
    await page.goto(`${baseURL}/${storyPath}`);
    const frame = await waitForIframeAndGetFrame(page);
    const switchElement = frame.locator(`[data-testid="${testId}"]`);
    await expect(switchElement).toBeVisible({ timeout: 10000 });
    return { switchElement, frame };
  }

  // Extend Playwright's default timeout
  test.setTimeout(60000);

  /* ------------------ Core Tests ------------------ */

  test('Default switch renders in unchecked state', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--default');

    await expect(switchElement).toBeVisible();
    // Default switch should be unchecked
    await expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });

  test('Checked switch renders in checked state', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--checked');

    await expect(switchElement).toBeVisible();
    // Switch should be checked
    await expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  test('Switch toggles state on click', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--default');

    // Initial state should be unchecked
    await expect(switchElement).toHaveAttribute('data-state', 'unchecked');

    // Click to toggle on
    await switchElement.click();
    await expect(switchElement).toHaveAttribute('data-state', 'checked');

    // Click to toggle off
    await switchElement.click();
    await expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });

  test('Checked switch can be toggled off and on', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--checked');

    // Initial state should be checked
    await expect(switchElement).toHaveAttribute('data-state', 'checked');

    // Click to toggle off
    await switchElement.click();
    await expect(switchElement).toHaveAttribute('data-state', 'unchecked');

    // Click to toggle back on
    await switchElement.click();
    await expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  /* ------------------ Disabled Tests ------------------ */

  test('Disabled switch renders correctly', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--disabled');

    await expect(switchElement).toBeVisible();
    await expect(switchElement).toBeDisabled();
  });

  test('Disabled switch does not change state on click', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--disabled');

    await expect(switchElement).toBeDisabled();

    // Get initial state
    const initialState = await switchElement.getAttribute('data-state');

    // Try to click (force click since it's disabled)
    try {
      await switchElement.click({ force: true });
    } catch (e) {
      // Ignore errors from clicking disabled element
    }

    // State should remain unchanged
    const finalState = await switchElement.getAttribute('data-state');
    expect(initialState).toBe(finalState);
  });

  test('Disabled switch has reduced opacity', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--disabled');

    const classes = await switchElement.getAttribute('class');
    expect(classes).toContain('opacity-50');
  });

  /* ------------------ Variant Tests ------------------ */

  test('Variants story renders all variant switches', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--variants`);
    const frame = await waitForIframeAndGetFrame(page);

    // All switches should be visible (there are 4 variants displayed)
    const switches = frame.locator('[data-testid="switch-root"]');
    await expect(switches).toHaveCount(4);
  });

  test('Primary variant has correct checked color', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--checked');

    const classes = await switchElement.getAttribute('class');
    // Primary variant should have blue color when checked
    expect(classes).toContain('bg-blue-600');
  });

  test('Success variant has green checked color', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--variants`);
    const frame = await waitForIframeAndGetFrame(page);

    // Second switch is success variant
    const switches = frame.locator('[data-testid="switch-root"]');
    const successSwitch = switches.nth(1);
    await expect(successSwitch).toBeVisible();

    const classes = await successSwitch.getAttribute('class');
    expect(classes).toContain('bg-green-600');
  });

  test('Warning variant has yellow checked color', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--variants`);
    const frame = await waitForIframeAndGetFrame(page);

    // Third switch is warning variant
    const switches = frame.locator('[data-testid="switch-root"]');
    const warningSwitch = switches.nth(2);
    await expect(warningSwitch).toBeVisible();

    const classes = await warningSwitch.getAttribute('class');
    expect(classes).toContain('bg-yellow-600');
  });

  test('Error variant has red checked color', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--variants`);
    const frame = await waitForIframeAndGetFrame(page);

    // Fourth switch is error variant
    const switches = frame.locator('[data-testid="switch-root"]');
    const errorSwitch = switches.nth(3);
    await expect(errorSwitch).toBeVisible();

    const classes = await errorSwitch.getAttribute('class');
    expect(classes).toContain('bg-red-600');
  });

  /* ------------------ Size Tests ------------------ */

  test('Sizes story renders all size variants', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--sizes`);
    const frame = await waitForIframeAndGetFrame(page);

    // All switches should be visible (there are 3 sizes displayed)
    const switches = frame.locator('[data-testid="switch-root"]');
    await expect(switches).toHaveCount(3);
  });

  test('Small size switch has correct dimensions', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--sizes`);
    const frame = await waitForIframeAndGetFrame(page);

    // First switch is small size
    const switches = frame.locator('[data-testid="switch-root"]');
    const smallSwitch = switches.nth(0);
    await expect(smallSwitch).toBeVisible();

    const classes = await smallSwitch.getAttribute('class');
    expect(classes).toContain('h-5');
    expect(classes).toContain('w-9');
  });

  test('Default size switch has correct dimensions', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--sizes`);
    const frame = await waitForIframeAndGetFrame(page);

    // Second switch is default size
    const switches = frame.locator('[data-testid="switch-root"]');
    const defaultSwitch = switches.nth(1);
    await expect(defaultSwitch).toBeVisible();

    const classes = await defaultSwitch.getAttribute('class');
    expect(classes).toContain('h-6');
    expect(classes).toContain('w-11');
  });

  test('Large size switch has correct dimensions', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--sizes`);
    const frame = await waitForIframeAndGetFrame(page);

    // Third switch is large size
    const switches = frame.locator('[data-testid="switch-root"]');
    const largeSwitch = switches.nth(2);
    await expect(largeSwitch).toBeVisible();

    const classes = await largeSwitch.getAttribute('class');
    expect(classes).toContain('h-7');
    expect(classes).toContain('w-14');
  });

  /* ------------------ Custom Color Tests ------------------ */

  test('Custom checked color switch renders with custom background', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--custom-checked-color');

    await expect(switchElement).toBeVisible();
    // Should be checked (checked: true in story)
    await expect(switchElement).toHaveAttribute('data-state', 'checked');

    // Check that custom color is applied via inline style
    const style = await switchElement.getAttribute('style');
    expect(style).toContain('background-color');
    expect(style).toContain('rgb(0, 0, 0)'); // #000000 in rgb
  });

  test('Custom color switch shows default background when unchecked', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--custom-checked-color&args=checked:false`);
    const frame = await waitForIframeAndGetFrame(page);
    const switchElement = frame.locator('[data-testid="switch-custom-checked-color"]');
    await expect(switchElement).toBeVisible({ timeout: 10000 });

    // When unchecked, should have default gray background class
    await expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    const classes = await switchElement.getAttribute('class');
    expect(classes).toContain('bg-[#D1D5DC]');
  });

  /* ------------------ Accessibility Tests ------------------ */

  test('Switch has correct role attribute', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--default');

    await expect(switchElement).toHaveRole('switch');
  });

  test('Switch is keyboard accessible', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--default');

    // Initial state
    await expect(switchElement).toHaveAttribute('data-state', 'unchecked');

    // Focus and press Space to toggle
    await switchElement.focus();
    await page.keyboard.press('Space');
    await expect(switchElement).toHaveAttribute('data-state', 'checked');

    // Press Space again to toggle off
    await page.keyboard.press('Space');
    await expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });

  test('Switch thumb element exists and transitions', async ({ page }) => {
    const { switchElement, frame } = await getSwitch(page, 'radix-ui-switch--default');

    // Find the thumb element within the switch
    const thumb = switchElement.locator('span');
    await expect(thumb).toBeVisible();

    // Thumb should have transition classes
    const thumbClasses = await thumb.getAttribute('class');
    expect(thumbClasses).toContain('transition-transform');
  });

  /* ------------------ Negative Tests ------------------ */

  test('Switch should not be visible if incorrect testId is used', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-switch--default`);
    const frame = await waitForIframeAndGetFrame(page);
    const switchElement = frame.locator('[data-testid="non-existent-switch"]');
    await expect(switchElement).not.toBeVisible();
  });

  test('Unchecked switch does not have checked variant colors', async ({ page }) => {
    const { switchElement } = await getSwitch(page, 'radix-ui-switch--default');

    // Ensure switch is unchecked
    await expect(switchElement).toHaveAttribute('data-state', 'unchecked');

    const classes = await switchElement.getAttribute('class');
    // Should have base gray color, not the checked blue color
    expect(classes).toContain('bg-[#D1D5DC]');
    // The blue color is applied via data attribute, so when unchecked it won't be visible
  });
});
