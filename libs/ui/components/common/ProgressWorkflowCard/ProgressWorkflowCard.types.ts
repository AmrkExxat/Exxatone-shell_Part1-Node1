import React from 'react';

export type WorkflowStatus = 'pending' | 'in_progress' | 'completed';

export type BadgeTone = 'success' | 'warning' | 'neutral';

export interface WorkflowBadgeConfig {
  label: string;
  tone?: BadgeTone;
}

export interface WorkflowSection {
  id: string;
  label: string;
  status: WorkflowStatus;

  /** Primary metric display — consumer owns the markup and coloring. */
  metric?: React.ReactNode;
  /** Secondary metric shown inline next to `metric`. */
  secondaryMetric?: React.ReactNode;

  /** Small muted hint text rendered below metrics. */
  helperText?: React.ReactNode;

  /**
   * Inline badge rendered to the right of the section header.
   * Pass any ReactNode — use the exported `WorkflowBadge` for the built-in
   * tone-styled pill, or any other component (e.g. `<StatusBadge>`).
   */
  badge?: React.ReactNode;

  /** CTA links / action buttons — consumer owns layout and styling. */
  actions?: React.ReactNode;

  /** Optional footer content separated by a top border. */
  footer?: React.ReactNode;
}

export interface ProgressWorkflowCardProps {
  sections: WorkflowSection[];
  className?: string;
}
