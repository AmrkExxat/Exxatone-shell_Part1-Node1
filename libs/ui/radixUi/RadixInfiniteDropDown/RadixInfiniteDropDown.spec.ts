import { test, expect } from '@playwright/test';

test.describe('RadixInfiniteDropDown in Storybook', () => {
  const baseUrl = 'http://localhost:6006';

  test.setTimeout(60000);

  test('Single select should render options and allow selection', async ({ page }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-radixinfinitedropdown--single-select`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const trigger = frame.getByRole('button', { name: 'Single Select' });

    await expect(trigger).toBeVisible();
    await trigger.click();

    // Use an exact accessible name to avoid strict mode violations.
    const firstOption = frame.getByRole('treeitem', {
      name: 'Location 1',
      exact: true,
    });
    await expect(firstOption).toBeVisible({ timeout: 20000 });

    await firstOption.click();

    await expect(trigger).toContainText('Location 1');
  });

  test('Search should filter infinite dropdown options', async ({ page }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-radixinfinitedropdown--single-select`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const trigger = frame.getByRole('button', { name: 'Single Select' });

    await expect(trigger).toBeVisible();
    await trigger.click();

    const searchInput = frame.getByPlaceholder('Search items');
    await expect(searchInput).toBeVisible();

    const searchTerm = 'Location 10';
    await searchInput.fill(searchTerm);

    // Wait for the filtered results to appear.
    const items = frame.getByRole('treeitem');
    await expect(items).toHaveCount(2); // "Location 10" and "Location 100"
    await expect(items.nth(0)).toHaveText('Location 10');
    await expect(items.nth(1)).toHaveText('Location 100');
  });

  test('Infinite scroll single select should load more items on scroll', async ({ page }) => {
    await page.goto(
      `${baseUrl}/?path=/story/radixui-radixinfinitedropdown--infinite-scroll-single-select`
    );

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const trigger = frame.getByRole('button', { name: 'Infinite Scroll (Single Select)' });

    await expect(trigger).toBeVisible();
    await trigger.click();

    const optionsContainer = frame.locator('#options-container');
    await expect(optionsContainer).toBeVisible({ timeout: 20000 });

    // Scroll to near-bottom to trigger the fetch of the next page.
    await optionsContainer.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    const loadingMore = frame.getByText('Loading more...');
    await expect(loadingMore.first()).toBeVisible({ timeout: 20000 });
  });

  test('Custom variant (DetachedBoxWithTooltip) should show label and selection summary', async ({
    page,
  }) => {
    await page.goto(
      `${baseUrl}/?path=/story/radixui-radixinfinitedropdown--detached-box-with-tooltip`
    );

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const trigger = frame.getByRole('button', { name: 'Detached Dropdown' });

    await expect(trigger).toBeVisible();
    await trigger.click();

    // Unambiguous locator: matches only "Location 1"
    const firstOption = frame.getByRole('treeitem', {
      name: 'Location 1',
      exact: true,
    });
    await expect(firstOption).toBeVisible({ timeout: 20000 });
    await firstOption.click();

    const triggerText = await trigger.innerText();
    expect(triggerText).toContain('Detached Dropdown');
    expect(triggerText).toContain('|');
  });
  test('Custom variant trigger should use input-style (rounded-md) trigger styling', async ({
    page,
  }) => {
    await page.goto(
      `${baseUrl}/?path=/story/radixui-radixinfinitedropdown--detached-box-with-tooltip`
    );

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const trigger = frame.getByRole('button', { name: 'Detached Dropdown' });

    await expect(trigger).toBeVisible();

    const triggerClass = await trigger.getAttribute('class');
    expect(triggerClass).toContain('rounded-md');
    expect(triggerClass).not.toContain('rounded-full');
  });
});
