import { test, expect } from '@playwright/test';

test.describe('BoxCard Component', () => {
  const STORYBOOK_IFRAME = 'iframe#storybook-preview-iframe';
  const baseURL = 'http://localhost:6006/?path=/story';

  async function getBoxCard(page: any, storyPath: string) {
    await page.goto(`${baseURL}/${storyPath}`, { waitUntil: 'domcontentloaded' });
    const frame = page.frameLocator(STORYBOOK_IFRAME);
    const card = frame.locator('div').filter({ hasText: 'card' }).first();

    await expect(card).toBeVisible({ timeout: 20000 });
    return { card, frame };
  }

  test.setTimeout(60000);

  test('Default card renders with base styles', async ({ page }) => {
    const { card } = await getBoxCard(page, 'radix-ui-boxcard--default');

    const classes = await card.getAttribute('class');
    expect(classes).toContain('rounded-lg');
    expect(classes).toContain('border');
    expect(classes).toContain('transition-all');
  });

  test('Active card applies active styles', async ({ page }) => {
    const { card } = await getBoxCard(page, 'radix-ui-boxcard--active');

    const classes = await card.getAttribute('class');
    expect(classes).toContain('border-[1.5px]');
    expect(classes).toContain('bg-[#FFF2F8]');
    expect(classes).toContain('shadow-lg');
  });

  test('Clickable card has cursor-pointer when onClick is provided', async ({ page }) => {
    const { card } = await getBoxCard(page, 'radix-ui-boxcard--clickable');

    const classes = await card.getAttribute('class');
    expect(classes).toContain('cursor-pointer');
  });

  test('Disabled card is dimmed and not clickable', async ({ page }) => {
    const { card } = await getBoxCard(page, 'radix-ui-boxcard--disabled');

    const classes = await card.getAttribute('class');
    expect(classes).toContain('opacity-60');
    expect(classes).toContain('pointer-events-none');

    const ariaDisabled = await card.getAttribute('aria-disabled');
    expect(ariaDisabled).toBe('true');
  });
});
