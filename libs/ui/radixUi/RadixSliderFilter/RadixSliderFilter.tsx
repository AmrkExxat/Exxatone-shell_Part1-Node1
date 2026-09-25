import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Slider from '@radix-ui/react-slider';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCircleMinus } from '@fortawesome/pro-light-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ICON_SIZE_MD, TRIGGER_HEIGHT, FOCUS_STYLES } from '../radixDropdownStyles';
import RenderLabel from '../../components/common/Form/shared/RenderLabel';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export type SliderRange = {
  min: number;
  max: number;
};

export interface SliderFilterProps {
  label?: string;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: SliderRange;
  defaultValue?: SliderRange;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  unit?: string;
  unitPrefix?: boolean;
  width?: string;
  height?: string;
  dropIcon?: IconProp;
  triggerClassName?: string;
  contentClassName?: string;
  selectedBgColor?: string;
  selectedTextColor?: string;
  unSelectedBorderColor?: string;
  onHoverBgColor?: string;
  trackClassName?: string;
  trackStyle?: React.CSSProperties;
  radarClassName?: string;
  radarStyle?: React.CSSProperties;
  thumbClassName?: string;
  thumbStyle?: React.CSSProperties;
  /**
   * When true, the minimum thumb (left) cannot be moved by the user.
   */
  freezeMinThumb?: boolean;
  /**
   * When true, the maximum thumb (right) cannot be moved by the user.
   */
  freezeMaxThumb?: boolean;
  onChange?: (value: SliderRange, parentReset?: boolean) => void;
  addDebounce?: boolean;
  debounceDelay?: number;
  onClear?: () => void;
  infoMsg?: string;
  clearable?: boolean;
  addCloseButton?: boolean;
  showMinMaxValues?: boolean;
  hideLabel?: boolean;
  wrapperClassName?: string;
  clearBit?: number;
  extraFilter?: boolean;
  hideFilter?: () => void;
  hidden?: boolean;
  addedFilter?: boolean;
  labelText?: string;
}

export type RadixSliderProps = SliderFilterProps;
export type SliderDropdownProps = SliderFilterProps;
export type SliderFlagOption = never;

