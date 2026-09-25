import { test, expect } from '@playwright/test';

test.describe('StatusCard Component', () => {
  const STORYBOOK_IFRAME = 'iframe#storybook-preview-iframe';
  const baseURL = 'http://localhost:6006/?path=/story';

  async function waitForIframeAndGetFrame(page: any) {
    await page.waitForSelector(STORYBOOK_IFRAME, {
      state: 'visible',
      timeout: 30000,
    });
    const frame = page.frameLocator(STORYBOOK_IFRAME);
    await page.waitForTimeout(1000);
    return frame;
  }

  async function getStatusCard(page: any, storyPath: string, testId = 'status-card') {
    await page.goto(`${baseURL}/${storyPath}`, { waitUntil: 'domcontentloaded' });
    const frame = await waitForIframeAndGetFrame(page);
    const card = frame.locator(`[data-testid="${testId}"]`);
    await expect(card).toBeVisible({ timeout: 20000 });
    return { card, frame };
  }

  test.setTimeout(60000);

  /* ------------------ Core Tests ------------------ */

  test('Default status card renders status and content', async ({ page }) => {
    const { frame } = await getStatusCard(page, 'radix-ui-statuscard--default');
    const statusText = frame.locator('[data-testid="status-card-status-content"]');
    const content = frame.locator('[data-testid="status-card-content"]');

    await expect(statusText).toBeVisible();
    await expect(statusText).toContainText('Imported Successfully');
    await expect(content).toContainText('William Johnson');
  });

  test('Card renders stacked underlay', async ({ page }) => {
    const { frame } = await getStatusCard(page, 'radix-ui-statuscard--default');
    const underlay = frame.locator('[data-testid="status-card-underlay"]');

    await expect(underlay).toHaveCount(1);
  });

  test('Warning status row renders custom content', async ({ page }) => {
    const { frame } = await getStatusCard(page, 'radix-ui-statuscard--warning');
    const statusRow = frame.locator('[data-testid="status-card-status"]');

    await expect(statusRow).toContainText('Requires Attention');
  });

  test('Text-only status renders without icons', async ({ page }) => {
    const { frame } = await getStatusCard(page, 'radix-ui-statuscard--without-icon');
    const statusRow = frame.locator('[data-testid="status-card-status"]');

    await expect(statusRow.locator('svg')).toHaveCount(0);
  });

  test('Status background class applies to the lower card', async ({ page }) => {
    const { frame } = await getStatusCard(page, 'radix-ui-statuscard--custom-icon');
    const underlay = frame.locator('[data-testid="status-card-underlay"]');

    const classes = await underlay.getAttribute('class');
    expect(classes).toContain('bg-blue-50');
  });
});
