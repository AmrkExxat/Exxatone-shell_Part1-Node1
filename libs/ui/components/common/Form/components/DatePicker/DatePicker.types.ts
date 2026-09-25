import { type ReactNode } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

export type dateFormatTypes =
  'MMM, dd yyyy' | 'MMM dd, YYYY' | 'dd/MM' | 'dd/MM/yyyy' | 'MM' | 'yyyy' | 'yy' | 'MMM';
export type calendarTypes =
  'Date Picker' | 'Month Picker' | 'Month Year Picker' | 'Year Picker' | 'Time Picker';

export interface datePickerProps {
  calendarType?: calendarTypes;
  datefmt?: dateFormatTypes;
  id: string;
  testid?: string;
  label?: string;
  className?: string;
  selected: Date | null;
  registerReturn?: UseFormRegisterReturn<string>;
  disabled?: boolean;
  required?: boolean;
  minDate?: Date | null;
  maxDate?: Date;
  showTimeSelect?: boolean;
  placeholderText?: string;
  placeholder?: string;
  ariaDescribedBy?: string;
  calendarLabel?: string;
  isClearable?: boolean;
  hintText?: string;
  onChange?: (_: Date | null) => void;
  onBlur?: () => void;
  onChangeRaw?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  value?: string;
  wrapperClassName?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
  LeadingIcon?: ReactNode;
  dateFormat?: string;
  showMonthYearPicker?: boolean;
  showYearPicker?: boolean;
  showTimeSelectOnly?: boolean;
  isDisableTextUI?: boolean;
  [key: string]: any; // Allow additional props to be passed through
}
