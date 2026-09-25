import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

/* -------------------------------- Types -------------------------------- */

export type PillVariant = 'filled' | 'outlined';
export type PillSize = 'sm' | 'md';
export type PillColorScheme = 'default' | 'success' | 'warning' | 'info' | 'error';
export type PillType = 'pill' | 'square';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The text content of the pill */
  children: React.ReactNode;
  /** Visual variant of the pill */
  variant?: PillVariant;
  /** Size of the pill */
  size?: PillSize;
  /** Shape type of the pill */
  type?: PillType;
  /** Semantic color scheme */
  colorScheme?: PillColorScheme;
  /** Custom background color (overrides colorScheme for filled variant) */
  customBgColor?: string;
  /** Custom text color (overrides colorScheme) */
  customTextColor?: string;
  /** Custom border color (overrides colorScheme for outlined variant) */
  customBorderColor?: string;
  /** Element to render at the start (e.g., icon) */
  startAdornment?: React.ReactNode;
  /** Element to render at the end (e.g., icon) */
  endAdornment?: React.ReactNode;
  /** Use a custom element as the root */
  asChild?: boolean;
  /** Test ID for testing purposes */
  testId?: string;
}

/* -------------------------------- Styles -------------------------------- */

/**
 * Color styles for each scheme and variant combination
 * - filled: solid background with contrasting text
 * - outlined: transparent background with colored border and text
 */
const colorStyles: Record<
  PillColorScheme,
  {
    filled: { bg: string; text: string };
    outlined: { border: string; text: string };
  }
> = {
  default: {
    filled: { bg: 'bg-gray-100', text: 'text-gray-700' },
    outlined: { border: 'border-gray-300', text: 'text-gray-700' },
  },
  success: {
    filled: { bg: 'bg-green-100', text: 'text-green-700' },
    outlined: { border: 'border-green-500', text: 'text-green-700' },
  },
  warning: {
    filled: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    outlined: { border: 'border-yellow-500', text: 'text-yellow-700' },
  },
  info: {
    filled: { bg: 'bg-blue-100', text: 'text-blue-700' },
    outlined: { border: 'border-blue-500', text: 'text-blue-700' },
  },
  error: {
    filled: { bg: 'bg-red-100', text: 'text-red-700' },
    outlined: { border: 'border-red-500', text: 'text-red-700' },
  },
};

/**
 * Size styles based on Figma specs:
 * - sm: height 24px, padding 4px 8px, gap 5px, border-radius 12px
 * - md: height 28px, padding 6px 12px, gap 8px, border-radius 14px (full)
 */
const sizeStyles: Record<PillSize, { root: string; gap: string; iconSize: string }> = {
  sm: {
    root: 'h-6 px-2 py-1 text-xs',
    gap: 'gap-[5px]',
    iconSize: '[&>svg]:w-4 [&>svg]:h-4',
  },
  md: {
    root: 'h-7 px-3 py-1.5 text-sm',
    gap: 'gap-2',
    iconSize: '[&>svg]:w-4 [&>svg]:h-4',
  },
};

/**
 * Type styles for controlling shape:
 * - pill: fully rounded (default)
 * - square: minimal rounding (height 24px fixed)
 */
const typeStyles: Record<PillType, { root: string }> = {
  pill: {
    root: '', // Will use size-based border-radius
  },
  square: {
    root: 'h-6 rounded-md', // Fixed height 24px, minimal rounding
  },
};

/* -------------------------------- Component -------------------------------- */

export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  (
    {
      children,
      variant = 'filled',
      size = 'sm',
      type = 'pill',
      colorScheme = 'default',
      customBgColor,
      customTextColor,
      customBorderColor,
      startAdornment,
      endAdornment,
      asChild = false,
      testId = 'pill',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'span';
    const sizeStyle = sizeStyles[size];
    const typeStyle = typeStyles[type];
    const colorStyle = colorStyles[colorScheme];

    // Determine if we're using custom colors
    const hasCustomColors = customBgColor || customTextColor || customBorderColor;

    // Determine border radius based on type
    const borderRadius = type === 'pill' ? (size === 'sm' ? 'rounded-xl' : 'rounded-full') : '';

    // Build class list
    const rootClasses = twMerge(
      classNames([
        // Base styles
        'inline-flex items-center justify-center font-inherit whitespace-nowrap',
        // Size styles
        sizeStyle.root,
        sizeStyle.gap,
        sizeStyle.iconSize,
        // Type styles (shape)
        typeStyle.root,
        // Border radius for pill type
        borderRadius,
        // Border for outlined variant
        variant === 'outlined' && 'border',
        // Color styles (only if not using custom colors)
        !hasCustomColors && variant === 'filled' && colorStyle.filled.bg,
        !hasCustomColors && variant === 'filled' && colorStyle.filled.text,
        !hasCustomColors && variant === 'outlined' && 'bg-transparent',
        !hasCustomColors && variant === 'outlined' && colorStyle.outlined.border,
        !hasCustomColors && variant === 'outlined' && colorStyle.outlined.text,
      ]),
      className
    );

    // Build inline styles for custom colors
    const customStyles: React.CSSProperties = {
      ...style,
      ...(customBgColor && variant === 'filled' && { backgroundColor: customBgColor }),
      ...(customTextColor && { color: customTextColor }),
      ...(customBorderColor && variant === 'outlined' && { borderColor: customBorderColor }),
    };

    return (
      <Comp ref={ref} className={rootClasses} style={customStyles} data-testid={testId} {...props}>
        {startAdornment && (
          <div
            className="inline-flex shrink-0 items-center"
            data-testid={`${testId}-start-adornment`}
          >
            {startAdornment}
          </div>
        )}
        <div className="truncate">{children}</div>
        {endAdornment && (
          <div
            className="inline-flex shrink-0 items-center"
            data-testid={`${testId}-end-adornment`}
          >
            {endAdornment}
          </div>
        )}
      </Comp>
    );
  }
);

Pill.displayName = 'Pill';

export default Pill;
