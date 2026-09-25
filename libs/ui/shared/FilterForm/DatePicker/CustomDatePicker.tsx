import {
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faCircleMinus,
  faCircleXmark,
  faCircleInfo,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateInputMask from '../MaskedInput/MaskInput';
import Tooltip from '../../../components/common/Tooltip/Tooltip';
import { Button } from '../../../components/common/Buttons';
import { twMerge } from 'tailwind-merge';
import { RenderPreviousData } from '../../../components/common';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface DatePickerTypeProps {
  showMonthYearPicker?: boolean;
  showYearPicker?: boolean;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
}

const CustomDatePicker = ({
  onChange,
  defaultValue,
  topLabel = 'Date',
  placeholderText = 'Select or Enter date',
  minDate,
  maxDate,
  dropIcon,
  dropdownClass = '',
  clearBit,
  extraFilter = false,
  hideFilter,
  hidden,
  buttonElement,
  id,
  required = false,
  datePickerWrapperClass = '',
  showTopLabel = true,
  disabled = false,
  selectDefaultValue = 0,
  onBlur = (e: any) => {},
  clearList,
  useUnderlineStyle = false,
  addedFilter = false,
  disableYearsBefore2023 = true,
  portal = false,
  isDarkTheme = false,
  isPlainTheme = false,
  displayFormat = 'MMM DD, yyyy',
  pickerDateFormat = 'MMM dd, yyyy',
  pickerTypeProps = {},
  yearRangeSectionStyles = {} as {
    container?: string;
    yearButton?: string;
    selectedYearButton?: string;
  },
  closeIcon,
  isDisableTextUI = false,
  outerLabel = null,
  prevDefaultData = { label: 'Edited by Site', data: null },
  disabledLabel = '',
  ...props
}: {
  onChange: (selected: any, parentReset?: boolean) => void;
  defaultValue?: any;
  topLabel?: string;
  placeholderText?: string;
  minDate?: any;
  maxDate?: any;
  dropIcon?: any;
  dropdownClass?: string;
  clearBit?: number;
  extraFilter?: boolean;
  hideFilter?: () => void;
  hidden?: boolean;
  buttonElement?: ReactNode;
  id?: string;
  required?: boolean;
  datePickerWrapperClass?: string;
  showTopLabel?: boolean;
  disabled?: boolean;
  selectDefaultValue?: number;
  onBlur?: (e: any) => void;
  clearList?: string[];
  useUnderlineStyle?: boolean;
  addedFilter?: boolean;
  portal?: boolean;
  disableYearsBefore2023?: boolean;
  isDarkTheme?: boolean;
  isPlainTheme?: boolean;
  displayFormat?: string;
  pickerDateFormat?: string;
  pickerTypeProps?: DatePickerTypeProps;
  yearRangeSectionStyles?: { container?: string; yearButton?: string; selectedYearButton?: string };
  closeIcon?: any;
  isDisableTextUI?: boolean;
  outerLabel?: string | null;
  prevDefaultData?: any;
  disabledLabel?: string;
}) => {
  const [selectedDate, setSelectedDate] = useState(defaultValue ? new Date(defaultValue) : null);
  const monthPopoverRef = useRef(null);
  const yearPopoverRef = useRef(null);
  const popoverButtonRef = useRef<HTMLButtonElement | null>(null);
  const monthButtonRef = useRef(null);
  const dateInputRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Store focusable elements in the date picker
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableElementRef = useRef(null);
  const lastFocusableElementRef = useRef(null);
  const lastKeyboardNavRef = useRef<string | null>(null);
  const [panelBounding, setPanelBounding] = useState<any>(null);
  const [initialRender, setInitialRender] = useState<boolean>(
    props?.initRender !== undefined ? props.initRender : true
  );
  const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);
  const [yearSelectorOpen, setYearSelectorOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [shouldKeepFocusOnMonthButton, setShouldKeepFocusOnMonthButton] = useState(false);
  const [focusedMonthIndex, setFocusedMonthIndex] = useState(0);
  const [focusedYearIndex, setFocusedYearIndex] = useState(0);
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    // Initialize based on selected date or current date, but not before 2023 if restriction is enabled
    const baseYear = selectedDate ? new Date(selectedDate).getFullYear() : new Date().getFullYear();
    const minYear = disableYearsBefore2023 ? 2023 : baseYear - 100; // Allow 100 years back if restriction is disabled
    return Math.max(baseYear - 10, minYear);
  });
  const datePickerThemeStyles = useMemo(() => {
    if (isDarkTheme) {
      return {
        headerBg: 'var(--background-normal-default, white)',
        selectedBg: '#39393c',
        focusBg: 'rgba(54, 54, 54, 0.3)',
        focusRing: '#39393c',
        closeIconBg: '#39393c',
      };
    } else if (isPlainTheme) {
      return {
        headerBg: 'var(--background-normal-default, white)',
        selectedBg: '#39393c',
        focusBg: '#f0f0f0',
        focusRing: '#39393c',
        closeIconBg: '#39393c',
        color: '#000000',
      };
    }

    return {
      headerBg: 'var(--background-normal-default, white)',
      selectedBg: 'var(--color-primary, #3f51b5)',
      focusBg: 'color-mix(in srgb, var(--color-primary, #3f51b5) 30%, transparent)',
      focusRing: 'var(--color-primary, #3f51b5)',
      closeIconBg: 'var(--color-primary, #3f51b5)',
    };
  }, [isDarkTheme, isPlainTheme]);

  useEffect(() => {
    if (popoverButtonRef?.current) {
      setPanelBounding((popoverButtonRef?.current as any)?.getBoundingClientRect());
    }
  }, [popoverButtonRef]);

  useEffect(() => {
    if (selectDefaultValue && defaultValue) {
      setSelectedDate(new Date(defaultValue));
    }
  }, [selectDefaultValue]);

  // Handle clicks outside the month and year selectors
  useEffect(() => {
    if (!monthSelectorOpen && !yearSelectorOpen) return;

    const handleClickOutside = (event) => {
      if (
        !monthPopoverRef?.current?.contains(event.target) &&
        !yearPopoverRef?.current?.contains(event.target) &&
        !monthButtonRef?.current?.contains(event.target)
      ) {
        setMonthSelectorOpen(false);
        setYearSelectorOpen(false);
        monthButtonRef?.current?.setAttribute('aria-expanded', 'false');

        // This ensures that only after reload the focus shifts. It resolved some focus issue we previously had.
        requestAnimationFrame(() => {
          monthButtonRef?.current?.focus();
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [monthSelectorOpen, yearSelectorOpen]);

  // Handle clearing the date
  useEffect(() => {
    if (clearBit > 0) {
      handleInputChange(null, true);
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && clearList.includes(id)) {
      handleInputChange(null, true);
    }
  }, [clearList]);

  // Handle extra filter display
  useEffect(() => {
    if (extraFilter && hidden === false && !initialRender) {
      if (popoverButtonRef?.current) {
        popoverButtonRef?.current?.click();
      }
    } else if (initialRender) {
      setInitialRender(false);
    }
  }, [hidden]);

  useEffect(() => {
    if (!datePickerRef?.current) return;
    const clearButton = datePickerRef?.current?.querySelector(
      '.react-datepicker__close-icon'
    ) as HTMLElement | null;
    if (!clearButton) return;

    clearButton.tabIndex = 0;
    clearButton.classList.add('focus-indicator');
    clearButton.setAttribute('aria-label', 'clear selected date');

    if (clearButton.tagName.toLowerCase() !== 'button') {
      clearButton.setAttribute('role', 'button');
    }

    const handleClearKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        clearButton.click();
      }
    };

    clearButton.addEventListener('keydown', handleClearKeyDown);

    return () => {
      clearButton.removeEventListener('keydown', handleClearKeyDown);
    };
  }, [selectedDate, isOpen]);

  const scrollSelectedDateIntoView = () => {
    if (!datePickerRef.current) return;
    let targetElement = datePickerRef.current.querySelector(
      '.react-datepicker__day--keyboard-selected'
    );

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  };

  useEffect(() => {
    if (!datePickerRef.current) return;

    const handleDatePickerKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        lastKeyboardNavRef.current = e.key;
        setTimeout(() => {
          scrollSelectedDateIntoView();
        }, 50);
      }
    };

    const calendarContainer = datePickerRef.current.querySelector('.react-datepicker');
    if (calendarContainer) {
      calendarContainer.addEventListener('keydown', (e) =>
        handleDatePickerKeyDown(e as KeyboardEvent)
      );
    }

    return () => {
      if (calendarContainer) {
        calendarContainer.removeEventListener('keydown', handleDatePickerKeyDown as EventListener);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedDate) {
      setTimeout(() => {
        scrollSelectedDateIntoView();
      }, 100);
    }
  }, [isOpen, selectedDate]);

  // Handle date selection
  const handleInputChange = (date, parentReset: boolean = false) => {
    // Validate that the date is not before 2023 if restriction is enabled
    if (date && date instanceof Date && disableYearsBefore2023) {
      const year = date.getFullYear();
      if (year < 2023) {
        // If year is before 2023 and restriction is enabled, don't set the date
        return;
      }
    }

    setSelectedDate(date);
    onChange(date, parentReset);

    // Close the popover when a date is selected via calendar click
    if (date && popoverButtonRef?.current) {
      setTimeout(() => {
        popoverButtonRef?.current?.click();
      }, 0);
    }
  };

  // Initializing list of focusable elements when the popover opens
  const buildFocusableElements = () => {
    if (!isOpen || !datePickerRef.current) return;

    // Get all focusable elements within the date picker component
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const elements = Array.from(datePickerRef.current.querySelectorAll(selector)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
    );
    if (elements.length > 0) {
      firstFocusableElementRef.current = elements[0];
      lastFocusableElementRef.current = elements[elements.length - 1];

      // If we should keep focus on month button, don't change focus
      if (shouldKeepFocusOnMonthButton) {
        setShouldKeepFocusOnMonthButton(false);
        return;
      }

      // Otherwise, focus the first input element by default
      const dateInput = datePickerRef?.current?.querySelector(
        '.react-datepicker__input-container input'
      );
      if (dateInput) {
        dateInput.focus();
      } else if (firstFocusableElementRef.current) {
        firstFocusableElementRef?.current?.focus();
      }
    }
  };

  // Handle event listener for capture phase
  const handleCaptureTab = (e) => {
    if (!isOpen) return;

    if (e.key === 'Tab') {
      // Get the current active element
      const currentElement = document.activeElement;

      // Check if the active element is the searchbar input
      const isSearchInput =
        currentElement?.classList?.contains('react-datepicker__input-container') ||
        currentElement?.parentElement?.classList?.contains('react-datepicker__input-container');

      // If shift+tab is pressed on the search input, redirect to the last focusable element
      if (
        e.shiftKey &&
        isSearchInput &&
        firstFocusableElementRef.current &&
        lastFocusableElementRef.current
      ) {
        e.preventDefault();
        e.stopPropagation();
        lastFocusableElementRef?.current?.focus();
      }
    }
  };

  // Handle key events for the focus trap
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    // Close on Escape
    if (e.key === 'Escape') {
      handleClose();
      return;
    }

    if (e.key === 'Tab') {
      // Return if references are not available
      if (!firstFocusableElementRef.current || !lastFocusableElementRef.current) return;

      // Get the current active element
      const currentElement = document.activeElement;

      // Shift+Tab on first element -> move to last element
      if (e.shiftKey && currentElement === firstFocusableElementRef.current) {
        e.preventDefault(); // Prevent the default tabbing behavior
        lastFocusableElementRef.current.focus(); // Focus on the last element
      }
      // Tab on last element -> move to first element
      else if (!e.shiftKey && currentElement === lastFocusableElementRef.current) {
        e.preventDefault(); // Prevent the default tabbing behavior
        firstFocusableElementRef.current.focus(); // Focus on the first element
      }
    }
  };

  // Setup focus trap when popover state changes
  useEffect(() => {
    if (isOpen) {
      // Delay to ensure DOM is updated
      setTimeout(() => {
        buildFocusableElements();
      }, 100);

      // Add event listener at the document level to catch all tab events
      document.addEventListener('keydown', handleKeyDown);

      // Add capture phase event listener to catch tab events before they propagate
      document.addEventListener('keydown', handleCaptureTab, true);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleCaptureTab, true);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleCaptureTab, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (yearSelectorOpen) {
      const selectedYear = selectedDate
        ? new Date(selectedDate).getFullYear()
        : new Date().getFullYear();
      setFocusedYearIndex(selectedYear - yearRangeStart);
    }
  }, [yearSelectorOpen, yearRangeStart, selectedDate]);

  useEffect(() => {
    if (monthSelectorOpen) {
      const selectedMonth = selectedDate
        ? new Date(selectedDate).getMonth()
        : new Date().getMonth();
      setFocusedMonthIndex(selectedMonth);
    }
  }, [monthSelectorOpen, selectedDate]);

  // Handle clear date button
  const handleClearDate = (e) => {
    handleInputChange(null);
    e.stopPropagation();
    // Set focus back to the triggering button
    setTimeout(() => {
      if (popoverButtonRef?.current) {
        popoverButtonRef?.current?.focus();
      }
    }, 0);
  };

  const handleMonthInteraction = (e, index, changeMonth, isKeyboardEvent = false) => {
    if (isKeyboardEvent) {
      const cols = 3;
      let newIndex = index;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (index + 1) % 12;
          setFocusedMonthIndex(newIndex);
          return;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (index - 1 + 12) % 12;
          setFocusedMonthIndex(newIndex);
          return;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (index + cols) % 12;
          setFocusedMonthIndex(newIndex);
          return;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (index - cols + 12) % 12;
          setFocusedMonthIndex(newIndex);
          return;
        case 'Escape':
          e.preventDefault();
          setMonthSelectorOpen(false);
          monthButtonRef?.current?.setAttribute('aria-expanded', 'false');
          if (monthButtonRef?.current) {
            monthButtonRef?.current?.focus?.();
          }
          return;
        case 'Enter':
        case ' ': // Space key
          changeMonth(index);
          e.preventDefault();
          return;
        default:
          return;
      }
    }

    // Apply the month change
    changeMonth(index);

    // Close the selector and refocus on the month button
    setMonthSelectorOpen(false);
    setYearSelectorOpen(false);
    monthButtonRef?.current?.setAttribute('aria-expanded', 'false');
    if (monthButtonRef?.current) {
      monthButtonRef?.current?.focus?.();
    }
  };

  // Handle closing the date picker
  const handleClose = () => {
    setIsOpen(false);

    // Return focus to the trigger button
    setTimeout(() => {
      if (popoverButtonRef?.current) {
        popoverButtonRef?.current?.click?.();
        popoverButtonRef?.current?.focus();
      }
    }, 0);
  };

  // Custom month navigation functions
  const handlePreviousMonth = (date, changeMonth, decreaseYear) => {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    // Check if going to previous month would result in a date before January 2023 (if restriction is enabled)
    if (disableYearsBefore2023 && currentYear === 2023 && currentMonth === 0) {
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

  const handleNextMonth = (date, changeMonth, increaseYear) => {
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

  // Year selector functions
  // Helper to determine if a year should be disabled based on min/max dates
  const isYearDisabled = (year: number) => {
    // Disable years before 2023 if restriction is enabled
    if (disableYearsBefore2023 && year < 2023) return true;
    if (minDate && year < new Date(minDate).getFullYear()) return true;
    if (maxDate && year > new Date(maxDate).getFullYear()) return true;
    return false;
  };

  // Helper to determine if a month should be disabled based on min/max dates
  const isMonthDisabled = (monthIndex: number, currentYear: number) => {
    if (minDate) {
      const minYear = new Date(minDate).getFullYear();
      const minMonth = new Date(minDate).getMonth();
      if (currentYear < minYear) return true;
      if (currentYear === minYear && monthIndex < minMonth) return true;
    }
    if (maxDate) {
      const maxYear = new Date(maxDate).getFullYear();
      const maxMonth = new Date(maxDate).getMonth();
      if (currentYear > maxYear) return true;
      if (currentYear === maxYear && monthIndex > maxMonth) return true;
    }
    return false;
  };

  const generateYearRange = () => {
    const years = [];
    for (let i = 0; i < 20; i++) {
      years.push(yearRangeStart + i);
    }
    return years;
  };

  const handleYearNavigation = (direction) => {
    if (direction === 'prev') {
      // Don't allow navigation before 2023 if restriction is enabled
      const newStart = yearRangeStart - 20;
      if (!disableYearsBefore2023 || newStart >= 2023) {
        setYearRangeStart(newStart);
      }
    } else {
      setYearRangeStart(yearRangeStart + 20);
    }
  };

  const handleYearSelection = (selectedYear, increaseYear, decreaseYear, currentDate) => {
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

    setYearSelectorOpen(false);
    setMonthSelectorOpen(true);
    const selectedMonth = selectedDate ? new Date(selectedDate).getMonth() : new Date().getMonth();
    setFocusedMonthIndex(selectedMonth);
    monthButtonRef?.current?.setAttribute('aria-expanded', 'true');
  };

  const handleYearInteraction = (
    e,
    year,
    increaseYear,
    decreaseYear,
    currentDate,
    isKeyboardEvent = false
  ) => {
    if (isKeyboardEvent) {
      const keyboardEvent = e;
      const cols = 5;
      let newIndex = focusedYearIndex;

      switch (keyboardEvent.key) {
        case 'ArrowRight':
          keyboardEvent.preventDefault();
          newIndex = (focusedYearIndex + 1) % 20;
          setFocusedYearIndex(newIndex);
          return;
        case 'ArrowLeft':
          keyboardEvent.preventDefault();
          newIndex = (focusedYearIndex - 1 + 20) % 20;
          setFocusedYearIndex(newIndex);
          return;
        case 'ArrowDown':
          keyboardEvent.preventDefault();
          newIndex = (focusedYearIndex + cols) % 20;
          setFocusedYearIndex(newIndex);
          return;
        case 'ArrowUp':
          keyboardEvent.preventDefault();
          newIndex = (focusedYearIndex - cols + 20) % 20;
          setFocusedYearIndex(newIndex);
          return;
        case 'Escape':
          keyboardEvent.preventDefault();
          setYearSelectorOpen(false);
          monthButtonRef?.current?.setAttribute('aria-expanded', 'false');
          if (monthButtonRef?.current) {
            monthButtonRef?.current?.focus?.();
          }
          return;
        case 'Enter':
        case ' ': // Space key
          handleYearSelection(year, increaseYear, decreaseYear, currentDate);
          keyboardEvent.preventDefault();
          return;
        default:
          return;
      }
    }

    // Apply the year selection
    handleYearSelection(year, increaseYear, decreaseYear, currentDate);
  };

  const renderPanel = () => {
    const panelBounding = popoverButtonRef?.current?.getBoundingClientRect();
    const panelStyle =
      portal && panelBounding
        ? (() => {
            const estimatedPanelHeight = 450;
            const spaceBelow = window.innerHeight - (panelBounding.top + panelBounding.height);
            const spaceAbove = panelBounding.top;

            const shouldOpenUpward = spaceBelow < estimatedPanelHeight && spaceAbove > spaceBelow;

            if (shouldOpenUpward) {
              return {
                top: panelBounding.top - 345,
                left: panelBounding.left,
                maxHeight: spaceAbove - 10,
              };
            } else {
              return {
                top: panelBounding.top + panelBounding.height + 5,
                left: panelBounding.left,
                maxHeight: spaceBelow - 10,
              };
            }
          })()
        : undefined;

    return (
      <PopoverPanel
        className={`bg-card absolute z-[51] min-w-[243px] overflow-y-auto rounded-md border shadow-md ${!portal && 'top-[30px]'}`}
        static
        aria-label={`${topLabel} date picker`}
        ref={datePickerRef}
        style={panelStyle}
      >
        <div>
          <style>
            {`
                        .react-datepicker__header {
                          background-color: ${datePickerThemeStyles.headerBg} !important;
                          border: none;
                        }
                        .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range {
                            border-radius: 40px;
                            background-color: ${datePickerThemeStyles.selectedBg};
                        }
                        .react-datepicker__day--selected:focus{
                          border-radius: 40px;
                          background-color: ${datePickerThemeStyles.focusBg} !important;
                          box-shadow: 0 0 0 2px ${datePickerThemeStyles.focusRing};
                          color: ${datePickerThemeStyles.color};
                          outline: none;
                        }
                        .react-datepicker__day--keyboard-selected:focus {
                          border-radius: 40px;
                          background-color: ${datePickerThemeStyles.focusBg} !important;
                          box-shadow: 0 0 0 2px ${datePickerThemeStyles.focusRing};
                          color: ${datePickerThemeStyles.color};
                          outline: none;
                        }
                        .react-datepicker__close-icon::after {
                          background-color: ${datePickerThemeStyles.closeIconBg} !important;
                        }
                        
                        .react-datepicker {
                          border: none;
                        }
                        `}
          </style>
          <div
            className="mb-1 px-2 py-1 text-[.8rem] font-semibold text-gray-500"
            role="heading"
            aria-level={3}
          >
            {showTopLabel ? topLabel : ''}
            {required && showTopLabel && (
              <span className="ml-1 text-red-600" aria-label="required">
                *
              </span>
            )}
          </div>
          <div
            onKeyDown={(e) => {
              // Special handler for the search input
              const target = e.target;
              const isSearchInput =
                target.classList.contains('react-datepicker__input-container') ||
                target.parentElement?.classList.contains('react-datepicker__input-container') ||
                target.tagName.toLowerCase() === 'input';

              if (
                e.key === 'Tab' &&
                e.shiftKey &&
                isSearchInput &&
                lastFocusableElementRef.current
              ) {
                e.preventDefault();
                e.stopPropagation();
                lastFocusableElementRef?.current?.focus();
              }
            }}
          >
            <DatePicker
              id={`${topLabel}_date_picker`}
              ref={dateInputRef}
              selected={typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate}
              onChange={(date) => {
                handleInputChange(date);
              }}
              onFocus={() => setIsInputFocused(true)}
              onBlur={(e: any) => {
                setIsInputFocused(false);
                onBlur && onBlur(e);
              }}
              onSelect={(date) => {
                // Only triggered when a date is explicitly selected
                setIsInputFocused(false);
                handleInputChange(date);
              }}
              isClearable
              minDate={minDate ?? null}
              maxDate={maxDate ?? null}
              placeholderText={placeholderText}
              popperClassName="hidden"
              dateFormat="MM/dd/yyyy"
              className={`focus-visible:ring-primary sm:filter-text-sm bg-card mx-2 h-10 w-full min-w-[208px] rounded-md border-[1px] py-2 pr-3 pl-2 text-gray-900 placeholder:text-[#5D5D5D] focus-visible:ring-2 sm:leading-6 ${isPlainTheme || isDarkTheme ? '' : 'focus-indicator focus-visible:ring-inset'}`}
              onKeyDown={(e) => {
                // Prevent closing when typing
                e.stopPropagation();

                // Special handler for Shift+Tab on the search input
                if (e.key === 'Tab' && e.shiftKey && lastFocusableElementRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  lastFocusableElementRef.current.focus();
                }
              }}
              aria-label={`${topLabel} date input field`}
              ariaDescribedBy={'dateFormat'}
              autoComplete="off"
              required={required}
              aria-required={required}
              customInput={
                <DateInputMask
                  className={twMerge(
                    `sm:filter-text-sm bg-card mx-2 h-10 w-full min-w-[208px] rounded-md border-[1px] py-2 pr-3 pl-2 text-gray-900 sm:leading-6`,
                    isPlainTheme || isDarkTheme ? '' : 'focus-indicator focus-visible:ring-inset'
                  )}
                  aria-describedby="dateFormat"
                />
              }
            />
            <div
              id="dateFormat"
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500"
            >
              MM/DD/YYYY
              <Tooltip
                triggerElement={() => (
                  <Button
                    size="sm"
                    variant="basic"
                    className="h-3 w-3"
                    id="date_format_info_icon"
                    testid="date_format_info_icon"
                    aria-describedby="date_format_info_tooltip"
                    tabIndex={-1}
                  >
                    <FontAwesomeIcon icon={faCircleInfo} className="text-default h-3 w-3" />
                  </Button>
                )}
                tooltip={() => (
                  <div className="p-2" id="date_format_info_tooltip">
                    {disableYearsBefore2023
                      ? 'Date selection is available from the year 2023 onward.'
                      : 'Select a date from the calendar or enter it manually.'}
                  </div>
                )}
                tabIndex={0}
                ariaLabel={
                  disableYearsBefore2023
                    ? 'Date selection is available from the year 2023 onward.'
                    : 'Select a date from the calendar or enter it manually.'
                }
              />
            </div>
            <DatePicker
              selected={typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate}
              onChange={(date) => {
                setIsInputFocused(false);
                handleInputChange(date);
              }}
              minDate={minDate ?? null}
              maxDate={maxDate ?? null}
              dateFormat={pickerDateFormat}
              {...pickerTypeProps}
              inline
              renderCustomHeader={({
                date,
                changeMonth,
                increaseYear,
                decreaseYear,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="m-2 flex items-center justify-between">
                  <Popover className="relative">
                    {({ open }) => {
                      return (
                        <>
                          <PopoverButton
                            id={`${id ?? topLabel}_month_button`}
                            ref={monthButtonRef}
                            className="focus-indicator flex items-center"
                            onClick={() => {
                              if (!yearSelectorOpen && !monthSelectorOpen) {
                                // Set focus to selected year
                                const selectedYear = selectedDate
                                  ? new Date(selectedDate).getFullYear()
                                  : new Date().getFullYear();
                                setFocusedYearIndex(selectedYear - yearRangeStart);
                                setYearSelectorOpen(true);
                                monthButtonRef?.current?.setAttribute('aria-expanded', 'true');
                              } else {
                                setYearSelectorOpen(false);
                                setMonthSelectorOpen(false);
                                monthButtonRef?.current?.setAttribute('aria-expanded', 'false');
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (!yearSelectorOpen && !monthSelectorOpen) {
                                  const selectedYear = selectedDate
                                    ? new Date(selectedDate).getFullYear()
                                    : new Date().getFullYear();
                                  setFocusedYearIndex(selectedYear - yearRangeStart);
                                  setYearSelectorOpen(true);
                                  monthButtonRef?.current?.setAttribute('aria-expanded', 'true');
                                } else {
                                  setYearSelectorOpen(false);
                                  setMonthSelectorOpen(false);
                                  monthButtonRef?.current?.setAttribute('aria-expanded', 'false');
                                }
                              }
                            }}
                            aria-expanded={yearSelectorOpen || monthSelectorOpen}
                            aria-haspopup="dialog"
                          >
                            <div className="flex items-center justify-center font-semibold">
                              <span className="mr-1">{months[date.getMonth()]}</span>
                              <span className="mt-[2px]">{date.getFullYear()}</span>
                              <FontAwesomeIcon
                                icon={monthSelectorOpen ? faChevronUp : faChevronDown}
                                className="ml-1 h-4 w-4"
                                aria-hidden="true"
                              />
                            </div>
                          </PopoverButton>

                          {yearSelectorOpen && (
                            <PopoverPanel
                              ref={yearPopoverRef}
                              className={`bg-card absolute top-[25px] z-10 w-max overflow-y-auto rounded-md border p-2 shadow-md`}
                              static
                              role="dialog"
                              aria-label="Year selector"
                              onBlur={(e) => {
                                if (
                                  !yearPopoverRef.current?.contains(e.relatedTarget) &&
                                  !monthButtonRef.current?.contains(e.relatedTarget)
                                ) {
                                  setYearSelectorOpen(false);
                                }
                              }}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <button
                                  onClick={() => handleYearNavigation('prev')}
                                  disabled={disableYearsBefore2023 && yearRangeStart <= 2023}
                                  className={`focus-indicator p-1 ${disableYearsBefore2023 && yearRangeStart <= 2023 ? 'cursor-not-allowed opacity-50' : ''}`}
                                  aria-label="Previous years"
                                >
                                  <FontAwesomeIcon
                                    icon={faChevronLeft}
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                </button>
                                <span className="text-xs font-semibold">
                                  {yearRangeStart} - {yearRangeStart + 19}
                                </span>
                                <button
                                  onClick={() => handleYearNavigation('next')}
                                  className="ring-primary p-1 focus:ring-2"
                                  aria-label="Next years"
                                >
                                  <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                              <div
                                className={twMerge(
                                  'grid-cols-5 gap-1',
                                  yearRangeSectionStyles?.container
                                )}
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(5, 1fr)',
                                }}
                              >
                                {generateYearRange().map((year, index) => (
                                  <button
                                    id={`datepicker_year_${year}_btn`}
                                    tabIndex={index === 0 ? 0 : -1}
                                    onClick={(e) =>
                                      !isYearDisabled(year) &&
                                      handleYearInteraction(
                                        e,
                                        year,
                                        increaseYear,
                                        decreaseYear,
                                        date,
                                        false
                                      )
                                    }
                                    onKeyDown={(e) =>
                                      !isYearDisabled(year) &&
                                      handleYearInteraction(
                                        e,
                                        year,
                                        increaseYear,
                                        decreaseYear,
                                        date,
                                        true
                                      )
                                    }
                                    key={year}
                                    disabled={isYearDisabled(year)}
                                    className={twMerge(
                                      'ring-primary w-full rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] focus:ring-2 focus:outline-none',
                                      isYearDisabled(year) ? 'cursor-not-allowed opacity-50' : '',
                                      yearRangeSectionStyles?.yearButton,
                                      focusedYearIndex === index
                                        ? twMerge(
                                            'bg-[#cacaca43]',
                                            yearRangeSectionStyles?.selectedYearButton
                                          )
                                        : ''
                                    )}
                                    aria-label={`Select year ${year}`}
                                  >
                                    {year}
                                  </button>
                                ))}
                              </div>
                            </PopoverPanel>
                          )}

                          {monthSelectorOpen && (
                            <PopoverPanel
                              ref={monthPopoverRef}
                              className={`bg-card absolute top-[25px] z-10 w-max overflow-y-auto rounded-md border p-2 shadow-md`}
                              static
                              role="dialog"
                              aria-label="Month selector"
                              onBlur={(e) => {
                                if (
                                  !monthPopoverRef.current?.contains(e.relatedTarget) &&
                                  !monthButtonRef.current?.contains(e.relatedTarget)
                                ) {
                                  setMonthSelectorOpen(false);
                                }
                              }}
                            >
                              <div className="grid grid-cols-3 gap-1">
                                {months.map((month, index) => (
                                  <button
                                    id={`datepicker_${month}_btn`}
                                    tabIndex={index === 0 ? 0 : -1}
                                    onClick={(e) =>
                                      !isMonthDisabled(index, date.getFullYear()) &&
                                      handleMonthInteraction(e, index, changeMonth, false)
                                    }
                                    onKeyDown={(e) =>
                                      !isMonthDisabled(index, date.getFullYear()) &&
                                      handleMonthInteraction(e, index, changeMonth, true)
                                    }
                                    key={month}
                                    disabled={isMonthDisabled(index, date.getFullYear())}
                                    className={`focus-indicator rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] ${focusedMonthIndex === index ? 'bg-[#cacaca43]' : ''} ${isMonthDisabled(index, date.getFullYear()) ? 'cursor-not-allowed opacity-50' : ''}`}
                                    aria-label={`Select ${month}`}
                                  >
                                    {month}
                                  </button>
                                ))}
                              </div>
                            </PopoverPanel>
                          )}
                        </>
                      );
                    }}
                  </Popover>
                  <div className="flex items-center">
                    <button
                      onClick={() => handlePreviousMonth(date, changeMonth, decreaseYear)}
                      disabled={
                        prevMonthButtonDisabled ||
                        (disableYearsBefore2023 &&
                          date.getFullYear() === 2023 &&
                          date.getMonth() === 0)
                      }
                      className={'focus-indicator'}
                      aria-label="Previous month"
                    >
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      onClick={() => handleNextMonth(date, changeMonth, increaseYear)}
                      disabled={nextMonthButtonDisabled}
                      className={'focus-indicator'}
                      aria-label="Next month"
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
          <div className="mx-3 flex justify-end border-t-[1px] py-2">
            <button
              ref={closeButtonRef}
              className="link-text text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClose();
                }
              }}
              tabIndex={0}
              aria-label={`Close ${topLabel}`}
            >
              Close
            </button>
          </div>
        </div>
      </PopoverPanel>
    );
  };

  return (
    <>
      {outerLabel && (
        <div className="flex flex-wrap items-center justify-between gap-1">
          <label className="text-default mb-1 ml-[3px] flex flex-row text-sm leading-6 font-semibold">
            {outerLabel}
            {required && (
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            )}
          </label>
          {disabled && prevDefaultData?.data && (
            <RenderPreviousData
              label={prevDefaultData?.label}
              id={id}
              data={moment(selectedDate).format(displayFormat)}
              previousData={moment(new Date(prevDefaultData?.data)).format(displayFormat)}
              dataType={'string'}
            />
          )}
        </div>
      )}
      {disabled && isDisableTextUI ? (
        <>
          {selectedDate ? (
            <div className="form-disabled-value-text pl-0.5">
              {moment(selectedDate).format(displayFormat)}
            </div>
          ) : (
            <>Not Specified</>
          )}
        </>
      ) : (
        <div
          className={twMerge(
            `flex ${isPlainTheme ? 'plain-variant' : isDarkTheme ? 'dark-variant' : 'blue-variant'}`
          )}
        >
          <Popover className={`relative ${datePickerWrapperClass ?? ''}`}>
            {({ open, close }) => {
              useEffect(() => {
                setIsOpen(open);
              }, [open]);

              return (
                <>
                  {!buttonElement ? (
                    <>
                      {(() => {
                        const popoverButton = (
                          <PopoverButton
                            suppressHydrationWarning={true}
                            id={id ?? topLabel}
                            ref={popoverButtonRef}
                            style={useUnderlineStyle ? {} : { borderRadius: '0.25rem' }}
                            className={`focus-indicator relative flex items-center ${useUnderlineStyle ? 'cursor-pointer' : ''} filter-text-sm px-2 py-1.5 ${
                              useUnderlineStyle
                                ? `hover:border-primary focus:border-primary border-b-2 ${selectedDate && open ? 'border-primary' : selectedDate && !open ? 'border-primary' : open && !selectedDate ? 'border-primary' : 'border-gray-300'}`
                                : `border-[1px] ${
                                    disabled
                                      ? 'bg-disabled bg-opacity-75 text-disabled cursor-not-allowed border-[#e5e7eb] shadow-none'
                                      : selectedDate && open
                                        ? 'selected-opened-filter'
                                        : selectedDate && !open
                                          ? 'selected-filter'
                                          : open && !selectedDate
                                            ? 'opened-filter'
                                            : 'newState-filter'
                                  }`
                            } ${dropdownClass}`}
                            aria-expanded={open}
                            disabled={disabled}
                            aria-label={`${topLabel ? `${topLabel} ` : ''} ${selectedDate ? ` ${moment(selectedDate).format(displayFormat)}` : ''}`}
                          >
                            <FontAwesomeIcon icon={dropIcon} className={`filter-icon mr-2`} />
                            <div
                              className={`${selectedDate || (extraFilter && extraFilter && !selectedDate) ? 'mr-8' : 'mr-2'} flex items-center`}
                            >
                              {showTopLabel ? topLabel : ''}
                              {required && showTopLabel && (
                                <span className="ml-1 text-red-600" aria-label="required">
                                  *
                                </span>
                              )}
                              {selectedDate && (
                                <span>
                                  {showTopLabel && <span className="px-2">|</span>}
                                  <span className="font-semibold whitespace-nowrap">
                                    {moment(selectedDate).format(displayFormat)}
                                  </span>
                                </span>
                              )}
                              {useUnderlineStyle && (
                                <FontAwesomeIcon
                                  icon={faChevronDown}
                                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
                                />
                              )}
                            </div>
                            {selectedDate && (
                              <button
                                className="focus-indicator absolute top-1/2 right-3 z-10 flex -translate-y-1/2"
                                disabled={disabled}
                                onClick={handleClearDate}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleClearDate(e);
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }
                                }}
                                aria-label={`clear ${topLabel ? topLabel : 'selected'}`}
                              >
                                <FontAwesomeIcon
                                  icon={closeIcon ? closeIcon : faCircleXmark}
                                  className={`${isPlainTheme ? 'text-black' : 'text-primary'} h-5 w-5`}
                                />
                              </button>
                            )}

                            {addedFilter && !selectedDate && (
                              <button
                                className="ml-2 h-4 w-4 cursor-pointer"
                                onClick={hideFilter}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    hideFilter();
                                  }
                                }}
                                aria-label={`hide ${topLabel} filter`}
                              >
                                <FontAwesomeIcon icon={faCircleMinus} className={`h-4 w-4`} />
                              </button>
                            )}
                          </PopoverButton>
                        );

                        return disabledLabel && disabled ? (
                          <Tooltip
                            triggerWrapperClass="inline-flex w-fit"
                            triggerElement={() => popoverButton}
                            tooltip={() => (
                              <span className="p-3 text-sm text-gray-700">{disabledLabel}</span>
                            )}
                          />
                        ) : (
                          popoverButton
                        );
                      })()}
                    </>
                  ) : (
                    (() => {
                      const popoverButton = (
                        <PopoverButton
                          suppressHydrationWarning={true}
                          id={id ?? topLabel}
                          ref={popoverButtonRef}
                          style={{ borderRadius: '0.25rem' }}
                          className={`focus-indicator filter-text-sm relative flex items-center border-[1px] px-2 py-1.5 ${
                            disabled
                              ? 'bg-disabled bg-opacity-75 text-disabled cursor-not-allowed border-[#e5e7eb] shadow-none'
                              : selectedDate && open
                                ? 'selected-opened-filter'
                                : selectedDate && !open
                                  ? 'selected-filter'
                                  : open && !selectedDate
                                    ? 'opened-filter'
                                    : 'newState-filter'
                          } ${dropdownClass}`}
                          aria-expanded={open}
                          disabled={disabled}
                        >
                          {buttonElement}
                        </PopoverButton>
                      );

                      return disabledLabel && disabled ? (
                        <Tooltip
                          triggerWrapperClass="inline-flex w-fit"
                          triggerElement={() => popoverButton}
                          tooltip={() => (
                            <span className="p-3 text-sm text-gray-700">{disabledLabel}</span>
                          )}
                        />
                      ) : (
                        popoverButton
                      );
                    })()
                  )}
                  {open && (
                    <>
                      {portal ? (
                        <>{ReactDOM.createPortal(renderPanel(), document.body)}</>
                      ) : (
                        renderPanel()
                      )}
                    </>
                  )}
                </>
              );
            }}
          </Popover>
        </div>
      )}
    </>
  );
};

export default CustomDatePicker;
