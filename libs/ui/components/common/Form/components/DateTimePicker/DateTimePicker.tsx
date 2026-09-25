import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker, { type ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCalendarClock, faClock } from '@fortawesome/pro-light-svg-icons';
import classNames from 'classnames';
import { RenderLabel } from '../../shared';
import RenderPreviousData from '../RenderPreviousData/RenderPreviousData';
import type { dateTimePickerProps } from './DateTimePicker.types';
import DateTimePickerCalendarHeader from './DateTimePickerCalendarHeader';
import {
  applyDateTimeMask,
  formatDateTimeValue,
  getAllowedMaskChars,
  getMaskPlaceholder,
  getTimeFormat,
  isMaskComplete,
  parseMaskedDateTime,
  resolveTimeOnlyFormat,
  toDateFnsFormat,
} from './DateTimePicker.mask';

import 'react-datepicker/dist/react-datepicker.css';

const DEFAULT_FORMAT = 'dd/MM/yyyy HH:mm';
const DEFAULT_TIME_INTERVALS = 15;

const INPUT_CLASS =
  'h-10 w-full rounded-md border-1 bg-card text-black placeholder:text-[#727279] shadow-sm focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:border-[#e5e7eb] dark:bg-gray-800 dark:text-black dark:ring-gray-600 dark:focus-visible:ring-primary-900 sm:text-sm sm:leading-6';

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  testid?: string;
  format: string;
  controlledValue?: string;
  isClearable?: boolean;
  hasValue?: boolean;
  disabled?: boolean;
  calendarLabel?: string;
  isOpen?: boolean;
  isTimeOnly?: boolean;
  LeadingIcon?: React.ReactNode;
  onClear?: () => void;
  setIsOpen?: (open: boolean) => void;
  onMaskedChange?: (masked: string, parsed: Date | null) => void;
  onChangeRaw?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  calendarButtonRef?: React.RefObject<HTMLButtonElement | null>;
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      testid,
      format,
      controlledValue,
      value,
      isClearable = false,
      hasValue,
      disabled,
      calendarLabel,
      isOpen,
      isTimeOnly = false,
      LeadingIcon,
      onClear,
      setIsOpen,
      onMaskedChange,
      onChangeRaw,
      inputRef,
      calendarButtonRef,
      onBlur,
      onKeyDown,
      onClick: _ignoredClick,
      onFocus,
      onChange: _ignoredChange,
      className,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState('');
    const isTypingRef = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const allowedChars = useMemo(() => getAllowedMaskChars(format), [format]);

    useEffect(() => {
      const external =
        controlledValue !== undefined ? controlledValue : value !== undefined ? String(value) : '';
      if (!isTypingRef.current) {
        setLocalValue(external || '');
      }
    }, [controlledValue, value]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = applyDateTimeMask(e.target.value, format);
      setLocalValue(masked);
      isTypingRef.current = true;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const parsed = isMaskComplete(masked, format) ? parseMaskedDateTime(masked, format) : null;
      onMaskedChange?.(masked, parsed);

      if (onChangeRaw) {
        onChangeRaw({
          ...e,
          target: { ...e.target, value: masked },
        } as React.ChangeEvent<HTMLInputElement>);
      }

      timeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        const external =
          controlledValue !== undefined
            ? controlledValue
            : value !== undefined
              ? String(value)
              : undefined;
        if (external !== undefined) {
          setLocalValue(external);
        }
      }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen?.(true);
        return;
      }

      if (e.key === 'Escape') {
        setIsOpen?.(false);
      }

      const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'Enter',
        'Escape',
        'Control',
        'Alt',
        'Meta',
        'Shift',
      ];

      const isNumeric = /^[0-9]$/.test(e.key);
      const isAllowedChar = allowedChars.has(e.key);

      if (
        !isNumeric &&
        !isAllowedChar &&
        !allowedKeys.includes(e.key) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
      }

      onKeyDown?.(e);
    };

    const externalValue =
      controlledValue !== undefined ? controlledValue : value !== undefined ? String(value) : '';
    const inputValue = isTypingRef.current ? localValue : externalValue;
    const openLabel = calendarLabel || (isTimeOnly ? 'Open time picker' : 'Open date time picker');

    return (
      <div className="relative flex w-full items-center">
        {LeadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {LeadingIcon}
          </div>
        )}
        <input
          {...props}
          id={props.id}
          aria-label={label || calendarLabel || 'Date and time'}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          autoComplete="off"
          disabled={disabled}
          data-testid={testid}
          ref={inputRef || ref}
          value={inputValue || ''}
          placeholder={placeholder || getMaskPlaceholder(format)}
          className={classNames(INPUT_CLASS, LeadingIcon ? 'pl-9' : 'pl-3', 'pr-20', className)}
          onFocus={onFocus}
          onClick={() => setIsOpen?.(true)}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onBlur={onBlur}
          inputMode="numeric"
        />
        <div className="absolute top-0 right-0 flex h-full items-center pr-2">
          {hasValue && isClearable && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClear?.();
              }}
              className="focus-visible:bg-default focus-indicator hover:text-default mr-1 flex h-4 w-4 items-center justify-center rounded-full border border-black text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-300"
              disabled={disabled}
              aria-label={`Clear ${label || calendarLabel || placeholder || 'selection'}`}
            >
              <FontAwesomeIcon icon={faTimes} className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen?.(true);
            }}
            disabled={disabled}
            className="focus-indicator hover:text-default ml-1 flex h-4 w-4 items-center justify-center text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
            aria-label={openLabel}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            ref={calendarButtonRef}
          >
            <FontAwesomeIcon
              icon={isTimeOnly ? faClock : faCalendarClock}
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    );
  }
);

