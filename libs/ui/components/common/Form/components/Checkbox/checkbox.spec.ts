import { expect, test } from '@playwright/test';

test.describe('Checkbox component in Storybook', () => {
  test('check for unchecked checkbox', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-checkbox--checkbox-with-label');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const checkbox = frame.locator('#honda');
    await checkbox.waitFor({ state: 'visible', timeout: 60000 });
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(false);
    await checkbox.check();
    const isCheckedAfter = await checkbox.isChecked();
    expect(isCheckedAfter).toBe(true);
  });

  test('check for checked checkbox', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-checkbox--checkbox-with-label');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const checkbox = frame.locator('#volkswagen');
    await checkbox.waitFor({ state: 'visible', timeout: 60000 });
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(true);
  });

  test('check for disabled checkbox', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-checkbox--checkbox-with-label');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const checkbox = frame.locator('#tesla');
    await checkbox.waitFor({ state: 'visible', timeout: 60000 });
    const isDisabled = await checkbox.isDisabled();
    expect(isDisabled).toBe(true);
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(false);
    const isCheckedAfterAttempt = await checkbox.isChecked();
    expect(isCheckedAfterAttempt).toBe(false);
  });

  test('verify keyboard interaction', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-checkbox--checkbox-with-label');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const checkbox = frame.locator('#honda');
    await checkbox.waitFor({ state: 'visible', timeout: 60000 });

    await checkbox?.focus?.();
    await page.keyboard.press('Enter');
    expect(await checkbox.isChecked()).toBe(true);

    await page.keyboard.press('Enter');
    expect(await checkbox.isChecked()).toBe(false);
  });
});
