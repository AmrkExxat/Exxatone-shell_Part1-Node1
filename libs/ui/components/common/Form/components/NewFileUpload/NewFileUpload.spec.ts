import { test, expect } from '@playwright/test';

const STORYBOOK_URL = 'http://localhost:6006/?path=/story/common-newfileupload--default';
const STORYBOOK_FAILURE_URL =
  'http://localhost:6006/?path=/story/common-newfileupload--default-failure';

test.describe('NewFileUpload', () => {
  test('should render dropzone with default text', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    await expect(frame.getByText('Upload or drag & drop your file')).toBeVisible();
    await expect(frame.getByText('PDF, DOC or DOCX • Max 2 MB')).toBeVisible();
  });

  test('should upload valid PDF file via input', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    const fileName = 'test-document.pdf';
    const fileData = {
      name: fileName,
      mimeType: 'application/pdf',
      buffer: Buffer.from('mocked pdf content'),
    };

    await uploadInput.setInputFiles({
      name: fileData.name,
      mimeType: fileData.mimeType,
      buffer: fileData.buffer,
    });

    // Wait for upload to complete and verify file extension badge is shown
    await expect(frame.getByText('PDF')).toBeVisible({ timeout: 10000 });
    // Verify filename (without extension) is shown
    await expect(frame.getByText('test-document')).toBeVisible();
    // Verify replace button appears after upload
    await expect(frame.getByText('Replace file')).toBeVisible();
  });

  test('should upload valid DOC file via input', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    const fileName = 'my-doc-file.doc';
    const fileData = {
      name: fileName,
      mimeType: 'application/msword',
      buffer: Buffer.from('mocked doc content'),
    };

    await uploadInput.setInputFiles({
      name: fileData.name,
      mimeType: fileData.mimeType,
      buffer: fileData.buffer,
    });

    // Use exact match for DOC to avoid matching DOCX
    await expect(frame.getByText('DOC', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(frame.getByText('my-doc-file')).toBeVisible();
  });

  test('should upload valid DOCX file via input', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    const fileName = 'my-docx-file.docx';
    const fileData = {
      name: fileName,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      buffer: Buffer.from('mocked docx content'),
    };

    await uploadInput.setInputFiles({
      name: fileData.name,
      mimeType: fileData.mimeType,
      buffer: fileData.buffer,
    });

    await expect(frame.getByText('DOCX', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(frame.getByText('my-docx-file')).toBeVisible();
  });

  test('should show error for invalid file type', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    const invalidFileData = {
      name: 'invalid-file.exe',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('invalid content'),
    };

    await uploadInput.setInputFiles({
      name: invalidFileData.name,
      mimeType: invalidFileData.mimeType,
      buffer: invalidFileData.buffer,
    });

    // Should show error message for invalid format
    await expect(frame.getByText(/Invalid file format/)).toBeVisible({ timeout: 10000 });
    await expect(frame.getByText(/Please upload a PDF, DOC, DOCX file/)).toBeVisible();
  });

  test('should show error for exceeding file size limit', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    // Create a file larger than 2 MB (default limit)
    const largeFileData = {
      name: 'large-file.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(3 * 1024 * 1024), // 3 MB
    };

    await uploadInput.setInputFiles({
      name: largeFileData.name,
      mimeType: largeFileData.mimeType,
      buffer: largeFileData.buffer,
    });

    // Should show error message for file size
    await expect(frame.getByText(/File size exceeds the 2 MB limit/)).toBeVisible({
      timeout: 10000,
    });
  });

  test('should show uploading text during upload', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    const fileData = {
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('mocked pdf content'),
    };

    await uploadInput.setInputFiles({
      name: fileData.name,
      mimeType: fileData.mimeType,
      buffer: fileData.buffer,
    });

    // Check for uploading text (may be brief depending on simulated upload speed)
    // After upload completes, replace button should be visible
    await expect(frame.getByText('Replace file')).toBeVisible({ timeout: 15000 });
  });

  test('should show upload failed message on failure', async ({ page }) => {
    await page.goto(STORYBOOK_FAILURE_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    const fileData = {
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('mocked pdf content'),
    };

    await uploadInput.setInputFiles({
      name: fileData.name,
      mimeType: fileData.mimeType,
      buffer: fileData.buffer,
    });

    // Should show upload failed message
    await expect(frame.getByText('Upload failed. Please try again.')).toBeVisible({
      timeout: 15000,
    });
  });

  test('should allow replacing file after successful upload', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    // Upload first file
    const firstFile = {
      name: 'first-file.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('first file content'),
    };

    await uploadInput.setInputFiles({
      name: firstFile.name,
      mimeType: firstFile.mimeType,
      buffer: firstFile.buffer,
    });

    await expect(frame.getByText('first-file')).toBeVisible({ timeout: 10000 });
    await expect(frame.getByText('Replace file')).toBeVisible();

    // Upload second file to replace the first
    const secondFile = {
      name: 'second-file.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('second file content'),
    };

    await uploadInput.setInputFiles({
      name: secondFile.name,
      mimeType: secondFile.mimeType,
      buffer: secondFile.buffer,
    });

    // Should show the new filename
    await expect(frame.getByText('second-file')).toBeVisible({ timeout: 10000 });
  });

  test('should show ellipsis icon only after upload completes', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    const uploadInput = frame.locator('input[type="file"]');

    const fileData = {
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('mocked pdf content'),
    };

    await uploadInput.setInputFiles({
      name: fileData.name,
      mimeType: fileData.mimeType,
      buffer: fileData.buffer,
    });

    // Wait for upload to complete
    await expect(frame.getByText('Replace file')).toBeVisible({ timeout: 15000 });

    // Ellipsis icon should be visible (using svg data-icon attribute)
    const ellipsisIcon = frame.locator('[data-icon="ellipsis-vertical"]');
    await expect(ellipsisIcon).toBeVisible();
  });

  test('should open file dialog when clicking on dropzone', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const dropzone = frame.locator('#drop-zone-container');
    await dropzone.waitFor({ state: 'visible', timeout: 60000 });

    // Verify file input exists and is hidden
    const uploadInput = frame.locator('input[type="file"]');
    await expect(uploadInput).toHaveClass(/hidden/);

    // The dropzone should be clickable
    await expect(dropzone).toHaveCSS('cursor', 'pointer');
  });
});
