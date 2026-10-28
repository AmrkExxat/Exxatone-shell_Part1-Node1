/** Tenant email setup — mock defaults for Site Configuration → Notification → Email Setup. */

export const EMAIL_SETUP_LOGO_MAX_BYTES = 2 * 1024 * 1024;

export const EMAIL_SETUP_LOGO_ACCEPT = '.png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml';

export const MOCK_EMAIL_SETUP = {
  displayName: 'MedStar Health Clinical Education',
  replyTo: ['clinical.placements@medstarhealth.org'],
  footerDisclaimer:
    'This email was sent by MedStar Health Clinical Education via Exxat One. For questions, contact clinical.placements@medstarhealth.org.',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return EMAIL_PATTERN.test(trimmed);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
