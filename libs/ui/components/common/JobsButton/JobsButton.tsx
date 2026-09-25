'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import classNames from 'classnames';
import React from 'react';
import Button from '../Buttons/Button';

export type JobsButtonSize = 'small' | 'default' | 'large';
export type JobsButtonVariant = 'filled' | 'outlined' | 'text';
export type JobsButtonColor =
  'primary' | 'positive' | 'negative' | 'neutral-black' | 'neutral-white';

export interface JobsButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  'variant' | 'className'
> {
  size?: JobsButtonSize;
  variant?: JobsButtonVariant;
  color?: JobsButtonColor;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  id?: string;
}

const SIZE_CLASSES: Record<JobsButtonSize, { text: string; padding: string; radius: string }> = {
  small: {
    text: 'text-xs',
    padding: 'px-[12px]',
    radius: 'rounded-[4px]',
  },
  default: {
    text: 'text-sm',
    padding: 'px-[12px]',
    radius: 'rounded-[8px]',
  },
  large: {
    text: 'text-sm',
    padding: 'px-[12px]',
    radius: 'rounded-[12px]',
  },
};

type ColorVariantStyles = {
  filled: {
    default: string;
    hover: string;
    active: string;
    focus: string;
  };
  outlined: {
    default: string;
    hover: string;
    active: string;
    focus: string;
  };
  text: {
    default: string;
    hover: string;
    active: string;
    focus: string;
  };
  disabled: {
    filled: string;
    outlined: string;
    text: string;
  };
};

const COLOR_VARIANT_STYLES: Record<JobsButtonColor, ColorVariantStyles> = {
  'neutral-black': {
    filled: {
      default: 'bg-[#39393C] text-[#FFFFFF]',
      hover: 'hover:bg-[#333336] hover:text-[#FFFFFF]',
      active: 'active:bg-[#2E2E30] active:text-[#FFFFFF]',
      focus: 'focus:ring-2 focus:ring-[#5983EE] focus:ring-offset-0 focus:text-[#FFFFFF]',
    },
    outlined: {
      default: 'bg-card text-[#000000] border border-[#8C8C92]',
      hover: 'hover:bg-[#F5F5F5] hover:text-[#000000] hover:border-[#8C8C92]',
      active: 'active:bg-[#CCCCCC] active:text-[#000000] active:border-[#8C8C92]',
      focus:
        'focus:ring-2 focus:ring-[#5983EE] focus:ring-offset-0 focus:border-[#5983EE] focus:text-[#000000]',
    },
    text: {
      default: 'bg-transparent text-[#000000]',
      hover: 'hover:bg-[rgba(0,0,0,0.04)] hover:text-[#000000]',
      active: 'active:bg-black/20 active:text-[#000000]',
      focus: 'focus:ring-2 focus:ring-[#5983EE] focus:ring-offset-0 focus:text-[#000000]',
    },
    disabled: {
      filled: 'bg-[#DADADC] text-[#8C8C92] cursor-not-allowed',
      outlined: 'bg-card border border-[#C6C6CA] text-[#8C8C92] cursor-not-allowed',
      text: 'bg-transparent text-[#8C8C92] cursor-not-allowed',
    },
  },
  // Placeholder for future color variants
  primary: {
    filled: { default: '', hover: '', active: '', focus: '' },
    outlined: { default: '', hover: '', active: '', focus: '' },
    text: { default: '', hover: '', active: '', focus: '' },
    disabled: { filled: '', outlined: '', text: '' },
  },
  positive: {
    filled: { default: '', hover: '', active: '', focus: '' },
    outlined: { default: '', hover: '', active: '', focus: '' },
    text: { default: '', hover: '', active: '', focus: '' },
    disabled: { filled: '', outlined: '', text: '' },
  },
  negative: {
    filled: { default: '', hover: '', active: '', focus: '' },
    outlined: { default: '', hover: '', active: '', focus: '' },
    text: { default: '', hover: '', active: '', focus: '' },
    disabled: { filled: '', outlined: '', text: '' },
  },
  'neutral-white': {
    filled: { default: '', hover: '', active: '', focus: '' },
    outlined: { default: '', hover: '', active: '', focus: '' },
    text: { default: '', hover: '', active: '', focus: '' },
    disabled: { filled: '', outlined: '', text: '' },
  },
};

const MIN_WIDTH_HEIGHT_CLASSES: Record<JobsButtonSize, string> = {
  small: 'min-w-[80px] max-h-[24px] min-h-[24px]',
  default: 'min-w-[80px] max-h-[32px] min-h-[32px]',
  large: 'min-w-[96px] max-h-[40px] min-h-[40px]',
};

const JobsButton = React.forwardRef<HTMLButtonElement, JobsButtonProps>(
  (
    {
      size = 'default',
      variant = 'filled',
      color = 'neutral-black',
      disabled = false,
      isLoading = false,
      className = '',
      children,
      startAdornment,
      endAdornment,
      id,
      ...buttonProps
    },
    ref
  ) => {
    const disabledFromButtonProps =
      'disabled' in buttonProps ? (buttonProps as any).disabled : undefined;
    const { disabled: _, ...restButtonProps } = buttonProps as any;

    const sizeClasses = SIZE_CLASSES[size];
    const isButtonDisabled = disabledFromButtonProps ?? (disabled || isLoading);

    const baseClasses = classNames(
      sizeClasses.text,
      sizeClasses.padding,
      sizeClasses.radius,
      'font-medium',
      'transition-colors',
      'focus:outline-none'
    );

    const colorStyles = COLOR_VARIANT_STYLES[color];
    const variantStyles = colorStyles[variant];

    const minWidthHeightClasses = MIN_WIDTH_HEIGHT_CLASSES[size];

    const variantClasses = isButtonDisabled
      ? colorStyles.disabled[variant]
      : classNames(
          variantStyles.default,
          variantStyles.hover,
          variantStyles.active,
          variantStyles.focus
        );

    const combinedClassName = classNames(
      baseClasses,
      variantClasses,
      minWidthHeightClasses,
      className
    );

    return (
      <Button
        ref={ref}
        variant="custom"
        disabled={isButtonDisabled}
        className={combinedClassName}
        {...restButtonProps}
        id={id}
      >
        <span className="flex items-center justify-center">
          {isLoading && <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />}
          {startAdornment && <span className="mr-2 flex items-center">{startAdornment}</span>}
          {children}
          {endAdornment && <span className="ml-2 flex items-center">{endAdornment}</span>}
        </span>
      </Button>
    );
  }
);

JobsButton.displayName = 'JobsButton';

export default JobsButton;
