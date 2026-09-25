import { expect, test } from '@playwright/test';

test.describe('DatePicker component in Storybook', () => {
  test('Simple Date picker', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-datepicker--date-picker-simple');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const fullScreen = await page.locator('button[aria-label="Go full screen"]');
    await fullScreen.click();
    //open date selection menu
    const datePicker = frame.locator('input');
    await datePicker.click();

    //check Date picker dialog is open or not.
    const dialogBox = frame.locator('div[role="dialog"]');
    await expect(dialogBox).toBeVisible();

    //Fill date value and check it is applied or not
    await datePicker.fill('21/12/2026');
    await expect(datePicker).toHaveAttribute('value', '21/12/2026');

    //check filled value is selected or not in dialog.
    const selcetedDate = frame.locator('div[aria-selected="true"]');
    await expect(selcetedDate).toHaveText('21');

    // Check filled month and year value in dialog
    const currentMonthYear = frame.locator('h2[class="react-datepicker__current-month"]');
    await expect(currentMonthYear).toHaveText('December 2026');

    // Check previous month button
    const previousMonth = frame.locator('button[aria-label="Previous Month"]');
    await previousMonth.click();

    await expect(currentMonthYear).toHaveText('November 2026');

    // Check next month button
    const nextMonth = frame.locator('button[aria-label="Next Month"]');
    await nextMonth.click();
    await nextMonth.click();

    await expect(currentMonthYear).toHaveText('January 2027');

    //select date from dialog menu
    const date = frame.locator('div[aria-label="Choose Tuesday, January 26th, 2027"]');
    await date.click();
    await expect(datePicker).toHaveAttribute('value', '26/01/2027');

    //after select date Check dialog is closed or not
    await expect(dialogBox).not.toBeVisible();
  });

  test('Date picker with Min/Max value', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-datepicker--date-picker-min-max');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const fullScreen = await page.locator('button[aria-label="Go full screen"]');
    await fullScreen.click();
    //open date selection menu
    const datePicker = frame.locator('input');
    await datePicker.click();

    //check Date picker dialog is open or not.
    const dialogBox = frame.locator('div[role="dialog"]');
    await expect(dialogBox).toBeVisible();

    //Fill date value and check it is applied or not
    await datePicker.fill('May, 23 2024');
    await expect(datePicker).toHaveAttribute('value', 'May, 23 2024');

    //check filled value is selected or not in dialog.
    const selcetedDate = frame.locator('div[aria-selected="true"]');
    await expect(selcetedDate).toHaveText('23');

    // Check filled month and year value in dialog
    const currentMonthYear = frame.locator('h2[class="react-datepicker__current-month"]');
    await expect(currentMonthYear).toHaveText('May 2024');

    //check Disabled date which is less than Min date(May, 14 2024) and greater than Max Date(May, 30 2024)
    const LDate = frame.locator('div.react-datepicker__day--006');
    await expect(LDate).toBeDisabled();

    const GDate = frame.locator('div.react-datepicker__day--031');
    await expect(GDate).toBeDisabled();

    //select date from dialog menu
    const date = frame.locator('div[aria-label="Choose Tuesday, May 28th, 2024"]');
    await date.click();
    await expect(datePicker).toHaveAttribute('value', 'May, 28 2024');

    //after select date Check dialog is closed or not
    await expect(dialogBox).not.toBeVisible();
  });

  test('Date picker with Disabled', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-datepicker--date-picker-disabled');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    const Input = frame.locator('input');
    await Input.waitFor({ state: 'visible', timeout: 60000 });
    await expect(Input).toBeDisabled();
  });

  test('Date picker with Month and Year', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-datepicker--date-picker-month-year');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    //open date selection menu
    const monthPicker = frame.locator('input');
    await monthPicker.click();

    //check year picker dialog is open or not.
    const dialogBox = frame.locator('div[role="dialog"]');
    await expect(dialogBox).toBeVisible();

    //Fill year value and check it is applied or not
    await monthPicker.fill('Jan/2028');
    await expect(monthPicker).toHaveAttribute('value', 'Jan/2028');

    //check filled value is selected or not in dialog.
    const selcetedMonth = frame.locator('div[aria-selected="true"]');
    await expect(selcetedMonth).toHaveText('Jan');

    //check current year
    const yearValue = frame.locator('div.react-datepicker-year-header');
    await expect(yearValue).toHaveText('2028');

    //check previous year button
    const prevYear = frame.locator('button[aria-label="Previous Year"]');
    await prevYear.click();
    await prevYear.click();
    await expect(yearValue).toHaveText('2026');

    //check next year button
    const nextYear = frame.locator('button[aria-label="Next Year"]');
    await nextYear.click();
    await expect(yearValue).toHaveText('2027');

    //select August from dialog menu
    const year = frame.locator('div.react-datepicker__month-11');
    await year.click();
    await expect(monthPicker).toHaveAttribute('value', 'Dec/2027');

    //after select year Check dialog is closed or not
    await expect(dialogBox).not.toBeVisible();
  });

  test('Date picker with only Month', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-datepicker--date-picker-month');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    //open date selection menu
    const monthPicker = frame.locator('input');
    await monthPicker.click();

    //check year picker dialog is open or not.
    const dialogBox = frame.locator('div[role="dialog"]');
    await expect(dialogBox).toBeVisible();

    //Fill year value and check it is applied or not
    await monthPicker.fill('November');
    await expect(monthPicker).toHaveAttribute('value', 'November');

    //check filled value is selected or not in dialog.
    const selcetedMonth = frame.locator('div[aria-selected="true"]');
    await expect(selcetedMonth).toHaveText('Nov');

    //check current year
    const yearValue = frame.locator('div.react-datepicker-year-header');
    await expect(yearValue).toHaveText('2025');

    //check previous year button
    const prevYear = frame.locator('button[aria-label="Previous Year"]');
    await prevYear.click();
    await expect(yearValue).toHaveText('2024');

    //check next year button
    const nextYear = frame.locator('button[aria-label="Next Year"]');
    await nextYear.click();
    await nextYear.click();
    await expect(yearValue).toHaveText('2026');

    //select August from dialog menu
    const year = frame.locator('div.react-datepicker__month-7');
    await year.click();
    await expect(monthPicker).toHaveAttribute('value', 'August');

    //after select year Check dialog is closed or not
    await expect(dialogBox).not.toBeVisible();
  });

  test('Date picker with only Year', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/form-datepicker--date-picker-year');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');

    //open date selection menu
    const yearPicker = frame.locator('input');
    await yearPicker.click();

    //check year picker dialog is open or not.
    const dialogBox = frame.locator('div[role="dialog"]');
    await expect(dialogBox).toBeVisible();

    //Fill year value and check it is applied or not
    await yearPicker.fill('2025');
    await expect(yearPicker).toHaveAttribute('value', '2025');

    //check filled value is selected or not in dialog.
    const selcetedYear = frame.locator('div.react-datepicker__year-text--selected');
    await expect(selcetedYear).toHaveText('2025');

    //check current year range
    const yearRange = frame.locator('div.react-datepicker-year-header');
    await expect(yearRange).toHaveText('2017 - 2028');

    //check previous year button
    const prevYear = frame.locator('button[aria-label="Previous Year"]');
    await prevYear.click();
    await expect(yearRange).toHaveText('2005 - 2016');

    //check next year button
    const nextYear = frame.locator('button[aria-label="Next Year"]');
    await nextYear.click();
    await nextYear.click();
    await expect(yearRange).toHaveText('2029 - 2040');

    //select 2034 from dialog menu
    const year = frame.locator('div.react-datepicker__year-2034');
    await year.click();
    await expect(yearPicker).toHaveAttribute('value', '2034');

    //after select year Check dialog is closed or not
    await expect(dialogBox).not.toBeVisible();
  });
});
