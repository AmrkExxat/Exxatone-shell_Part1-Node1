'use client';
import {
  faChevronDown,
  faChevronUp,
  faCirclePlus,
  faFilter,
  faMagnifyingGlass,
  faRotateRight,
  faXmark,
} from '@fortawesome/pro-light-svg-icons';
import { JSX, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TreeDropdown from './TreeDropdown/TreeDropdown';
import CustomDatePicker from './DatePicker/CustomDatePicker';
import FilterSelect from './FilterSelect/FilterSelect';
import DateRangePicker from './DateRangePicker/DateRangePicker';
import { ServerSelect } from './ServerSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { debounceSearch } from './TreeCheckbox/TreeCheckbox.type';
import React from 'react';
import DynamicTreeDropdown from '../../components/common/Form/components/DynamicTreeDropdown/DynamicTreeDropdown';
import SearchDropDown, { SearchDropDownOption } from './SearchDropdown/SearchDropdown';
import { CustomDateRangePicker } from './CustomDateRangePicker';
import CustomRangeComponent from '../../components/common/Form/components/CustomRangeComponent/CustomRangeComponent';
import Tooltip from '../../components/common/Tooltip/Tooltip';
import RadixSliderFilter from '../../radixUi/RadixSliderFilter/RadixSliderFilter';
import RadixDropDown from '../../radixUi/RadixDropDown/RadixDropDown';
import RadixInfiniteDropDown from '../../radixUi/RadixInfiniteDropDown/RadixInfiniteDropDown';
import { twMerge } from 'tailwind-merge';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const queryClient = new QueryClient();

const FilterForm = ({
  searchable = false,
  searchPlaceholder = 'Search',
  searchText = '',
  addFilter = false,
  classWrapper = '',
  config = [],
  onFilterChange,
  onFilterReset,
  multiAttributeSearch = false,
  searchAttributes = [],
  initialSearchData,
  searchWidth = '340',
  specificSearchToolTipText = '',
  showResetButton = true,
  searchInputId,
  searchInputClassName,
  addFilterButtonClassName,
  addIcon,
  resetButtonClassName,
  showMoreFiltersButtonClassName,
  moreFiltersButtonClassName,
  showFilterIcon = false,
  isDarkTheme = false,
  isPlainTheme = false,
  canAutoHideFilter = true,
  showFilterExpanderButton = true,
  resetCount = 0,
  debounceTime = 600,
  filterDebounceTime = 0,
  disableSearch = false,
}: {
  searchable?: boolean;
  searchPlaceholder?: string;
  searchText: string;
  addFilter?: boolean;
  classWrapper?: string;
  config: any;
  onFilterChange: (value: any, id?: string) => void;
  onFilterReset: () => void;
  multiAttributeSearch?: boolean;
  searchAttributes?: Array<{ id: string; label: string }>;
  initialSearchData?: any;
  searchWidth?: string;
  specificSearchToolTipText?: string;
  showResetButton?: boolean;
  searchInputId?: string;
  searchInputClassName?: string;
  addFilterButtonClassName?: string;
  addIcon?: IconProp;
  resetButtonClassName?: string;
  showMoreFiltersButtonClassName?: string;
  moreFiltersButtonClassName?: string;
  showFilterIcon?: boolean;
  isDarkTheme?: boolean;
  isPlainTheme?: boolean;
  canAutoHideFilter?: boolean;
  showFilterExpanderButton?: boolean;
  resetCount?: number;
  debounceTime?: number;
  filterDebounceTime?: number;
  disableSearch?: boolean;
}): JSX.Element => {
  const [clearBit, setClearBit] = useState<number>(0);
  const [query, setQuery] = useState(searchText);
  const [showMore, setShowMore] = useState(false);
  const [filterValue, setFilterValue] = useState({});
  const [openPanel, setOpenPanel] = useState<boolean>(false);

  const [updatedConfig, setUpdatedConfig] = useState<any[]>([]);
  const [extraUpdatedConfig, setExtraUpdatedConfig] = useState<any[]>([]);
  const [canAddFilter, setCanAddFilter] = useState<boolean>(addFilter);
  const [isDefaultSet, setIsDefaultSet] = useState<boolean>(false);
  const [isResetEnabled, setIsResetEnabled] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [disabledIds, setDisabledIds] = useState<string[]>([]);
  const clearingData = useRef<any>(null);

  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedSearchAttribute, setSelectedSearchAttribute] = useState<any>(null);

  // New state for tracking if filters are multiline
  const [isMultiline, setIsMultiline] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(true);
  const [hiddenFiltersCount, setHiddenFiltersCount] = useState(0);
  const [firstLineHeight, setFirstLineHeight] = useState<number | null>(null);
  const filtersContainerRef = useRef<HTMLDivElement | null>(null);
  const checkingMultilineRef = useRef(false);
  const initialRender = useRef(true);
  const isFilterChangeRef = useRef(false); // Track if change is from filter interaction
  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
    };
  }, []);

  const getConfigWithDefaultPresent = (config: any) => {
    let list = config.map((i) => {
      const defaultValues = i.defaultValues ?? i.defaultValue;
      const hasDefault = !isDefaultValueEmpty(defaultValues);

      if (hasDefault) {
        return i?.id;
      }
      return null;
    });
    const filtered = list.filter((i) => i);
    return filtered;
  };

  const handleCheckMultiline = (
    cond: boolean,
    _showAllFilters: boolean,
    isUserToggle: boolean = false
  ) => {
    if (!canAutoHideFilter) return;
    const checkMultiline = () => {
      if (checkingMultilineRef.current || !filtersContainerRef.current) return;

      checkingMultilineRef.current = true;
      const container = filtersContainerRef.current;
      const children = Array.from(container.children);

      if (children.length <= 1) {
        setIsMultiline(false);
        setHiddenFiltersCount(0);
        setFirstLineHeight(null);
        checkingMultilineRef.current = false;
        return;
      }

      if (cond === true) {
        setTimeout(() => {
          checkingMultilineRef.current = false;
        }, 300);
        setShowAllFilters(true);
      }

      // Store original display states
      const elementsToCheck: {
        element: HTMLElement;
        originalDisplay: string;
        top: number;
        elementId: string;
      }[] = [];
      children.forEach((child) => {
        const element = child as HTMLElement;
        const elementId = child.id;
        const originalDisplay = element.style.display;
        elementsToCheck.push({
          element,
          originalDisplay,
          top: 0,
          elementId,
        });
        // Ensure element is visible for measurement
        if (originalDisplay === 'none') {
          element.style.display = '';
        }
      });

      // Force a reflow to get accurate positions
      container.offsetHeight;

      // Get positions after making everything visible
      const firstChildTop = elementsToCheck[0].element.offsetTop;
      let hiddenCount = 0;

      elementsToCheck.forEach((item) => {
        item.top = item.element.offsetTop;
        if (item.top > firstChildTop) {
          hiddenCount++;
        }
      });

      // Get config IDs with default values - check BOTH updatedConfig and config
      let configIdWithDefaultPresent: string[] = [];
      if (updatedConfig?.length > 0) {
        configIdWithDefaultPresent = getConfigWithDefaultPresent(updatedConfig);
      } else if (config?.length > 0) {
        configIdWithDefaultPresent = getConfigWithDefaultPresent(config);
      }

      // Check if ANY second-line filter has default values
      const hasSecondLineDefaults = elementsToCheck.some(
        (item) => item.top > firstChildTop && configIdWithDefaultPresent?.includes(item?.elementId)
      );

      // On initial render or when there are filters on second line
      if (initialRender.current) {
        initialRender.current = false;

        if (hasSecondLineDefaults) {
          // If second line has defaults, show all filters
          elementsToCheck.forEach((item) => {
            item.element.style.display = '';
          });

          setShowAllFilters(true);
          setIsMultiline(hiddenCount > 0);
          setHiddenFiltersCount(0);
        } else if (hiddenCount > 0) {
          // If second line exists but no defaults, collapse it
          elementsToCheck.forEach((item) => {
            if (item.top > firstChildTop) {
              item.element.style.display = 'none';
            }
          });

          setShowAllFilters(false);
          setIsMultiline(true);
          setHiddenFiltersCount(hiddenCount);
        }

        if (children.length > 0) {
          const firstChild = children[0] as HTMLElement;
          setFirstLineHeight(firstChild.offsetHeight);
        }

        checkingMultilineRef.current = false;
        return;
      }

      // Apply visibility based on showAllFilters state
      let actualHiddenCount = 0;

      // Check if we should force show all filters (when any second-line filter has defaults)
      // BUT only if this is NOT a user-triggered collapse (cond !== false or _showAllFilters is true)
      const shouldForceShowAll =
        !cond &&
        _showAllFilters &&
        elementsToCheck.some(
          (item) =>
            item.top > firstChildTop && configIdWithDefaultPresent?.includes(item?.elementId)
        );

      elementsToCheck.forEach((item) => {
        if (item.top > firstChildTop) {
          // If showAllFilters is true, show all
          // If user explicitly collapsed (cond === false and _showAllFilters === false), hide all
          // Otherwise, show if any has defaults
          if (_showAllFilters) {
            item.element.style.display = '';
          } else if (isUserToggle) {
            // User explicitly toggled collapse — always honor their choice
            item.element.style.display = 'none';
            actualHiddenCount++;
          } else if (shouldForceShowAll || hasSecondLineDefaults) {
            // Auto layout: keep second-line filters with defaults visible
            item.element.style.display = '';
          } else {
            item.element.style.display = 'none';
            actualHiddenCount++;
          }
        }
      });

      // Store the height of the first line
      if (children.length > 0) {
        const firstChild = children[0] as HTMLElement;
        setFirstLineHeight(firstChild.offsetHeight);
      }

      // Update state
      const hasWrapped = hiddenCount > 0;
      setIsMultiline(hasWrapped);
      setHiddenFiltersCount(
        _showAllFilters || (!isUserToggle && (shouldForceShowAll || hasSecondLineDefaults))
          ? 0
          : actualHiddenCount
      );

      checkingMultilineRef.current = false;
    };

    // Debounce the check
    const timeoutId = setTimeout(checkMultiline, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  };

  useEffect(() => {
    if (resetCount > 0) {
      clearFilter();
    }
  }, [resetCount]);

  // Check if filters container has wrapped to multiple lines
  useEffect(() => {
    if (updatedConfig?.length > 0) {
      // Don't reset showAllFilters if this is from a filter change
      if (isFilterChangeRef.current) {
        handleCheckMultiline(false, showAllFilters);
      } else {
        // For non-filter changes, check if second line has defaults
        const container = filtersContainerRef.current;
        if (container) {
          // Small delay to ensure DOM is rendered
          setTimeout(() => {
            const children = Array.from(container.children);
            if (children.length > 1) {
              const firstChildTop = (children[0] as HTMLElement).offsetTop;
              const configIdWithDefaultPresent = getConfigWithDefaultPresent(updatedConfig);

              // Check if any second-line filter has defaults
              const hasSecondLineDefaults = children.some((child, index) => {
                if (index === 0) return false;
                const childElement = child as HTMLElement;
                const isSecondLine = childElement.offsetTop > firstChildTop;
                const hasDefault = configIdWithDefaultPresent?.includes(child.id);

                return isSecondLine && hasDefault;
              });

              // Directly set showAllFilters before calling handleCheckMultiline
              setShowAllFilters(hasSecondLineDefaults);

              // Then call handleCheckMultiline with the correct value
              setTimeout(() => {
                handleCheckMultiline(false, hasSecondLineDefaults);
              }, 50);
            } else {
              handleCheckMultiline(false, false);
            }
          }, 50);
        } else {
          handleCheckMultiline(false, false);
        }
      }
    }
  }, [updatedConfig, extraUpdatedConfig]);

  // Reset showAllFilters when updatedConfig length changes (but not during filter changes or initial render)
  useEffect(() => {
    // Skip if this is a filter change or initial render
    if (isFilterChangeRef.current || initialRender.current) return;

    if (updatedConfig?.length > 0) {
      const container = filtersContainerRef.current;
      if (!container) return;

      // Wait for DOM to be ready
      setTimeout(() => {
        // Quick check if there are multiple lines
        const children = Array.from(container.children);
        if (children.length <= 1) return;

        // Check for second line
        const firstChildTop = (children[0] as HTMLElement).offsetTop;
        let hasSecondLine = false;

        for (let i = 1; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          if (child.offsetTop > firstChildTop) {
            hasSecondLine = true;
            break;
          }
        }

        // Check if any second-line filters have defaults
        const configIdWithDefaultPresent = getConfigWithDefaultPresent(updatedConfig);
        let hasSecondLineDefaults = false;

        for (let i = 1; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          if (child.offsetTop > firstChildTop && configIdWithDefaultPresent?.includes(child.id)) {
            hasSecondLineDefaults = true;

            break;
          }
        }

        // If there's a second line with defaults, keep it expanded
        // Otherwise collapse it
        if (hasSecondLine) {
          setShowAllFilters(hasSecondLineDefaults);
        }
      }, 100);
    }
  }, [updatedConfig.length]);

  // Separate effect for window resize
  useEffect(() => {
    const handleResize = () => {
      if (filtersContainerRef.current && !checkingMultilineRef.current) {
        const container = filtersContainerRef.current;
        const children = Array.from(container.children);

        if (children.length <= 1) return;

        // Quick check without manipulation
        const firstChildTop = (children[0] as HTMLElement).offsetTop;
        let hasMultiple = false;

        for (let i = 1; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          if (child.style.display !== 'none') {
            const childTop = child.offsetTop;
            if (childTop > firstChildTop) {
              hasMultiple = true;
              break;
            }
          }
        }

        if (hasMultiple !== isMultiline) {
          setIsMultiline(hasMultiple);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMultiline]);

  useEffect(() => {
    if (multiAttributeSearch && searchAttributes?.length > 0) {
      if (initialSearchData) {
        setFilterValue((prev) => ({ ...prev, search: initialSearchData }));
        if (multiAttributeSearch && searchAttributes.length > 0 && !selectedSearchAttribute) {
          if (initialSearchData && initialSearchData.searchAttribute) {
            const savedAttribute = searchAttributes.find(
              (attr) => attr.id === initialSearchData.searchAttribute
            );
            if (savedAttribute) {
              setSelectedSearchAttribute(savedAttribute);
            } else {
              setSelectedSearchAttribute(searchAttributes[0]);
            }
          } else {
            setSelectedSearchAttribute(searchAttributes[0]);
          }
        }
      } else if (searchText) {
        setFilterValue((prev) => ({ ...prev, search: searchText }));
        if (multiAttributeSearch && searchAttributes.length > 0 && !selectedSearchAttribute) {
          setSelectedSearchAttribute(searchAttributes[0]);
        }
      } else if (multiAttributeSearch && searchAttributes.length > 0 && !selectedSearchAttribute) {
        setSelectedSearchAttribute(searchAttributes[0]);
      }
    }
  }, [
    initialSearchData,
    searchText,
    multiAttributeSearch,
    searchAttributes,
    selectedSearchAttribute,
  ]);

  const updateFilterValue = (
    id: string,
    value: any,
    disableId: string | null = null,
    parentReset: boolean = false,
    skipMultilineCheck: boolean = false
  ) => {
    if (clearingData?.current === true) {
      setTimeout(() => {
        clearingData.current = false;
      }, 700);
    } else {
      // Mark that this is a filter change
      isFilterChangeRef.current = true;

      setFilterValue((prevState) => {
        const newState = { ...prevState, [id]: value };
        if (disableId && !parentReset) {
          delete newState[disableId];
        }
        if (!parentReset && onFilterChange) {
          // Only call handleCheckMultiline if not a search update or during initial layout
          if (!skipMultilineCheck && !initialRender.current) {
            handleCheckMultiline(true, true);
          }

          if (id !== 'search' && filterDebounceTime > 0) {
            if (filterDebounceRef.current) {
              clearTimeout(filterDebounceRef.current);
            }
            filterDebounceRef.current = setTimeout(() => {
              onFilterChange(newState, id);
            }, filterDebounceTime);
          } else {
            onFilterChange(newState, id);
          }
        }
        updateResetButton(newState);
        return newState;
      });

      // Reset the flag after a short delay
      setTimeout(() => {
        isFilterChangeRef.current = false;
      }, 100);
    }
  };

  const handleSearchChange = debounceSearch((text: string) => {
    if (searchable) {
      if (text.trim().length >= 3 || text.trim().length === 0) {
        const searchData =
          multiAttributeSearch && selectedSearchAttribute
            ? { search: text, searchAttribute: selectedSearchAttribute.id }
            : text;
        // Pass skipMultilineCheck = true to prevent handleCheckMultiline call
        updateFilterValue('search', searchData, null, false, true);
      }
    }
  }, debounceTime);

  const updateResetButton = (values) => {
    let enabled = false;
    const keys = Object.keys(values || {});
    const inputs = keys.includes('url') ? keys.filter((k) => k !== 'url') : keys;
    const disabledIds = config
      ?.filter((item: any) => item.disabled === true)
      ?.map((i: any) => i.id);

    for (let i = 0; i < inputs.length; i++) {
      if (disabledIds.includes(inputs[i])) {
        continue;
      }
      if (values[inputs[i]]) {
        if (
          (Array.isArray(values[inputs[i]]) && values[inputs[i]].length) ||
          values[inputs[i]] instanceof Date ||
          (typeof values[inputs[i]] === 'string' && values[inputs[i]].length)
        ) {
          enabled = true;
          break;
        } else if (typeof values[inputs[i]] === 'object') {
          const inputObject = Object.keys(values[inputs[i]]);
          if (
            (inputObject.includes('start') && values[inputs[i]].start) ||
            (inputObject.includes('end') && values[inputs[i]].end) ||
            inputObject.length
          ) {
            enabled = true;
            break;
          }
        }
      }
    }
    setIsResetEnabled(enabled);
  };

  const onChangeMethod = (input: string, val: any, parentReset?: boolean) => {
    const id = input.id;
    if (input.disableId && !parentReset) {
      isEnableDisableIds(input, val, input.disableId);
    }
    updateFilterValue(id, val, input?.disableId ?? null, parentReset);
  };

  const isEnableDisableIds = (input, val, disableId) => {
    let enable = true;
    const type = input.type;
    switch (type) {
      case 'treeDropdown':
        if (val?.length) {
          enable = false;
        }
        break;
      case 'dateRange':
        if (val?.start || val?.end) {
          enable = false;
        }
        break;
      case 'datePicker':
        if (val) {
          enable = false;
        }
        break;
      case 'customDateRangePicker':
        if (val?.selectedOption?.id) {
          enable = false;
        }
        break;
      case 'dropdown': {
        const multiple = input.mulitple;
        if (multiple && val?.length) {
          enable = false;
        } else if (!multiple && val) {
          enable = false;
        }
        break;
      }
      case 'infiniteDropdown': {
        const multiple = input.mulitple;
        if (multiple && val?.length) {
          enable = false;
        } else if (!multiple && val) {
          enable = false;
        }
        break;
      }
      case 'infiniteDynamicDropdown': {
        if (val?.length) {
          enable = false;
        }
        break;
      }
      case 'customRangeComponent': {
        if (val?.min || val?.max) {
          enable = false;
        }
        break;
      }
      default:
        break;
    }
    let ids = disabledIds;
    ids = ids.filter((i) => i !== input.id);
    if (enable) {
      ids = ids.filter((i) => i !== disableId);
      setDisabledIds(ids);
    } else {
      if (!ids.includes(disableId)) {
        ids.push(disableId);
        setDisabledIds(ids);
      }
    }
  };

  const isDefaultValueEmpty = (val: any) => {
    if (val == null) return true;

    if (Array.isArray(val)) return val.length === 0;

    if (typeof val === 'object') return Object.keys(val).length === 0;

    return !val;
  };

  const sanitizeExtraFilters = (config: any) => {
    return config.map((i) => {
      const hasDefault =
        (i.defaultValue && !isDefaultValueEmpty(i.defaultValue)) ||
        (i.defaultValues && !isDefaultValueEmpty(i.defaultValues));

      // Only update if extraFilter & hidden are TRUE and default is NOT empty
      if (i.extraFilter && i.hidden && hasDefault) {
        return {
          ...i,
          extraFilter: false,
          hidden: false,
          addedFilter: true,
        };
      }

      return i;
    });
  };

  useEffect(() => {
    if (config?.length) {
      const sanitizedConfig = sanitizeExtraFilters(config);

      // Store sanitized version
      setUpdatedConfig(sanitizedConfig);
      const extraFilters = sanitizedConfig
        ?.filter((i) => i.extraFilter)
        ?.map((i) => {
          return { ...i, addedFilter: true };
        });

      if (!isDefaultSet && extraFilters.length) {
        if (!extraFilters.filter((i) => i.hidden).length) {
          setCanAddFilter(false);
        }
      } else {
        if (addFilter && extraFilters.filter((i) => i.hidden).length) {
          setCanAddFilter(true);
        }
      }

      setExtraUpdatedConfig(extraFilters);
      updateDefaultValues(sanitizedConfig);

      if (!isDefaultSet) {
        setIsDefaultSet(true);
        updateDefaultValues(sanitizedConfig);

        // Force check multiline after config is set with a slight delay
        setTimeout(() => {
          if (filtersContainerRef.current) {
            handleCheckMultiline(false, false);
          }
        }, 100);
      }
    }
  }, [config]);

  const updateDefaultValues = (config) => {
    if (config?.length) {
      let filter: Record<string, any> = {};
      if (query?.length) {
        if (multiAttributeSearch && searchAttributes.length > 0) {
          filter.search = {
            search: query,
            searchAttribute: searchAttributes[0].id,
          };
        } else {
          filter = { search: query };
        }
      }
      config?.forEach((input) => {
        if (input.defaultValues) {
          filter[input.id] = input.defaultValues;
        }
        if (input.defaultValue) {
          filter[input.id] = input.defaultValue;
        }
      });
      setFilterValue(filter);
      updateResetButton(filter);
    }
  };

  const setAllExtraFiltersHidden = () => {
    const updatedFilterConfig = extraUpdatedConfig.map((item) => {
      if (item.extraFilter) {
        return {
          ...item,
          hidden: true,
        };
      }
      return item;
    });
    setExtraUpdatedConfig(updatedFilterConfig);
    // if (addFilter) {
    // 	setCanAddFilter(true);
    // }
  };

  function filterObjectByKeys(sourceObject: any, allowedKeys: any) {
    const result = {};

    for (const key of allowedKeys) {
      if (key in sourceObject) {
        result[key] = sourceObject[key];
      }
    }

    return result;
  }

  const clearFilter = () => {
    const disabledIds = config
      ?.filter((item: any) => item.disabled === true)
      ?.map((i: any) => i.id);

    let filterVal = {};
    if (disabledIds?.length > 0) {
      filterVal = filterObjectByKeys(filterValue, disabledIds);
    }

    setDisabledIds([]);

    clearingData.current = true;

    setFilterValue(filterVal);
    setClearBit(clearBit + 1);
    // setAllExtraFiltersHidden();
    setShowMore(false);
    setQuery('');
    setIsResetEnabled(false);
    if (multiAttributeSearch && searchAttributes.length > 0) {
      setSelectedSearchAttribute(searchAttributes[0]);
    }
    if (onFilterChange) onFilterChange(filterVal);
    handleCheckMultiline(true, true);

    if (onFilterReset) onFilterReset();
    setTimeout(() => {
      if (searchInputRef?.current) {
        searchInputRef.current?.focus();
      }
    }, 100);
  };

  const showInputConfig = (input) => {
    const id = input.id;
    const _updatedConfig = [...updatedConfig];
    const updatedFilterConfig = extraUpdatedConfig.map((item) => {
      if (item.id === id) {
        _updatedConfig.push({
          ...item,
          hidden: false,
        });
        return {
          ...item,
          hidden: false,
        };
      }
      return item;
    });

    // Mark as filter change to preserve showAllFilters state
    isFilterChangeRef.current = true;

    setUpdatedConfig(_updatedConfig);
    setExtraUpdatedConfig(updatedFilterConfig);
    setShowMore(true);
    setShowAllFilters(true);

    if (!updatedFilterConfig.filter((i) => i.hidden).length) {
      setCanAddFilter(false);
    }

    // Reset flag after state updates
    setTimeout(() => {
      isFilterChangeRef.current = false;
    }, 100);
  };

  const hideFilter = (input) => {
    // Mark as filter change to preserve showAllFilters state
    isFilterChangeRef.current = true;

    // Use functional updates to ensure we're working with the latest state
    setUpdatedConfig((prevConfig) => {
      return prevConfig.filter((item) => item.id !== input.id);
    });

    const _extraUpdatedConfig = [...extraUpdatedConfig];

    const _mappedExtraConfig = _extraUpdatedConfig.map((item) => {
      if (item.addedFilter && input.id === item.id) {
        return {
          ...item,
          hidden: true,
        };
      }
      return item;
    });

    const idsInMap = _mappedExtraConfig.map((i) => i.id);

    if (!idsInMap.includes(input.id)) {
      input.hidden = true;
      input.extraFilter = true;

      if (input.defaultValue) {
        input.defaultValue = {};
      } else if (input.defaultValues) {
        input.defaultValues = [];
      }

      _mappedExtraConfig.push(input);
    }

    setExtraUpdatedConfig(_mappedExtraConfig);

    // Clear the filter value for the hidden filter
    setFilterValue((prevState) => {
      const newState = { ...prevState };
      delete newState[input.id];
      updateResetButton(newState);
      return newState;
    });

    // Check if we should re-enable the "Add Filter" button
    setCanAddFilter((prevCanAdd) => {
      if (addFilter) {
        return true;
      }
      return prevCanAdd;
    });

    // Reset flag after state updates
    setTimeout(() => {
      isFilterChangeRef.current = false;
    }, 100);
  };

  const getFilterInputs = (config: any[], isExtra: boolean = false) => {
    return (
      <>
        {config.map((input, index) => {
          return (
            <React.Fragment key={input.id + '_' + index}>
              <div key={input.id} id={input.id} className={`${input.hidden ? 'hidden' : ''}`}>
                {input.type === 'treeDropdown' && (
                  <TreeDropdown
                    options={input.options}
                    defaultSelections={input?.defaultValues ?? []}
                    onChange={(e, parentReset) => onChangeMethod(input, e, parentReset)}
                    parentLabel={input.parentLabel}
                    dropIcon={input.icon}
                    label={input.label}
                    width={input.width ?? null}
                    seachPlaceholder={input.placeholder}
                    dropdownClass={input.dropdownClass ?? ''}
                    clearBit={input?.disabled ? 0 : clearBit}
                    clearList={disabledIds}
                    extraFilter={input.extraFilter}
                    hideFilter={() => hideFilter(input)}
                    hidden={input.hidden}
                    addedFilter={input?.addedFilter}
                    isDarkTheme={isDarkTheme}
                    id={input.id ? input.id : `treeDropdown_${index}_filter`}
                  />
                )}
                {input.type === 'dateRange' && (
                  <DateRangePicker
                    onChange={(e, parentReset) => onChangeMethod(input, e, parentReset)}
                    defaultValues={input.defaultValues ?? null}
                    placeholderText={input.placeholder}
                    topLabel={input.label}
                    minDate={input.minDate ?? null}
                    maxDate={input.maxDate ?? null}
                    startLabel={input.startLabel ?? null}
                    endLabel={input.endLabel ?? null}
                    dropIcon={input.icon}
                    dropdownClass={input.class ?? ''}
                    showSelected={input.showSelected}
                    clearBit={input?.disabled ? 0 : clearBit}
                    clearList={disabledIds}
                    extraFilter={input.extraFilter}
                    hideFilter={() => hideFilter(input)}
                    hidden={input.hidden}
                    addedFilter={input?.addedFilter}
                    buttonElement={input.buttonElement ?? null}
                    isDarkTheme={isDarkTheme}
                    id={input.id ? input.id : `dateRange_${index}_filter`}
                  />
                )}
                {input.type === 'datePicker' && (
                  <CustomDatePicker
                    datePickerWrapperClass={input.datePickerWrapperClass ?? ''}
                    required={input.required}
                    defaultValue={input.defaultValues}
                    topLabel={input.label}
                    placeholderText={input.placeholder}
                    minDate={input.minDate ?? null}
                    maxDate={input.maxDate ?? null}
                    onChange={(e, parentReset) => onChangeMethod(input, e, parentReset)}
                    dropIcon={input.icon}
                    dropdownClass={input.class ?? ''}
                    clearBit={input?.disabled ? 0 : clearBit}
                    extraFilter={input.extraFilter}
                    hideFilter={() => hideFilter(input)}
                    clearList={disabledIds}
                    hidden={input.hidden}
                    addedFilter={input?.addedFilter}
                    portal={input?.portal ?? false}
                    isDarkTheme={isDarkTheme}
                    isPlainTheme={isPlainTheme}
                    id={input.id ? input.id : `datePicker_${index}_filter`}
                  />
                )}
                {input.type === 'customDateRangePicker' && (
                  <CustomDateRangePicker
                    id={input?.id}
                    options={input?.options}
                    defaultValue={input?.defaultValue ?? null}
                    minDate={input?.minDate ?? null}
                    maxDate={input?.maxDate ?? null}
                    label={input?.label}
                    icon={input?.icon}
                    placeholder={input?.placeholder ?? null}
                    disabled={input?.disabled ?? false}
                    clearList={disabledIds}
                    clearBit={input?.disabled ? 0 : clearBit}
                    className={input?.className ?? ''}
                    extraFilter={input.extraFilter}
                    hideFilter={() => hideFilter(input)}
                    hidden={input.hidden}
                    addedFilter={input?.addedFilter}
                    onChange={(e, parentReset) => onChangeMethod(input, e, parentReset)}
                    iconClassName={input?.iconClassName ?? ''}
                    selectedIconClassName={input?.selectedIconClassName ?? ''}
                    labelClassName={input?.labelClassName ?? ''}
                    optionClassName={input?.optionClassName ?? ''}
                    closeButtonClassName={input?.closeButtonClassName ?? ''}
                    dateInputClassName={input?.dateInputClassName ?? ''}
                    tabButtonClassName={input?.tabButtonClassName ?? ''}
                    isDarkTheme={isDarkTheme}
                  />
                )}
                {input.type === 'dropdown' && (
                  <FilterSelect
                    onChange={(e, parentReset) => onChangeMethod(input, e, parentReset)}
                    label={input.label}
                    options={input.options}
                    isChip={input.isChip}
                    name={input.name ?? input.label}
                    multiple={input.multiple}
                    id={input.id}
                    rules={input.rules ?? null}
                    disabled={input.disabled}
                    placeholder={input.placeholder}
                    dropIcon={input.icon}
                    clearList={disabledIds}
                    searchable={input.searchable}
                    selectAllRequired={input.selectAllRequired}
                    defaultValues={input.multiple ? input.defaultValues : null}
                    defaultValue={!input.multiple ? input.defaultValue : null}
                    clearBit={input?.disabled ? 0 : clearBit}
                    openPanel={openPanel}
                    extraFilter={input.extraFilter}
                    hideFilter={() => hideFilter(input)}
                    hidden={input.hidden}
                    buttonElement={input.buttonElement ?? null}
                    optionRenderer={input.optionRenderer ?? null}
                    closeButtonReq={input.closeButtonReq === false ? false : true}
                    addedFilter={input?.addedFilter}
                    clearButtonReq={input.closeButtonReq === false ? false : true}
                    detachedBox={input.detachedBox ?? false}
                    hideLabelOnSelect={input.hideLabelOnSelect ?? false}
                    isDarkTheme={isDarkTheme}
                  />
                )}
                {input.type === 'infiniteDropdown' && (
                  <>
                    {(!input.dependency ||
                      (input.dependency &&
                        filterValue[input.dependency] &&
                        (!Array.isArray(filterValue[input.dependency]) ||
                          (Array.isArray(filterValue[input.dependency]) &&
                            filterValue[input.dependency].length > 0)))) && (
                      <QueryClientProvider client={queryClient}>
                        <ServerSelect
                          fetchDataOnScroll={input.callback}
                          defaultValues={input.multiple ? input.defaultValues : null}
                          defaultValue={!input.multiple ? input.defaultValue : null}
                          onChange={(e) => onChangeMethod(input, e)}
                          disabled={input.disabled}
                          placeholder={input.placeholder}
                          label={input.label}
                          isChip={input.isChip}
                          name={input.name ?? input.label}
                          dropIcon={input.icon}
                          searchable={input.searchable}
                          clearBit={input?.disabled ? 0 : clearBit}
                          clearList={disabledIds}
                          queryKey={[input.label]}
                          multiple={input.multiple}
                          id={input.id}
                          extraFilter={input.extraFilter}
                          hideFilter={() => hideFilter(input)}
                          hidden={input.hidden}
                          optionRenderer={input.optionRenderer ?? null}
                          closeButtonReq={input.closeButtonReq === false ? false : true}
                          clearButtonReq={input.closeButtonReq === false ? false : true}
                          detachedBox={input.detachedBox ?? false}
                          hideLabelOnSelect={input.hideLabelOnSelect ?? false}
                          addedFilter={input?.addedFilter}
                          canInitialFetch={input?.canInitialFetch ?? false}
                          isDarkTheme={isDarkTheme}
                        />
                      </QueryClientProvider>
                    )}
                  </>
                )}
                {input.type === 'infiniteDynamicDropdown' && (
                  <>
                    <QueryClientProvider client={queryClient}>
                      <DynamicTreeDropdown
                        specificSearchToolTipText={input?.specificSearchToolTipText ?? ''}
                        fetchDataOnScroll={input.callback}
                        defaultValues={input.defaultValues}
                        clearBit={input?.disabled ? 0 : clearBit}
                        onChange={(e, parentReset) => onChangeMethod(input, e, parentReset)}
                        disabled={input.disabled}
                        placeholder={input.placeholder}
                        label={input.label}
                        name={input.name ?? input.label}
                        dropIcon={input.icon}
                        searchable={input.searchable}
                        queryKey={[input.label]}
                        clearList={disabledIds}
                        id={input.id}
                        selectParentOnChildSelect={input.selectParentOnChildSelect ?? false}
                        maxHeightForMenuItems={input.maxHeightForMenuItems}
                        detachedBox={input.detachedBox ?? false}
                        optionRenderer={input.optionRenderer ?? null}
                        closeButtonReq={input.closeButtonReq === false ? false : true}
                        clearButtonReq={input.closeButtonReq === false ? false : true}
                        multiple={input.multiple}
                        disableChildIfParentIsChecked={input.disableChildIfParentIsChecked}
                        canInitialFetch={input?.canInitialFetch ?? false}
                        addedFilter={input?.addedFilter}
                        extraFilter={input?.extraFilter}
                        hideFilter={() => hideFilter(input)}
                        isDarkTheme={isDarkTheme}
                      />
                    </QueryClientProvider>
                  </>
                )}
                {input.type === 'radixInfiniteDropdown' && (
                  <>
                    {(!input.dependency ||
                      (input.dependency &&
                        filterValue[input.dependency] &&
                        (!Array.isArray(filterValue[input.dependency]) ||
                          (Array.isArray(filterValue[input.dependency]) &&
                            filterValue[input.dependency].length > 0)))) && (
                      <QueryClientProvider client={queryClient}>
                        <RadixInfiniteDropDown
                          id={input.id}
                          queryKey={[input.label]}
                          fetchDataOnScroll={input.callback}
                          defaultValues={input.defaultValues ?? []}
                          onChange={(e, parentReset) => onChangeMethod(input, e, parentReset)}
                          disabled={input.disabled}
                          placeholder={input.placeholder}
                          label={input.label}
                          multiple={input.multiple}
                          searchable={input.searchable}
                          clearBit={input?.disabled ? 0 : clearBit}
                          clearList={disabledIds}
                          dropIcon={input.icon}
                          specificSearchToolTipText={input?.specificSearchToolTipText ?? ''}
                          maxHeightForMenuItems={input.maxHeightForMenuItems}
                          detachedBox={input.detachedBox ?? false}
                          closeButtonReq={input.closeButtonReq === false ? false : true}
                          clearButtonReq={input.closeButtonReq === false ? false : true}
                          disableChildIfParentIsChecked={input.disableChildIfParentIsChecked}
                          canInitialFetch={input?.canInitialFetch ?? false}
                          addedFilter={input?.addedFilter}
                          extraFilter={input?.extraFilter}
                          hideFilter={() => hideFilter(input)}
                          showSelectedItems={input?.showSelectedItems ?? false}
                          renderSelectedItemsInTreeStructure={
                            input?.renderSelectedItemsInTreeStructure ?? false
                          }
                          variant="pill"
                          hideLabel={input?.hideLabel}
                          width={input?.width}
                        />
                      </QueryClientProvider>
                    )}
                  </>
                )}
                {input.type === 'customRangeComponent' && (
                  <>
                    <CustomRangeComponent
                      id={input?.id}
                      label={input?.label}
                      defaultMin={input?.defaultValues?.min ?? ''}
                      defaultMax={input?.defaultValues?.max ?? ''}
                      placeholder={input?.placeholder ?? ''}
                      onChange={(e, parentReset) => onChangeMethod(input, e, parentReset)}
                      dropIcon={input?.icon}
                      disabled={input?.disabled ?? false}
                      clearBit={input?.disabled ? 0 : clearBit}
                      clearList={disabledIds}
                      extraFilter={input?.extraFilter}
                      addedFilter={input?.addedFilter}
                      hideFilter={() => hideFilter(input)}
                      isDarkTheme={isDarkTheme}
                    />
                  </>
                )}
                {input?.type === 'radixSliderFilter' && (
                  <RadixSliderFilter
                    label={input?.label}
                    id={input?.id}
                    min={input?.min}
                    max={input?.max}
                    step={input?.step}
                    dropIcon={input?.icon}
                    onChange={(value) => onChangeMethod(input, value)}
                    hideLabel={input?.hideLabel}
                    clearBit={input?.disabled ? 0 : clearBit}
                    extraFilter={input?.extraFilter}
                    hideFilter={() => hideFilter(input)}
                    hidden={input.hidden}
                    addedFilter={input?.addedFilter}
                  />
                )}
                {input?.type === 'radixDropdownSingleSelect' && (
                  <RadixDropDown
                    label={input?.label}
                    id={input?.id}
                    options={input?.options}
                    onChange={(value) => onChangeMethod(input, value)}
                    clearBit={input?.disabled ? 0 : clearBit}
                    extraFilter={input?.extraFilter}
                    hideFilter={() => hideFilter(input)}
                    hidden={input.hidden}
                    addedFilter={input?.addedFilter}
                    dropIcon={input?.icon}
                    hideLabel={input?.hideLabel}
                    defaultValue={input?.defaultValue ?? null}
                    multiple={false}
                    width={input?.width}
                    searchable={input?.searchable ?? false}
                    searchPlaceholder={input?.searchPlaceholder ?? 'Search options...'}
                  />
                )}
                {input?.type === 'radixDropdownMultiSelect' && (
                  <RadixDropDown
                    label={input?.label}
                    id={input?.id}
                    options={input?.options}
                    onChange={(value) => onChangeMethod(input, value)}
                    clearBit={input?.disabled ? 0 : clearBit}
                    extraFilter={input?.extraFilter}
                    hideFilter={() => hideFilter(input)}
                    hidden={input.hidden}
                    addedFilter={input?.addedFilter}
                    dropIcon={input?.icon}
                    hideLabel={input?.hideLabel}
                    defaultValue={input?.defaultValue ?? null}
                    multiple={true}
                    width={input?.width}
                    searchable={input?.searchable ?? false}
                    searchPlaceholder={input?.searchPlaceholder ?? 'Search options...'}
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </>
    );
  };
  const renderSearchTooltip = (forMultiAttributeSearch: boolean = false) => {
    if (forMultiAttributeSearch) {
      if (specificSearchToolTipText?.length > 0) {
        return `${specificSearchToolTipText}`;
      }
      if (selectedSearchAttribute?.id?.trim() === 'DisplayId') {
        return `Type the full ${selectedSearchAttribute?.label} to search`;
      }
    } else if (specificSearchToolTipText?.length > 0) {
      return `${specificSearchToolTipText}`;
    }

    return 'Type at least 3 characters to search';
  };
  const hiddenCount = extraUpdatedConfig?.filter((i) => i.hidden).length || 0;

  const allFalseCase = !showAllFilters && !addFilter && hiddenCount === 0;

  const shouldAddMargin = !canAddFilter
    ? allFalseCase
      ? false
      : showAllFilters || !addFilter || (addFilter && hiddenCount === 0)
    : addFilter && hiddenCount === 0;

  return (
    <div
      suppressHydrationWarning={true}
      className={`${extraUpdatedConfig.filter((i) => !i.hidden).length > 0 ? 'pl-2' : 'px-2'} ${classWrapper}`}
    >
      <div className={`flex justify-between gap-2 ${addFilter ? 'items-start' : 'items-center'} `}>
        <div className="flex justify-start gap-1">
          <div
            role="region"
            aria-label="filters"
            ref={filtersContainerRef}
            className={`flex flex-wrap gap-2 transition-all duration-300 ease-in-out`}
          >
            {searchable && (
              <div className="flex">
                {multiAttributeSearch && searchAttributes.length > 0 ? (
                  <div
                    className="relative flex min-h-[34px] items-center rounded border border-[#888888] py-0"
                    style={{ width: searchWidth + 'px' }}
                  >
                    <SearchDropDown
                      options={searchAttributes as SearchDropDownOption[]}
                      value={selectedSearchAttribute?.id || ''}
                      onChange={(selected) => {
                        setSelectedSearchAttribute(selected);
                        if (query && query.trim().length >= 3) {
                          const searchData = {
                            search: query,
                            searchAttribute: selected?.id,
                          };
                          updateFilterValue('search', searchData);
                        }
                      }}
                      className="min-w-[100px] bg-transparent py-0 text-sm text-gray-900 focus:outline-none"
                      testid="search_attribute_select"
                    />

                    <div className="mx-2 h-5 w-px bg-gray-300" />

                    <input
                      type="text"
                      id={searchInputId || 'search-field'}
                      testid="search-field"
                      onChange={(e) => {
                        setQuery(e.target.value);
                        handleSearchChange(e.target.value);
                      }}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setSearchFocused(false);
                      }}
                      value={query}
                      disabled={disableSearch}
                      placeholder={
                        multiAttributeSearch && selectedSearchAttribute
                          ? `Search by ${selectedSearchAttribute.label}`
                          : 'Search'
                      }
                      aria-label={`Search by ${selectedSearchAttribute?.label}`}
                      aria-describedby="filter-form-search-input-tooltip"
                      ref={searchInputRef}
                      className="border-0 bg-transparent p-0 text-sm outline-none placeholder:text-[#5D5D5D] focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                      style={{ outline: 'none' }}
                      autoComplete="off"
                      name="search"
                    />

                    {searchFocused && query.length < 3 && (
                      <div
                        id="filter-form-search-input-tooltip"
                        role="tooltip"
                        className="text-default bg-card absolute top-[36px] left-0 z-50 w-[200px] rounded px-3 py-1 text-sm shadow-lg"
                      >
                        {renderSearchTooltip(true)}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        setQuery('');
                        handleSearchChange('');
                        e.stopPropagation();
                        searchInputRef?.current?.focus();
                      }}
                      className="focus-indicator ml-2 flex w-6 justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label="Clear search"
                      style={{ visibility: query !== '' ? 'visible' : 'hidden' }}
                    >
                      <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                    </button>

                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="mx-2 h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      style={{ left: '7px' }}
                      className={`absolute mr-2 h-4 w-4`}
                    />
                    <input
                      onChange={(e) => {
                        setQuery(e.target.value);
                        handleSearchChange(e.target.value);
                      }}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      onKeyDown={(e) => {
                        if (e?.key === 'Escape') {
                          setSearchFocused(false);
                        }
                      }}
                      aria-describedby="filter-form-search-input-tooltip"
                      ref={searchInputRef}
                      autoComplete="off"
                      value={query}
                      id={searchInputId || 'search-field'}
                      disabled={disableSearch}
                      testid="search-field"
                      className={twMerge(
                        'block h-full min-h-[28px] w-[250px] border-1 py-0 pr-0 pl-8 text-gray-900 placeholder:text-[#5D5D5D] focus-visible:ring-0 sm:text-sm',
                        searchInputClassName
                      )}
                      placeholder={searchPlaceholder}
                      aria-label={searchPlaceholder}
                      style={{ borderRadius: isDarkTheme ? '1rem' : '0.25rem' }}
                      name="search"
                    />

                    {searchFocused && query.length < 3 && (
                      <div
                        id="filter-form-search-input-tooltip"
                        role="tooltip"
                        className="text-default bg-card absolute top-[36px] left-0 z-50 w-[200px] rounded px-3 py-1 text-sm shadow-lg"
                      >
                        {renderSearchTooltip()}
                      </div>
                    )}

                    {query !== '' && (
                      <div className="bg-card absolute right-[1px] flex h-[90%] w-[24px] items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            setQuery('');
                            handleSearchChange('');
                            e.stopPropagation();
                            searchInputRef?.current?.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setQuery('');
                              e.stopPropagation();
                              searchInputRef?.current?.focus();
                            }
                          }}
                          className="focus:bg-default focus-indicator hover:text-default flex h-4 w-4 items-center justify-center rounded-full border border-black text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-300"
                          aria-label="clear search"
                        >
                          <FontAwesomeIcon icon={faXmark} className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {getFilterInputs(updatedConfig, false)}
          </div>
          <div className={`flex items-center gap-1 ${shouldAddMargin ? 'mt-2' : ''}`}>
            {addFilter && (
              <button
                className={twMerge(
                  `text-primary w-[60px] p-0 text-xs font-semibold ${hiddenFiltersCount > 0 && !showAllFilters ? 'opacity-100' : 'opacity-0'} `,
                  moreFiltersButtonClassName ?? ''
                )}
                onClick={() => {
                  if (hiddenFiltersCount > 0 && !showAllFilters) {
                    const newShowAllFilters = !showAllFilters;
                    setShowAllFilters(newShowAllFilters);
                    // Pass false as first param to indicate user action
                    handleCheckMultiline(false, newShowAllFilters, true);
                  }
                }}
              >
                {hiddenFiltersCount > 0 && !showAllFilters && `+${hiddenFiltersCount} more `}
              </button>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-1 ${shouldAddMargin ? 'mt-1' : ''}`}>
          {addFilter && extraUpdatedConfig.filter((i) => i.hidden)?.length > 0 && (
            <Popover className={`relative ${canAddFilter ? '' : 'hidden'}`}>
              <div className="flex items-center">
                <PopoverButton
                  id="addFilters"
                  // className="focus-indicator flex h-[34px] items-center whitespace-nowrap border-[1px] border-primary px-2 py-0 text-[.8rem] font-semibold text-primary"
                  className={twMerge(
                    'focus-indicator flex h-[34px] items-center border-[1px] px-2 py-0 text-[.8rem] font-semibold whitespace-nowrap',
                    addFilterButtonClassName,
                    isDarkTheme ? 'border-[#39393c] text-[#39393c]' : 'border-primary text-primary'
                  )}
                  style={{ borderRadius: isDarkTheme ? '1rem' : '0.25rem' }}
                >
                  {showFilterIcon ? (
                    <FontAwesomeIcon icon={faFilter} className={`h-4 w-4`} />
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={addIcon || faCirclePlus}
                        className={`mr-2 h-4 w-4 text-[#fffff]`}
                      />
                      <span>Add Filter</span>
                    </>
                  )}
                </PopoverButton>
              </div>

              <PopoverPanel
                style={{ right: '-70px' }}
                className="bg-card absolute top-[30px] z-50 overflow-y-auto rounded border p-2 shadow-md"
              >
                {extraUpdatedConfig
                  .filter((i) => i.hidden)
                  .map((input) => (
                    <CloseButton
                      tabIndex={0}
                      key={input.id}
                      className="hover:bg-hover flex w-full items-center rounded-sm py-1 pr-4 pl-2 text-[.8rem] whitespace-nowrap"
                      onClick={() => showInputConfig(input)}
                    >
                      <FontAwesomeIcon icon={input.icon} className="mr-2 h-4 w-4" />
                      <span>{input.label}</span>
                    </CloseButton>
                  ))}
              </PopoverPanel>
            </Popover>
          )}

          {showResetButton && (
            <Tooltip
              triggerElement={() => (
                <button
                  onClick={() => clearFilter()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      clearFilter();
                    }
                  }}
                  id="reset_filter"
                  disabled={!isResetEnabled}
                  className={twMerge(
                    'flex items-center text-[.8rem] font-semibold',
                    resetButtonClassName,
                    isDarkTheme ? 'text-[#39393c]' : 'link-text'
                  )}
                >
                  <FontAwesomeIcon icon={faRotateRight} className={`mr-2 h-4 w-4`} />
                  {/* <span className="hover:underline">Reset</span> */}
                </button>
              )}
              ariaLabel="Reset Filters"
              tooltip={() => <div className="p-2 text-xs">Reset Filters</div>}
            />
          )}
          {showFilterExpanderButton && (
            <button
              onClick={() => {
                const newShowAllFilters = !showAllFilters;
                setShowAllFilters(newShowAllFilters);
                // Pass false as first param to indicate user action
                handleCheckMultiline(false, newShowAllFilters, true);
              }}
              aria-label={`show ${showAllFilters ? 'less' : 'more'} filters`}
              className={twMerge(
                'focus-indicator mr-2 flex items-center gap-1',
                isMultiline ? 'visible' : 'invisible',
                showMoreFiltersButtonClassName ?? '',
                isDarkTheme ? 'text-[#39393c]' : 'text-primary'
              )}
              id="show_more_filters"
              aria-expanded={showAllFilters}
            >
              <FontAwesomeIcon
                icon={showAllFilters ? faChevronUp : faChevronDown}
                className="h-4 w-4"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterForm;
