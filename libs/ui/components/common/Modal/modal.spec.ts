import { test, expect } from '@playwright/test';

test.describe('Modal Component', () => {
  test('should open and close modal in ModalStory and trigger primary/secondary actions', async ({
    page,
  }) => {
    await page.goto('http://localhost:6006/?path=/story/common-modal--modal-story');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const modalButton = frame.locator('#modal-btn');
    await modalButton.waitFor({ state: 'visible', timeout: 60000 });
    await modalButton.click();

    const modal = frame.locator('#modal');
    await modal.waitFor({ state: 'visible' });

    expect(await modal.isVisible()).toBeTruthy();

    const modalTitle = await modal.locator('#modal-title').innerText();
    expect(modalTitle).toBe('Are you sure you want to remove the entity?');

    const primaryButton = frame.locator('button:has-text("Add any text")');
    await primaryButton.click();
    await modal.waitFor({ state: 'hidden' });

    expect(await modal.isVisible()).toBeFalsy();
  });

  test('should open and close modal in WithHeading story with different content', async ({
    page,
  }) => {
    await page.goto('http://localhost:6006/?path=/story/common-modal--with-heading');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const modalButton = frame.locator('button:has-text("Open Modal")');
    await modalButton.waitFor({ state: 'visible', timeout: 60000 });
    await modalButton.click();

    const modal = frame.locator('#modal');
    await modal.waitFor({ state: 'visible' });

    expect(await modal.isVisible()).toBeTruthy();

    const modalTitle = await modal.locator('#modal-title').innerText();
    expect(modalTitle).toBe('Heading');

    const modalDescription = modal.locator('#modal-description');
    await modalDescription.waitFor({ state: 'visible', timeout: 10000 });
    const descriptionText = await modalDescription.innerText();
    expect(descriptionText).toContain('Lorem ipsum is a placeholder text');

    const cancelButton = frame.locator('button:has-text("Cancel")');
    await cancelButton.click();

    await modal.waitFor({ state: 'hidden' });
    expect(await modal.isVisible()).toBeFalsy();
  });

  test('should open and close modal in CustomTemplate story with custom layout', async ({
    page,
  }) => {
    await page.goto('http://localhost:6006/?path=/story/common-modal--custom-template');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const modalButton = frame.locator('button:has-text("Open Modal")');
    await modalButton.waitFor({ state: 'visible', timeout: 60000 });
    await modalButton.click();

    const modal = frame.locator('#modal');
    await modal.waitFor({ state: 'visible' });

    expect(await modal.isVisible()).toBeTruthy();

    const nameField = await modal.locator('span:text("Adaptial - Easton")').innerText();
    expect(nameField).toBe('Adaptial - Easton');

    const phoneField = await modal.locator('span:text("(303) 196-2491")').innerText();
    expect(phoneField).toBe('(303) 196-2491');

    const cancelButton = frame.locator('#modal_cancel_btn');
    await cancelButton.click();

    await modal.waitFor({ state: 'hidden' });

    expect(await modal.isVisible()).toBeFalsy();
  });

  test('should not open modal without clicking the button', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-modal--modal-story');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const modal = frame.locator('#modal');

    expect(await modal.isVisible()).toBeFalsy();
  });

  test('should not close modal when primary action is clicked without required action', async ({
    page,
  }) => {
    await page.goto('http://localhost:6006/?path=/story/common-modal--modal-story');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const modalButton = frame.locator('#modal-btn');
    await modalButton.waitFor({ state: 'visible', timeout: 60000 });
    await modalButton.click();

    const modal = frame.locator('#modal');
    await modal.waitFor({ state: 'visible' });

    const primaryButton = frame.locator('button:has-text("Add any text")');
    await primaryButton.click();

    expect(await modal.isVisible()).toBeTruthy();
  });

  test('should verify that modal title is not a default value', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-modal--with-heading');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const modalButton = frame.locator('button:has-text("Open Modal")');
    await modalButton.waitFor({ state: 'visible', timeout: 60000 });
    await modalButton.click();

    const modal = frame.locator('#modal');
    await modal.waitFor({ state: 'visible' });

    const modalTitle = await modal.locator('#modal-title').innerText();
    expect(modalTitle).not.toBe('Default Title');
  });
});
