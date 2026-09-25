import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import {
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-light-svg-icons';
import DateInputMask from '../MaskedInput/MaskInput';
import Tooltip from '../../../components/common/Tooltip/Tooltip';
import { Button } from '../../../components/common/Buttons';
import { twMerge } from 'tailwind-merge';

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

export interface DateRangePickerContentProps {
  topLabel: string;
  startLabel?: string;
  endLabel?: string;
  startDate: Date | null;
  endDate: Date | null;
  tabIndex: number;
  startPlaceholderText?: string;
  endPlaceholderText?: string;
  minDate?: Date;
  maxDate?: Date;
  onTabChange: (index: number) => void;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  startDateInputRef?: React.RefObject<any>;
  endDateInputRef?: React.RefObject<any>;
  startMonthPopoverRef?: React.RefObject<any>;
  endMonthPopoverRef?: React.RefObject<any>;
  startYearPopoverRef?: React.RefObject<any>;
  endYearPopoverRef?: React.RefObject<any>;
  startMonthButtonRef?: React.RefObject<any>;
  endMonthButtonRef?: React.RefObject<any>;
  focusedMonthIndex: number;
  startYearOpen: boolean;
  endYearOpen: boolean;
  startMonthOpen: boolean;
  endMonthOpen: boolean;
  startYearRangeStart: number;
  endYearRangeStart: number;
  focusedYearIndex: number;
  setFocusedMonthIndex: (index: number) => void;
  setStartYearOpen: (open: boolean) => void;
  setEndYearOpen: (open: boolean) => void;
  setStartMonthOpen: (open: boolean) => void;
  setEndMonthOpen: (open: boolean) => void;
  setFocusedYearIndex: (index: number) => void;
  onMonthInteraction: (
    e: React.MouseEvent | React.KeyboardEvent,
    monthIndex: number,
    changeMonth: (month: number) => void,
    isStart: boolean,
    isKeyboard?: boolean
  ) => void;
  onYearInteraction: (
    e: React.MouseEvent | React.KeyboardEvent,
    year: number,
    increaseYear: () => void,
    decreaseYear: () => void,
    date: Date,
    isStart: boolean,
    isKeyboard?: boolean
  ) => void;
  onYearNavigation: (direction: 'prev' | 'next', isStart: boolean) => void;
  generateYearRange: (isStart: boolean) => number[];
  isMonthDisabled: (monthIndex: number, isStart: boolean, year: number) => boolean;
  isYearDisabled: (year: number, isStart: boolean) => boolean;
  handlePreviousMonth: (
    date: Date,
    changeMonth: (month: number) => void,
    decreaseYear: () => void
  ) => void;
  handleNextMonth: (
    date: Date,
    changeMonth: (month: number) => void,
    increaseYear: () => void
  ) => void;
  handleDateKeyDown?: (e: React.KeyboardEvent, type: 'start' | 'end') => void;
  handleInputChange?: (
    date: Date | null,
    type: 'start' | 'end',
    parentReset?: boolean,
    isInline?: boolean
  ) => void;
  dateInputClassName?: string;
  tabButtonClassName?: string;
  isDarkTheme?: boolean;
}

const DateRangePickerContent: React.FC<DateRangePickerContentProps> = ({
  topLabel,
  startLabel = 'Start date',
  endLabel = 'End date',
  startDate,
  endDate,
  tabIndex,
  startPlaceholderText = 'Select start date',
  endPlaceholderText = 'Select end date',
  minDate,
  maxDate,
  onTabChange,
  onStartDateChange,
  onEndDateChange,
  startDateInputRef,
  endDateInputRef,
  startMonthPopoverRef,
  endMonthPopoverRef,
  startYearPopoverRef,
  endYearPopoverRef,
  startMonthButtonRef,
  endMonthButtonRef,
  focusedMonthIndex,
  startYearOpen,
  endYearOpen,
  startMonthOpen,
  endMonthOpen,
  startYearRangeStart,
  endYearRangeStart,
  focusedYearIndex,
  setFocusedMonthIndex,
  setStartYearOpen,
  setEndYearOpen,
  setStartMonthOpen,
  setEndMonthOpen,
  setFocusedYearIndex,
  onMonthInteraction,
  onYearInteraction,
  onYearNavigation,
  generateYearRange,
  isMonthDisabled,
  isYearDisabled,
  handlePreviousMonth,
  handleNextMonth,
  handleDateKeyDown,
  handleInputChange,
  dateInputClassName,
  tabButtonClassName,
  isDarkTheme = false,
}) => {
  return (
    <div className={`${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="text-[.8rem] font-semibold text-gray-500" role="heading" aria-level={3}>
          {topLabel}
        </div>
      </div>

      {/* Tab Navigation */}
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
            onClick={() => onTabChange(0)}
            className={twMerge(
              `focus-indicator flex h-full flex-col justify-center rounded-l-lg border-r-[1px] px-3 py-1 ${
                tabIndex === 0 ? 'selectedDateTab' : 'text-gray-700 hover:text-gray-500'
              }`,
              tabButtonClassName ?? ''
            )}
          >
            <div>{startLabel}</div>
            {startDate && <div>{moment(startDate).format('MMM DD, yyyy')}</div>}
          </button>
          <button
            id="datepicker_shiftEnd"
            role="tab"
            aria-selected={tabIndex === 1}
            aria-current={tabIndex === 1 ? 'true' : undefined}
            onClick={() => onTabChange(1)}
            className={twMerge(
              `focus-indicator flex h-full flex-col justify-center rounded-r-lg border-r-[1px] px-3 py-1 ${
                tabIndex === 1 ? 'selectedDateTab' : 'text-gray-700 hover:text-gray-500'
              }`,
              tabButtonClassName ?? ''
            )}
          >
            <div>{endLabel}</div>
            {endDate && <div>{moment(endDate).format('MMM DD, yyyy')}</div>}
          </button>
        </div>
      </div>

      {/* Start Date Tab Content */}
      {tabIndex === 0 && (
        <div>
          <DatePicker
            aria-label={topLabel}
            ref={startDateInputRef}
            selected={typeof startDate === 'string' ? new Date(startDate) : startDate || undefined}
            onChange={(date) => onStartDateChange(date)}
            selectsStart
            startDate={typeof startDate === 'string' ? new Date(startDate) : startDate || undefined}
            endDate={typeof endDate === 'string' ? new Date(endDate) : endDate || undefined}
            isClearable
            minDate={minDate || undefined}
            maxDate={
              endDate
                ? typeof endDate === 'string'
                  ? new Date(endDate)
                  : endDate
                : maxDate || undefined
            }
            placeholderText={startPlaceholderText}
            id="dateSearch"
            popperClassName="hidden"
            dateFormat="MM/dd/yyyy"
            ariaDescribedBy={'dateFormat'}
            autoComplete="off"
            customInput={
              <DateInputMask
                className={twMerge(
                  'focus-indicator bg-card mx-2 h-8 w-full min-w-[208px] rounded-md border-[1px] py-1 pr-3 pl-2 text-gray-900 focus-visible:ring-inset sm:text-sm sm:leading-6',
                  dateInputClassName ?? ''
                )}
              />
            }
          />

          {/* Date Format Info */}
          <div className="flex items-center gap-1 px-2 pt-1 text-xs text-gray-500" id="dateFormat">
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
                  <FontAwesomeIcon icon={faCircleInfo} className="text-default h-3 w-3" />
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

          {/* Inline DatePicker for Start Date */}
          <DatePicker
            selected={typeof startDate === 'string' ? new Date(startDate) : startDate || undefined}
            onChange={(date) => onStartDateChange(date)}
            onKeyDown={(e) => handleDateKeyDown?.(e, 'start')}
            selectsStart
            startDate={typeof startDate === 'string' ? new Date(startDate) : startDate || undefined}
            endDate={typeof endDate === 'string' ? new Date(endDate) : endDate || undefined}
            minDate={minDate || undefined}
            maxDate={
              endDate
                ? typeof endDate === 'string'
                  ? new Date(endDate)
                  : endDate
                : maxDate || undefined
            }
            dateFormat="MMM dd, yyyy"
            inline
            renderCustomHeader={({ date, changeMonth, increaseYear, decreaseYear }) => (
              <div className="mx-2 my-0 flex items-center justify-between">
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
                            startMonthButtonRef?.current?.setAttribute('aria-expanded', 'true');
                          } else {
                            setStartYearOpen(false);
                            setStartMonthOpen(false);
                            startMonthButtonRef?.current?.setAttribute('aria-expanded', 'false');
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

                      {/* Month Selector */}
                      {startMonthOpen && (
                        <PopoverPanel
                          ref={startMonthPopoverRef}
                          className="bg-card absolute top-[25px] w-max overflow-y-auto rounded-md border p-2 shadow-md"
                          static
                          role="dialog"
                          aria-modal="true"
                          aria-label="start month selector"
                        >
                          <div className="grid grid-cols-3 gap-1">
                            {months.map((month, index) => (
                              <button
                                key={month}
                                id={`datepicker_${month}_btn`}
                                onClick={(e) =>
                                  !isMonthDisabled(index, true, date.getFullYear()) &&
                                  onMonthInteraction(e, index, changeMonth, true)
                                }
                                onKeyDown={(e) =>
                                  !isMonthDisabled(index, true, date.getFullYear()) &&
                                  onMonthInteraction(e, index, changeMonth, true, true)
                                }
                                tabIndex={index === 0 ? 0 : -1}
                                disabled={isMonthDisabled(index, true, date.getFullYear())}
                                className={`focus-indicator rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] ${
                                  focusedMonthIndex === index ? 'bg-[#cacaca43]' : ''
                                } ${
                                  isMonthDisabled(index, true, date.getFullYear())
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                                }`}
                              >
                                {month}
                              </button>
                            ))}
                          </div>
                        </PopoverPanel>
                      )}

                      {/* Year Selector */}
                      {startYearOpen && (
                        <PopoverPanel
                          ref={startYearPopoverRef}
                          className="bg-card absolute top-[25px] w-max overflow-y-auto rounded-md border p-2 shadow-md"
                          static
                          role="dialog"
                          aria-modal="true"
                          aria-label="start year selector"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <button
                              onClick={() => onYearNavigation('prev', true)}
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
                              onClick={() => onYearNavigation('next', true)}
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
                          <div className="grid grid-cols-5 gap-1">
                            {generateYearRange(true).map((year, index) => (
                              <button
                                key={year}
                                id={`datepicker_start_year_${year}_btn`}
                                tabIndex={index === 0 ? 0 : -1}
                                onClick={(e) =>
                                  onYearInteraction(
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
                                  onYearInteraction(
                                    e,
                                    year,
                                    increaseYear,
                                    decreaseYear,
                                    date,
                                    true,
                                    true
                                  )
                                }
                                disabled={isYearDisabled(year, true)}
                                className={`focus-indicator w-full rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] focus:outline-none ${
                                  focusedYearIndex === index ? 'bg-[#cacaca43]' : ''
                                } ${
                                  isYearDisabled(year, true) ? 'cursor-not-allowed opacity-50' : ''
                                }`}
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
                    onClick={() => handlePreviousMonth(date, changeMonth, decreaseYear)}
                    disabled={date.getFullYear() === 2023 && date.getMonth() === 0}
                    aria-label="Previous month"
                    className="focus-indicator"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2 h-4 w-4" />
                  </button>
                  <button
                    id="datepicker_next_month_btn"
                    onClick={() => handleNextMonth(date, changeMonth, increaseYear)}
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

      {/* End Date Tab Content */}
      {tabIndex === 1 && (
        <div>
          <DatePicker
            ref={endDateInputRef}
            selected={typeof endDate === 'string' ? new Date(endDate) : endDate || undefined}
            onChange={(date) => onEndDateChange(date)}
            selectsEnd
            startDate={typeof startDate === 'string' ? new Date(startDate) : startDate || undefined}
            endDate={typeof endDate === 'string' ? new Date(endDate) : endDate || undefined}
            minDate={typeof startDate === 'string' ? new Date(startDate) : startDate || undefined}
            maxDate={maxDate || undefined}
            isClearable
            placeholderText={endPlaceholderText}
            id="dateSearch"
            popperClassName="hidden"
            dateFormat="MM/dd/yyyy"
            ariaDescribedBy={'dateFormat'}
            autoComplete="off"
            customInput={
              <DateInputMask className="focus-indicator bg-card mx-2 h-8 w-full min-w-[208px] rounded-md border-[1px] py-2 pr-3 pl-2 text-gray-900 focus-visible:ring-inset sm:text-sm sm:leading-6" />
            }
          />

          {/* Date Format Info */}
          <div className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500" id="dateFormat">
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
                  <FontAwesomeIcon icon={faCircleInfo} className="text-default h-3 w-3" />
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

          {/* Inline DatePicker for End Date */}
          <DatePicker
            selected={typeof endDate === 'string' ? new Date(endDate) : endDate || undefined}
            onChange={(date) => onEndDateChange(date)}
            onKeyDown={(e) => handleDateKeyDown?.(e, 'end')}
            selectsEnd
            startDate={typeof startDate === 'string' ? new Date(startDate) : startDate || undefined}
            endDate={typeof endDate === 'string' ? new Date(endDate) : endDate || undefined}
            minDate={typeof startDate === 'string' ? new Date(startDate) : startDate || undefined}
            maxDate={maxDate || undefined}
            isClearable
            dateFormat="MMM dd, yyyy"
            inline
            renderCustomHeader={({ date, changeMonth, increaseYear, decreaseYear }) => (
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
                            endMonthButtonRef?.current?.setAttribute('aria-expanded', 'true');
                          } else {
                            setEndYearOpen(false);
                            setEndMonthOpen(false);
                            endMonthButtonRef?.current?.setAttribute('aria-expanded', 'false');
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

                      {/* Month Selector */}
                      {endMonthOpen && (
                        <PopoverPanel
                          ref={endMonthPopoverRef}
                          className="bg-card absolute top-[25px] w-max overflow-y-auto rounded-md border p-2 shadow-md"
                          static
                          role="dialog"
                          aria-modal="true"
                          aria-label="End month selector"
                        >
                          <div className="grid grid-cols-3 gap-1">
                            {months.map((month, index) => (
                              <button
                                key={month}
                                id={`datepicker_${month}_btn`}
                                tabIndex={index === 0 ? 0 : -1}
                                onClick={(e) =>
                                  !isMonthDisabled(index, false, date.getFullYear()) &&
                                  onMonthInteraction(e, index, changeMonth, false)
                                }
                                onKeyDown={(e) =>
                                  !isMonthDisabled(index, false, date.getFullYear()) &&
                                  onMonthInteraction(e, index, changeMonth, false, true)
                                }
                                disabled={isMonthDisabled(index, false, date.getFullYear())}
                                className={`focus-indicator rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] ${
                                  focusedMonthIndex === index ? 'bg-[#cacaca43]' : ''
                                } ${
                                  isMonthDisabled(index, false, date.getFullYear())
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                                }`}
                              >
                                {month}
                              </button>
                            ))}
                          </div>
                        </PopoverPanel>
                      )}

                      {/* Year Selector */}
                      {endYearOpen && (
                        <PopoverPanel
                          ref={endYearPopoverRef}
                          className="bg-card absolute top-[25px] w-max overflow-y-auto rounded-md border p-2 shadow-md"
                          static
                          role="dialog"
                          aria-modal="true"
                          aria-label="End year selector"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <button
                              onClick={() => onYearNavigation('prev', false)}
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
                              onClick={() => onYearNavigation('next', false)}
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
                          <div className="grid grid-cols-5 gap-1">
                            {generateYearRange(false).map((year, index) => (
                              <button
                                key={year}
                                id={`datepicker_end_year_${year}_btn`}
                                tabIndex={index === 0 ? 0 : -1}
                                onClick={(e) =>
                                  onYearInteraction(
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
                                  onYearInteraction(
                                    e,
                                    year,
                                    increaseYear,
                                    decreaseYear,
                                    date,
                                    false,
                                    true
                                  )
                                }
                                disabled={isYearDisabled(year, false)}
                                className={`focus-indicator w-full rounded-md px-1 py-1 text-center text-xs hover:bg-[#cacaca43] focus:outline-none ${
                                  focusedYearIndex === index ? 'bg-[#cacaca43]' : ''
                                } ${
                                  isYearDisabled(year, false) ? 'cursor-not-allowed opacity-50' : ''
                                }`}
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
                    onClick={() => handlePreviousMonth(date, changeMonth, decreaseYear)}
                    disabled={date.getFullYear() === 2023 && date.getMonth() === 0}
                    aria-label="Previous month"
                    className="focus-indicator"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2 h-4 w-4" />
                  </button>
                  <button
                    id="datepicker_next_month_btn"
                    onClick={() => handleNextMonth(date, changeMonth, increaseYear)}
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
    </div>
  );
};

export default DateRangePickerContent;
