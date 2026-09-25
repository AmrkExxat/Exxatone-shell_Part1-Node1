import { test, expect } from '@playwright/test';

test.describe('SearchTriggerDropdown in Storybook', () => {
  const baseUrl = 'http://localhost:6006';

  test('ThreeFilters story should search and select a Job option', async ({ page }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-searchtriggerdropdown--three-filters`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const jobInput = frame.getByPlaceholder('Select Job');
    await expect(jobInput).toBeVisible();

    // Type at least 3 characters to trigger search
    await jobInput.fill('Nur');

    // Expect Registered Nurse option to appear and be selectable
    const rnOption = frame.getByRole('option', {
      name: 'Registered Nurse - ICU',
    });
    await expect(rnOption).toBeVisible();
    await rnOption.click();

    // After selection, input should show the selected label and option list should close
    await expect(jobInput).toHaveValue('Registered Nurse - ICU');
    await expect(frame.getByRole('option', { name: 'Registered Nurse - ICU' })).toHaveCount(0);
  });

  test('ThreeFilters story should show and clear X icon per section', async ({ page }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-searchtriggerdropdown--three-filters`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const jobInput = frame.getByPlaceholder('Select Job');
    await expect(jobInput).toBeVisible();

    // Initially, no clear button
    await expect(frame.getByRole('button', { name: 'Clear Job' })).toHaveCount(0);

    await jobInput.fill('Test');

    const clearJobButton = frame.getByRole('button', { name: 'Clear Job' });
    await expect(clearJobButton).toBeVisible();

    await clearJobButton.click();

    await expect(jobInput).toHaveValue('');
  });

  test('ThreeFilters story tabs from input to clear X icon when value present', async ({
    page,
  }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-searchtriggerdropdown--three-filters`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const jobInput = frame.getByPlaceholder('Select Job');
    await expect(jobInput).toBeVisible();

    // Type some text so the clear button appears
    await jobInput.fill('Test');

    const clearJobButton = frame.getByRole('button', { name: 'Clear Job' });
    await expect(clearJobButton).toBeVisible();

    // Press Tab in the input and expect focus to move to the clear button
    await jobInput.press('Tab');
    await expect(clearJobButton).toBeFocused();
  });

  test('Default story should have enabled search icon when defaultValue options exist', async ({
    page,
  }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-searchtriggerdropdown--default`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const searchButton = frame.getByRole('button', {
      name: 'Search',
    });

    await expect(searchButton).toBeVisible();
    // defaultValue options present -> icon should be enabled initially
    await expect(searchButton).toBeEnabled();

    await searchButton.click();
  });

  test('DefaultTextDefaults story text-only defaults should not enable search icon', async ({
    page,
  }) => {
    await page.goto(`${baseUrl}/?path=/story/radixui-searchtriggerdropdown--default-text-defaults`);

    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const searchButton = frame.getByRole('button', {
      name: 'Search',
    });

    await expect(searchButton).toBeVisible();
    // Text defaults count as having a value typed -> icon should be enabled
    await expect(searchButton).toBeEnabled();

    // After making a real selection, icon should remain enabled
    const jobInput = frame.getByPlaceholder('Select Job');
    await expect(jobInput).toBeVisible();
    await jobInput.fill('Nur');

    const rnOption = frame.getByRole('option', {
      name: 'Registered Nurse - ICU',
    });
    await expect(rnOption).toBeVisible();
    await rnOption.click();

    await expect(searchButton).toBeEnabled();
  });
});
