import { test, expect } from '@playwright/test';

test.describe('StatusBadge Component', () => {
  const STORYBOOK_IFRAME = 'iframe#storybook-preview-iframe';
  const BASE_URL = 'http://localhost:6006/?path=/story/common-statusbadge';

  async function getFrame(page: any) {
    await page.waitForSelector(STORYBOOK_IFRAME, { state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1000);
    return page.frameLocator(STORYBOOK_IFRAME);
  }

  async function navigateTo(page: any, story: string) {
    await page.goto(`${BASE_URL}--${story}`, { waitUntil: 'domcontentloaded' });
    return getFrame(page);
  }

  test.setTimeout(60000);

  /* -------------------- Default Story -------------------- */

  test('Default badge renders with correct label', async ({ page }) => {
    const frame = await navigateTo(page, 'default');
    const badge = frame.locator('span').filter({ hasText: 'Confirmed' }).first();

    await expect(badge).toBeVisible({ timeout: 20000 });
    await expect(badge).toContainText('Confirmed');
  });

  test('Default badge applies confirmed (green) styling', async ({ page }) => {
    const frame = await navigateTo(page, 'default');
    const badge = frame.locator('span').filter({ hasText: 'Confirmed' }).first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await badge.getAttribute('class');

    expect(classes).toContain('bg-green-100');
    expect(classes).toContain('border-green-200');
    expect(classes).toContain('text-green-700');
  });

  test('Default badge does not show a chevron by default', async ({ page }) => {
    const frame = await navigateTo(page, 'default');
    const badge = frame.locator('span').filter({ hasText: 'Confirmed' }).first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const chevron = badge.locator('svg');

    await expect(chevron).not.toBeVisible();
  });

  /* -------------------- Clickable Story -------------------- */

  test('Clickable badge renders as a button element', async ({ page }) => {
    const frame = await navigateTo(page, 'clickable');
    const button = frame.locator('button').first();

    await expect(button).toBeVisible({ timeout: 20000 });
  });

  test('Clickable badge applies action-needed (orange) styling', async ({ page }) => {
    const frame = await navigateTo(page, 'clickable');
    const badge = frame.locator('button span').first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await badge.getAttribute('class');

    expect(classes).toContain('bg-orange-100');
    expect(classes).toContain('border-orange-200');
    expect(classes).toContain('text-orange-700');
  });

  test('Clickable badge shows chevron icon', async ({ page }) => {
    const frame = await navigateTo(page, 'clickable');
    const badge = frame.locator('button span').first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const chevron = badge.locator('svg');

    await expect(chevron).toBeVisible({ timeout: 10000 });
  });

  test('Clickable badge has interactive cursor style', async ({ page }) => {
    const frame = await navigateTo(page, 'clickable');
    const badge = frame.locator('button span').first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await badge.getAttribute('class');

    expect(classes).toContain('cursor-pointer');
  });

  test('Clickable badge can be clicked without errors', async ({ page }) => {
    const frame = await navigateTo(page, 'clickable');
    const button = frame.locator('button').first();

    await button.waitFor({ state: 'visible', timeout: 20000 });
    await button.click();

    await expect(button).toBeVisible();
  });

  /* -------------------- WithLink Story -------------------- */

  test('WithLink badge renders as an anchor element', async ({ page }) => {
    const frame = await navigateTo(page, 'with-link');
    const link = frame.locator('a').first();

    await expect(link).toBeVisible({ timeout: 20000 });
  });

  test('WithLink badge applies in-progress (blue) styling', async ({ page }) => {
    const frame = await navigateTo(page, 'with-link');
    const badge = frame.locator('a span').first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await badge.getAttribute('class');

    expect(classes).toContain('bg-blue-100');
    expect(classes).toContain('border-blue-200');
    expect(classes).toContain('text-blue-700');
  });

  test('WithLink badge shows chevron icon', async ({ page }) => {
    const frame = await navigateTo(page, 'with-link');
    const badge = frame.locator('a span').first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const chevron = badge.locator('svg');

    await expect(chevron).toBeVisible({ timeout: 10000 });
  });

  /* -------------------- WithChevron Story -------------------- */

  test('WithChevron badge renders the chevron icon', async ({ page }) => {
    const frame = await navigateTo(page, 'with-chevron');
    const badge = frame.locator('span').filter({ hasText: 'Pending' }).first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const chevron = badge.locator('svg');

    await expect(chevron).toBeVisible({ timeout: 10000 });
  });

  test('WithChevron badge applies pending (yellow) styling', async ({ page }) => {
    const frame = await navigateTo(page, 'with-chevron');
    const badge = frame.locator('span').filter({ hasText: 'Pending' }).first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await badge.getAttribute('class');

    expect(classes).toContain('bg-yellow-100');
    expect(classes).toContain('border-yellow-200');
    expect(classes).toContain('text-yellow-700');
  });

  /* -------------------- AllVariants Story -------------------- */

  test('AllVariants story renders all 11 badge variants', async ({ page }) => {
    const frame = await navigateTo(page, 'all-variants');
    const badges = frame.locator('span[class*="rounded-md border"]');

    await expect(badges.first()).toBeVisible({ timeout: 20000 });
    await expect(badges).toHaveCount(11, { timeout: 10000 });
  });

  test('AllVariants story includes confirmed (green) badge', async ({ page }) => {
    const frame = await navigateTo(page, 'all-variants');
    const confirmedBadge = frame.locator('span').filter({ hasText: 'Confirmed' }).first();

    await confirmedBadge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await confirmedBadge.getAttribute('class');

    expect(classes).toContain('bg-green-100');
  });

  test('AllVariants story includes not-started (gray) badge', async ({ page }) => {
    const frame = await navigateTo(page, 'all-variants');
    const notStartedBadge = frame.locator('span').filter({ hasText: 'Not Started' }).first();

    await notStartedBadge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await notStartedBadge.getAttribute('class');

    expect(classes).toContain('bg-gray-100');
    expect(classes).toContain('border-gray-300');
  });

  test('AllVariants story includes canceled (red) badge', async ({ page }) => {
    const frame = await navigateTo(page, 'all-variants');
    const canceledBadge = frame.locator('span').filter({ hasText: 'Canceled' }).first();

    await canceledBadge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await canceledBadge.getAttribute('class');

    expect(classes).toContain('bg-red-100');
    expect(classes).toContain('border-red-200');
  });

  test('AllVariants badges do not show chevron icons', async ({ page }) => {
    const frame = await navigateTo(page, 'all-variants');
    const badges = frame.locator('span[class*="rounded-md border"]');

    await expect(badges.first()).toBeVisible({ timeout: 20000 });
    const count = await badges.count();

    for (let i = 0; i < count; i += 1) {
      const chevron = badges.nth(i).locator('svg');
      await expect(chevron).not.toBeVisible();
    }
  });

  /* -------------------- AllVariantsWithChevron Story -------------------- */

  test('AllVariantsWithChevron story renders all 11 badge variants', async ({ page }) => {
    const frame = await navigateTo(page, 'all-variants-with-chevron');
    const badges = frame.locator('span[class*="rounded-md border"]');

    await expect(badges.first()).toBeVisible({ timeout: 20000 });
    await expect(badges).toHaveCount(11, { timeout: 10000 });
  });

  test('AllVariantsWithChevron badges each show a chevron icon', async ({ page }) => {
    const frame = await navigateTo(page, 'all-variants-with-chevron');
    const badges = frame.locator('span[class*="rounded-md border"]');

    await expect(badges.first()).toBeVisible({ timeout: 20000 });
    const count = await badges.count();

    for (let i = 0; i < count; i += 1) {
      const chevron = badges.nth(i).locator('svg');
      await expect(chevron).toBeVisible({ timeout: 5000 });
    }
  });

  /* -------------------- Negative Tests -------------------- */

  test('Static badge does not have cursor-pointer class', async ({ page }) => {
    const frame = await navigateTo(page, 'default');
    const badge = frame.locator('span').filter({ hasText: 'Confirmed' }).first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await badge.getAttribute('class');

    expect(classes).not.toContain('cursor-pointer');
  });

  test('Confirmed badge does not apply red styling', async ({ page }) => {
    const frame = await navigateTo(page, 'default');
    const badge = frame.locator('span').filter({ hasText: 'Confirmed' }).first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });
    const classes = await badge.getAttribute('class');

    expect(classes).not.toContain('bg-red-100');
    expect(classes).not.toContain('text-red-700');
  });

  test('Default story does not render a button or anchor element', async ({ page }) => {
    const frame = await navigateTo(page, 'default');
    const badge = frame.locator('span').filter({ hasText: 'Confirmed' }).first();

    await badge.waitFor({ state: 'visible', timeout: 20000 });

    const button = frame.locator('button');
    const link = frame.locator('a');

    await expect(button).not.toBeVisible();
    await expect(link).not.toBeVisible();
  });
});
