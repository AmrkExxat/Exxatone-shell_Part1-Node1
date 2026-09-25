import classNames from 'classnames';
import type { BadgeTone, WorkflowStatus } from './ProgressWorkflowCard.types';

const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-orange-50 border-orange-200 text-orange-600',
  neutral: 'bg-gray-50 border-gray-200 text-gray-500',
};

export const getBadgeClasses = (tone: BadgeTone = 'neutral'): string =>
  classNames(
    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors',
    BADGE_TONE_CLASSES[tone]
  );

export const STATUS_ARIA_LABELS: Record<WorkflowStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
};
