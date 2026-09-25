import React, { useState, useRef } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import DateRangePickerContent from './DateRangePickerContent';

const DateRangePickerContentDemo: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Refs for the date picker components
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);
  const startMonthPopoverRef = useRef(null);
  const endMonthPopoverRef = useRef(null);
  const startYearPopoverRef = useRef(null);
  const endYearPopoverRef = useRef(null);
  const startMonthButtonRef = useRef(null);
  const endMonthButtonRef = useRef(null);

  // State for month/year selectors
  const [focusedMonthIndex, setFocusedMonthIndex] = useState(0);
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);
  const [startMonthOpen, setStartMonthOpen] = useState(false);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [startYearRangeStart, setStartYearRangeStart] = useState(2023);
  const [endYearRangeStart, setEndYearRangeStart] = useState(2023);
  const [focusedYearIndex, setFocusedYearIndex] = useState(0);

  // Mock functions - you would implement these based on your needs
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

  const handleYearInteraction = (
    e: React.MouseEvent | React.KeyboardEvent,
    year: number,
    increaseYear: () => void,
    decreaseYear: () => void,
    date: Date,
    isStart: boolean,
    isKeyboard?: boolean
  ) => {
    // Implement year selection logic
    if (isStart) {
      setStartYearOpen(false);
    } else {
      setEndYearOpen(false);
    }
  };

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

  const generateYearRange = (isStart: boolean) => {
    const start = isStart ? startYearRangeStart : endYearRangeStart;
    return Array.from({ length: 20 }, (_, i) => start + i);
  };

  const isMonthDisabled = (monthIndex: number, isStart: boolean, year: number) => {
    // Implement month validation logic
    return false;
  };

  const isYearDisabled = (year: number, isStart: boolean) => {
    // Implement year validation logic
    return year < 2023;
  };

  const handleDateKeyDown = (e: React.KeyboardEvent, type: 'start' | 'end') => {
    // Implement keyboard navigation logic
  };

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

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">DateRangePickerContent Demo</h2>

      <Popover className="relative">
        <PopoverButton
          onClick={() => setIsOpen(!isOpen)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            : 'Select Date Range'}
        </PopoverButton>

        {isOpen && (
          <PopoverPanel className="bg-card absolute top-full z-50 mt-2 rounded-md border shadow-lg">
            <DateRangePickerContent
              topLabel="Select Date Range"
              startLabel="Start Date"
              endLabel="End Date"
              startDate={startDate}
              endDate={endDate}
              tabIndex={tabIndex}
              startPlaceholderText="Select start date"
              endPlaceholderText="Select end date"
              minDate={new Date('2023-01-01')}
              maxDate={new Date('2030-12-31')}
              onTabChange={setTabIndex}
              onStartDateChange={handleInputChange}
              onEndDateChange={handleInputChange}
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
              onMonthInteraction={handleMonthInteraction}
              onYearInteraction={handleYearInteraction}
              onYearNavigation={handleYearNavigation}
              generateYearRange={generateYearRange}
              isMonthDisabled={isMonthDisabled}
              isYearDisabled={isYearDisabled}
              handleDateKeyDown={handleDateKeyDown}
              handleInputChange={handleInputChange}
            />
          </PopoverPanel>
        )}
      </Popover>

      <div className="mt-4">
        <p>
          <strong>Selected Start Date:</strong>{' '}
          {startDate ? startDate.toLocaleDateString() : 'None'}
        </p>
        <p>
          <strong>Selected End Date:</strong> {endDate ? endDate.toLocaleDateString() : 'None'}
        </p>
        <p>
          <strong>Current Tab:</strong> {tabIndex === 0 ? 'Start Date' : 'End Date'}
        </p>
      </div>
    </div>
  );
};

export default DateRangePickerContentDemo;
