import { MouseEventHandler } from 'react';

export type StatusBadgeVariant =
  | 'confirmed'
  | 'not-confirmed'
  | 'not-started'
  | 'action-needed'
  | 'compliant'
  | 'in-progress'
  | 'canceled'
  | 'revoked'
  | 'pending'
  | 'processing'
  | 'non-compliant'
  | 'processed'
  | 'unprocessed'
  | 'na';

export interface StatusBadgeProps {
  label: string;
  variant: StatusBadgeVariant;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  showChevron?: boolean;
  className?: string;
}

export interface VariantStyle {
  bg: string;
  border: string;
  text: string;
}
