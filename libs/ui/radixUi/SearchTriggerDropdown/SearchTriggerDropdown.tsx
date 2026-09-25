import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useId,
  useMemo,
} from 'react';
import { Popover } from 'radix-ui';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faStarChristmas, faXmark } from '@fortawesome/pro-light-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface SearchTriggerDropdownOption {
  id: string;
  label: string;
  value: string;
}

/** Shape of a single initial-results group shown before the user types. */
export interface SearchTriggerDropdownInitialResults {
  /** Label displayed above the initial results list (e.g. "Suggested", "Recent"). */
  title: string;
  /** Options to show initially for this section. */
  options: SearchTriggerDropdownOption[];
}

/** Single section config: each section has its own onSearch (API), onSelect, and optional defaults */
export interface SearchTriggerDropdownConfigItem {
  id: string;
  label?: string;
  placeholder: string;
  /**
   * Optional width for this section's input (e.g. "200px", "33%").
   * If not set, the section shares the total width equally with other sections that also have no width.
   */
  width?: string;
  /**
   * Options to show upfront when the dropdown opens (before user types or when query is below minSearchChars).
   * Use for e.g. "Recent" or "Suggestions" so something is visible on first click.
   */
  initialResults?: SearchTriggerDropdownInitialResults[];
  /**
   * Optional content rendered at the end of the dropdown list when this section is open.
   */
  children?: React.ReactNode;
  /**
   * Optional default for this section.
   * - When an option: input shows option.label and it counts as a selectedOption.
   * - When a string: input is pre-filled with that text but there is NO selectedOption.
   */
  defaultValue?: SearchTriggerDropdownOption | string | null;
  onSearch: (query: string) => Promise<SearchTriggerDropdownOption[]>;
  onSelect: (option: SearchTriggerDropdownOption) => void;
}

/** Snapshot of each section when submitting search or after clearing a section */
export type SearchTriggerDropdownSectionPayload = {
  id: string;
  label?: string;
  inputValue: string;
  selectedOption?: SearchTriggerDropdownOption | null;
};

function buildSectionSearchPayload(
  cfg: SearchTriggerDropdownConfigItem[],
  sectionValues: Record<string, string>,
  sectionSelected: Record<string, SearchTriggerDropdownOption | null>,
  clearedSectionId?: string
): SearchTriggerDropdownSectionPayload[] {
  return cfg
    .filter((item): item is SearchTriggerDropdownConfigItem => item != null)
    .map((item) => {
      const inputValue = clearedSectionId === item.id ? '' : (sectionValues[item.id] ?? '');
      const storedSelected =
        clearedSectionId === item.id ? null : (sectionSelected[item.id] ?? null);
      const selectedOption =
        storedSelected != null && inputValue === (storedSelected?.label ?? '')
          ? storedSelected
          : null;
      return {
        id: item.id,
        label: item.label,
        inputValue,
        selectedOption,
      };
    });
}

export interface SearchTriggerDropdownProps {
  /** Config array: each item defines a section with its own onSearch and onSelect */
  config: SearchTriggerDropdownConfigItem[];
  /** Minimum number of characters before calling onSearch (default: 3) */
  minSearchChars?: number;
  /** Debounce delay for search in ms (default: 300) */
  searchDebounceMs?: number;
  /** Width of the trigger/dropdown (e.g. "400px", "100%") */
  width?: string;
  /** Height of the trigger (e.g. "40px", "48px") */
  height?: string;
  /** Border style: CSS border value (e.g. "1px solid #ccc") or use borderClassName for gradient */
  border?: string;
  /** ClassName applied to the outer wrapper for gradient border */
  borderClassName?: string;
  /** ClassName for the inner trigger container */
  triggerClassName?: string;
  /** ClassName for the dropdown content */
  contentClassName?: string;
  /** Called when clicking the search icon; sends id + input/selected info for each section */
  handleSearch?: (sections: SearchTriggerDropdownSectionPayload[]) => void;
  /** Id for the root element */
  id?: string;
  /** Disabled state */
  disabled?: boolean;
  /**
   * Accessible label for the combobox (rendered as visually hidden when provided).
   * Use this or ariaLabelledBy to ensure the combobox is properly labeled.
   */
  label?: string;
  disableTrigger?: boolean;
  /**
   * ID of the element that labels the combobox. Use when the label is rendered externally.
   * Takes precedence over label when both are provided.
   */
  ariaLabelledBy?: string;
  /** Show magnifying glass icon */
  showMagnifyingGlass?: boolean;

