import { BaseComponentProps } from '../../../../utilities';

export interface OnToggleType {
  event: React.MouseEvent<HTMLButtonElement>;
  isExpanded: boolean;
}

export interface AccordionTypes extends BaseComponentProps {
  header: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  showToggleIcon?: boolean;
  expanded?: boolean;
  onToggle?: (emitData: OnToggleType) => void;
  startingButton?: boolean;
  contentClass?: string;
  accordionWrapperClass?: string;
  treeIcon?: boolean;
  iconSize?: string;
  toggleOnCount?: number | null;
  keepMounted?: boolean;
  headerPrefix?: React.ReactNode;
  isHeaderButton?: boolean;
  /** When true, clicks on interactive header elements (buttons, inputs, etc.) do not toggle the accordion. Defaults to false for backward compatibility. */
  preventHeaderToggleOnInteractiveClick?: boolean;
  /** When true, the accordion `expanded` prop is synced on change (used to restore state after drag). */
  syncExpanded?: boolean;
}
