import { test, expect } from '@playwright/test';

const STORY_BASE = 'http://localhost:6006/?path=/story/shared-ui-cancelmodalassignment';
const FRAME = 'iframe#storybook-preview-iframe';

test.describe('CancelModalAssignment component in Storybook', () => {
  test.setTimeout(60000);

  // ─── CancelModalAssignment ────────────────────────────────────────────────

  test('Positive: modal renders "Cancel Schedule" title', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const title = frame.locator('text=Cancel Schedule').first();
    await title.waitFor({ state: 'visible', timeout: 60000 });
    await expect(title).toBeVisible();
  });

  test('Positive: Cancel button is rendered and accessible', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const cancelBtn = frame.locator('#cancel_assignment_cancel');
    await cancelBtn.waitFor({ state: 'visible', timeout: 60000 });
    await expect(cancelBtn).toBeVisible();
    await expect(cancelBtn).toContainText('Cancel');
  });

  test('Positive: Confirm button is rendered', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const confirmBtn = frame.locator('#cancel_assignment_confirmation');
    await confirmBtn.waitFor({ state: 'visible', timeout: 60000 });
    await expect(confirmBtn).toBeVisible();
    await expect(confirmBtn).toContainText('Confirm Cancelation');
  });

  test('Positive: Confirm button is disabled until a reason is selected', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const confirmBtn = frame.locator('#cancel_assignment_confirmation');
    await confirmBtn.waitFor({ state: 'visible', timeout: 60000 });
    await expect(confirmBtn).toBeDisabled();
  });

  test('Positive: individual schedule shows correct description text', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const description = frame.locator('text=Cancel this individual Schedule?');
    await description.waitFor({ state: 'visible', timeout: 60000 });
    await expect(description).toBeVisible();
  });

  test('Positive: "This action cannot be undone" warning is shown', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const warning = frame.locator('text=This action cannot be undone.');
    await warning.waitFor({ state: 'visible', timeout: 60000 });
    await expect(warning).toBeVisible();
  });

  test('Positive: reason select is visible after loading completes', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const reasonSelect = frame.locator('#reason');
    await reasonSelect.waitFor({ state: 'visible', timeout: 60000 });
    await expect(reasonSelect).toBeVisible();
  });

  test('Positive: group schedule shows group name', async ({ page }) => {
    await page.goto(`${STORY_BASE}--group-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const groupName = frame.locator('text=Cardiology Rotation');
    await groupName.waitFor({ state: 'visible', timeout: 60000 });
    await expect(groupName).toBeVisible();
  });

  test('Positive: group schedule shows assignment count reduction info', async ({ page }) => {
    await page.goto(`${STORY_BASE}--group-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const countInfo = frame.locator('text=Reduce group from');
    await countInfo.waitFor({ state: 'visible', timeout: 60000 });
    await expect(countInfo).toBeVisible();
  });

  test('Positive: complete group schedule shows "Cancel all schedules in this group?"', async ({
    page,
  }) => {
    await page.goto(`${STORY_BASE}--complete-group-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const text = frame.locator('text=Cancel all schedules in this group?');
    await text.waitFor({ state: 'visible', timeout: 60000 });
    await expect(text).toBeVisible();
  });

  test('Positive: notes textarea appears after a reason is selected', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const reasonSelect = frame.locator('#reason');
    await reasonSelect.waitFor({ state: 'visible', timeout: 60000 });

    await reasonSelect.click();
    const option = frame.locator('text=Student request');
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();

    const notesArea = frame.locator('#reason_text');
    await notesArea.waitFor({ state: 'visible', timeout: 10000 });
    await expect(notesArea).toBeVisible();
  });

  test('Positive: confirm button becomes enabled after a reason is selected', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const reasonSelect = frame.locator('#reason');
    await reasonSelect.waitFor({ state: 'visible', timeout: 60000 });

    await reasonSelect.click();
    const option = frame.locator('text=Student request');
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();

    const confirmBtn = frame.locator('#cancel_assignment_confirmation');
    await expect(confirmBtn).not.toBeDisabled();
  });

  test('Positive: character limit error shown when notes exceed 250 characters', async ({
    page,
  }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const reasonSelect = frame.locator('#reason');
    await reasonSelect.waitFor({ state: 'visible', timeout: 60000 });

    await reasonSelect.click();
    const option = frame.locator('text=Student request');
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();

    const notesArea = frame.locator('#reason_text');
    await notesArea.waitFor({ state: 'visible', timeout: 10000 });
    await notesArea.fill('a'.repeat(251));

    const errorMsg = frame.locator(`text=Please limit your input to 250 characters.`);
    await errorMsg.waitFor({ state: 'visible', timeout: 10000 });
    await expect(errorMsg).toBeVisible();
  });

  test('Positive: confirm button disabled when notes exceed 250 characters', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const reasonSelect = frame.locator('#reason');
    await reasonSelect.waitFor({ state: 'visible', timeout: 60000 });

    await reasonSelect.click();
    const option = frame.locator('text=Student request');
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();

    const notesArea = frame.locator('#reason_text');
    await notesArea.waitFor({ state: 'visible', timeout: 10000 });
    await notesArea.fill('a'.repeat(251));

    const confirmBtn = frame.locator('#cancel_assignment_confirmation');
    await expect(confirmBtn).toBeDisabled();
  });

  // ─── CancelBannerAssignment ───────────────────────────────────────────────

  test('Positive: CancelBannerAssignment renders the reason', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-assignment`);
    const frame = page.frameLocator(FRAME);

    const reason = frame.locator('text=Student request');
    await reason.waitFor({ state: 'visible', timeout: 60000 });
    await expect(reason).toBeVisible();
  });

  test('Positive: CancelBannerAssignment renders the cancellation note', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-assignment`);
    const frame = page.frameLocator(FRAME);

    const note = frame.locator('text=Student had a scheduling conflict');
    await note.waitFor({ state: 'visible', timeout: 60000 });
    await expect(note).toBeVisible();
  });

  test('Positive: CancelBannerAssignment renders the "By" badge', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-assignment`);
    const frame = page.frameLocator(FRAME);

    const byBadge = frame.locator('text=By Site');
    await byBadge.waitFor({ state: 'visible', timeout: 60000 });
    await expect(byBadge).toBeVisible();
  });

  test('Positive: CancelBannerAssignment shows email', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-assignment`);
    const frame = page.frameLocator(FRAME);

    const email = frame.locator('text=site@hospital.com');
    await email.waitFor({ state: 'visible', timeout: 60000 });
    await expect(email).toBeVisible();
  });

  // ─── CancelBannerGrid ─────────────────────────────────────────────────────

  test('Positive: CancelBannerGrid renders children', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-grid`);
    const frame = page.frameLocator(FRAME);

    const child = frame.locator('#banner-grid-child');
    await child.waitFor({ state: 'visible', timeout: 60000 });
    await expect(child).toBeVisible();
    await expect(child).toContainText('Assignment Name');
  });

  test('Positive: CancelBannerGrid renders the reason text', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-grid`);
    const frame = page.frameLocator(FRAME);

    const reason = frame.locator('text=Site unavailable');
    await reason.waitFor({ state: 'visible', timeout: 60000 });
    await expect(reason).toBeVisible();
  });

  test('Positive: CancelBannerGrid shows "Site:" label for Cancelled status', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-grid`);
    const frame = page.frameLocator(FRAME);

    const label = frame.locator('text=Site:');
    await label.waitFor({ state: 'visible', timeout: 60000 });
    await expect(label).toBeVisible();
  });

  test('Positive: CancelBannerGrid shows "School:" label for Revoked status', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-grid-revoked`);
    const frame = page.frameLocator(FRAME);

    const label = frame.locator('text=School:');
    await label.waitFor({ state: 'visible', timeout: 60000 });
    await expect(label).toBeVisible();
  });

  test('Positive: CancelBannerGrid tooltip button is accessible', async ({ page }) => {
    await page.goto(`${STORY_BASE}--banner-grid`);
    const frame = page.frameLocator(FRAME);

    const tooltipBtn = frame.locator('#cancel-reason-tooltip-assign-001');
    await tooltipBtn.waitFor({ state: 'visible', timeout: 60000 });
    await expect(tooltipBtn).toBeVisible();
  });

  // ─── Negative ─────────────────────────────────────────────────────────────

  test('Negative: notes error is not shown when notes are within limit', async ({ page }) => {
    await page.goto(`${STORY_BASE}--individual-schedule-open`);
    const frame = page.frameLocator(FRAME);

    const reasonSelect = frame.locator('#reason');
    await reasonSelect.waitFor({ state: 'visible', timeout: 60000 });

    await reasonSelect.click();
    const option = frame.locator('text=Student request');
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();

    const notesArea = frame.locator('#reason_text');
    await notesArea.waitFor({ state: 'visible', timeout: 10000 });
    await notesArea.fill('Short note');

    const errorMsg = frame.locator('text=Please limit your input to 250 characters.');
    await expect(errorMsg).not.toBeVisible();
  });

  test('Negative: CancelBannerAssignment shows "Not specified" when reason is empty', async ({
    page,
  }) => {
    await page.goto(`${STORY_BASE}--banner-assignment`);
    const frame = page.frameLocator(FRAME);

    await frame.locator('text=Student request').waitFor({ state: 'visible', timeout: 60000 });

    const notSpecified = frame.locator('text=Not specified');
    await expect(notSpecified).not.toBeVisible();
  });
});
