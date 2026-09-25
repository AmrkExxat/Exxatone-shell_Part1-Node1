import React, { useState, useMemo, useRef, useEffect, useCallback, useId } from 'react';
import { DropdownMenu, Checkbox } from 'radix-ui';
import classNames from 'classnames';
import { announce } from '@react-aria/live-announcer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleMinus,
  faCircleXmark,
  faMagnifyingGlass,
} from '@fortawesome/pro-light-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { isEmpty } from 'lodash';
import {
  BORDER_COLOR,
  ICON_SIZE_SM,
  ICON_SIZE_MD,
  ICON_SIZE_CHECKBOX,
  CHIP_STYLES,
  CHIP_REMOVE_BTN,
  SECTION_SEARCH,
  SECTION_FOOTER,
  DEFAULT_WIDTH,
  TRIGGER_HEIGHT,
  CHIPS_CONTAINER_HEIGHT,
  OPTION_ICON_WRAPPER,
  FOCUS_STYLES,
} from '../radixDropdownStyles';
import RenderLabel from '../../components/common/Form/shared/RenderLabel';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
  id: string;
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: DropdownOption[];
}

export interface RadixDropDownProps {
  /** Array of options to display */
  options: DropdownOption[];
  /** Enable multi-select mode */
  multiple?: boolean;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Label for the dropdown */
  label?: string;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Whether the dropdown is required */
  required?: boolean;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Maximum height of the dropdown content */
  maxHeight?: number;
  /** Custom class name for the trigger */
  triggerClassName?: string;
  /** Custom class name for the content */
  contentClassName?: string;
  /** Custom class name for options */
  optionClassName?: string;
  /** Show clear button */
  clearable?: boolean;
  /** Show Close button in dropdown footer */
  addCloseButton?: boolean;
  /** Close on select (for multi-select) */
  closeOnSelect?: boolean;
  /** Placeholder for the search input when searchable (default: "Search") */
  searchPlaceholder?: string;
  /** ID for the dropdown */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
  /** Leading icon for the trigger (displayed before text) */
  dropIcon?: any;
  /** Variant style: 'pill' (default) or 'custom' for full-width input style */
  variant?: 'pill' | 'custom';
  /** Hide the label (useful for pill variant) */
  hideLabel?: boolean;
  /** Width of the dropdown trigger and content (e.g., '200px', '300px') */
  width?: string;
  /** Background color for pill variant when selected */
  selectedBgColor?: string;
  /** Text/icon color for pill variant when selected */
  selectedTextColor?: string;
  /**
   * Uncontrolled default value — only applied once on mount.
   * Do NOT update this prop after mount; use `value` for controlled usage.
   */
  defaultValue?: DropdownOption | DropdownOption[];
  /**
   * Controlled value. When provided the component becomes fully controlled:
   * you must update this prop in your onChange handler.
   */
  value?: DropdownOption | DropdownOption[] | null;
  /** Callback when selection changes - receives complete option(s) */
  onChange?: (option: DropdownOption | DropdownOption[] | null) => void;
  /** Callback when dropdown opens/closes */
  onOpenChange?: (open: boolean) => void;
  /** Height of the dropdown trigger */
  height?: string;
  /** Info message for the dropdown */
  infoMsg?: string;
  wrapperClassName?: string;
  unSelectedBorderColor?: string;
  showSelectedItems?: boolean;
  /**
   * Increment this number to imperatively clear the selection from outside.
   * Only use when NOT using the `value` controlled prop.
   */
  clearBit?: number;
  addedFilter?: boolean;
  hideFilter?: () => void;
  extraFilter?: boolean;
  onHoverBgColor?: string;
  'aria-labelledby'?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Stable empty array so referential equality holds when there's no selection */
const EMPTY_MULTI: DropdownOption[] = [];

function resolveInitialSingle(
  value: RadixDropDownProps['value'],
  defaultValue: RadixDropDownProps['defaultValue']
): DropdownOption | undefined {
  const v = value !== undefined ? value : defaultValue;
  if (!v || Array.isArray(v)) return undefined;
  return v;
}

function resolveInitialMulti(
  value: RadixDropDownProps['value'],
  defaultValue: RadixDropDownProps['defaultValue']
): DropdownOption[] {
  const v = value !== undefined ? value : defaultValue;
  if (!v) return EMPTY_MULTI;
  return Array.isArray(v) ? v : EMPTY_MULTI;
}

function collectLeafOptionValues(opts: DropdownOption[]): string[] {
  return opts.flatMap((o) =>
    o.children?.length ? collectLeafOptionValues(o.children) : [o.value]
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const RadixDropDown: React.FC<RadixDropDownProps> = ({
  options,
  multiple = false,
  placeholder = 'Select...',
  label,
  disabled = false,
  required = false,
  searchable = false,
  maxHeight = 300,
  triggerClassName,
  contentClassName,
  optionClassName,
  clearable = true,
  addCloseButton = false,
  closeOnSelect = false,
  searchPlaceholder = 'Search options...',
  id,
  dropIcon,
  variant = 'pill',
  hideLabel = true,
  width,
  selectedBgColor = '#39393C',
  selectedTextColor = '#ffffff',
  defaultValue,
  value,
  onChange,
  onOpenChange,
  height = TRIGGER_HEIGHT,
  infoMsg,
  wrapperClassName,
  unSelectedBorderColor = '#EAEAEB',
  showSelectedItems = false,
  clearBit = 0,
  addedFilter,
  hideFilter,
  onHoverBgColor = '#E8EAF6',
  'aria-labelledby': ariaLabelledBy,
}) => {
  // ─── Controlled vs Uncontrolled ─────────────────────────────────────────────
  //
  // When `value` prop is provided the component is CONTROLLED — internal state
  // is kept in sync via the effect below and onChange is the single source of
  // truth for the consumer.
  //
  // When only `defaultValue` is provided the component is UNCONTROLLED —
  // internal state is initialised once on mount and never re-synced from props.
  // The consumer drives changes purely through the returned callback.

  const isControlled = value !== undefined;

  // ─── SSR / hydration safety ─────────────────────────────────────────────────
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ─── Core state ─────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemsExpanded, setSelectedItemsExpanded] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState<number | null>(null);

  // Initialised synchronously on both server and client — no hydration mismatch.
  const [singleValue, setSingleValue] = useState<DropdownOption | undefined>(() =>
    resolveInitialSingle(value, defaultValue)
  );
  const [multiValue, setMultiValue] = useState<DropdownOption[]>(() =>
    resolveInitialMulti(value, defaultValue)
  );

  // ─── Sync controlled value into internal state ───────────────────────────────
  //
  // This is the ONLY place external `value` is written into state.
  // We compare by serialised key to avoid infinite loops when the consumer
  // passes a new array reference that contains the same logical values.
  const prevControlledKey = useRef<string | null>(null);

  useEffect(() => {
    if (!isControlled) return;

    const nextKey = Array.isArray(value)
      ? value.map((o) => o.value).join(',')
      : (value?.value ?? '');

    if (nextKey === prevControlledKey.current) return; // nothing changed
    prevControlledKey.current = nextKey;

    if (multiple) {
      setMultiValue(Array.isArray(value) ? value : EMPTY_MULTI);
    } else {
      setSingleValue(!value || Array.isArray(value) ? undefined : value);
    }
  }, [isControlled, value, multiple]);

  // ─── clearBit (uncontrolled clear) ──────────────────────────────────────────
  //
  // We track the previous clearBit value so we only fire on an *increment*,
  // not on every render where clearBit happens to be non-zero.
  const prevClearBit = useRef(clearBit);

  const handleClear = useCallback(
    (e?: React.MouseEvent | null) => {
      e?.stopPropagation();
      e?.preventDefault();
      if (multiple) {
        if (!isControlled) setMultiValue(EMPTY_MULTI);
        onChange?.([]);
      } else {
        if (!isControlled) setSingleValue(undefined);
        onChange?.(null);
      }
      setTimeout(() => triggerRef.current?.focus(), 0);
    },
    [multiple, isControlled, onChange]
  );

  useEffect(() => {
    if (clearBit > prevClearBit.current) {
      handleClear();
    }
    prevClearBit.current = clearBit;
  }, [clearBit, handleClear]);

  // ─── Refs ───────────────────────────────────────────────────────────────────
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const clearSelectionRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Record<string, HTMLElement | null>>({});
  const lastFocusedOptionValueRef = useRef<string | null>(null);

  // ─── IDs ────────────────────────────────────────────────────────────────────
  const autoId = useId();
  const resolvedId = id ?? autoId;
  const sectionId = useCallback((suffix: string) => `${resolvedId}-${suffix}`, [resolvedId]);

  const triggerId = useMemo(() => sectionId('trigger'), [sectionId]);
  const rootId = useMemo(() => sectionId('root'), [sectionId]);
  const contentId = useMemo(() => sectionId('content'), [sectionId]);
  const labelId = useMemo(() => sectionId('label'), [sectionId]);
  const titleId = useMemo(() => sectionId('title'), [sectionId]);
  const selectedItemsId = useMemo(() => sectionId('selected-items'), [sectionId]);
  const selectedItemsHeaderId = useMemo(() => sectionId('selected-items-header'), [sectionId]);
  const selectedChipsId = useMemo(() => sectionId('selected-chips'), [sectionId]);
  const searchSectionId = useMemo(() => sectionId('search'), [sectionId]);
  const searchInputId = useMemo(() => sectionId('search-input'), [sectionId]);
  const optionsListId = useMemo(() => sectionId('options-list'), [sectionId]);
  const clearSelectionId = useMemo(() => sectionId('clear-selection'), [sectionId]);
  const closeButtonId = useMemo(() => sectionId('close-button'), [sectionId]);
  const footerId = useMemo(() => sectionId('footer'), [sectionId]);

  // ─── Derived values ─────────────────────────────────────────────────────────
  const isCustom = variant === 'custom';
  const dropdownWidth = width || DEFAULT_WIDTH;
  const widthStyle = useMemo(() => ({ width: dropdownWidth }), [dropdownWidth]);
  const heightStyle = useMemo(() => ({ height }), [height]);
  const chevronIcon = isMounted && isOpen ? faChevronUp : faChevronDown;
  const hasValue = multiple ? multiValue.length > 0 : !!singleValue?.value;

  const selectedOption = useMemo(
    () => (multiple || !singleValue ? undefined : singleValue),
    [singleValue, multiple]
  );
  const selectedOptions = useMemo(
    () => (multiple && Array.isArray(multiValue) ? multiValue : EMPTY_MULTI),
    [multiValue, multiple]
  );

  // FIX: Plain `multiValue` reference — no JSON.stringify.
  // `multiValue` is only replaced (new reference) when selections actually change,
  // so this memo recalculates exactly when needed and never otherwise.
  const selectedValueSet = useMemo(() => new Set(multiValue.map((o) => o.value)), [multiValue]);

  // ─── Anchor width ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (triggerRef.current) {
      const base = triggerRef.current.offsetWidth;
      variant === 'pill' ? setAnchorWidth(base ? base * 1.4 : base) : setAnchorWidth(base);
    }
  }, [width, isOpen]);

  // ─── Collapse selected-items panel when deselected ──────────────────────────
  useEffect(() => {
    if (!multiple || selectedOptions.length === 0) {
      setSelectedItemsExpanded(false);
    }
  }, [multiple, selectedOptions.length]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
      announce(`${open ? 'expanded' : 'collapsed'}`, 'polite');
      if (!open) setSearchQuery('');
    },
    [onOpenChange, label, placeholder]
  );

  const handleSingleSelect = useCallback(
    (option: DropdownOption) => {
      if (!isControlled) setSingleValue(option);
      onChange?.(option);
      setIsOpen(false);
      setSearchQuery('');
    },
    [isControlled, onChange]
  );

  // FIX: The previous implementation read `_newValue` from outside the
  // `setMultiValue` updater, so it was always `[]` (stale closure).
  // Now we compute the next value inside the updater and pass it to onChange
  // via a Promise microtask so it fires *after* React has committed the state
  // update — eliminating both the stale value and any synchronous re-render
  // triggered by the consumer's onChange handler calling setState.
  const handleMultiToggle = useCallback(
    (option: DropdownOption | null | undefined) => {
      if (!option) return;

      setMultiValue((prev) => {
        const safe = Array.isArray(prev) ? prev : EMPTY_MULTI;
        const isSelected = safe.some((o) => o.value === option.value);
        const next = isSelected ? safe.filter((o) => o.value !== option.value) : [...safe, option];

        // Schedule onChange in a microtask so it runs after React has applied
        // this state update. This prevents the consumer's setState-in-onChange
        // from synchronously triggering another render of this component before
        // the current one has finished, which was the primary cause of the loop.
        if (!isControlled) {
          Promise.resolve().then(() => onChange?.(next));
        } else {
          // In controlled mode we must notify the consumer synchronously so
          // they can update their `value` prop; React batches the resulting
          // setState call automatically in React 18+.
          onChange?.(next);
        }

        // In controlled mode don't mutate internal state — the effect above
        // will sync it once the consumer updates `value`.
        return isControlled ? prev : next;
      });

      if (closeOnSelect) setIsOpen(false);
    },
    [isControlled, onChange, closeOnSelect]
  );

  /** Prevents the trigger from opening when clicking the clear button inside it */
  const stopTriggerOpen = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  const handleRemoveChip = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent, option: DropdownOption | null | undefined) => {
      e.stopPropagation();
      e.preventDefault();
      if (!option) return;

      setMultiValue((prev) => {
        const safe = Array.isArray(prev) ? prev : EMPTY_MULTI;
        const next = safe.filter((o) => o.value !== option.value);
        Promise.resolve().then(() => onChange?.(next));
        return isControlled ? prev : next;
      });
    },
    [isControlled, onChange]
  );

  const handleToggleSelectedItems = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItemsExpanded((v) => !v);
  }, []);

  const handleCloseDropdown = useCallback(() => setIsOpen(false), []);

  const handleClearSelection = useCallback(() => {
    if (hasValue) handleClear();
  }, [handleClear, hasValue]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClear();
      }
    },
    [handleClear]
  );

  const handleClearSelectionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey && addCloseButton && closeButtonRef.current) {
        e.preventDefault();
        setTimeout(() => closeButtonRef.current?.focus(), 0);
      }
    },
    [addCloseButton]
  );

  const handleHideFilter = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      hideFilter?.();
    },
    [hideFilter]
  );

  const handleHideFilterKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        hideFilter?.();
      }
    },
    [hideFilter]
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const container = document.getElementById(optionsListId);
        if (container) {
          const first = container.querySelector<HTMLElement>('[role="option"]');
          first?.focus();
        }
      }
    },
    [optionsListId]
  );

  const handleContentKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        const active = document.activeElement as HTMLElement | null;
        const optionsContainer = optionsListId ? document.getElementById(optionsListId) : null;
        const isOnOption = active?.getAttribute('role') === 'option';
        if (optionsContainer?.contains(active) && isOnOption) {
          e.preventDefault();
          e.stopPropagation();
          if (clearable && multiple && hasValue && clearSelectionRef.current) {
            setTimeout(() => clearSelectionRef.current?.focus(), 0);
          } else if (addCloseButton && closeButtonId) {
            setTimeout(() => document.getElementById(closeButtonId)?.focus(), 0);
          }
        }
      }
    },
    [clearable, multiple, hasValue, addCloseButton, optionsListId, closeButtonId]
  );

  // ─── Filtered options ────────────────────────────────────────────────────────
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return options;

    const filterRecursive = (opts: DropdownOption[]): DropdownOption[] =>
      opts.reduce<DropdownOption[]>((acc, opt) => {
        const matchesSearch = opt.label.toLowerCase().includes(searchQuery.toLowerCase());
        const filteredChildren = opt.children ? filterRecursive(opt.children) : [];
        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...opt,
            children: filteredChildren.length > 0 ? filteredChildren : opt.children,
          });
        }
        return acc;
      }, []);

    return filterRecursive(options);
  }, [options, searchQuery, searchable]);

  const handleContentOpenAutoFocus = useCallback(
    (e: Event) => {
      e.preventDefault();
      if (searchable) {
        queueMicrotask(() => searchInputRef.current?.focus());
        return;
      }
      const leaves = collectLeafOptionValues(filteredOptions);
      const leafSet = new Set(leaves);
      const selectedTarget = multiple
        ? selectedOptions.find((option) => !option.disabled)
        : selectedOption && !selectedOption.disabled
          ? selectedOption
          : null;
      let value = lastFocusedOptionValueRef.current;
      if (value && !leafSet.has(value)) value = null;
      if (!value && selectedTarget) value = selectedTarget.value;
      if (!value && leaves.length > 0) value = leaves[0];
      if (!value) return;
      const toFocus = value;
      queueMicrotask(() => optionRefs.current[toFocus]?.focus());
    },
    [searchable, filteredOptions, multiple, selectedOptions, selectedOption]
  );

  // ─── Display text ────────────────────────────────────────────────────────────
  const displayText = useMemo(() => {
    if (multiple) {
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return label || placeholder;
    }
    if (selectedOption && !isEmpty(selectedOption)) return selectedOption.label;
    return label || placeholder;
  }, [multiple, selectedOptions, selectedOption, label, placeholder]);

  const clearAriaLabel = useMemo(() => {
    const fieldLabel = label || 'selection';
    if (multiple) {
      if (selectedOptions.length === 1) {
        return `Clear ${selectedOptions[0].label}`;
      }
      return `Clear ${selectedOptions.length} selection`;
    }
    if (selectedOption?.label) {
      return `Clear ${selectedOption.label}`;
    }
    return `Clear ${fieldLabel} selection`;
  }, [multiple, selectedOptions, selectedOption, label]);

  // ─── renderOption ────────────────────────────────────────────────────────────
  const renderOption = useCallback(
    (option: DropdownOption, depth: number = 0) => {
      const childrenArray = Array.isArray(option.children) ? option.children : [];
      const hasChildren = childrenArray.length > 0;

      if (hasChildren) {
        return (
          <DropdownMenu.Group key={option.value}>
            <DropdownMenu.Label
              className={classNames(
                'text-secondary px-3 py-2 text-xs font-semibold tracking-wide uppercase',
                { 'pl-6': depth > 0 }
              )}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.label ?? ''}
            </DropdownMenu.Label>
            {childrenArray.map((child) => renderOption(child, depth + 1))}
          </DropdownMenu.Group>
        );
      }

      const optionBaseClass = classNames(
        'focus-indicator text-default relative flex cursor-pointer select-none rounded-none px-2 py-1.5 outline-none',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        optionClassName,
        variant === 'pill'
          ? 'hover:bg-[var(--dropdown-hover-bg)] data-[highlighted]:bg-[var(--dropdown-hover-bg)]'
          : 'hover:bg-gray-100 data-[highlighted]:bg-gray-100',
        { 'pl-6': depth > 0 }
      );

      if (multiple) {
        const isSelected = selectedValueSet.has(option.value);
        return (
          <DropdownMenu.CheckboxItem
            key={option.value}
            checked={isSelected}
            disabled={option.disabled}
            tabIndex={option.disabled ? -1 : 0}
            role="option"
            aria-selected={isSelected}
            ref={(el) => {
              optionRefs.current[option.value] = el;
            }}
            onFocus={() => {
              lastFocusedOptionValueRef.current = option.value;
            }}
            onCheckedChange={() => handleMultiToggle(option)}
            onSelect={(e) => e.preventDefault()}
            className={classNames(optionBaseClass, 'items-center gap-2')}
          >
            <Checkbox.Root
              checked={isSelected}
              disabled={option.disabled}
              className={classNames(
                `flex flex-shrink-0 ${ICON_SIZE_CHECKBOX} items-center justify-center rounded border ${BORDER_COLOR}`,
                'data-[state=checked]:border-gray-900 data-[state=checked]:bg-gray-900'
              )}
              tabIndex={option.disabled ? -1 : 0}
            >
              <Checkbox.Indicator>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`${ICON_SIZE_SM} text-white`}
                  aria-hidden="true"
                />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="truncate-content flex items-center gap-2 text-xs">
              {option.icon && <span className={OPTION_ICON_WRAPPER}>{option.icon}</span>}
              {option.label ?? ''}
            </span>
          </DropdownMenu.CheckboxItem>
        );
      }

      const isSelected = singleValue?.value === option.value;
      return (
        <DropdownMenu.Item
          key={option.value}
          disabled={option.disabled}
          onSelect={() => handleSingleSelect(option)}
          role="option"
          aria-selected={isSelected}
          ref={(el) => {
            optionRefs.current[option.value] = el;
          }}
          onFocus={() => {
            lastFocusedOptionValueRef.current = option.value;
          }}
          className={classNames(optionBaseClass, 'items-center pr-9', isSelected && 'bg-gray-100')}
        >
          <span className="flex items-center gap-2 text-xs">
            {option.icon && <span className={OPTION_ICON_WRAPPER}>{option.icon}</span>}
            {option.label ?? ''}
          </span>
          {isSelected && (
            <span className="absolute right-3">
              <FontAwesomeIcon
                icon={faCheck}
                className={`${ICON_SIZE_SM} text-gray-900`}
                aria-hidden="true"
              />
            </span>
          )}
        </DropdownMenu.Item>
      );
    },
    [
      multiple,
      selectedValueSet,
      singleValue,
      variant,
      optionClassName,
      handleMultiToggle,
      handleSingleSelect,
    ]
  );

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const triggerStyle = useMemo(() => {
    const base = {
      ...(height ? heightStyle : {}),
      ...(isCustom && width ? { width } : {}),
      ...(!isCustom ? widthStyle : {}),
    };
    if (!isMounted) return base;
    return {
      ...base,
      ...(!isCustom && hasValue
        ? { backgroundColor: selectedBgColor, color: selectedTextColor }
        : {}),
      ...(hasValue && !isCustom ? { borderColor: selectedTextColor } : {}),
      ...(!hasValue && !isCustom ? { borderColor: unSelectedBorderColor } : {}),
      ...(variant === 'pill' && !hasValue
        ? ({ ['--dropdown-hover-bg' as string]: onHoverBgColor } as React.CSSProperties)
        : {}),
    };
  }, [
    isMounted,
    height,
    heightStyle,
    isCustom,
    width,
    widthStyle,
    hasValue,
    selectedBgColor,
    selectedTextColor,
    unSelectedBorderColor,
    variant,
    onHoverBgColor,
  ]);

  const contentStyle = useMemo(
    () => ({
      width:
        anchorWidth !== null
          ? anchorWidth
          : isCustom
            ? width || 'var(--radix-dropdown-menu-trigger-width)'
            : dropdownWidth,
      maxHeight: 'var(--radix-dropdown-menu-content-available-height)',
      zIndex: 9999,
      ...(variant === 'pill'
        ? ({ ['--dropdown-hover-bg' as string]: onHoverBgColor } as React.CSSProperties)
        : {}),
    }),
    [anchorWidth, isCustom, width, dropdownWidth, variant, onHoverBgColor]
  );

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div id={rootId} className={classNames('flex flex-col gap-1', wrapperClassName)}>
      {label && !hideLabel && (
        <div id={labelId}>
          <RenderLabel
            label={label}
            id={id}
            required={required}
            disabled={disabled}
            infoMsg={infoMsg}
          />
        </div>
      )}

      <DropdownMenu.Root open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenu.Trigger asChild disabled={disabled}>
          <div
            role="combobox"
            ref={triggerRef}
            id={triggerId}
            className={classNames(
              'inline-flex items-center justify-between text-xs outline-none',
              FOCUS_STYLES,
              'disabled:bg-disabled disabled:cursor-not-allowed disabled:opacity-50',
              isCustom
                ? `justify-between rounded-md border ${BORDER_COLOR} text-default bg-input px-3 py-2`
                : classNames(
                    'gap-2 rounded-full border px-3 py-1.5 text-sm font-medium',
                    !hasValue && variant === 'pill' && 'hover:bg-[var(--dropdown-hover-bg)]'
                  ),
              triggerClassName
            )}
            style={triggerStyle}
            aria-label={!label ? placeholder : undefined}
            aria-labelledby={ariaLabelledBy}
            aria-required={required || undefined}
            //aria-haspopup="listbox"
            aria-expanded={isMounted && isOpen}
            aria-controls={contentId}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full min-w-0 items-center gap-2 text-xs">
                {dropIcon && (
                  <span className={classNames(hasValue ? 'text-selectedTextColor' : 'text-black')}>
                    <FontAwesomeIcon
                      icon={dropIcon as IconProp}
                      className={ICON_SIZE_MD}
                      aria-hidden="true"
                    />
                  </span>
                )}
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="flex min-w-0 items-center overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="block min-w-0 truncate">{displayText}</span>
                  </span>
                  {multiple && selectedOptions.length > 1 && (
                    <span
                      className={classNames(
                        selectedOptions.length > 9 ? 'px-2' : 'px-3',
                        selectedOptions.length > 99 ? 'px-2' : 'px-3',
                        'shrink-0 rounded-full px-3 py-0.5 text-[10px]',
                        !isCustom ? 'bg-card text-black' : 'bg-gray-100 text-gray-500'
                      )}
                      title={`${selectedOptions.length} selected`}
                    >
                      {selectedOptions.length}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {hasValue ? (
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={clearAriaLabel}
                    aria-disabled={!hasValue}
                    tabIndex={disabled ? -1 : 0}
                    onClick={handleClear}
                    onPointerDownCapture={stopTriggerOpen}
                    className={classNames('flex-shrink-0 rounded', FOCUS_STYLES)}
                    style={{ color: 'inherit' }}
                    onKeyDown={handleClearKeyDown}
                  >
                    <FontAwesomeIcon icon={faXmark} className={ICON_SIZE_MD} aria-hidden="true" />
                  </button>
                ) : (
                  <>
                    {isCustom && (
                      <span
                        tabIndex={-1}
                        aria-label={label ?? placeholder}
                        className="inline-flex shrink-0 items-center"
                      >
                        <FontAwesomeIcon
                          icon={chevronIcon}
                          className={`${ICON_SIZE_MD} flex-shrink-0`}
                          style={hasValue ? { color: 'inherit' } : { color: '#6b7280' }}
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </>
                )}
              </div>
              {addedFilter && !hasValue && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`hide ${label} Filter`}
                  id="select_remove_btn"
                  onClick={handleHideFilter}
                  onKeyDown={handleHideFilterKeyDown}
                  onPointerDownCapture={stopTriggerOpen}
                  className="flex-shrink-0 cursor-pointer rounded p-1"
                >
                  <FontAwesomeIcon icon={faCircleMinus} className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={classNames(
              'border-[oklch(0.92 0.004 286.1)] bg-card flex flex-col rounded-md border text-xs shadow-xl',
              'shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]',
              'data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade will-change-[opacity,transform]',
              contentClassName
            )}
            sideOffset={4}
            align="start"
            side="bottom"
            avoidCollisions
            collisionPadding={8}
            style={contentStyle}
            id={contentId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            // radix-ui DropdownMenuContent typings omit onOpenAutoFocus; Radix forwards it to DismissableLayer
            // @ts-expect-error onOpenAutoFocus is supported at runtime (see SearchTriggerDropdown)
            onOpenAutoFocus={handleContentOpenAutoFocus}
          >
            <div className="contents" onKeyDownCapture={handleContentKeyDown}>
              <div id={titleId} className="flex items-center justify-between">
                <div className="flex w-full items-center justify-between gap-2 p-2">
                  <div className="text-[12px] font-semibold text-black">{label && `${label}`}</div>
                  {addCloseButton && (
                    <button
                      ref={closeButtonRef}
                      type="button"
                      id={closeButtonId}
                      onClick={handleCloseDropdown}
                      className={classNames(
                        'rounded text-[12px] text-black hover:underline',
                        FOCUS_STYLES
                      )}
                      aria-label="Close dropdown"
                      tabIndex={0}
                    >
                      <FontAwesomeIcon icon={faXmark} className={ICON_SIZE_MD} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {multiple && selectedOptions.length > 0 && showSelectedItems && (
                  <div id={selectedItemsId} className="flex flex-col">
                    <button
                      type="button"
                      id={selectedItemsHeaderId}
                      onClick={handleToggleSelectedItems}
                      aria-label="Toggle selected items"
                      aria-expanded={selectedItemsExpanded}
                      aria-controls={selectedChipsId}
                      tabIndex={0}
                      className={classNames(
                        'flex items-center justify-between gap-1 rounded-t px-2 py-1.5 text-left text-[10px] text-gray-700 hover:bg-gray-50',
                        FOCUS_STYLES
                      )}
                    >
                      <span>{selectedOptions.length} selected</span>
                      <FontAwesomeIcon
                        icon={selectedItemsExpanded ? faChevronUp : faChevronDown}
                        className={ICON_SIZE_SM}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
              </div>

              {selectedItemsExpanded && multiple && (
                <div
                  id={selectedChipsId}
                  className="flex flex-wrap gap-1 overflow-y-auto p-2"
                  style={{ maxHeight: CHIPS_CONTAINER_HEIGHT, minHeight: '40px' }}
                >
                  {selectedOptions.map((option) => (
                    <span
                      key={option.value}
                      className={CHIP_STYLES}
                      aria-label={option.label}
                      aria-selected={true}
                      role="option"
                      tabIndex={0}
                    >
                      {option.label}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveChip(e, option)}
                        className={classNames(CHIP_REMOVE_BTN, FOCUS_STYLES, 'rounded-full')}
                        aria-label={`Remove ${option.label}`}
                        tabIndex={0}
                      >
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className={ICON_SIZE_SM}
                          aria-hidden="true"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {searchable && (
                <div id={searchSectionId} className={SECTION_SEARCH}>
                  <div className="bg-card flex items-center gap-2 rounded-lg border border-[#EAEAEB] px-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className={classNames(
                        'bg-card min-w-0 flex-1 border-0 p-1 py-2 text-sm text-xs text-gray-900 outline-none placeholder:text-gray-500',
                        FOCUS_STYLES
                      )}
                      onKeyDown={handleSearchKeyDown}
                      id={searchInputId}
                      aria-label={searchPlaceholder || 'Search options'}
                      role="searchbox"
                    />
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className={`${ICON_SIZE_MD} flex-shrink-0 text-gray-500`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              )}

              <div
                id={optionsListId}
                className="overflow-x-hidden overflow-y-auto p-1"
                style={{ maxHeight }}
                role="presentation"
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => renderOption(option))
                ) : (
                  <div className="flex items-center justify-center px-3 py-4 text-[11px] text-gray-500 italic">
                    No options found
                  </div>
                )}
              </div>

              {((clearable && multiple) || addCloseButton) && (
                <div id={footerId} className={SECTION_FOOTER}>
                  {clearable && multiple ? (
                    <button
                      ref={clearSelectionRef}
                      type="button"
                      id={clearSelectionId}
                      onClick={handleClearSelection}
                      aria-disabled={!hasValue}
                      onKeyDown={handleClearSelectionKeyDown}
                      className={classNames(
                        'rounded text-[12px] text-black hover:underline',
                        FOCUS_STYLES,
                        !hasValue && 'cursor-not-allowed opacity-50 hover:no-underline'
                      )}
                      aria-label="Clear selection"
                      tabIndex={0}
                    >
                      Clear all selections
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              )}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default React.memo(RadixDropDown) as React.FC<RadixDropDownProps>;
