import { test, expect } from '@playwright/test';

test.describe('RadioGroup component in Storybook', () => {
  test('check for default radio group selection', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-radiogroup--default');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const nikeRadio = frame.locator('input#nike');
    await nikeRadio.waitFor({ state: 'visible', timeout: 60000 });
    await expect(nikeRadio).toBeChecked();

    const adidasRadio = frame.locator('input#adidas');
    await expect(adidasRadio).not.toBeChecked();

    await adidasRadio.click();
    await expect(adidasRadio).toBeChecked();
    await expect(nikeRadio).not.toBeChecked();
  });

  test('check for disabled states in radio group', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-radiogroup--disabled-states');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const disabledGroup = frame.locator('text=Disabled Group');
    await disabledGroup.waitFor({ state: 'visible', timeout: 60000 });
    await expect(disabledGroup).toBeVisible();

    const carRadio = frame.locator('input#car');
    const bikeRadio = frame.locator('input#bike');
    const truckRadio = frame.locator('input#truck');

    await expect(carRadio).toBeDisabled();
    await expect(bikeRadio).toBeDisabled();
    await expect(truckRadio).toBeDisabled();
  });

  test('check for individual disabled options', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-radiogroup--disabled-states');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const enabledOption = frame.locator('input#option1');
    const disabledOption = frame.locator('input#option2');

    await enabledOption.waitFor({ state: 'visible', timeout: 60000 });

    await enabledOption.click();
    await expect(enabledOption).toBeChecked();
    await expect(disabledOption).not.toBeChecked();
  });

  test('check interactive example with error handling', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-radiogroup--interactive-example');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const submitButton = frame.locator('button:has-text("Submit")');
    await submitButton.waitFor({ state: 'visible', timeout: 60000 });

    await submitButton.click();
    const errorText = frame.locator('text=Please select a subscription plan');
    await expect(errorText).toBeVisible();

    const basicRadio = frame.locator('input#basic');
    await basicRadio.click();

    await expect(basicRadio).toBeChecked();
    await submitButton.click();
    await expect(errorText).not.toBeVisible();
  });
});
