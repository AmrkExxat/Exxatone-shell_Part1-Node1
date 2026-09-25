import { test, expect } from '@playwright/test';

test('should upload files via input  ', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/form-fileupload--default');
  const frame = await page.frameLocator('iframe#storybook-preview-iframe');
  const uploadInput = frame.locator('#file-upload');
  await uploadInput.waitFor({ state: 'visible', timeout: 60000 });

  const fileName = 'file1.png';
  const fileData = {
    name: fileName,
    mimeType: 'image/png',
    buffer: Buffer.from('mocked file content'),
  };

  await uploadInput.setInputFiles({
    name: fileData.name,
    mimeType: fileData.mimeType,
    buffer: fileData.buffer,
  });

  await expect(frame.locator('.file-name').first()).toContainText(fileName);

  const fileName2 = 'file2.png';
  const fileData2 = {
    name: fileName2,
    mimeType: 'image/png',
    buffer: Buffer.from('mocked file content'),
  };

  await uploadInput.setInputFiles({
    name: fileData2.name,
    mimeType: fileData2.mimeType,
    buffer: fileData2.buffer,
  });
  await expect(frame.locator('.file-name').last()).toContainText(fileName2);
});

test('should show alert for invalid file type', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/form-fileupload--default');
  const frame = await page.frameLocator('iframe#storybook-preview-iframe');
  const uploadInput = frame.locator('#file-upload');

  const invalidFileData = {
    name: 'inValidFile.exe',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('invalid content'),
  };

  await uploadInput.setInputFiles({
    name: invalidFileData.name,
    mimeType: invalidFileData.mimeType,
    buffer: invalidFileData.buffer,
  });

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Invalid file format');
    await dialog.dismiss();
  });
});

test('should show alert for exceeding file size limit', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/form-fileupload--default');
  const frame = await page.frameLocator('iframe#storybook-preview-iframe');
  const uploadInput = frame.locator('#file-upload');

  const largeFileData = {
    name: 'largeFile.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.alloc(8 * 1024 * 1024),
  };

  await uploadInput.setInputFiles({
    name: largeFileData.name,
    mimeType: largeFileData.mimeType,
    buffer: largeFileData.buffer,
  });

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('File size exceeds the 7 MB limit');
    await dialog.dismiss();
  });
});

test('should delete file when trash icon is clicked', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/form-fileupload--default');
  const frame = await page.frameLocator('iframe#storybook-preview-iframe');
  const uploadInput = frame.locator('#file-upload');

  const fileName = 'file2.png';
  const fileData = {
    name: fileName,
    mimeType: 'image/png',
    buffer: Buffer.from('mocked file content'),
  };

  await uploadInput.setInputFiles({
    name: fileData.name,
    mimeType: fileData.mimeType,
    buffer: fileData.buffer,
  });

  const fileList = frame.locator('.file-name');
  await expect(fileList).toContainText(fileName);

  const deleteButton = frame.locator('.delete-button');
  await deleteButton.click();

  const fileCount = frame.locator('.file-name');
  await expect(fileCount).toHaveCount(0, { timeout: 10000 });
});
