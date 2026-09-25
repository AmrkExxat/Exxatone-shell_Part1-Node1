import { test, expect } from '@playwright/test';

// Function to wait for the iframe and get the frame locator
async function waitForIframeAndGetFrame(page) {
  await page.waitForSelector('iframe#storybook-preview-iframe', {
    state: 'visible',
    timeout: 30000,
  });
  return page.frameLocator('iframe#storybook-preview-iframe');
}

// Extend Playwright's default timeout
test.setTimeout(60000);

test.describe('Toggle Group Button Component', () => {
  const baseURL = 'http://localhost:6006/?path=/story';

  test('Default Toggle Group Button', async ({ page }) => {
    let consoleMessages: string[] = [];

    // Capture console log messages
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto(`${baseURL}/common-togglegroupbutton--toggle-group-button`);
    const frame = await waitForIframeAndGetFrame(page);
    const toggleGroupContainer = frame.locator('#toggle_button');
    await toggleGroupContainer.waitFor({ state: 'visible', timeout: 60000 });

    const option1 = await toggleGroupContainer.locator('#option_1').locator('div');
    const option2 = await toggleGroupContainer.locator('#option_2').locator('div');
    const option3 = await toggleGroupContainer.locator('#option_3').locator('div');

    // Check if the initial selected option is correct (Option 2)
    await expect(option2).toHaveAttribute('aria-current', 'page');
    await expect(option1).not.toHaveAttribute('aria-current');
    await expect(option3).not.toHaveAttribute('aria-current');

    //Selecting another option (Option 1) and checking the change
    await option1.click();
    await expect(option1).toHaveAttribute('aria-current', 'page');
    await expect(option2).not.toHaveAttribute('aria-current');
    expect(consoleMessages).toContain('Selected option: option1'); //check the console log text when we click on any button.
    consoleMessages = []; //clear console.log data

    await option3.click();
    await expect(option3).toHaveAttribute('aria-current', 'page');
    await expect(option1).not.toHaveAttribute('aria-current');
    expect(consoleMessages).toContain('Selected option: option3');
    consoleMessages = [];

    // Ensure that selected background are applied correctly

    const selectedOptionBg = await toggleGroupContainer
      .locator('#option_3')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(selectedOptionBg).toBe('rgb(0, 0, 255)');
  });

  test('Disable All Toggle Group Button', async ({ page }) => {
    test.setTimeout(120000);
    let consoleMessages: string[] = [];

    // Capture console log messages
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });

    // Load the page with the disabled toggle group button
    await page.goto(`${baseURL}/common-togglegroupbutton--disabled-all-button`);
    const frame = await waitForIframeAndGetFrame(page);
    const toggleGroupContainer = frame.locator('#toggle_button');
    await toggleGroupContainer.waitFor({ state: 'visible', timeout: 60000 });

    const option1 = await toggleGroupContainer.locator('#option_1').locator('div');
    const option2 = await toggleGroupContainer.locator('#option_2').locator('div');
    const option3 = await toggleGroupContainer.locator('#option_3').locator('div');

    // Verify initial state in disabled mode
    await expect(option2).toHaveAttribute('aria-current', 'page');
    await expect(option1).not.toHaveAttribute('aria-current');
    await expect(option3).not.toHaveAttribute('aria-current');

    // Ensure the buttons are disabled
    await expect(option1).toBeDisabled();
    await expect(option2).toBeDisabled();
    await expect(option3).toBeDisabled();
  });

  test('Disable Only First Button', async ({ page }) => {
    test.setTimeout(120000);
    //first Option is disabled in this case and other buttons are working fine.

    let consoleMessages: string[] = [];

    // Capture console log messages
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });

    // Load the page with the disabled toggle group button
    await page.goto(`${baseURL}/common-togglegroupbutton--disabled-any-button`);
    const frame = await waitForIframeAndGetFrame(page);
    const toggleGroupContainer = frame.locator('#toggle_button');
    await toggleGroupContainer.waitFor({ state: 'visible', timeout: 60000 });

    const option1 = await toggleGroupContainer.locator('#option_1').locator('div');
    const option2 = await toggleGroupContainer.locator('#option_2').locator('div');
    const option3 = await toggleGroupContainer.locator('#option_3').locator('div');

    // Verify initial state (option 2 is selected)
    await expect(option2).toHaveAttribute('aria-current', 'page');
    await expect(option1).not.toHaveAttribute('aria-current');
    await expect(option3).not.toHaveAttribute('aria-current');

    // Ensure that first button is disabled
    await expect(option1).toBeDisabled();

    //other buttons are not disabled
    await expect(option2).not.toBeDisabled();
    await expect(option3).not.toBeDisabled();

    await option3.click();
    await expect(option3).toHaveAttribute('aria-current', 'page');
    await expect(option2).not.toHaveAttribute('aria-current');
    expect(consoleMessages).toContain('Selected option: option3'); //check the console log text when we click on any button.
    consoleMessages = []; //clear console.log data

    await option2.click();
    await expect(option2).toHaveAttribute('aria-current', 'page');
    await expect(option3).not.toHaveAttribute('aria-current');
    expect(consoleMessages).toContain('Selected option: option2');
    consoleMessages = [];
  });
});
