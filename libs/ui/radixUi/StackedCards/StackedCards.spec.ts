import { test, expect } from '@playwright/test';

test.describe('StackedCards Component', () => {
  const STORYBOOK_IFRAME = 'iframe#storybook-preview-iframe';
  const baseURL = 'http://localhost:6006/?path=/story';

  async function waitForIframeAndGetFrame(page: any) {
    await page.waitForSelector(STORYBOOK_IFRAME, {
      state: 'visible',
      timeout: 30000,
    });
    return page.frameLocator(STORYBOOK_IFRAME);
  }

  async function getStackedCards(page: any, storyPath: string, testId = 'stacked-cards-root') {
    await page.goto(`${baseURL}/${storyPath}`);
    const frame = await waitForIframeAndGetFrame(page);
    const root = frame.locator(`[data-testid="${testId}"]`);
    await expect(root).toBeVisible({ timeout: 10000 });
    return { frame, root };
  }

  test.setTimeout(60000);

  test('Default story renders the first card as active', async ({ page }) => {
    const { frame } = await getStackedCards(page, 'radix-ui-stackedcards--default');

    const firstCard = frame.locator('[data-testid="stacked-card-0"]');
    const secondCard = frame.locator('[data-testid="stacked-card-1"]');

    await expect(firstCard).toBeVisible();
    await expect(firstCard).toHaveAttribute('data-state', 'active');
    await expect(firstCard.getByText('Orthopedic Physical Therapy')).toBeVisible();
    await expect(secondCard).toHaveAttribute('data-state', 'inactive');
  });

  test('External buttons update the active card', async ({ page }) => {
    const { frame } = await getStackedCards(page, 'radix-ui-stackedcards--default');

    const nextButton = frame.locator('[data-testid="stacked-cards-next"]');
    const prevButton = frame.locator('[data-testid="stacked-cards-prev"]');

    await nextButton.click();
    const secondCard = frame.locator('[data-testid="stacked-card-1"]');
    await expect(secondCard).toHaveAttribute('data-state', 'active');
    await expect(secondCard.getByText('Sports Rehabilitation')).toBeVisible();

    await prevButton.click();
    const firstCard = frame.locator('[data-testid="stacked-card-0"]');
    await expect(firstCard).toHaveAttribute('data-state', 'active');
  });

  test('Children story renders the active child card', async ({ page }) => {
    const { frame } = await getStackedCards(
      page,
      'radix-ui-stackedcards--children',
      'stacked-cards-children'
    );

    const activeCard = frame.locator('[data-state="active"]');
    await expect(activeCard.getByText('Acute Care')).toBeVisible();
  });
});
