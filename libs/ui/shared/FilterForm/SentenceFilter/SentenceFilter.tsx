'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faSpinner } from '@fortawesome/pro-light-svg-icons';

// Import existing filter components
import TreeDropdown from '../TreeDropdown/TreeDropdown';
import CustomDatePicker from '../DatePicker/CustomDatePicker';
import FilterSelect from '../FilterSelect/FilterSelect';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { ServerSelect } from '../ServerSelect';
import DynamicTreeDropdown from '../../../components/common/Form/components/DynamicTreeDropdown/DynamicTreeDropdown';

const queryClient = new QueryClient();

export interface SentenceFilterConfig {
  id: string;
  type:
    | 'treeDropdown'
    | 'dropdown'
    | 'infiniteDropdown'
    | 'infiniteDynamicDropdown'
    | 'dateRange'
    | 'datePicker'
    | 'text';
  label: string;
  placeholder?: string;
  options?: any[];
  defaultValue?: any;
  defaultValues?: any[];
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  required?: boolean;
  dependency?: string;
  dataProvider?: (dependencyValue?: any) => Promise<any[]> | any[];
  width?: string;
  icon?: any;
  callback?: any;
  canInitialFetch?: boolean;
  minDate?: Date;
  maxDate?: Date;
  startLabel?: string;
  endLabel?: string;
  buttonElement?: React.ReactElement;
  optionRenderer?: any;
  closeButtonReq?: boolean;
  clearButtonReq?: boolean;
  detachedBox?: boolean;
  hideLabelOnSelect?: boolean;
  disableChildIfParentIsChecked?: boolean;
  maxHeightForMenuItems?: string;
  isChip?: boolean;
  selectAllRequired?: boolean;
  rules?: any;
  showSelected?: boolean;
  class?: string;
  dropdownClass?: string;
  datePickerWrapperClass?: string;
}

export interface SentenceFilterProps {
  config: SentenceFilterConfig[];
  onFilterChange: (values: Record<string, any>) => void;
  onFilterReset?: () => void;
  sessionKey?: string;
  className?: string;
  resetLabel?: string;
  sentence?: string;
  loadingStates?: Record<string, boolean>;
}

