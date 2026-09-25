import { test, expect } from '@playwright/test';

test.describe('AnimatedText component in Storybook', () => {
  const STORYBOOK_URL = 'http://localhost:6006/?path=/story';
  const IFRAME_SELECTOR = 'iframe#storybook-preview-iframe';

  async function getParagraph(page: any, storyPath: string) {
    await page.goto(`${STORYBOOK_URL}/${storyPath}`);
    const frame = page.frameLocator(IFRAME_SELECTOR);
    const paragraph = frame.locator('p').first();

    await paragraph.waitFor({ state: 'visible', timeout: 30000 });
    return { paragraph, frame };
  }

  test('Default story renders one span per character with animation class', async ({ page }) => {
    const { paragraph } = await getParagraph(page, 'common-animatedtext--default');
    const spans = paragraph.locator('.exxat-animated-text-char');

    const count = await spans.count();
    // "Animated text" => 13 characters including the space
    expect(count).toBe(13);

    const firstSpanClass = await spans.nth(0).getAttribute('class');
    expect(firstSpanClass).toContain('exxat-animated-text-char');
    expect(firstSpanClass).toContain('exxat-animated-text-char--linear');
  });

  test('Each character has an increasing animation delay', async ({ page }) => {
    const { paragraph } = await getParagraph(page, 'common-animatedtext--default');
    const spans = paragraph.locator('.exxat-animated-text-char');

    const firstStyle = await spans.nth(0).getAttribute('style');
    const secondStyle = await spans.nth(1).getAttribute('style');

    expect(firstStyle).toContain('animation-delay: 0ms');
    expect(secondStyle).toContain('animation-delay: 50ms');
  });

  test('Slow story uses larger delay per character', async ({ page }) => {
    const { paragraph } = await getParagraph(page, 'common-animatedtext--slow');
    const spans = paragraph.locator('.exxat-animated-text-char');

    const secondStyle = await spans.nth(1).getAttribute('style');
    expect(secondStyle).toContain('animation-delay: 150ms');
  });

  test('Custom class story applies the provided className', async ({ page }) => {
    const { paragraph } = await getParagraph(page, 'common-animatedtext--with-custom-class');

    const className = await paragraph.getAttribute('class');
    expect(className).toContain('text-primary');
    expect(className).toContain('text-lg');
    expect(className).toContain('font-semibold');
  });
});
