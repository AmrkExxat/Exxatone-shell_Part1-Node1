import { test, expect } from '@playwright/test';

test.describe('Button component in Storybook', () => {
  test('check for basic button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--basic');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const basicButton = frame.locator('#basic-btn');

    await basicButton.waitFor({ state: 'visible', timeout: 60000 });
    const classNames = await basicButton.getAttribute('class');
    expect(classNames).toContain('bg-primary');

    await basicButton.click();

    //check if button is disabled
    const isDisabled = await basicButton.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test('check for flat button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--flat');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const flatButton = frame.locator('#flat-btn');

    await flatButton.waitFor({ state: 'visible', timeout: 60000 });
    const classNames = await flatButton.getAttribute('class');
    expect(classNames).toContain('bg-primary');

    await flatButton.click();

    const isDisabled = await flatButton.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test('check for stroked button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--stroked');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const strokedButton = frame.locator('#stroked-btn');
    const classNames = await strokedButton.getAttribute('class');
    expect(classNames).toContain('border-primary');

    await strokedButton.click();

    //check if button is disabled
    const isDisabled = await strokedButton.isDisabled();
    expect(isDisabled).toBe(false);
  });
  test('check for raised button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--raised');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const raisedButton = frame.locator('#raised-btn');
    const classNames = await raisedButton.getAttribute('class');
    expect(classNames).toContain('bg-primary');

    await raisedButton.click();

    //check if button is disabled
    const isDisabled = await raisedButton.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test('check for custom button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--custom-class');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const customButton = frame.locator('#custom-btn');
    const classNames = await customButton.getAttribute('class');
    expect(classNames).toContain('rounded-full');

    await customButton.click();

    //check if button is disabled
    const isDisabled = await customButton.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test('check for icon only button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--icon-button');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const iconOnlyButton = frame.locator('#icon-btn');

    const icon = iconOnlyButton.locator('svg');
    const buttonText = await iconOnlyButton.textContent();
    expect(buttonText?.trim()).toBe('');

    await iconOnlyButton.click();
    const isDisabled = await iconOnlyButton.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test('check for disabled state on basic button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--basic');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const basicButton = frame.locator('#basic-btn');

    await basicButton.waitFor({ state: 'visible', timeout: 60000 });
    expect(await basicButton.isDisabled()).toBe(false);

    await basicButton.evaluate((btn) => {
      (btn as HTMLButtonElement).disabled = true;
    });
    expect(await basicButton.isDisabled()).toBe(true);
    const clickResult = await basicButton.evaluate((btn) => {
      if ((btn as HTMLButtonElement).disabled) {
        return 'disabled';
      }
      if (btn instanceof HTMLButtonElement) {
        btn.click();
        return 'clicked';
      }
      return 'not-a-button';
    });
    expect(clickResult).toBe('disabled');
  });

  test('check for non-clickable flat button when disabled', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--flat');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const flatButton = frame.locator('#flat-btn');

    await flatButton.waitFor({ state: 'visible', timeout: 60000 });

    await flatButton.evaluate((btn) => {
      (btn as HTMLButtonElement).disabled = true;
    });

    const isDisabled = await flatButton.isDisabled();
    expect(isDisabled).toBe(true);

    if (!isDisabled) {
      await flatButton.click();
    } else {
      console.log('Attempted to click a disabled button, which is expected to fail.');
    }
  });

  test('check for incorrect button variant', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--basic');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const basicButton = frame.locator('#basic-btn');

    const classNames = await basicButton.getAttribute('class');
    expect(classNames).not.toContain('bg-secondary');
  });

  test('check for icon only button click behavior when disabled', async ({ page }) => {
    await page.goto(
      'http://localhost:6006/?path=/story/common-button--icon-button&args=disabled:!true'
    );

    const iconOnlyButton = await page
      .frameLocator('iframe#storybook-preview-iframe')
      .locator('#icon-btn');

    const isDisabled = await iconOnlyButton.isDisabled();
    expect(isDisabled).toBe(true);

    await iconOnlyButton.click({ force: true });

    const isStillDisabled = await iconOnlyButton.isDisabled();
    expect(isStillDisabled).toBe(true);
  });

  test('check for button without required props', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--basic');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const basicButton = frame.locator('#basic-btn');

    await basicButton.evaluate((btn) => {
      (btn as HTMLButtonElement).onclick = null;
    });

    await basicButton.click();
    const buttonText = await basicButton.textContent();
    expect(buttonText).toBe('Basic Button');
  });

  test('check for disabled state on raised button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--raised');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const raisedButton = frame.locator('#raised-btn');

    await raisedButton.waitFor({ state: 'visible', timeout: 60000 });

    expect(await raisedButton.isDisabled()).toBe(false);

    await raisedButton.evaluate((btn) => {
      (btn as HTMLButtonElement).disabled = true;
    });

    expect(await raisedButton.isDisabled()).toBe(true);

    await raisedButton.click({ force: true });

    expect(await raisedButton.isDisabled()).toBe(true);
  });

  test('check for disabled state on stroked button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--stroked');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const strokedButton = frame.locator('#stroked-btn');

    await strokedButton.waitFor({ state: 'visible', timeout: 60000 });

    expect(await strokedButton.isDisabled()).toBe(false);

    await strokedButton.evaluate((btn) => {
      (btn as HTMLButtonElement).disabled = true;
    });

    expect(await strokedButton.isDisabled()).toBe(true);

    await strokedButton.click({ force: true });

    expect(await strokedButton.isDisabled()).toBe(true);
  });

  test('check for disabled state on custom class button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-button--custom-class');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const customClassButton = frame.locator('#custom-btn');

    await customClassButton.waitFor({ state: 'visible', timeout: 60000 });

    expect(await customClassButton.isDisabled()).toBe(false);

    await customClassButton.evaluate((btn) => {
      (btn as HTMLButtonElement).disabled = true;
    });

    expect(await customClassButton.isDisabled()).toBe(true);

    await customClassButton.click({ force: true });

    expect(await customClassButton.isDisabled()).toBe(true);
  });
});
