import React from 'react';
import { BaseComponentProps } from '../../../../utilities';

export type TabType = 'primary' | 'secondary' | 'tertiary' | 'switcher';

/**
 * Visual variants applied on top of a given tab type.
 *
 * - `primary` / `info` – existing variants.
 * - `custom` – allows callers to fully control spacing and colors via props.
 */
export type TabVariant = 'primary' | 'info' | 'custom';

export type Tab = {
  title: string | React.ReactNode;
  name?: string;
  icon?: React.ReactNode;
  badge?: number;
  totalCount?: number; // Added for badge logic
  query?: string;
  href?: string;
  subtext?: string | number | React.ReactNode;
  tabClassName?: string;
};

export interface TabsProps extends BaseComponentProps {
  tabs: Tab[];
  activeIndex?: number;
  onTabChange?: (index: number, query?: string) => void;
  className?: string;
  disabled?: boolean;
  height?: string;
  type?: TabType;
  position?: 'center' | 'left';
  id?: string;
  useScrollButtons?: boolean;
  bottomBorderReq?: boolean;
  bottomBorderClass?: string;
  contentClassName?: string;
  /**
   * High‑level visual variant for the tabs.
   *
   * Use `custom` together with the styling props below to achieve
   * bespoke layouts like the "Discover / My Jobs" segmented control.
   */
  variant?: TabVariant;
  iconOnly?: boolean;
  children?: any;

  /**
   * Applies horizontal spacing between tab items (e.g. `gap-2`, `space-x-3`).
   * Used primarily with `variant="custom"` on switcher / pill style tabs.
   */
  tabGapClassName?: string;

  /**
   * Extra classes applied to a **selected** tab (text color, background, etc).
   * Especially useful with `variant="custom"` to match specific comps.
   */
  activeTabClassName?: string;

  /**
   * Extra classes applied to an **unselected** tab.
   */
  inactiveTabClassName?: string;

  /**
   * Tertiary only – text color classes for selected / unselected states.
   * Defaults to `text-primary` / `text-gray-700` when omitted.
   */
  tertiaryActiveTextClassName?: string;
  tertiaryInactiveTextClassName?: string;

  /**
   * Tertiary only – underline / border color classes for selected /
   * unselected states. Selected defaults to `border-primary`, unselected
   * falls back to `bottomBorderClass` or `border-[#D2D9E5]`.
   */
  tertiaryActiveUnderlineClassName?: string;
  tertiaryInactiveUnderlineClassName?: string;
}
