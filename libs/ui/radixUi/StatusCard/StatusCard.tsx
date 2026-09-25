import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { twMerge } from 'tailwind-merge';

/* -------------------------------- Types -------------------------------- */

export interface StatusCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Status content displayed in the lower card. */
  status: React.ReactNode;
  /** Main card content displayed in the top card. */
  content: React.ReactNode;
  /** Background class for the status section. */
  statusBackgroundClassName?: string;
  /** Background color for the status section (overrides class). */
  statusBackgroundColor?: string;
  /** Additional classes for the status content wrapper. */
  statusClassName?: string;
  /** Additional classes for the content wrapper. */
  contentClassName?: string;
  /** Use a custom element as the root. */
  asChild?: boolean;
  /** Test ID for Playwright or RTL. */
  testId?: string;
  /** Hide the bottom card, showing only the status content. */
  hideBottomCard?: boolean;
}

/* -------------------------------- Component -------------------------------- */

export const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  (
    {
      status,
      content,
      statusBackgroundClassName,
      statusBackgroundColor,
      statusClassName,
      contentClassName,
      asChild = false,
      testId = 'status-card',
      className,
      hideBottomCard = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';

    const rootClasses = twMerge('relative inline-flex flex-col items-stretch', className);

    const bottomCardClasses = twMerge(
      'w-full rounded-2xl border border-gray-200 px-6 pt-3 pb-7',
      statusBackgroundClassName ?? 'bg-card'
    );

    const topCardClasses =
      'relative z-10 -mt-6 w-full rounded-2xl border border-gray-200 bg-card p-6';

    const topCardStyle: React.CSSProperties = {
      boxShadow: '0px 0px 12px 0px #0000001F',
    };

    const statusClasses = twMerge('inline-flex items-center gap-2', statusClassName);

    const contentClasses = twMerge('flex flex-col gap-4', contentClassName);

    return (
      <Comp ref={ref} className={rootClasses} data-testid={testId} {...props}>
        {!hideBottomCard && (
          <div
            className={bottomCardClasses}
            style={statusBackgroundColor ? { backgroundColor: statusBackgroundColor } : undefined}
            data-testid={`${testId}-underlay`}
          >
            <div className={statusClasses} data-testid={`${testId}-status`}>
              <div data-testid={`${testId}-status-content`}>{status}</div>
            </div>
          </div>
        )}

        <div className={topCardClasses} style={topCardStyle}>
          <div className={contentClasses} data-testid={`${testId}-content`}>
            {content}
          </div>
        </div>
      </Comp>
    );
  }
);

StatusCard.displayName = 'StatusCard';

export default StatusCard;
