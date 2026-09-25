import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faCircleInfo,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';

type BannerType = 'warning' | 'info' | 'success' | 'error';
type BannerAlign = 'start' | 'center' | 'end';
type BannerSize = 'sm' | 'md' | 'lg';
type ContentAlign = 'left' | 'center' | 'right';

export interface BannerComponentProps {
  type: BannerType;
  title?: string | React.ReactNode;
  isHeading?: 1 | 2 | 3 | 4 | 5 | 6;
  message: string | React.ReactNode;
  /** Custom icon - can be a FontAwesome IconDefinition or any React node */
  icon?: React.ReactNode;
  /** Hide the icon completely */
  hideIcon?: boolean;

  /** Background and text override */
  bgClassName?: string;
  textClassName?: string;

  /** Vertical alignment of icon/text */
  align?: BannerAlign;
  size?: BannerSize;

  /** Horizontal alignment of entire content */
  alignmentClass?: ContentAlign;

  /** Custom dimensions and border-radius */
  height?: string;
  width?: string;
  rounded?: string;

  /** If true, root uses Slot from Radix UI */
  asChild?: boolean;

  /** Optional test id for Playwright / RTL */
  testId?: string;

  /** Additional class name for the root */
  className?: string;
  /** Additional class name for the title */
  titleClassName?: string;
  /** Additional class name for the message */
  messageClassName?: string;
  /** Additional class name for the icon */
  iconClassName?: string;
}

const bannerStyles: Record<
  BannerType,
  {
    container: string;
    icon: IconDefinition;
    iconClassName: string;
    srLabel: string;
  }
> = {
  warning: {
    container: 'bg-[#FFF5E1] text-[#B08300]',
    icon: faTriangleExclamation,
    iconClassName: 'text-[#B08300]',
    srLabel: 'Warning',
  },
  info: {
    container: 'bg-[#DCF2FC] text-[#074C6B]',
    icon: faCircleInfo,
    iconClassName: 'text-[#1086BD]',
    srLabel: 'Information',
  },
  success: {
    container: 'bg-[#E6F7E6] text-[#1086BD]',
    icon: faCircleCheck,
    iconClassName: 'text-[#1086BD]',
    srLabel: 'Success',
  },
  error: {
    container: 'bg-[#FFE0E1] text-[#9E0003]',
    icon: faCircleXmark,
    iconClassName: 'text-[#B80004]',
    srLabel: 'Error',
  },
};

const accessibilityMap: Record<
  BannerType,
  {
    role: 'status' | 'alert';
    ariaLive: 'polite' | 'assertive';
  }
> = {
  info: {
    role: 'status',
    ariaLive: 'polite',
  },
  success: {
    role: 'status',
    ariaLive: 'polite',
  },
  warning: {
    role: 'alert',
    ariaLive: 'assertive',
  },
  error: {
    role: 'alert',
    ariaLive: 'assertive',
  },
};

const alignMap: Record<BannerAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

const contentAlignMap: Record<ContentAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const sizeMap = {
  sm: {
    icon: 'text-base',
    title: 'text-sm',
    message: 'text-xs',
  },
  md: {
    icon: 'text-lg',
    title: 'text-base',
    message: 'text-sm',
  },
  lg: {
    icon: 'text-xl',
    title: 'text-lg',
    message: 'text-base',
  },
  xs: {
    icon: 'text-sm',
    title: 'text-xs',
    message: 'text-xs',
  },
  xl: {
    icon: 'text-xl',
    title: 'text-lg',
    message: 'text-base',
  },
  xxl: {
    icon: 'text-2xl',
    title: 'text-xl',
    message: 'text-lg',
  },
} as const;

export function BannerComponent({
  type,
  title,
  isHeading,
  message,
  icon,
  hideIcon = false,
  bgClassName,
  textClassName,
  align = 'start',
  size = 'md',
  alignmentClass = 'left',
  height,
  width,
  rounded = 'rounded-md',
  asChild = false,
  testId = 'banner-root',
  className = 'p-2',
  titleClassName = '',
  messageClassName = '',
  iconClassName = '',
}: BannerComponentProps) {
  const Comp = asChild ? Slot : 'div';
  const styles = bannerStyles[type];
  const sizeStyles = sizeMap[size];
  const a11y = accessibilityMap[type];
  const Tag = isHeading ? `h${isHeading}` : 'div';

  const renderIcon = (iconClasses: string) => {
    if (hideIcon) {
      return null;
    } else {
      if (icon) {
        return icon;
      } else {
        return (
          <FontAwesomeIcon
            icon={bannerStyles[type as BannerType].icon}
            className={twMerge(
              iconClasses,
              bannerStyles[type as BannerType].iconClassName,
              'shrink-0',
              title ? 'mt-1' : ''
            )}
            aria-hidden="true"
          />
        );
      }
    }
  };

  const containerClasses = twMerge(
    rounded,
    width ?? 'w-full',
    height ?? 'h-full',
    'max-w-full overflow-hidden',
    bgClassName ?? styles.container,
    textClassName,
    className
  );

  const titleClasses = twMerge(sizeStyles.title, titleClassName);

  const messageClasses = twMerge(sizeStyles.message, messageClassName);

  const iconClasses = twMerge(sizeStyles.icon, iconClassName);

  const contentClasses = twMerge(
    'flex flex-col gap-2 sm:flex-row sm:gap-3',
    alignMap[align],
    contentAlignMap[alignmentClass],
    'text-left sm:text-inherit'
  );

  return (
    <Comp
      role={a11y.role}
      aria-live={a11y.ariaLive}
      className={containerClasses}
      data-testid={testId}
    >
      <VisuallyHidden>{styles.srLabel}</VisuallyHidden>

      <div className={contentClasses}>
        {renderIcon(iconClasses)}

        <div className="min-w-0 flex-1">
          {title && <Tag className={titleClasses}>{title}</Tag>}
          <div className={messageClasses}>{message}</div>
        </div>
      </div>
    </Comp>
  );
}

export default BannerComponent;
