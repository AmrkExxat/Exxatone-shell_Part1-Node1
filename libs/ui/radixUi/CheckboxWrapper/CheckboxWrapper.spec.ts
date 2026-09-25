import { test, expect } from '@playwright/test';

test.describe('CheckboxCard Component', () => {
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

  async function getCheckboxCard(page: any, storyPath: string, testId = 'checkbox-card') {
    await page.goto(`${baseURL}/${storyPath}`, { waitUntil: 'domcontentloaded' });
    const frame = await waitForIframeAndGetFrame(page);
    const card = frame.locator(`[data-testid="${testId}"]`);
    await expect(card).toBeVisible({ timeout: 20000 });
    return { card, frame };
  }

  test.setTimeout(60000);

  test('Default badge renders unchecked content', async ({ page }) => {
    const { frame } = await getCheckboxCard(page, 'radix-ui-checkboxwrapper--default');
    const uncheckedBadge = frame.locator('[data-testid="checkbox-badge-unchecked"]');

    await expect(uncheckedBadge).toBeVisible();
    await expect(uncheckedBadge).toContainText('1');
  });

  test('Badge switches to checked content on click', async ({ page }) => {
    const { frame, card } = await getCheckboxCard(page, 'radix-ui-checkboxwrapper--default');
    const trigger = card.locator('label');

    await expect(trigger).toBeVisible();
    await trigger.click();

    const checkedBadge = frame.locator('[data-testid="checkbox-badge-checked"]');
    await expect(checkedBadge).toBeVisible();
    await expect(frame.locator('[data-testid="checkbox-badge-unchecked"]')).toHaveCount(0);
  });
});
