import { test, expect } from '@playwright/test';

const STORY_BASE = 'http://localhost:6006/?path=/story/common-fileviewer';
const FRAME = 'iframe#storybook-preview-iframe';

test.describe('FileViewer component in Storybook', () => {
  test.setTimeout(60000);

  test('Positive: FileViewer renders title when open', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    const title = frame.locator('text=File Viewer').first();
    await title.waitFor({ state: 'visible', timeout: 60000 });
    await expect(title).toBeVisible();
  });

  test('Positive: close button is rendered and accessible', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    const closeBtn = frame.locator('#file_viewer_close_btn');
    await closeBtn.waitFor({ state: 'visible', timeout: 60000 });
    await expect(closeBtn).toBeVisible();

    const ariaLabel = await closeBtn.getAttribute('aria-label');
    expect(ariaLabel).toBe('Close File Viewer');
  });

  test('Positive: file list item is rendered with correct testid', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    const fileItem = frame.locator('[data-testid="file-file-001-details"]');
    await fileItem.waitFor({ state: 'visible', timeout: 60000 });
    await expect(fileItem).toBeVisible();
  });

  test('Positive: file name is displayed in the file list', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    const fileItem = frame.locator('[data-testid="file-file-001-details"]');
    await fileItem.waitFor({ state: 'visible', timeout: 60000 });
    await expect(fileItem).toContainText('sample-image.png');
  });

  test('Positive: download button is rendered for the file', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    const downloadBtn = frame.locator('#download_file_0');
    await downloadBtn.waitFor({ state: 'visible', timeout: 60000 });
    await expect(downloadBtn).toBeVisible();
  });

  test('Positive: image preview renders for png file', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    const imgPreview = frame.locator('[data-testid="file-001-image-preview"]');
    await imgPreview.waitFor({ state: 'visible', timeout: 60000 });
    await expect(imgPreview).toBeVisible();
  });

  test('Positive: image preview src is set to binaryData', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    const imgPreview = frame.locator('[data-testid="file-001-image-preview"]');
    await imgPreview.waitFor({ state: 'visible', timeout: 60000 });

    const src = await imgPreview.getAttribute('src');
    expect(src).toContain('data:image/png;base64');
  });

  test('Positive: multiple files are shown in the file list', async ({ page }) => {
    await page.goto(`${STORY_BASE}--multiple-files`);
    const frame = page.frameLocator(FRAME);

    const file1 = frame.locator('[data-testid="file-file-001-details"]');
    const file2 = frame.locator('[data-testid="file-file-002-details"]');

    await file1.waitFor({ state: 'visible', timeout: 60000 });
    await expect(file1).toBeVisible();
    await expect(file2).toBeVisible();
  });

  test('Positive: download buttons rendered for all files in multiple files story', async ({
    page,
  }) => {
    await page.goto(`${STORY_BASE}--multiple-files`);
    const frame = page.frameLocator(FRAME);

    const downloadBtn0 = frame.locator('#download_file_0');
    const downloadBtn1 = frame.locator('#download_file_1');

    await downloadBtn0.waitFor({ state: 'visible', timeout: 60000 });
    await expect(downloadBtn0).toBeVisible();
    await expect(downloadBtn1).toBeVisible();
  });

  test('Positive: clicking a second file updates selection highlight', async ({ page }) => {
    await page.goto(`${STORY_BASE}--multiple-files`);
    const frame = page.frameLocator(FRAME);

    const file2 = frame.locator('[data-testid="file-file-002-details"]');
    await file2.waitFor({ state: 'visible', timeout: 60000 });
    await file2.click();

    const classNames = await file2.getAttribute('class');
    expect(classNames).toContain('bg-blue-50');
  });

  test('Positive: clicking a second file shows its image preview', async ({ page }) => {
    await page.goto(`${STORY_BASE}--multiple-files`);
    const frame = page.frameLocator(FRAME);

    const file2 = frame.locator('[data-testid="file-file-002-details"]');
    await file2.waitFor({ state: 'visible', timeout: 60000 });
    await file2.click();

    const imgPreview = frame.locator('[data-testid="file-002-image-preview"]');
    await imgPreview.waitFor({ state: 'visible', timeout: 60000 });
    await expect(imgPreview).toBeVisible();
  });

  test('Positive: video source link story renders iframe preview', async ({ page }) => {
    await page.goto(`${STORY_BASE}--video-source-link`);
    const frame = page.frameLocator(FRAME);

    const iframePreview = frame.locator('[data-testid="video-field-iframe-preview"]');
    await iframePreview.waitFor({ state: 'visible', timeout: 60000 });
    await expect(iframePreview).toBeVisible();
  });

  test('Positive: video iframe src contains the source link', async ({ page }) => {
    await page.goto(`${STORY_BASE}--video-source-link`);
    const frame = page.frameLocator(FRAME);

    const iframePreview = frame.locator('[data-testid="video-field-iframe-preview"]');
    await iframePreview.waitFor({ state: 'visible', timeout: 60000 });

    const src = await iframePreview.getAttribute('src');
    expect(src).toContain('youtube.com/embed');
  });

  test('Positive: file item is keyboard accessible via Enter key', async ({ page }) => {
    await page.goto(`${STORY_BASE}--multiple-files`);
    const frame = page.frameLocator(FRAME);

    const file2 = frame.locator('[data-testid="file-file-002-details"]');
    await file2.waitFor({ state: 'visible', timeout: 60000 });
    await file2.dispatchEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });

    const imgPreview = frame.locator('[data-testid="file-002-image-preview"]');
    await expect(imgPreview).toBeVisible({ timeout: 10000 });
  });

  test('Negative: FileViewer title is not visible when closed', async ({ page }) => {
    await page.goto(`${STORY_BASE}--closed`);
    const frame = page.frameLocator(FRAME);

    const title = frame.locator('div.text-lg.font-semibold', { hasText: 'File Viewer' });
    await expect(title).not.toBeVisible({ timeout: 5000 });
  });

  test('Negative: file item with non-existent id is not visible', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    await frame
      .locator('[data-testid="file-file-001-details"]')
      .waitFor({ state: 'visible', timeout: 60000 });

    const nonExistent = frame.locator('[data-testid="file-nonexistent-details"]');
    await expect(nonExistent).not.toBeVisible();
  });

  test('Negative: download button beyond file count is not present', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    await frame
      .locator('[data-testid="file-file-001-details"]')
      .waitFor({ state: 'visible', timeout: 60000 });

    const outOfRangeBtn = frame.locator('[data-testid="download_file_5"]');
    await expect(outOfRangeBtn).not.toBeVisible();
  });

  test('Negative: image preview for a non-selected file is not visible', async ({ page }) => {
    await page.goto(`${STORY_BASE}--default`);
    const frame = page.frameLocator(FRAME);

    await frame
      .locator('[data-testid="file-file-001-details"]')
      .waitFor({ state: 'visible', timeout: 60000 });

    const otherPreview = frame.locator('[data-testid="file-999-image-preview"]');
    await expect(otherPreview).not.toBeVisible();
  });
});
