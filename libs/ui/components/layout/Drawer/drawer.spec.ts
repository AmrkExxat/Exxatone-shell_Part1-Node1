import { expect, test } from '@playwright/test';

test.describe('Drawer component', () => {
  test.setTimeout(20000);

  const storybookURL: string = 'http://localhost:6006/?path=/docs/layout-drawer--docs';

  test('should render with the initial state closed', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/layout-drawer--small-sized');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const drawer = frame.locator('text=Small Sized Drawer');
    await expect(drawer).not.toBeVisible();
  });

  test('should open the drawer and display correct content', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/layout-drawer--small-sized');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = frame.locator('text=Open Drawer');
    await openDrawerButton.click();
    const drawer = frame.locator('text=Small Sized Drawer');
    await expect(drawer).toBeVisible();
    const name = frame.locator('text=Harvey');
    await expect(name).toBeVisible();
    const position = frame.locator('text=MD');
    await expect(position).toBeVisible();
    const deleteButton = frame.locator('button', { hasText: 'Delete' });
    await expect(deleteButton).toBeVisible();
    const saveButton = frame.locator('button', { hasText: 'Save' });
    await expect(saveButton).toBeVisible();
  });

  test('should close the drawer when the close button is clicked', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/layout-drawer--small-sized');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = frame.locator('text=Open Drawer');
    await openDrawerButton.click();
    const drawer = frame.locator('text=Small Sized Drawer');
    await expect(drawer).toBeVisible();
    const closeButton = frame.locator('button', { hasText: 'Close' });
    await closeButton.click();
    await expect(drawer).not.toBeVisible();
  });

  test('should trigger delete action', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/layout-drawer--small-sized');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = frame.locator('text=Open Drawer');
    await openDrawerButton.click();
    const deleteButton = frame.locator('button', { hasText: 'Delete' });
    await deleteButton.click();
  });

  test('should trigger save action', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/layout-drawer--small-sized');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = frame.locator('text=Open Drawer');
    await openDrawerButton.click();
    const saveButton = frame.locator('button', { hasText: 'Save' });
    await saveButton.click();
  });

  test('should toggle the drawer state multiple times', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/layout-drawer--small-sized');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const openDrawerButton = frame.locator('text=Open Drawer');
    await openDrawerButton.click();
    const drawer = frame.locator('text=Small Sized Drawer');
    await expect(drawer).toBeVisible();
    const closeButton = frame.locator('button', { hasText: 'Close' });
    await closeButton.click();
    await expect(drawer).not.toBeVisible();
    await openDrawerButton.click();
    await expect(drawer).toBeVisible();
    await closeButton.click();
    await expect(drawer).not.toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/layout-drawer--small-sized');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    await page.setViewportSize({ width: 375, height: 812 });
    const openDrawerButton = frame.locator('text=Open Drawer');
    await openDrawerButton.click();
    const drawer = frame.locator('text=Small Sized Drawer');
    await expect(drawer).toBeVisible();
    const closeButton = frame.locator('button', { hasText: 'Close' });
    await closeButton.click();
    await expect(drawer).not.toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await openDrawerButton.click();
    await expect(drawer).toBeVisible();
    await closeButton.click();
    await expect(drawer).not.toBeVisible();
  });
});
