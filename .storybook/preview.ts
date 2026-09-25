import type { Preview } from '@storybook/nextjs';
import React, { useEffect } from 'react';

import { setTheme, type Theme, type ColorScheme } from '../libs/utilities';

import '../app/styles.scss';

const loadGoogleFonts = () => {
  if (typeof document === 'undefined') return;

  const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
  document.head.appendChild(link);
};

// Font loader component
const FontLoader = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    loadGoogleFonts();
  }, []);
  return React.createElement(React.Fragment, null, children);
};

// Load fonts immediately (for SSR safety)
if (typeof document !== 'undefined') {
  loadGoogleFonts();
}

// Theme wrapper component that ensures theme updates
const ThemeWrapper = ({
  children,
  theme,
  colorScheme,
}: {
  children: React.ReactNode;
  theme: Theme;
  colorScheme: ColorScheme;
}) => {
  useEffect(() => {
    // Update theme attributes on body (for security)
    const body = document.body;
    const html = document.documentElement;

    // Set theme attributes on body
    body.setAttribute('data-theme', theme);
    body.setAttribute('data-color-scheme', colorScheme);

    // Update dark class on html for dark mode compatibility (Tailwind)
    // High-contrast theme always uses dark mode
    if (colorScheme === 'dark' || theme === 'high-contrast') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Call setTheme for consistency (updates localStorage)
    setTheme(theme, colorScheme);

    // Force style recalculation by accessing computed styles
    // This ensures CSS custom properties are recalculated
    window.getComputedStyle(body).getPropertyValue('--color-background');
  }, [theme, colorScheme]);

  return React.createElement(React.Fragment, null, children);
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    a11y: {
      test: 'todo',
    },
  },
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Theme color',
      defaultValue: 'blue',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'blue', title: 'Blue', icon: 'circle' },
          { value: 'purple', title: 'Purple', icon: 'circle' },
          { value: 'high-contrast', title: 'High Contrast', icon: 'contrast' },
        ],
        dynamicTitle: true,
      },
    },
    colorScheme: {
      description: 'Color scheme mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Color Scheme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    // Load Google Fonts first
    (Story) => {
      return React.createElement(FontLoader, {
        children: React.createElement(Story),
      });
    },
    // Theme decorator
    (Story, context) => {
      const theme = (context.globals.theme || 'blue') as Theme;
      // High-contrast theme always uses dark mode
      const colorScheme =
        theme === 'high-contrast'
          ? 'dark'
          : ((context.globals.colorScheme || 'light') as ColorScheme);

      // Update theme immediately when decorator runs (synchronous update)
      // This must happen before React renders to ensure styles are applied
      if (typeof document !== 'undefined') {
        const body = document.body;
        const html = document.documentElement;

        // Set theme attributes on body (for security)
        body.setAttribute('data-theme', theme);
        body.setAttribute('data-color-scheme', colorScheme);

        // Update dark class on html for dark mode compatibility (Tailwind)
        // High-contrast theme always uses dark mode
        if (colorScheme === 'dark' || theme === 'high-contrast') {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }

        setTheme(theme, colorScheme);
      }

      // Wrap in ThemeWrapper to ensure updates via useEffect as well
      // Key forces re-render when theme/colorScheme changes
      return React.createElement(ThemeWrapper, {
        key: `${theme}-${colorScheme}`,
        theme,
        colorScheme,
        children: React.createElement(Story),
      });
    },
  ],
};

export default preview;
