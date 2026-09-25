import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Combobox, ComboboxOption } from '@headlessui/react';
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
import utils from '../../../components/common/Form/components/Select/utils';
import renderOptionLabel from '../../../components/common/Form/components/Select/RenderOptionLabel';
import { SelectProps, Option } from '../../../components/common/Form/shared/Select.types';
import ReactDOM from 'react-dom';
import { announce } from '@react-aria/live-announcer';
import { ShowMore } from '../../../components/common/ShowMore';

export default function FilterSelect({
  label,
  options = [],
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
  buttonElement,
  openPanel = false,
  extraFilter = false,
  hideFilter,
  hidden,
  btnEleClassname,
  classWrap,
  clearList,
  optionRenderer,
  closeButtonReq = true,
  clearButtonReq = true,
  detachedBox = false,
  hideLabelOnSelect = false,
  useUnderlineStyle = false,
  addedFilter = false,
  isDarkTheme = false,
  showMoreProp = { maxLength: 2 },
  isDisableTextUI = false,
  showChevronIcon = false,
  ...props
}: SelectProps<any>): JSX.Element {
  const [query, setQuery] = useState('');

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const mainButtonRef = useRef<HTMLButtonElement | null>(null);
  const optionsListRef = useRef<HTMLDivElement | null>(null);
  const selectAllBtnRef = useRef<HTMLButtonElement | null>(null);
  const clearBtnRef = useRef<HTMLButtonElement | null>(null);
  const selectedItemsRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const clearXButtonRef = useRef<HTMLButtonElement | null>(null);

  const [selected, setSelected] = useState<Option | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [dropboxStyle, setDropboxStyle] = useState<any>({
    minWidth: '264px',
    maxWidth: '320px',
    display: 'none',
  });

  const [filteredOptions, setFilteredOptions] = useState<Option[] | []>(options);

  const [initialRender, setInitialRender] = useState<boolean>(
    props?.initRender !== undefined ? props.initRender : true
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSelected, setShowSelected] = useState<boolean>(false);
  // intended to active option index for keyboard navigation so it helps us shift focus
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1);
  // Track the last focused selected item index for better focus management
  const [lastFocusedSelectedIndex, setLastFocusedSelectedIndex] = useState<number>(-1);

  // As in Prism If all the optons are selected meant to disabling the Select All button. and shift focus to clear selection
  const areAllOptionsSelected = useMemo(() => {
    return multiple && options.length > 0 && selectedOptions.length === options.length;
  }, [multiple, options, selectedOptions]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (options.length > 0) {
      if (multiple && defaultValues?.length) {
        setSelectedOptions(defaultValues);
      } else if (!multiple && defaultValue?.value) {
        setSelected(options.find((option) => option.value === defaultValue.value) ?? null);
      }
    }
  }, [defaultValue, defaultValues, multiple]);

  useEffect(() => {
    if (clearBit > 0) {
      clearSelection(null, true);
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && clearList.includes(id)) {
      clearSelection(null, true);
    }
  }, [clearList]);

  useEffect(() => {
    if (extraFilter && hidden === false && !initialRender) {
      openDropdown(true);
    } else if (initialRender) {
      setInitialRender(false);
    }
  }, [hidden]);

  useEffect(() => {
    if (openPanel) {
      openDropdown();
    }
  }, [openPanel]);

  const clearSelection = (e?: React.MouseEvent, parentReset?: boolean) => {
    setSelected(null);
    setSelectedOptions([]);

    if (multiple) {
      onChange?.([], parentReset);
    } else {
      onChange?.(null, parentReset);
    }

    if (e) e.stopPropagation();

    // As in Prism After clearing selection, focus should shift to the Select All button if it exists
    if (searchInputRef && searchInputRef?.current) {
      setTimeout(() => {
        searchInputRef?.current?.focus?.();
      }, 0);
    } else {
      setTimeout(() => {
        document.getElementById(`${label?.replace(/\s+/g, '_')}_options_listbox`)?.focus();
      }, 50);
    }
  };

  const selectAll = () => {
    handleSelectionChange(options);
    // As in Prism After selecting all, focus should shift to the Clear Selection button
    setTimeout(() => {
      clearBtnRef?.current?.focus?.();
    }, 0);
  };

  // Filter options based on query
  useEffect(() => {
    const filtered = query
      ? options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
      : options;

    // Important: Fixed an issue where previously filtered out already selected options in multiple mode
    setFilteredOptions(
      multiple
        ? filtered.map(
            (option) =>
              selectedOptions.find((selected) => selected.value === option.value) || option
          )
        : filtered
    );
    if (query || query == '') {
      announce(filtered.length ? `${filtered.length} records found` : 'No records found', 'polite');
    }
    // Reset active option index when filteredOptions change
    setActiveOptionIndex(-1);
  }, [query, options, multiple, selectedOptions]);

  const getPlaceholder = useMemo(() => {
    if (multiple && selectedOptions.length) {
      return selectedOptions.map((option) => option.label).join(', ');
    }
    if (!multiple && selected) {
      return selected.label;
    }
    return placeholder;
  }, [multiple, selectedOptions, selected, placeholder]);

  const handleSelectionChange = (value: any) => {
    if (multiple) {
      setSelectedOptions(value);
      onChange?.(value);
    } else {
      // Fixed: Clear selected state when null value is passed
      const option =
        value && value !== null ? utils.findSelectedOptionByValue(value, options) : null;
      setSelected(option);
      onChange?.(option);
      closeDropdown();
    }
  };

  const removeFilter = () => {
    updateDropBoxStyles(false);
    setIsOpen(false);
    document.removeEventListener('click', handleOutsideClick);
    hideFilter?.();
  };
  const updateDropBoxStyles = (open: boolean) => {
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
        if (availableSpaceBelow < dropdownHeight && availableSpaceAbove > dropdownHeight) {
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

  // Focus an option by its index
  const focusOptionByIndex = (index: number) => {
    if (index >= 0 && index < filteredOptions.length) {
      setActiveOptionIndex(index);
      setTimeout(() => {
        const optionElements = optionsListRef?.current?.querySelectorAll('[role="option"]');
        if (optionElements && optionElements[index]) {
          (optionElements[index] as HTMLElement)?.focus?.();
        }
      }, 0);
    }
  };

  const openDropdown = (openPanel = null) => {
    const open = openPanel !== null ? openPanel : !isOpen;

    // If we're toggling from open to closed, always close
    if (isOpen && open === isOpen) {
      setIsOpen(false);
      setQuery('');
      setActiveOptionIndex(-1);
      document.removeEventListener('click', handleOutsideClick);
      if (mainButtonRef?.current && document.activeElement !== mainButtonRef?.current) {
        mainButtonRef?.current?.focus?.();
      }
      return;
    }

    setIsOpen(open);
    if (!open) {
      updateDropBoxStyles(false);
      setQuery('');
      setActiveOptionIndex(-1);
    } else {
      // Set focus to search input when dropdown opens if searchable
      updateDropBoxStyles(true);
    }

    setTimeout(() => {
      if (open) {
        document.addEventListener('click', handleOutsideClick);
      } else {
        document.removeEventListener('click', handleOutsideClick);
      }
    });
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef?.current && !dropdownRef?.current?.contains(event.target as Node)) {
      updateDropBoxStyles(false);
      setIsOpen(false);
      setQuery('');
      setActiveOptionIndex(-1);
      document.removeEventListener('click', handleOutsideClick);
    }
  };

  const setFocus = (id: string) => {
    const elements = document.querySelectorAll(`#${id}`);
    const lastElement = elements.item(elements.length - 1);
    if (lastElement) {
      lastElement?.focus?.();
    }
  };

  //  Removing a selected item from the X selected chevron button dropdown
  const handleRemoveSelected = (valueToRemove: string, index: number) => {
    const newSelectedOption = selectedOptions.filter((option) => option.value !== valueToRemove);

    handleSelectionChange(newSelectedOption);

    // Determine where to set focus after removal
    if (newSelectedOption.length > 0) {
      // Find the closest item to focus on
      const nextIndex = index < newSelectedOption.length ? index : index - 1;

      setLastFocusedSelectedIndex(nextIndex);

      // Focus the element
      setTimeout(() => {
        const nextItemKey = newSelectedOption[nextIndex]?.value;
        if (nextItemKey && selectedItemsRefs?.current[nextItemKey]) {
          selectedItemsRefs?.current[nextItemKey]?.focus?.();
        } else if (searchInputRef?.current) {
          // If no items left to focus, focus the search input
          searchInputRef?.current?.focus?.();
        }
      }, 0);
    } else {
      // As in Prism If no items left, focus the search input or first option
      setTimeout(() => {
        if (searchInputRef?.current) {
          searchInputRef?.current?.focus?.();
        } else if (filteredOptions.length > 0) {
          focusOptionByIndex(0);
        }
      }, 0);
    }
  };

  // Handle search input key navigation
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault();
      const firstOption = filteredOptions[0];
      if (multiple || isChip) {
        const isSelected = selectedOptions.some((option) => option.value === firstOption.value);
        if (isSelected) {
          handleSelectionChange(
            selectedOptions.filter((option) => option.value !== firstOption.value)
          );
        } else {
          handleSelectionChange([...selectedOptions, firstOption]);
          announce(`List with ${filteredOptions?.length} items`, 'polite');
        }
        return;
      } else {
        handleSelectionChange(firstOption.value);
      }
      return;
    }

    // Focus first option when pressing down arrow from search input
    if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
      e.preventDefault();
      focusOptionByIndex(0);
      announce(`List with ${filteredOptions.length} items`, 'polite');
    }

    // Move to the last option when pressing up arrow from search input
    if (e.key === 'ArrowUp' && filteredOptions.length > 0) {
      e.preventDefault();
      focusOptionByIndex(filteredOptions.length - 1);
    }

    // Close dropdown on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setQuery('');
      setActiveOptionIndex(-1);
      document.removeEventListener('click', handleOutsideClick);
      if (mainButtonRef?.current) {
        mainButtonRef?.current?.focus?.();
      }
    }
  };

  // Main keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      // Open dropdown with down arrow or Enter when closed
      if ((e.key === 'ArrowDown' || e.key === 'Enter') && !disabled) {
        e.preventDefault();
        openDropdown(true);
      }
      return;
    }

    if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
      e.preventDefault();
      focusOptionByIndex(0);
      announce(`List with ${filteredOptions?.length} items`, 'polite');
    }
    if (e.key === 'ArrowUp' && filteredOptions.length > 0) {
      e.preventDefault();
      focusOptionByIndex(filteredOptions.length - 1);
      announce(`List with ${filteredOptions?.length} items`, 'polite');
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        setActiveOptionIndex(-1);
        document.removeEventListener('click', handleOutsideClick);
        if (mainButtonRef?.current && document.activeElement !== mainButtonRef?.current) {
          mainButtonRef?.current?.focus?.();
        }
        break;

      case 'Tab':
        // Manage tab navigation between footer buttons
        if (!e.shiftKey && document.activeElement === clearBtnRef?.current) {
          if (selectAllRequired && !areAllOptionsSelected) {
            e.preventDefault();
            selectAllBtnRef?.current?.focus?.();
          } else {
            e.preventDefault();
            closeButtonRef?.current?.focus?.();
          }
        } else if (e.shiftKey && document.activeElement === selectAllBtnRef?.current) {
          e.preventDefault();
          clearBtnRef?.current?.focus?.();
        } else if (e.shiftKey && document.activeElement === closeButtonRef?.current) {
          if (selectAllRequired && !areAllOptionsSelected) {
            e.preventDefault();
            selectAllBtnRef?.current?.focus?.();
          } else {
            e.preventDefault();
            clearBtnRef?.current?.focus?.();
          }
        }
        break;

      default:
        break;
    }
  };

  // Handle option keyboard navigation
  const handleOptionKeyDown = (e: React.KeyboardEvent, optionIndex: number, option: Option) => {
    e.stopPropagation();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (optionIndex < filteredOptions.length - 1) {
          focusOptionByIndex(optionIndex + 1);
        } else {
          focusOptionByIndex(0);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (optionIndex > 0) {
          focusOptionByIndex(optionIndex - 1);
        } else {
          focusOptionByIndex(filteredOptions.length - 1);
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (multiple || isChip) {
          const isSelected = selectedOptions.some(
            (selectedOption) => selectedOption.value === option.value
          );
          if (isSelected) {
            handleSelectionChange(
              selectedOptions.filter((selectedOption) => selectedOption.value !== option.value)
            );
          } else {
            handleSelectionChange([...selectedOptions, option]);
          }
          // Keep focus on the current option
          setTimeout(() => {
            focusOptionByIndex(optionIndex);
          }, 0);
        } else {
          handleSelectionChange(option.value);
        }
        if (e.key == 'Enter') {
          closeDropdown();
        }
        break;

      case 'Home':
        e.preventDefault();
        // Move to first option
        focusOptionByIndex(0);
        break;

      case 'End':
        e.preventDefault();
        // Move to last option
        focusOptionByIndex(filteredOptions.length - 1);
        break;

      case 'Escape':
        e.preventDefault();
        // Close dropdown
        setIsOpen(false);
        setQuery('');
        document.removeEventListener('click', handleOutsideClick);
        if (mainButtonRef?.current) {
          mainButtonRef?.current?.focus?.();
        }
        break;

      case 'Tab':
        // Prevent default tab behavior within options list
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Tab: Move to search input or previous navigation element
          if (searchable && searchInputRef?.current) {
            searchInputRef?.current?.focus?.();
          } else if (clearBtnRef?.current) {
            clearBtnRef?.current?.focus?.();
          }
        } else {
          // Tab: Move to footer buttons
          clearBtnRef?.current?.focus?.();
        }
        break;

      default:
        // For letter keys, try to find and focus an option starting with that letter
        if (e.key.length === 1 && e.key.match(/[a-z0-9]/i)) {
          const char = e.key.toLowerCase();
          const matchingOptionIndex = filteredOptions.findIndex(
            (opt, idx) => idx > optionIndex && opt.label.toLowerCase().startsWith(char)
          );

          if (matchingOptionIndex !== -1) {
            focusOptionByIndex(matchingOptionIndex);
          } else {
            // If no match after current index, try from beginning
            const firstMatchIndex = filteredOptions.findIndex((opt) =>
              opt.label.toLowerCase().startsWith(char)
            );
            if (firstMatchIndex !== -1 && firstMatchIndex !== optionIndex) {
              focusOptionByIndex(firstMatchIndex);
            }
          }
        }
        break;
    }
  };

  const closeDropdown = () => {
    updateDropBoxStyles(false);
    setIsOpen(false);
    setQuery('');
    setActiveOptionIndex(-1);
    document.removeEventListener('click', handleOutsideClick);

    // To Returning the focus to the triggering element
    if (mainButtonRef?.current && document.activeElement !== mainButtonRef?.current) {
      mainButtonRef?.current?.focus?.();
    }
  };

  const renderDropdown = () => {
    return (
      <>
        {detachedBox && isOpen && (
          <div
            className="fixed inset-0 bg-transparent opacity-0"
            id={(id ?? '') + '_filterselect_detached_overlay'}
            style={{ zIndex: 60 }}
            onClick={() => closeDropdown()}
          ></div>
        )}
        <div
          ref={dropdownRef}
          style={dropboxStyle}
          tabIndex={-1}
          className={classNames(
            isDarkTheme ? 'dark-variant' : 'blue-variant',
            'bg-card absolute mt-1 w-[var(--input-width)] rounded-md border shadow-lg [--anchor-gap:var(--spacing-1)] focus:outline-none',
            'max-h-[300px] flex-col gap-1 overflow-y-auto transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
            props?.optionsContainerClassName
          )}
        >
          <div className="drop-panel-label mb-1 flex justify-between px-2 py-1 text-[.8rem] font-semibold">
            <label htmlFor={id + '-search'} role="heading" aria-level={3}>
              {label}
            </label>
            {multiple && selectedOptions?.length > 0 && (
              <button
                id="filter_show_selected_btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSelected(!showSelected);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSelected(!showSelected);
                  }
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    handleKeyDown(e);
                  }
                }}
                className="focus-indicator filter-text-primary"
                aria-expanded={showSelected}
                aria-controls="selected-values"
              >
                {`${selectedOptions?.length} selected`}
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
                className="focus-indicator sm:filter-text-sm text-default bg-input disabled:text-disabled disabled:bg-disabled disabled:bg-opacity-75 w-full rounded-md border py-1.5 pr-6 pl-3 shadow-sm disabled:cursor-not-allowed disabled:shadow-none sm:leading-6"
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={placeholder}
                aria-label={`${label}`}
                value={query}
                id={id + '-search'}
                autoComplete="off"
              />
              {query !== '' && (
                <a
                  role="button"
                  aria-label="clear selection"
                  id="filter_clear_search_btn"
                  tabIndex={0}
                  className={classNames(
                    'focus-indicator bg-card absolute top-[13px] right-[15px] flex items-center justify-center rounded-lg hover:ring-2'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setQuery('');
                    e.stopPropagation();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setQuery('');
                      e.stopPropagation();
                      searchInputRef?.current?.focus();
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="focus-indicator filter-text-primary h-3 w-3"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </a>
              )}
            </div>
          )}
          {multiple && showSelected && selectedOptions.length > 0 && (
            <>
              <div
                className="mt-1 mb-1 flex max-h-[60px] min-h-[60px] flex-wrap gap-y-3 overflow-y-auto"
                id="selected-values"
                role="group"
                aria-label="Selected options"
              >
                {selectedOptions.map(({ value, label }, index) => {
                  return (
                    <button
                      type="button"
                      key={value}
                      ref={(el) => {
                        selectedItemsRefs.current[value] = el;
                      }}
                      className="focus-indicator hover:filter-text-primary filter-text-sm ms-2 inline-flex w-full items-center rounded-md bg-transparent p-1"
                      data-dismiss-target="#badge-dismiss-default"
                      aria-label={`remove ${label}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveSelected(value, index);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveSelected(value, index);
                        }
                      }}
                      onFocus={() => {
                        setLastFocusedSelectedIndex(index);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        className={`filter-text-primary mr-2 h-[1.1rem] w-[1.1rem] cursor-pointer text-[1.1rem]`}
                      />
                      <div className="filter-text-sm truncate">
                        <span className="truncate-content truncate">{label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="mb-2 w-full border-t border-gray-300" />
                </div>
              </div>
            </>
          )}
          <div
            role="listbox"
            tabIndex={0}
            aria-multiselectable={multiple ? true : undefined}
            id={`${label?.replace(/\s+/g, '_')}_options_listbox`}
            onKeyDown={handleKeyDown}
            className={`${showSelected ? 'max-h-[calc(100% - 135px)]' : 'max-h-[calc(100% - 75px)]'} focus-indicator overflow-y-auto`}
            aria-label={`${label} options`}
          >
            <div className="flex flex-col gap-1" ref={optionsListRef}>
              {filteredOptions.length > 0 ? (
                filteredOptions?.map((option, index) => {
                  const isSelected = multiple
                    ? selectedOptions.some(
                        (selectedOption) => selectedOption.value === option.value
                      )
                    : selected?.value === option.value;

                  return (
                    <ComboboxOption
                      key={option?.id ?? option?.value}
                      value={multiple ? option : option?.value}
                      className={({ active, selected }) =>
                        classNames(
                          'filter-text-sm flex cursor-pointer items-center justify-between px-3 py-2',
                          active ? 'bg-gray-100' : '',
                          selected ? 'text-default' : 'text-black',
                          !multiple && selected && 'bg-hover',
                          props?.optionClassName
                        )
                      }
                      ref={(el) => {
                        // Store a ref to the option element
                        if (index === activeOptionIndex) {
                          // Auto-focus the active option
                          setTimeout(() => {
                            if (el) {
                              el.focus();
                            }
                          }, 0);
                        }
                      }}
                      tabIndex={0}
                      onFocus={() => setActiveOptionIndex(index)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (multiple) {
                          const newSelectedOptions = selected
                            ? selectedOptions.filter(
                                (selectedOption) => selectedOption.value !== option.value
                              )
                            : [...selectedOptions, option];
                        }
                      }}
                      onKeyDown={(e) => handleOptionKeyDown(e, index, option)}
                    >
                      {({ active, selected }) => (
                        <>
                          <div className="flex items-center">
                            {multiple && (
                              <div className="mr-2">
                                <FontAwesomeIcon
                                  icon={selected ? faSquareCheck : faSquare}
                                  className={`mr-2 h-[1.1rem] w-[1.1rem] cursor-pointer text-[1.1rem] ${
                                    selected || active ? 'filter-text-primary' : ''
                                  }`}
                                />
                              </div>
                            )}
                            <span className={classNames(selected && !active ? '' : '')}>
                              {optionRenderer
                                ? optionRenderer(option, selected)
                                : renderOptionLabel(option, selected, isChip, multiple, true, true)}
                            </span>
                          </div>
                          {selected && !multiple && (
                            <span
                              className={classNames(
                                'filter-text-primary right-0 flex items-center px-4'
                              )}
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </ComboboxOption>
                  );
                })
              ) : (
                <div className="flex-flex-row filter-text-sm text-default p-2 whitespace-nowrap">
                  No records found
                </div>
              )}
            </div>
          </div>
          <div
            className="bg-card mx-3 flex items-center justify-between border-t-[1px] py-4"
            style={{ minHeight: '24px' }}
          >
            {clearButtonReq && (
              <button
                id="filter_clear_selection"
                type="button"
                className={`flex text-xs ${selected?.label || selectedOptions.length > 0 ? 'filter-text-primary cursor-pointer' : 'cursor-not-allowed text-[#868686]'} `}
                onClick={() => {
                  clearSelection();
                }}
                ref={clearBtnRef}
                onKeyDown={handleKeyDown}
                disabled={!(selectedOptions?.length || selected)}
                aria-disabled={!(selectedOptions?.length || selected)}
                aria-label="Clear selection"
              >
                <span className="text-xs">Clear selection</span>
              </button>
            )}
            <div className="flex gap-2">
              {selectAllRequired && multiple && (
                <button
                  id="filter_select_all"
                  type="button"
                  className={`ml-2 flex text-xs ${!areAllOptionsSelected && options.length > 0 ? 'filter-text-primary cursor-pointer' : 'cursor-not-allowed text-[#868686]'} `}
                  onClick={() => {
                    selectAll();
                  }}
                  disabled={areAllOptionsSelected}
                  ref={selectAllBtnRef}
                  onKeyDown={handleKeyDown}
                  aria-disabled={areAllOptionsSelected}
                  aria-label="Select all options"
                >
                  <span className="text-xs">Select all</span>
                </button>
              )}
              <button
                tabIndex={0}
                aria-label={`Close ${label}`}
                type="button"
                className="filter-text-primary text-xs font-medium hover:underline"
                onClick={() => {
                  mainButtonRef?.current?.click();
                  mainButtonRef?.current?.focus?.();
                }}
                ref={closeButtonRef}
                onKeyDown={handleKeyDown}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Fix for handling clear button functionality
  const handleClearButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleSelectionChange(multiple ? [] : null);
      setTimeout(() => {
        if (mainButtonRef?.current) {
          mainButtonRef?.current?.focus?.();
        }
      }, 0);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen || !dropdownRef.current || event.key !== 'Tab') return;

      // Get all focusable elements within the dropdown
      const focusableElements = Array.from(
        dropdownRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) =>
          !el.disabled &&
          el.getAttribute('tabindex') !== '-1' &&
          el.type !== 'hidden' &&
          getComputedStyle(el).display !== 'none' &&
          getComputedStyle(el).visibility !== 'hidden'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Important: Get the currently focused element before preventing default
      const activeElement = document.activeElement;
      const currentIndex = focusableElements.indexOf(activeElement);

      // Prevent default tab behavior
      event.preventDefault();

      // Determine which element to focus next
      let nextElement;
      let nextIndex;

      if (event.shiftKey) {
        // Going backwards with Shift+Tab
        if (currentIndex <= 0) {
          nextElement = lastElement;
          nextIndex = focusableElements.length - 1;
        } else {
          nextIndex = currentIndex - 1;
          nextElement = focusableElements[nextIndex];
        }
      } else {
        // Going forwards with Tab
        if (currentIndex === focusableElements.length - 1 || currentIndex === -1) {
          nextElement = firstElement;
          nextIndex = 0;
        } else {
          nextIndex = currentIndex + 1;
          nextElement = focusableElements[nextIndex];
        }
      }

      // Apply focus with a slight delay to ensure the browser has finished processing
      if (nextElement) {
        event.stopPropagation(); // Prevent event bubbling
        setTimeout(() => {
          nextElement.focus({ preventScroll: false });
        }, 10);
      }
    };

    // Set initial focus when dropdown opens
    const setInitialFocus = () => {
      if (!isOpen || !dropdownRef.current) return;

      const focusableElements = Array.from(
        dropdownRef?.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) =>
          !el.disabled &&
          el.getAttribute('tabindex') !== '-1' &&
          el.type !== 'hidden' &&
          getComputedStyle(el).display !== 'none' &&
          getComputedStyle(el).visibility !== 'hidden'
      );
      const optionElements = optionsListRef?.current?.querySelectorAll('[role="option"]');
      if (focusableElements.length > 0 && optionElements?.length) {
        const firstOption = optionElements[0] as HTMLElement;
        firstOption?.setAttribute('tabindex', '-1');
      }
    };

    if (isOpen) {
      // Use capture phase to ensure our handler executes before other handlers
      document.addEventListener('keydown', handleKeyDown, true);
      setInitialFocus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);
  return (
    <>
      {loading ? (
        <div role="status" className="mt-4 max-w-sm animate-pulse">
          <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div
          className={`flex grow-1 flex-wrap items-baseline gap-1 ${classWrap} ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}
        >
          <Combobox
            suppressHydrationWarning={true}
            as="div"
            value={!multiple ? (selected?.value ? selected.value : null) : selectedOptions}
            aria-describedby={props?.['aria-describedby']}
            onBlur={(e: any) => {
              props?.onBlur && props?.onBlur(e);
            }}
            multiple={multiple}
            onChange={handleSelectionChange}
            className={classNames('relative flex-grow-1', props?.className)}
            name={name}
            disabled={disabled}
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
                      ref={mainButtonRef}
                      className={`flex items-center ${useUnderlineStyle ? '' : 'filter-round'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} focus-indicator filter-text-sm px-2 py-1.5 ${
                        useUnderlineStyle
                          ? `hover:border-primary focus:border-primary border-b-2 ${(selectedOptions?.length || selected?.label) && isOpen ? 'border-primary' : (selectedOptions?.length || selected?.label) && !isOpen ? 'border-primary' : isOpen && !(selectedOptions?.length || selected?.label) ? 'border-primary' : 'border-gray-300'}`
                          : `border-[1px] ${(selectedOptions?.length || selected?.label) && isOpen ? 'selected-opened-filter' : (selectedOptions?.length || selected?.label) && !isOpen ? 'selected-filter' : isOpen && !(selectedOptions?.length || selected?.label) ? 'opened-filter' : 'newState-filter'}`
                      } ${props?.buttonClassName}`}
                      id={id ? id + '_filter' : 'select_filter'}
                      onClick={() => {
                        openDropdown();
                      }}
                      disabled={disabled}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          openDropdown(true);
                        }
                      }}
                      aria-expanded={isOpen}
                    >
                      {dropIcon && (
                        <FontAwesomeIcon icon={dropIcon} className={`filter-icon mr-2`} />
                      )}
                      <div
                        className={`${(closeButtonReq && (selectedOptions?.length > 0 || selected?.label)) || (extraFilter && !selected?.label && !selectedOptions?.length) ? 'mr-8' : 'mr-2'} ${showChevronIcon && !selected && !selectedOptions?.length ? 'flex-1 justify-between' : ''} flex items-center ${props?.parentLabelClass ? props?.parentLabelClass : ''}`}
                      >
                        <span
                          className={`${hideLabelOnSelect ? (multiple ? (selectedOptions?.length ? 'hidden' : '') : selected?.label ? 'hidden' : '') : ''}`}
                        >
                          {label}
                        </span>
                        {multiple ? (
                          <>
                            {selectedOptions?.length > 0 && (
                              <span className={`${props?.labelClass ? props?.labelClass : ''}`}>
                                {!hideLabelOnSelect && (
                                  <span className="filter-selected-text px-2">|</span>
                                )}
                                <span
                                  className={`pr-2 text-[.8rem] font-semibold ${disabled ? '' : 'filter-selected-text'} focus-indicator whitespace-nowrap`}
                                >{`${selectedOptions?.length === 1 ? selectedOptions[0].label : selectedOptions.length + ' selected'}`}</span>
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {selected?.label && (
                              <span className={`${props?.labelClass ? props?.labelClass : ''}`}>
                                {!hideLabelOnSelect && <span className="px-2">|</span>}
                                <span
                                  className={`pr-2 text-[.8rem] font-semibold ${disabled ? '' : 'filter-selected-text'} whitespace-nowrap`}
                                >
                                  {selected?.label}
                                </span>
                              </span>
                            )}
                          </>
                        )}
                        {(useUnderlineStyle ||
                          (showChevronIcon && !selected && !selectedOptions?.length)) && (
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
                          />
                        )}
                      </div>
                      {closeButtonReq && (selectedOptions?.length > 0 || selected?.label) && (
                        <button
                          ref={clearXButtonRef}
                          aria-label={`Clear selection for ${label}`}
                          className="focus-indicator absolute top-1/2 right-3 z-10 flex -translate-y-1/2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectionChange(multiple ? [] : null);
                            // Add focus management to move focus forward after clearing
                            setTimeout(() => {
                              if (
                                mainButtonRef?.current &&
                                document.activeElement !== mainButtonRef?.current
                              ) {
                                mainButtonRef?.current?.focus?.();
                              }
                            }, 0);
                          }}
                          disabled={disabled}
                          onKeyDown={handleClearButtonKeyDown}
                        >
                          <FontAwesomeIcon
                            icon={isDarkTheme ? faXmark : faCircleXmark}
                            className={`filter-cross-btn h-5 w-5`}
                          />
                        </button>
                      )}
                      {addedFilter && !selected?.label && !selectedOptions?.length && (
                        <button
                          aria-label={`hide ${label} Filter`}
                          id="filter_remove_btn"
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFilter();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation();
                              removeFilter();
                              setFocus('addFilters');
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
                    disabled={disabled}
                    id={id ? id + '_filter' : 'select_filter'}
                    ref={mainButtonRef}
                    onClick={() => {
                      openDropdown();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        openDropdown();
                      }
                    }}
                    className={`focus-indicator ${btnEleClassname ? btnEleClassname : ''}`}
                    aria-expanded={isOpen}
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
      )}
    </>
  );
}
