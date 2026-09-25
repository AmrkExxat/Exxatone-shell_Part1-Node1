import { test, expect } from '@playwright/test';

test.describe('RadixProgressBar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?id=radixui-radixprogressbar--default&viewMode=story'
    );
  });

  test('should render the progress bar', async ({ page }) => {
    const progressBar = page.getByTestId('radix-progress-bar');
    await expect(progressBar).toBeVisible();
  });

  test('should have correct aria attributes', async ({ page }) => {
    const progressBar = page.getByTestId('radix-progress-bar');
    await expect(progressBar).toHaveAttribute('role', 'progressbar');
    await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    await expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  test('should display the indicator element', async ({ page }) => {
    const indicator = page.getByTestId('radix-progress-bar-indicator');
    await expect(indicator).toBeVisible();
  });
});

test.describe('RadixProgressBar - Custom Colors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?id=radixui-radixprogressbar--custom-colors&viewMode=story'
    );
  });

  test('should apply custom indicator color', async ({ page }) => {
    const indicator = page.getByTestId('radix-progress-bar-indicator');
    const backgroundColor = await indicator.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe('rgb(139, 92, 246)');
  });

  test('should apply custom track color', async ({ page }) => {
    const progressBar = page.getByTestId('radix-progress-bar');
    const backgroundColor = await progressBar.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe('rgb(243, 232, 255)');
  });
});

test.describe('RadixProgressBar - Custom Dimensions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?id=radixui-radixprogressbar--custom-dimensions&viewMode=story'
    );
  });

  test('should apply custom height and width', async ({ page }) => {
    const progressBar = page.getByTestId('radix-progress-bar');
    const height = await progressBar.evaluate((el) => window.getComputedStyle(el).height);
    const width = await progressBar.evaluate((el) => window.getComputedStyle(el).width);
    expect(height).toBe('16px');
    expect(width).toBe('300px');
  });
});

test.describe('RadixProgressBar - Indeterminate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?id=radixui-radixprogressbar--indeterminate&viewMode=story'
    );
  });

  test('should have indeterminate data state', async ({ page }) => {
    const progressBar = page.getByTestId('radix-progress-bar');
    await expect(progressBar).toHaveAttribute('data-state', 'indeterminate');
  });
});
