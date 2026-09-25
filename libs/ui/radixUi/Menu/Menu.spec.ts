import { test, expect } from '@playwright/test';

test.describe('Menu Component', () => {
  const STORYBOOK_IFRAME = 'iframe#storybook-preview-iframe';
  const baseURL = 'http://localhost:6006/?path=/story';

  async function waitForIframeAndGetFrame(page: any) {
    await page.waitForSelector(STORYBOOK_IFRAME, {
      state: 'visible',
      timeout: 30000,
    });
    return page.frameLocator(STORYBOOK_IFRAME);
  }

  async function openMenu(page: any, storyPath: string) {
    await page.goto(`${baseURL}/${storyPath}`, { waitUntil: 'domcontentloaded' });
    const frame = await waitForIframeAndGetFrame(page);
    const trigger = frame.locator('[data-testid="menu-trigger"]');
    await expect(trigger).toBeVisible({ timeout: 20000 });
    await trigger.click();
    return frame;
  }

  test.setTimeout(60000);

  test('Opens menu content on trigger click', async ({ page }) => {
    const frame = await openMenu(page, 'radix-ui-menu--default');

    await expect(frame.locator('[data-testid="menu-content"]')).toBeVisible();
    await expect(frame.locator('[data-testid="menu-item-view"]')).toBeVisible();
    await expect(frame.locator('[data-testid="menu-item-replace"]')).toBeVisible();
    await expect(frame.locator('[data-testid="menu-item-delete"]')).toBeVisible();
  });

  test('Opens submenu content on hover', async ({ page }) => {
    const frame = await openMenu(page, 'radix-ui-menu--nested');

    const subTrigger = frame.locator('[data-testid="menu-sub-trigger"]');
    await expect(subTrigger).toBeVisible();
    await subTrigger.hover();

    await expect(frame.locator('[data-testid="menu-sub-content"]')).toBeVisible();
    await expect(frame.locator('[data-testid="menu-item-copy-link"]')).toBeVisible();
  });

  test('Calls onSelect with selected item', async ({ page }) => {
    const frame = await openMenu(page, 'radix-ui-menu--on-select');

    const selection = frame.locator('[data-testid="menu-selection"]');
    await expect(selection).toHaveText('No selection');

    const viewItem = frame.locator('[data-testid="menu-item-view"]');
    await expect(viewItem).toBeVisible();
    await viewItem.click();

    await expect(selection).toHaveText('view');
  });

  test('Tab closes menu and moves focus to next element', async ({ page }) => {
    const frame = await openMenu(page, 'radix-ui-menu--tab-closes-and-moves-focus');

    await expect(frame.locator('[data-testid="menu-content"]')).toBeVisible();
    await page.keyboard.press('Tab');

    await expect(frame.locator('[data-testid="menu-content"]')).toBeHidden();
    await expect(frame.locator('[data-testid="menu-next-focus-target"]')).toBeFocused();
  });
});