  /** Show preceding icon */
  showPrecedingIcon?: boolean;
  precedingIcon?: IconProp;
  precedingIconClassName?: string;
  /**
   * Optional external flag (as a ref) indicating that the user has submitted
   * the search at least once. When provided, this ref is used to decide
   * whether `handleClear` should fire.
   *
   * If omitted, the component manages its own internal ref that is toggled
   * when the Search button is clicked.
   */
  searchButtonSubmittedRef?: React.MutableRefObject<boolean>;
  /**
   * Called when clearing one section; includes full sections snapshot after that clear.
   * Only invoked when the effective `searchButtonSubmittedRef.current` is true.
   */
  handleClear?: (sections: SearchTriggerDropdownSectionPayload[], clearedSectionId: string) => void;
}

/** Returns label with matching query substring wrapped in <strong> (case-insensitive). */
function highlightMatch(
  label: string | null | undefined,
  query: string | null | undefined
): React.ReactNode {
  const safeLabel = label ?? '';
  const safeQuery = query ?? '';
  if (!safeQuery.trim()) return safeLabel;
  const lowerLabel = safeLabel.toLowerCase();
  const lowerQuery = safeQuery.toLowerCase();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = lowerLabel.indexOf(lowerQuery);
  let key = 0;
  while (index !== -1) {
    parts.push(safeLabel.slice(lastIndex, index));
    parts.push(
      <strong key={`match-${key++}`} className="font-semibold">
        {safeLabel.slice(index, index + safeQuery.length)}
      </strong>
    );
    lastIndex = index + safeQuery.length;
    index = lowerLabel.indexOf(lowerQuery, lastIndex);
  }
  parts.push(safeLabel.slice(lastIndex));
  return parts;
}

type SectionComputedState = {
  query: string;
  hasQuery: boolean;
  queryMeetsMin: boolean;
  results: SearchTriggerDropdownOption[];
  initialResultGroups: SearchTriggerDropdownInitialResults[];
  hasInitialResultGroups: boolean;
  hasSearchResults: boolean;
  shouldShowInitialResults: boolean;
  showChildren: boolean;
  loading: boolean;
};

