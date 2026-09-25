import { type ReactNode } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

export type dateTimeFormatTypes =
  | 'dd/MM/yyyy HH:mm'
  | 'dd/MM/yyyy hh:mm aa'
  | 'MM/dd/yyyy HH:mm'
  | 'MM/dd/yyyy hh:mm aa'
  | 'yyyy-MM-dd HH:mm'
  | 'yyyy-MM-dd HH:mm:ss'
  | 'MMM dd, yyyy hh:mm aa'
  | 'dd/MM/yyyy'
  | 'HH:mm'
  | 'hh:mm aa'
  | string;

export interface dateTimePickerProps {
  id: string;
  testid?: string;
  label?: string;
  className?: string;
  wrapperClassName?: string;
  /** Controlled selected datetime */
  selected?: Date | null;
  /**
   * Display + input mask format (date-fns tokens).
   * Separators from this format are inserted automatically while typing.
   * @default 'dd/MM/yyyy HH:mm'
   */
  dateFormat?: dateTimeFormatTypes;
  /** Alias for dateFormat */
  format?: dateTimeFormatTypes;
  disabled?: boolean;
  required?: boolean;
  isClearable?: boolean;
  hintText?: string;
  placeholder?: string;
  placeholderText?: string;
  calendarLabel?: string;
  ariaDescribedBy?: string;
  LeadingIcon?: ReactNode;
  registerReturn?: UseFormRegisterReturn<string>;
  isDisableTextUI?: boolean;
  prevDefaultData?: { label: string; data: Date | null };
  minDate?: Date | null;
  maxDate?: Date | null;
  minTime?: Date;
  maxTime?: Date;
  /** @default true */
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  /** Minutes between time options. @default 15 */
  showTimeInput?: boolean;
  timeIntervals?: number;
  timeCaption?: string;
  /** Replaces default header with month/year trigger + popover year grid (CustomDatePicker pattern). */
  showMonthDropdown?: boolean;
  /** Replaces default header with month/year trigger + popover year grid (CustomDatePicker pattern). */
  showYearDropdown?: boolean;
  useShortMonthInDropdown?: boolean;
  /** When `showTimeSelectOnly` is true, use 12-hour time (`hh:mm aa`) instead of 24-hour (`HH:mm`). */
  use12HourFormat?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  onChange?: (value: Date | null) => void;
  onBlur?: (event?: React.FocusEvent) => void;
  onClear?: () => void;
  onChangeRaw?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}
