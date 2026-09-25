import { test, expect } from '@playwright/test';

test.describe('Select component in Storybook', () => {
  test('Disabled Select should not allow any interaction', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-select--disabled-select');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const selectInput = frame.locator('input#discipline-select');
    await expect(selectInput).toBeVisible({ timeout: 60000 });
    await expect(selectInput).toBeDisabled();
    await selectInput.click({ force: true });
    await expect(selectInput).toHaveValue('option5');
  });

  test('With Reset should update placeholder text correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-select--with-reset');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const selectInput = frame.locator('input#reset-select');
    const resetButton = frame.locator('button#reset-btn');

    await expect(selectInput).toHaveAttribute(
      'placeholder',
      'Bio Chemistry, Mechanical Engineering, Environmental Science'
    );
    await resetButton.click();
    await expect(selectInput).toHaveAttribute('placeholder', 'Please select an option');
  });

  test('Interaction after reset should work correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-select--with-reset');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const resetButton = frame.locator('button#reset-btn');
    const multiSelectInput = frame.locator('input#reset-select');
    await resetButton.click();
    await multiSelectInput.fill('Bio Chemistry');
    await multiSelectInput.press('Enter');
    await multiSelectInput.fill('');
    await expect(multiSelectInput).toHaveAttribute(
      'placeholder',
      'Bio Chemistry, Mechanical Engineering, Environmental Science'
    );
  });

  test('Single Select should allow one option selection', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-select--single-select');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const singleSelectInput = frame.locator('input#discipline-single-select');

    await expect(singleSelectInput).toBeVisible();
    await expect(singleSelectInput).toHaveValue('option5'); // default Value Math.

    await singleSelectInput.fill('Bio Chemistry');
    await singleSelectInput.press('Enter');
    await expect(singleSelectInput).toHaveAttribute('placeholder', 'Bio Chemistry');

    await singleSelectInput.fill('Mathematics');
    await singleSelectInput.press('Enter');
    await expect(singleSelectInput).toHaveAttribute('placeholder', 'Mathematics');

    await singleSelectInput.fill('non-existant option');
    await singleSelectInput.press('Enter');
    await expect(singleSelectInput).toHaveAttribute('placeholder', 'Mathematics');
  });

  test('Multi Select should allow multiple option selections', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-select--multi-select');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const multiSelectInput = frame.locator('input#discipline-multi-select');
    await expect(multiSelectInput).toBeVisible();
    await expect(multiSelectInput).toHaveAttribute(
      'placeholder',
      'Bio Chemistry, Mechanical Engineering, Environmental Science'
    );

    //de select values
    await multiSelectInput.fill('Bio Chemistry');
    await multiSelectInput.press('Enter');
    await expect(multiSelectInput).toHaveAttribute(
      'placeholder',
      'Mechanical Engineering, Environmental Science'
    );

    await multiSelectInput.fill('Mechanical Engineering');
    await multiSelectInput.press('Enter');
    await expect(multiSelectInput).toHaveAttribute('placeholder', 'Environmental Science');

    await multiSelectInput.fill('Environmental Science');
    await multiSelectInput.press('Enter');
    await multiSelectInput.fill('');

    await expect(multiSelectInput).toHaveAttribute('placeholder', 'Please select an option');

    await multiSelectInput.fill('Speech Pathology');
    await multiSelectInput.press('Enter');
    await multiSelectInput.fill('');
    await expect(multiSelectInput).toHaveAttribute('placeholder', 'Speech Pathology');

    await multiSelectInput.fill('Physics');
    await multiSelectInput.press('Enter');
    await multiSelectInput.fill('');
    await expect(multiSelectInput).toHaveAttribute('placeholder', 'Speech Pathology, Physics');

    await multiSelectInput.fill('non-existant option');
    await multiSelectInput.press('Enter');
    await expect(multiSelectInput).toHaveAttribute('placeholder', 'Speech Pathology, Physics');
  });
});
