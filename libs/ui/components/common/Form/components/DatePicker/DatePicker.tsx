import React, { useEffect, useState, forwardRef, useRef, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { format as dateFnsFormat } from 'date-fns';
import { datePickerProps } from './DatePicker.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css';
import { RenderLabel } from '../../shared';
import classNames from 'classnames';
import { faCalendarClock, faCalendarDay } from '@fortawesome/pro-light-svg-icons';
import RenderPreviousData from '../RenderPreviousData/RenderPreviousData';

const CustomInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    testid?: string;
    disabled?: boolean;
    onClear?: () => void;
    hasValue?: boolean;
    isClearable: boolean;
    calendarLabel: string;
    setIsOpen?: (isOpen: boolean) => void;
    calendarButtonRef?: React.RefObject<HTMLButtonElement>;
    inputRef?: React.RefObject<HTMLInputElement>;
    isOpen?: boolean;
    isDatePicker?: boolean;
    onChangeRaw?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    controlledValue?: string;
    LeadingIcon?: React.ReactNode;
  }
>(
  (
    {
      onClick,
      onFocus,
      onKeyDown,
      onChange,
      testid,
      disabled,
      isClearable,
      onClear,
      hasValue,
      calendarLabel,
      setIsOpen,
      calendarButtonRef,
      isOpen,
      inputRef,
      isDatePicker = true,
      onChangeRaw,
      controlledValue,
      value,
      LeadingIcon,
      ...props
    },
    ref
  ) => {
    // Local state to track input value while typing
    const [localValue, setLocalValue] = useState<string>('');
    const isTypingRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync with external value when it changes (from calendar selection or external updates)
    useEffect(() => {
      const externalValue =
        controlledValue !== undefined
          ? controlledValue
          : value !== undefined
            ? String(value)
            : undefined;
      if (externalValue !== undefined && !isTypingRef.current) {
        setLocalValue(externalValue || '');
      }
    }, [controlledValue, value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (onClick) {
        onClick(e);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      const filteredValue = newValue.replace(/[^0-9/]/g, '');

      if (filteredValue !== newValue) {
        e.target.value = filteredValue;
      }

      setLocalValue(filteredValue);
      isTypingRef.current = true;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Call the raw change handler if provided (for manual typing parsing)
      if (onChangeRaw) {
        onChangeRaw(e);
      }

      // Also call the default onChange for react-datepicker (may not be needed but keeps compatibility)
      if (onChange) {
        onChange(e);
      }

      // Reset typing flag after a delay to allow formatting
      // Use a longer delay to ensure the formatted value can update
      timeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        // Update local value with the formatted value if available
        const externalValue =
          controlledValue !== undefined
            ? controlledValue
            : value !== undefined
              ? String(value)
              : undefined;
        if (externalValue !== undefined) {
          setLocalValue(externalValue);
        }
      }, 300);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (setIsOpen) {
          setIsOpen(true);
        } else if (onClick) {
          onClick(e as any);
        }
      } else if (e.key === 'Escape') {
        if (setIsOpen) {
          setIsOpen(false);
        }
      } else {
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
        const isSlash = e.key === '/';

        if (
          !isNumeric &&
          !isSlash &&
          !allowedKeys.includes(e.key) &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          e.preventDefault();
        }
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    // Use local value while typing, otherwise use controlled/external value
    const externalValue =
      controlledValue !== undefined ? controlledValue : value !== undefined ? String(value) : '';
    const inputValue = isTypingRef.current ? localValue : externalValue;

    return (
      <div className="relative flex w-full items-center">
        {LeadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {LeadingIcon}
          </div>
        )}
        <input
          aria-label={`${props.label || calendarLabel} `}
          autoComplete="off"
          disabled={disabled}
          ref={inputRef || ref}
          {...props}
          value={inputValue || ''}
          className={`${LeadingIcon ? 'pl-9' : 'pl-3'} pr-20 ${props.className}`}
          data-testid={testid}
          onFocus={handleFocus}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />

        <div className="absolute top-0 right-0 flex h-full items-center pr-2">
          {hasValue && isClearable && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (onClear) {
                  onClear();
                }
              }}
              className="focus-visible:bg-default focus-indicator hover:text-default mr-1 flex h-4 w-4 items-center justify-center rounded-full border border-black text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-300"
              disabled={disabled}
              aria-label={`Clear ${props.label || calendarLabel || props.placeholder || 'selection'}`}
            >
              <FontAwesomeIcon icon={faTimes} className="h-3 w-3" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (setIsOpen) {
                setIsOpen(true);
              }
            }}
            disabled={disabled}
            className="focus-indicator hover:text-default ml-1 flex h-4 w-4 items-center justify-center text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
            aria-label={`${calendarLabel || 'calendar'}`}
            ref={calendarButtonRef}
            aria-expanded={isOpen}
          >
            <FontAwesomeIcon
              icon={isDatePicker ? faCalendarDay : faCalendarClock}
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

