import { prototypeLauncherSites } from '../data/prototype/site';

/**
 * Launch Page (/sites) — Network Layer + Sites secondary tabs.
 * // TODO(pm-feedback): card fields & pagination copy from Figma 370:624 / 370:245
 */

export type LaunchTabId = 'network' | 'sites';

export interface LaunchTab {
  id: LaunchTabId;
  label: string;
}

export const launchTabs: LaunchTab[] = [
  { id: 'network', label: 'Network Layer' },
  { id: 'sites', label: 'Sites' },
];

export const launchPageCopy = {
  title: 'Launch Page',
  searchPlaceholder: 'Search by name...',
  showingPrefix: 'Showing',
  ofLabel: 'of',
  resultsLabel: 'results',
} as const;

export interface LaunchSiteCard {
  id: string;
  name: string;
  location: string;
  initial: string;
}

/** Sites a coordinator can open. Same list as the signed-in session. */
export const launchSiteCards: LaunchSiteCard[] = prototypeLauncherSites.map((site) => ({
  id: site.id,
  name: site.name,
  location: site.location,
  initial: site.name.charAt(0),
}));
