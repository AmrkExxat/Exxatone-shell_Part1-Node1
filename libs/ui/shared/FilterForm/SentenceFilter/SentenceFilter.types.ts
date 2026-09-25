export interface SentenceFilterConfig {
  id: string;
  type:
    | 'treeDropdown'
    | 'dropdown'
    | 'infiniteDropdown'
    | 'infiniteDynamicDropdown'
    | 'dateRange'
    | 'datePicker'
    | 'text';
  label: string;
  placeholder?: string;
  options?: any[];
  defaultValue?: any;
  defaultValues?: any[];
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  required?: boolean;
  dependency?: string; // ID of the filter this depends on
  dataProvider?: (dependencyValue?: any) => Promise<any[]> | any[]; // Method to fetch data when dependency changes
  width?: string;
  icon?: any;
  callback?: any; // For infinite dropdowns
  canInitialFetch?: boolean;
  // Additional props for different filter types
  minDate?: Date;
  maxDate?: Date;
  startLabel?: string;
  endLabel?: string;
  buttonElement?: React.ReactElement;
  optionRenderer?: any;
  closeButtonReq?: boolean;
  clearButtonReq?: boolean;
  detachedBox?: boolean;
  hideLabelOnSelect?: boolean;
  disableChildIfParentIsChecked?: boolean;
  maxHeightForMenuItems?: string;
  isChip?: boolean;
  selectAllRequired?: boolean;
  rules?: any;
  showSelected?: boolean;
  class?: string;
  dropdownClass?: string;
  datePickerWrapperClass?: string;
}

export interface SentenceFilterProps {
  config: SentenceFilterConfig[];
  onFilterChange: (values: Record<string, any>) => void;
  onFilterReset?: () => void;
  sessionKey?: string; // Key for session storage
  className?: string;
  resetLabel?: string;
  sentence?: string; // Template sentence with placeholders like "Show {filter1} from {filter2} to {filter3}"
  loadingStates?: Record<string, boolean>; // Track loading states for dynamic filters
}

export interface SentenceFilterState {
  filterValues: Record<string, any>;
  clearBit: number;
  isResetEnabled: boolean;
  dynamicConfigs: Record<string, SentenceFilterConfig>;
  loadingFilters: Record<string, boolean>;
}
