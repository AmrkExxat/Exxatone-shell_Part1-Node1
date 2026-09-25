import React, { useState, useRef, useEffect } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsLeftRightToLine,
  faCircleMinus,
  faCircleXmark,
} from '@fortawesome/pro-light-svg-icons';
import TextInput from '../Input/TextInput/TextInput';

type RangeValues = { min: number | null; max: number | null };

const CustomRangeComponent = ({
  label = 'Range',
  defaultMin = null,
  defaultMax = null,
  onChange,
  clearBit = 0,
  dropIcon = faArrowsLeftRightToLine,
  clearList,
  extraFilter,
  id,
  hideFilter,
  addedFilter,
  isDarkTheme = false,
}: {
  label?: string;
  defaultMin?: number | null;
  defaultMax?: number | null;
  onChange?: (values: RangeValues, parentReset?: boolean) => void;
  dropdownClass?: string;
  useUnderlineStyle?: boolean;
  clearBit?: number; // Increment this prop to trigger a clear
  dropIcon?: any;
  clearList?: string[];
  id?: string;
  extraFilter?: boolean;
  addedFilter?: boolean;
  hideFilter?: () => void;
  isDarkTheme?: boolean;
}) => {
  const safeParseInt = (value: string): number | null => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  };
  const [values, setValues] = useState<RangeValues>({
    min:
      typeof defaultMin === 'number'
        ? defaultMin
        : typeof defaultMin === 'string'
          ? safeParseInt(defaultMin)
          : null,
    max:
      typeof defaultMax === 'number'
        ? defaultMax
        : typeof defaultMax === 'string'
          ? safeParseInt(defaultMax)
          : null,
  });

  const [error, setError] = useState<string>('');

  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (clearBit > 0) {
      handleClear();
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && clearList.includes(id)) {
      handleClear(null, true);
    }
  }, [clearList]);

  // Ref for debounce timeout
  const changeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (key: 'min' | 'max', value: string) => {
    // Only allow integer values
    const intValue = value === '' ? null : parseInt(value, 10);
    const updated = { ...values, [key]: intValue };
    setValues(updated);
    if (updated.min !== null && updated.max !== null && updated.min > updated.max) {
      setError('Min cannot be greater than Max');
      return;
    } else {
      setError('');
    }
    // Debounce onChange
    if (changeTimeout.current) {
      clearTimeout(changeTimeout.current);
    }
    changeTimeout.current = setTimeout(() => {
      onChange?.(updated);
    }, 400); // 300ms delay
  };

  const formattedLabel =
    values?.min || values?.max
      ? `${values?.min ? values.min : '–'} – ${values?.max ? values.max : '–'}`
      : label;

  // Clear either a specific field or both
  const handleClear = (key?: 'min' | 'max', parentReset?: boolean) => {
    if (key) {
      const cleared = { ...values, [key]: null };
      setValues(cleared);
      onChange?.(cleared, parentReset);
      if (key === 'min') minRef.current?.focus();
      if (key === 'max') maxRef.current?.focus();
    } else {
      const cleared = {};
      setValues(cleared);
      onChange?.(cleared, parentReset);
      minRef.current?.focus();
    }
  };
  const isValuesSet = values?.min || values?.max;

  return (
    <Popover
      className={`relative inline-block w-full ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}
    >
      {({ open, close }) => (
        <>
          <PopoverButton
            suppressHydrationWarning={true}
            className={`relative flex w-full items-center justify-between rounded border-[1px] px-2 py-1.5 text-sm ${open || isValuesSet ? 'selected-opened-filter border-primary' : 'border-gray-800'} `}
          >
            <div className="flex flex-1 items-center truncate">
              <FontAwesomeIcon icon={dropIcon} className="filter-icon mr-2" />
              {(values?.min || values?.max) && <span className="mr-2">|</span>}
              <span className="truncate">{formattedLabel}</span>
            </div>

            {(values?.min || values?.max) && (
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="text-primary ml-2 h-4 w-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear(); // Clear both
                }}
              />
            )}
            {addedFilter && !values.min && !values.max && (
              <button
                aria-label={`hide ${label} Filter`}
                id="select_remove_btn"
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                  hideFilter?.();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    close();
                    hideFilter?.();
                  }
                }}
              >
                <FontAwesomeIcon icon={faCircleMinus} className={`h-4 w-4`} />
              </button>
            )}
          </PopoverButton>

          <PopoverPanel
            unmount={false}
            className="bg-card absolute top-[40px] z-50 w-80 rounded-lg border p-2 shadow-md"
          >
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                ref={minRef}
                name="min"
                id="min"
                type="number"
                label="Min"
                value={values?.min ? values.min : '-'}
                onChange={(e) => handleChange('min', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && close()}
                testid="rangeComponent_min_textInput"
                showClearButton={values.min !== null}
                handleClear={() => handleClear('min')}
                className="w-fit"
              />
              <TextInput
                ref={maxRef}
                name="max"
                id="max"
                type="number"
                label="Max"
                value={values?.max ? values.max : '-'}
                onChange={(e) => handleChange('max', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && close()}
                testid="rangeComponent_max_textInput"
                showClearButton={values.max !== null}
                handleClear={() => handleClear('max')}
                className="w-fit"
              />
            </div>

            {error && (
              <p className="mt-1 text-xs text-red-500" role="alert">
                {error}
              </p>
            )}

            {/* Footer buttons */}
            <div className="mt-2 flex justify-between border-t p-2">
              <button
                className={`flex text-xs ${
                  values.min !== null || values.max !== null
                    ? 'link-text cursor-pointer'
                    : 'cursor-not-allowed text-gray-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (values.min !== null || values.max !== null) handleClear();
                }}
                disabled={!(values.min !== null || values.max !== null)}
                aria-disabled={!(values.min !== null || values.max !== null)}
              >
                Clear All
              </button>

              <button
                className="link-text text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  close(); // Close the popover
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    close();
                  }
                }}
                tabIndex={0}
                aria-label="Close dropdown"
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

export default CustomRangeComponent;
