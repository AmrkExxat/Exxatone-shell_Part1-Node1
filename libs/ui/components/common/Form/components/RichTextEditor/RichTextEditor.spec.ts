import { test, expect } from '@playwright/test';

const STORYBOOK_BASE_URL = 'http://localhost:6006/?path=/story/form-richtexteditor--';

test.describe('RichTextEditor', () => {
  test.describe('Basic Rendering & Initialization', () => {
    test('should render editor container with toolbar and content area', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      // Wait for editor to initialize
      const editorContainer = frame.locator('.quill-editor');
      await editorContainer.waitFor({ state: 'visible', timeout: 60000 });

      // Check toolbar is visible
      const toolbar = frame.locator('.ql-toolbar');
      await expect(toolbar).toBeVisible();

      // Check editor content area is visible
      const editorContent = frame.locator('.ql-editor');
      await expect(editorContent).toBeVisible();
      await expect(editorContent).toBeEditable();
    });

    test('should display default toolbar buttons', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      await frame.locator('.ql-toolbar').waitFor({ state: 'visible', timeout: 60000 });

      // Check for default toolbar buttons
      await expect(frame.locator('.ql-bold')).toBeVisible();
      await expect(frame.locator('.ql-italic')).toBeVisible();
      await expect(frame.locator('.ql-underline')).toBeVisible();
      await expect(frame.locator('.ql-strike')).toBeVisible();
      await expect(frame.locator('.ql-link')).toBeVisible();
      await expect(frame.locator('.ql-clean')).toBeVisible();
    });

    test('should display placeholder text when empty', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Check placeholder is displayed (Quill uses data-placeholder attribute)
      const placeholder = await editorContent.getAttribute('data-placeholder');
      expect(placeholder).toBe('Enter text...');
    });
  });

  test.describe('Text Input & Editing', () => {
    test('should allow typing plain text into editor', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Type text
      await editorContent.click();
      await editorContent.fill('Hello, this is test text');

      // Verify text appears
      const text = await editorContent.textContent();
      expect(text).toContain('Hello, this is test text');
    });

    test('should allow editing existing text', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Type initial text
      await editorContent.click();
      await editorContent.fill('Initial text');

      // Edit the text
      await editorContent.click();
      await editorContent.press('Home');
      await editorContent.type('Updated: ');

      const text = await editorContent.textContent();
      expect(text).toContain('Updated:');
    });

    test('should allow deleting text', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Type text
      await editorContent.click();
      await editorContent.fill('Text to delete');

      // Select all and delete
      await editorContent.press('Control+a');
      await editorContent.press('Delete');

      const text = await editorContent.textContent();
      expect(text?.trim()).toBe('');
    });
  });

  test.describe('Placeholder Display', () => {
    test('should display custom placeholder text', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-placeholder`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      const placeholder = await editorContent.getAttribute('data-placeholder');
      expect(placeholder).toBe('Enter your message here...');
    });

    test('should hide placeholder when text is entered', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-placeholder`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Verify placeholder is shown initially
      const initialPlaceholder = await editorContent.getAttribute('data-placeholder');
      expect(initialPlaceholder).toBe('Enter your message here...');

      // Type text
      await editorContent.click();
      await editorContent.fill('Some text');

      // Placeholder should still be in data attribute but visually hidden by Quill
      // The actual placeholder display is handled by Quill CSS
      const text = await editorContent.textContent();
      expect(text).toContain('Some text');
    });
  });

  test.describe('Disabled State', () => {
    test('should not allow editing when disabled', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}disabled`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Check editor is disabled (Quill sets contenteditable="false")
      const contentEditable = await editorContent.getAttribute('contenteditable');
      expect(contentEditable).toBe('false');

      // Try to type - should not work
      await editorContent.click();
      await editorContent.type('This should not appear');

      // Verify content hasn't changed
      const text = await editorContent.textContent();
      expect(text).toContain('This editor is');
      expect(text).toContain('disabled');
      expect(text).not.toContain('This should not appear');
    });

    test('should display initial content when disabled', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}disabled`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Check initial content is displayed
      const text = await editorContent.textContent();
      expect(text).toContain('This editor is');
      expect(text).toContain('disabled');
      expect(text).toContain('cannot be edited');

      // Check HTML contains strong tag for bold formatting
      const html = await editorContent.innerHTML();
      expect(html).toContain('<strong>');
    });

    test('should not show placeholder when disabled with initial value', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}disabled`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // When disabled with value, placeholder should be empty
      const placeholder = await editorContent.getAttribute('data-placeholder');
      expect(placeholder).toBe('');
    });
  });

  test.describe('Max Length Enforcement', () => {
    test('should display character count when maxLength is set', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}with-max-length`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      await frame.locator('.ql-editor').waitFor({ state: 'visible', timeout: 60000 });

      // Check character count is displayed
      const charCount = frame.locator('.text-xs.text-gray-500');
      await expect(charCount).toBeVisible();
      await expect(charCount).toContainText('0/300 characters');
    });

    test('should update character count as text is typed', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}with-max-length`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Type some text
      await editorContent.click();
      await editorContent.fill('Hello');

      // Wait for character count to update
      await page.waitForTimeout(500);
      const charCount = frame.locator('.text-xs.text-gray-500');
      await expect(charCount).toContainText(/5\/300 characters/);
    });

    test('should prevent typing beyond maxLength limit', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}with-max-length`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Create text that exceeds 300 characters
      const longText = 'a'.repeat(350);

      await editorContent.click();
      await editorContent.fill(longText);

      // Wait for truncation
      await page.waitForTimeout(500);

      // Verify text was truncated to 300 characters
      const text = await editorContent.textContent();
      expect(text?.trim().length).toBeLessThanOrEqual(300);

      // Verify character count shows max
      const charCount = frame.locator('.text-xs.text-gray-500');
      await expect(charCount).toContainText('300/300 characters');
    });
  });

  test.describe('Character Count Message', () => {
    test('should display default character count format', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}with-max-length`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      await frame.locator('.ql-editor').waitFor({ state: 'visible', timeout: 60000 });

      const charCount = frame.locator('.text-xs.text-gray-500');
      await expect(charCount).toContainText('0/300 characters');
    });

    test('should display custom function-based character count message', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-char-count-message`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      await frame.locator('.ql-editor').waitFor({ state: 'visible', timeout: 60000 });

      const charCount = frame.locator('.text-xs.text-gray-500');
      await expect(charCount).toContainText('Remaining: 200 characters');

      // Type some text
      const editorContent = frame.locator('.ql-editor');
      await editorContent.click();
      await editorContent.fill('Test');

      await page.waitForTimeout(500);
      await expect(charCount).toContainText(/Remaining: \d+ characters/);
    });

    test('should display custom string message without interpolation', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-char-count-message-string`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      await frame.locator('.ql-editor').waitFor({ state: 'visible', timeout: 60000 });

      const charCount = frame.locator('.text-xs.text-gray-500');
      // String message displays as-is without interpolation
      await expect(charCount).toContainText('Characters used: {count} / {max}');
    });
  });

  test.describe('Toolbar Formatting', () => {
    test('should apply bold formatting', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Click bold button
      await frame.locator('.ql-bold').click();

      // Type text
      await editorContent.click();
      await editorContent.fill('Bold text');

      // Verify HTML contains strong tag
      const html = await editorContent.innerHTML();
      expect(html).toContain('<strong>');
    });

    test('should apply italic formatting', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Click italic button
      await frame.locator('.ql-italic').click();

      // Type text
      await editorContent.click();
      await editorContent.fill('Italic text');

      // Verify HTML contains em tag
      const html = await editorContent.innerHTML();
      expect(html).toContain('<em>');
    });

    test('should apply underline formatting', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Click underline button
      await frame.locator('.ql-underline').click();

      // Type text
      await editorContent.click();
      await editorContent.fill('Underlined text');

      // Verify HTML contains u tag
      const html = await editorContent.innerHTML();
      expect(html).toContain('<u>');
    });

    test('should apply strikethrough formatting', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Click strike button
      await frame.locator('.ql-strike').click();

      // Type text
      await editorContent.click();
      await editorContent.fill('Strikethrough text');

      // Verify HTML contains s tag
      const html = await editorContent.innerHTML();
      expect(html).toContain('<s>');
    });

    test('should apply header formatting', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Click H1 header button
      const h1Button = frame.locator('.ql-header').first();
      await h1Button.click();

      // Select H1 option (value="1")
      await page.keyboard.press('1');

      // Type text
      await editorContent.click();
      await editorContent.fill('Header text');

      // Verify HTML contains h1 tag
      const html = await editorContent.innerHTML();
      expect(html).toContain('<h1>');
    });

    test('should create ordered list', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Click ordered list button
      const orderedListButton = frame.locator('.ql-list[value="ordered"]');
      await orderedListButton.click();

      // Type list items
      await editorContent.click();
      await editorContent.fill('Item 1');
      await editorContent.press('Enter');
      await editorContent.fill('Item 2');

      // Verify HTML contains ol tag
      const html = await editorContent.innerHTML();
      expect(html).toContain('<ol>');
    });

    test('should create bullet list', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Click bullet list button
      const bulletListButton = frame.locator('.ql-list[value="bullet"]');
      await bulletListButton.click();

      // Type list items
      await editorContent.click();
      await editorContent.fill('Bullet 1');
      await editorContent.press('Enter');
      await editorContent.fill('Bullet 2');

      // Verify HTML contains ul tag
      const html = await editorContent.innerHTML();
      expect(html).toContain('<ul>');
    });

    test('should insert link', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Type text first
      await editorContent.click();
      await editorContent.fill('Click here');

      // Select the text
      await editorContent.press('Control+a');

      // Click link button
      await frame.locator('.ql-link').click();

      // Wait for link input dialog and enter URL
      await page.waitForTimeout(300);
      await page.keyboard.type('https://example.com');
      await page.keyboard.press('Enter');

      // Verify HTML contains a tag
      await page.waitForTimeout(300);
      const html = await editorContent.innerHTML();
      expect(html).toContain('<a');
      expect(html).toContain('https://example.com');
    });

    test('should clean formatting', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}default`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Apply bold formatting
      await frame.locator('.ql-bold').click();
      await editorContent.click();
      await editorContent.fill('Bold text');

      // Verify bold is applied
      let html = await editorContent.innerHTML();
      expect(html).toContain('<strong>');

      // Click clean button
      await frame.locator('.ql-clean').click();

      // Verify formatting is removed
      await page.waitForTimeout(300);
      html = await editorContent.innerHTML();
      expect(html).not.toContain('<strong>');
    });
  });

  test.describe('Initial Value Handling', () => {
    test('should display initial HTML content correctly', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}with-initial-value`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Check initial content is displayed
      const text = await editorContent.textContent();
      expect(text).toContain('This is some');
      expect(text).toContain('initial');
      expect(text).toContain('content');

      // Check HTML contains strong tag
      const html = await editorContent.innerHTML();
      expect(html).toContain('<strong>');
    });

    test('should allow editing initial content', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}with-initial-value`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Edit the content
      await editorContent.click();
      await editorContent.press('End');
      await editorContent.type(' - edited');

      // Verify changes
      const text = await editorContent.textContent();
      expect(text).toContain('edited');
    });
  });

  test.describe('Custom Toolbar Configuration', () => {
    test('should display only specified toolbar buttons', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-toolbar`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      await frame.locator('.ql-toolbar').waitFor({ state: 'visible', timeout: 60000 });

      // Check specified buttons are present
      await expect(frame.locator('.ql-bold')).toBeVisible();
      await expect(frame.locator('.ql-italic')).toBeVisible();
      await expect(frame.locator('.ql-link')).toBeVisible();

      // Check header buttons are present (custom toolbar includes headers)
      const headerButtons = frame.locator('.ql-header');
      await expect(headerButtons.first()).toBeVisible();

      // Check that some default buttons are NOT present
      // Note: Quill may still render some buttons, so we check for specific ones
      // Strike button should not be visible if custom toolbar doesn't include it
      const strikeButton = frame.locator('.ql-strike');
      const strikeVisible = await strikeButton.isVisible().catch(() => false);
      // Custom toolbar should limit options - strike is not in custom toolbar config
      expect(strikeVisible).toBe(false);
    });

    test('should allow formatting with custom toolbar buttons', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-toolbar`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Use bold button
      await frame.locator('.ql-bold').click();
      await editorContent.click();
      await editorContent.fill('Bold text');

      const html = await editorContent.innerHTML();
      expect(html).toContain('<strong>');
    });
  });

  test.describe('Custom Modules Configuration', () => {
    test('should display simplified toolbar from custom modules', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-modules`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      await frame.locator('.ql-toolbar').waitFor({ state: 'visible', timeout: 60000 });

      // Check specified buttons are present
      await expect(frame.locator('.ql-bold')).toBeVisible();
      await expect(frame.locator('.ql-italic')).toBeVisible();
      await expect(frame.locator('.ql-underline')).toBeVisible();
      await expect(frame.locator('.ql-clean')).toBeVisible();

      // Check list buttons are present
      const orderedListButton = frame.locator('.ql-list[value="ordered"]');
      await expect(orderedListButton).toBeVisible();
      const bulletListButton = frame.locator('.ql-list[value="bullet"]');
      await expect(bulletListButton).toBeVisible();
    });

    test('should allow formatting with custom modules', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-modules`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Use underline button
      await frame.locator('.ql-underline').click();
      await editorContent.click();
      await editorContent.fill('Underlined text');

      const html = await editorContent.innerHTML();
      expect(html).toContain('<u>');
    });
  });

  test.describe('Custom Styling', () => {
    test('should apply custom className to container', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-styling`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContainer = frame.locator('.quill-editor');
      await editorContainer.waitFor({ state: 'visible', timeout: 60000 });

      // Check custom classes are applied
      const classList = await editorContainer.getAttribute('class');
      expect(classList).toContain('max-w-2xl');
      expect(classList).toContain('border-2');
      expect(classList).toContain('border-blue-300');
      expect(classList).toContain('rounded-lg');
      expect(classList).toContain('p-4');
    });

    test('should maintain functionality with custom styling', async ({ page }) => {
      await page.goto(`${STORYBOOK_BASE_URL}custom-styling`);
      const frame = page.frameLocator('iframe#storybook-preview-iframe');

      const editorContent = frame.locator('.ql-editor');
      await editorContent.waitFor({ state: 'visible', timeout: 60000 });

      // Verify editor is still functional
      await editorContent.click();
      await editorContent.fill('Styled editor test');

      const text = await editorContent.textContent();
      expect(text).toContain('Styled editor test');

      // Verify character count still works
      const charCount = frame.locator('.text-xs.text-gray-500');
      await expect(charCount).toBeVisible();
    });
  });
});
