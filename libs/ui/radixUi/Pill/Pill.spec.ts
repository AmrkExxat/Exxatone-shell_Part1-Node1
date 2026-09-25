import { test, expect } from '@playwright/test';

test.describe('Pill Component', () => {
  const STORYBOOK_IFRAME = 'iframe#storybook-preview-iframe';
  const baseURL = 'http://localhost:6006/?path=/story';

  // Helper function to wait for the iframe and get the frame locator
  async function waitForIframeAndGetFrame(page: any) {
    await page.waitForSelector(STORYBOOK_IFRAME, {
      state: 'visible',
      timeout: 30000,
    });
    const frame = page.frameLocator(STORYBOOK_IFRAME);
    // Wait for the frame to be fully loaded
    await page.waitForTimeout(1000);
    return frame;
  }

  // Helper function to get the pill element
  async function getPill(page: any, storyPath: string, testId = 'pill') {
    await page.goto(`${baseURL}/${storyPath}`, { waitUntil: 'domcontentloaded' });
    const frame = await waitForIframeAndGetFrame(page);
    const pillElement = frame.locator(`[data-testid="${testId}"]`);
    await expect(pillElement).toBeVisible({ timeout: 20000 });
    return { pillElement, frame };
  }

  // Helper function to navigate and wait for pills to load
  async function navigateAndWaitForPills(page: any, storyPath: string) {
    await page.goto(`${baseURL}/${storyPath}`, { waitUntil: 'domcontentloaded' });
    const frame = await waitForIframeAndGetFrame(page);
    const pills = frame.locator('[data-testid="pill"]');
    await expect(pills.first()).toBeVisible({ timeout: 20000 });
    return { pills, frame };
  }

  test.setTimeout(60000);

  /* ------------------ Core Tests ------------------ */

  test('Default pill renders correctly', async ({ page }) => {
    const { pillElement } = await getPill(page, 'radix-ui-pill--default');

    await expect(pillElement).toBeVisible();
    await expect(pillElement).toContainText('Pill Label');
  });

  test('Outlined pill renders with border', async ({ page }) => {
    const { pillElement } = await getPill(page, 'radix-ui-pill--outlined');

    await expect(pillElement).toBeVisible();
    const classes = await pillElement.getAttribute('class');
    expect(classes).toContain('border');
    expect(classes).toContain('bg-transparent');
  });

  /* ------------------ Variant Tests ------------------ */

  test('Variants story renders all color schemes for filled variant', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--variants');

    await expect(pills).toHaveCount(10, { timeout: 10000 });
  });

  test('Filled variant has correct background color for success', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--variants');

    const successPill = pills.nth(1);
    await expect(successPill).toBeVisible({ timeout: 10000 });

    const classes = await successPill.getAttribute('class');
    expect(classes).toContain('bg-green-100');
    expect(classes).toContain('text-green-700');
  });

  test('Outlined variant has correct border color for error', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--variants');

    await expect(pills).toHaveCount(10, { timeout: 10000 });

    const errorPill = pills.nth(9);
    await expect(errorPill).toBeVisible({ timeout: 10000 });

    const classes = await errorPill.getAttribute('class');
    expect(classes).toContain('border-red-500');
    expect(classes).toContain('text-red-700');
  });

  /* ------------------ Size Tests ------------------ */

  test('Sizes story renders both size variants', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--sizes');

    await expect(pills).toHaveCount(4, { timeout: 10000 });
  });

  /* ------------------ Type Tests (Shape) ------------------ */

  test('Types with close icon story renders pill and square variants', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--types-with-close-icon');

    // Should have multiple pills (3 pill type + 4 square type with icons)
    await expect(pills).toHaveCount(7, { timeout: 10000 });
  });

  test('Pill type has rounded corners', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--types-with-close-icon');

    const pillType = pills.first();
    await expect(pillType).toBeVisible({ timeout: 10000 });

    const classes = await pillType.getAttribute('class');
    // Pill type should have rounded-xl or rounded-full
    expect(classes).toMatch(/rounded-(xl|full)/);
  });

  test('Square type has minimal rounding', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--types-with-close-icon');

    // 4th pill should be square type (index 3)
    const squareType = pills.nth(3);
    await expect(squareType).toBeVisible({ timeout: 10000 });

    const classes = await squareType.getAttribute('class');
    expect(classes).toContain('rounded-md');
    expect(classes).toContain('h-6');
  });

  test('Square type pills include exactly one close icon', async ({ page }) => {
    const { frame } = await navigateAndWaitForPills(page, 'radix-ui-pill--types-with-close-icon');

    const squarePills = frame.locator('[data-testid="pill"].rounded-md');
    const squareCount = await squarePills.count();

    expect(squareCount).toBeGreaterThan(0);

    for (let i = 0; i < squareCount; i += 1) {
      const svgCount = await squarePills.nth(i).locator('svg').count();
      expect(svgCount).toBe(1);
    }
  });

  test('Small size pill has correct dimensions', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--sizes');

    const smallPill = pills.nth(0);
    await expect(smallPill).toBeVisible({ timeout: 10000 });

    const classes = await smallPill.getAttribute('class');
    expect(classes).toContain('h-6');
    expect(classes).toContain('px-2');
    expect(classes).toContain('text-xs');
  });

  test('Medium size pill has correct dimensions', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--sizes');

    await expect(pills).toHaveCount(4, { timeout: 10000 });

    const mediumPill = pills.nth(1);
    await expect(mediumPill).toBeVisible({ timeout: 10000 });

    const classes = await mediumPill.getAttribute('class');
    expect(classes).toContain('h-7');
    expect(classes).toContain('px-3');
    expect(classes).toContain('text-sm');
  });

  /* ------------------ Adornment Tests ------------------ */

  test('Pill with start adornment renders icon', async ({ page }) => {
    const { frame } = await navigateAndWaitForPills(page, 'radix-ui-pill--with-start-adornment');

    const startAdornment = frame.locator('[data-testid="pill-start-adornment"]').first();
    await expect(startAdornment).toBeVisible({ timeout: 10000 });

    const svg = startAdornment.locator('svg');
    await expect(svg).toBeVisible({ timeout: 10000 });
  });

  test('Pill with end adornment renders icon', async ({ page }) => {
    const { frame } = await navigateAndWaitForPills(page, 'radix-ui-pill--with-end-adornment');

    const endAdornment = frame.locator('[data-testid="pill-end-adornment"]').first();
    await expect(endAdornment).toBeVisible({ timeout: 10000 });

    // Should contain an SVG icon
    const svg = endAdornment.locator('svg');
    await expect(svg).toBeVisible({ timeout: 10000 });
  });

  test('Pill with both adornments renders correctly', async ({ page }) => {
    const { frame } = await navigateAndWaitForPills(page, 'radix-ui-pill--with-both-adornments');

    const startAdornment = frame.locator('[data-testid="pill-start-adornment"]').first();
    const endAdornment = frame.locator('[data-testid="pill-end-adornment"]').first();

    await expect(startAdornment).toBeVisible({ timeout: 10000 });
    await expect(endAdornment).toBeVisible({ timeout: 10000 });
  });

  /* ------------------ Custom Color Tests ------------------ */

  test('Custom colors story renders pills with custom background', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--custom-colors');

    const perfectFitPill = pills.first();
    await expect(perfectFitPill).toBeVisible({ timeout: 10000 });

    const style = await perfectFitPill.getAttribute('style');
    expect(style).toContain('background-color');
  });

  test('Custom outlined pill has custom border color', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--custom-colors');

    await expect(pills).toHaveCount(7, { timeout: 10000 });

    const customOutlinedPill = pills.nth(4);
    await expect(customOutlinedPill).toBeVisible({ timeout: 10000 });

    const style = await customOutlinedPill.getAttribute('style');
    expect(style).toContain('border-color');
  });

  /* ------------------ Status Pills Tests ------------------ */

  test('Status pills story renders application status pills', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--status-pills');

    await expect(pills).toHaveCount(4, { timeout: 10000 });

    const submittedPill = pills.first();
    const classes = await submittedPill.getAttribute('class');
    expect(classes).toContain('bg-green-100');
  });

  /* ------------------ Action Required Tests ------------------ */

  test('Action required pills render with outlined variant', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--action-required');

    await expect(pills).toHaveCount(3, { timeout: 10000 });

    const actionRequiredPill = pills.first();
    const classes = await actionRequiredPill.getAttribute('class');
    expect(classes).toContain('border');
    expect(classes).toContain('border-red-500');
  });

  /* ------------------ Attribute Tags Tests ------------------ */

  test('Attribute tags story renders job attribute pills', async ({ page }) => {
    const { pills } = await navigateAndWaitForPills(page, 'radix-ui-pill--attribute-tags');

    await expect(pills).toHaveCount(4, { timeout: 10000 });

    // All should be outlined default
    const firstPill = pills.first();
    const classes = await firstPill.getAttribute('class');
    expect(classes).toContain('border');
    expect(classes).toContain('border-gray-300');
  });

  /* ------------------ Accessibility Tests ------------------ */

  test('Pill has correct test id attribute', async ({ page }) => {
    const { pillElement } = await getPill(page, 'radix-ui-pill--default');

    await expect(pillElement).toHaveAttribute('data-testid', 'pill');
  });

  test('Pill content is accessible', async ({ page }) => {
    const { pillElement } = await getPill(page, 'radix-ui-pill--default');

    await expect(pillElement).toContainText('Pill Label');
  });

  /* ------------------ Negative Tests ------------------ */

  test('Pill should not be visible if incorrect testId is used', async ({ page }) => {
    await page.goto(`${baseURL}/radix-ui-pill--default`);
    const frame = await waitForIframeAndGetFrame(page);
    const pillElement = frame.locator('[data-testid="non-existent-pill"]');
    await expect(pillElement).not.toBeVisible();
  });

  test('Outlined pill does not have filled background classes', async ({ page }) => {
    const { pillElement } = await getPill(page, 'radix-ui-pill--outlined');

    const classes = await pillElement.getAttribute('class');
    expect(classes).toContain('bg-transparent');
    expect(classes).not.toContain('bg-gray-100');
  });
});
