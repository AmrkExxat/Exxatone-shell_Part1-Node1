import { test, expect } from '@playwright/test';

const STORY_URL = 'http://localhost:6006/?path=/story/common-spinner--all-variants-and-sizes';

test.describe('Spinner component in Storybook', () => {
  // Legacy-style tests for normal variant sizes,
  // adapted to the consolidated "AllVariantsAndSizes" story.
  test(`check for spinner with xs size`, async ({ page }) => {
    await page.goto(STORY_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const spinner = frame.locator('#normal-xs-spinner');

    await spinner.waitFor({ state: 'visible', timeout: 60000 });
    const classNames = await spinner.getAttribute('class');
    expect(classNames).toContain('w-4');
    expect(classNames).toContain('h-4');
    expect(classNames).toContain('inline');
    expect(classNames).toContain('animate-spin');
  });

  test(`check for spinner with small size`, async ({ page }) => {
    await page.goto(STORY_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const spinner = frame.locator('#normal-sm-spinner');

    await spinner.waitFor({ state: 'visible', timeout: 60000 });
    const classNames = await spinner.getAttribute('class');
    expect(classNames).toContain('w-6');
    expect(classNames).toContain('h-6');
    expect(classNames).toContain('inline');
    expect(classNames).toContain('animate-spin');
  });

  test(`check for spinner with medium size`, async ({ page }) => {
    await page.goto(STORY_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const spinner = frame.locator('#normal-md-spinner');

    await spinner.waitFor({ state: 'visible', timeout: 60000 });
    const classNames = await spinner.getAttribute('class');
    expect(classNames).toContain('w-8');
    expect(classNames).toContain('h-8');
    expect(classNames).toContain('inline');
    expect(classNames).toContain('animate-spin');
  });

  test(`check for spinner with large size`, async ({ page }) => {
    await page.goto(STORY_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const spinner = frame.locator('#normal-lg-spinner');

    await spinner.waitFor({ state: 'visible', timeout: 60000 });
    const classNames = await spinner.getAttribute('class');
    expect(classNames).toContain('w-10');
    expect(classNames).toContain('h-10');
    expect(classNames).toContain('inline');
    expect(classNames).toContain('animate-spin');
  });

  test(`check for spinner with xl size`, async ({ page }) => {
    await page.goto(STORY_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');
    const spinner = frame.locator('#normal-xl-spinner');

    await spinner.waitFor({ state: 'visible', timeout: 60000 });
    const classNames = await spinner.getAttribute('class');
    expect(classNames).toContain('w-12');
    expect(classNames).toContain('h-12');
    expect(classNames).toContain('inline');
    expect(classNames).toContain('animate-spin');
  });

  const sizes = [
    { size: 'xs', widthClass: 'w-4', heightClass: 'h-4' },
    { size: 'sm', widthClass: 'w-6', heightClass: 'h-6' },
    { size: 'md', widthClass: 'w-8', heightClass: 'h-8' },
    { size: 'lg', widthClass: 'w-10', heightClass: 'h-10' },
    { size: 'xl', widthClass: 'w-12', heightClass: 'h-12' },
  ] as const;

  sizes.forEach(({ size, widthClass, heightClass }) => {
    test(`normal variant spinner renders with correct size classes for ${size}`, async ({
      page,
    }) => {
      await page.goto(STORY_URL);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const spinner = frame.locator(`#normal-${size}-spinner`);

      await spinner.waitFor({ state: 'visible', timeout: 60000 });
      const classNames = await spinner.getAttribute('class');

      expect(classNames).toContain(widthClass);
      expect(classNames).toContain(heightClass);
      expect(classNames).toContain('inline');
      expect(classNames).toContain('animate-spin');
    });
  });

  test('pie spinner variant is rendered and accessible', async ({ page }) => {
    await page.goto(STORY_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const pieStatus = frame
      .getByText('pie variant')
      .locator('xpath=..')
      .getByRole('status')
      .first();
    await expect(pieStatus).toBeVisible();

    await expect(pieStatus).toHaveAttribute('aria-busy', 'true');
    await expect(pieStatus).toHaveAttribute('aria-live', 'polite');
  });

  test('star spinner variant is rendered and accessible', async ({ page }) => {
    await page.goto(STORY_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const starStatus = frame
      .getByText('star variant')
      .locator('xpath=..')
      .getByRole('status')
      .first();
    await expect(starStatus).toBeVisible();

    await expect(starStatus).toHaveAttribute('aria-busy', 'true');
    await expect(starStatus).toHaveAttribute('aria-live', 'polite');
  });

  test('dot spinner variant is rendered and accessible', async ({ page }) => {
    await page.goto(STORY_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dotStatus = frame
      .getByText('dot variant')
      .locator('xpath=..')
      .getByRole('status')
      .first();
    await expect(dotStatus).toBeVisible();

    await expect(dotStatus).toHaveAttribute('aria-busy', 'true');
    await expect(dotStatus).toHaveAttribute('aria-live', 'polite');
  });
});
