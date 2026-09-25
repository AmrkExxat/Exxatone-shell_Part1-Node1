import { test, expect } from '@playwright/test';

test.describe('Testcase for Notification component', () => {
  const openDrawerButtonSelector = '#open-drawer-btn';
  const DrawerOpen = '#DrawerHeader';
  const closeDrawer = '#closeButton';
  const markNotificationButton = '#markreadButton';
  const unreadToggleSwitch = '#unreadToggle';
  const unreadOnlyLabel = 'Unread Only';
  const tabsInDrawer = '#notificationTabs';
  const allTabClicked = '#allTab';
  const allMessagesTabClicked = '#allMessagesTab';
  const allUpdatesTabClicked = '#allUpdatesTab';

  test('should open Notification drawer when button is clicked', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(openDrawerButtonSelector);
    await openDrawerButton.click();
    await expect(openDrawerButton).toBeVisible();
    const drawer = await frame.locator(DrawerOpen);
    await expect(drawer).toBeVisible();
  });

  test('should close Notification drawer when close button is clicked', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(openDrawerButtonSelector);
    await openDrawerButton.click();
    await expect(openDrawerButton).toBeVisible();
    const drawer = await frame.locator(DrawerOpen);
    await expect(drawer).toBeVisible();
    const closeDrawerButton = await frame.locator(closeDrawer);
    await expect(closeDrawerButton).toBeVisible();
    await closeDrawerButton.click();
  });

  test('should open Notification drawer and click "Mark all Read" button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(openDrawerButtonSelector);
    await openDrawerButton.click();
    await expect(openDrawerButton).toBeVisible();
    const drawer = await frame.locator(DrawerOpen);
    await expect(drawer).toBeVisible();
    const markAllButtonClicked = await frame.locator(markNotificationButton);
    await expect(markAllButtonClicked).toBeVisible();
    await markAllButtonClicked.click();
  });

  test('Testcase for Unread Only Toggle Switch', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(openDrawerButtonSelector);
    await openDrawerButton.click();
    await expect(openDrawerButton).toBeVisible();
    const drawer = await frame.locator(DrawerOpen);
    await expect(drawer).toBeVisible();
    const unreadToggleSwitchClicked = await frame.locator(unreadToggleSwitch);
    await expect(unreadToggleSwitchClicked).toBeVisible();
    await expect(unreadOnlyLabel).toContain('Unread Only');
    await expect(unreadToggleSwitchClicked).not.toBeChecked();
    await unreadToggleSwitchClicked.click();
    await expect(unreadToggleSwitchClicked).toBeChecked();
  });

  test('Ensure Tab component is being rendered', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(openDrawerButtonSelector);
    await openDrawerButton.click();
    await expect(openDrawerButton).toBeVisible();
    const drawer = await frame.locator(DrawerOpen);
    await expect(drawer).toBeVisible();

    const tabs = await frame.locator(tabsInDrawer);
    await expect(tabs).toBeVisible();
    await expect(tabs).toHaveCount(1);
    await tabs.click();
  });

  test('All tabs in tab component rendered', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(openDrawerButtonSelector);
    await openDrawerButton.click();
    await expect(openDrawerButton).toBeVisible();
    const drawer = await frame.locator(DrawerOpen);
    await expect(drawer).toBeVisible();

    const tabs = await frame.locator(tabsInDrawer);
    await expect(tabs).toBeVisible();
    await expect(tabs).toHaveCount(1);
    await tabs.click();

    const allTabs = await frame.locator(allTabClicked);
    await expect(allTabs).toBeVisible();
    await allTabs.click();

    const allMessagesTab = await frame.locator(allMessagesTabClicked);
    await expect(allMessagesTab).toBeVisible();
    await allMessagesTab.click();

    const allUpdatesTab = await frame.locator(allUpdatesTabClicked);
    await expect(allUpdatesTab).toBeVisible();
    await allUpdatesTab.click();
  });

  test('should display badge values for All, All Messages, and All Updates tabs', async ({
    page,
  }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(openDrawerButtonSelector);
    await openDrawerButton.click();
    await expect(openDrawerButton).toBeVisible();
    const drawer = await frame.locator(DrawerOpen);
    await expect(drawer).toBeVisible();

    const allTabs = await frame.locator(allTabClicked);
    await expect(allTabs).toBeVisible();
    await allTabs.click();

    const badgeDisplayedonallTab = await allTabs.locator('span.items-center');
    await expect(badgeDisplayedonallTab).toBeVisible();

    const allMessagesTab = await frame.locator(allMessagesTabClicked);
    await expect(allMessagesTab).toBeVisible();
    await allMessagesTab.click();

    const badgeDisplayedonallMessagesTab = await allMessagesTab.locator('span.items-center');
    await expect(badgeDisplayedonallMessagesTab).toBeVisible();

    const allUpdatesTab = await frame.locator(allUpdatesTabClicked);
    await expect(allUpdatesTab).toBeVisible();
    await allUpdatesTab.click();

    const badgeDisplayedonallUpdatesTab = await allMessagesTab.locator('span.items-center');
    await expect(badgeDisplayedonallUpdatesTab).toBeVisible();
  });

  test('Tabbed navigation to move accross and close the drawer', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/shared-ui-notification--notification');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = await frame.locator(openDrawerButtonSelector);
    await openDrawerButton.click();
    await expect(openDrawerButton).toBeVisible();
    const drawer = await frame.locator(DrawerOpen);
    await expect(drawer).toBeVisible();
    const markAllButtonClicked = await frame.locator(markNotificationButton);
    await expect(markAllButtonClicked).toBeVisible();
    await markAllButtonClicked.click();
    await page.keyboard.press('Tab');
    const unreadToggleSwitchClicked = await frame.locator(unreadToggleSwitch);
    await expect(unreadToggleSwitchClicked).toBeVisible();
    await expect(unreadOnlyLabel).toContain('Unread Only');
    await expect(unreadToggleSwitchClicked).not.toBeChecked();
    await page.keyboard.press('Space');
    await expect(unreadToggleSwitchClicked).toBeChecked();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab', { delay: 100 });
    await page.keyboard.press('Tab', { delay: 100 });
    await page.keyboard.press('Tab', { delay: 100 });
    await page.keyboard.press('Tab', { delay: 100 });
    await page.keyboard.press('Tab', { delay: 100 });
    await page.keyboard.press('Tab', { delay: 100 });
    await page.keyboard.press('Tab', { delay: 100 });
    await page.keyboard.press('Shift+Tab', { delay: 100 });
    await page.keyboard.press('Shift+Tab', { delay: 100 });
    await page.keyboard.press('Shift+Tab', { delay: 100 });
    await page.keyboard.press('Shift+Tab', { delay: 100 });
    await page.keyboard.press('Shift+Tab', { delay: 100 });
    await page.keyboard.press('Shift+Tab', { delay: 100 });
    await page.keyboard.press('Shift+Tab', { delay: 100 });
    await page.keyboard.press('Enter');
    await expect(openDrawerButton).toBeVisible();
  });
});
