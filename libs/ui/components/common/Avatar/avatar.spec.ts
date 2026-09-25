import { test, expect } from '@playwright/test';

test.describe('Avatar Component', () => {
  async function getAvatar(frame, id) {
    const avatar = frame.locator(`#${id}`);
    console.log(avatar, 'Is visible');
    await expect(avatar).toBeVisible({ timeout: 5000 });
    return avatar;
  }

  test('Positive: Simple Avatar component should render correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-avatar--default-avatar');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const avatar = frame.locator('#default');

    await avatar.waitFor({ state: 'visible', timeout: 60000 });
    await expect(avatar).toBeVisible();

    const className = await avatar.getAttribute('class');
    expect(className).toContain('h-[50px]');
    expect(className).toContain('w-[50px]');
  });

  test('Positive: Avatar with name should render initials', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-avatar--avatar-with-name');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const avatarWithName = frame.locator('#avatarName');
    await avatarWithName.waitFor({ state: 'visible', timeout: 60000 });

    await expect(avatarWithName).toBeVisible();

    await expect(avatarWithName).toHaveText('HS');
  });

  test('Positive: Avatar with SRC should render the image', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-avatar--avatar-with-src');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const avatarWithSrc = frame.locator('#avatarSrc');

    await expect(avatarWithSrc).toBeVisible({ timeout: 60000 });
    const imgSrc = await avatarWithSrc.getAttribute('src');

    expect(imgSrc).toBe('https://via.placeholder.com/90');
  });

  test('Negative: Avatar should not be visible if incorrect ID is used', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-avatar--default-avatar');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const avatar = frame.locator('#nonExistentAvatar');

    await expect(avatar).not.toBeVisible();
  });

  test('Negative: Avatar with src should not render without valid src', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-avatar--avatar-with-src');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const avatarWithSrc = frame.locator('#avatarSrc');
    await avatarWithSrc.waitFor({ state: 'visible', timeout: 60000 });

    await avatarWithSrc.evaluate((img) => {
      (img as HTMLImageElement).src = '';
    });

    const img = avatarWithSrc.locator('img');
    await expect(img).not.toBeVisible();
  });

  test('Negative: Avatar with name should not show initials when both names are empty', async ({
    page,
  }) => {
    await page.goto('http://localhost:6006/?path=/story/common-avatar--avatar-with-name');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const avatarWithName = frame.locator('#avatarName');
    await avatarWithName.waitFor({ state: 'visible', timeout: 60000 });

    await avatarWithName.evaluate((el) => {
      el.setAttribute('data-first-name', '');
      el.setAttribute('data-last-name', '');
      el.innerHTML = '';
    });

    await expect(avatarWithName).toHaveText('');
  });
});
