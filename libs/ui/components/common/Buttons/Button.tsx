import React, { useMemo, forwardRef } from 'react';
import classNames from 'classnames';
import { type ButtonVariant, type ButtonProps, ButtonColor } from './Button.types';
import { twMerge } from 'tailwind-merge';

// A helper function to map color to common hover/focus classes
const colorClassMap: Record<string, string> = {
  'primary-50': 'hover:bg-primary-50 focus:bg-primary-50',
  'accent-50': 'hover:bg-accent-50 focus:bg-accent-50',
  'warn-50': 'hover:bg-warn-50 focus:bg-warn-50',
  'primary-900': 'hover:bg-primary-900 focus:bg-primary-900',
  'accent-900': 'hover:bg-accent-900 focus:bg-accent-900',
  'warn-900': 'hover:bg-warn-900 focus:bg-warn-900',
  primary: 'bg-primary',
  accent: 'bg-accent',
  warn: 'bg-warn',
  custom: 'bg-custom',
};
// A helper function to map color to common border classes
const borderClassMap: Record<string, string> = {
  primary: 'border-primary',
  accent: 'border-accent',
  warn: 'border-warn',
  custom: 'border-custom',
};
// Define a mapping of sizes to their corresponding min-height classes
const sizeClassMap: Record<string, string> = {
  xs: 'min-h-[16px]',
  sm: 'min-h-[24px]',
  md: 'min-h-[32px]',
  lg: 'min-h-[36px]',
  xl: 'min-h-[40px]',
};
// Function to get common color classes
const getColorCommonClasses = (color: string, hue: number): string =>
  colorClassMap[`${color}-${hue}`] || colorClassMap['primary-50'];
// A helper function to generate the common class names
const getVariantClasses = (
  variant: ButtonVariant,
  disabled: boolean,
  color: ButtonColor
): string => {
  const commonStyles = variant === 'custom' ? '' : getColorCommonClasses(color, 50);

  const flatCommonStyles = `${getColorCommonClasses(color, 900)} ${colorClassMap[color] || colorClassMap['primary']}`;

  const variantMap: Record<ButtonVariant, string> = {
    basic: `text-${color} ${commonStyles}`,
    raised: `text-${color} ${commonStyles} shadow-md`,
    stroked: `text-${color} ${commonStyles} border ${borderClassMap[color]}`,
    flat: `text-white ${flatCommonStyles}`,
    link: `text-${color} hover:underline min-h-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
    custom: ``,
  };

  const disabledVariantMap: Record<ButtonVariant, string> = {
    basic: '',
    raised: 'bg-disabled',
    stroked: 'bg-transparent border',
    flat: 'bg-disabled',
    link: 'bg-disabled',
    custom: 'bg-disabled',
  };
  return disabled
    ? disabledVariantMap[variant]
    : variantMap[variant] || `text-${color} ${commonStyles}`;
};
// Main Button component with ref forwarding
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'flat',
      type = 'button',
      color = 'primary',
      className = '',
      disabled = false,
      size = 'md',
      id,
      rounded,
      ariaDescribedBy,
      ariaCurrent,
      onClick = () => console.error('You have not implemented an on click'),
      ...props
    },
    ref
  ): JSX.Element => {
    // Memoize shared classes
    const sharedClasses = useMemo(
      () =>
        classNames(
          'font-normal px-3 min-w-[32px] text-sm flex items-center justify-center disabled:cursor-not-allowed disabled:text-disabled focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          `focus-visible:outline-${color}`,
          sizeClassMap[size],
          rounded ? 'rounded-full' : 'rounded-md'
        ),
      [color, size, rounded]
    );
    // Memoize variant-specific classes
    const variantClasses = useMemo(
      () => getVariantClasses(variant, disabled, color),
      [variant, disabled, color]
    );

    return (
      <button
        id={id}
        ref={ref}
        {...props}
        type={type}
        onClick={(e) => {
          if (!disabled) {
            onClick(e);
          }
        }}
        className={
          variant === 'custom'
            ? twMerge(sharedClasses, variantClasses, className)
            : twMerge(sharedClasses, variantClasses, className)
        }
        disabled={disabled}
        aria-describedby={ariaDescribedBy ? ariaDescribedBy : undefined}
        {...(ariaCurrent !== undefined && { 'aria-current': ariaCurrent })}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button'; // Important when using forwardRef

export default Button;
