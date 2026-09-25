export type CustomDateRangePickerOptionType = {
  id: string;
  label: string;
  value: any;
};

export interface CustomDateRangePickerTypes {
  id?: string;
  options: CustomDateRangePickerOptionType[];
  defaultValue?: {
    selectedOption: CustomDateRangePickerOptionType;
    startDate: Date | null;
    endDate: Date | null;
  };
  minDate?: Date;
  maxDate?: Date;
  label: string;
  icon?: any;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearBit?: number;
  extraFilter?: boolean;
  hideFilter?: () => void;
  hidden?: boolean;
  clearList?: string[];
  onChange?: (
    data: {
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    },
    parentResent?: boolean
  ) => void;
  iconClassName?: string;
  selectedIconClassName?: string;
  labelClassName?: string;
  optionClassName?: string;
  closeButtonClassName?: string;
  dateInputClassName?: string;
  tabButtonClassName?: string;
  isDarkTheme?: boolean;
}
