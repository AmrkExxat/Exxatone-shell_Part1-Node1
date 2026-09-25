import { test, expect } from '@playwright/test';

test.describe('RadixDropDown in Storybook', () => {
  const baseUrl = 'http://localhost:6006';

  test('Pill single select should allow selecting an option', async ({ page }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-radixdropdown--pill-single-select`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    // Trigger has aria-label equal to the story label ("Fruit")
    const trigger = frame.getByRole('button', { name: 'Fruit' });

    await expect(trigger).toBeVisible();

    await trigger.click();

    const bananaOption = frame.getByText('Banana', { exact: true });
    await expect(bananaOption).toBeVisible();
    await bananaOption.click();

    await expect(trigger).toContainText('Banana');
  });

  test('Pill multi select should allow selecting multiple options and show count badge', async ({
    page,
  }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-radixdropdown--pill-multi-select`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    // Use accessible name "Fruits" for the trigger
    const trigger = frame.getByRole('button', { name: 'Fruits' });

    await expect(trigger).toBeVisible();
    await trigger.click();

    const optionsMenu = frame.getByRole('menu');
    const appleOption = optionsMenu.getByRole('menuitemcheckbox', { name: /^Apple$/ });
    const bananaOption = optionsMenu.getByRole('menuitemcheckbox', { name: 'Banana' });

    await expect(appleOption).toBeVisible();
    await expect(bananaOption).toBeVisible();

    // Apple is already selected; select Banana as well.
    await bananaOption.click();

    // Header badge shows "2 selected"
    const countBadge = optionsMenu.getByRole('button', { name: '2 selected' });
    await expect(countBadge).toBeVisible();
  });

  test('Custom employer multi select (variant="custom") should allow multi selection and show count badge', async ({
    page,
  }) => {
    await page.goto(
      `${baseUrl}/?path=/story/radixui-radixdropdown--custom-employer-multi-select-with-icons`
    );

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const trigger = frame.getByRole('button', { name: 'Employer' });

    await expect(trigger).toBeVisible();
    await trigger.click();

    const menu = frame.getByRole('menu');
    const magellan = menu.getByRole('menuitemcheckbox', { name: /Magellan Health/ });
    const medstar = menu.getByRole('menuitemcheckbox', { name: /MedStar Health/ });

    await expect(magellan).toBeVisible();
    await expect(medstar).toBeVisible();

    await magellan.click();
    await medstar.click();

    // Assert the "2 selected" badge in the menu header (semantic, not title-based)
    const countBadge = menu.getByRole('button', { name: '2 selected' });
    await expect(countBadge).toBeVisible();
  });
  test('Custom employer multi select should use custom (input-style) trigger styling', async ({
    page,
  }) => {
    await page.goto(
      `${baseUrl}/?path=/story/radixui-radixdropdown--custom-employer-multi-select-with-icons`
    );

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const trigger = frame.getByRole('button', { name: 'Employer' });

    await expect(trigger).toBeVisible();

    // Custom variant uses a rounded-md border input-style trigger instead of a pill.
    const triggerClass = await trigger.getAttribute('class');
    expect(triggerClass).toContain('rounded-md');
    expect(triggerClass).not.toContain('rounded-full');
  });
  test('Pill single select search should filter options', async ({ page }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-radixdropdown--pill-single-select`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const trigger = frame.getByRole('button', { name: 'Fruit' });

    await expect(trigger).toBeVisible();
    await trigger.click();

    const searchInput = frame.locator('#pill-single-search-input');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Nectarine');

    const nectarineOption = frame.getByText('Nectarine', { exact: true });
    await expect(nectarineOption).toBeVisible();

    // Apple should no longer be visible after filtering.
    const appleOption = frame.getByText('Apple', { exact: true });
    await expect(appleOption).toHaveCount(0);
  });
});