const DatePickerComponent: React.FC<datePickerProps> = ({
  label,
  registerReturn,
  selected,
  required = false,
  disabled = false,
  datefmt = 'MMM, dd yyyy',
  calendarType = 'Date Picker',
  id,
  testid = 'datePicker',
  calendarLabel,
  className = '',
  isClearable = false,
  onChange = () => {},
  onChangeRaw,
  onClear,
  hintText = '',
  onBlur = (e: any) => {},
  value,
  wrapperClassName,
  LeadingIcon,
  isDisableTextUI = false,
  prevDefaultData = { label: 'Edited by Site', data: null },
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(selected);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputClassName =
    'h-10 w-full rounded-md border-1 bg-card text-black placeholder:text-[#727279] shadow-sm focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:border-[#e5e7eb] dark:bg-gray-800 dark:text-black dark:ring-gray-600 dark:focus-visible:ring-primary-900 sm:text-sm sm:leading-6';
  const [isOpen, setIsOpen] = useState(false);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSelectedDate(selected);
  }, [selected]);

  useEffect(() => {
    if (value !== undefined && inputRef.current) {
      const currentValue = inputRef.current.value;
      const formattedDate = value || '';

      if (currentValue !== formattedDate && formattedDate.length > 0) {
        const timeoutId = setTimeout(() => {
          if (inputRef.current && inputRef.current.value !== formattedDate) {
            inputRef.current.value = formattedDate;
          }
        }, 50);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setTimeout(() => calendarButtonRef.current?.focus(), 0);
      }
    };

    const addClearButton = () => {
      const calendar = document.querySelector('.react-datepicker');
      if (calendar && !calendar.querySelector('.custom-footer')) {
        const footer = document.createElement('div');
        footer.className = 'custom-footer';
        footer.style.cssText =
          'display: flex; justify-content: flex-end; align-items: center; width: 100%; border-top: 0.5px solid #e5e7eb; background: white; margin: 0; box-sizing: border-box;';
        footer.innerHTML = `<button aria-label="Close ${label || calendarLabel || props.placeholderText || 'calendar'}" type="button" class="text-primary text-xs px-2 rounded hover:bg-primary-50 focus-indicator" style="margin: 0;">Close</button>`;

        const monthContainer = calendar.querySelector('.react-datepicker__month-container');
        const timeContainer = calendar.querySelector('.react-datepicker__time-container');
        if (monthContainer) {
          monthContainer.appendChild(footer);
        } else if (timeContainer) {
          timeContainer.appendChild(footer);
        } else {
          calendar.appendChild(footer);
        }

        footer.querySelector('button')?.addEventListener('click', handleFooterClose);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(addClearButton, 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && calendarType === 'Time Picker') {
      setTimeout(() => {
        const container = document.querySelector('.react-datepicker__time');
        const timeList = document?.querySelectorAll('.react-datepicker__time-list-item');
        const selectedTime = document?.querySelector('.react-datepicker__time-list-item--selected');
        if (container) {
          container.classList.add(
            'focus-visible:outline',
            'focus-visible:outline-2',
            'focus-visible:outline-primary'
          );
          selectedTime?.classList.add(
            'focus-visible:outline',
            'focus-visible:outline-2',
            'focus-visible:outline-white'
          );
          container.setAttribute('tabindex', '-1');
          (container as HTMLElement).focus();
        }
        if (timeList) {
          timeList.forEach((item) => {
            item.classList.add(
              'focus-visible:outline',
              'focus-visible:outline-2',
              'focus-visible:outline-primary',
              'focus-visible:outline-offset-[-5px]'
            );
          });
        }
      }, 100);
    }
  }, [isOpen, calendarType]);

  const handleFooterClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (calendarButtonRef && calendarButtonRef.current) {
        calendarButtonRef.current.focus();
      }
    }, 100);
  };
  const isHintText = () => {
    return hintText !== undefined && hintText != null && hintText.trim() != '';
  };

  let calendarTypeProps: any = {};
  switch (calendarType) {
    case 'Month Picker':
      calendarTypeProps = {
        showMonthYearPicker: true,
        datefmt: 'MMM',
        dateFormat: 'MMMM',
      };
      break;

    case 'Month Year Picker':
      calendarTypeProps = {
        showMonthYearPicker: true,
        // Display as MMM/yyyy, but also accept typed MM/yyyy.
        dateFormat: ['MMM/yyyy', 'MM/yyyy'],
      };
      break;

    case 'Year Picker':
      calendarTypeProps = {
        showYearPicker: true,
        dateFormat: 'yyyy',
      };
      break;

    case 'Time Picker':
      calendarTypeProps = {
        showTimeSelect: true,
        showTimeSelectOnly: true,
        timeIntervals: 15,
        timeCaption: 'Time',
        dateFormat: 'h:mm aa',
      };
      break;

    default:
      calendarTypeProps = {
        dateFormat: datefmt,
      };
      break;
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setIsOpen(false);
    onChange?.(date);
    if (date !== null) {
      inputRef.current?.focus();
    }
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    onChange?.(null);
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  const handleDateSelect = (date: Date) => {
    // Kept to perform additional actions when a date is selected
  };

  const isTimePicker = () => {
    return props?.showTimeSelectOnly || props?.showTimeSelect || calendarType === 'Time Picker';
  };

  const effectiveDateFormat = (() => {
    const fmt = props.dateFormat || calendarTypeProps.dateFormat || datefmt;
    return Array.isArray(fmt) ? fmt[0] : fmt;
  })();

  const readOnlyDisplayValue = (() => {
    if (value) return value;
    if (selectedDate) {
      try {
        return dateFnsFormat(selectedDate, effectiveDateFormat);
      } catch {
        return selectedDate.toLocaleDateString();
      }
    }
    return 'Not Specified';
  })();

  const readOnlyDisplayValuePrevious = useMemo(() => {
    if (prevDefaultData?.data) {
      try {
        return dateFnsFormat(prevDefaultData?.data, effectiveDateFormat);
      } catch {
        try {
          return prevDefaultData?.data.toLocaleDateString();
        } catch {
          return '';
        }
      }
    }
    return '';
  }, [prevDefaultData?.data]);

  return (
    <div className={classNames('flex flex-col', wrapperClassName)}>
      {disabled && readOnlyDisplayValuePrevious ? (
        <div className="flex w-full flex-wrap items-center justify-between gap-1">
          {RenderLabel({ label, id, required, disabled, infoMsg: '' })}
          <RenderPreviousData
            label={prevDefaultData?.label}
            id={id}
            data={readOnlyDisplayValue}
            previousData={readOnlyDisplayValuePrevious}
            dataType={'string'}
          />
        </div>
      ) : (
        RenderLabel({ label, id, required, disabled, infoMsg: '' })
      )}
      {disabled && isDisableTextUI ? (
        <div className="form-disabled-value-text pl-0.5">{readOnlyDisplayValue}</div>
      ) : (
        <div className="relative mt-1" ref={datePickerRef}>
          <DatePicker
            customInputRef={inputRef}
            toggleCalendarOnIconClick
            isClearable={false} // Disabling this as we've included custom button for purpose of A11Y
            showIcon={props?.showIcon !== undefined ? props.showIcon : true}
            icon={
              props?.icon || (
                <FontAwesomeIcon icon={faCalendarAlt} aria-hidden="true" className="py-3" />
              )
            }
            onBlur={(e: any) => {
              onBlur && onBlur(e);
            }}
            // Don't pass onChangeRaw to react-datepicker directly to avoid conflicts
            // It's handled in CustomInput instead
            dateFormat={props.dateFormat || calendarTypeProps.dateFormat || datefmt}
            className={classNames(inputClassName, className)}
            disabled={disabled}
            customInput={
              <CustomInput
                testid={testid}
                disabled={disabled}
                isClearable={isClearable}
                onClear={handleClearDate}
                hasValue={!!selectedDate}
                setIsOpen={setIsOpen}
                label={label}
                calendarLabel={calendarLabel || ''}
                calendarButtonRef={calendarButtonRef}
                isOpen={isOpen}
                inputRef={inputRef}
                isDatePicker={isTimePicker() ? false : true}
                onChangeRaw={onChangeRaw}
                controlledValue={value}
                LeadingIcon={LeadingIcon}
              />
            }
            {...calendarTypeProps}
            {...props}
            onSelect={handleDateSelect}
            onChange={handleDateChange}
            selected={selectedDate}
            value={value}
            id={id}
            open={isOpen}
            onClickOutside={() => setIsOpen(false)}
            onInputClick={() => setIsOpen(true)}
            strictParsing={false}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            ariaDescribedBy={`${isHintText() ? `${id?.split(' ').join('-')}-hint-text` : ''} ${props?.ariaDescribedBy ?? ''}`}
            aria-expanded={isOpen}
          />
          {isHintText() && (
            <div
              className="py-1 text-xs text-[#5D779A]"
              id={`${id?.split(' ').join('-')}-hint-text`}
            >
              {hintText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
