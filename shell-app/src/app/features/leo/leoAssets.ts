/** Ask Leo brand values, ported from the leo-ai-q2 repo (leoAssets.ts). */
export const ASK_LEO_BRAND_PINK = '#e31c79';

/** Solid Beta pill fill and its edge. */
export const LEO_BETA_SOLID_YELLOW = '#FFEEB4';
export const LEO_BETA_BADGE_BORDER = 'rgba(45, 38, 18, 0.22)';

/** Global shortcut label for opening Ask Leo (⌘L on Mac, Ctrl+L elsewhere). */
export function formatAskLeoShortcut(): string {
  if (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform)) return '⌘L';
  return 'Ctrl+L';
}
