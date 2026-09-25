import test, { expect } from '@playwright/test';

test.describe('Text area component', () => {
  test('Check for disabled', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-textarea--text-area-disabled');

    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const textarea = frame.locator('textarea');

    const disabled = await textarea.getAttribute('disabled');

    expect(disabled).toBe('');
  });

  test('Check with validation', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-textarea--text-area-with-validation');

    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const textarea = frame.locator('textarea');
    await textarea.fill('This string is < 50 characters.');

    const submitButton = frame.locator('button#textarea-submit-btn');
    await submitButton.click();

    const errorTag = frame.locator('p#email-error');
    const errorTagClasses = await errorTag.getAttribute('class');

    expect(errorTagClasses).toContain('text-red-600');
  });
});
