import { expect, test } from '@playwright/test';

test.describe('Chip component in Storybook', () => {
  test('renders Basic Chip correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--basic-chip');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chip = frame.locator('.MuiChip-label');
    await chip.waitFor({ state: 'visible', timeout: 60000 });
    const chipText = await chip.textContent();
    expect(chipText).toContain('Filled Chip');
  });

  test('renders Outlined Chip correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--outlined');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chip = frame.locator('.MuiChip-label');
    await chip.waitFor({ state: 'visible', timeout: 60000 });
    const chipText = await chip.textContent();
    expect(chipText).toContain('Outlined Chip');
  });

  test('renders Chip Colors correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--colors');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chips = frame.locator('.MuiChip-label');
    await chips.first().waitFor({ state: 'visible', timeout: 60000 });
    const chipLabels = await chips.allTextContents();
    const expectedLabels = [
      'Default',
      'Primary',
      'Secondary',
      'Error',
      'Info',
      'Success',
      'Warning',
    ];
    expect(chipLabels).toEqual(expect.arrayContaining(expectedLabels));
  });

  test('renders Chip Sizes correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--sizes');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chips = frame.locator('.MuiChip-label');
    await chips.first().waitFor({ state: 'visible', timeout: 60000 });
    const chipLabels = await chips.allTextContents();
    const expectedLabels = ['Small', 'Medium'];
    expect(chipLabels).toEqual(expect.arrayContaining(expectedLabels));
  });

  test('renders Chip with Icon correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--with-icon');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chip = frame.locator('.MuiChip-label');
    await chip.waitFor({ state: 'visible', timeout: 60000 });
    const chipText = await chip.textContent();
    expect(chipText).toContain('Chip with Icon');
  });

  test('renders Chip with Avatar correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--with-avatar');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chips = frame.locator('.MuiChip-label');
    await chips.first().waitFor({ state: 'visible', timeout: 60000 });
    const chipLabels = await chips.allTextContents();
    const expectedLabels = ['Avatar (Letter)', 'Avatar (Image)'];
    expect(chipLabels).toEqual(expect.arrayContaining(expectedLabels));
  });

  test('renders Chip with onDelete correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--on-delete');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chips = frame.locator('.MuiChip-label');
    await chips.first().waitFor({ state: 'visible', timeout: 60000 });
    const chipLabels = await chips.allTextContents();
    const expectedLabels = ['Default Delete', 'Custom Delete'];
    expect(chipLabels).toEqual(expect.arrayContaining(expectedLabels));
  });

  test('renders Clickable Chip correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--clickable');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chip = frame.locator('.MuiChip-label');
    await chip.waitFor({ state: 'visible', timeout: 60000 });
    const chipText = await chip.textContent();
    expect(chipText).toContain('Clickable');
  });

  test('renders Clickable and Deletable Chip correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--clickable-and-deletable');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chip = frame.locator('.MuiChip-label');
    await chip.waitFor({ state: 'visible', timeout: 60000 });
    const chipText = await chip.textContent();
    expect(chipText).toContain('Clickable and Deletable');
  });

  test('renders Clickable Link Chip correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--clickable-link');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chip = frame.locator('.MuiChip-label');
    await chip.waitFor({ state: 'visible', timeout: 60000 });
    const chipText = await chip.textContent();
    expect(chipText).toContain('Clickable Link');
  });

  test('renders Chip Array correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--chip-array');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chips = frame.locator('.MuiChip-label');
    await chips.first().waitFor({ state: 'visible', timeout: 60000 });
    const chipLabels = await chips.allTextContents();
    const expectedLabels = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7'];
    expect(chipLabels).toEqual(expect.arrayContaining(expectedLabels));
  });

  test('renders empty chip state correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-chip--empty-chip');
    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const chips = frame.locator('.MuiChip-label');
    const chipCount = await chips.count();
    expect(chipCount).toBe(0); // Expect no chips to be rendered
  });
});
