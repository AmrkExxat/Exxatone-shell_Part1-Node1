import { test, expect } from '@playwright/test';

test.describe('RadioCard Component', () => {
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

  async function getRadioCardGroup(page: any, storyPath: string, testId = 'radio-card-group') {
    await page.goto(`${baseURL}/${storyPath}`, { waitUntil: 'domcontentloaded' });
    const frame = await waitForIframeAndGetFrame(page);
    const group = frame.locator(`[data-testid="${testId}"]`);
    await expect(group).toBeVisible({ timeout: 20000 });
    return { group, frame };
  }

  test.setTimeout(60000);

  test('Default badge renders unchecked content', async ({ page }) => {
    const { frame } = await getRadioCardGroup(page, 'radix-ui-radiobuttonwrapper--default');
    const uncheckedBadge = frame.locator('[data-testid="radio-badge-unchecked"]').first();

    await expect(uncheckedBadge).toBeVisible();
    await expect(uncheckedBadge).toContainText('1');
  });

  test('Badge switches to checked content on click', async ({ page }) => {
    const { frame, group } = await getRadioCardGroup(page, 'radix-ui-radiobuttonwrapper--default');
    const firstCard = group.locator('[data-testid="radio-card"]').first();
    const trigger = firstCard.locator('label');

    await expect(trigger).toBeVisible();
    await trigger.click();

    const checkedBadge = frame.locator('[data-testid="radio-badge-checked"]').first();
    await expect(checkedBadge).toBeVisible();
  });

  test('Only one card can be selected at a time', async ({ page }) => {
    const { frame, group } = await getRadioCardGroup(
      page,
      'radix-ui-radiobuttonwrapper--document-cards'
    );
    const cards = group.locator('[data-testid="radio-card"]');

    // Click first card
    await cards.first().locator('label').click();
    await page.waitForTimeout(500);

    // Verify first card is selected
    const firstCard = cards.first();
    await expect(firstCard).toHaveClass(/border-blue-500/);

    // Click second card
    await cards.nth(1).locator('label').click();
    await page.waitForTimeout(500);

    // Verify second card is selected and first is not
    await expect(cards.nth(1)).toHaveClass(/border-blue-500/);
    await expect(firstCard).not.toHaveClass(/border-blue-500/);
  });

  test('Interactive elements with data-no-radio do not trigger selection', async ({ page }) => {
    const { group } = await getRadioCardGroup(
      page,
      'radix-ui-radiobuttonwrapper--interactive-elements'
    );
    const card = group.locator('[data-testid="radio-card"]').first();
    const menuButton = card.locator('button[data-no-radio]');

    // Get initial state
    const initialClasses = await card.getAttribute('class');

    // Click the menu button
    await menuButton.click();
    await page.waitForTimeout(500);

    // Verify card selection state hasn't changed
    const finalClasses = await card.getAttribute('class');
    expect(finalClasses).toBe(initialClasses);
  });
});
