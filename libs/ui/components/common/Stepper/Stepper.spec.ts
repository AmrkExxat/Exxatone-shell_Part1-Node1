import { expect, test } from '@playwright/test';

async function waitForIframeAndGetFrame(page) {
  await page.waitForSelector('iframe#storybook-preview-iframe', {
    state: 'visible',
    timeout: 30000,
  });
  return page.frameLocator('iframe#storybook-preview-iframe');
}

test.setTimeout(60000);

test.describe('Stepper component', () => {
  const baseURL = 'http://localhost:6006/?path=/story';

  test('initial step is "Basic Info"', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const stepperText = frame.locator('.text-center');
    await expect(stepperText).toHaveText('current Tab is Basic Info', { timeout: 20000 });
  });

  test('navigates to next steps', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const nextButton = frame.locator('button:has-text("Next")');

    await nextButton.click({ timeout: 20000 });
    let stepperText = frame.locator('.text-center');
    await expect(stepperText).toHaveText('current Tab is Location', { timeout: 20000 });

    await nextButton.click({ timeout: 20000 });
    await expect(stepperText).toHaveText('current Tab is Description', { timeout: 20000 });

    await nextButton.click({ timeout: 20000 });
    await expect(stepperText).toHaveText('current Tab is Publish', { timeout: 20000 });
  });
  test('initial state after refresh', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    await page.reload();
    await page.waitForTimeout(2000);

    const stepperText = frame.locator('.text-center');
    await expect(stepperText).toHaveText('current Tab is Basic Info', { timeout: 20000 });
  });

  test('saves at the end', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const nextButton = frame.locator('button:has-text("Next")');

    for (let i = 0; i < 3; i++) {
      await nextButton.click({ timeout: 20000 });
    }

    const saveButton = frame.locator('button:has-text("Save")');
    await saveButton.click({ timeout: 20000 });
    const stepperText = frame.locator('.text-center');
    await expect(stepperText).toHaveText('All tab contents are saved', { timeout: 20000 });
  });

  test('navigate back to previous steps', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const nextButton = frame.locator('button:has-text("Next")');
    const backButton = frame.locator('button:has-text("Previous")');

    for (let i = 0; i < 3; i++) {
      await nextButton.click({ timeout: 20000 });
    }

    await backButton.click({ timeout: 20000 });
    let stepperText = frame.locator('.text-center');
    await expect(stepperText).toHaveText('current Tab is Description', { timeout: 20000 });

    await backButton.click({ timeout: 20000 });
    await expect(stepperText).toHaveText('current Tab is Location', { timeout: 20000 });

    await backButton.click({ timeout: 20000 });
    await expect(stepperText).toHaveText('current Tab is Basic Info', { timeout: 20000 });
  });

  test('invalid step navigation', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const nextButton = frame.locator('button:has-text("Next")');
    const saveButton = frame.locator('button:has-text("Save")');

    await nextButton.click({ timeout: 20000 });
    await nextButton.click({ timeout: 20000 });
    await nextButton.click({ timeout: 20000 });

    const stepperText = frame.locator('.text-center');
    await expect(stepperText).toHaveText('current Tab is Publish', { timeout: 20000 });

    await saveButton.click({ timeout: 20000 });
    await expect(stepperText).toHaveText('All tab contents are saved', { timeout: 20000 });
  });

  test('next button changes to save button on the last step', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const nextButton = frame.locator('button:has-text("Next")');
    for (let i = 0; i < 3; i++) {
      await nextButton.click({ timeout: 20000 });
    }
    const saveButton = frame.locator('button:has-text("Save")');
    await expect(saveButton).toBeVisible({ timeout: 20000 });
    await expect(saveButton).toBeEnabled({ timeout: 20000 });
  });

  test('resets to initial state after saving', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const nextButton = frame.locator('button:has-text("Next")');

    for (let i = 0; i < 3; i++) {
      await nextButton.click({ timeout: 20000 });
    }

    const saveButton = frame.locator('button:has-text("Save")');
    await saveButton.click({ timeout: 20000 });

    await expect(frame.locator('.text-center')).toHaveText('All tab contents are saved', {
      timeout: 20000,
    });

    await page.reload();
    await expect(frame.locator('.text-center')).toHaveText('current Tab is Basic Info', {
      timeout: 20000,
    });
  });

  test('step change callback is called', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const nextButton = frame.locator('button:has-text("Next")');

    await nextButton.click({ timeout: 20000 });

    const stepperText = frame.locator('.text-center');
    await expect(stepperText).toHaveText('current Tab is Location', { timeout: 20000 });
  });

  test('steps complete callback is called', async ({ page }) => {
    await page.goto(`${baseURL}/common-stepper--stepper-story`);
    const frame = await waitForIframeAndGetFrame(page);

    const nextButton = frame.locator('button:has-text("Next")');

    for (let i = 0; i < 3; i++) {
      await nextButton.click({ timeout: 20000 });
    }
    const saveButton = frame.locator('button:has-text("Save")');
    await saveButton.click({ timeout: 20000 });

    const stepperText = frame.locator('.text-center');
    await expect(stepperText).toHaveText('All tab contents are saved', { timeout: 20000 });
  });
});
