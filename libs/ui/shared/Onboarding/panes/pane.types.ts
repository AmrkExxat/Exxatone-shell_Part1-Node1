import type { ReactNode } from 'react';
import type { RequirementGroup, RequirementItem } from '../store/types';
import type {
  OnboardingStoreApi,
  FormContentSlotProps,
  FormHeaderActionsSlotProps,
  RequirementItemSlotProps,
} from '../types';

export interface RequirementPaneProps {
  /** Grouped list of requirements to render */
  groups: RequirementGroup[];
  /** Optional custom row renderer */
  itemSlot?: (props: RequirementItemSlotProps) => ReactNode;
  /** When false, clicking a row is disabled (e.g. unpaid schedule) */
  isPaid?: boolean;
  /**
   * Called before switching to a new requirement.
   * Return true if the current form has unsaved changes — the pane will show
   * a confirmation dialog instead of proceeding immediately.
   */
  dirtyCheck?: () => boolean;
  onSaveAndExit?: () => Promise<boolean> | boolean;
}

export interface ReqStatusHeaderProps {
  /** Active tab key — used to derive the default title when title is not provided */
  activeTab?: string;
  /** Override the auto-derived title */
  title?: string;
  /** Legend text for mandatory requirements. Defaults to '* Mandatory Requirement' */
  mandatoryLegendText?: string;
  layout?: 'row' | 'column';
}

export interface FormPaneProps {
  /** Form body (e.g. FaasRequirement) */
  formContentSlot?: (props: FormContentSlotProps) => ReactNode;
  /** Action controls in the header row (e.g. status select, download) */
  formHeaderActionsSlot?: (props: FormHeaderActionsSlotProps) => ReactNode;
  /** Shown when nothing is selected */
  emptyStateSlot?: ReactNode;
  /** Imperative store handle forwarded to slot render-prop functions */
  storeApi: OnboardingStoreApi;
}

export interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Called when the user clicks the confirm button.
   * Receives the typed comment (may be empty string).
   */
  onConfirm: (comment: string) => void;
  /** Optional warning text rendered above the textarea */
  warningText?: string;
  /** Label for the confirm button. Defaults to 'Update Now' */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to 'Cancel' */
  cancelLabel?: string;
  /** When true, confirm is blocked until comment has non-whitespace text */
  commentRequired?: boolean;
}

export interface RequirementFormPlaceholderProps {
  /** 'loading' shows a skeleton, 'empty' shows the "select a requirement" message */
  variant: 'loading' | 'empty';
  /** Override the default message */
  message?: string;
  /** Override the default sub-message */
  subMessage?: string;
  /** Custom content (completely replaces the built-in rendering) */
  children?: ReactNode;
}