const SearchTriggerDropdown = React.forwardRef<HTMLDivElement, SearchTriggerDropdownProps>(
  (
    {
      config,
      minSearchChars = 3,
      searchDebounceMs = 300,
      width = '100%',
      height = '44px',
      border,
      borderClassName,
      triggerClassName,
      contentClassName,
      handleSearch,
      id: rootId,
      disabled = false,
      label,
      ariaLabelledBy,
      disableTrigger = false,
      showMagnifyingGlass = false,
      showPrecedingIcon = true,
      precedingIcon = faStarChristmas,
      precedingIconClassName = 'text-blue-600 h-4 w-4',
      searchButtonSubmittedRef: externalSearchSubmittedRef,
      handleClear,
    },
    ref
  ) => {
    const safeConfig = config ?? [];
    const [sectionValues, setSectionValues] = useState<Record<string, string>>(() =>
      safeConfig.reduce<Record<string, string>>((acc, item) => {
        const dv = item?.defaultValue;
        if (typeof dv === 'string') {
          acc[item.id] = dv;
        } else if (dv != null && typeof dv === 'object' && dv?.label != null) {
          acc[item.id] = dv.label;
        }
        return acc;
      }, {})
    );
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [sectionResults, setSectionResults] = useState<
      Record<string, SearchTriggerDropdownOption[]>
    >({});
    const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>({});
    const [openSectionId, setOpenSectionId] = useState<string | null>(null);
    const [sectionSelected, setSectionSelected] = useState<
      Record<string, SearchTriggerDropdownOption | null>
    >(() =>
      safeConfig.reduce<Record<string, SearchTriggerDropdownOption | null>>((acc, item) => {
        if (!item) return acc;
        const dv = item.defaultValue;
        acc[item.id] = typeof dv === 'object' && dv !== null ? dv : null;
        return acc;
      }, {})
    );

    const [debouncedSectionValues, setDebouncedSectionValues] = useState<Record<string, string>>(
      {}
    );

    // If the consumer passes their own ref, use that; otherwise, maintain an internal one.
    const internalSearchButtonSubmittedRef = useRef(false);
    const searchButtonSubmittedRef = externalSearchSubmittedRef ?? internalSearchButtonSubmittedRef;
    // When we own the ref internally, reset it whenever the config identity changes.
    const configIdentityKey = useMemo(() => safeConfig.map((c) => c?.id).join('\0'), [safeConfig]);
    useEffect(() => {
      if (!externalSearchSubmittedRef) {
        searchButtonSubmittedRef.current = false;
      }
    }, [configIdentityKey, externalSearchSubmittedRef, searchButtonSubmittedRef]);

    useEffect(() => {
      const delay = searchDebounceMs ?? 300;
      const timers: number[] = [];

      safeConfig.forEach((cfg) => {
        if (!cfg) return;
        const id = cfg.id;
        const value = sectionValues[id] ?? '';

        const timer = window.setTimeout(() => {
          setDebouncedSectionValues((prev) => {
            if (prev[id] === value) return prev;
            return { ...prev, [id]: value };
          });
        }, delay);

        timers.push(timer);
      });

      return () => {
        timers.forEach((t) => window.clearTimeout(t));
      };
    }, [safeConfig, sectionValues, searchDebounceMs]);

    const activeDebouncedValue = activeSectionId
      ? (debouncedSectionValues[activeSectionId] ?? '')
      : '';

    useEffect(() => {
      const minChars = minSearchChars ?? 3;
      const queryLength = activeDebouncedValue?.length ?? 0;

      // If there's no active section or the query is shorter than the minimum,
      // just clear async search results for that section and DO NOT touch the dropdown open state.
      if (!activeSectionId || queryLength < minChars) {
        if (activeSectionId) {
          setSectionResults((prev) => ({ ...prev, [activeSectionId]: [] }));
        }
        return;
      }

      const item = safeConfig.find((c) => c?.id === activeSectionId);
      if (!item?.onSearch) return;

      setSectionLoading((prev) => ({ ...prev, [activeSectionId]: true }));

      const promise = item.onSearch(activeDebouncedValue);
      if (
        promise != null &&
        promise != undefined &&
        !Array.isArray(promise) &&
        promise instanceof Promise
      ) {
        promise
          .then((res: any) => {
            const list = res && Array.isArray(res) ? res : [];
            setSectionResults((prev) => ({ ...prev, [activeSectionId]: list }));
            setOpenSectionId(list.length > 0 ? activeSectionId : null);
          })
          .catch(() => {
            setSectionResults((prev) => ({ ...prev, [activeSectionId]: [] }));
            setOpenSectionId(null);
          })
          .finally(() => {
            setSectionLoading((prev) => ({ ...prev, [activeSectionId]: false }));
          });
      } else {
        setSectionLoading((prev) => ({ ...prev, [activeSectionId]: false }));
      }
    }, [activeSectionId, activeDebouncedValue, minSearchChars, safeConfig]);

    const handleSectionChange = useCallback(
      (sectionId: string, value: string) => {
        if (sectionId == null) return;

        // Update the typed value and active section
        setSectionValues((prev) => ({ ...prev, [sectionId]: value }));
        setActiveSectionId(sectionId);

        const minChars = minSearchChars ?? 3;
        if ((value?.length ?? 0) < minChars) {
          setSectionResults((prev) => ({ ...prev, [sectionId]: [] }));
        }

        // When typing in one section, clear loading flags for all other sections
        setSectionLoading((prev) => {
          const next: Record<string, boolean> = { ...prev };
          Object.keys(next).forEach((id) => {
            if (id !== sectionId) {
              next[id] = false;
            }
          });
          return next;
        });
      },
      [minSearchChars]
    );

    const handleClearSection = useCallback(
      (sectionId: string) => {
        setSectionValues((prev) => ({ ...prev, [sectionId]: '' }));
        setSectionSelected((prev) => ({ ...prev, [sectionId]: null }));
        setSectionResults((prev) => ({ ...prev, [sectionId]: [] }));
        if (searchButtonSubmittedRef.current) {
          const sections = buildSectionSearchPayload(
            safeConfig,
            sectionValues,
            sectionSelected,
            sectionId
          );
          handleClear?.(sections, sectionId);
        }
        setTimeout(() => {
          const inputEl = document.getElementById(
            `${sectionId}-trigger-dropdown-input`
          ) as HTMLInputElement | null;
          inputEl?.focus();
        }, 0);
      },
      [handleClear, safeConfig, sectionValues, sectionSelected, searchButtonSubmittedRef]
    );

    const handleSelect = useCallback(
      (option: SearchTriggerDropdownOption | null | undefined) => {
        if (!openSectionId || option == null) return;
        const item = safeConfig.find((c) => c?.id === openSectionId);
        if (item?.onSelect) {
          item.onSelect(option);
        }
        setSectionSelected((prev) => ({ ...prev, [openSectionId]: option }));
        setSectionValues((prev) => ({
          ...prev,
          [openSectionId]: option?.label ?? '',
        }));

        // Close the dropdown for this section.
        setActiveSectionId(null);
        setOpenSectionId(null);

        // Return focus to the input field of the selected section.
        const sectionId = openSectionId;
        window.setTimeout(() => {
          const inputEl = document.getElementById(
            `${sectionId}-trigger-dropdown-input`
          ) as HTMLInputElement | null;
          inputEl?.focus();
        }, 0);
      },
      [openSectionId, safeConfig]
    );

    const triggerContainerRef = useRef<HTMLDivElement | null>(null);
    const pendingSectionIdRef = useRef<string | null>(null);
    const listboxId = useId();
    const listboxLabelId = useId();
    const comboboxLabelId = useId();
    const sectionLabelPrefix = useId();

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        if (newOpen) {
          if (openSectionId == null) {
            const firstWithInitial = safeConfig.find((c) => (c?.initialResults?.length ?? 0) > 0);
            if (firstWithInitial) {
              setActiveSectionId(firstWithInitial.id);
              setOpenSectionId(firstWithInitial.id);
            }
          }
          return;
        }
        const pending = pendingSectionIdRef.current;
        if (pending != null) {
          pendingSectionIdRef.current = null;
          setOpenSectionId(pending);
          return;
        }
        const activeEl = document.activeElement;
        if (triggerContainerRef.current?.contains(activeEl)) {
          return;
        }
        setOpenSectionId(null);
        setActiveSectionId(null);
      },
      [openSectionId, safeConfig]
    );

    const handleIconClick = useCallback(() => {
      if (handleSearch == null) return;
      searchButtonSubmittedRef.current = true;
      handleSearch(buildSectionSearchPayload(safeConfig, sectionValues, sectionSelected));
    }, [handleSearch, safeConfig, sectionValues, sectionSelected, searchButtonSubmittedRef]);

    const contentRef = useRef<HTMLDivElement>(null);
    const firstConfigId = safeConfig[0]?.id;
    const isFirstSection = openSectionId != null && openSectionId === firstConfigId;

    useLayoutEffect(() => {
      const contentEl = contentRef.current;
      if (!openSectionId || isFirstSection || !contentEl) return;
      const sectionEl = document.getElementById(
        `${openSectionId}-trigger-dropdown-input-container`
      );
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const dropdownWidth = Math.max(200, Math.min(400, rect.width));
      const left = Math.max(0, rect.right - dropdownWidth);
      contentEl.style.position = 'fixed';
      contentEl.style.left = `${left}px`;
      contentEl.style.top = `${rect.bottom + 6}px`;
      contentEl.style.width = `${dropdownWidth}px`;
      contentEl.style.transform = 'none';
      contentEl.style.minWidth = '200px';
      return () => {
        if (contentEl) {
          contentEl.style.position = '';
          contentEl.style.left = '';
          contentEl.style.top = '';
          contentEl.style.width = '';
          contentEl.style.transform = '';
          contentEl.style.minWidth = '';
        }
      };
    }, [openSectionId, isFirstSection]);

    const triggerStyle: React.CSSProperties = {
      width: width ?? '100%',
      height: height ?? '44px',
      ...(border != null && border !== '' && !borderClassName ? { border } : {}),
    };

    const sectionStateById: Record<string, SectionComputedState> = useMemo(() => {
      const minChars = minSearchChars ?? 3;
      const state: Record<string, SectionComputedState> = {};

      safeConfig.forEach((cfg) => {
        if (!cfg) return;
        const id = cfg.id;
        const query = sectionValues[id] ?? '';
        const hasQuery = (query?.trim?.() ?? '').length > 0;
        const queryMeetsMin = (query?.length ?? 0) >= minChars;
        const resultsForSection = sectionResults[id] ?? [];
        const initialResultGroupsForSection = cfg.initialResults ?? [];
        const hasInitialResultGroupsForSection = initialResultGroupsForSection.some(
          (group) => (group?.options?.length ?? 0) > 0
        );
        const hasSearchResultsForSection = (resultsForSection?.length ?? 0) > 0;
        const shouldShowInitialResultsForSection =
          !hasQuery && !hasSearchResultsForSection && hasInitialResultGroupsForSection;
        const showChildrenForSection = !hasQuery && cfg.children != null;
        const loadingForSection = sectionLoading[id] ?? false;

        state[id] = {
          query,
          hasQuery,
          queryMeetsMin,
          results: resultsForSection,
          initialResultGroups: initialResultGroupsForSection,
          hasInitialResultGroups: hasInitialResultGroupsForSection,
          hasSearchResults: hasSearchResultsForSection,
          shouldShowInitialResults: shouldShowInitialResultsForSection,
          showChildren: showChildrenForSection,
          loading: loadingForSection,
        };
      });

      return state;
    }, [safeConfig, sectionValues, sectionResults, sectionLoading, minSearchChars]);

    const openSectionConfig =
      openSectionId != null ? (safeConfig.find((c) => c?.id === openSectionId) ?? null) : null;
    const openSectionState = openSectionId != null ? sectionStateById[openSectionId] : undefined;

    const openSectionQuery = openSectionState?.query ?? '';
    const hasQuery = openSectionState?.hasQuery ?? false;
    const queryMeetsMin = openSectionState?.queryMeetsMin ?? false;
    const results = openSectionState?.results ?? [];
    const initialResultGroups = openSectionState?.initialResultGroups ?? [];
    const hasSearchResults = openSectionState?.hasSearchResults ?? false;
    const shouldShowInitialResults = openSectionState?.shouldShowInitialResults ?? false;
    const showChildren = openSectionId != null && !hasQuery && openSectionConfig?.children != null;
    const loading = openSectionState?.loading ?? false;

    const hasAnySelection =
      Object.values(sectionSelected).some((val) => val != null) ||
      Object.values(sectionValues).some((val) => (val?.trim?.() ?? '').length > 0);

    // change if loading is needed to be added back
    const shouldShowDropdown =
      openSectionId != null &&
      !loading &&
      (hasSearchResults || shouldShowInitialResults || showChildren);

    const setTriggerRef = useCallback(
      (el: HTMLDivElement | null) => {
        triggerContainerRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      },
      [ref]
    );

    const inner = (
      <div
        ref={setTriggerRef}
        id={rootId}
        className={classNames(
          'bg-card flex w-full items-center rounded-full ps-[12px] text-left text-xs text-gray-700 outline-none',
          disabled && 'cursor-not-allowed opacity-60',
          !border && !borderClassName && 'border border-gray-300',
          triggerClassName
        )}
        style={triggerStyle}
      >
        {showPrecedingIcon && (
          <div>
            <FontAwesomeIcon icon={precedingIcon} className={precedingIconClassName} aria-hidden />
          </div>
        )}

        {/* <div className="flex min-w-0 flex-1 items-center"> */}
        {safeConfig.map((item, index) => {
          if (item == null) return null;
          const isFirst = index === 0;
          const value = sectionValues[item.id] ?? '';
          const hasSelection = sectionSelected[item.id] != null;
          const showClear = !disabled && (value !== '' || hasSelection);
          const hasExplicitWidth = item.width != null && item.width !== '';
          const sectionStyle: React.CSSProperties = hasExplicitWidth
            ? { width: item.width ?? undefined, flex: '1 1 auto', minWidth: 0 }
            : { flex: '1 1 0%', minWidth: 0 };
          const isOpenForItem = openSectionId === item.id;
          return (
            <React.Fragment key={item.id ?? index}>
              {index > 0 && <div className="h-5 w-px shrink-0 bg-gray-300" aria-hidden />}
              <div
                id={`${item.id}-trigger-dropdown-input-container`}
                className={classNames(
                  'ml-[8px] flex max-w-full min-w-0 items-center',
                  isFirst && 'rounded-l-full'
                )}
                style={sectionStyle}
              >
                <span id={`${sectionLabelPrefix}-${item.id}`} className="sr-only">
                  {item.label ?? item.placeholder ?? item.id ?? 'Search'}
                </span>
                <input
                  id={`${item.id}-trigger-dropdown-input`}
                  type="text"
                  role="combobox"
                  aria-expanded={isOpenForItem}
                  aria-haspopup="listbox"
                  aria-controls={shouldShowDropdown ? listboxId : undefined}
                  placeholder={item.placeholder ?? ''}
                  value={value}
                  onChange={(e) => handleSectionChange(item.id, e?.target?.value ?? '')}
                  aria-autocomplete="list"
                  onFocus={() => {
                    if (activeSectionId !== item.id) {
                      pendingSectionIdRef.current = null;
                      setTimeout(() => {
                        setActiveSectionId(item.id);
                        setOpenSectionId(item.id);
                      }, 0);
                      setActiveSectionId(null);
                      setOpenSectionId(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && !e.shiftKey && showClear) {
                      e.preventDefault();
                      const clearButton = document.getElementById(
                        `${item.id}-trigger-dropdown-clear`
                      ) as HTMLButtonElement | null;
                      clearButton?.focus();
                      return;
                    }
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      if (shouldShowDropdown && openSectionId === item.id) {
                        const listboxEl = document.getElementById(listboxId);
                        const optionNodes = listboxEl?.querySelectorAll('[role="option"]');

                        if (!optionNodes || optionNodes.length === 0) return;

                        e.preventDefault();

                        if (e.key === 'ArrowDown') {
                          (optionNodes[0] as HTMLButtonElement)?.focus();
                        } else {
                          (optionNodes[optionNodes.length - 1] as HTMLButtonElement)?.focus();
                        }
                        return;
                      }
                    }
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!disabled && hasAnySelection) {
                        handleIconClick();
                      }
                    }
                  }}
                  disabled={disabled}
                  className={classNames(
                    'min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm text-[#3F3F46] outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-0 focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 focus-visible:outline-none'
                  )}
                  aria-labelledby={`${sectionLabelPrefix}-${item.id}`}
                />
                {showClear && (
                  <button
                    id={`${item.id}-trigger-dropdown-clear`}
                    type="button"
                    onClick={() => handleClearSection(item.id)}
                    className="focus-visible:ring-primary mr-1 ml-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-gray-600 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
                    aria-label={`Clear ${item.label ?? item.id ?? 'section'}`}
                    tabIndex={showClear ? 0 : -1}
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" aria-hidden />
                  </button>
                )}
              </div>
            </React.Fragment>
          );
        })}
        {/* </div> */}
        <button
          id="search-trigger-dropdown-submit-button"
          type="button"
          onClick={handleIconClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!disabled && hasAnySelection && !disableTrigger) {
                handleIconClick();
              }
            }
          }}
          disabled={(disabled || !hasAnySelection) && disableTrigger}
          // className="focus-visible:ring-primary mr-2 ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed"
          className={`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-black disabled:cursor-not-allowed ${showMagnifyingGlass ? 'mr-2 ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600' : 'my-4 me-1 flex items-center justify-center rounded-full bg-[#39393C] px-4 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-30'}`}
          aria-label={
            showMagnifyingGlass
              ? label
                ? `Run search for ${label}`
                : 'Run combined search'
              : undefined
          }
          //aria-expanded={shouldShowDropdown}
        >
          {/* <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" aria-hidden /> */}
          {showMagnifyingGlass ? (
            <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" aria-hidden />
          ) : (
            <span>Search</span>
          )}
        </button>
      </div>
    );

    const triggerNode =
      borderClassName != null && borderClassName !== '' ? (
        <div
          className={classNames('rounded-full p-[2px]', borderClassName)}
          style={{ width: width ?? '100%', minHeight: height ?? '44px' }}
        >
          {inner}
        </div>
      ) : (
        inner
      );

    const comboboxAriaLabelledBy = ariaLabelledBy ?? (label ? comboboxLabelId : undefined);

    return (
      <Popover.Root open={shouldShowDropdown} onOpenChange={handleOpenChange}>
        {label && !ariaLabelledBy ? (
          <span id={comboboxLabelId} className="sr-only">
            {label}
          </span>
        ) : null}
        <Popover.Anchor asChild>
          <div
            role="search"
            className="block w-full cursor-text rounded-full outline-none disabled:cursor-not-allowed"
            style={{ width: width ?? '100%' }}
            aria-labelledby={comboboxAriaLabelledBy}
            aria-expanded={shouldShowDropdown}
          >
            {triggerNode}
          </div>
        </Popover.Anchor>
        {shouldShowDropdown && (
          <Popover.Portal>
            <Popover.Content
              key={openSectionId ?? 'closed'}
              ref={contentRef}
              className={classNames(
                'z-[9999] max-h-[464px] overflow-hidden rounded-2xl shadow-lg',
                'data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:zoom-in-95',
                borderClassName ? classNames('p-[2px]', borderClassName) : 'bg-card',
                contentClassName
              )}
              side="bottom"
              sideOffset={6}
              align={isFirstSection ? 'start' : 'end'}
              style={
                isFirstSection
                  ? {
                      width:
                        width != null && typeof width === 'string' && width !== '100%'
                          ? width
                          : 'var(--radix-popover-trigger-width)',
                      minWidth: 200,
                    }
                  : {
                      width: 'calc(var(--radix-popover-trigger-width) * 0.6)',
                      minWidth: 200,
                    }
              }
              onOpenAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => {
                if (triggerContainerRef.current?.contains(e.target as Node)) {
                  e.preventDefault();
                }
              }}
            >
              <div
                className={classNames(
                  'overflow-hidden rounded-2xl',
                  borderClassName ? 'bg-card' : ''
                )}
                style={{ width: '100%' }}
              >
                <span id={listboxLabelId} className="sr-only">
                  {openSectionId
                    ? `${
                        config.find((c) => c.id === openSectionId)?.label ?? openSectionId
                      } results`
                    : 'Results'}
                </span>
                <div
                  role="listbox"
                  id={listboxId}
                  aria-labelledby={listboxLabelId}
                  aria-busy={loading}
                  className="max-h-[464px] w-full overflow-y-auto rounded-2xl px-[24px] pt-[24px] pb-[12px]"
                >
                  {loading ? (
                    <div className="px-[12px] py-[8px] text-xs text-gray-500">Loading...</div>
                  ) : hasQuery && queryMeetsMin && hasSearchResults ? (
                    results.map((option, idx) =>
                      option != null ? (
                        <button
                          key={option.id ?? idx}
                          type="button"
                          role="option"
                          tabIndex={-1}
                          aria-selected={sectionSelected[openSectionId!]?.id === option.id}
                          className="focus-visible:ring-primary flex w-full cursor-pointer items-center border-b border-[#EAEAEB] px-[12px] py-[8px] text-left text-xs text-black hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
                          onClick={() => handleSelect(option)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                              e.preventDefault();
                              const listboxEl = document.getElementById(listboxId);
                              const options = listboxEl?.querySelectorAll('[role="option"]');
                              if (!options || options.length === 0) return;
                              const currentIndex = Array.prototype.indexOf.call(
                                options,
                                e.currentTarget
                              );
                              if (currentIndex === -1) return;
                              let nextIndex = currentIndex;
                              if (e.key === 'ArrowDown') {
                                nextIndex = Math.min(currentIndex + 1, options.length - 1);
                              } else if (e.key === 'ArrowUp') {
                                nextIndex = currentIndex - 1;
                                if (nextIndex < 0 && openSectionId) {
                                  const inputEl = document.getElementById(
                                    `${openSectionId}-trigger-dropdown-input`
                                  ) as HTMLInputElement | null;
                                  inputEl?.focus();
                                  return;
                                }
                              }
                              const next = options[nextIndex] as HTMLButtonElement | undefined;
                              next?.focus();
                            }
                          }}
                        >
                          {highlightMatch(option?.label, openSectionQuery)}
                        </button>
                      ) : null
                    )
                  ) : shouldShowInitialResults ? (
                    initialResultGroups.map((group, groupIdx) =>
                      group != null ? (
                        <div
                          key={group.title ?? groupIdx}
                          role="group"
                          aria-labelledby={
                            group.title
                              ? `${sectionLabelPrefix}-group-${groupIdx}-label`
                              : undefined
                          }
                          className={classNames(
                            'space-y-[1px]',
                            groupIdx > 0 && 'mt-3 border-t border-gray-200 pt-[8px]'
                          )}
                        >
                          {group.title ? (
                            <div
                              id={`${sectionLabelPrefix}-group-${groupIdx}-label`}
                              className="px-[12px] pb-[4px] text-[12px] font-normal text-gray-600"
                            >
                              {group.title}
                            </div>
                          ) : null}
                          {group.options?.map((option, idx) =>
                            option != null ? (
                              <button
                                key={option.id ?? idx}
                                type="button"
                                role="option"
                                tabIndex={-1}
                                aria-selected={sectionSelected[openSectionId!]?.id === option.id}
                                className="focus-visible:ring-primary flex w-full cursor-pointer items-center border-b border-[#EAEAEB] px-[12px] py-[8px] text-left text-xs text-black hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
                                onClick={() => handleSelect(option)}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    const listboxEl = document.getElementById(listboxId);
                                    const options = listboxEl?.querySelectorAll('[role="option"]');
                                    if (!options || options.length === 0) return;
                                    const currentIndex = Array.prototype.indexOf.call(
                                      options,
                                      e.currentTarget
                                    );
                                    if (currentIndex === -1) return;
                                    let nextIndex = currentIndex;
                                    if (e.key === 'ArrowDown') {
                                      nextIndex = Math.min(currentIndex + 1, options.length - 1);
                                    } else if (e.key === 'ArrowUp') {
                                      nextIndex = currentIndex - 1;
                                      if (nextIndex < 0 && openSectionId) {
                                        const inputEl = document.getElementById(
                                          `${openSectionId}-trigger-dropdown-input`
                                        ) as HTMLInputElement | null;
                                        inputEl?.focus();
                                        return;
                                      }
                                    }
                                    const next = options[nextIndex] as
                                      HTMLButtonElement | undefined;
                                    next?.focus();
                                  }
                                }}
                              >
                                {option.label}
                              </button>
                            ) : null
                          )}
                        </div>
                      ) : null
                    )
                  ) : null}
                  {showChildren && openSectionConfig?.children != null ? (
                    <React.Fragment key="children">{openSectionConfig.children}</React.Fragment>
                  ) : null}
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </Popover.Root>
    );
  }
);

SearchTriggerDropdown.displayName = 'SearchTriggerDropdown';

export default SearchTriggerDropdown;
