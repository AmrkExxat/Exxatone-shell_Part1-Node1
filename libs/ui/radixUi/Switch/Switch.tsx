import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

type SwitchSize = 'sm' | 'default' | 'lg';
type SwitchVariant = 'primary' | 'success' | 'warning' | 'error' | 'custom';

export interface SwitchProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  'asChild' | 'defaultChecked'
> {
  variant?: SwitchVariant;
  size?: SwitchSize;
  asChild?: boolean;
  testId?: string;
  checkedColor?: string; // CSS color value (e.g., '#7c3aed', 'purple'), required for custom variant
}
const BASE_BG = 'bg-[#D1D5DC]';
const THUMB_BG = 'bg-card';

const variantStyles: Record<
  SwitchVariant,
  {
    base: string;
    checked?: string;
    thumb: string;
  }
> = {
  primary: {
    base: BASE_BG,
    checked: 'data-[state=checked]:bg-blue-600',
    thumb: THUMB_BG,
  },
  success: {
    base: BASE_BG,
    checked: 'data-[state=checked]:bg-green-600',
    thumb: THUMB_BG,
  },
  warning: {
    base: BASE_BG,
    checked: 'data-[state=checked]:bg-yellow-600',
    thumb: THUMB_BG,
  },
  error: {
    base: BASE_BG,
    checked: 'data-[state=checked]:bg-red-600',
    thumb: THUMB_BG,
  },
  custom: {
    base: BASE_BG,
    thumb: THUMB_BG,
  },
};

const sizeStyles: Record<SwitchSize, { root: string; thumb: string; translate: string }> = {
  sm: {
    root: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'data-[state=checked]:translate-x-4',
  },
  default: {
    root: 'h-[24px] w-[40px]',
    thumb: 'h-[20px] w-[20px]',
    translate: 'data-[state=checked]:translate-x-4',
  },
  lg: {
    root: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'data-[state=checked]:translate-x-7',
  },
};

export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      asChild = false,
      testId = 'switch-root',
      checkedColor,
      checked,
      onCheckedChange,
      onKeyDown,
      style,
      ...props
    },
    ref
  ) => {
    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];

    if (variant === 'custom' && !checkedColor) {
      console.warn('[Switch]: variant="custom" requires `checkedColor` prop.');
    }

    // For custom variant, don't apply base bg when checked (so inline style can take over)
    const shouldApplyBaseBg = !(variant === 'custom' && checked);

    const rootClasses = [
      'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',

      sizeStyle.root,
      shouldApplyBaseBg && variantStyle.base,

      variant !== 'custom' && variantStyle.checked,

      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Apply custom checked color via inline style
    const customStyle: React.CSSProperties =
      variant === 'custom' && checkedColor && checked
        ? { ...style, backgroundColor: checkedColor }
        : (style ?? {});

    const thumbClasses = [
      'pointer-events-none block rounded-full shadow-lg ring-0 transition-transform',
      sizeStyle.thumb,
      sizeStyle.translate,
      variantStyle.thumb,
    ]
      .filter(Boolean)
      .join(' ');

    const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
      if (onKeyDown) {
        onKeyDown(event);
      }

      if (
        !event.defaultPrevented &&
        event.key === 'Enter' &&
        typeof checked === 'boolean' &&
        onCheckedChange
      ) {
        event.preventDefault();
        onCheckedChange(!checked);
      }
    };

    return (
      <SwitchPrimitive.Root
        ref={ref}
        asChild={asChild}
        className={rootClasses}
        data-testid={testId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        onKeyDown={handleKeyDown}
        style={customStyle}
        {...props}
      >
        <SwitchPrimitive.Thumb className={thumbClasses} />
      </SwitchPrimitive.Root>
    );
  }
);

Switch.displayName = 'Switch';
export default Switch;
