/* eslint-disable prettier/prettier */

import { ReactNode } from 'react';

export class TreeSelectOption {
  id: string = '';
  label: string = '';
  value: string = '';
  isChecked: boolean = false;
  isPartialChecked?: boolean = false;
  isExpanded: boolean = false;
  parentId?: string;
  isParent?: boolean;
  isIndeterminate?: boolean;
  isChild?: boolean;
  children?: TreeSelectOption[] = [];
  showSectionHeader?: boolean = false;
  section?: string = '';
}

export type TreeSelectProps = {
  id?: string;
  testid?: string;
  label?: string;
  options: TreeSelectOption[];
  'aria-describedby'?: string;
  isRequired?: boolean;
  defaultValues?: string[];
  disabled?: boolean;
  placeholder?: string;
  reset?: boolean;
  type?: 'checkbox' | 'radio';
  onBlur?: () => {};
  // Define the onChange method
  onChange: (selectedNodes: TreeSelectOption[]) => void;
  optionsContainerClassName?: string;
  ariaLabel?: string;
  labelledby?: string;
  bifurcate?: true;
  sections?: string[];
  sectionLabelClass?: string;
  hideSecondaryLabel?: boolean;
  secondaryLabel?: string;
  footerButtonNode?: ReactNode;
  isDisableTextUI?: boolean;
  showMoreProp?: any;
  prevDefaultData?: any;
};
