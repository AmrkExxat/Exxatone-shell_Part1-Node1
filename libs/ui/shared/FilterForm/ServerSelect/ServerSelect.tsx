import React, { useEffect, useState, useRef } from 'react';
import { Combobox, ComboboxOption } from '@headlessui/react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleMinus,
  faCircleXmark,
  faSquare,
  faXmark,
} from '@fortawesome/pro-light-svg-icons';
import { faSquareCheck } from '@fortawesome/pro-solid-svg-icons';
import renderOptionLabel from '../../../components/common/Form/components/Select/RenderOptionLabel';
import utils from '../../../components/common/Form/components/Select/utils';
import useDebounce from '../../../../utilities/utils/debounce';
import { ServerSelectProps, Option } from '../../../components/common/Form/shared/Select.types';
import ReactDOM from 'react-dom';
import { announce } from '@react-aria/live-announcer';
import { ShowMore } from '../../../components/common';

const ServerSelect = ({
  fetchDataOnScroll,
  queryKey,
  label,
  control,
  multiple = false,
  name,
  id,
  defaultValue,
  defaultValues,
  onChange,
  rules,
  required = false,
  disabled = false,
  placeholder = 'Please select an option',
  loading = false,
  reset = false,
  searchable = false,
  dropIcon,
  isChip = false,
  clearBit,
  selectAllRequired = false,
  extraFilter = false,
  hideFilter,
  hidden,
  classWrap,
  clearList,
  buttonElement,
  btnEleClassname,
  closeButtonReq = true,
  clearButtonReq = true,
  detachedBox = false,
  hideLabelOnSelect = false,
  canInitialFetch = true,
  optionRenderer,
  useUnderlineStyle = false,
  addedFilter = false,
  isDarkTheme = false,
  idToRemove = '',
  showMoreProp = { maxLength: 2 },
  isDisableTextUI = false,
  ...props
}: ServerSelectProps<any>) => {
  const comboPanelRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const clearButtonRef = useRef<HTMLButtonElement | null>(null);
  const selectAllButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const mainButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openedOnce, setOpenedOnce] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [initialRender, setInitialRender] = useState<boolean>(
    props?.initRender !== undefined ? props.initRender : true
  );
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const [showSelected, setShowSelected] = useState<boolean>(false);
  const [multiDefaultValues, setMultiDefaultValues] = useState<Option[]>(defaultValues ?? []);
  const [foundDefaultSelected, setFoundDefaultSelected] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [dropboxStyle, setDropboxStyle] = useState<any>({
    minWidth: '264px',
    maxWidth: '320px',
    display: 'none',
  });

  const debouncedSearch = useDebounce(query, 500);

  const queryClient = useQueryClient();

  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    queryClient.clear();
  }, [debouncedSearch]);

  // Find all focusable elements inside the dropdown
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const elements = dropdownRef.current.querySelectorAll<HTMLElement>(
        'button, input, a, [role="button"], [tabindex="0"]'
      );
      setFocusableElements(Array.from(elements));
    }
  }, [isOpen, selectedOptions, query]);
  const handleOptionSelection = (option: Option) => {
    if (multiple) {
      const optionExists = selectedOptions.some(
        (selectedOption) => selectedOption.id === option.id
      );

      const newSelectedOptions = optionExists
        ? selectedOptions.filter((selectedOption) => selectedOption.id !== option.id)
        : [...selectedOptions, option];

      setSelectedOptions(newSelectedOptions);
      onChange?.(newSelectedOptions);
    } else {
      // For single selection, use the regular handleSelectionChange
      handleSelectionChange(option.value);
      setIsOpen(false);
      // Return focus to trigger button after selection in single mode
      setTimeout(() => {
        if (mainButtonRef.current) {
          mainButtonRef.current?.focus();
        }
      }, 10);
    }
  };
  const handleArrowNavigation = (e: KeyboardEvent) => {
    if (!isOpen || !dropdownRef.current) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();

      // Find all focusable options
      const optionElements = Array.from(
        dropdownRef.current.querySelectorAll('[role="option"]')
      ) as HTMLElement[];

      if (optionElements.length === 0) return;

      const currentFocusedElement = document.activeElement as HTMLElement;

      // Handle focus from search input to first option
      if (currentFocusedElement.getAttribute('role') === 'searchbox' && e.key === 'ArrowDown') {
        optionElements[0].focus();
        setFocusedOptionIndex(0);
        return;
      }

      // Find the current index among option elements
      const currentIndex = optionElements.findIndex((el) => el === currentFocusedElement);

      // Calculate next index based on arrow direction
      let nextIndex;
      if (e.key === 'ArrowDown') {
        // If not found or last element, go to first
        nextIndex =
          currentIndex === -1 || currentIndex >= optionElements.length - 1 ? 0 : currentIndex + 1;
      } else {
        // If not found or first element, go to last
        nextIndex = currentIndex <= 0 ? optionElements.length - 1 : currentIndex - 1;
      }

      optionElements[nextIndex].focus();
      setFocusedOptionIndex(nextIndex);
    } else if (e.key === 'Enter' || e.key === ' ') {
      const currentFocusedElement = document.activeElement as HTMLElement;

      if (currentFocusedElement?.getAttribute('role') === 'option') {
        e.preventDefault();

        // Get the option data associated with this element
        const currentIndex = Array.from(
          dropdownRef.current.querySelectorAll('[role="option"]')
        ).findIndex((el) => el === currentFocusedElement);

        if (currentIndex !== -1) {
          const option = options[currentIndex];
          handleOptionSelection(option);
        }
      }
    }
  };
  // Handle keyboard navigation for focus trap
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen || !dropdownRef.current) return;

    const focusableEls = focusableElements;
    if (focusableEls.length === 0) return;

    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    const currentFocusedElement = document.activeElement as HTMLElement;

    // Handling Tab key navigation
    if (e.key === 'Tab') {
      // Circular focus navigation
      if (e.shiftKey) {
        // If shift+tab and focus is on first element, move to last element
        if (currentFocusedElement === firstFocusableEl) {
          e.preventDefault();
          lastFocusableEl.focus();
        }
      } else {
        // If tab and focus is on last element, move to first element
        if (currentFocusedElement === lastFocusableEl) {
          e.preventDefault();
          firstFocusableEl.focus();
        }
      }
    }

    // Close dropdown on Escape
    if (e.key === 'Escape') {
      closeDropdown();
      mainButtonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (idToRemove && multiple) {
      const idexOfElementToRemove = selectedOptions.findIndex(
        (option: any) => option?.id === idToRemove
      );
      if (idexOfElementToRemove > -1) {
        removeSelectedNode(id);
      } else {
        const multipleDefIdx = multiDefaultValues?.findIndex((option) => option?.id === idToRemove);
        if (multipleDefIdx > -1) {
          const newSelectedOption = [...multiDefaultValues];
          newSelectedOption.splice(multipleDefIdx, 1);
          setMultiDefaultValues(newSelectedOption);
        }
      }
    }
  }, [idToRemove]);

  // Update existing keyboard event listeners useEffect
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleArrowNavigation);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleArrowNavigation);
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleArrowNavigation);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, focusableElements]);

  const selectDefaultValues = () => {
    if (!multiple && defaultValue?.id) {
      const option = options.find((option) => option.id === defaultValue.id) ?? null;
      setFoundDefaultSelected(true);
      if (option) {
        setSelected(option);
      } else {
        setSelected(defaultValue);
      }
    } else if (multiple && multiDefaultValues?.length) {
      let updatedDefaultValues = multiDefaultValues;
      let defaults = [];
      let notFoundOptions = [];
      for (let i = 0; i < updatedDefaultValues.length; i++) {
        let option = options.find((j) => j.id === updatedDefaultValues[i].id);
        if (option) {
          defaults.push(option);
        } else {
          notFoundOptions.push(updatedDefaultValues[i]);
        }
      }
      if (notFoundOptions.length === 0) {
        setFoundDefaultSelected(true);
      }
      const getSelectedOptions = [
        ...selectedOptions,
        ...defaults.filter(
          (option) => !selectedOptions.some((existingOption) => existingOption.id === option.id)
        ),
      ];
      setSelectedOptions(getSelectedOptions);
      setMultiDefaultValues(notFoundOptions);
    }
  };

  useEffect(() => {
    if (clearBit > 0) {
      clearSelection();
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && clearList.includes(id)) {
      clearSelection();
    }
  }, [clearList]);

  useEffect(() => {
    if (extraFilter && hidden === false && !initialRender) {
      openDropdown(true);
    } else if (initialRender) {
      setInitialRender(false);
    }
  }, [hidden]);

  const clearSelection = (e?: React.MouseEvent | React.KeyboardEvent) => {
    setSelected(null);
    setSelectedOptions([]);
    setMultiDefaultValues([]);
    if (e) e.stopPropagation();

    // Move focus to Select All button after clearing (if it exists and is enabled)
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      } else if (clearButtonRef.current) {
        clearButtonRef.current.focus();
      }
    }, 0);
  };

  // const selectAll = (e?: React.MouseEvent | React.KeyboardEvent) => {
  //   handleSelectionChange(options);
  //   if (e) e.stopPropagation();

  //   // Move focus to Close button after selecting all
  //   setTimeout(() => {
  //     if (clearButtonRef.current) {
  //       clearButtonRef.current.focus();
  //     }
  //   }, 0);
  // };

  const closeDropdown = () => {
    setIsOpen(false);
    setQuery('');
    updateDropBoxStyles(false);
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleKeyDown);
  };

  useEffect(() => {
    if (disabled && isOpen) {
      closeDropdown();
    }
  }, [disabled]);

  const renderDropdown = () => {
    return (
      <>
        {detachedBox && isOpen && (
          <div
            className="fixed inset-0 bg-transparent opacity-0"
            id={(id ?? '') + '_serverselect_detached_overlay'}
            style={{ zIndex: 60 }}
            onClick={() => closeDropdown()}
          ></div>
        )}
        <div
          ref={dropdownRef}
          style={dropboxStyle}
          className={classNames(
            'bg-card absolute mt-1 w-[var(--input-width)] rounded-md border shadow-lg [--anchor-gap:var(--spacing-1)] focus:outline-none',
            'max-h-[350px] flex-col gap-1 overflow-y-auto transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
            props?.optionsContainerClassName,
            isDarkTheme ? 'dark-variant' : 'blue-variant'
          )}
          aria-label={`${label} options`}
        >
          <div>
            <div className="drop-panel-label mb-1 flex justify-between px-2 py-1 text-[.8rem] font-semibold">
              <label
                htmlFor={`${label}-search`}
                id={`${id}_dropdown_label`}
                role="heading"
                aria-level="3"
              >
                {label}
              </label>
              {multiple && (selectedOptions?.length > 0 || multiDefaultValues?.length > 0) && (
                <button
                  onClick={() => {
                    setShowSelected(!showSelected);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowSelected(!showSelected);
                    }
                  }}
                  className="focus-indicator filter-text-primary"
                  aria-expanded={showSelected ? 'true' : 'false'}
                  aria-controls="selected-values"
                >
                  <span role="alert">{`${selectedOptions?.length + multiDefaultValues.length} selected`}</span>
                  <FontAwesomeIcon
                    icon={showSelected ? faChevronUp : faChevronDown}
                    className="ml-2"
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
            {searchable && (
              <div className="relative px-2">
                <input
                  ref={searchInputRef}
                  className="sm:filter-text-sm text-default bg-input disabled:text-disabled disabled:bg-disabled disabled:bg-opacity-75 w-full rounded-md border py-1.5 pr-6 pl-3 shadow-sm disabled:cursor-not-allowed disabled:shadow-none sm:leading-6"
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSearchFocused(false);
                      // Find first option element
                      const firstOption = dropdownRef.current?.querySelector(
                        '[role="option"]'
                      ) as HTMLElement;
                      if (firstOption) {
                        setTimeout(() => firstOption.focus(), 50);
                        announce('List with ' + options?.length + ' items');
                      }
                      return;
                    }
                    if (e?.key === 'Escape') {
                      setSearchFocused(false);
                    }
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  aria-describedby={`${label}-search-input-tooltip`}
                  placeholder={placeholder}
                  aria-label={label}
                  value={query}
                  id={`${label}-search`}
                  role="searchbox"
                  aria-controls="options-list"
                  autoComplete="off"
                />

                {searchFocused && query.length < 3 && (
                  <div
                    id={`${label}-search-input-tooltip`}
                    role="tooltip"
                    className="filter-text-sm text-default bg-card absolute bottom-1/2 left-1/2 z-50 mb-4 flex w-[250px] -translate-x-1/2 transform items-center justify-center rounded px-3 py-1 shadow-lg"
                  >
                    Type at least 3 characters to search
                  </div>
                )}

                {query !== '' && (
                  <button
                    className={classNames(
                      'focus-indicator bg-card absolute top-[13px] right-[15px] flex items-center justify-center rounded-lg'
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuery('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuery('');
                        if (searchInputRef.current) {
                          searchInputRef.current.focus();
                        }
                      }
                    }}
                    aria-label="Clear search"
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="filter-selected-text h-3 w-3"
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  </button>
                )}
              </div>
            )}
            {multiple &&
              showSelected &&
              (selectedOptions.length > 0 || multiDefaultValues.length > 0) && (
                <>
                  <div
                    className="mt-2 mb-3 flex max-h-[60px] flex-wrap gap-y-3 overflow-y-auto"
                    id="selected-values"
                    role="group"
                    aria-label="Selected items"
                  >
                    {selectedOptions.map((item, index) => {
                      return (
                        <>
                          {selectedOptionRender(
                            item?.id,
                            item?.label,
                            index,
                            false,
                            item?.subLabel
                          )}
                        </>
                      );
                    })}
                    {multiDefaultValues.map((item, index) => {
                      return (
                        <>
                          {selectedOptionRender(item?.id, item?.label, index, true, item?.subLabel)}
                        </>
                      );
                    })}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="mb-2 w-full border-t" />
                    </div>
                  </div>
                </>
              )}
          </div>
          {isOpen && (
            <div
              className={`${showSelected ? 'h-[calc(100% - 135px)]' : 'h-[calc(100% - 75px)]'} focus-indicator overflow-y-auto`}
              onScroll={(e) => {
                fetchMoreOnBottomReached(e.target as HTMLDivElement);
              }}
              ref={comboPanelRef}
              id="options-list"
              role="listbox"
              aria-multiselectable={multiple ? true : undefined}
              aria-labelledby={`${id}_dropdown_label`}
              tabIndex={0}
            >
              <div className={classNames('flex flex-col gap-1')}>
                {options.length > 0 ? (
                  <>
                    {options?.map((option: any, index) => (
                      <ComboboxOption
                        key={option?.id ?? option?.value}
                        value={multiple ? option : option?.value}
                        ref={(el) => {
                          if (el) {
                            optionRefs.current[index] = el;
                          }
                        }}
                        className={({ active, selected }) =>
                          classNames(
                            'relative cursor-pointer py-2 pr-9 pl-3 select-none focus:bg-gray-100 focus:outline-none',
                            active ? 'bg-hover' : 'text-default',
                            !multiple && selected && 'bg-hover',
                            props?.optionClassName
                          )
                        }
                        role="option"
                        tabIndex={0}
                        aria-selected={
                          multiple
                            ? selectedOptions.some((item) => item.id === option.id)
                            : selected?.id === option.id
                        }
                      >
                        {({ active, selected }) => (
                          <div className="flex items-center break-all">
                            {multiple && (
                              <FontAwesomeIcon
                                icon={selected ? faSquareCheck : faSquare}
                                className={`mr-2 h-[1.1rem] w-[1.1rem] cursor-pointer text-[1.1rem] ${selected ? 'filter-text-primary' : ''}`}
                                aria-hidden="true"
                              />
                            )}
                            {optionRenderer
                              ? optionRenderer(option, selected)
                              : renderOptionLabel(option, selected, isChip, multiple, true, true)}

                            {!multiple && selected && (
                              <span
                                className={classNames(
                                  'filter-text-primary absolute inset-y-0 right-0 flex items-center px-4'
                                )}
                                aria-hidden="true"
                              >
                                <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                        )}
                      </ComboboxOption>
                    ))}
                  </>
                ) : searching ? (
                  <></>
                ) : (
                  <div
                    className="flex-flex-row filter-text-sm text-default p-2 whitespace-nowrap"
                    role="status"
                  >
                    No records found
                  </div>
                )}
                {isFetching && (
                  <div
                    className="loading-more px-2 text-xs whitespace-nowrap text-gray-400"
                    role="status"
                    aria-live="polite"
                  >
                    Loading more...
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            className="mx-3 flex items-center justify-between border-t-[1px] px-2 py-1"
            style={{ minHeight: '32px' }}
          >
            <div className="flex items-center gap-3">
              {clearButtonReq && (
                <button
                  className={`filter-text-primary text-xs ${selected?.label || selectedOptions.length > 0 ? 'filter-selected-text cursor-pointer' : 'cursor-not-allowed text-[#868686]'}`}
                  disabled={!(selected?.label || selectedOptions.length > 0)}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection(e);
                    handleSelectionChange(multiple ? [] : null, true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      clearSelection(e);
                      handleSelectionChange(multiple ? [] : null, true);
                    }
                  }}
                  ref={clearButtonRef}
                  aria-disabled={!(selected?.label || selectedOptions.length > 0)}
                >
                  Clear Selection
                </button>
              )}

              {/* {multiple && (
                  <button
                    className={`text-xs focus-indicator ${options.length>= selectedOptions.length ? "cursor-pointer text-primary" : "cursor-not-allowed text-[#868686]"}`}
                    disabled={!options?.length}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectAll(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        selectAll(e);
                      }
                    }}
                    ref={selectAllButtonRef}
                    aria-disabled={!options?.length}
                  >
                    Select All
                  </button>
                )} */}
            </div>

            <button
              className="filter-text-primary cursor-pointer text-xs"
              onClick={(e) => {
                mainButtonRef?.current?.click();
                mainButtonRef?.current?.focus?.();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  mainButtonRef?.current?.click();
                  mainButtonRef?.current?.focus?.();
                }
              }}
              ref={closeButtonRef}
            >
              Close
            </button>
          </div>
        </div>
      </>
    );
  };

  const removeFilter = (e?: React.MouseEvent | React.KeyboardEvent) => {
    closeDropdown();
    if (e) e.stopPropagation();
    hideFilter?.();
    updateDropBoxStyles(false);
  };

  const handleSelectionChange = (value: any, isClear?: boolean) => {
    if (multiple) {
      const newOptions = isClear
        ? []
        : [
            ...value,
            ...multiDefaultValues.filter(
              (option) => !value.some((existingOption) => existingOption.id === option.id)
            ),
          ];
      if (isClear) {
        setMultiDefaultValues([]);
      }
      setSelectedOptions(value);
      onChange?.(newOptions);
    } else {
      const option = value ? utils.findSelectedOptionByValue(value, options) : null;
      setSelected(option);
      onChange?.(option);
      mainButtonRef?.current?.click();
      mainButtonRef?.current?.focus();
    }
  };

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: async (params) => {
      setSearching(true);
      const response = await fetchDataOnScroll({ params, debouncedSearch });
      setSearching(false);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const nextPage = lastPageParam + 1;
      return nextPage;
    },
    refetchOnWindowFocus: false,
    enabled: canInitialFetch ? true : openedOnce,
  });

  useEffect(() => {
    if (data && !foundDefaultSelected) {
      selectDefaultValues();
    }
  }, [data, foundDefaultSelected]);

  const flatData = React.useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);

  const totalDBRowCount = data?.pages?.[0]?.totalCount ?? 0;
  const totalFetched = flatData.length;

  const options = data?.pages?.flatMap((page) => page.data) || [];

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  React.useEffect(() => {
    fetchMoreOnBottomReached(comboPanelRef.current);
  }, [fetchMoreOnBottomReached]);

  useEffect(() => {
    if (debouncedSearch && !searching && !isFetching) {
      setTimeout(() => {
        if (options.length === 0) {
          announce('No records found');
        } else {
          announce(`${options.length} results found`);
        }
      }, 100);
    }
  }, [debouncedSearch, options.length, searching, isFetching]);
  const removeSelectedNode = (id) => {
    const idexOfElementToRemove = selectedOptions.findIndex((option: any) => {
      return option?.id === id;
    });
    const newSelectedOption = [...selectedOptions];
    newSelectedOption.splice(idexOfElementToRemove, 1);
    handleSelectionChange(newSelectedOption);

    // Focus management after removing an option
    setTimeout(() => {
      if (dropdownRef.current) {
        const selectedButtons = dropdownRef.current.querySelectorAll('[role="list"] button');
        if (selectedButtons.length > 0) {
          // Focus next option or previous if at end
          const nextFocusIndex = Math.min(idexOfElementToRemove, selectedButtons.length - 1);
          if (nextFocusIndex >= 0) {
            (selectedButtons[nextFocusIndex] as HTMLElement).focus();
          } else if (searchable) {
            const searchInput = dropdownRef.current.querySelector('input');
            if (searchInput) {
              (searchInput as HTMLElement).focus();
            }
          } else if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        } else if (searchable) {
          const searchInput = dropdownRef.current.querySelector('input');
          if (searchInput) {
            (searchInput as HTMLElement).focus();
          }
        } else if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 0);
  };
  // Update removeUnloadedNode around line 308
  const removeUnloadedNode = (id) => {
    const idexOfElementToRemove = multiDefaultValues.findIndex((option: any) => {
      return option?.id === id;
    });
    const newSelectedOption = [...multiDefaultValues];
    newSelectedOption.splice(idexOfElementToRemove, 1);
    setMultiDefaultValues(newSelectedOption);
    const newOptions = [
      ...selectedOptions,
      ...newSelectedOption.filter(
        (option) => !selectedOptions.some((existingOption) => existingOption.id === option.id)
      ),
    ];
    onChange?.(newOptions);

    // Focus management after removing an option
    setTimeout(() => {
      if (dropdownRef.current) {
        const selectedButtons = dropdownRef.current.querySelectorAll('[role="list"] button');
        if (selectedButtons.length > 0) {
          // Focus next option or previous if at end
          const nextFocusIndex = Math.min(idexOfElementToRemove, selectedButtons.length - 1);
          if (nextFocusIndex >= 0) {
            (selectedButtons[nextFocusIndex] as HTMLElement).focus();
          } else if (searchable) {
            const searchInput = dropdownRef.current.querySelector('input');
            if (searchInput) {
              (searchInput as HTMLElement).focus();
            }
          } else if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        } else if (searchable) {
          const searchInput = dropdownRef.current.querySelector('input');
          if (searchInput) {
            (searchInput as HTMLElement).focus();
          }
        } else if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 0);
  };

  const updateDropBoxStyles = (open: boolean) => {
    if (!openedOnce) {
      setOpenedOnce(true);
    }
    if (open) {
      if (detachedBox && mainButtonRef.current && dropdownRef.current) {
        const dropdownElement = dropdownRef.current;
        dropdownElement.style.visibility = 'hidden';
        dropdownElement.style.display = 'flex';

        const buttonRect = mainButtonRef.current.getBoundingClientRect();
        const dropdownRect = dropdownElement.getBoundingClientRect();
        const dropdownHeight = dropdownRect.height;
        const dropdownWidth = dropdownRect.width;

        const availableSpaceBelow = window.innerHeight - buttonRect.bottom;
        const availableSpaceAbove = buttonRect.top;
        const availableSpaceRight = window.innerWidth - buttonRect.right;

        let top;
        let left;
        let bottom;
        let isTopRender = false;
        if (availableSpaceBelow < 350 && availableSpaceAbove > 350) {
          isTopRender = true;
          bottom = window.innerHeight - (buttonRect.top + window.scrollY);
          top = buttonRect.top - (dropdownHeight + 10) + window.scrollY;
        } else {
          top = buttonRect.bottom + window.scrollY;
        }
        if (availableSpaceRight < dropdownWidth) {
          left = buttonRect.right - dropdownWidth + window.scrollX;
        } else {
          left = buttonRect.left + window.scrollX;
        }
        if (left < 0) {
          left = buttonRect.left + buttonRect.width + window.scrollX;
        }
        if (isTopRender) {
          setDropboxStyle({
            minWidth: '264px',
            maxWidth: '320px',
            left: left,
            bottom: bottom,
            display: 'flex',
            zIndex: 70,
          });
        } else {
          setDropboxStyle({
            minWidth: '264px',
            maxWidth: '320px',
            left: left,
            top: top,
            display: 'flex',
            zIndex: 70,
          });
        }

        dropdownElement.style.visibility = '';
      } else {
        setDropboxStyle({
          minWidth: '264px',
          maxWidth: '320px',
          display: 'flex',
          zIndex: 50,
        });
      }
    } else {
      setDropboxStyle({
        minWidth: '264px',
        maxWidth: '320px',
        display: 'none',
      });
    }
  };

  const openDropdown = (openPanel = null) => {
    const open = openPanel !== null ? openPanel : !isOpen;
    setIsOpen(open);
    if (!open) {
      setQuery('');
      updateDropBoxStyles(false);
    } else {
      updateDropBoxStyles(true);
    }
    if (!multiple && searchInputRef.current) {
      searchInputRef.current?.focus();
    }
    setTimeout(() => {
      if (open) {
        document.addEventListener('click', handleOutsideClick);
        // Set focus on the search input if searchable, otherwise on the first option
        if (searchable && dropdownRef.current) {
        }
      } else {
        document.removeEventListener('click', handleOutsideClick);
      }
    });
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      closeDropdown();
    }
  };

  const selectedOptionRender = (
    id,
    label,
    index,
    unloadedNode: boolean = false,
    subLabel: string = ''
  ) => {
    return (
      <button
        type="button"
        key={id + '_' + index}
        className="focus-indicator hover:filter-text-primary filter-text-sm ms-2 inline-flex w-full items-center rounded-md bg-transparent p-1"
        data-dismiss-target="#badge-dismiss-default"
        aria-label={`remove ${label}`}
        onClick={() => {
          setTimeout(() => {
            if (unloadedNode) {
              removeUnloadedNode(id);
            } else {
              removeSelectedNode(id);
            }
          });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (unloadedNode) {
              removeUnloadedNode(id);
            } else {
              removeSelectedNode(id);
            }
          }
        }}
      >
        <FontAwesomeIcon
          icon={faSquareCheck}
          className={`filter-text-primary mr-2 h-[1.1rem] w-[1.1rem] cursor-pointer text-[1.1rem]`}
        />
        <div>
          <div className="filter-text-sm truncate text-left">
            <span className="truncate-content truncate">{label}</span>
          </div>
          <span className={'text-xs text-gray-700'}>{subLabel ? subLabel : ''}</span>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`flex grow-1 flex-wrap items-baseline gap-1 ${classWrap} ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}
    >
      <Combobox
        as="div"
        suppressHydrationWarning={true}
        value={!multiple ? (selected?.value ? selected.value : null) : selectedOptions}
        multiple={multiple}
        onChange={handleSelectionChange}
        className={classNames('relative flex-grow-1', props?.className)}
        name={name}
        disabled={disabled}
        aria-describedby={props?.['aria-describedby']}
        onBlur={(e: any) => {
          props?.onBlur && props?.onBlur(e);
        }}
        aria-expanded={isOpen}
      >
        {disabled && isDisableTextUI ? (
          <div className="form-disabled-value-text pl-0.5">
            {(multiple && !selectedOptions?.length) || (!multiple && !selected) ? (
              <>Not Specified</>
            ) : (
              <ShowMore
                type="list"
                rowData={multiple ? (selectedOptions ?? []) : selected ? [selected] : []}
                selector={['label']}
                showTooltip={true}
                moreTextRequired={false}
                {...showMoreProp}
              />
            )}
          </div>
        ) : (
          <div className="relative">
            {!buttonElement ? (
              <>
                <button
                  className={`flex items-center ${useUnderlineStyle ? '' : 'filter-round'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} focus-indicator filter-text-sm px-2 py-1.5 ${
                    useUnderlineStyle
                      ? `hover:border-primary focus:border-primary border-b-2 ${(selectedOptions?.length || multiDefaultValues?.length || selected?.label) && isOpen ? 'border-primary' : (selectedOptions?.length || multiDefaultValues?.length || selected?.label) && !isOpen ? 'border-primary' : isOpen && !(selectedOptions?.length || multiDefaultValues?.length || selected?.label) ? 'border-primary' : 'border-gray-300'}`
                      : `border-[1px] ${(selectedOptions?.length || multiDefaultValues?.length || selected?.label) && isOpen ? 'selected-opened-filter' : (selectedOptions?.length || multiDefaultValues?.length || selected?.label) && !isOpen ? 'selected-filter' : isOpen && !(selectedOptions?.length || multiDefaultValues?.length || selected?.label) ? 'opened-filter' : 'newState-filter'}`
                  } ${props?.buttonClassName}`}
                  id={id ? id + '_filter' : 'paginated_select_filter'}
                  disabled={disabled}
                  onClick={() => {
                    openDropdown();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openDropdown();
                    }
                  }}
                  ref={mainButtonRef}
                  aria-expanded={isOpen}
                >
                  {dropIcon && <FontAwesomeIcon icon={dropIcon} className={`filter-icon mr-2`} />}
                  <div
                    className={`${
                      (closeButtonReq &&
                        (selectedOptions?.length > 0 ||
                          multiDefaultValues?.length > 0 ||
                          selected?.label)) ||
                      (extraFilter &&
                        !selected?.label &&
                        !selectedOptions?.length &&
                        !multiDefaultValues?.length)
                        ? 'mr-8'
                        : 'mr-2'
                    } flex items-center ${props?.parentLabelClass ? props?.parentLabelClass : ''}`}
                  >
                    <span
                      className={`${hideLabelOnSelect ? (multiple ? (selectedOptions?.length || multiDefaultValues?.length ? 'hidden' : '') : selected?.label ? 'hidden' : '') : ''}`}
                    >
                      {label}
                    </span>
                    {multiple ? (
                      <>
                        {(selectedOptions?.length > 0 || multiDefaultValues?.length > 0) && (
                          <span className={`${props?.labelClass ? props?.labelClass : ''}`}>
                            {!hideLabelOnSelect && (
                              <span className="filter-selected-text px-2">|</span>
                            )}
                            <span
                              className={`pr-2 text-[.8rem] font-semibold ${disabled ? '' : 'filter-selected-text'} whitespace-nowrap`}
                            >
                              {`${selectedOptions?.length + multiDefaultValues?.length > 1 ? selectedOptions?.length + multiDefaultValues?.length + ' selected' : selectedOptions?.length === 1 ? selectedOptions[0].label : multiDefaultValues?.length === 1 ? multiDefaultValues[0].label : ''}`}
                            </span>
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {selected?.label && (
                          <span className={`${props?.labelClass ? props?.labelClass : ''}`}>
                            {!hideLabelOnSelect && <span className="px-2">|</span>}
                            <span
                              className={`pr-2 text-[.8rem] font-semibold ${disabled ? '' : 'filter-text-primary'} whitespace-nowrap`}
                            >
                              {selected?.label}
                            </span>
                          </span>
                        )}
                      </>
                    )}
                    {useUnderlineStyle && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
                      />
                    )}
                  </div>
                  {closeButtonReq &&
                    (selectedOptions?.length > 0 ||
                      multiDefaultValues?.length > 0 ||
                      selected?.label) && (
                      <button
                        id="select_clear_all"
                        className="focus-indicator absolute top-1/2 right-3 z-10 flex -translate-y-1/2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectionChange(multiple ? [] : null, true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectionChange(multiple ? [] : null, true);
                            setTimeout(() => {
                              mainButtonRef.current?.focus();
                            }, 0);
                          }
                        }}
                        type="button"
                        aria-label={`Clear selection for ${label} Filter`}
                      >
                        <FontAwesomeIcon
                          icon={isDarkTheme ? faXmark : faCircleXmark}
                          className="filter-cross-btn h-5 w-5"
                        />
                      </button>
                    )}
                  {addedFilter &&
                    !selected?.label &&
                    !selectedOptions?.length &&
                    !multiDefaultValues?.length && (
                      <button
                        aria-label={`hide ${label} Filter`}
                        id="select_remove_btn"
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFilter(e);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFilter(e);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faCircleMinus} className={`h-4 w-4`} />
                      </button>
                    )}
                </button>
              </>
            ) : (
              <button
                id={id ? id + '_filter' : 'paginated_select_filter'}
                disabled={disabled}
                onClick={() => {
                  openDropdown();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDropdown();
                  }
                }}
                ref={mainButtonRef}
                aria-expanded={isOpen}
                className={btnEleClassname ? btnEleClassname : ''}
              >
                {buttonElement}
              </button>
            )}

            {detachedBox
              ? ReactDOM.createPortal(renderDropdown(), document.body)
              : renderDropdown()}
          </div>
        )}
      </Combobox>
    </div>
  );
};

export default ServerSelect;