const SentenceFilter: React.FC<SentenceFilterProps> = ({
  config,
  onFilterChange,
  onFilterReset,
  sessionKey = 'sentenceFilter',
  className = '',
  resetLabel = 'Reset Filters',
  sentence,
  loadingStates = {},
}) => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [clearBit, setClearBit] = useState<number>(0);
  const [isResetEnabled, setIsResetEnabled] = useState<boolean>(false);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});
  const [loadingFilters, setLoadingFilters] = useState<Record<string, boolean>>({});

  // Use a ref to prevent onFilterChange from causing re-renders
  const stableOnFilterChange = useRef(onFilterChange);
  const dependencyCache = useRef<Record<string, { value: any; options: any[] }>>({});

  // Update the stable reference when onFilterChange changes
  useEffect(() => {
    stableOnFilterChange.current = onFilterChange;
  }, [onFilterChange]);

  // Initialize from session storage only once
  useEffect(() => {
    const initializeFilters = () => {
      const savedFilters = sessionStorage.getItem(sessionKey);
      let initialValues: Record<string, any> = {};

      if (savedFilters) {
        try {
          initialValues = JSON.parse(savedFilters);
        } catch (error) {
          console.error('Error parsing saved filters:', error);
        }
      }

      // Add default values
      config.forEach((filter) => {
        if (filter.defaultValue !== undefined && !initialValues[filter.id]) {
          initialValues[filter.id] = filter.defaultValue;
        } else if (filter.defaultValues !== undefined && !initialValues[filter.id]) {
          initialValues[filter.id] = filter.defaultValues;
        }
      });

      if (Object.keys(initialValues).length > 0) {
        setFilterValues(initialValues);
        updateResetButton(initialValues);
      }
    };

    initializeFilters();
  }, []); // Only run once on mount

  // Handle dependency loading with caching
  useEffect(() => {
    const loadDependentData = async () => {
      const loadPromises: Promise<void>[] = [];

      config.forEach((filter) => {
        if (filter.dependency && filter.dataProvider) {
          const dependencyValue = filterValues[filter.dependency];

          if (dependencyValue && (!Array.isArray(dependencyValue) || dependencyValue.length > 0)) {
            // Check cache first
            const cacheKey = `${filter.id}_${JSON.stringify(dependencyValue)}`;
            const cached = dependencyCache.current[cacheKey];

            if (cached && JSON.stringify(cached.value) === JSON.stringify(dependencyValue)) {
              // Use cached data
              setDynamicOptions((prev) => ({
                ...prev,
                [filter.id]: cached.options,
              }));
              return;
            }

            // Load new data
            const loadPromise = (async () => {
              setLoadingFilters((prev) => ({ ...prev, [filter.id]: true }));

              try {
                const data = await filter.dataProvider!(dependencyValue);
                const options = data || [];

                // Cache the result
                dependencyCache.current[cacheKey] = {
                  value: dependencyValue,
                  options,
                };

                setDynamicOptions((prev) => ({
                  ...prev,
                  [filter.id]: options,
                }));
              } catch (error) {
                console.error(`Error loading data for filter ${filter.id}:`, error);
                setDynamicOptions((prev) => ({
                  ...prev,
                  [filter.id]: [],
                }));
              } finally {
                setLoadingFilters((prev) => ({ ...prev, [filter.id]: false }));
              }
            })();

            loadPromises.push(loadPromise);
          } else {
            // Clear dynamic options when dependency is not met
            setDynamicOptions((prev) => {
              const newOptions = { ...prev };
              delete newOptions[filter.id];
              return newOptions;
            });
          }
        }
      });

      await Promise.all(loadPromises);
    };

    // Use setTimeout to prevent immediate re-renders
    const timeoutId = setTimeout(loadDependentData, 50);
    return () => clearTimeout(timeoutId);
  }, [filterValues, config]);

  // Save to session storage and notify parent (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(filterValues).length > 0) {
        sessionStorage.setItem(sessionKey, JSON.stringify(filterValues));
        stableOnFilterChange.current(filterValues);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [filterValues, sessionKey]);

  const updateFilterValue = useCallback(
    (id: string, value: any) => {
      setFilterValues((prevState) => {
        const newState = { ...prevState };

        if (
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'string' && value === '')
        ) {
          delete newState[id];
        } else {
          newState[id] = value;
        }

        // Clear dependent filters when dependency changes
        config.forEach((filter) => {
          if (filter.dependency === id) {
            delete newState[filter.id];
            // Clear from cache too
            Object.keys(dependencyCache.current).forEach((cacheKey) => {
              if (cacheKey.startsWith(`${filter.id}_`)) {
                delete dependencyCache.current[cacheKey];
              }
            });
          }
        });

        updateResetButton(newState);
        return newState;
      });
    },
    [config]
  );

  const updateResetButton = useCallback((values: Record<string, any>) => {
    const hasValues = Object.values(values).some((value) => {
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (value instanceof Date) return true;
      if (typeof value === 'string') return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    });
    setIsResetEnabled(hasValues);
  }, []);

  const handleReset = useCallback(() => {
    setFilterValues({});
    setClearBit((prev) => prev + 1);
    setIsResetEnabled(false);
    setDynamicOptions({});
    dependencyCache.current = {};
    sessionStorage.removeItem(sessionKey);
    if (onFilterReset) {
      onFilterReset();
    }
  }, [sessionKey, onFilterReset]);

  // Memoize the final configs with dynamic options
  const finalConfigs = useMemo(() => {
    return config.map((filter) => ({
      ...filter,
      options: dynamicOptions[filter.id] || filter.options || [],
    }));
  }, [config, dynamicOptions]);

  const renderFilter = useCallback(
    (filter: SentenceFilterConfig) => {
      const isLoading = loadingFilters[filter.id] || loadingStates[filter.id] || false;

      // Check if filter should be visible based on dependency
      const isVisible =
        !filter.dependency ||
        (filterValues[filter.dependency] !== undefined &&
          filterValues[filter.dependency] !== null &&
          filterValues[filter.dependency] !== '' &&
          (!Array.isArray(filterValues[filter.dependency]) ||
            filterValues[filter.dependency].length > 0) &&
          (typeof filterValues[filter.dependency] !== 'object' ||
            filterValues[filter.dependency].value !== undefined ||
            Object.keys(filterValues[filter.dependency]).length > 0));

      if (!isVisible) {
        return null;
      }

      if (isLoading) {
        return (
          <span key={filter.id} className="inline-flex items-center rounded bg-gray-100 px-2 py-1">
            <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </span>
        );
      }

      const commonProps = {
        key: filter.id,
        disabled: filter.disabled,
        clearBit: clearBit,
      };

      switch (filter.type) {
        case 'treeDropdown':
          return (
            <TreeDropdown
              {...commonProps}
              options={filter.options || []}
              defaultSelections={filterValues[filter.id] || filter.defaultValues || []}
              onChange={(value) => updateFilterValue(filter.id, value)}
              parentLabel={filter.label}
              dropIcon={filter.icon}
              label={filter.label}
              width={filter.width}
              seachPlaceholder={filter.placeholder || ''}
              dropdownClass={filter.dropdownClass || ''}
              id={`${filter.id}_sentence_filter`}
              useUnderlineStyle={true}
            />
          );

        case 'dropdown':
          return (
            <FilterSelect
              {...commonProps}
              label={filter.label}
              options={filter.options || []}
              isChip={filter.isChip}
              name={filter.label}
              multiple={filter.multiple}
              id={filter.id}
              rules={filter.rules}
              placeholder={filter.placeholder}
              dropIcon={filter.icon}
              searchable={filter.searchable}
              selectAllRequired={filter.selectAllRequired}
              defaultValues={
                filter.multiple ? filterValues[filter.id] || filter.defaultValues : null
              }
              defaultValue={
                !filter.multiple ? filterValues[filter.id] || filter.defaultValue : null
              }
              onChange={(value) => updateFilterValue(filter.id, value)}
              buttonElement={filter.buttonElement}
              optionRenderer={filter.optionRenderer}
              closeButtonReq={filter.closeButtonReq !== false}
              clearButtonReq={filter.clearButtonReq !== false}
              detachedBox={filter.detachedBox || false}
              hideLabelOnSelect={filter.hideLabelOnSelect || false}
              useUnderlineStyle={true}
              hidden={false}
            />
          );

        case 'infiniteDropdown':
          return (
            <QueryClientProvider client={queryClient} key={filter.id}>
              <ServerSelect
                {...commonProps}
                fetchDataOnScroll={filter.callback}
                defaultValues={
                  filter.multiple ? filterValues[filter.id] || filter.defaultValues : null
                }
                defaultValue={
                  !filter.multiple ? filterValues[filter.id] || filter.defaultValue : null
                }
                onChange={(value) => updateFilterValue(filter.id, value)}
                placeholder={filter.placeholder}
                label={filter.label}
                isChip={filter.isChip}
                name={filter.label}
                dropIcon={filter.icon}
                searchable={filter.searchable}
                queryKey={[filter.label]}
                multiple={filter.multiple}
                id={filter.id}
                optionRenderer={filter.optionRenderer}
                closeButtonReq={filter.closeButtonReq !== false}
                clearButtonReq={filter.clearButtonReq !== false}
                detachedBox={filter.detachedBox || false}
                hideLabelOnSelect={filter.hideLabelOnSelect || false}
                canInitialFetch={filter.canInitialFetch || false}
                useUnderlineStyle={true}
                hidden={false}
              />
            </QueryClientProvider>
          );

        case 'infiniteDynamicDropdown':
          return (
            <QueryClientProvider client={queryClient} key={filter.id}>
              <DynamicTreeDropdown
                {...commonProps}
                fetchDataOnScroll={filter.callback}
                defaultValues={filterValues[filter.id] || filter.defaultValues}
                onChange={(value: any) => updateFilterValue(filter.id, value)}
                placeholder={filter.placeholder}
                label={filter.label}
                name={filter.label}
                dropIcon={filter.icon}
                searchable={filter.searchable}
                queryKey={[filter.label]}
                id={filter.id}
                maxHeightForMenuItems={filter.maxHeightForMenuItems}
                detachedBox={filter.detachedBox || false}
                optionRenderer={filter.optionRenderer}
                closeButtonReq={filter.closeButtonReq !== false}
                clearButtonReq={filter.clearButtonReq !== false}
                multiple={filter.multiple}
                disableChildIfParentIsChecked={filter.disableChildIfParentIsChecked}
                canInitialFetch={filter.canInitialFetch || false}
                useUnderlineStyle={true}
              />
            </QueryClientProvider>
          );

        case 'dateRange':
          return (
            <DateRangePicker
              {...commonProps}
              onChange={(value) => updateFilterValue(filter.id, value)}
              defaultValues={filterValues[filter.id] || filter.defaultValues}
              startPlaceholderText={filter.placeholder}
              endPlaceholderText={filter.placeholder}
              topLabel={filter.label}
              minDate={filter.minDate}
              maxDate={filter.maxDate}
              startLabel={filter.startLabel}
              endLabel={filter.endLabel}
              dropIcon={filter.icon}
              dropdownClass={filter.class || ''}
              showSelected={filter.showSelected || false}
              buttonElement={filter.buttonElement}
              id={`${filter.id}_sentence_filter`}
              useUnderlineStyle={true}
            />
          );

        case 'datePicker':
          return (
            <CustomDatePicker
              {...commonProps}
              datePickerWrapperClass={filter.datePickerWrapperClass || ''}
              required={filter.required}
              defaultValue={filterValues[filter.id] || filter.defaultValue}
              topLabel={filter.label}
              placeholderText={filter.placeholder}
              minDate={filter.minDate}
              maxDate={filter.maxDate}
              onChange={(value) => updateFilterValue(filter.id, value)}
              dropIcon={filter.icon}
              dropdownClass={filter.class || ''}
              id={`${filter.id}_sentence_filter`}
              useUnderlineStyle={true}
            />
          );

        case 'text':
          return (
            <input
              {...commonProps}
              type="text"
              value={filterValues[filter.id] || ''}
              onChange={(e) => updateFilterValue(filter.id, e.target.value)}
              placeholder={filter.placeholder}
              className="focus:ring-primary rounded border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              disabled={filter.disabled}
            />
          );

        default:
          return null;
      }
    },
    [filterValues, loadingFilters, loadingStates, clearBit, updateFilterValue]
  );

  const renderSentence = useCallback(() => {
    if (!sentence) {
      return (
        <div className="flex flex-row flex-wrap items-center gap-2 overflow-visible">
          {finalConfigs.map((filter) => renderFilter(filter))}
        </div>
      );
    }

    const parts = sentence.split(/(\{[^}]+\})/);

    // Helper function to check if a filter should be visible
    const isFilterVisible = (filterId: string) => {
      const filter = finalConfigs.find((f) => f.id === filterId);
      if (!filter) return false;

      return (
        !filter.dependency ||
        (filterValues[filter.dependency] !== undefined &&
          filterValues[filter.dependency] !== null &&
          filterValues[filter.dependency] !== '' &&
          (!Array.isArray(filterValues[filter.dependency]) ||
            filterValues[filter.dependency].length > 0) &&
          (typeof filterValues[filter.dependency] !== 'object' ||
            filterValues[filter.dependency].value !== undefined ||
            Object.keys(filterValues[filter.dependency]).length > 0))
      );
    };

    // Process parts to hide text when associated filter is not visible
    const processedParts = parts
      .map((part, index) => {
        const match = part.match(/^\{([^}]+)\}$/);
        if (match) {
          const filterId = match[1];
          const filter = finalConfigs.find((f) => f.id === filterId);
          if (filter) {
            // Check if this filter should be visible
            if (isFilterVisible(filterId)) {
              return renderFilter(filter);
            } else {
              // Filter is not visible, return null to hide it
              return null;
            }
          }
          return (
            <span key={index} className="whitespace-nowrap text-red-500">
              {part}
            </span>
          );
        }

        // For text parts, check if the next filter is visible
        // If the next part is a filter and it's not visible, hide this text
        const nextPart = parts[index + 1];
        if (nextPart) {
          const nextMatch = nextPart.match(/^\{([^}]+)\}$/);
          if (nextMatch) {
            const nextFilterId = nextMatch[1];
            if (!isFilterVisible(nextFilterId)) {
              return null; // Hide this text part
            }
          }
        }

        // Also check if the previous filter is visible for text parts
        const prevPart = parts[index - 1];
        if (prevPart) {
          const prevMatch = prevPart.match(/^\{([^}]+)\}$/);
          if (prevMatch) {
            const prevFilterId = prevMatch[1];
            if (!isFilterVisible(prevFilterId)) {
              return null; // Hide this text part
            }
          }
        }

        return (
          <span key={index} className="whitespace-nowrap text-gray-700">
            {part}
          </span>
        );
      })
      .filter(Boolean); // Remove null values

    return (
      <div className="flex flex-row flex-wrap items-center gap-1 overflow-visible">
        {processedParts}
      </div>
    );
  }, [sentence, finalConfigs, renderFilter, filterValues]);

  return (
    <div className={`sentence-filter ${className}`}>
      <div className="flex items-center justify-between overflow-visible">
        <div className="relative flex-1 overflow-visible">{renderSentence()}</div>

        {isResetEnabled && (
          <button
            onClick={handleReset}
            className="hover:text-primary-dark text-primary focus:ring-primary ml-4 flex items-center rounded text-sm font-semibold focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label={resetLabel}
          >
            <FontAwesomeIcon icon={faRotateRight} className="mr-2 h-4 w-4" />
            <span className="hover:underline">{resetLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SentenceFilter;
