export type TreeNode = {
  id: string;
  label: string;
  value: string;
  checked?: boolean;
  intermediate?: boolean;
  hasChildren: boolean;
  disabled?: boolean;
  children: TreeNode[];
};

export type Props = {
  queryKey?: string[];
  fetchDataOnScroll?: ({
    params,
    debouncedSearch,
  }: {
    params: any;
    debouncedSearch: string;
  }) => Promise<{ data: TreeNode[]; totalCount: number }>;
  onChange?: (checked: TreeNode[], parentReset?: boolean) => void;
  placeholder?: string;
  label?: string;
  dropIcon?: any;
  defaultValues?: TreeNode[];
  isFilter?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearButtonReq?: boolean;
  staticDropdown?: boolean;
  clearList?: string[];
  closeButtonReq?: boolean;
  showSelectedItems?: boolean;
  buttonElement?: any;
  options?: any;
  clearBit?: any;
  id?: string;
  infoMsg?: string;
  maxHeightForMenuItems?: string;
  multiple?: boolean;
  detachedBox?: boolean;
  disableChildIfParentIsChecked?: boolean;
  autoHierarchySelection?: boolean;
  canInitialFetch?: boolean;
  maxWidth?: string;
  specificSearchToolTipText?: string;
  isDarkTheme?: boolean;
  selectParentOnChildSelect?: boolean;
  hideLabelOnSelect?: boolean;
  buttonElementClass?: string;
  disabledLabel?: string;
};
