/**
 * Stylox Theme Configuration
 * Provides utilities for theme switching and management
 */

export type Theme = 'blue' | 'purple' | 'high-contrast';
export type ColorScheme = 'light' | 'dark';

export interface ThemeConfig {
  theme: Theme;
  colorScheme: ColorScheme;
}

/**
 * Get the current theme configuration from the document
 */
export function getTheme(): ThemeConfig {
  const body = document.body;
  const theme = (body.getAttribute('data-theme') || 'blue') as Theme;
  const colorScheme = (body.getAttribute('data-color-scheme') || 'light') as ColorScheme;

  return { theme, colorScheme };
}

/**
 * Set the theme
 */
export function setTheme(theme: Theme, colorScheme: ColorScheme = 'light'): void {
  const body = document.body;
  const finalTheme = theme || 'blue';
  const finalColorScheme = finalTheme === 'high-contrast' ? 'dark' : colorScheme;

  body.setAttribute('data-theme', finalTheme);
  body.setAttribute('data-color-scheme', finalColorScheme);

  const html = document.documentElement;
  if (finalColorScheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('stylox-theme', finalTheme);
    localStorage.setItem('stylox-color-scheme', finalColorScheme);
  }
}

/**
 * Initialize theme from localStorage or system preferences
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return;

  const storedTheme = localStorage.getItem('stylox-theme') as Theme | null;
  const storedColorScheme = localStorage.getItem('stylox-color-scheme') as ColorScheme | null;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;

  let theme: Theme = (storedTheme || 'blue') as Theme;

  if (prefersHighContrast && !storedTheme) {
    theme = 'high-contrast';
  }

  let colorScheme: ColorScheme = 'light';

  if (theme === 'high-contrast') {
    colorScheme = 'dark';
  } else if (storedColorScheme) {
    colorScheme = storedColorScheme;
  } else if (prefersDark) {
    colorScheme = 'dark';
  }

  if (!document.body.getAttribute('data-theme')) {
    setTheme(theme, colorScheme);
  } else {
    setTheme(theme, colorScheme);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const current = getTheme();
    if (current.theme !== 'high-contrast' && !localStorage.getItem('stylox-color-scheme')) {
      if (e.matches) {
        setTheme(current.theme, 'dark');
      } else {
        setTheme(current.theme, 'light');
      }
    }
  });

  window.matchMedia('(prefers-contrast: more)').addEventListener('change', (e) => {
    if (!localStorage.getItem('stylox-theme')) {
      if (e.matches) {
        setTheme('high-contrast', 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme('blue', prefersDark ? 'dark' : 'light');
      }
    }
  });
}

/**
 * Toggle between light and dark mode
 * Note: High-contrast theme only supports dark mode
 */
export function toggleColorScheme(): void {
  const current = getTheme();

  if (current.theme === 'high-contrast') {
    return;
  }

  const newScheme: ColorScheme = current.colorScheme === 'light' ? 'dark' : 'light';
  setTheme(current.theme, newScheme);
}

/**
 * Toggle high contrast theme
 */
export function toggleHighContrast(): void {
  const current = getTheme();

  if (current.theme === 'high-contrast') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme('blue', prefersDark ? 'dark' : 'light');
  } else {
    setTheme('high-contrast', 'dark');
  }
}

/**
 * Available themes
 */
export const themes: Theme[] = ['blue', 'purple', 'high-contrast'];

/**
 * Available color schemes
 */
export const colorSchemes: ColorScheme[] = ['light', 'dark'];
