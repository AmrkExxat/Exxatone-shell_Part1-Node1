import {
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faCircleMinus,
  faCircleXmark,
  faCircleInfo,
  faXmark,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import moment from 'moment';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { announce } from '@react-aria/live-announcer';
import 'react-datepicker/dist/react-datepicker.css';
import DateInputMask from '../MaskedInput/MaskInput';
import Tooltip from '../../../components/common/Tooltip/Tooltip';
import { Button } from '../../../components/common/Buttons';

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

const DateRangePicker = ({
  onChange,
  defaultValues,
  startLabel = 'Start date',
  endLabel = 'End date',
  topLabel = 'Start & end date',
  startPlaceholderText = 'Select start date',
  endPlaceholderText = 'Select end date',
  minDate,
  maxDate,
  dropIcon,
  dropdownClass = '',
  showSelected = false,
  clearBit,
  buttonElement,
  extraFilter = false,
  hideFilter,
  hidden,
  popoverClassName,
  id,
  clearList,
  useUnderlineStyle = false,
  addedFilter = false,
  isDarkTheme = false,
  ...props
}: {
  onChange: (selected: any, parentReset?: boolean) => void;
  defaultValues?: { start: string; end: string };
  startLabel?: string;
  endLabel?: string;
  topLabel?: string;
  startPlaceholderText?: string;
  endPlaceholderText?: string;
  minDate?: any;
  maxDate?: any;
  dropIcon?: any;
  dropdownClass?: string;
  showSelected: boolean;
  clearBit?: number;
  buttonElement?: ReactNode;
  extraFilter?: boolean;
  hideFilter?: () => void;
  hidden?: boolean;
  popoverClassName?: string;
  id?: string;
  clearList?: string[];
  useUnderlineStyle?: boolean;
  addedFilter?: boolean;
  isDarkTheme?: boolean;
}) => {
  const [startDate, setStartDate] = useState(
    defaultValues?.start ? new Date(defaultValues.start) : null
  );
  const [focusedMonthIndex, setFocusedMonthIndex] = useState(0);
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
  const startMonthPopoverRef = useRef(null);
  const endMonthPopoverRef = useRef(null);
  const startYearPopoverRef = useRef(null);
  const endYearPopoverRef = useRef(null);
  const popoverButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const startMonthButtonRef = useRef(null);
  const endMonthButtonRef = useRef(null);
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);
  const popoverPanelRef = useRef(null);
  const [initialRender, setInitialRender] = useState<boolean>(
    props?.initRender !== undefined ? props.initRender : true
  );

  const [endDate, setEndDate] = useState(defaultValues?.end ? new Date(defaultValues.end) : null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [startMonthOpen, setStartMonthOpen] = useState(false);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedYearIndex, setFocusedYearIndex] = useState(0);
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

  useEffect(() => {
    if (clearBit > 0) {
      handleInputChange(null, 'clear', true);
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && clearList.includes(id)) {
      handleInputChange(null, 'clear', true);
    }
  }, [clearList]);

  useEffect(() => {
    if (startMonthButtonRef.current) {
      startMonthButtonRef?.current?.setAttribute('aria-expanded', startMonthOpen);
    }
  }, [startMonthOpen]);

  useEffect(() => {
    if (endMonthButtonRef.current) {
      endMonthButtonRef?.current?.setAttribute('aria-expanded', endMonthOpen);
    }
  }, [endMonthOpen]);

  // Function to get all focusable elements within the popover
  const getFocusableElements = () => {
    if (!popoverPanelRef.current) return [];

    return Array.from(
      popoverPanelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  };

  useEffect(() => {
    if (isOpen && popoverPanelRef?.current) {
      const clearButton = popoverPanelRef?.current?.querySelector(
        '.react-datepicker__close-icon'
      ) as HTMLButtonElement;
      if (clearButton && clearButton?.tabIndex != 0) {
        clearButton.tabIndex = 0;
        clearButton.classList.add('focus-indicator');
      }
      const label =
        focusedInput === 'startDate' ? 'clear selected start date' : 'clear selected end date';
      if (clearButton) clearButton?.setAttribute('aria-label', label);
    }
  }, [startDate, endDate, focusedInput, isOpen]);

  useEffect(() => {
    if (!startDate && !endDate) return;

    if (isOpen && popoverPanelRef?.current) {
      setTimeout(() => {
        const dateElement = popoverPanelRef?.current?.querySelector(
          '.react-datepicker__day--selected'
        ) as HTMLButtonElement;

        if (dateElement) {
          const ariaLabel = dateElement?.getAttribute('aria-label');
          setTimeout(() => {
            dateElement?.setAttribute(
              'aria-label',
              `${ariaLabel} selected ${tabIndex === 0 ? 'startDate' : 'endDate'}`
            );
          }, 100);
        }
      }, 500);
    }
  }, [endDate, tabIndex, isOpen]);

  // Update focusable elements when popover opens
  useEffect(() => {
    if (isOpen && popoverPanelRef.current) {
      const elements = getFocusableElements();

      // Focus the first element when the popover opens
      if (elements.length > 0) {
        // Delay focus to ensure the panel is fully rendered
        setTimeout(() => {
          const tabButtons = elements.filter(
            (el) => el.classList.contains('bg-primary') || el.classList.contains('text-gray-700')
          );
          if (tabButtons.length > 0) {
            //tabButtons[0].focus();
          } else {
            elements[0].focus();
          }
        }, 50);
      }
    }
  }, [isOpen, tabIndex]);

  useEffect(() => {
    // Adding event listener when either of popOvers are open. listener if at least one popover is open
    if (!startMonthOpen && !endMonthOpen && !startYearOpen && !endYearOpen) return;

    function handleClickOutside(event: any) {
      if (
        startMonthOpen &&
        startMonthPopoverRef?.current &&
        !startMonthPopoverRef?.current?.contains(event.target) &&
        !startMonthButtonRef?.current?.contains(event.target)
      ) {
        setStartMonthOpen(false);
      }

      if (
        endMonthOpen &&
        endMonthPopoverRef?.current &&
        !endMonthPopoverRef?.current?.contains(event.target) &&
        !endMonthButtonRef?.current?.contains(event.target)
      ) {
        setEndMonthOpen((prevState) => !prevState);
      }

      if (
        startYearOpen &&
        startYearPopoverRef?.current &&
        !startYearPopoverRef?.current?.contains(event.target) &&
        !startMonthButtonRef?.current?.contains(event.target)
      ) {
        setStartYearOpen(false);
      }

      if (
        endYearOpen &&
        endYearPopoverRef?.current &&
        !endYearPopoverRef?.current?.contains(event.target) &&
        !endMonthButtonRef?.current?.contains(event.target)
      ) {
        setEndYearOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [startMonthOpen, endMonthOpen, startYearOpen, endYearOpen]);

  useEffect(() => {
    if (extraFilter && hidden === false && !initialRender) {
      if (popoverButtonRef?.current) {
        popoverButtonRef?.current?.click();
      }
    } else if (initialRender) {
      setInitialRender(false);
    }
  }, [hidden]);

  // Focus the end date input after a start date is selected
  useEffect(() => {
    if (tabIndex === 1 && endDateInputRef?.current) {
      setTimeout(() => {
        if (endDateInputRef?.current) {
          endDateInputRef?.current?.focus?.();
        }
      }, 10);
    }
  }, [tabIndex]);

  // Handle focus return to trigger element
  const returnFocusToTrigger = () => {
    if (popoverButtonRef?.current) {
      setTimeout(() => {
        popoverButtonRef?.current?.focus?.();
      }, 0);
    }
  };

  const handleInputChange = (
    date,
    from,
    parentReset: boolean = false,
    fromPicker: boolean = false
  ) => {
    // Validate that the date is not before 2023
    if (date && date instanceof Date) {
      const year = date.getFullYear();
      if (year < 2023) {
        // If year is before 2023, don't set the date
        return;
      }
    }

    if (from === 'start') {
      setStartDate(date);
      onChange({ start: date, end: endDate });
      if (date && fromPicker) {
        setTabIndex(1);
        // Automatically shift focus to the end date tab after start date selection
      }
    } else if (from === 'end') {
      setEndDate(date);
      onChange({ start: startDate, end: date });

      // Close the date picker when end date is selected
      if (date) {
        endDateInputRef?.current?.focus?.();
      }
    } else if (from === 'clear') {
      setStartDate(null);
      setEndDate(null);
      onChange(null, parentReset);

      const dateSearchElement = document.getElementById('dateSearch');
      if (dateSearchElement) {
        dateSearchElement.focus();
      }
    }
  };

  const handleMonthInteraction = (e, index, changeMonth, isStartMonth, isKeyboardEvent = false) => {
    if (isKeyboardEvent) {
      const cols = 3;
      let newIndex = index;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (index + 1) % 12;
          setFocusedMonthIndex(newIndex);
          const rightMonth = months[newIndex];
          const rightElement = document.getElementById(`datepicker_${rightMonth}_btn`);
          if (rightElement) rightElement.focus();
          return;

        case 'ArrowLeft':
          e.preventDefault();
          e.stopPropagation();
          newIndex = (index - 1 + 12) % 12;
          setFocusedMonthIndex(newIndex);
          const leftMonth = months[newIndex];
          const leftElement = document.getElementById(`datepicker_${leftMonth}_btn`);
          if (leftElement) leftElement.focus();
          return;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (index + cols) % 12;
          setFocusedMonthIndex(newIndex);
          const downMonth = months[newIndex];
          const downElement = document.getElementById(`datepicker_${downMonth}_btn`);
          if (downElement) downElement.focus();
          return;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (index - cols + 12) % 12;
          setFocusedMonthIndex(newIndex);
          const upMonth = months[newIndex];
          const upElement = document.getElementById(`datepicker_${upMonth}_btn`);
          if (upElement) upElement.focus();
          return;
        case 'Escape':
          e.preventDefault();
          if (isStartMonth) {
            setStartMonthOpen(false);
            if (startMonthButtonRef?.current) {
              startMonthButtonRef?.current?.focus?.();
            }
          } else {
            setEndMonthOpen(false);
            if (endMonthButtonRef?.current) {
              endMonthButtonRef?.current?.focus?.();
            }
          }
          return;

        case 'Enter':
        case ' ': // Space key
          e.preventDefault();
          changeMonth(index);
          if (isStartMonth) {
            setStartMonthOpen(false);
            setTimeout(() => {
              if (startMonthButtonRef?.current) {
                startMonthButtonRef?.current?.focus?.();
              }
            }, 0);
          } else {
            setEndMonthOpen(false);
            setTimeout(() => {
              if (endMonthButtonRef?.current) {
                endMonthButtonRef?.current?.focus?.();
              }
            }, 0);
          }
          return;
          break;
        default:
          return;
      }
    }

    changeMonth(index);

    if (isStartMonth) {
      setStartMonthOpen(false);
      setTimeout(() => {
        if (startMonthButtonRef?.current) {
          startMonthButtonRef?.current?.focus?.();
        }
      }, 0);
    } else {
      setEndMonthOpen(false);
      setTimeout(() => {
        if (endMonthButtonRef?.current) {
          endMonthButtonRef?.current?.focus?.();
        }
      }, 0);
    }
  };

  // Custom month navigation functions
  const handlePreviousMonth = (date: any, changeMonth: any, decreaseYear: any) => {
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

  const handleNextMonth = (date: any, changeMonth: any, increaseYear: any) => {
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
  const generateYearRange = (isStartDate: boolean) => {
    const years = [];
    const rangeStart = isStartDate ? startYearRangeStart : endYearRangeStart;
    for (let i = 0; i < 20; i++) {
      years.push(rangeStart + i);
    }
    return years;
  };

  const handleYearNavigation = (direction: string, isStartDate: boolean) => {
    if (direction === 'prev') {
      if (isStartDate) {
        // Don't allow navigation before 2023
        const newStart = startYearRangeStart - 20;
        if (newStart >= 2023) {
          setStartYearRangeStart(newStart);
        }
      } else {
        // Don't allow navigation before 2023
        const newStart = endYearRangeStart - 20;
        if (newStart >= 2023) {
          setEndYearRangeStart(newStart);
        }
      }
    } else {
      if (isStartDate) {
        setStartYearRangeStart(startYearRangeStart + 20);
      } else {
        setEndYearRangeStart(endYearRangeStart + 20);
      }
    }
  };

  const isYearDisabled = (year: number, isStartDate: boolean) => {
    // Always disable years before 2023
    if (year < 2023) return true;

    if (isStartDate) {
      // For start date, disable years that would make start date after end date
      if (endDate) {
        const endYear = new Date(endDate).getFullYear();
        return year > endYear;
      }
    } else {
      // For end date, disable years that would make end date before start date
      if (startDate) {
        const startYear = new Date(startDate).getFullYear();
        return year < startYear;
      }
    }
    return false;
  };

  const handleYearSelection = (
    selectedYear: number,
    increaseYear: any,
    decreaseYear: any,
    currentDate: any,
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

  const handleYearInteraction = (
    e: any,
    year: number,
    increaseYear: any,
    decreaseYear: any,
    currentDate: any,
    isStartDate: boolean,
    isKeyboardEvent = false
  ) => {
    if (isKeyboardEvent) {
      const cols = 5;
      let newIndex = focusedYearIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (focusedYearIndex + 1) % 20;
          setFocusedYearIndex(newIndex);
          return;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (focusedYearIndex - 1 + 20) % 20;
          setFocusedYearIndex(newIndex);
          return;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (focusedYearIndex + cols) % 20;
          setFocusedYearIndex(newIndex);
          return;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (focusedYearIndex - cols + 20) % 20;
          setFocusedYearIndex(newIndex);
          return;
        case 'Escape':
          e.preventDefault();
          if (isStartDate) {
            setStartYearOpen(false);
            startMonthButtonRef?.current?.setAttribute('aria-expanded', 'false');
            if (startMonthButtonRef?.current) {
              startMonthButtonRef?.current?.focus?.();
            }
          } else {
            setEndYearOpen(false);
            endMonthButtonRef?.current?.setAttribute('aria-expanded', 'false');
            if (endMonthButtonRef?.current) {
              endMonthButtonRef?.current?.focus?.();
            }
          }
          return;
        case 'Enter':
        case ' ': // Space key
          if (!isYearDisabled(year, isStartDate)) {
            handleYearSelection(year, increaseYear, decreaseYear, currentDate, isStartDate);
          }
          e.preventDefault();
          return;
        default:
          return;
      }
    }

    // Apply the year selection only if not disabled
    if (!isYearDisabled(year, isStartDate)) {
      handleYearSelection(year, increaseYear, decreaseYear, currentDate, isStartDate);
    }
  };

  const handleClose = () => {
    if (popoverButtonRef?.current) {
      popoverButtonRef?.current.click();
    }
    setIsOpen(false);
    returnFocusToTrigger();
  };

  // Handle escape key to close popover
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Handle keyboard navigation in date picker
  const handleDateKeyDown = (e, from) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      // If a date is selected via keyboard in the end date picker, close it
      if (from === 'end' && e.target.classList.contains('react-datepicker__day--selected')) {
        handleClose();
      }
      if (from === 'start') {
        setTimeout(() => {
          const endDateInput = document?.getElementById('dateSearch');
          if (endDateInput) {
            endDateInput?.focus();
          }
          announce('Start Date Selected', 'polite');
        }, 100);
      }
    }
  };

  // Handle tab key navigation
  const handleTabKeyDown = (e) => {
    if (!isOpen || !popoverPanelRef.current) return;

    // Update the list of focusable elements
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    // Handle tab key
    if (e.key === 'Tab') {
      // shift + tab
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // tab
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

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

  return (
    <div className={`flex w-full ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}>
      <Popover className="relative w-full">
        {({ open }) => {
          // Update the internal open state when Popover's open state changes
          useEffect(() => {
            setIsOpen(open);
          }, [open]);

          return (
            <>
              {!buttonElement ? (
                <>
                  <PopoverButton
                    suppressHydrationWarning={true}
                    ref={popoverButtonRef}
                    id={id ?? topLabel}
                    className={`focus-indicator flex items-center ${useUnderlineStyle ? 'cursor-pointer' : 'filter-round'} filter-text-sm relative px-2 py-1.5 ${
                      useUnderlineStyle
                        ? `hover:border-primary focus:border-primary border-b-2 ${startDate && endDate && open ? 'border-primary' : (startDate || endDate) && !open ? 'border-primary' : open && !(startDate && endDate) ? 'border-primary' : 'border-gray-300'}`
                        : `border-[1px] ${startDate && endDate && open ? 'selected-opened-filter' : (startDate || endDate) && !open ? 'selected-filter' : open && !(startDate && endDate) ? 'opened-filter' : 'newState-filter'}`
                    } ${dropdownClass}`}
                  >
                    <FontAwesomeIcon icon={dropIcon} className={`filter-icon mr-2`} />
                    <div
                      className={`${startDate || endDate || (extraFilter && extraFilter && !startDate && !endDate) ? 'mr-8' : 'mr-2'} flex items-center`}
                    >
                      {topLabel}
                      {showSelected && (startDate || endDate) && (
                        <span className="filter-selected-text">
                          <span className="px-2">|</span>
                          <span className="font-semibold whitespace-nowrap">
                            {(startDate
                              ? moment(startDate).format('MMM DD, yyyy')
                              : 'Not specified') +
                              ' - ' +
                              (endDate ? moment(endDate).format('MMM DD, yyyy') : 'Not specified')}
                          </span>
                        </span>
                      )}
                      {useUnderlineStyle && (
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''} text-gray-600`}
                        />
                      )}
                    </div>

                    {(startDate || endDate) && (
                      <button
                        id="datepicker_clear_selection_btn"
                        className="focus-indicator absolute top-1/2 right-3 z-10 flex -translate-y-1/2"
                        aria-label={`clear ${topLabel}`}
                        onClick={(e) => {
                          handleInputChange(null, 'clear');
                          e.stopPropagation();
                          returnFocusToTrigger();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleInputChange(null, 'clear');
                            e.stopPropagation();
                            returnFocusToTrigger();
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={isDarkTheme ? faXmark : faCircleXmark}
                          className={`filter-cross-btn h-5 w-5`}
                        />
                      </button>
                    )}
                    {addedFilter && !startDate && !endDate && (
                      <button
                        id="datepicker_hide_filter_btn"
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={hideFilter}
                        aria-label={`hide ${topLabel}`}
                      >
                        <FontAwesomeIcon icon={faCircleMinus} className={`h-4 w-4`} />
                      </button>
                    )}
                  </PopoverButton>
                </>
              ) : (
                <PopoverButton
                  suppressHydrationWarning={true}
                  id={id ?? topLabel}
                  ref={popoverButtonRef}
                  style={{ borderRadius: '0.25rem' }}
                  className={popoverClassName ? popoverClassName : ''}
                >
                  {buttonElement}
                </PopoverButton>
              )}
              {open && (
                <PopoverPanel
                  ref={popoverPanelRef}
                  className={`bg-card absolute top-[30px] z-[51] min-w-[243px] overflow-y-auto rounded-md border shadow-md`}
                  static
                  onKeyDown={handleTabKeyDown}
                  role="dialog"
                  aria-modal="true"
                  tabIndex={-1}
                  aria-label={topLabel}
                >
                  <div>
                    <div className="flex items-center justify-between p-2">
                      <div
                        className="drop-panel-label text-[.8rem] font-semibold"
                        role="heading"
                        aria-level={3}
                      >
                        {topLabel}
                      </div>
                    </div>
                    <div className="flex px-2 pb-2">
                      <div
                        className="flex items-center rounded-lg border-[1px] border-[#888888] text-xs"
                        role="tablist"
                      >
                        <button
                          id="datepicker_shiftStart"
                          role="tab"
                          aria-selected={tabIndex === 0}
                          aria-current={tabIndex === 0 ? 'true' : undefined}
                          onClick={() => {
                            setTabIndex(0);
                          }}
                          className={`flex h-full flex-col justify-center rounded-l-lg border-r-[1px] px-3 py-2 ${tabIndex === 0 ? 'selectedDateTab' : 'text-gray-700 hover:text-gray-500'}`}
                        >
                          <div>{startLabel ? startLabel : 'Start date'}</div>
                          {startDate && <div>{moment(startDate).format('MMM DD, yyyy')}</div>}
                        </button>
                        <button
                          id="datepicker_shiftEnd"
                          role="tab"
                          aria-selected={tabIndex === 1}
                          aria-current={tabIndex === 1 ? 'true' : undefined}
                          onClick={() => {
                            setTabIndex(1);
                          }}
                          className={`flex h-full flex-col justify-center rounded-r-lg border-r-[1px] px-3 py-2 ${tabIndex === 1 ? 'selectedDateTab' : 'text-gray-700 hover:text-gray-500'}`}
                        >
                          <div>{endLabel ? endLabel : 'End date'}</div>
                          {endDate && <div>{moment(endDate).format('MMM DD, yyyy')}</div>}
                        </button>
                      </div>
                    </div>
                    {tabIndex === 0 && (
                      <div>
                        <DatePicker
                          aria-label={topLabel}
                          ref={startDateInputRef}
                          selected={typeof startDate === 'string' ? new Date(startDate) : startDate}
                          onFocus={() => setFocusedInput('startDate')}
                          onChange={(date) => {
                            handleInputChange(date, 'start');
                          }}
                          selectsStart
                          startDate={
                            typeof startDate === 'string' ? new Date(startDate) : startDate
                          }
                          endDate={typeof endDate === 'string' ? new Date(endDate) : endDate}
                          isClearable
                          minDate={minDate ?? null}
                          maxDate={
                            endDate
                              ? typeof endDate === 'string'
                                ? new Date(endDate)
                                : endDate
                              : (maxDate ?? null)
                          }
                          placeholderText={startPlaceholderText}
                          id="dateSearch"
                          popperClassName="hidden"
                          dateFormat="MM/dd/yyyy"
                          ariaDescribedBy={'dateFormat'}
                          autoComplete="off"
                          customInput={
                            <DateInputMask className="focus-indicator sm:filter-text-sm bg-card mx-2 h-10 w-full min-w-[208px] rounded-md border-[1px] py-2 pr-3 pl-2 text-gray-900 focus-visible:ring-inset sm:leading-6" />
                          }
                        />
                        <div
                          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500"
                          id="dateFormat"
                        >
                          MM/DD/YYYY
                          <Tooltip
                            triggerElement={() => (
                              <Button
                                size="sm"
                                aria-label="info"
                                variant="basic"
                                className="h-3 w-3"
                                id="start_date_format_info_icon"
                                testid="start_date_format_info_icon"
                                aria-describedby="start_date_format_info_tooltip"
                                tabIndex={-1}
                              >
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  className="text-default h-3 w-3"
                                />
                              </Button>
                            )}
                            tooltip={() => (
                              <div className="p-2" id="start_date_format_info_tooltip">
                                Date selection is available from the year 2023 onward.
                              </div>
                            )}
                            tabIndex={0}
                          />
                        </div>
                        <DatePicker
                          selected={typeof startDate === 'string' ? new Date(startDate) : startDate}
                          onChange={(date) => {
                            handleInputChange(date, 'start', false, true);
                          }}
                          onKeyDown={(e) => handleDateKeyDown(e, 'start')}
                          selectsStart
                          startDate={
                            typeof startDate === 'string' ? new Date(startDate) : startDate
                          }
                          endDate={typeof endDate === 'string' ? new Date(endDate) : endDate}
                          minDate={minDate ?? null}
                          maxDate={
                            endDate
                              ? typeof endDate === 'string'
                                ? new Date(endDate)
                                : endDate
                              : (maxDate ?? null)
                          }
                          dateFormat="MMM dd, yyyy"
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
                                {({ open }) => (
                                  <>
                                    <PopoverButton
                                      ref={startMonthButtonRef}
                                      className="focus-indicator flex items-center"
                                      onClick={() => {
                                        if (!startYearOpen && !startMonthOpen) {
                                          // Set focus to selected year
                                          const selectedYear = startDate
                                            ? new Date(startDate).getFullYear()
                                            : new Date().getFullYear();
                                          setFocusedYearIndex(selectedYear - startYearRangeStart);
                                          setStartYearOpen(true);
                                          startMonthButtonRef?.current?.setAttribute(
                                            'aria-expanded',
                                            'true'
                                          );
                                        } else {
                                          setStartYearOpen(false);
                                          setStartMonthOpen(false);
                                          startMonthButtonRef?.current?.setAttribute(
                                            'aria-expanded',
                                            'false'
                                          );
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          if (!startYearOpen && !startMonthOpen) {
                                            const selectedYear = startDate
                                              ? new Date(startDate).getFullYear()
                                              : new Date().getFullYear();
                                            setFocusedYearIndex(selectedYear - startYearRangeStart);
                                            setStartYearOpen(true);
                                            startMonthButtonRef?.current?.setAttribute(
                                              'aria-expanded',
                                              'true'
                                            );
                                          } else {
                                            setStartYearOpen(false);
                                            setStartMonthOpen(false);
                                            startMonthButtonRef?.current?.setAttribute(
                                              'aria-expanded',
                                              'false'
                                            );
                                          }
                                        }
                                      }}
                                      aria-expanded={startYearOpen || startMonthOpen}
                                      aria-haspopup="dialog"
                                    >
                                      <div className="flex items-center justify-center font-semibold">
                                        <span className="mr-1">{months[date.getMonth()]}</span>
                                        <span className="mt-[2px]">{date.getFullYear()}</span>
                                        <FontAwesomeIcon
                                          icon={startMonthOpen ? faChevronUp : faChevronDown}
                                          className="ml-1 h-4 w-4"
                                          aria-hidden="true"
                                        />
                                      </div>
                                    </PopoverButton>
                                    {startMonthOpen && (
                                      <PopoverPanel
                                        ref={startMonthPopoverRef}
                                        onBlur={(e) => {
                                          setTimeout(() => {
                                            const newFocusedElement = document.activeElement;
                                            if (
                                              !startMonthPopoverRef.current?.contains(
                                                newFocusedElement
                                              ) &&
                                              !startMonthButtonRef.current?.contains(
                                                newFocusedElement
                                              )
                                            ) {
                                              setStartMonthOpen(false);
                                            }
                                          }, 0);
                                        }}
                                        className={`bg-card absolute top-[25px] w-max overflow-y-auto rounded-md border p-2 shadow-md`}
                                        static
                                        role="dialog"
                                        aria-modal="true"
                                        aria-label="start month selector"
                                      >
                                        <div className="grid grid-cols-3 gap-1">
                                          {months.map((month, index) => (
                                            <button
                                              id={`datepicker_${month}_btn`}
                                              onClick={(e) =>
                                                !isMonthDisabled(index, true, date.getFullYear()) &&
                                                handleMonthInteraction(e, index, changeMonth, true)
                                              }
                                              onKeyDown={(e) =>
                                                !isMonthDisabled(index, true, date.getFullYear()) &&
                                                handleMonthInteraction(
                                                  e,
                                                  index,
                                                  changeMonth,
                                                  true,
                                                  true
                                                )
                                              }
                                              key={month}
                                              tabIndex={index === 0 ? 0 : -1}
                                              disabled={isMonthDisabled(
                                                index,
                                                true,
                                                date.getFullYear()
                                              )}
                                              className={`focus-indicator rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] ${focusedMonthIndex === index ? 'bg-[#cacaca43]' : ''} ${isMonthDisabled(index, true, date.getFullYear()) ? 'cursor-not-allowed opacity-50' : ''}`}
                                            >
                                              {month}
                                            </button>
                                          ))}
                                        </div>
                                      </PopoverPanel>
                                    )}

                                    {startYearOpen && (
                                      <PopoverPanel
                                        ref={startYearPopoverRef}
                                        className={`bg-card absolute top-[25px] w-max overflow-y-auto rounded-md border p-2 shadow-md`}
                                        static
                                        role="dialog"
                                        aria-modal="true"
                                        aria-label="start year selector"
                                        onBlur={(e) => {
                                          setTimeout(() => {
                                            const newFocusedElement = document.activeElement;
                                            if (
                                              !startYearPopoverRef.current?.contains(
                                                newFocusedElement
                                              ) &&
                                              !startMonthButtonRef.current?.contains(
                                                newFocusedElement
                                              )
                                            ) {
                                              setStartYearOpen(false);
                                            }
                                          }, 0);
                                        }}
                                      >
                                        <div className="mb-2 flex items-center justify-between">
                                          <button
                                            onClick={() => handleYearNavigation('prev', true)}
                                            disabled={startYearRangeStart <= 2023}
                                            className={`focus-indicator p-1 ${startYearRangeStart <= 2023 ? 'cursor-not-allowed opacity-50' : ''}`}
                                            aria-label="Previous years"
                                          >
                                            <FontAwesomeIcon
                                              icon={faChevronLeft}
                                              className="h-3 w-3"
                                              aria-hidden="true"
                                            />
                                          </button>
                                          <span className="text-xs font-semibold">
                                            {startYearRangeStart} - {startYearRangeStart + 19}
                                          </span>
                                          <button
                                            onClick={() => handleYearNavigation('next', true)}
                                            className="focus-indicator p-1"
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
                                          className="grid-cols-5 gap-1"
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                          }}
                                        >
                                          {generateYearRange(true).map((year, index) => (
                                            <button
                                              id={`datepicker_start_year_${year}_btn`}
                                              tabIndex={index === 0 ? 0 : -1}
                                              onClick={(e) =>
                                                handleYearInteraction(
                                                  e,
                                                  year,
                                                  increaseYear,
                                                  decreaseYear,
                                                  date,
                                                  true,
                                                  false
                                                )
                                              }
                                              onKeyDown={(e) =>
                                                handleYearInteraction(
                                                  e,
                                                  year,
                                                  increaseYear,
                                                  decreaseYear,
                                                  date,
                                                  true,
                                                  true
                                                )
                                              }
                                              key={year}
                                              disabled={isYearDisabled(year, true)}
                                              className={`focus-indicator w-full rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] focus:outline-none ${focusedYearIndex === index ? 'bg-[#cacaca43]' : ''} ${isYearDisabled(year, true) ? 'cursor-not-allowed opacity-50' : ''}`}
                                              aria-label={`Select year ${year}`}
                                            >
                                              {year}
                                            </button>
                                          ))}
                                        </div>
                                      </PopoverPanel>
                                    )}
                                  </>
                                )}
                              </Popover>
                              <div className="flex items-center">
                                <button
                                  id="datepicker_previous_month_btn"
                                  onClick={() =>
                                    handlePreviousMonth(date, changeMonth, decreaseYear)
                                  }
                                  disabled={
                                    prevMonthButtonDisabled ||
                                    (date.getFullYear() === 2023 && date.getMonth() === 0)
                                  }
                                  aria-label="Previous month"
                                  className="focus-indicator"
                                >
                                  <FontAwesomeIcon icon={faChevronLeft} className="mr-2 h-4 w-4" />
                                </button>
                                <button
                                  id="datepicker_next_month_btn"
                                  onClick={() => handleNextMonth(date, changeMonth, increaseYear)}
                                  disabled={nextMonthButtonDisabled}
                                  aria-label="Next month"
                                  className="focus-indicator"
                                >
                                  <FontAwesomeIcon icon={faChevronRight} className="mr-2 h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    )}
                    {tabIndex === 1 && (
                      <div>
                        <DatePicker
                          ref={endDateInputRef}
                          selected={typeof endDate === 'string' ? new Date(endDate) : endDate}
                          onFocus={() => setFocusedInput('endDate')}
                          onChange={(date) => {
                            handleInputChange(date, 'end');
                          }}
                          selectsEnd
                          startDate={
                            typeof startDate === 'string' ? new Date(startDate) : startDate
                          }
                          endDate={typeof endDate === 'string' ? new Date(endDate) : endDate}
                          minDate={typeof startDate === 'string' ? new Date(startDate) : startDate}
                          maxDate={maxDate ?? null}
                          isClearable
                          placeholderText={endPlaceholderText}
                          id="dateSearch"
                          popperClassName="hidden"
                          dateFormat="MM/dd/yyyy"
                          ariaDescribedBy={'dateFormat'}
                          autoComplete="off"
                          customInput={
                            <DateInputMask className="focus-indicator sm:filter-text-sm bg-card mx-2 h-10 w-full min-w-[208px] rounded-md border-[1px] py-2 pr-3 pl-2 text-gray-900 focus-visible:ring-inset sm:leading-6" />
                          }
                        />
                        <div
                          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500"
                          id="dateFormat"
                        >
                          MM/DD/YYYY
                          <Tooltip
                            triggerElement={() => (
                              <Button
                                size="sm"
                                aria-label="info"
                                variant="basic"
                                className="h-3 w-3"
                                id="end_date_format_info_icon"
                                testid="end_date_format_info_icon"
                                aria-describedby="end_date_format_info_tooltip"
                                tabIndex={-1}
                              >
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  className="text-default h-3 w-3"
                                />
                              </Button>
                            )}
                            tooltip={() => (
                              <div className="p-2" id="end_date_format_info_tooltip">
                                Date selection is available from the year 2023 onward.
                              </div>
                            )}
                            tabIndex={0}
                          />
                        </div>
                        <DatePicker
                          selected={typeof endDate === 'string' ? new Date(endDate) : endDate}
                          onChange={(date) => {
                            handleInputChange(date, 'end');
                          }}
                          onKeyDown={(e) => handleDateKeyDown(e, 'end')}
                          selectsEnd
                          startDate={
                            typeof startDate === 'string' ? new Date(startDate) : startDate
                          }
                          endDate={typeof endDate === 'string' ? new Date(endDate) : endDate}
                          minDate={typeof startDate === 'string' ? new Date(startDate) : startDate}
                          maxDate={maxDate ?? null}
                          isClearable
                          dateFormat="MMM dd, yyyy"
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
                                {({ open }) => (
                                  <>
                                    <PopoverButton
                                      ref={endMonthButtonRef}
                                      className="focus-indicator flex items-center"
                                      onClick={() => {
                                        if (!endYearOpen && !endMonthOpen) {
                                          // Set focus to selected year
                                          const selectedYear = endDate
                                            ? new Date(endDate).getFullYear()
                                            : new Date().getFullYear();
                                          setFocusedYearIndex(selectedYear - endYearRangeStart);
                                          setEndYearOpen(true);
                                          endMonthButtonRef?.current?.setAttribute(
                                            'aria-expanded',
                                            'true'
                                          );
                                        } else {
                                          setEndYearOpen(false);
                                          setEndMonthOpen(false);
                                          endMonthButtonRef?.current?.setAttribute(
                                            'aria-expanded',
                                            'false'
                                          );
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          if (!endYearOpen && !endMonthOpen) {
                                            const selectedYear = endDate
                                              ? new Date(endDate).getFullYear()
                                              : new Date().getFullYear();
                                            setFocusedYearIndex(selectedYear - endYearRangeStart);
                                            setEndYearOpen(true);
                                            endMonthButtonRef?.current?.setAttribute(
                                              'aria-expanded',
                                              'true'
                                            );
                                          } else {
                                            setEndYearOpen(false);
                                            setEndMonthOpen(false);
                                            endMonthButtonRef?.current?.setAttribute(
                                              'aria-expanded',
                                              'false'
                                            );
                                          }
                                        }
                                      }}
                                      aria-expanded={endYearOpen || endMonthOpen}
                                      aria-haspopup="dialog"
                                    >
                                      <div className="flex items-center justify-center font-semibold">
                                        <span className="mr-1">{months[date.getMonth()]}</span>
                                        <span className="mt-[2px]">{date.getFullYear()}</span>
                                        <FontAwesomeIcon
                                          icon={endMonthOpen ? faChevronUp : faChevronDown}
                                          className="ml-1 h-4 w-4"
                                          aria-hidden="true"
                                        />
                                      </div>
                                    </PopoverButton>
                                    {endMonthOpen && (
                                      <PopoverPanel
                                        ref={endMonthPopoverRef}
                                        onBlur={(e) => {
                                          setTimeout(() => {
                                            const newFocusedElement = document.activeElement;
                                            if (
                                              !endMonthPopoverRef.current?.contains(
                                                newFocusedElement
                                              ) &&
                                              !endMonthButtonRef.current?.contains(
                                                newFocusedElement
                                              )
                                            ) {
                                              setEndMonthOpen(false);
                                            }
                                          }, 0);
                                        }}
                                        className={`bg-card absolute top-[25px] w-max overflow-y-auto rounded-md border p-2 shadow-md`}
                                        static
                                        role="dialog"
                                        aria-modal="true"
                                        aria-label="End month selector"
                                      >
                                        <div className="grid grid-cols-3 gap-1">
                                          {months.map((month, index) => (
                                            <button
                                              id={`datepicker_${month}_btn`}
                                              tabIndex={index === 0 ? 0 : -1}
                                              onClick={(e) =>
                                                !isMonthDisabled(
                                                  index,
                                                  false,
                                                  date.getFullYear()
                                                ) &&
                                                handleMonthInteraction(e, index, changeMonth, false)
                                              }
                                              onKeyDown={(e) =>
                                                !isMonthDisabled(
                                                  index,
                                                  false,
                                                  date.getFullYear()
                                                ) &&
                                                handleMonthInteraction(
                                                  e,
                                                  index,
                                                  changeMonth,
                                                  false,
                                                  true
                                                )
                                              }
                                              key={month}
                                              disabled={isMonthDisabled(
                                                index,
                                                false,
                                                date.getFullYear()
                                              )}
                                              className={`focus-indicator rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] ${focusedMonthIndex === index ? 'bg-[#cacaca43]' : ''} ${isMonthDisabled(index, false, date.getFullYear()) ? 'cursor-not-allowed opacity-50' : ''}`}
                                            >
                                              {month}
                                            </button>
                                          ))}
                                        </div>
                                      </PopoverPanel>
                                    )}

                                    {endYearOpen && (
                                      <PopoverPanel
                                        ref={endYearPopoverRef}
                                        className={`bg-card absolute top-[25px] w-max overflow-y-auto rounded-md border p-2 shadow-md`}
                                        static
                                        role="dialog"
                                        aria-modal="true"
                                        aria-label="End year selector"
                                        onBlur={(e) => {
                                          setTimeout(() => {
                                            const newFocusedElement = document.activeElement;
                                            if (
                                              !endYearPopoverRef.current?.contains(
                                                newFocusedElement
                                              ) &&
                                              !endMonthButtonRef.current?.contains(
                                                newFocusedElement
                                              )
                                            ) {
                                              setEndYearOpen(false);
                                            }
                                          }, 0);
                                        }}
                                      >
                                        <div className="mb-2 flex items-center justify-between">
                                          <button
                                            onClick={() => handleYearNavigation('prev', false)}
                                            disabled={endYearRangeStart <= 2023}
                                            className={`focus-indicator p-1 ${endYearRangeStart <= 2023 ? 'cursor-not-allowed opacity-50' : ''}`}
                                            aria-label="Previous years"
                                          >
                                            <FontAwesomeIcon
                                              icon={faChevronLeft}
                                              className="h-3 w-3"
                                              aria-hidden="true"
                                            />
                                          </button>
                                          <span className="text-xs font-semibold">
                                            {endYearRangeStart} - {endYearRangeStart + 19}
                                          </span>
                                          <button
                                            onClick={() => handleYearNavigation('next', false)}
                                            className="focus-indicator p-1"
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
                                          className="grid-cols-5 gap-1"
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                          }}
                                        >
                                          {generateYearRange(false).map((year, index) => (
                                            <button
                                              id={`datepicker_end_year_${year}_btn`}
                                              tabIndex={index === 0 ? 0 : -1}
                                              onClick={(e) =>
                                                handleYearInteraction(
                                                  e,
                                                  year,
                                                  increaseYear,
                                                  decreaseYear,
                                                  date,
                                                  false,
                                                  false
                                                )
                                              }
                                              onKeyDown={(e) =>
                                                handleYearInteraction(
                                                  e,
                                                  year,
                                                  increaseYear,
                                                  decreaseYear,
                                                  date,
                                                  false,
                                                  true
                                                )
                                              }
                                              key={year}
                                              disabled={isYearDisabled(year, false)}
                                              className={`focus-indicator w-full rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] ${focusedYearIndex === index ? 'bg-[#cacaca43]' : ''} ${isYearDisabled(year, false) ? 'cursor-not-allowed opacity-50' : ''}`}
                                              aria-label={`Select year ${year}`}
                                            >
                                              {year}
                                            </button>
                                          ))}
                                        </div>
                                      </PopoverPanel>
                                    )}
                                  </>
                                )}
                              </Popover>
                              <div className="flex items-center">
                                <button
                                  id="datepicker_previous_month_btn"
                                  onClick={() =>
                                    handlePreviousMonth(date, changeMonth, decreaseYear)
                                  }
                                  disabled={
                                    prevMonthButtonDisabled ||
                                    (date.getFullYear() === 2023 && date.getMonth() === 0)
                                  }
                                  aria-label="Previous month"
                                  className="focus-indicator"
                                >
                                  <FontAwesomeIcon icon={faChevronLeft} className="mr-2 h-4 w-4" />
                                </button>
                                <button
                                  id="datepicker_next_month_btn"
                                  onClick={() => handleNextMonth(date, changeMonth, increaseYear)}
                                  disabled={nextMonthButtonDisabled}
                                  aria-label="Next month"
                                  className="focus-indicator"
                                >
                                  <FontAwesomeIcon icon={faChevronRight} className="mr-2 h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    )}
                    <div className="mx-3 flex items-center justify-between border-t-[1px] py-2">
                      <button
                        id="datepicker_clear_selection"
                        type="button"
                        className={`flex text-xs ${startDate || endDate ? 'filter-selected-text cursor-pointer' : 'cursor-not-allowed text-[#868686]'}`}
                        disabled={!startDate && !endDate}
                        onClick={() => handleInputChange(null, 'clear')}
                        ref={closeButtonRef}
                      >
                        Clear Selection
                      </button>
                      <button
                        aria-label="Close date range picker"
                        className="filter-text-primary ml-auto text-xs"
                        onClick={handleClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </PopoverPanel>
              )}
            </>
          );
        }}
      </Popover>
    </div>
  );
};

export default DateRangePicker;
