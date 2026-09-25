import React, { useId } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import type {
  ProgressWorkflowCardProps,
  WorkflowSection,
  WorkflowBadgeConfig,
} from './ProgressWorkflowCard.types';
import StatusIcon from './StatusIcon';
import { getBadgeClasses } from './ProgressWorkflowCard.utils';

// ---------------------------------------------------------------------------
// WorkflowBadge — exported so consumers can use it as a badge ReactNode
// ---------------------------------------------------------------------------

/**
 * Pre-styled tone pill. Pass as the `badge` prop of any `WorkflowSection`:
 *
 * ```tsx
 * badge: <WorkflowBadge label="Requirements Pending" tone="warning" />
 * ```
 *
 * You can also pass any other ReactNode (e.g. `<StatusBadge>`) in its place.
 */
export const WorkflowBadge: React.FC<WorkflowBadgeConfig> = ({ label, tone = 'neutral' }) => (
  <span className={getBadgeClasses(tone)}>{label}</span>
);

WorkflowBadge.displayName = 'WorkflowBadge';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Maps a WorkflowSection status to an aria-label suffix for screen readers. */
function statusLabel(status: WorkflowSection['status']): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In progress';
    case 'pending':
      return 'Pending';
    case 'error':
      return 'Error';
    default:
      return '';
  }
}

// ---------------------------------------------------------------------------
// SectionPanel — renders a single workflow section
// ---------------------------------------------------------------------------

const SectionPanel: React.FC<{
  section: WorkflowSection;
  index: number;
  length: number;
  stepDescId: string;
}> = ({ section, index, length, stepDescId }) => {
  const { label, status, metric, secondaryMetric, helperText, badge, actions, footer } = section;

  // IDs for aria-describedby wiring
  const metricId = `${stepDescId}-metric`;
  const helperId = `${stepDescId}-helper`;

  const describedByIds = [metric || secondaryMetric ? metricId : null, helperText ? helperId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      // ── Accessibility: each step is a listitem (parent is <ol>)
      // "region" would require a unique accessible name per ARIA spec;
      // listitem inside a labelled list is the correct pattern here.
      role="listitem"
      aria-label={`Step ${index + 1} of ${length}: ${label} — ${statusLabel(status)}`}
      aria-describedby={describedByIds || undefined}
      aria-current={status === 'in_progress' ? 'step' : undefined}
      className={classNames(
        'flex h-full flex-col gap-1 py-4 transition-colors duration-150',
        'focus-within:bg-gray-50/60 hover:bg-gray-50/60', // surface focus cue
        {
          'ps-4 pe-0': index === 0,
          'ps-0 pe-4': index === length - 1,
          'px-0': index > 0 && index < length - 1,
        }
      )}
    >
      {/* ── Header: status icon · label · badge ── */}
      <div className="flex min-h-[1rem] items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {/* StatusIcon should expose aria-hidden={true} internally;
              the status is already conveyed via the listitem's aria-label */}
          <StatusIcon status={status} aria-hidden />

          <span
            className="truncate text-sm leading-tight font-semibold text-gray-800"
            // Prevent the label from being the accessible name twice
            aria-hidden="true"
          >
            {label}
          </span>

          {/* Decorative rule — hidden from AT */}
          <div
            aria-hidden="true"
            className={classNames('min-w-[1rem] flex-1', {
              'border border-t border-[#C6C6CA] ps-4 pe-0': index === 0,
              'ps-0 pe-4': index === length - 1,
              'border border-t border-[#C6C6CA] px-0': index > 0 && index < length - 1,
            })}
          />
        </div>

        {badge != null && (
          // shrink-0 prevents the badge from wrapping under the label on
          // very narrow viewports
          <div className="shrink-0">{badge}</div>
        )}
      </div>

      {/* ── Metrics ── */}
      {(metric != null || secondaryMetric != null) && (
        <div id={metricId} className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
          {metric != null && <div className="text-sm">{metric}</div>}
          {secondaryMetric != null && (
            <div className={classNames('text-sm', metric != null && 'text-gray-500')}>
              {secondaryMetric}
            </div>
          )}
        </div>
      )}

      {/* ── Helper text ── */}
      {helperText != null && (
        <p id={helperId} className="text-xs text-gray-400">
          {helperText}
        </p>
      )}

      {/* ── Actions — consumer owns layout/styling ── */}
      {actions != null && (
        // mt-auto pushes actions to the bottom when siblings have variable height
        <div className="mt-auto">{actions}</div>
      )}

      {/* ── Footer ── */}
      {footer != null && (
        <div className="border-t border-gray-100 pt-2 text-xs text-gray-500">{footer}</div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// ProgressWorkflowCard
// ---------------------------------------------------------------------------

/**
 * Configurable multi-step workflow tracker.
 *
 * Sections are fully driven by props — consumers control the number of steps,
 * labels, metrics, badges, and CTA actions. The component handles layout,
 * status icons, and visual chrome.
 *
 * ### Accessibility
 * - Rendered as an `<article>` with an accessible name.
 * - Steps are an ordered list (`<ol>`) — conveys sequence and count to AT.
 * - A visually-hidden summary announces overall progress (e.g. "2 of 3 steps
 *   completed") to screen readers without cluttering the visual UI.
 * - The in-progress step carries `aria-current="step"`.
 * - Each step's metric and helper text are linked via `aria-describedby`.
 * - Decorative dividers and status icons are hidden from AT.
 *
 * @example
 * <ProgressWorkflowCard
 *   sections={[
 *     { id: 'slots', label: 'Slots', status: 'in_progress', metric: '04/08 Students' },
 *     { id: 'confirmation', label: 'Confirmation', status: 'pending' },
 *     { id: 'compliance', label: 'Compliance', status: 'completed',
 *       badge: <WorkflowBadge label="Requirements Met" tone="success" /> },
 *   ]}
 * />
 */
const ProgressWorkflowCard: React.FC<ProgressWorkflowCardProps> = ({ sections, className }) => {
  // Stable ID prefix for aria wiring — safe even with multiple cards on the page
  const uid = useId();

  if (!sections?.length) return null;

  // ── Screen-reader-only progress summary ──────────────────────────────────
  const completedCount = sections.filter((s) => s.status === 'completed').length;
  const progressSummary = `${completedCount} of ${sections.length} steps completed`;

  return (
    <article
      aria-label="Workflow progress"
      className={twMerge(
        'bg-card overflow-hidden rounded-xl border border-gray-200 shadow-sm',
        className
      )}
    >
      {/* Visually hidden but announced by screen readers */}
      <p className="sr-only">{progressSummary}</p>

      {/*
       * <ol> conveys ordered sequence + item count ("list, 3 items") to AT.
       *
       * Responsive layout:
       *   mobile (< sm)  → flex-col + divide-y  (stacked with horizontal rules)
       *   sm+            → flex-row + divide-x  (side-by-side with vertical rules)
       *
       * Each <li> gets flex-1 so all steps share equal width on wide viewports
       * and equal height share on narrow ones.
       *
       * min-w-0 on each <li> prevents text from blowing out flex widths.
       */}
      <ol aria-label="Workflow steps" className="flex flex-col sm:flex-row">
        {sections.map((section, ind) => (
          <li key={section.id} className="min-w-0 flex-1 list-none">
            <SectionPanel
              section={section}
              index={ind}
              length={sections.length}
              stepDescId={`${uid}-step-${section.id}`}
            />
          </li>
        ))}
      </ol>
    </article>
  );
};

ProgressWorkflowCard.displayName = 'ProgressWorkflowCard';

export default ProgressWorkflowCard;
