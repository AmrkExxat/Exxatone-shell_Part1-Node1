import { test, expect } from '@playwright/test';

test.describe('Filter component in Storybook', () => {
  test('filter Combobox selection test', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-filter--dynamic-with-options');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    //open option menu
    const combobox = frame.locator('[id="headlessui-combobox-button-\\:r3\\:"]');
    await combobox.click();

    // Select two options from the list
    const options = frame.locator('div[role="option"]');
    await options.nth(0).click(); // Select Option 1
    await options.nth(1).click(); // Select Option 2

    // Wait for the input to have the expected value
    const selectedValue = frame.locator('input[role="combobox"][placeholder="Canada"]');

    // Wait for the input to be updated
    await selectedValue.waitFor({ state: 'visible' }); // Ensure the input is visible
    await page.waitForTimeout(500); // Short wait to allow for any state updates

    // Assert the expected value
    const expectedValue = 'Canada'; // Adjust based on your default values
    await expect(selectedValue).toHaveAttribute('placeholder', expectedValue);
  });

  test('filter multi selection test', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-filter--dynamic-with-options');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    //open option menu
    const multiselect = frame.locator('[id="headlessui-combobox-button-\\:rb\\:"]');
    await multiselect.click();

    //check listbox is visible or not
    const optionList = frame.locator('div[role="listbox"]');
    await expect(optionList).toBeVisible();

    await multiselect.click();
    await expect(optionList).not.toBeVisible();

    await multiselect.click();
    const options = frame.locator('div[role="listbox"] div[role="option"]');

    const selectedValue = frame.locator('input[aria-expanded="true"]');

    // Select the first option
    await options.first().click();
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');
    await expect(selectedValue).toHaveAttribute('placeholder', 'Mumbai');

    // Select the third  option
    await options.nth(2).click();
    await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(selectedValue).toHaveAttribute('placeholder', 'Mumbai, Bangalore');

    await options.nth(4).click();
    await expect(options.nth(4)).toHaveAttribute('aria-selected', 'true');
    await expect(selectedValue).toHaveAttribute('placeholder', 'Mumbai, Bangalore, Chennai');

    await options.nth(7).click();
    await expect(options.nth(7)).toHaveAttribute('aria-selected', 'true');
    await expect(selectedValue).toHaveAttribute(
      'placeholder',
      'Mumbai, Bangalore, Chennai, Jaipur'
    );

    // Deselect the first option by click on option from list
    await options.first().click();
    await expect(options.first()).toHaveAttribute('aria-selected', 'false');
    await expect(selectedValue).toHaveAttribute('placeholder', 'Bangalore, Chennai, Jaipur');

    //Deselect the option by click on cross button
    const removeOption1 = frame.locator('button[aria-label="remove Chennai"]');
    await removeOption1.click();
    await expect(selectedValue).toHaveAttribute('placeholder', 'Bangalore, Jaipur');

    const removeOption2 = frame.locator('button[aria-label="remove Bangalore"]');
    await removeOption2.click();
    await expect(selectedValue).toHaveAttribute('placeholder', 'Jaipur');
  });
});
