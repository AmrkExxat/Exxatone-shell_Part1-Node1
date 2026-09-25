import { test, expect } from '@playwright/test';

test('renders determinate progress bar in Storybook', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/common-progressbar--determinte-progress');

  const frame = page.frameLocator('iframe#storybook-preview-iframe');
  const progressBar = frame.locator('.MuiLinearProgress-bar');
  await progressBar.waitFor({ state: 'visible', timeout: 60000 });
  await expect(progressBar).not.toHaveClass(/MuiLinearProgress-bar1Indeterminate/);
});

test('renders indeterminate progress bar in Storybook', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/common-progressbar--indeterminate-progress');
  const frame = page.frameLocator('iframe#storybook-preview-iframe');
  const progressBar = frame.locator('.MuiLinearProgress-indeterminate');
  await progressBar.waitFor({ state: 'visible', timeout: 60000 });
  await expect(progressBar).toHaveClass(/MuiLinearProgress-indeterminate/);
});

test('progress bar initially with value and update value', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/common-progressbar--determinte-progress');

  const frame = page.frameLocator('iframe#storybook-preview-iframe');
  const progressBarRoot = frame.locator('.MuiLinearProgress-root');
  await progressBarRoot.waitFor({ state: 'visible', timeout: 60000 });
  await expect(progressBarRoot).toHaveAttribute('aria-valuenow', '50', { timeout: 60000 });

  // Inject JavaScript to simulate a prop change to update progressValue to 75
  const progressInputControl = page.locator('input[name="progressValue"]');
  await progressInputControl.fill('75');

  const updatedAriaValue = await progressBarRoot.getAttribute('aria-valuenow');
  await expect(updatedAriaValue).toBe('75');
});

test('changes the color of the custom progress bar in Storybook', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/common-progressbar--custom-color-progress');

  const frame = page.frameLocator('iframe#storybook-preview-iframe');
  const progressBar = frame.locator('.MuiLinearProgress-bar');

  await progressBar.waitFor({ state: 'visible', timeout: 60000 });
  const initialColor = await progressBar.evaluate((el) => el.style.backgroundColor);

  const newColor = 'rgb(255, 0, 0)';
  await progressBar.evaluate((el, color) => {
    el.style.backgroundColor = color;
  }, newColor);

  const updatedColor = await progressBar.evaluate((el) => el.style.backgroundColor);
  await expect(updatedColor).toBe(newColor);
  await expect(updatedColor).not.toBe(initialColor);
});
