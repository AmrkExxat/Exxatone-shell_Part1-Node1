import { useCallback, useState, useRef, useEffect } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import {
  CustomDateRangePickerOptionType,
  CustomDateRangePickerTypes,
} from './CustomDateRangePickerTypes';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleMinus, faXmark } from '@fortawesome/pro-light-svg-icons';
import DateRangePickerContent from '../DateRangePicker/DateRangePickerContent';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';

const CustomDateRangePicker = (props: CustomDateRangePickerTypes) => {
  const {
    id,
    options,
    minDate,
    maxDate,
    defaultValue,
    label,
    icon,
    placeholder,
    disabled,
    className = '',
    clearBit,
    extraFilter,
    hideFilter,
    hidden,
    clearList,
    onChange,
    addedFilter,
    iconClassName,
    selectedIconClassName,
    labelClassName,
    optionClassName,
    closeButtonClassName,
    dateInputClassName,
    tabButtonClassName,
    isDarkTheme = false,
  } = props;

  const [startDate, setStartDate] = useState(
    defaultValue?.startDate ? new Date(defaultValue.startDate) : null
  );

  const [endDate, setEndDate] = useState(
    defaultValue?.endDate ? new Date(defaultValue.endDate) : null
  );

  const [tabIndex, setTabIndex] = useState<number>(0);

  const [startMonthOpen, setStartMonthOpen] = useState(false);

  const [endMonthOpen, setEndMonthOpen] = useState(false);

  const [startYearOpen, setStartYearOpen] = useState(false);

  const [endYearOpen, setEndYearOpen] = useState(false);

  const [startYearRangeStart, setStartYearRangeStart] = useState(() => {
    const baseYear = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear();
    const minYear = 2023;
    return Math.max(baseYear - 10, minYear);
  });

  const [endYearRangeStart, setEndYearRangeStart] = useState(() => {
    const baseYear = endDate ? new Date(endDate).getFullYear() : new Date().getFullYear();
    const minYear = 2023;
    return Math.max(baseYear - 10, minYear);
  });

  const [focusedMonthIndex, setFocusedMonthIndex] = useState(0);
  const [focusedYearIndex, setFocusedYearIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState<CustomDateRangePickerOptionType | null>(
    defaultValue?.selectedOption || null
  );

  const [tempSelectedOption, setTempSelectedOption] =
    useState<CustomDateRangePickerOptionType | null>(defaultValue?.selectedOption || null);

  // Reset functionality
  useEffect(() => {
    if (clearBit && clearBit > 0) {
      parentClear();
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && clearList.includes(id)) {
      parentClear();
    }
  }, [clearList]);

  const parentClear = () => {
    // Reset all state values
    setTempSelectedOption(null);
    setSelectedOption(null);
    setStartDate(null);
    setEndDate(null);
    setTabIndex(0);
    setStartMonthOpen(false);
    setEndMonthOpen(false);
    setStartYearOpen(false);
    setEndYearOpen(false);
    setFocusedMonthIndex(0);
    setFocusedYearIndex(0);

    // Trigger onChange with null values
    if (onChange) {
      onChange({}, true);
    }
  };

  // Refs for the date picker components
  const startDateInputRef = useRef<HTMLDivElement>(null);
  const endDateInputRef = useRef<HTMLDivElement>(null);
  const startMonthPopoverRef = useRef<HTMLDivElement>(null);
  const endMonthPopoverRef = useRef<HTMLDivElement>(null);
  const startYearPopoverRef = useRef<HTMLDivElement>(null);
  const endYearPopoverRef = useRef<HTMLDivElement>(null);
  const startMonthButtonRef = useRef<HTMLButtonElement>(null);
  const endMonthButtonRef = useRef<HTMLButtonElement>(null);

  // Function to calculate dates based on option value
  const calculateDatesFromOption = useCallback(
    (optionValue: string) => {
      const now = moment();
      let calculatedStartDate: Date | null = null;
      let calculatedEndDate: Date | null = null;

      switch (optionValue) {
        case 'last_7_days':
          calculatedStartDate = now.clone().subtract(6, 'days').toDate();
          calculatedEndDate = now.toDate();
          break;
        case 'last_14_days':
          calculatedStartDate = now.clone().subtract(13, 'days').toDate();
          calculatedEndDate = now.toDate();
          break;
        case 'last_30_days':
          calculatedStartDate = now.clone().subtract(29, 'days').toDate();
          calculatedEndDate = now.toDate();
          break;
        case 'last_90_days':
          calculatedStartDate = now.clone().subtract(89, 'days').toDate();
          calculatedEndDate = now.toDate();
          break;
        case 'next_30_days':
          calculatedStartDate = now.toDate();
          calculatedEndDate = now.clone().add(29, 'days').toDate();
          break;
        case 'next_60_days':
          calculatedStartDate = now.toDate();
          calculatedEndDate = now.clone().add(59, 'days').toDate();
          break;
        case 'next_90_days':
          calculatedStartDate = now.toDate();
          calculatedEndDate = now.clone().add(89, 'days').toDate();
          break;
        case 'last_24_hours':
          calculatedStartDate = now.clone().subtract(23, 'hours').toDate();
          calculatedEndDate = now.toDate();
          break;
        case 'last_month':
          calculatedStartDate = now.clone().subtract(30, 'days').toDate();
          calculatedEndDate = now.toDate();
          break;
        case 'custom_range':
          // For custom range, we'll use the current startDate and endDate values
          calculatedStartDate = startDate;
          calculatedEndDate = endDate;
          break;
        default:
          calculatedStartDate = null;
          calculatedEndDate = null;
      }

      return { startDate: calculatedStartDate, endDate: calculatedEndDate };
    },
    [startDate, endDate]
  );

  const getButtonLabel = useCallback(() => {
    return (
      <div
        className={`filter-text-sm flex flex-row flex-nowrap items-center justify-start gap-1 truncate font-normal`}
      >
        <span>{label}</span>
        {tempSelectedOption && (
          <span className={twMerge('filter-selected-text truncate font-semibold')}>
            | {tempSelectedOption.label}
          </span>
        )}
      </div>
    );
  }, [tempSelectedOption, label]);

  // Helper to determine if a month should be disabled in the month selector
  const isMonthDisabled = (monthIndex: number, isStartDate: boolean, currentYear: number) => {
    if (isStartDate) {
      if (endDate) {
        const endYear = new Date(endDate).getFullYear();
        const endMonth = new Date(endDate).getMonth();
        if (currentYear > endYear) return true;
        if (currentYear === endYear && monthIndex > endMonth) return true;
      }
    } else {
      if (startDate) {
        const startYear = new Date(startDate).getFullYear();
        const startMonth = new Date(startDate).getMonth();
        if (currentYear < startYear) return true;
        if (currentYear === startYear && monthIndex < startMonth) return true;
      }
    }
    return false;
  };

  // Helper to determine if a year should be disabled
  const isYearDisabled = (year: number, isStart: boolean) => {
    return year < 2023;
  };

  // Generate year range for year selector
  const generateYearRange = (isStart: boolean) => {
    const start = isStart ? startYearRangeStart : endYearRangeStart;
    return Array.from({ length: 20 }, (_, i) => start + i);
  };

  // Handle month interaction (click/keyboard)
  const handleMonthInteraction = (
    e: React.MouseEvent | React.KeyboardEvent,
    monthIndex: number,
    changeMonth: (month: number) => void,
    isStart: boolean,
    isKeyboard?: boolean
  ) => {
    changeMonth(monthIndex);
    if (isStart) {
      setStartMonthOpen(false);
    } else {
      setEndMonthOpen(false);
    }
  };

  // Handle year interaction (click/keyboard)
  const handleYearInteraction = (
    e: React.MouseEvent | React.KeyboardEvent,
    year: number,
    increaseYear: () => void,
    decreaseYear: () => void,
    date: Date,
    isStart: boolean,
    isKeyboard?: boolean
  ) => {
    // Use the handleYearSelection function to properly handle year selection
    handleYearSelection(year, increaseYear, decreaseYear, date, isStart);
  };

  // Handle year navigation (prev/next)
  const handleYearNavigation = (direction: 'prev' | 'next', isStart: boolean) => {
    if (isStart) {
      if (direction === 'prev' && startYearRangeStart > 2023) {
        setStartYearRangeStart(startYearRangeStart - 20);
      } else if (direction === 'next') {
        setStartYearRangeStart(startYearRangeStart + 20);
      }
    } else {
      if (direction === 'prev' && endYearRangeStart > 2023) {
        setEndYearRangeStart(endYearRangeStart - 20);
      } else if (direction === 'next') {
        setEndYearRangeStart(endYearRangeStart + 20);
      }
    }
  };

  // Handle date key down events
  const handleDateKeyDown = (e: React.KeyboardEvent, type: 'start' | 'end') => {
    // Implement keyboard navigation logic
  };

  // Handle input change for dates
  const handleInputChange = (
    date: Date | null,
    type: 'start' | 'end',
    parentReset?: boolean,
    isInline?: boolean
  ) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  // Handle year selection - this opens the month selector after year is selected
  const handleYearSelection = (
    selectedYear: number,
    increaseYear: () => void,
    decreaseYear: () => void,
    currentDate: Date,
    isStartDate: boolean
  ) => {
    // Calculate how many years to change based on the date picker's current year
    const currentYear = currentDate.getFullYear();
    const yearDiff = selectedYear - currentYear;

    // Use increaseYear or decreaseYear based on the difference
    if (yearDiff > 0) {
      for (let i = 0; i < yearDiff; i++) {
        increaseYear();
      }
    } else if (yearDiff < 0) {
      for (let i = 0; i < Math.abs(yearDiff); i++) {
        decreaseYear();
      }
    }

    if (isStartDate) {
      setStartYearOpen(false);
      setStartMonthOpen(true);
      const selectedMonth = startDate ? new Date(startDate).getMonth() : new Date().getMonth();
      setFocusedMonthIndex(selectedMonth);
      startMonthButtonRef?.current?.setAttribute('aria-expanded', 'true');
    } else {
      setEndYearOpen(false);
      setEndMonthOpen(true);
      const selectedMonth = endDate ? new Date(endDate).getMonth() : new Date().getMonth();
      setFocusedMonthIndex(selectedMonth);
      endMonthButtonRef?.current?.setAttribute('aria-expanded', 'true');
    }
  };

  // Custom month navigation functions
  const handlePreviousMonth = (
    date: Date,
    changeMonth: (month: number) => void,
    decreaseYear: () => void
  ) => {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    // Check if going to previous month would result in a date before January 2023
    if (currentYear === 2023 && currentMonth === 0) {
      // We're at January 2023, don't allow going to December 2022
      return;
    }

    if (currentMonth === 0) {
      // If it's January, go to December of previous year
      decreaseYear();
      changeMonth(11); // December
    } else {
      // Otherwise just go to previous month
      changeMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (
    date: Date,
    changeMonth: (month: number) => void,
    increaseYear: () => void
  ) => {
    const currentMonth = date.getMonth();
    if (currentMonth === 11) {
      // If it's December, go to January of next year
      increaseYear();
      changeMonth(0); // January
    } else {
      // Otherwise just go to next month
      changeMonth(currentMonth + 1);
    }
  };

  useEffect(() => {
    if (tempSelectedOption?.value === 'custom_range' && startDate && endDate && onChange) {
      setSelectedOption(tempSelectedOption);

      onChange({
        selectedOption: tempSelectedOption,
        startDate: startDate,
        endDate: endDate,
      });
    }
  }, [startDate, endDate]);

  // Wrapper functions for DateRangePickerContent callbacks
  const handleStartDateChange = (date: Date | null) => {
    handleInputChange(date, 'start');
  };

  const handleEndDateChange = (date: Date | null) => {
    handleInputChange(date, 'end');
  };

  // Don't render if hidden
  if (hidden) {
    return null;
  }

  return (
    <Popover className={`relative ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}>
      {({ open, close }) => (
        <>
          <PopoverButton
            id={id}
            suppressHydrationWarning={true}
            disabled={disabled}
            className={twMerge(
              `filter-round grid h-[34px] ${open && tempSelectedOption ? 'selected-opened-filter' : open && !tempSelectedOption ? 'opened-filter' : !open && tempSelectedOption ? 'selected-filter' : !tempSelectedOption && !open ? 'newState-filter' : ''} w-max ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} filter-text-sm grid-cols-12 items-center border-[1px] font-medium ${tempSelectedOption ? 'filter-selected-text' : ''} ${className}`
            )}
          >
            <div className="col-span-10 flex flex-row justify-start gap-2 px-2">
              {icon && (
                <FontAwesomeIcon
                  icon={icon as any}
                  className={twMerge(
                    `filter-icon`,
                    tempSelectedOption ? (selectedIconClassName ?? '') : (iconClassName ?? '')
                  )}
                />
              )}
              {getButtonLabel()}
            </div>
            {selectedOption && (
              <div className="col-span-2" suppressHydrationWarning={true}>
                <button
                  aria-label={`Clear selection for ${label}`}
                  className="focus-indicator absolute top-1/2 right-3 z-10 flex -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation();

                    // Reset all state values
                    setSelectedOption(null);
                    setTempSelectedOption(null);
                    setStartDate(null);
                    setEndDate(null);
                    setTabIndex(0);
                    setStartMonthOpen(false);
                    setEndMonthOpen(false);
                    setStartYearOpen(false);
                    setEndYearOpen(false);
                    setFocusedMonthIndex(0);
                    setFocusedYearIndex(0);

                    // Close the panel
                    close();

                    // Trigger onChange with null values
                    if (onChange) {
                      onChange({});
                    }
                  }}
                  disabled={disabled}
                >
                  <FontAwesomeIcon
                    icon={isDarkTheme ? faXmark : faCircleXmark}
                    className={twMerge(
                      `filter-selected-text h-5 w-5`,
                      selectedOption ? (selectedIconClassName ?? '') : (iconClassName ?? '')
                    )}
                  />
                </button>
              </div>
            )}
            {addedFilter && !selectedOption && (
              <div className="col-span-2">
                <button
                  className="focus-indicator absolute top-1/2 right-3 z-10 flex -translate-y-1/2"
                  onClick={hideFilter}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && hideFilter) {
                      hideFilter();
                    }
                  }}
                  aria-label={`hide ${label} filter`}
                >
                  <FontAwesomeIcon icon={faCircleMinus} className={`h-4 w-4`} />
                </button>
              </div>
            )}
          </PopoverButton>
          <PopoverPanel
            id={id ? `${id}-panel` : undefined}
            className="bg-card absolute left-0 z-50 mt-1 flex w-max min-w-[270px] flex-col rounded-sm border shadow-md"
          >
            <label
              role="heading"
              aria-level={3}
              // className="mb-1 flex justify-between px-2 pt-2 text-[.8rem] font-semibold text-gray-500"
              className={twMerge(
                'drop-panel-label mb-1 flex justify-between px-2 pt-2 text-[.8rem] font-semibold',
                labelClassName ?? ''
              )}
            >
              {label}
            </label>
            <div className="max-h-[calc(100vh_-_300px)] space-y-1 overflow-auto">
              <ul role="list" className="pb-2">
                {options?.map((option: CustomDateRangePickerOptionType) => (
                  <li
                    key={option?.id}
                    className={twMerge(
                      `filter-text-sm cursor-pointer p-2 ${isDarkTheme ? 'hover:bg-[#E8EAF6]' : 'hover:bg-gray-100'}`,
                      tempSelectedOption?.id === option?.id
                        ? isDarkTheme
                          ? 'bg-[#E8EAF6]'
                          : 'bg-gray-100'
                        : '',
                      optionClassName ?? ''
                    )}
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                      setTabIndex(0);
                      setStartMonthOpen(false);
                      setEndMonthOpen(false);
                      setStartYearOpen(false);
                      setEndYearOpen(false);
                      setFocusedMonthIndex(0);
                      setFocusedYearIndex(0);

                      setTempSelectedOption(option);

                      // Calculate dates based on the selected option
                      const { startDate: calculatedStartDate, endDate: calculatedEndDate } =
                        calculateDatesFromOption(option?.value);

                      // Update state
                      if (option?.value !== 'custom_range') {
                        setStartDate(calculatedStartDate);
                        setEndDate(calculatedEndDate);

                        setSelectedOption(option);

                        if (onChange) {
                          onChange({
                            selectedOption: option,
                            startDate: calculatedStartDate,
                            endDate: calculatedEndDate,
                          });
                        }

                        close();
                      }
                    }}
                  >
                    {option?.label}
                  </li>
                ))}
              </ul>

              {tempSelectedOption?.value === 'custom_range' && (
                <div className="flex items-center justify-start border">
                  <DateRangePickerContent
                    topLabel="Select Custom Date Range"
                    startLabel="Start Date"
                    endLabel="End Date"
                    startDate={startDate}
                    endDate={endDate}
                    tabIndex={tabIndex}
                    startPlaceholderText="Select start date"
                    endPlaceholderText="Select end date"
                    minDate={minDate}
                    maxDate={maxDate}
                    onTabChange={setTabIndex}
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
                    startDateInputRef={startDateInputRef}
                    endDateInputRef={endDateInputRef}
                    startMonthPopoverRef={startMonthPopoverRef}
                    endMonthPopoverRef={endMonthPopoverRef}
                    startYearPopoverRef={startYearPopoverRef}
                    endYearPopoverRef={endYearPopoverRef}
                    startMonthButtonRef={startMonthButtonRef}
                    endMonthButtonRef={endMonthButtonRef}
                    focusedMonthIndex={focusedMonthIndex}
                    startYearOpen={startYearOpen}
                    endYearOpen={endYearOpen}
                    startMonthOpen={startMonthOpen}
                    endMonthOpen={endMonthOpen}
                    startYearRangeStart={startYearRangeStart}
                    endYearRangeStart={endYearRangeStart}
                    focusedYearIndex={focusedYearIndex}
                    setFocusedMonthIndex={setFocusedMonthIndex}
                    setStartYearOpen={setStartYearOpen}
                    setEndYearOpen={setEndYearOpen}
                    setStartMonthOpen={setStartMonthOpen}
                    setEndMonthOpen={setEndMonthOpen}
                    setFocusedYearIndex={setFocusedYearIndex}
                    onMonthInteraction={handleMonthInteraction}
                    onYearInteraction={handleYearInteraction}
                    onYearNavigation={handleYearNavigation}
                    generateYearRange={generateYearRange}
                    isMonthDisabled={isMonthDisabled}
                    isYearDisabled={isYearDisabled}
                    handlePreviousMonth={handlePreviousMonth}
                    handleNextMonth={handleNextMonth}
                    handleDateKeyDown={handleDateKeyDown}
                    handleInputChange={handleInputChange}
                    dateInputClassName={dateInputClassName ?? ''}
                    tabButtonClassName={tabButtonClassName ?? ''}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-row items-center justify-end border-t p-2">
              <button
                tabIndex={0}
                aria-label={`Close ${label}`}
                type="button"
                className={twMerge(
                  'filter-text-primary hover:text-primary/80 text-xs font-medium',
                  closeButtonClassName ?? ''
                )}
                onClick={() => {
                  close();
                }}
              >
                Close
              </button>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};

export default CustomDateRangePicker;
