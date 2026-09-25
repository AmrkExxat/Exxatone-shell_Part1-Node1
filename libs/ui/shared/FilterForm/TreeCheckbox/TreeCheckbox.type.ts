export interface NodeType {
  id: string;
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  children?: NodeType[];
  type?: string;
  hidden?: boolean;
  disabled?: boolean;
  expanded?: boolean; // meant to track node expansion state
  metadata?: Record<string, any>; // For custom data
  inSelectionList?: boolean; // A flag to to identify nodes in the dropdown selection list
}

export interface TreeCheckboxProps {
  options: NodeType[];
  defaultSelections: NodeType[];
  parentLabel?: string;
  wrapperClass?: string;
  onChange: (selectedNodes: NodeType[], checkBoxEvent?: any) => void;
  requiresInitialOnChange?: boolean;
  canHideNodes?: boolean;
  isLoading?: boolean; // Indicate Loading state
  expandAll?: boolean; // Initially expand all nodes
  disableAll?: boolean; // Disable entire tree
  searchTerm?: string; // Search to filter nodes
  maintainFocusWithinSelectionList?: boolean; // to control focus behavior
  onFocusChange?: (nodeId: string) => void; // Callback when focus changes
  onEmptySelection?: () => void; // Callback when all selections are cleared
  renderCustomNode?: (
    node: NodeType,
    handlers: {
      handleCheck: (node: NodeType, checked: boolean) => void;
      handleExpand: (node: NodeType) => void;
    }
  ) => React.ReactNode; // Custom node renderer
  onExpand?: (node: NodeType, isExpanded: boolean) => void; // Expansion callback
  showCheckboxOnly?: boolean; // Hide labels/text
  isDarkTheme?: boolean;
}

let debounceTimeout: ReturnType<typeof setTimeout>;

export const debounceSearch = (callback: (value: string) => void, delay: number) => {
  return (value: string) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      callback(value);
    }, delay);
  };
};
