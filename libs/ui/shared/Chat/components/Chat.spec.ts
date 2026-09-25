import { test, expect } from '@playwright/test';

test.describe('Testcase for Chat component', () => {
  const drawerButtonSelector = '#drawerBtn';
  const chatMessageSelector = '#messageInput';
  const toggleButtonSelector = '#togglebutton';

  test('should render Chat component with drawer button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--chat', {
      waitUntil: 'load',
    });
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(drawerButtonSelector);
    await openDrawerButton.waitFor({ state: 'visible', timeout: 60000 });
    console.log('Button is visible, now clicking the button.');
    await openDrawerButton.click();
    const chatMessages = await frame.locator(chatMessageSelector);
    await chatMessages.waitFor({ state: 'visible', timeout: 60000 });
    await expect(chatMessages).toBeVisible();
  });

  test('should show a new message after sending', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--chat');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const chatMessages = frame.locator(chatMessageSelector);
    await chatMessages.waitFor();
    const inputSelector = frame.locator('textarea#messageInput');
    const sendButton = frame.locator('button:has-text("Send")');
    await inputSelector.fill('New test message');
    await sendButton.click();
    const updatedChatMessages = frame.locator(chatMessageSelector);
  });

  test('should have an empty input field when the chat is loaded', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--chat');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const chatMessages = await frame.locator(chatMessageSelector);
    await chatMessages.waitFor({ state: 'visible', timeout: 60000 });
    const inputValue = await chatMessages.inputValue();
    expect(inputValue).toBe('');
  });

  test('should disable send button when input field is empty', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--chat');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const inputField = frame.locator(chatMessageSelector);
    const sendButton = frame.locator('button:has-text("Send")');
    const isSendButtonDisabled = await sendButton.isDisabled();
    expect(isSendButtonDisabled).toBe(true);
  });

  test('should handle multiple messages correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--chat');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const inputField = frame.locator(chatMessageSelector);
    const sendButton = frame.locator('button:has-text("Send")');
    const messages = ['Message 1', 'Message 2', 'Message 3'];
    for (const message of messages) {
      await inputField.fill(message);
      await sendButton.click();
    }
  });

  test('should display more items when "Show More" is clicked', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--minified');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const showMoreButton = frame.locator(toggleButtonSelector);
    await showMoreButton.waitFor({ state: 'visible' });
    await expect(showMoreButton).toBeVisible();
    await expect(showMoreButton).toHaveText('Show more');
    await showMoreButton.click();
  });

  test('should switch between tabs when clicked', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--tabbed');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const tabContainer = frame.locator('#tab');
    await tabContainer.waitFor({ state: 'visible', timeout: 5000 });
    await expect(tabContainer).toBeVisible();
    await expect(tabContainer.locator('button')).toHaveCount(3);
  });

  test('Click on Site School & Student', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--tabbed');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const siteTab = frame.locator('#site');
    await siteTab.waitFor({ state: 'visible', timeout: 2000 });
    await siteTab.click();
    const studentTab = frame.locator('#student');
    await studentTab.waitFor({ state: 'visible', timeout: 2000 });
    await studentTab.click();
    const schoolTab = frame.locator('#school');
    await schoolTab.waitFor({ state: 'visible', timeout: 2000 });
    await schoolTab.click();
    const skeleton = frame.locator('#skeleton');
    await skeleton.waitFor({ state: 'visible', timeout: 2000 });
  });

  test('Click if Skeleton initially loads on click of Tabs', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--tabbed');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const schoolTab = frame.locator('#school');
    await schoolTab.waitFor({ state: 'visible', timeout: 2000 });
    await schoolTab.click();
    const skeleton = frame.locator('#skeleton');
    await skeleton.waitFor({ state: 'visible', timeout: 2000 });
  });

  test('Click if Chat Drawer closes on click of Close button.', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--tabbed');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const closeBtn = frame.locator('#closeButton');
    await closeBtn.waitFor({ state: 'visible', timeout: 2000 });
    await closeBtn.click();
    await drawerButton.waitFor({ state: 'visible', timeout: 2000 });
  });

  test('Tab Navigation to send a message.', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--tabbed');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const chatMessages = frame.locator(chatMessageSelector);
    await chatMessages.waitFor();
    const inputSelector = frame.locator('textarea#messageInput');
    await inputSelector.fill('New test message');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  });

  test('Minified Tab Navigation to send a message.', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--minified');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chatMessages = frame.locator(chatMessageSelector);
    await chatMessages.waitFor();
    const inputSelector = frame.locator('textarea#messageInput');
    await frame.locator('textarea#messageInput')?.focus?.();
    await inputSelector.fill('New test message');
    const sendButton = frame.locator('button:has-text("Send")');
    await sendButton.click();
    await page.keyboard.press('Tab'); //Clicking show more button
    await page.keyboard.press('Enter');
  });

  test('Tab navigate accross the tabs.', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-chat--tabbed');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const drawerButton = frame.locator(drawerButtonSelector);
    await drawerButton.click();
    const siteTab = frame.locator('#site');
    await siteTab.waitFor({ state: 'visible', timeout: 2000 });
    await siteTab.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.insertText('Hey Its Mehh!');
    await page.keyboard.press('Enter', { delay: 5000 });
  });
});
