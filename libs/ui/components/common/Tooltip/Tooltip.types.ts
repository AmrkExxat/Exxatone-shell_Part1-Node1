export type TooltipProps = {
  triggerElement?: () => React.JSX.Element;
  tooltip?: () => React.JSX.Element;
  truncate?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  tabIndex?: 0 | -1;
  ariaLabel?: string;
  id?: string;
  triggerWrapperClass?: string;
};
