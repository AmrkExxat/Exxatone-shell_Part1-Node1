import { test, expect } from '@playwright/test';

test.describe('TextInput component', () => {
  test('render input and handle value changes', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-textinput--input-basic');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const input = frame.locator('#basicInput');
    await input.waitFor({ state: 'visible', timeout: 60000 });
    const initialValue = await input.getAttribute('value');
    expect(initialValue).toBe('');
    await input.fill('Test input');
    const newValue = await input.getAttribute('value');
    expect(newValue).toBe('Test input');
  });

  test('should not allow input to be filled when disabled', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-textinput--input-disabled');
    const inputField = page
      .frameLocator('iframe#storybook-preview-iframe')
      .locator('#disabledInput');
    await inputField.waitFor({ state: 'visible', timeout: 10000 });
    await expect(inputField).toBeDisabled();
  });

  test('should display required indicator when required prop is true', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-textinput--input-basic');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const requiredIndicator = frame.locator('label > span.text-red-600');
    await requiredIndicator.waitFor({ state: 'visible', timeout: 60000 });
    await expect(requiredIndicator).toHaveText('*');
  });

  test('should show error icon and message when input is empty and form is submitted', async ({
    page,
  }) => {
    await page.goto('http://localhost:6006/?path=/story/form-textinput--input-with-error');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const input = frame.locator('#errorInput');
    await input.waitFor({ state: 'visible', timeout: 60000 });
    await expect(input).toBeEnabled();
    await input.fill('');
    const submitButton = frame.locator('button[type="submit"]');
    await submitButton.click();
    const errorIcon = frame.locator('svg[data-icon="circle-exclamation"].fa-circle-exclamation');
    const errorMessage = frame.locator('#errorInput-error');
    await expect(errorIcon).toBeVisible();
    await expect(errorMessage).toBeVisible();
  });
});
