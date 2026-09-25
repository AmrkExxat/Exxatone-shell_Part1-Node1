export interface ExxatTreeGridProps {
  columns: any[];
  height?: number;
  fetchData: (params: any) => any;
  children?: React.ReactNode;
  configureColumns?: boolean;
  parentMapping?: string;
  childMapping?: string;
  pagingSize?: number;
  allowReordering?: boolean;
  allowSorting?: boolean;
  allowMultiSorting?: boolean;
  allowResizing?: boolean;
  allowFiltering?: boolean;
  allowKeyboard?: boolean;
  allowSelection?: boolean;
  checkboxSelection?: boolean;
  checkboxMode?: 'Default' | 'ResetOnRowClick';
  checkboxSelectionType?: 'Single' | 'Multiple';
  showSelectAll?: boolean;
  hierarchySelect?: boolean;
  recordPrimaryKey?: string;
  metaData?: any;
  onColumnSettingsSave?: (columns: any[]) => void;
  onCheckboxSelect?: (rowData: any, isSelected: boolean) => void;
  treeColumnIndex?: number;
  selectedIds?: string[];
  autoCheckHierarchy?: boolean;
  showCheckbox?: boolean;
  uniqueEntityName?: string;
  saveUserInteraction?: boolean;
  id?: string;
  interactionKey?: string;
  clearAllBit?: number;
  /** Disables header + row checkboxes (useful for "select across pages") */
  disableAllSelection?: boolean;
}