const RadixSliderFilter: React.FC<SliderFilterProps> = ({
  label,
  id,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  disabled = false,
  required = false,
  placeholder = 'Any',
  unit,
  unitPrefix = true,
  width,
  height = TRIGGER_HEIGHT,
  dropIcon,
  triggerClassName,
  contentClassName,
  selectedBgColor = '#39393C',
  selectedTextColor = '#ffffff',
  unSelectedBorderColor = '#EAEAEB',
  onHoverBgColor = '#E8EAF6',
  trackClassName,
  trackStyle,
  radarClassName,
  radarStyle,
  thumbClassName,
  thumbStyle,
  freezeMinThumb = false,
  freezeMaxThumb = false,
  onChange,
  addDebounce = true,
  debounceDelay = 500,
  onClear,
  infoMsg,
  clearable = false,
  addCloseButton = false,
  hideLabel = true,
  wrapperClassName,
  clearBit = 0,
  addedFilter,
  hideFilter,
  labelText = '$',
}) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<[number, number]>(() =>
    defaultValue ? [defaultValue.min, defaultValue.max] : [min, max]
  );
  // Tracks raw string input so backspace can clear digits without snapping back to 0
  const [draftMin, setDraftMin] = React.useState<string | null>(null);
  const [draftMax, setDraftMax] = React.useState<string | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevClearBit = React.useRef(clearBit);

  const isControlled = value !== undefined;
  const currentValueArray: [number, number] =
    isControlled && value ? [value.min, value.max] : internalValue;
  const hasValue = currentValueArray[0] !== min || currentValueArray[1] !== max;

  // Cleanup debounce on unmount
  React.useEffect(
    () => () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    },
    []
  );

  // Memoize handleClear so its identity is stable across renders
  const handleClear = React.useCallback(
    (e?: React.MouseEvent | null, parentReset?: boolean) => {
      e?.stopPropagation();
      const resetArray: [number, number] = [min, max];
      if (!isControlled) setInternalValue(resetArray);
      onChange?.({ min: undefined, max: undefined }, parentReset ?? false);
      onClear?.();
    },
    [min, max, isControlled, onChange, onClear]
  );

  // Guard effect so it only fires when clearBit actually increments,
  // preventing infinite loops if the consumer re-renders with the same clearBit > 0
  React.useEffect(() => {
    if (clearBit > 0 && clearBit !== prevClearBit.current) {
      prevClearBit.current = clearBit;
      handleClear(undefined, true);
    }
  }, [clearBit, handleClear]);

  const displayText = hasValue
    ? `${currentValueArray[0]}${unit ? ` ${unit}` : ''} – ${currentValueArray[1]}${unit ? ` ${unit}` : ''}`
    : label || placeholder;

  const handleValueChange = (newValue: number[]) => {
    const prev: [number, number] = [currentValueArray[0], currentValueArray[1]];
    let next: [number, number] = [newValue[0], newValue[1]];

    if (freezeMinThumb || freezeMaxThumb) {
      if (freezeMinThumb) next[0] = prev[0];
      if (freezeMaxThumb) next[1] = prev[1];

      if (next[0] > next[1]) {
        if (freezeMinThumb && !freezeMaxThumb) {
          next[1] = next[0];
        } else if (!freezeMinThumb && freezeMaxThumb) {
          next[0] = next[1];
        } else {
          next = prev;
        }
      }
    }

    // Skip if nothing changed (e.g. user tried to move a frozen thumb)
    if (next[0] === prev[0] && next[1] === prev[1]) return;

    if (!isControlled) setInternalValue(next);
    if (!onChange) return;

    const nextRange: SliderRange = { min: next[0], max: next[1] };

    if (addDebounce) {
      if (debounceRef.current !== null) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(nextRange), debounceDelay);
    } else {
      onChange(nextRange);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDraftMin(raw);
    if (raw === '' || raw === '-') return; // let user finish typing
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(min, Math.min(parsed, currentValueArray[1]));
    setDraftMin(String(clamped));
    handleValueChange([clamped, currentValueArray[1]]);
  };

  const handleMinInputBlur = () => {
    setDraftMin(null); // revert to controlled value on blur
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDraftMax(raw);
    if (raw === '' || raw === '-') return;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.min(max, Math.max(parsed, currentValueArray[0]));
    setDraftMax(String(clamped));
    handleValueChange([currentValueArray[0], clamped]);
  };

  const handleMaxInputBlur = () => {
    setDraftMax(null);
  };

  return (
    <div className={classNames('flex w-full flex-col gap-1', wrapperClassName)}>
      {label && !hideLabel && (
        <RenderLabel
          label={label}
          id={id}
          required={required}
          disabled={disabled}
          infoMsg={infoMsg}
        />
      )}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild disabled={disabled}>
          <button
            type="button"
            className={classNames(
              'inline-flex w-full items-center justify-between text-xs outline-none sm:w-auto',
              FOCUS_STYLES,
              'disabled:bg-disabled disabled:cursor-not-allowed disabled:opacity-50',
              'gap-2 rounded-full border px-3 py-1.5 text-sm font-medium',
              !hasValue && 'text-default bg-card hover:bg-[var(--dropdown-hover-bg)]',
              triggerClassName
            )}
            style={{
              height,
              width,
              minWidth: 200,
              ...(hasValue && { backgroundColor: selectedBgColor, color: selectedTextColor }),
              ...(hasValue && { borderColor: selectedTextColor }),
              ...(!hasValue && { borderColor: unSelectedBorderColor }),
              ...(!hasValue
                ? ({ ['--dropdown-hover-bg' as string]: onHoverBgColor } as React.CSSProperties)
                : {}),
            }}
            aria-label={label || placeholder}
            disabled={disabled}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-1">
                {dropIcon && <FontAwesomeIcon icon={dropIcon} className={ICON_SIZE_MD} />}
                <span className="truncate text-xs">{displayText}</span>
              </div>
              {hasValue ? (
                <button
                  type="button"
                  onClick={handleClear}
                  onPointerDownCapture={(e) => e.stopPropagation()}
                  className="flex-shrink-0 rounded p-1"
                >
                  <FontAwesomeIcon icon={faXmark} className={ICON_SIZE_MD} />
                </button>
              ) : (
                <></>
              )}
              {addedFilter && !hasValue && (
                <button
                  type="button"
                  aria-label={`hide ${label} Filter`}
                  id="select_remove_btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    hideFilter?.();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      hideFilter?.();
                    }
                  }}
                  className="flex-shrink-0 rounded p-1"
                >
                  <FontAwesomeIcon icon={faCircleMinus} className="h-4 w-4" />
                </button>
              )}
            </div>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={classNames(
              'bg-card flex w-full max-w-[calc(100vw-1.5rem)] flex-col gap-1 rounded-md p-1 shadow-xl sm:w-auto',
              'data-[side=bottom]:animate-slideUpAndFade will-change-[opacity,transform]',
              contentClassName
            )}
            sideOffset={4}
            align="start"
            style={{
              width,
              minWidth: 250,
              maxWidth: 'min(360px, 100vw - 16px)',
              zIndex: 9999,
            }}
          >
            {label && (
              <div className="flex items-center justify-between border-b border-[#EAEAEB] px-2 py-1 text-[12px] font-semibold text-black">
                <span>
                  {label} {labelText ? `(${labelText})` : ''}
                </span>
              </div>
            )}

            <div className="mt-2 flex flex-col gap-2 px-3 text-[11px] text-gray-600 sm:flex-row sm:items-center">
              <div className="flex flex-1 flex-col">
                <span className="text-[11px] tracking-wide text-gray-500">
                  Min {unit ? `(${unit})` : ''}
                </span>
                <input
                  type="number"
                  value={draftMin ?? currentValueArray[0]}
                  min={min}
                  max={currentValueArray[1]}
                  onChange={handleMinInputChange}
                  onBlur={handleMinInputBlur}
                  disabled={disabled || freezeMinThumb}
                  className={classNames(
                    'bg-card mt-1 h-7 w-full rounded-md border border-[#EAEAEB] px-2 text-xs text-gray-900 outline-none placeholder:text-gray-400',
                    FOCUS_STYLES
                  )}
                />
              </div>
              <div className="hidden px-1 text-center text-gray-400 sm:block">-</div>
              <div className="flex flex-1 flex-col items-start">
                <span className="text-[11px] tracking-wide text-gray-500">
                  Max {unit ? `(${unit})` : ''}
                </span>
                <input
                  type="number"
                  value={draftMax ?? currentValueArray[1]}
                  min={currentValueArray[0]}
                  max={max}
                  onChange={handleMaxInputChange}
                  onBlur={handleMaxInputBlur}
                  disabled={disabled || freezeMaxThumb}
                  className={classNames(
                    'bg-card mt-1 h-7 w-full rounded-md border border-[#EAEAEB] px-2 text-xs text-gray-900 outline-none placeholder:text-gray-400',
                    FOCUS_STYLES
                  )}
                />
              </div>
            </div>

            <div className="mt-3 px-3">
              <Slider.Root
                className="relative flex h-6 w-full touch-none items-center px-3 select-none"
                min={min}
                max={max}
                step={step}
                value={currentValueArray}
                onValueChange={handleValueChange}
                disabled={disabled}
              >
                <Slider.Track
                  className={classNames(
                    'relative h-1.5 w-full rounded-full border border-gray-700 bg-[#F0ECFD]',
                    trackClassName
                  )}
                  style={trackStyle}
                >
                  <Slider.Range
                    className={classNames(
                      'absolute h-full rounded-full bg-gray-900',
                      radarClassName
                    )}
                    style={radarStyle}
                  />
                </Slider.Track>
                <Slider.Thumb
                  className={classNames(
                    'bg-card block h-4 w-4 rounded-full border border-gray-400 shadow focus:ring-2 focus:ring-gray-400 focus:outline-none',
                    thumbClassName
                  )}
                  style={thumbStyle}
                />
                <Slider.Thumb
                  className={classNames(
                    'bg-card block h-4 w-4 rounded-full border border-gray-400 shadow focus:ring-2 focus:ring-gray-400 focus:outline-none',
                    thumbClassName
                  )}
                  style={thumbStyle}
                />
              </Slider.Root>
            </div>

            {(clearable || addCloseButton) && (
              <div className="flex justify-between border-t border-gray-200 px-1 pt-2 text-[10px]">
                {clearable && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className={classNames(
                      'text-black hover:underline',
                      !hasValue && 'cursor-not-allowed opacity-50 hover:no-underline'
                    )}
                    disabled={!hasValue}
                  >
                    Clear
                  </button>
                )}
                {addCloseButton && (
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-black hover:underline"
                  >
                    Close
                  </button>
                )}
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default RadixSliderFilter;
