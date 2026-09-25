import { test, expect } from '@playwright/test';

test.describe('BreadCrumbs Component', () => {
  test('Default Breadcrumb', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-breadcrumbs--default');
    const frame = page.frameLocator('iframe#storybook-preview-iframe');

    const breadcrumbsContainer = frame.locator('nav');

    await breadcrumbsContainer.waitFor({ state: 'visible', timeout: 60000 });

    const breadcrumbItems = breadcrumbsContainer.locator('li');

    const itemCount = await breadcrumbItems.count();
    expect(itemCount).toBe(3); // Update based on expected number of items

    //test separtor icon
    for (let i = 0; i < itemCount - 1; i++) {
      const separator = await breadcrumbsContainer.locator('#separator_icon').nth(i);
      await expect(separator).toBeVisible();
      await expect(separator).toHaveAttribute('data-icon', 'chevron-right');
    }

    // Check the first breadcrumb item
    const firstItem = breadcrumbItems.nth(0);
    const firstItemLink = firstItem.locator('a');
    expect(await firstItemLink.textContent()).toBe('Home');
    await firstItemLink.click();
    expect(await firstItemLink).toHaveAttribute('aria-current', 'page');
    const firstItemText = frame.locator('#metaInformation');
    expect(await firstItemText.textContent()).toBe('Welcome to our website!');

    // Check the second breadcrumb item
    const secondItem = breadcrumbItems.nth(1);
    const secondItemLink = secondItem.locator('a');
    expect(await secondItemLink.textContent()).toBe('Products');
    await secondItemLink.click();
    const firstItemCurrentValue = await firstItemLink.getAttribute('aria-current');
    expect(firstItemCurrentValue).toBeNull();
    expect(await secondItemLink).toHaveAttribute('aria-current', 'page');
    const secondItemText = frame.locator('#metaInformation');
    expect(await secondItemText.textContent()).toBe('Browse our product categories.');

    // Check the third breadcrumb item ( no link)
    const thirdItem = breadcrumbItems.nth(2);
    const thirdItemLink = thirdItem.locator('.text-sm');
    expect(await thirdItemLink.textContent()).toBe('Electronics');
    expect(await thirdItemLink.getAttribute('href')).toBeNull();
    await thirdItemLink.click();
    const thirdItemText = frame.locator('#metaInformation');
    expect(await thirdItemText.textContent()).toBe('Here you can find the latest electronics.');
  });

  test('Custom Separator Text BreadCrumbs', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-breadcrumbs--custom-separator-text');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const breadcrumbsContainer = frame.locator('nav');

    await breadcrumbsContainer.waitFor({ state: 'visible', timeout: 60000 });

    const breadcrumbItems = breadcrumbsContainer.locator('li');

    const itemCount = await breadcrumbItems.count();
    expect(itemCount).toBe(3); // Update based on expected number of items

    //test separtor icon
    for (let i = 0; i < itemCount - 1; i++) {
      const separator = await breadcrumbsContainer.locator('#separator_icon').nth(i);
      await expect(separator).toBeVisible();
      await expect(separator).toHaveText('|');
    }

    // Check the first breadcrumb item
    const firstItem = breadcrumbItems.nth(0);
    const firstItemLink = firstItem.locator('a');
    expect(await firstItemLink.textContent()).toBe('Home');
    await firstItemLink.click();

    // Check the second breadcrumb item
    const secondItem = breadcrumbItems.nth(1);
    const secondItemLink = secondItem.locator('a');
    expect(await secondItemLink.textContent()).toBe('Products');
    await secondItemLink.click();

    // Check the third breadcrumb item ( no link)
    const thirdItem = breadcrumbItems.nth(2);
    const thirdItemLink = thirdItem.locator('.text-sm');
    expect(await thirdItemLink.textContent()).toBe('Electronics');
    expect(await thirdItemLink.getAttribute('href')).toBeNull();
    await thirdItemLink.click();
  });

  test('Custom Separator Icon BreadCrumbs', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-breadcrumbs--custom-separator-icon');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const breadcrumbsContainer = frame.locator('nav');

    await breadcrumbsContainer.waitFor({ state: 'visible', timeout: 60000 });

    const breadcrumbItems = breadcrumbsContainer.locator('li');

    const itemCount = await breadcrumbItems.count();
    expect(itemCount).toBe(3); // Update based on expected number of items

    //test separtor icon
    for (let i = 0; i < itemCount - 1; i++) {
      const separator = await breadcrumbsContainer.locator('#separator_icon').nth(i);
      await expect(separator).toBeVisible();
      await expect(separator).toHaveAttribute('data-icon', 'arrow-right');
    }

    // Check the first breadcrumb item
    const firstItem = breadcrumbItems.nth(0);
    const firstItemLink = firstItem.locator('a');
    expect(await firstItemLink.textContent()).toBe('Home');
    await firstItemLink.click();

    // Check the second breadcrumb item
    const secondItem = breadcrumbItems.nth(1);
    const secondItemLink = secondItem.locator('a');
    expect(await secondItemLink.textContent()).toBe('Products');
    await secondItemLink.click();

    // Check the third breadcrumb item ( no link)
    const thirdItem = breadcrumbItems.nth(2);
    const thirdItemLink = thirdItem.locator('.text-sm');
    expect(await thirdItemLink.textContent()).toBe('Electronics');
    expect(await thirdItemLink.getAttribute('href')).toBeNull();
    await thirdItemLink.click();
  });

  test('Custom Separator Icon-Text BreadCrumbs', async ({ page }) => {
    await page.goto(
      'http://localhost:6006/?path=/story/common-breadcrumbs--custom-separator-icon-text'
    );

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const breadcrumbsContainer = frame.locator('nav');

    await breadcrumbsContainer.waitFor({ state: 'visible', timeout: 60000 });

    const breadcrumbItems = breadcrumbsContainer.locator('li');

    const itemCount = await breadcrumbItems.count();
    expect(itemCount).toBe(3); // Update based on expected number of items

    //test separtor icon
    for (let i = 0; i < itemCount - 1; i++) {
      const separator_icon = await breadcrumbsContainer.locator('#separator_icon').nth(i);
      await expect(separator_icon).toBeVisible();
      await expect(separator_icon).toHaveAttribute('data-icon', 'chevron-down');

      const separator_text = await breadcrumbsContainer.locator('#separator_text').nth(i);
      await expect(separator_text).toBeVisible();
      await expect(separator_text).toHaveText('Next');
    }

    // Check the first breadcrumb item
    const firstItem = breadcrumbItems.nth(0);
    const firstItemLink = firstItem.locator('a');
    expect(await firstItemLink.textContent()).toBe('Home');
    await firstItemLink.click();

    // Check the second breadcrumb item
    const secondItem = breadcrumbItems.nth(1);
    const secondItemLink = secondItem.locator('a');
    expect(await secondItemLink.textContent()).toBe('Products');
    await secondItemLink.click();

    // Check the third breadcrumb item ( no link)
    const thirdItem = breadcrumbItems.nth(2);
    const thirdItemLink = thirdItem.locator('.text-sm');
    expect(await thirdItemLink.textContent()).toBe('Electronics');
    expect(await thirdItemLink.getAttribute('href')).toBeNull();
    await thirdItemLink.click();
  });

  test('With Meta Information BreadCrumbs', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/common-breadcrumbs--with-meta-information');

    const frame = await page.frameLocator('iframe#storybook-preview-iframe');
    const breadcrumbsContainer = frame.locator('nav');

    await breadcrumbsContainer.waitFor({ state: 'visible', timeout: 60000 });

    const breadcrumbItems = breadcrumbsContainer.locator('li');

    const itemCount = await breadcrumbItems.count();
    expect(itemCount).toBe(3); // Update based on expected number of items

    //test separtor icon
    for (let i = 0; i < itemCount - 1; i++) {
      const separator = await breadcrumbsContainer.locator('#separator_icon').nth(i);
      await expect(separator).toBeVisible();
      await expect(separator).toHaveAttribute('data-icon', 'chevron-right');
    }

    // Check the first breadcrumb item
    const firstItem = breadcrumbItems.nth(0);
    const firstItemLink = firstItem.locator('a');
    expect(await firstItemLink.textContent()).toBe('Home');
    await firstItemLink.click();
    expect(await firstItemLink).toHaveAttribute('aria-current', 'page');
    const firstItemText = frame.locator('#metaInformation');
    expect(await firstItemText.textContent()).toBe('Welcome to our website!');

    // Check the second breadcrumb item
    const secondItem = breadcrumbItems.nth(1);
    const secondItemLink = secondItem.locator('a');
    expect(await secondItemLink.textContent()).toBe('Products');
    await secondItemLink.click();
    const firstItemCurrentValue = await firstItemLink.getAttribute('aria-current');
    expect(firstItemCurrentValue).toBeNull();
    expect(await secondItemLink).toHaveAttribute('aria-current', 'page');
    const secondItemText = frame.locator('#metaInformation');
    expect(await secondItemText.textContent()).toBe('Browse our product categories.');

    // Check the third breadcrumb item ( no link)
    const thirdItem = breadcrumbItems.nth(2);
    const thirdItemLink = thirdItem.locator('.text-sm');
    expect(await thirdItemLink.textContent()).toBe('Electronics');
    expect(await thirdItemLink.getAttribute('href')).toBeNull();
    await thirdItemLink.click();
    const thirdItemText = frame.locator('#metaInformation');
    expect(await thirdItemText.textContent()).toBe('Here you can find the latest electronics.');
  });
});
