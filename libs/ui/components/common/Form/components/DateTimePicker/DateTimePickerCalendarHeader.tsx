import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
} from '@fortawesome/pro-light-svg-icons';
import classNames from 'classnames';
import { format, getMonth, getYear } from 'date-fns';
import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

const YEAR_RANGE_SIZE = 20;
const YEAR_GRID_COLUMNS = 5;
const MONTH_GRID_COLUMNS = 3;

export type DateTimePickerCalendarHeaderProps = ReactDatePickerCustomHeaderProps & {
  showMonthDropdown: boolean;
  showYearDropdown: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
  useShortMonthInDropdown?: boolean;
};

const DateTimePickerCalendarHeader: React.FC<DateTimePickerCalendarHeaderProps> = ({
  date,
  changeMonth,
  increaseYear,
  decreaseYear,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  showMonthDropdown,
  showYearDropdown,
  minDate,
  maxDate,
  useShortMonthInDropdown = false,
}) => {
  const triggerId = useId();
  const yearPanelId = useId();
  const monthPanelId = useId();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const yearPanelRef = useRef<HTMLDivElement>(null);
  const monthPanelRef = useRef<HTMLDivElement>(null);
  const yearButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const monthButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const yearRangePrevRef = useRef<HTMLButtonElement>(null);

  const selectedMonth = getMonth(date);
  const selectedYear = getYear(date);

  const [yearSelectorOpen, setYearSelectorOpen] = useState(false);
  const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);
  const [focusedYearIndex, setFocusedYearIndex] = useState(0);
  const [focusedMonthIndex, setFocusedMonthIndex] = useState(selectedMonth);
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const minYear = minDate ? getYear(minDate) : selectedYear - 100;
    return Math.max(selectedYear - 10, minYear);
  });

  const monthLabel = format(date, useShortMonthInDropdown ? 'MMM' : 'MMMM');
  const headerLabel = `${monthLabel} ${selectedYear}`;
  const selectorOpen = yearSelectorOpen || monthSelectorOpen;

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: index,
        label: format(new Date(selectedYear, index, 1), useShortMonthInDropdown ? 'MMM' : 'MMMM'),
      })),
    [selectedYear, useShortMonthInDropdown]
  );

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let index = 0; index < YEAR_RANGE_SIZE; index += 1) {
      years.push(yearRangeStart + index);
    }
    return years;
  }, [yearRangeStart]);

  const isYearDisabled = useCallback(
    (year: number) => {
      if (minDate && year < getYear(minDate)) return true;
      if (maxDate && year > getYear(maxDate)) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const isMonthDisabled = useCallback(
    (monthIndex: number, currentYear: number) => {
      if (minDate) {
        const minYear = getYear(minDate);
        const minMonth = getMonth(minDate);
        if (currentYear < minYear) return true;
        if (currentYear === minYear && monthIndex < minMonth) return true;
      }
      if (maxDate) {
        const maxYear = getYear(maxDate);
        const maxMonth = getMonth(maxDate);
        if (currentYear > maxYear) return true;
        if (currentYear === maxYear && monthIndex > maxMonth) return true;
      }
      return false;
    },
    [minDate, maxDate]
  );

  const closeSelectors = useCallback((returnFocus = true) => {
    setYearSelectorOpen(false);
    setMonthSelectorOpen(false);
    if (returnFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  const openSelector = useCallback(() => {
    if (showYearDropdown) {
      const index = Math.max(0, Math.min(YEAR_RANGE_SIZE - 1, selectedYear - yearRangeStart));
      setFocusedYearIndex(index);
      setYearSelectorOpen(true);
      setMonthSelectorOpen(false);
    } else if (showMonthDropdown) {
      setFocusedMonthIndex(selectedMonth);
      setMonthSelectorOpen(true);
      setYearSelectorOpen(false);
    }
  }, [showMonthDropdown, showYearDropdown, selectedMonth, selectedYear, yearRangeStart]);

  const handleHeaderToggle = () => {
    if (!selectorOpen) {
      openSelector();
      return;
    }
    closeSelectors();
  };

  const findNextEnabledYearIndex = (startIndex: number, direction: 1 | -1) => {
    for (let step = 1; step <= YEAR_RANGE_SIZE; step += 1) {
      const index = (startIndex + direction * step + YEAR_RANGE_SIZE) % YEAR_RANGE_SIZE;
      if (!isYearDisabled(yearOptions[index])) {
        return index;
      }
    }
    return startIndex;
  };

  const findNextEnabledMonthIndex = (startIndex: number, direction: 1 | -1) => {
    for (let step = 1; step <= 12; step += 1) {
      const index = (startIndex + direction * step + 12) % 12;
      if (!isMonthDisabled(index, selectedYear)) {
        return index;
      }
    }
    return startIndex;
  };

  const focusYearButton = (index: number) => {
    yearButtonRefs.current[index]?.focus();
  };

  const focusMonthButton = (index: number) => {
    monthButtonRefs.current[index]?.focus();
  };

  const handleYearNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newStart = yearRangeStart - YEAR_RANGE_SIZE;
      const minYear = minDate ? getYear(minDate) : Number.NEGATIVE_INFINITY;
      if (newStart + YEAR_RANGE_SIZE - 1 >= minYear) {
        setYearRangeStart(Math.max(newStart, minYear));
      }
      return;
    }

    setYearRangeStart(yearRangeStart + YEAR_RANGE_SIZE);
  };

  const handleYearSelection = (year: number) => {
    const yearDiff = year - selectedYear;

    if (yearDiff > 0) {
      for (let index = 0; index < yearDiff; index += 1) {
        increaseYear();
      }
    } else if (yearDiff < 0) {
      for (let index = 0; index < Math.abs(yearDiff); index += 1) {
        decreaseYear();
      }
    }

    if (showMonthDropdown) {
      setYearSelectorOpen(false);
      setMonthSelectorOpen(true);
      setFocusedMonthIndex(selectedMonth);
      return;
    }

    closeSelectors();
  };

  const moveYearFocusByRow = (index: number, direction: 1 | -1) => {
    let candidate = (index + direction * YEAR_GRID_COLUMNS + YEAR_RANGE_SIZE) % YEAR_RANGE_SIZE;

    for (let step = 0; step < YEAR_RANGE_SIZE / YEAR_GRID_COLUMNS; step += 1) {
      if (!isYearDisabled(yearOptions[candidate])) {
        setFocusedYearIndex(candidate);
        focusYearButton(candidate);
        return;
      }
      candidate = (candidate + direction * YEAR_GRID_COLUMNS + YEAR_RANGE_SIZE) % YEAR_RANGE_SIZE;
    }
  };

  const handleYearKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    year: number,
    index: number
  ) => {
    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const nextIndex = findNextEnabledYearIndex(index, 1);
        setFocusedYearIndex(nextIndex);
        focusYearButton(nextIndex);
        return;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const nextIndex = findNextEnabledYearIndex(index, -1);
        setFocusedYearIndex(nextIndex);
        focusYearButton(nextIndex);
        return;
      }
      case 'ArrowDown': {
        event.preventDefault();
        moveYearFocusByRow(index, 1);
        return;
      }
      case 'ArrowUp': {
        event.preventDefault();
        moveYearFocusByRow(index, -1);
        return;
      }
      case 'Home': {
        event.preventDefault();
        const firstEnabled = yearOptions.findIndex((y) => !isYearDisabled(y));
        if (firstEnabled >= 0) {
          setFocusedYearIndex(firstEnabled);
          focusYearButton(firstEnabled);
        }
        return;
      }
      case 'End': {
        event.preventDefault();
        const lastEnabled = [...yearOptions]
          .map((y, i) => ({ y, i }))
          .reverse()
          .find(({ y }) => !isYearDisabled(y));
        if (lastEnabled) {
          setFocusedYearIndex(lastEnabled.i);
          focusYearButton(lastEnabled.i);
        }
        return;
      }
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        closeSelectors();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isYearDisabled(year)) {
          handleYearSelection(year);
        }
        return;
      default:
        return;
    }
  };

  const handleMonthSelection = (monthIndex: number) => {
    changeMonth(monthIndex);
    closeSelectors();
  };

  const handleMonthKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    monthIndex: number
  ) => {
    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const nextIndex = findNextEnabledMonthIndex(monthIndex, 1);
        setFocusedMonthIndex(nextIndex);
        focusMonthButton(nextIndex);
        return;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const nextIndex = findNextEnabledMonthIndex(monthIndex, -1);
        setFocusedMonthIndex(nextIndex);
        focusMonthButton(nextIndex);
        return;
      }
      case 'ArrowDown': {
        event.preventDefault();
        let candidate = (monthIndex + MONTH_GRID_COLUMNS) % 12;
        if (!isMonthDisabled(candidate, selectedYear)) {
          setFocusedMonthIndex(candidate);
          focusMonthButton(candidate);
        } else {
          const nextIndex = findNextEnabledMonthIndex(monthIndex, 1);
          setFocusedMonthIndex(nextIndex);
          focusMonthButton(nextIndex);
        }
        return;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const candidate = (monthIndex - MONTH_GRID_COLUMNS + 12) % 12;
        if (!isMonthDisabled(candidate, selectedYear)) {
          setFocusedMonthIndex(candidate);
          focusMonthButton(candidate);
        } else {
          const nextIndex = findNextEnabledMonthIndex(monthIndex, -1);
          setFocusedMonthIndex(nextIndex);
          focusMonthButton(nextIndex);
        }
        return;
      }
      case 'Home': {
        event.preventDefault();
        const firstEnabled = monthOptions.findIndex(
          (option) => !isMonthDisabled(option.value, selectedYear)
        );
        if (firstEnabled >= 0) {
          setFocusedMonthIndex(firstEnabled);
          focusMonthButton(firstEnabled);
        }
        return;
      }
      case 'End': {
        event.preventDefault();
        const lastEnabled = [...monthOptions]
          .map((option, i) => ({ option, i }))
          .reverse()
          .find(({ option }) => !isMonthDisabled(option.value, selectedYear));
        if (lastEnabled) {
          setFocusedMonthIndex(lastEnabled.i);
          focusMonthButton(lastEnabled.i);
        }
        return;
      }
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        closeSelectors();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isMonthDisabled(monthIndex, selectedYear)) {
          handleMonthSelection(monthIndex);
        }
        return;
      default:
        return;
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      decreaseYear();
      changeMonth(11);
      return;
    }
    changeMonth(selectedMonth - 1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      increaseYear();
      changeMonth(0);
      return;
    }
    changeMonth(selectedMonth + 1);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHeaderToggle();
      return;
    }

    if (event.key === 'ArrowDown' && !selectorOpen) {
      event.preventDefault();
      openSelector();
    }
  };

  useEffect(() => {
    if (!yearSelectorOpen) return;

    const indexInRange = selectedYear - yearRangeStart;
    let focusIndex =
      indexInRange >= 0 && indexInRange < YEAR_RANGE_SIZE && !isYearDisabled(selectedYear)
        ? indexInRange
        : yearOptions.findIndex((year) => !isYearDisabled(year));

    if (focusIndex < 0) {
      focusIndex = 0;
    }

    setFocusedYearIndex(focusIndex);
    requestAnimationFrame(() => focusYearButton(focusIndex));
  }, [yearSelectorOpen, yearRangeStart]);

  useEffect(() => {
    if (!monthSelectorOpen) return;

    setFocusedMonthIndex(selectedMonth);
    requestAnimationFrame(() => {
      focusMonthButton(selectedMonth);
    });
  }, [monthSelectorOpen, selectedMonth]);

  useEffect(() => {
    if (!selectorOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const inYearPanel = yearPanelRef.current?.contains(target);
      const inMonthPanel = monthPanelRef.current?.contains(target);
      const inTrigger = triggerRef.current?.contains(target);

      if (!inYearPanel && !inMonthPanel && !inTrigger) {
        closeSelectors(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      closeSelectors();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape, true);
    };
  }, [selectorOpen, closeSelectors]);

  const minYear = minDate ? getYear(minDate) : null;
  const canNavigateYearRangeBack = minYear === null || yearRangeStart > minYear;
  const activePanelId = yearSelectorOpen
    ? yearPanelId
    : monthSelectorOpen
      ? monthPanelId
      : undefined;

  return (
    <div className="exxat-datetime-picker__header m-2 flex items-center justify-between">
      <div className="relative">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          className="exxat-datetime-picker__header-trigger focus-indicator flex items-center"
          onClick={handleHeaderToggle}
          onKeyDown={handleTriggerKeyDown}
          aria-expanded={selectorOpen}
          aria-haspopup="dialog"
          aria-controls={activePanelId}
          aria-label={`${headerLabel}, choose month and year`}
        >
          <span className="mr-1 font-semibold" aria-hidden="true">
            {monthLabel}
          </span>
          <span className="mt-[2px] font-semibold" aria-hidden="true">
            {selectedYear}
          </span>
          <FontAwesomeIcon
            icon={selectorOpen ? faChevronUp : faChevronDown}
            className="ml-1 h-4 w-4"
            aria-hidden="true"
          />
        </button>

        {showYearDropdown && yearSelectorOpen && (
          <div
            ref={yearPanelRef}
            id={yearPanelId}
            role="dialog"
            aria-modal="false"
            aria-label="Year selector"
            className="exxat-datetime-picker__year-popover bg-card absolute top-[25px] z-10 w-max overflow-y-auto rounded-md border p-2 shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                ref={yearRangePrevRef}
                type="button"
                onClick={() => handleYearNavigation('prev')}
                disabled={!canNavigateYearRangeBack}
                className={classNames(
                  'focus-indicator p-1',
                  !canNavigateYearRangeBack && 'cursor-not-allowed opacity-50'
                )}
                aria-label="Previous years"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" aria-hidden="true" />
              </button>
              <span className="text-xs font-semibold" aria-live="polite">
                {yearRangeStart} - {yearRangeStart + YEAR_RANGE_SIZE - 1}
              </span>
              <button
                type="button"
                onClick={() => handleYearNavigation('next')}
                className="focus-indicator p-1"
                aria-label="Next years"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
            <div
              role="grid"
              aria-label="Select year"
              className="exxat-datetime-picker__year-grid gap-1"
              style={{ display: 'grid', gridTemplateColumns: `repeat(${YEAR_GRID_COLUMNS}, 1fr)` }}
            >
              {yearOptions.map((year, index) => (
                <button
                  key={year}
                  ref={(element) => {
                    yearButtonRefs.current[index] = element;
                  }}
                  type="button"
                  role="gridcell"
                  tabIndex={index === focusedYearIndex ? 0 : -1}
                  disabled={isYearDisabled(year)}
                  className={classNames(
                    'focus-indicator w-full rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43]',
                    isYearDisabled(year) && 'cursor-not-allowed opacity-50',
                    year === selectedYear && 'bg-[#cacaca43] font-semibold',
                    focusedYearIndex === index && year !== selectedYear && 'ring-primary ring-2'
                  )}
                  aria-label={`${year}${year === selectedYear ? ', selected' : ''}`}
                  aria-selected={year === selectedYear}
                  aria-disabled={isYearDisabled(year)}
                  onClick={() => !isYearDisabled(year) && handleYearSelection(year)}
                  onKeyDown={(event) => handleYearKeyDown(event, year, index)}
                  onFocus={() => setFocusedYearIndex(index)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}

        {showMonthDropdown && monthSelectorOpen && (
          <div
            ref={monthPanelRef}
            id={monthPanelId}
            role="dialog"
            aria-modal="false"
            aria-label="Month selector"
            className="exxat-datetime-picker__month-popover bg-card absolute top-[25px] z-10 w-max overflow-y-auto rounded-md border p-2 shadow-md"
          >
            <div role="grid" aria-label="Select month" className="grid grid-cols-3 gap-1">
              {monthOptions.map((option) => (
                <button
                  key={option.value}
                  ref={(element) => {
                    monthButtonRefs.current[option.value] = element;
                  }}
                  type="button"
                  role="gridcell"
                  tabIndex={option.value === focusedMonthIndex ? 0 : -1}
                  disabled={isMonthDisabled(option.value, selectedYear)}
                  className={classNames(
                    'focus-indicator rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43]',
                    option.value === selectedMonth && 'bg-[#cacaca43] font-semibold',
                    focusedMonthIndex === option.value &&
                      option.value !== selectedMonth &&
                      'ring-primary ring-2',
                    isMonthDisabled(option.value, selectedYear) && 'cursor-not-allowed opacity-50'
                  )}
                  aria-label={`${option.label}${option.value === selectedMonth ? ', selected' : ''}`}
                  aria-selected={option.value === selectedMonth}
                  aria-disabled={isMonthDisabled(option.value, selectedYear)}
                  onClick={() =>
                    !isMonthDisabled(option.value, selectedYear) &&
                    handleMonthSelection(option.value)
                  }
                  onKeyDown={(event) => handleMonthKeyDown(event, option.value)}
                  onFocus={() => setFocusedMonthIndex(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={handlePreviousMonth}
          disabled={prevMonthButtonDisabled}
          className="focus-indicator"
          aria-label="Previous month"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2 h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleNextMonth}
          disabled={nextMonthButtonDisabled}
          className="focus-indicator"
          aria-label="Next month"
        >
          <FontAwesomeIcon icon={faChevronRight} className="mr-2 h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default DateTimePickerCalendarHeader;
