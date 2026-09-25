import { test, expect, FrameLocator } from '@playwright/test';

test.describe('Horizontal Stepper - Form Validation End-to-End', () => {
  let frame: FrameLocator;

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'http://localhost:6006/?path=/story/common-horizontalstepper--form-validation-example'
    );
    await page.getByRole('button', { name: 'Hide addons [alt A]' }).click();
    frame = page.locator('iframe[title="storybook-preview-iframe"]').contentFrame();
  });

  test('should complete multi-step form with validation and navigation', async () => {
    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (current step)" [selected]'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (not available)" [disabled]'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (not available)" [disabled]'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (not available)" [disabled]'
      - 'button "Go to next step: Professional Info" [disabled]'
    `);

    const step1Current = frame.locator('[data-testid="horizontal-stepper-step-0"]');
    await expect(step1Current.locator('.animate-ring-pulse')).toBeVisible();
    await expect(step1Current.locator('div[tabindex="0"]')).toHaveCSS(
      'background-color',
      'rgb(67, 85, 182)'
    );
    await expect(step1Current.locator('div[tabindex="0"]')).toHaveCSS(
      'border-color',
      'rgb(67, 85, 182)'
    );
    await expect(step1Current.locator('span[aria-hidden="true"]')).toHaveText('1');

    const step2Disabled = frame.locator('[data-testid="horizontal-stepper-step-1"]');
    await expect(step2Disabled.locator('div[tabindex="-1"]')).toHaveCSS(
      'background-color',
      'rgb(241, 233, 254)'
    );
    await expect(step2Disabled.locator('div[tabindex="-1"]')).toHaveCSS('opacity', '0.5');
    await expect(step2Disabled.locator('.cursor-not-allowed')).toBeVisible();

    await expect(frame.locator('#horizontal-step-panel-personal-info')).toMatchAriaSnapshot(`
      - 'tabpanel "Step 1 of 4: Personal Info. Enter your personal details (current step)"':
        - text: Full Name *
        - textbox "Enter your full name"
        - text: Email Address *
        - textbox "Enter your email address"
    `);

    await expect(
      frame.getByRole('button', { name: 'Go to next step: Professional Info' })
    ).toBeDisabled();

    await frame.getByRole('textbox', { name: 'Enter your full name' }).fill('Martin Scorsese');
    await frame
      .getByRole('textbox', { name: 'Enter your email address' })
      .fill('holyMartin@gmail.com');
    await expect(
      frame.getByRole('button', { name: 'Go to next step: Professional' })
    ).toBeEnabled();
    await frame.getByRole('button', { name: 'Go to next step: Professional' }).click();
    await expect(
      frame.getByRole('button', { name: 'Back to previous step: Personal Info' })
    ).toBeFocused();
    await frame.getByRole('button', { name: 'Back to previous step: Personal Info' }).click();
    await expect(
      frame.getByRole('button', { name: 'Go to next step: Professional Info' })
    ).toBeFocused();
    await frame.getByRole('button', { name: 'Go to next step: Professional Info' }).click();

    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (completed)"'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (current step)" [selected]'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (not available)" [disabled]'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (not available)" [disabled]'
      - 'button "Back to previous step: Personal Info"'
      - 'button "Go to next step: Preferences" [disabled]'
    `);

    const step1Completed = frame.locator('[data-testid="horizontal-stepper-step-0"]');
    await expect(step1Completed.locator('div[tabindex="0"]')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)'
    );
    await expect(step1Completed.locator('div[tabindex="0"]')).toHaveCSS(
      'border-color',
      'rgb(22, 163, 74)'
    );
    await expect(step1Completed.locator('svg.fa-check')).toBeVisible();
    await expect(step1Completed.locator('svg.fa-check')).toHaveCSS('color', 'rgb(22, 163, 74)');

    const step2Current = frame.locator('[data-testid="horizontal-stepper-step-1"]');
    await expect(step2Current.locator('.animate-ring-pulse')).toBeVisible();
    await expect(step2Current.locator('div[tabindex="0"]')).toHaveCSS(
      'background-color',
      'rgb(67, 85, 182)'
    );

    const step3Disabled = frame.locator('[data-testid="horizontal-stepper-step-2"]');
    await expect(step3Disabled.locator('div[tabindex="-1"]')).toHaveCSS('opacity', '0.5');
    await expect(step3Disabled.locator('.cursor-not-allowed')).toBeVisible();

    await expect(frame.locator('#horizontal-step-panel-professional-info')).toMatchAriaSnapshot(`
      - 'tabpanel "Step 2 of 4: Professional Info. Enter your work details (current step)"':
        - text: Company Name *
        - textbox "Enter your company name"
        - text: Position *
        - textbox "Enter your position"
    `);
    await expect(
      frame.getByRole('button', { name: 'Go to next step: Preferences' })
    ).toBeDisabled();

    await frame
      .getByRole('textbox', { name: 'Enter your company name' })
      .fill('Marshal Mathers LP 2');
    await frame.getByRole('textbox', { name: 'Enter your position' }).fill('Movie Director');

    await expect(frame.getByRole('button', { name: 'Go to next step: Preferences' })).toBeEnabled();
    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (completed)"'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (current step)" [selected]'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (not available)" [disabled]'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (not available)" [disabled]'
      - 'button "Back to previous step: Personal Info"'
      - 'button "Go to next step: Preferences"'
    `);

    await expect(frame.getByLabel('Back to previous step: Personal')).toMatchAriaSnapshot(
      `- 'button "Back to previous step: Personal Info"'`
    );
    await frame.getByRole('button', { name: 'Go to next step: Preferences' }).click();

    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (completed)"'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (completed)"'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (current step)" [selected]'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (not available)" [disabled]'
      - 'button "Back to previous step: Professional Info"'
      - 'button "Go to next step: Review & Save" [disabled]'
    `);

    const step2Completed = frame.locator('[data-testid="horizontal-stepper-step-1"]');
    await expect(step2Completed.locator('div[tabindex="0"]')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)'
    );
    await expect(step2Completed.locator('div[tabindex="0"]')).toHaveCSS(
      'border-color',
      'rgb(22, 163, 74)'
    );
    await expect(step2Completed.locator('svg.fa-check')).toBeVisible();

    const step3Current = frame.locator('[data-testid="horizontal-stepper-step-2"]');
    await expect(step3Current.locator('.animate-ring-pulse')).toBeVisible();
    await expect(step3Current.locator('div[tabindex="0"]')).toHaveCSS(
      'background-color',
      'rgb(67, 85, 182)'
    );

    await expect(frame.locator('#horizontal-step-panel-preferences')).toMatchAriaSnapshot(`
      - 'tabpanel "Step 3 of 4: Preferences. Set your preferences (current step)"':
        - text: Preferences *
        - textbox "Enter your preferences"
        - checkbox "Enable email notifications"
        - text: Enable email notifications
    `);
    await expect(
      frame.getByRole('button', { name: 'Go to next step: Review & Save' })
    ).toBeDisabled();

    await frame
      .getByRole('textbox', { name: 'Enter your preferences' })
      .fill('Duck Tape \nSledge Hammer \nShot Gun.');
    await frame.getByRole('checkbox', { name: 'Enable email notifications' }).check();
    await expect(
      frame.getByRole('button', { name: 'Go to next step: Review & Save' })
    ).toBeEnabled();
    await frame.getByRole('button', { name: 'Go to next step: Review & Save' }).click();

    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (completed)"'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (completed)"'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (completed)"'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (current step)" [selected]'
      - 'button "Back to previous step: Preferences"'
      - button "Save"
    `);
    const step3Completed = frame.locator('[data-testid="horizontal-stepper-step-2"]');
    await expect(step3Completed.locator('div[tabindex="0"]')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)'
    );
    await expect(step3Completed.locator('div[tabindex="0"]')).toHaveCSS(
      'border-color',
      'rgb(22, 163, 74)'
    );
    await expect(step3Completed.locator('svg.fa-check')).toBeVisible();

    const step4Current = frame.locator('[data-testid="horizontal-stepper-step-3"]');
    await expect(step4Current.locator('.animate-ring-pulse')).toBeVisible();
    await expect(step4Current.locator('div[tabindex="0"]')).toHaveCSS(
      'background-color',
      'rgb(67, 85, 182)'
    );

    await expect(frame.getByLabel('Back to previous step:')).toMatchAriaSnapshot(
      `- 'button "Back to previous step: Preferences"'`
    );
    await frame.getByRole('button', { name: 'Back to previous step:' }).click();

    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (completed)"'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (completed)"'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (current step) (completed)" [selected]'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (not available)" [disabled]'
      - 'button "Back to previous step: Professional Info"'
      - 'button "Go to next step: Review & Save"'
    `);
    const step3CurrentAgain = frame.locator('[data-testid="horizontal-stepper-step-2"]');
    await expect(step3CurrentAgain.locator('.animate-ring-pulse')).toBeVisible();

    await frame.getByRole('button', { name: 'Back to previous step:' }).click();

    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (completed)"'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (current step) (completed)" [selected]'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (completed)"'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (not available)" [disabled]'
      - 'button "Back to previous step: Personal Info"'
      - 'button "Go to next step: Preferences"'
    `);
    const step2CurrentAgain = frame.locator('[data-testid="horizontal-stepper-step-1"]');
    await expect(step2CurrentAgain.locator('.animate-ring-pulse')).toBeVisible();

    await frame.getByRole('button', { name: 'Back to previous step: Personal' }).click();

    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (current step) (completed)" [selected]'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (completed)"'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (completed)"'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (not available)" [disabled]'
      - 'button "Go to next step: Professional Info"'
    `);

    const step1CurrentAgain = frame.locator('[data-testid="horizontal-stepper-step-0"]');
    await expect(step1CurrentAgain.locator('.animate-ring-pulse')).toBeVisible();

    await expect(frame.getByLabel('Go to next step: Professional')).toMatchAriaSnapshot(
      `- 'button "Go to next step: Professional Info"'`
    );

    await frame.getByRole('button', { name: 'Go to next step: Professional' }).click();
    await expect(
      frame.getByRole('button', { name: 'Back to previous step: Personal' })
    ).toBeVisible();

    await frame.getByRole('button', { name: 'Go to next step: Preferences' }).click();
    await expect(frame.getByRole('button', { name: 'Back to previous step:' })).toBeVisible();

    await frame.getByRole('button', { name: 'Go to next step: Review & Save' }).click();
    await expect(frame.getByLabel('Step progress')).toMatchAriaSnapshot(`
      - tablist:
        - 'tab "Step 1 of 4: Personal Info. Enter your personal details (completed)"'
        - 'tab "Step 2 of 4: Professional Info. Enter your work details (completed)"'
        - 'tab "Step 3 of 4: Preferences. Set your preferences (completed)"'
        - 'tab "Step 4 of 4: Review & Save. Review and save your profile (current step)" [selected]'
      - 'button "Back to previous step: Preferences"'
      - button "Save"
    `);

    await expect(frame.locator('#horizontal-step-panel-review')).toMatchAriaSnapshot(`
      - 'tabpanel "Step 4 of 4: Review & Save. Review and save your profile (current step)"':
        - heading "Review Your Information" [level=3]
        - text: "Name: Martin Scorsese Email: holyMartin@gmail.com Company: Marshal Mathers LP 2 Position: Movie Director Preferences: Duck Tape Sledge Hammer Shot Gun. Notifications: Enabled"
        - paragraph: Please review your information above. Click "Save" to create your profile.
    `);

    await expect(frame.getByLabel('Save', { exact: true })).toMatchAriaSnapshot(`- button "Save"`);

    await frame.getByRole('button', { name: 'Save' }).click();
  });
});
