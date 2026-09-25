import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { twMerge } from 'tailwind-merge';

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'error' | 'custom' | 'black';

export interface RadixProgressBarProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  'asChild'
> {
  value?: number;
  max?: number;
  variant?: ProgressBarVariant;
  indicatorColor?: string;
  trackColor?: string;
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
  indeterminate?: boolean;
  testId?: string;
  className?: string;
  indicatorClassName?: string;
  style?: React.CSSProperties;
  indicatorStyle?: React.CSSProperties;
  children?: React.ReactNode;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  showProgressValue?: boolean;
  progressValueClassName?: string;
  progressValueLabel?: string;
}

const variantColors: Record<ProgressBarVariant, string> = {
  primary: '#3b82f6',
  success: '#11AC78',
  warning: '#E5E300',
  error: '#E50005',
  black: '#000000',
  custom: '#1F2937',
};

const DEFAULT_TRACK_COLOR = '#F4F4F5';
const DEFAULT_HEIGHT = 8;
const DEFAULT_BORDER_RADIUS = 9999;

const RadixProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  RadixProgressBarProps
>(
  (
    {
      value = 0,
      max = 100,
      variant = 'primary',
      indicatorColor,
      trackColor = DEFAULT_TRACK_COLOR,
      height = DEFAULT_HEIGHT,
      width = '100%',
      borderRadius = DEFAULT_BORDER_RADIUS,
      indeterminate = false,
      testId = 'radix-progress-bar',
      className = '',
      indicatorClassName = '',
      style,
      indicatorStyle,
      children,
      wrapperClassName = '',
      wrapperStyle,
      showProgressValue = false,
      progressValueClassName = '',
      progressValueLabel = '',
      ...props
    },
    ref
  ) => {
    const progressValue = indeterminate ? null : Math.min(Math.max(value, 0), max);
    const percentage = progressValue !== null ? (progressValue / max) * 100 : 0;
    const resolvedIndicatorColor = indicatorColor || variantColors[variant];

    const normalizeSize = (size: string | number): string => {
      return typeof size === 'number' ? `${size}px` : size;
    };

    const rootStyles: React.CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: trackColor,
      height: normalizeSize(height),
      width: normalizeSize(width),
      borderRadius: normalizeSize(borderRadius),
      ...style,
    };

    const indicatorStyles: React.CSSProperties = {
      backgroundColor: resolvedIndicatorColor,
      width: indeterminate ? '50%' : `${percentage}%`,
      height: '100%',
      borderRadius: normalizeSize(borderRadius),
      transition: indeterminate ? 'none' : 'width 300ms ease-in-out',
      ...(indeterminate && {
        animation: 'radix-progress-indeterminate 1.5s ease-in-out infinite',
      }),
      ...indicatorStyle,
    };

    return (
      <div className={twMerge('radix-progress-bar-wrapper', wrapperClassName)} style={wrapperStyle}>
        {indeterminate && (
          <style>
            {`
              @keyframes radix-progress-indeterminate {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(300%);
                }
              }
            `}
          </style>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={twMerge('radix-progress-bar-root border border-[#C6C6CA]', className)}
          style={rootStyles}
          value={progressValue}
          max={max}
          data-testid={testId}
          data-state={
            indeterminate ? 'indeterminate' : progressValue === max ? 'complete' : 'loading'
          }
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={twMerge('radix-progress-bar-indicator', indicatorClassName)}
            style={indicatorStyles}
            data-testid={`${testId}-indicator`}
          />
        </ProgressPrimitive.Root>

        {showProgressValue && (
          <span className={progressValueClassName}>
            {progressValueLabel ? `${progressValueLabel} ${percentage}%` : `${percentage}%`}
          </span>
        )}
        {children}
      </div>
    );
  }
);

RadixProgressBar.displayName = 'RadixProgressBar';

export default RadixProgressBar;
