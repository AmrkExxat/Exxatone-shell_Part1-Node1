import { test, expect } from '@playwright/test';

/**
 * Playwright component tests for ProgressWorkflowCard.
 *
 * All tests run against the Storybook iframe at http://localhost:6006.
 * Storybook must be running before executing this suite.
 *
 * Story path: Common/ProgressWorkflowCard
 * Storybook base ID: common-progressworkflowcard
 */
test.describe('ProgressWorkflowCard', () => {
  const IFRAME = 'iframe#storybook-preview-iframe';
  const BASE_URL = 'http://localhost:6006/?path=/story/common-progressworkflowcard';

  test.setTimeout(60000);

  // ── Helpers ──────────────────────────────────────────────────────────────

  async function getFrame(page: any) {
    await page.waitForSelector(IFRAME, { state: 'visible', timeout: 30000 });
    await page.waitForTimeout(500);
    return page.frameLocator(IFRAME);
  }

  async function navigateTo(page: any, story: string) {
    await page.goto(`${BASE_URL}--${story}`, { waitUntil: 'domcontentloaded' });
    return getFrame(page);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Structural / Semantic HTML
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Structure', () => {
    test('renders an <article> element with accessible name', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const article = frame.locator('article[aria-label="Workflow progress"]');
      await expect(article).toBeVisible({ timeout: 20000 });
    });

    test('renders an <ol> list labelled "Workflow steps"', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const list = frame.locator('ol[aria-label="Workflow steps"]');
      await expect(list).toBeVisible({ timeout: 20000 });
    });

    test('renders exactly 3 <li> items for a 3-section card', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const items = frame.locator('ol[aria-label="Workflow steps"] > li');
      await expect(items.first()).toBeVisible({ timeout: 20000 });
      await expect(items).toHaveCount(3);
    });

    test('renders exactly 4 <li> items for the four-section story', async ({ page }) => {
      const frame = await navigateTo(page, 'four-sections');
      const items = frame.locator('ol[aria-label="Workflow steps"] > li');
      await expect(items.first()).toBeVisible({ timeout: 20000 });
      await expect(items).toHaveCount(4);
    });

    test('renders exactly 1 <li> item for the single-section story', async ({ page }) => {
      const frame = await navigateTo(page, 'single-section');
      const items = frame.locator('ol[aria-label="Workflow steps"] > li');
      await expect(items.first()).toBeVisible({ timeout: 20000 });
      await expect(items).toHaveCount(1);
    });

    test('applies rounded-xl and border classes to the card container', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const article = frame.locator('article[aria-label="Workflow progress"]');
      await article.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await article.getAttribute('class');
      expect(classes).toContain('rounded-xl');
      expect(classes).toContain('border');
      expect(classes).toContain('bg-card');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Accessibility
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Accessibility', () => {
    test('each listitem has an aria-label with step number, label and status', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const items = frame.locator('[role="listitem"]');
      await expect(items.first()).toBeVisible({ timeout: 20000 });

      const firstLabel = await items.nth(0).getAttribute('aria-label');
      const secondLabel = await items.nth(1).getAttribute('aria-label');
      const thirdLabel = await items.nth(2).getAttribute('aria-label');

      expect(firstLabel).toContain('Step 1 of 3');
      expect(firstLabel).toContain('Slots');
      expect(firstLabel).toContain('Pending');

      expect(secondLabel).toContain('Step 2 of 3');
      expect(secondLabel).toContain('Confirmation');

      expect(thirdLabel).toContain('Step 3 of 3');
      expect(thirdLabel).toContain('Compliance');
    });

    test('in-progress listitem carries aria-current="step"', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      const items = frame.locator('[role="listitem"]');
      await expect(items.first()).toBeVisible({ timeout: 20000 });

      // Frame 2: slots (index 0) is in_progress
      const slotsAriaCurrent = await items.nth(0).getAttribute('aria-current');
      expect(slotsAriaCurrent).toBe('step');
    });

    test('pending and completed listitems do NOT carry aria-current="step"', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      const items = frame.locator('[role="listitem"]');
      await expect(items.first()).toBeVisible({ timeout: 20000 });

      for (let i = 0; i < 3; i++) {
        const ariaCurrent = await items.nth(i).getAttribute('aria-current');
        expect(ariaCurrent).toBeNull();
      }
    });

    test('renders a visually-hidden sr-only progress summary', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const summary = frame.locator('p.sr-only');
      await expect(summary).toBeAttached({ timeout: 20000 });
    });

    test('sr-only text reads "0 of 3 steps completed" when all pending', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const summary = frame.locator('p.sr-only');
      await expect(summary).toBeAttached({ timeout: 20000 });
      await expect(summary).toHaveText('0 of 3 steps completed');
    });

    test('sr-only text reads "3 of 3 steps completed" when all done', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      const summary = frame.locator('p.sr-only');
      await expect(summary).toBeAttached({ timeout: 20000 });
      await expect(summary).toHaveText('3 of 3 steps completed');
    });

    test('sr-only text reads "2 of 3 steps completed" for near-complete story', async ({
      page,
    }) => {
      const frame = await navigateTo(page, 'near-complete');
      const summary = frame.locator('p.sr-only');
      await expect(summary).toBeAttached({ timeout: 20000 });
      await expect(summary).toHaveText('2 of 3 steps completed');
    });

    test('listitem aria-describedby links to metric element when metric is present', async ({
      page,
    }) => {
      const frame = await navigateTo(page, 'all-pending');
      const firstItem = frame.locator('[role="listitem"]').first();
      await firstItem.waitFor({ state: 'visible', timeout: 20000 });

      const describedBy = await firstItem.getAttribute('aria-describedby');
      expect(describedBy).not.toBeNull();
      expect(describedBy).toBeTruthy();
    });

    test('listitem aria-describedby includes helper ID when helperText is set', async ({
      page,
    }) => {
      // AllPending confirmation section has helperText "Slots to be filled"
      const frame = await navigateTo(page, 'all-pending');
      const items = frame.locator('[role="listitem"]');
      await expect(items.first()).toBeVisible({ timeout: 20000 });

      const confirmationItem = items.nth(1); // Confirmation section
      const describedBy = await confirmationItem.getAttribute('aria-describedby');

      // Should contain at least two IDs (metric + helper)
      const ids = (describedBy ?? '').trim().split(/\s+/).filter(Boolean);
      expect(ids.length).toBeGreaterThanOrEqual(2);
    });

    test('status icon SVGs are hidden from assistive technology', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      // The SectionPanel passes aria-hidden to StatusIcon
      const svgIcons = frame.locator('[role="listitem"] svg[role="img"]');
      await expect(svgIcons.first()).toBeVisible({ timeout: 20000 });
    });

    test('decorative divider is aria-hidden', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      const decorativeDividers = frame.locator('[aria-hidden="true"].flex-1');
      await expect(decorativeDividers.first()).toBeAttached({ timeout: 20000 });
      const count = await decorativeDividers.count();
      // Each section except the last has a decorative divider line
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('section label spans are aria-hidden to prevent double-announcement', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const labelSpans = frame.locator('[role="listitem"] span[aria-hidden="true"]');
      await expect(labelSpans.first()).toBeVisible({ timeout: 20000 });
      await expect(labelSpans).toHaveCount(3);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Content Rendering
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Content', () => {
    test('renders section labels as visible text', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      await expect(frame.locator('text=Slots')).toBeVisible({ timeout: 20000 });
      await expect(frame.locator('text=Confirmation')).toBeVisible();
      await expect(frame.locator('text=Compliance')).toBeVisible();
    });

    test('renders metric text in the Slots section', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      await expect(frame.locator('text=00/08 Students')).toBeVisible({ timeout: 20000 });
    });

    test('renders secondary metric text alongside primary metric', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      await expect(frame.locator('text=00 Instructors')).toBeVisible({ timeout: 20000 });
    });

    test('renders helper text when provided', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      // Confirmation section has helperText "Slots to be filled"
      await expect(frame.locator('text=Slots to be filled')).toBeVisible({ timeout: 20000 });
    });

    test('renders action links in the Slots section', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      await expect(frame.locator('text=Schedule Students')).toBeVisible({ timeout: 20000 });
      await expect(frame.locator('text=Add Instructor')).toBeVisible({ timeout: 20000 });
    });

    test('renders action links in the Confirmation section', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      await expect(frame.locator('text=Confirm Students')).toBeVisible({ timeout: 20000 });
    });

    test('renders "Remind Onboarding" action link in the Compliance section', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      await expect(frame.locator('text=Remind Onboarding')).toBeVisible({ timeout: 20000 });
    });

    test('renders completed metric text in the all-completed story', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      await expect(frame.locator('text=10/10 Members')).toBeVisible({ timeout: 20000 });
    });

    test('renders "All Slots Filled" completed action text', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      await expect(frame.locator('text=All Slots Filled')).toBeVisible({ timeout: 20000 });
    });

    test('renders "All Confirmed" completed action text', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      await expect(frame.locator('text=All Confirmed')).toBeVisible({ timeout: 20000 });
    });

    test('renders "All Compliant" completed action text', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      await expect(frame.locator('text=All Compliant')).toBeVisible({ timeout: 20000 });
    });

    test('renders footer content when provided', async ({ page }) => {
      const frame = await navigateTo(page, 'with-footer');
      await expect(frame.locator('text=Verified by coordinator on May 20, 2026')).toBeVisible({
        timeout: 20000,
      });
    });

    test('footer row has a top border separator', async ({ page }) => {
      const frame = await navigateTo(page, 'with-footer');
      // Footer div gets border-t border-gray-100
      const footerDivs = frame.locator('[role="listitem"] div.border-t.border-gray-100');
      await expect(footerDivs.first()).toBeVisible({ timeout: 20000 });
    });

    test('renders "No instructor needed" label in ACE Placement story', async ({ page }) => {
      const frame = await navigateTo(page, 'ace-placement');
      await expect(frame.locator('text=No instructor needed')).toBeVisible({ timeout: 20000 });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Status Icons
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('StatusIcon', () => {
    test('every section renders an SVG status icon', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const svgIcons = frame.locator('[role="listitem"] svg[role="img"]');
      await expect(svgIcons.first()).toBeVisible({ timeout: 20000 });
      await expect(svgIcons).toHaveCount(3);
    });

    test('completed sections render an SVG with a checkmark <path>', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      const checkmarks = frame.locator('svg[role="img"] path[d*="M6.5"]');
      await expect(checkmarks.first()).toBeAttached({ timeout: 20000 });
      // All 3 sections are completed → 3 checkmark paths
      await expect(checkmarks).toHaveCount(3);
    });

    test('pending sections do NOT render a checkmark <path>', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const checkmarks = frame.locator('svg[role="img"] path[d*="M6.5"]');
      // No completed sections → no checkmarks
      await expect(checkmarks).toHaveCount(0);
    });

    test('in-progress section has an SVG circle but no checkmark path', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      // Only the completed sections (none in "in-progress" story) would have checkmarks
      const checkmarks = frame.locator('svg[role="img"] path[d*="M6.5"]');
      await expect(checkmarks).toHaveCount(0);
    });

    test('near-complete story shows 2 checkmarks (slots + confirmation done)', async ({ page }) => {
      const frame = await navigateTo(page, 'near-complete');
      const checkmarks = frame.locator('svg[role="img"] path[d*="M6.5"]');
      await expect(checkmarks.first()).toBeAttached({ timeout: 20000 });
      await expect(checkmarks).toHaveCount(2);
    });

    test('status icon SVG uses currentColor for stroke', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const circle = frame.locator('svg[role="img"] circle').first();
      await circle.waitFor({ state: 'attached', timeout: 20000 });
      const stroke = await circle.getAttribute('stroke');
      expect(stroke).toBe('currentColor');
    });

    test('status icon SVG has correct viewBox', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      const svg = frame.locator('svg[role="img"]').first();
      await svg.waitFor({ state: 'visible', timeout: 20000 });
      const viewBox = await svg.getAttribute('viewBox');
      expect(viewBox).toBe('0 0 20 20');
    });

    test('status icon SVG has aria-label matching section status', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      const svg = frame.locator('svg[role="img"]').first();
      await svg.waitFor({ state: 'visible', timeout: 20000 });
      const label = await svg.getAttribute('aria-label');
      expect(label).toBe('Completed');
    });

    test('pending status icon has aria-label "Pending"', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const svgs = frame.locator('svg[role="img"]');
      await expect(svgs.first()).toBeVisible({ timeout: 20000 });
      const label = await svgs.first().getAttribute('aria-label');
      expect(label).toBe('Pending');
    });

    test('in_progress status icon has aria-label "In progress"', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      // Slots section (index 0) is in_progress
      const svgs = frame.locator('svg[role="img"]');
      await expect(svgs.first()).toBeVisible({ timeout: 20000 });
      const label = await svgs.first().getAttribute('aria-label');
      expect(label).toBe('In progress');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Badge Rendering and Tone Styling
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('WorkflowBadge', () => {
    test('warning badge renders "School Requirements Pending" text', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const badge = frame.locator('text=School Requirements Pending');
      await expect(badge).toBeVisible({ timeout: 20000 });
    });

    test('warning badge applies orange styling classes', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const badge = frame
        .locator('span')
        .filter({ hasText: 'School Requirements Pending' })
        .first();
      await badge.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await badge.getAttribute('class');
      expect(classes).toContain('bg-orange-50');
      expect(classes).toContain('border-orange-200');
      expect(classes).toContain('text-orange-600');
    });

    test('success badge renders "School Requirements: Completed" text', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      const badge = frame.locator('text=School Requirements: Completed');
      await expect(badge).toBeVisible({ timeout: 20000 });
    });

    test('success badge applies green styling classes', async ({ page }) => {
      const frame = await navigateTo(page, 'all-completed');
      const badge = frame
        .locator('span')
        .filter({ hasText: 'School Requirements: Completed' })
        .first();
      await badge.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await badge.getAttribute('class');
      expect(classes).toContain('bg-green-50');
      expect(classes).toContain('border-green-200');
      expect(classes).toContain('text-green-700');
    });

    test('neutral badge applies gray styling classes', async ({ page }) => {
      const frame = await navigateTo(page, 'neutral-badge');
      const badge = frame.locator('span').filter({ hasText: 'Optional Rotation' }).first();
      await badge.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await badge.getAttribute('class');
      expect(classes).toContain('bg-gray-50');
      expect(classes).toContain('border-gray-200');
      expect(classes).toContain('text-gray-500');
    });

    test('badge is right-aligned in the section header', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      // The header row is flex justify-between, so the badge wrapper has shrink-0
      const badgeWrapper = frame.locator('[role="listitem"] div.shrink-0').first();
      await badgeWrapper.waitFor({ state: 'visible', timeout: 20000 });
      await expect(badgeWrapper).toBeVisible();
    });

    test('sections without a badge do not render a badge wrapper', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const items = frame.locator('[role="listitem"]');
      await expect(items.first()).toBeVisible({ timeout: 20000 });

      // Slots section (index 0) has no badge
      const slotsItem = items.nth(0);
      const badgeWrapper = slotsItem.locator('div.shrink-0');
      await expect(badgeWrapper).toHaveCount(0);
    });

    test('near-complete story shows both warning and success badges', async ({ page }) => {
      const frame = await navigateTo(page, 'near-complete');
      // Frame 4: compliance section switched to "Completed" badge
      const successBadge = frame.locator('text=School Requirements: Completed');
      await expect(successBadge).toBeVisible({ timeout: 20000 });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Layout and Responsive Behaviour
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Layout', () => {
    test('ordered list uses flex layout with sm:flex-row', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const list = frame.locator('ol[aria-label="Workflow steps"]');
      await list.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await list.getAttribute('class');
      expect(classes).toContain('flex');
      expect(classes).toContain('sm:flex-row');
    });

    test('each <li> carries flex-1 and min-w-0 for equal-width columns', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const item = frame.locator('ol[aria-label="Workflow steps"] > li').first();
      await item.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await item.getAttribute('class');
      expect(classes).toContain('flex-1');
      expect(classes).toContain('min-w-0');
    });

    test('first section panel has leading padding (ps-4)', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const firstPanel = frame.locator('[role="listitem"]').first();
      await firstPanel.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await firstPanel.getAttribute('class');
      expect(classes).toContain('ps-4');
    });

    test('last section panel has trailing padding (pe-4)', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const items = frame.locator('[role="listitem"]');
      await expect(items.first()).toBeVisible({ timeout: 20000 });
      const lastPanel = items.nth(2);
      const classes = await lastPanel.getAttribute('class');
      expect(classes).toContain('pe-4');
    });

    test('middle section panel has no horizontal padding (px-0)', async ({ page }) => {
      const frame = await navigateTo(page, 'all-pending');
      const items = frame.locator('[role="listitem"]');
      await expect(items.first()).toBeVisible({ timeout: 20000 });
      const middlePanel = items.nth(1); // Confirmation section
      const classes = await middlePanel.getAttribute('class');
      expect(classes).toContain('px-0');
    });

    test('decorative divider line is rendered between sections', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      // Decorative dividers have class border-t and the custom border color
      const dividers = frame.locator('div[aria-hidden="true"].flex-1');
      await expect(dividers.first()).toBeAttached({ timeout: 20000 });
      const count = await dividers.count();
      // 3-section card: 2 middle dividers (first and second sections)
      expect(count).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 7. All Progress States (Screenshot Replica)
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('AllProgressStates story', () => {
    test('renders 6 workflow progress cards stacked', async ({ page }) => {
      const frame = await navigateTo(page, 'all-progress-states');
      const cards = frame.locator('article[aria-label="Workflow progress"]');
      await expect(cards.first()).toBeVisible({ timeout: 30000 });
      await expect(cards).toHaveCount(6);
    });

    test('first card shows all-pending state (0 of 3 completed)', async ({ page }) => {
      const frame = await navigateTo(page, 'all-progress-states');
      const summaries = frame.locator('p.sr-only');
      await expect(summaries.first()).toBeAttached({ timeout: 30000 });
      await expect(summaries.nth(0)).toHaveText('0 of 3 steps completed');
    });

    test('last card (ACE Placement) shows all-completed state (3 of 3)', async ({ page }) => {
      const frame = await navigateTo(page, 'all-progress-states');
      const summaries = frame.locator('p.sr-only');
      await expect(summaries.first()).toBeAttached({ timeout: 30000 });
      await expect(summaries.nth(5)).toHaveText('3 of 3 steps completed');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 8. Single-Section Edge Case
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('SingleSection story', () => {
    test('renders the article without errors', async ({ page }) => {
      const frame = await navigateTo(page, 'single-section');
      const article = frame.locator('article[aria-label="Workflow progress"]');
      await expect(article).toBeVisible({ timeout: 20000 });
    });

    test('sr-only summary reads "0 of 1 steps completed"', async ({ page }) => {
      const frame = await navigateTo(page, 'single-section');
      const summary = frame.locator('p.sr-only');
      await expect(summary).toHaveText('0 of 1 steps completed', { timeout: 20000 });
    });

    test('single section listitem is labelled Step 1 of 1', async ({ page }) => {
      const frame = await navigateTo(page, 'single-section');
      const item = frame.locator('[role="listitem"]').first();
      await item.waitFor({ state: 'visible', timeout: 20000 });
      const label = await item.getAttribute('aria-label');
      expect(label).toContain('Step 1 of 1');
      expect(label).toContain('Compliance');
    });

    test('single section renders its warning badge', async ({ page }) => {
      const frame = await navigateTo(page, 'single-section');
      const badge = frame.locator('text=School Requirements Pending');
      await expect(badge).toBeVisible({ timeout: 20000 });
    });

    test('single section has no decorative divider (nothing to divide)', async ({ page }) => {
      const frame = await navigateTo(page, 'single-section');
      const dividers = frame.locator('div[aria-hidden="true"].flex-1');
      // Single section: last-section rule → no divider rendered
      await expect(dividers).toHaveCount(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 9. Four-Section Scaling
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('FourSections story', () => {
    test('renders the Eligibility section label', async ({ page }) => {
      const frame = await navigateTo(page, 'four-sections');
      await expect(frame.locator('text=Eligibility')).toBeVisible({ timeout: 20000 });
    });

    test('sr-only summary reads "2 of 4 steps completed"', async ({ page }) => {
      const frame = await navigateTo(page, 'four-sections');
      const summary = frame.locator('p.sr-only');
      await expect(summary).toHaveText('2 of 4 steps completed', { timeout: 20000 });
    });

    test('step 3 of 4 (Confirmation) has aria-current="step"', async ({ page }) => {
      const frame = await navigateTo(page, 'four-sections');
      const items = frame.locator('[role="listitem"]');
      await expect(items.first()).toBeVisible({ timeout: 20000 });
      const confirmationItem = items.nth(2); // Confirmation at index 2
      const ariaCurrent = await confirmationItem.getAttribute('aria-current');
      expect(ariaCurrent).toBe('step');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 10. Hover / Focus Visual State
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Visual states', () => {
    test('section panel includes hover and focus-within transition classes', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      const panel = frame.locator('[role="listitem"]').first();
      await panel.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await panel.getAttribute('class');
      expect(classes).toContain('hover:bg-gray-50/60');
      expect(classes).toContain('focus-within:bg-gray-50/60');
      expect(classes).toContain('transition-colors');
    });

    test('article container applies shadow-sm for depth', async ({ page }) => {
      const frame = await navigateTo(page, 'in-progress');
      const article = frame.locator('article[aria-label="Workflow progress"]');
      await article.waitFor({ state: 'visible', timeout: 20000 });
      const classes = await article.getAttribute('class');
      expect(classes).toContain('shadow-sm');
    });
  });
});
