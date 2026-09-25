import { test, expect } from '@playwright/test';

test.describe('BannerComponent', () => {
  const STORYBOOK_IFRAME = 'iframe#storybook-preview-iframe';

  async function getBanner(page: any, storyPath: string, testId = 'banner-root') {
    await page.goto(`http://localhost:6006/?path=/story/${storyPath}`);
    const frame = page.frameLocator(STORYBOOK_IFRAME);
    const banner = frame.locator(`[data-testid="${testId}"]`);
    await expect(banner).toBeVisible({ timeout: 10000 });
    return banner;
  }

  /* ------------------ Positive Tests ------------------ */

  test('Info banner renders with title and message', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--info', 'banner-info');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(frame.locator('div').filter({ hasText: 'Information' }).first()).toBeVisible();

    await page.waitForTimeout(10000);
    await expect(frame.getByText('This is an informational')).toBeVisible();

    const classes = await banner.getAttribute('class');
    expect(classes).toContain('bg-blue-50');
    expect(classes).toContain('text-blue-800');
  });

  test('Success banner renders with default icon', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--success', 'banner-success');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(frame.locator('div').filter({ hasText: 'Success' }).first()).toBeVisible();

    await page.waitForTimeout(10000);
    await expect(frame.getByText('Your changes have been saved successfully')).toBeVisible();

    await expect(banner.locator('svg')).toBeVisible();
    const classes = await banner.getAttribute('class');
    expect(classes).toContain('bg-green-50');
  });

  test('Warning banner renders with custom horizontal alignment', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--warning', 'banner-warning');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(frame.locator('div').filter({ hasText: 'Warning' }).first()).toBeVisible();

    await page.waitForTimeout(10000);
    await expect(frame.getByText('Please review the details before continuing')).toBeVisible();

    await expect(banner).toBeVisible();
    await expect(banner.locator('svg')).toBeVisible();
    const classes = await banner.getAttribute('class');
    expect(classes).toContain('bg-yellow-50');
  });

  test('Error banner renders correctly', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--error', 'banner-error');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(frame.locator('div').filter({ hasText: 'Error' }).first()).toBeVisible();

    await page.waitForTimeout(10000);
    await expect(frame.getByText('Something went wrong. Please try again.')).toBeVisible();

    const classes = await banner.getAttribute('class');
    expect(classes).toContain('bg-red-50');
    expect(classes).toContain('text-red-800');
  });

  test('Banner without title renders only message', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--without-title', 'banner-without-title');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(frame.getByText('This banner is rendered without a title.')).toBeVisible();
  });

  /* ------------------ Customizations ------------------ */

  test('Custom icon banner renders with bell icon', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--custom-icon', 'banner-custom-icon');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(frame.locator('div').filter({ hasText: 'Custom icon' }).first()).toBeVisible();

    await page.waitForTimeout(10000);
    await expect(frame.getByText('Using a bell icon instead of the default.')).toBeVisible();

    await expect(banner.locator('svg')).toBeVisible();
  });

  test('Large size banner renders with larger typography', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--large-size', 'banner-large');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(frame.locator('div').filter({ hasText: 'Large Banner' }).first()).toBeVisible();

    await page.waitForTimeout(10000);
    await expect(frame.getByText('This banner uses larger typography.')).toBeVisible();
  });

  test('Center aligned banner renders with centered content', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--center-aligned', 'banner-center');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(
      frame.locator('div').filter({ hasText: 'Centered content' }).first()
    ).toBeVisible();

    await page.waitForTimeout(10000);
    await expect(frame.getByText('This banner content is horizontally centered.')).toBeVisible();
  });

  test('Custom colors banner renders with purple theme', async ({ page }) => {
    const banner = await getBanner(page, 'radix-ui-banner--custom-colors', 'banner-custom-colors');
    const frame = page.frameLocator(STORYBOOK_IFRAME);

    await page.waitForTimeout(10000);
    await expect(frame.locator('div').filter({ hasText: 'Custom colors' }).first()).toBeVisible();

    await page.waitForTimeout(10000);
    await expect(frame.getByText('Background and text colors are customized.')).toBeVisible();

    const classes = await banner.getAttribute('class');
    expect(classes).toContain('bg-purple-50');
    expect(classes).toContain('text-purple-800');
  });

  /* ------------------ Negative Tests ------------------ */

  test('Banner should not be visible if incorrect testId is used', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/radix-ui-banner--info');
    const frame = page.frameLocator(STORYBOOK_IFRAME);
    const banner = frame.locator('[data-testid="non-existent-banner"]');
    await expect(banner).not.toBeVisible();
  });
});