CustomInput.displayName = 'DateTimePickerCustomInput';

const DateTimePickerComponent: React.FC<dateTimePickerProps> = ({
  id,
  testid = 'dateTimePicker',
  label,
  className = '',
  wrapperClassName,
  selected = null,
  dateFormat,
  format,
  disabled = false,
  required = false,
  isClearable = false,
  hintText = '',
  placeholder,
  placeholderText,
  calendarLabel,
  ariaDescribedBy,
  LeadingIcon,
  isDisableTextUI = false,
  prevDefaultData = { label: 'Edited by Site', data: null },
  minDate,
  maxDate,
  minTime,
  maxTime,
  showTimeSelect = true,
  showTimeInput = false,
  showTimeSelectOnly = false,
  use12HourFormat = false,
  timeIntervals = DEFAULT_TIME_INTERVALS,
  timeCaption = 'Time',
  showMonthDropdown = false,
  showYearDropdown = false,
  useShortMonthInDropdown = false,
  onChange = () => {},
  onBlur,
  onClear,
  onChangeRaw,
  ...props
}) => {
  const effectiveFormat = useMemo(() => {
    const userFormat = dateFormat || format;
    if (showTimeSelectOnly) {
      return resolveTimeOnlyFormat(userFormat, use12HourFormat);
    }
    return userFormat || DEFAULT_FORMAT;
  }, [dateFormat, format, showTimeSelectOnly, use12HourFormat]);
  const dateFnsFormatStr = useMemo(() => toDateFnsFormat(effectiveFormat), [effectiveFormat]);
  const timeFormatStr = useMemo(() => getTimeFormat(effectiveFormat), [effectiveFormat]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(selected);
  const [maskedText, setMaskedText] = useState(() =>
    formatDateTimeValue(selected, effectiveFormat)
  );
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const selectTodayRef = useRef<() => void>(() => {});

  useEffect(() => {
    setSelectedDate(selected);
    setMaskedText(formatDateTimeValue(selected, effectiveFormat));
  }, [selected, effectiveFormat]);

  useEffect(() => {
    if (!isOpen) return;

    const closePicker = () => {
      setIsOpen(false);
      setTimeout(() => calendarButtonRef.current?.focus(), 0);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePicker();
      }
    };

    // Portal popper sits outside the input wrapper, so react-datepicker's
    // onClickOutside can miss outside clicks with customInput. Handle it ourselves.
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      const inField = !!containerRef.current?.contains(target);
      const inPopper = !!(
        (target as Element).closest?.('.exxat-datetime-picker__popper') ||
        (target as Element).closest?.('.react-datepicker-popper') ||
        (target as Element).closest?.('.react-datepicker')
      );

      if (!inField && !inPopper) {
        setIsOpen(false);
      }
    };

    const addFooter = () => {
      const calendar =
        document.querySelector('.exxat-datetime-picker__popper .react-datepicker') ||
        document.querySelector('.react-datepicker-popper .react-datepicker') ||
        document.querySelector('.react-datepicker');
      if (!calendar) return;

      calendar.querySelector('.exxat-datetime-picker__footer')?.remove();

      const showTodayButton = !showTimeSelectOnly;
      const footer = document.createElement('div');
      footer.className = showTodayButton
        ? 'exxat-datetime-picker__footer'
        : 'exxat-datetime-picker__footer exxat-datetime-picker__footer--close-only';

      if (showTodayButton) {
        const todayButton = document.createElement('button');
        todayButton.type = 'button';
        todayButton.dataset.action = 'today';
        todayButton.className =
          'text-primary text-xs px-2 rounded hover:bg-primary-50 focus-indicator';
        todayButton.setAttribute('aria-label', "Select today's date and current time");
        todayButton.textContent = 'Today';
        todayButton.addEventListener('click', (e) => {
          e.preventDefault();
          selectTodayRef.current();
        });
        footer.appendChild(todayButton);
      }

      const closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.dataset.action = 'close';
      closeButton.className =
        'text-primary text-xs px-2 rounded hover:bg-primary-50 focus-indicator';
      closeButton.setAttribute(
        'aria-label',
        `Close ${label || calendarLabel || 'date time picker'}`
      );
      closeButton.textContent = 'Close';
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        closePicker();
      });
      footer.appendChild(closeButton);

      const monthContainer = calendar.querySelector('.react-datepicker__month-container');
      const timeContainer = calendar.querySelector('.react-datepicker__time-container');
      if (monthContainer) monthContainer.appendChild(footer);
      else if (timeContainer) timeContainer.appendChild(footer);
      else calendar.appendChild(footer);
    };

    const enhanceTimeListA11y = () => {
      const container = document.querySelector('.react-datepicker__time');
      const timeList = document.querySelectorAll('.react-datepicker__time-list-item');
      if (container) {
        container.classList.add(
          'focus-visible:outline',
          'focus-visible:outline-2',
          'focus-visible:outline-primary'
        );
        container.setAttribute('tabindex', '-1');
      }
      timeList.forEach((item) => {
        item.classList.add(
          'focus-visible:outline',
          'focus-visible:outline-2',
          'focus-visible:outline-primary',
          'focus-visible:outline-offset-[-5px]'
        );
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    const footerTimer = setTimeout(addFooter, 0);
    const a11yTimer = setTimeout(enhanceTimeListA11y, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      clearTimeout(footerTimer);
      clearTimeout(a11yTimer);
    };
  }, [isOpen, label, calendarLabel, showTimeSelectOnly]);

  const emitChange = (date: Date | null) => {
    setSelectedDate(date);
    setMaskedText(formatDateTimeValue(date, effectiveFormat));
    onChange?.(date);
  };

  selectTodayRef.current = () => {
    const now = new Date();
    if (minDate && now < minDate) return;
    if (maxDate && now > maxDate) return;
    emitChange(now);
  };

  const handleChange = (date: Date | null) => {
    emitChange(date);
    // With showTimeSelect, react-datepicker closes via shouldCloseOnSelect after time pick.
    // Keep controlled open in sync when cleared.
    if (!date) {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    emitChange(null);
    setIsOpen(false);
    onClear?.();
    inputRef.current?.focus();
  };

  const handleMaskedChange = (masked: string, parsed: Date | null) => {
    setMaskedText(masked);

    if (!masked) {
      emitChange(null);
      return;
    }

    if (parsed) {
      if (minDate && parsed < minDate) return;
      if (maxDate && parsed > maxDate) return;
      setSelectedDate(parsed);
      onChange?.(parsed);
    }
  };

  const isHintText = () =>
    hintText !== undefined && hintText != null && String(hintText).trim() !== '';

  const hintId = `${id?.split(' ').join('-')}-hint-text`;

  const readOnlyDisplayValue = useMemo(() => {
    if (maskedText) return maskedText;
    return formatDateTimeValue(selectedDate, effectiveFormat) || 'Not Specified';
  }, [maskedText, selectedDate, effectiveFormat]);

  const readOnlyDisplayValuePrevious = useMemo(() => {
    if (prevDefaultData?.data) {
      return formatDateTimeValue(prevDefaultData.data, effectiveFormat);
    }
    return '';
  }, [prevDefaultData?.data, effectiveFormat]);

  const useHeaderDropdown = showMonthDropdown || showYearDropdown;

  const renderCalendarHeader = useCallback(
    (headerProps: ReactDatePickerCustomHeaderProps) => (
      <DateTimePickerCalendarHeader
        {...headerProps}
        showMonthDropdown={showMonthDropdown}
        showYearDropdown={showYearDropdown}
        minDate={minDate}
        maxDate={maxDate}
        useShortMonthInDropdown={useShortMonthInDropdown}
      />
    ),
    [showMonthDropdown, showYearDropdown, minDate, maxDate, useShortMonthInDropdown]
  );

  return (
    <div className={classNames('exxat-datetime-picker flex flex-col', wrapperClassName)}>
      {disabled && readOnlyDisplayValuePrevious ? (
        <div className="flex w-full flex-wrap items-center justify-between gap-1">
          {RenderLabel({ label, id, required, disabled, infoMsg: '' })}
          <RenderPreviousData
            label={prevDefaultData?.label}
            id={id}
            data={readOnlyDisplayValue}
            previousData={readOnlyDisplayValuePrevious}
            dataType="string"
          />
        </div>
      ) : (
        RenderLabel({ label, id, required, disabled, infoMsg: '' })
      )}

      {disabled && isDisableTextUI ? (
        <div className="form-disabled-value-text pl-0.5">{readOnlyDisplayValue}</div>
      ) : (
        <div className="relative mt-1" ref={containerRef}>
          <DatePicker
            id={id}
            selected={selectedDate}
            disabled={disabled}
            required={required}
            minDate={minDate ?? undefined}
            maxDate={maxDate ?? undefined}
            minTime={minTime}
            maxTime={maxTime}
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={showTimeSelectOnly}
            timeIntervals={timeIntervals}
            timeCaption={timeCaption}
            dateFormat={dateFnsFormatStr}
            timeFormat={timeFormatStr}
            showTimeInput={showTimeInput}
            shouldCloseOnSelect
            strictParsing={false}
            renderCustomHeader={useHeaderDropdown ? renderCalendarHeader : undefined}
            isClearable={false}
            toggleCalendarOnIconClick
            className={classNames(INPUT_CLASS, className)}
            popperClassName="exxat-datetime-picker__popper"
            customInput={
              <CustomInput
                id={id}
                testid={testid}
                label={label}
                format={effectiveFormat}
                controlledValue={maskedText}
                isClearable={isClearable}
                hasValue={!!selectedDate || !!maskedText}
                disabled={disabled}
                calendarLabel={calendarLabel}
                isOpen={isOpen}
                isTimeOnly={showTimeSelectOnly}
                LeadingIcon={LeadingIcon}
                placeholder={placeholder || placeholderText}
                onClear={handleClear}
                setIsOpen={setIsOpen}
                onMaskedChange={handleMaskedChange}
                onChangeRaw={onChangeRaw}
                onBlur={onBlur}
                inputRef={inputRef}
                calendarButtonRef={calendarButtonRef}
                aria-describedby={`${isHintText() ? hintId : ''} ${ariaDescribedBy ?? ''}`.trim()}
              />
            }
            {...props}
            onChange={handleChange}
            open={isOpen}
            onCalendarOpen={() => setIsOpen(true)}
            onCalendarClose={() => setIsOpen(false)}
            onClickOutside={() => setIsOpen(false)}
            onInputClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false);
            }}
            aria-expanded={isOpen}
          />

          {isHintText() && (
            <div className="py-1 text-xs text-[#5D779A]" id={hintId}>
              {hintText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimePickerComponent;
