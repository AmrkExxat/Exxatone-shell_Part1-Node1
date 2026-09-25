import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import type { WorkflowStatus } from './ProgressWorkflowCard.types';
import { STATUS_ARIA_LABELS } from './ProgressWorkflowCard.utils';

interface StatusIconProps {
  status: WorkflowStatus;
  className?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, className = '' }) => {
  const ariaLabel = STATUS_ARIA_LABELS[status];

  // completed → solid filled circle with white checkmark (existing behaviour)
  if (status === 'completed') {
    return (
      <svg
        className={classNames('text-primary h-5 w-5 shrink-0', className)}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={ariaLabel}
        role="img"
        aria-hidden={false}
      >
        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6.5 10l2.5 2.5 4.5-4.5"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // in_progress → outlined circle with a stroked checkmark inside
  if (status === 'in_progress') {
    return (
      <svg
        className={classNames('text-primary h-5 w-5 shrink-0', className)}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={ariaLabel}
        role="img"
        aria-hidden={false}
      >
        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  // pending → plain outlined circle, no checkmark
  return (
    <svg
      className={classNames('text-primary h-5 w-5 shrink-0', className)}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      aria-hidden={false}
    >
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};

StatusIcon.displayName = 'StatusIcon';

export default StatusIcon;
