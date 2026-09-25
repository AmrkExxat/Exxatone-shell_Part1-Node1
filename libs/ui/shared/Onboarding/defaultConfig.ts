import type { TabConfig } from './store/types';

/**
 * The three requirement lifecycle tabs used across both consumers.
 * Pass a custom `tabs` prop to OnboardingContainer to override.
 */
export const DEFAULT_TABS: TabConfig[] = [
  { key: 'caas', label: 'Onboarding' },
  { key: 'onb', label: 'Ongoing' },
  { key: 'ofb', label: 'Offboarding' },
];
