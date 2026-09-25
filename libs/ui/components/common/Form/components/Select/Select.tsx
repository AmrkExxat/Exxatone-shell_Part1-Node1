import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleInfo,
  faCircleXmark,
} from '@fortawesome/pro-light-svg-icons';

import utils from './utils';
import renderOptionLabel from './RenderOptionLabel';
import { RenderLabel, type Option, type SelectProps } from '../../shared';
import { announce } from '@react-aria/live-announcer';
import { ShowMore } from '../../../ShowMore';
import RenderPreviousData from '../RenderPreviousData/RenderPreviousData';
import { Tooltip } from '../../../Tooltip';

export default function Select({
  label,
  options = [],
  control,
  multiple = false,
  name,
  id,
  testid,
  defaultValue,
  defaultValues,
  onChange,
  onBlur,
  rules,
  required = false,
  disabled = false,
  placeholder = 'Please select an option',
  loading = false,
  reset = false,
  searchable = false,
  addNewButton = false,
  handleAddNewButton,
  labelledby = '',
  onCloseTrigger,
  infoMsg,
  section,
  sendOptionForSingleSelect = false,
  autoSelectSingleIndependentValue = false,
  pendoId,
  LeadingIcon,
  errors = {},
  isDisableTextUI = false,
  showMoreProp = { maxLength: 2 },
  prevDefaultData = { label: 'Edited by Site', data: null },
  disabledLabel = null,
  fromModal = false,
  ...props
}: SelectProps<any>): JSX.Element {
  const [query, setQuery] = useState('');
  const initialFromModalCheck = useRef<boolean>(fromModal);
  const [selected, setSelected] = useState<Option | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const isError = Boolean(errors[name]?.message);

  const componentRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const chipRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousDataRender = useRef<any>({ data: null, prevData: null });
  const [enablePrevRender, setEnablePrevRender] = useState<boolean>(false);

  const soleOptionKey = useMemo(
    () => (options.length === 1 ? String(options[0]?.id ?? options[0]?.value ?? '') : ''),
    [options]
  );

  useEffect(() => {
    if (options.length > 0) {
      if (multiple) {
        if (defaultValues?.length) {
          setSelectedOptions(defaultValues);
          previousDataRender.current = {
            ...previousDataRender.current,
            data: defaultValues,
          };
        }
        if (prevDefaultData?.data?.length) {
          previousDataRender.current = {
            ...previousDataRender.current,
            prevData: prevDefaultData?.data,
          };
          setEnablePrevRender(true);
        }
      } else if (!multiple) {
        if (defaultValue !== undefined) {
          const option = options.find((option) => option.value === defaultValue) ?? null;
          previousDataRender.current = {
            ...previousDataRender.current,
            data: option,
          };
          setSelected(option);
        }
        if (prevDefaultData?.data) {
          const prevOption =
            options.find((option) => option.value === prevDefaultData?.data) ?? null;
          previousDataRender.current = {
            ...previousDataRender.current,
            prevData: prevOption,
          };
          if (prevOption) setEnablePrevRender(true);
        }
      }
    }
  }, [defaultValue, defaultValues, options, multiple]);

  /** Sole-option auto-select: runs when option list / reset / flag changes, not on user clear (defaultValues?.length stays 0). */
  useEffect(() => {
    if (!options.length || !multiple || disabled || loading || !autoSelectSingleIndependentValue) {
      return;
    }
    if (defaultValues?.length) return;
    if (options.length !== 1) return;

    const only = options[0];
    setSelectedOptions((prev) => {
      if (prev.length > 0) return prev;
      previousDataRender.current = {
        ...previousDataRender.current,
        data: [only],
      };
      queueMicrotask(() => {
        onChange?.([only]);
      });
      return [only];
    });
  }, [
    autoSelectSingleIndependentValue,
    soleOptionKey,
    disabled,
    multiple,
    loading,
    reset,
    defaultValues?.length,
  ]);

  useEffect(() => {
    if (reset) {
      setSelected(null);
      setSelectedOptions([]);
    }
  }, [reset]);

  const updateWithSection = (optionsList) => {
    const sectionIds = Object.keys(section);
    let listData = [];
    const withoutSection = optionsList.filter((k) => !k?.sectionId);
    for (let i = 0; i < sectionIds?.length; i++) {
      let data = optionsList.filter((k) => k.sectionId === sectionIds[i]);
      if (data?.length) {
        data = data.map((k) => {
          return { ...k, sectionName: null };
        });
        data[0].sectionName = section[sectionIds[i]];
        listData = [...listData, ...data];
      }
    }
    if (withoutSection?.length) {
      listData = [...listData, ...withoutSection];
    }
    return listData;
  };

  const filteredOptions = useMemo(() => {
    if (!query || query.length === 0) {
      return section && options?.length ? updateWithSection(options) : options;
    }
    let optionsList = options.filter((option) =>
      option?.label?.toLowerCase()?.includes(query.toLowerCase())
    );
    return section && optionsList?.length ? updateWithSection(optionsList) : optionsList;
  }, [query, options]);

  useEffect(() => {
    optionRefs.current = optionRefs?.current?.slice(0, filteredOptions.length);
  }, [filteredOptions.length]);

  const getPlaceholder = useMemo(() => {
    if (multiple && selectedOptions.length) {
      return `${selectedOptions?.map((option) => option?.label).join(', ')}`;
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
      const option = utils.findSelectedOptionByValue(value, options);
      setSelected(option);
      onChange?.(sendOptionForSingleSelect ? option : value);
      if (initialFromModalCheck?.current) {
        initialFromModalCheck.current = false;
        clearSearch();
        setIsOpen(false);
        onCloseTrigger?.();
      }
    }
  };

  const announceOptionsList = (): void => {
    const totalVisibleOptions = filteredOptions.length;
    announce(
      `${accessibleLabel} options list with ${totalVisibleOptions} ${totalVisibleOptions === 1 ? 'item' : 'items'}. Use arrow keys to navigate.`
    );
  };

  function removeListboxRoleAttribute() {
    const timeout = setTimeout(() => {
      const specificListbox = document.querySelector('div.bg-card.shadow-lg.z-50[role="listbox"]');
      if (specificListbox) {
        specificListbox.removeAttribute('role');
      }
    }, 200);

    return () => clearTimeout(timeout);
  }

  const handleChipRemove = (e: React.MouseEvent | React.KeyboardEvent, optionToRemove: Option) => {
    e.preventDefault();
    e.stopPropagation();

    const currentIndex = selectedOptions.findIndex((opt) => opt.value === optionToRemove.value);
    const newSelectedOptions = selectedOptions.filter(
      (option) => option.value !== optionToRemove.value
    );
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);

    setTimeout(() => {
      if (newSelectedOptions.length === 0) {
        inputRef.current?.focus();
      } else {
        const nextChip = selectedOptions[currentIndex + 1];
        const prevChip = selectedOptions[currentIndex - 1];

        if (nextChip) {
          chipRefs?.current[nextChip.value]?.focus();
        } else if (prevChip) {
          chipRefs?.current[prevChip.value]?.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    }, 0);
  };

  const handleOptionKeySelect = (option: Option) => {
    if (multiple) {
      const isSelected = selectedOptions.some((selected) => selected?.value === option?.value);

      const newSelectedOptions = isSelected
        ? selectedOptions.filter((selected) => selected?.value !== option.value)
        : [...selectedOptions, option];

      setSelectedOptions(newSelectedOptions);
      onChange?.(newSelectedOptions);

      setTimeout(() => {
        optionRefs.current[activeIndex]?.focus();
      }, 10);
    } else {
      setSelected(utils.findSelectedOptionByValue(option.value, options));
      onChange?.(sendOptionForSingleSelect ? option : option.value);
      clearSearch();
      setIsOpen(false);
      onCloseTrigger?.();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const clearSearch = (): void => {
    setQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.type === 'blur') return;
      if (
        !componentRef.current?.contains(event.target as Node) &&
        !optionsRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onCloseTrigger?.();
        clearSearch();
      }
    };
    if (inputRef.current) {
      inputRef.current.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    if (dropdownButtonRef.current) {
      dropdownButtonRef.current.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      dropdownButtonRef.current.removeAttribute('aria-haspopup');
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      removeListboxRoleAttribute();
    }
    announce(isOpen ? 'Expanded' : 'Collapsed');

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = (state?: boolean): void => {
    const newState = state !== undefined ? state : !isOpen;
    setIsOpen(newState);
    if (!newState) {
      clearSearch();
    }
  };

  const handleOptionMouseEnter = (index: number) => {
    if (!isKeyboardNavigation) {
      setActiveIndex(index);
    }
  };

  const handleOptionMouseMove = () => {
    setIsKeyboardNavigation(false);
  };

  const handleKeyNavigation = (e: React.KeyboardEvent, currentId: string) => {
    const getFocusableElements = () => {
      const elements = [];
      elements.push({ id: 'input', element: inputRef.current });
      if (query) elements.push({ id: 'clearButton', element: clearButtonRef.current });
      selectedOptions.forEach((option) => {
        elements.push({
          id: `chip-${option.value}`,
          element: document.getElementById(`chip-close-btn-${option.value}`),
        });
      });
      if (isOpen && filteredOptions.length > 0) {
        elements.push({ id: 'firstOption', element: optionRefs.current[0] });
      }
      if (addNewButton && isOpen) {
        elements.push({ id: 'addNewButton', element: document.getElementById('add_new_btn') });
      }
      elements.push({ id: 'closeButton', element: closeButtonRef.current });
      return elements.filter((el) => el.element);
    };

    const moveFocus = (direction: 'next' | 'prev') => {
      if (!isOpen) return;
      const elements = getFocusableElements();
      const currentIndex = elements.findIndex((el) => el.id === currentId);
      if (currentIndex === -1) return;

      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % elements.length
          : (currentIndex - 1 + elements.length) % elements.length;

      const nextElement = elements[nextIndex]?.element;
      if (nextElement) {
        if (elements[nextIndex].id === 'clearButton') {
          setTimeout(() => {
            nextElement?.focus();
          }, 10);
        } else {
          nextElement?.focus();
        }
        if (elements[nextIndex].id === 'firstOption') {
          announceOptionsList();
          setActiveIndex(0);
        }
      }
    };

    const handleOptionTab = (shiftKey: boolean) => {
      const elements = getFocusableElements();
      const optionIndex = elements.findIndex((el) => el.id === 'firstOption');

      if (shiftKey) {
        const prevElement = elements[optionIndex - 1]?.element;
        if (prevElement) {
          prevElement.focus();
        } else {
          elements[elements.length - 1].element?.focus();
        }
      } else {
        const nextElement = elements[optionIndex + 1]?.element;
        if (nextElement) {
          nextElement.focus();
        } else {
          elements[0].element?.focus();
        }
      }
    };

    switch (e.key) {
      case 'Tab':
        if (isOpen) {
          if (currentId.startsWith('option-')) {
            e.preventDefault();
            handleOptionTab(e.shiftKey);
          } else if (currentId === 'input' && query) {
          } else {
            e.preventDefault();
            moveFocus(e.shiftKey ? 'prev' : 'next');
          }
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        if (currentId === 'input' && multiple && selectedOptions.length > 0) {
          const firstChip = selectedOptions[0];
          const firstChipBtn = document.getElementById(`chip-close-btn-${firstChip.value}`);
          if (firstChipBtn) {
            firstChipBtn.focus();
            return;
          }
        }
        if (currentId.startsWith('option-')) {
          const currentIndex = parseInt(currentId.split('-')[1]);
          const nextIndex = currentIndex < filteredOptions.length - 1 ? currentIndex + 1 : 0;
          setTimeout(() => {
            optionRefs.current[nextIndex]?.focus();
          }, 10);
          setActiveIndex(nextIndex);
        } else {
          if (!isOpen) setIsOpen(true);
          if (filteredOptions.length > 0) {
            setTimeout(() => {
              announceOptionsList();
              optionRefs.current[0]?.focus();
            }, 100);
          }
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (currentId.startsWith('option-')) {
          const currentIndex = parseInt(currentId.split('-')[1]);
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredOptions.length - 1;
          optionRefs.current[nextIndex]?.focus();
          setActiveIndex(nextIndex);
        } else if (currentId === 'input' && query) {
          clearButtonRef.current?.focus();
        }
        break;

      case ' ':
      case 'Enter':
        if (currentId === 'input') {
          if (e.key === ' ' && query.length > 0) {
            return;
          }
          e.preventDefault();
          toggleDropdown();
          if (!isOpen && filteredOptions.length > 0) {
            setTimeout(() => {
              announceOptionsList();
            }, 100);
          }
        } else if (currentId.startsWith('option-')) {
          e.preventDefault();
          const index = parseInt(currentId.split('-')[1]);
          const option = filteredOptions[index];
          handleOptionKeySelect(option);
        } else if (currentId === 'clearButton') {
          e.preventDefault();
          clearSearch();
          inputRef.current?.focus();
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        onCloseTrigger?.();
        clearSearch();
        inputRef.current?.focus();
        break;

      default:
        if (!isOpen && !e.shiftKey && e.key.length === 1) {
          setIsOpen(true);
        }
        break;
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Shift') return;
    handleKeyNavigation(e, 'input');
  };

  const handleClearButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    handleKeyNavigation(e, 'clearButton');
  };

  const handleChipKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    optionValue: string,
    chipIndex: number
  ): void => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const totalChips = selectedOptions.length;
      let nextIndex;

      if (e.key === 'ArrowRight') {
        nextIndex = chipIndex < totalChips - 1 ? chipIndex + 1 : 0;
      } else {
        nextIndex = chipIndex > 0 ? chipIndex - 1 : totalChips - 1;
      }

      const nextChipId = `chip-close-btn-${selectedOptions[nextIndex].value}`;
      document.getElementById(nextChipId)?.focus();
    } else {
      handleKeyNavigation(e, `chip-${optionValue}`);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, index: number): void => {
    handleKeyNavigation(e, `option-${index}`);
  };
  const accessibleLabel = label ? `${label}` : labelledby ? labelledby : placeholder;

  const comboboxInputCh = () => {
    return (
      <ComboboxInput
        ref={inputRef}
        value={query}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = event?.target?.value ?? '';
          setQuery(newValue);
          if (!isOpen && newValue) {
            setIsOpen(true);
          }
        }}
        onKeyDown={(e) => {
          handleInputKeyDown(e);
        }}
        onClick={() => toggleDropdown(true)}
        placeholder={getPlaceholder}
        aria-invalid={isError}
        aria-describedby={isError ? `${id}-error` : undefined}
        className={`text-default bg-input w-full rounded-md border py-1.5 ${props?.inputClass ?? ''} ${LeadingIcon ? 'pl-9' : 'pl-3'} disabled:text-disabled disabled:bg-disabled disabled:bg-opacity-75 focus-indicator pr-10 shadow-sm placeholder:text-[#5D5D5D] disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:shadow-none sm:text-sm sm:leading-6`}
        aria-label={`${`${accessibleLabel} ${multiple && selectedOptions?.length > 0 ? `${selectedOptions?.length} Options selected` : ''}`}`}
        id={pendoId || id}
        aria-expanded={isOpen ? true : false}
        onBlur={(event) => {
          const nextTarget = event.relatedTarget as Node | null;
          if (
            nextTarget &&
            (componentRef.current?.contains(nextTarget) || optionsRef.current?.contains(nextTarget))
          ) {
            return;
          }
          onBlur?.(event);
        }}
      />
    );
  };

  return (
    <>
      {loading ? (
        <div role="status" className="mt-4 max-w-sm animate-pulse">
          <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div ref={componentRef} className="flex w-full grow-1 flex-wrap items-baseline gap-1">
          <Combobox
            as="div"
            ref={comboboxRef}
            value={disabled ? getPlaceholder : multiple ? selectedOptions : selected}
            multiple={multiple}
            onChange={handleSelectionChange}
            className={classNames('relative mb-2 w-full flex-grow-1', props?.className)}
            name={name}
            disabled={disabled}
          >
            {prevDefaultData?.data && enablePrevRender && disabled ? (
              <div className="flex w-full flex-wrap items-center justify-between gap-1">
                {RenderLabel({ label, id: pendoId || id, required, disabled, infoMsg })}
                <RenderPreviousData
                  label={prevDefaultData?.label}
                  id={id}
                  data={previousDataRender?.current?.data}
                  previousData={previousDataRender?.current?.prevData}
                  dataType={multiple ? 'list' : 'object'}
                />
              </div>
            ) : (
              RenderLabel({ label, id: pendoId || id, required, disabled, infoMsg })
            )}
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
              <div className="relative mt-1">
                {LeadingIcon && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {LeadingIcon}
                  </div>
                )}
                {disabledLabel && disabled ? (
                  <Tooltip
                    triggerWrapperClass={'flex'}
                    triggerElement={() => <>{comboboxInputCh()}</>}
                    tooltip={() => (
                      <span className="p-3 text-sm text-gray-700">{disabledLabel}</span>
                    )}
                  />
                ) : (
                  <>{comboboxInputCh()}</>
                )}

                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  {query !== '' && (
                    <button
                      ref={clearButtonRef}
                      type="button"
                      tabIndex={0}
                      className={classNames(
                        'text-default inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg',
                        'focus-indicator hover:ring-primary hover:ring-2'
                      )}
                      onKeyDown={handleClearButtonKeyDown}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearSearch();
                        setTimeout(() => {
                          inputRef.current?.focus();
                        }, 0);
                      }}
                      aria-label={`Clear ${label || ''} search`}
                    >
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="focus-indicator text-secondary h-4 w-4"
                        aria-hidden="true"
                      />
                    </button>
                  )}

                  <ComboboxButton
                    ref={dropdownButtonRef}
                    className={classNames(
                      'focus-indicator hover:ring-primary group z-50 inline-flex items-center rounded-md px-2 py-1 hover:ring-2 focus:outline-none',
                      props?.buttonClassName
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown();
                    }}
                    aria-label={`${accessibleLabel}`}
                  >
                    {multiple && selectedOptions?.length > 0 && (
                      <>
                        <div
                          className="bg-primary-50 text-primary mr-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-xs"
                          aria-hidden="true"
                        >
                          {selectedOptions?.length}
                        </div>
                        <span
                          id="selected-count-status"
                          className="sr-only"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {selectedOptions.length} {selectedOptions.length === 1 ? 'item' : 'items'}{' '}
                          selected
                        </span>
                      </>
                    )}
                    <FontAwesomeIcon
                      icon={isOpen ? faChevronUp : faChevronDown}
                      className="text-secondary h-3 w-3"
                      aria-hidden="true"
                    />
                  </ComboboxButton>
                </div>

                {isOpen && (
                  <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={classNames(
                      'bg-card mt-1 w-[var(--input-width)] rounded-md border shadow-lg [--anchor-gap:var(--spacing-1)] focus:outline-none',
                      'z-50 flex flex-col gap-1 p-1',
                      props?.optionsContainerClassName
                    )}
                    static
                    hold={true}
                    id={`${pendoId || id}-listbox`}
                    ref={optionsRef}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsOpen(false);
                        onCloseTrigger?.();
                        inputRef.current?.focus();
                      }
                    }}
                    style={{ cursor: 'default' }}
                  >
                    <div className="relative flex h-full flex-col">
                      {multiple && selectedOptions.length > 0 && (
                        <>
                          <div
                            className="mx-2 mt-2 mb-3 flex max-h-[150px] flex-wrap gap-y-3 overflow-y-auto"
                            role="group"
                            aria-label={`Selected options`}
                          >
                            <ul className="m-0 flex list-none flex-wrap gap-y-3 p-0">
                              {selectedOptions.map((option, chipIndex) => (
                                <li key={option.value} className="m-0 p-0">
                                  <span
                                    key={option.value}
                                    className="bg-primary-50 text-primary me-2 inline-flex items-center rounded px-2 py-1 text-xs font-medium break-all"
                                  >
                                    {option.label}
                                    <button
                                      ref={(el) => {
                                        chipRefs.current[option.value] = el;
                                      }}
                                      id={`chip-close-btn-${option.value}`}
                                      type="button"
                                      className="link-text text-primary hover:bg-primary-100 hover:text-primary ms-2 inline-flex items-center rounded-md bg-transparent p-1 text-sm"
                                      aria-label={`Remove ${option.label}`}
                                      onClick={(e) => handleChipRemove(e, option)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          e.preventDefault();
                                          handleChipRemove(e, option);
                                        } else {
                                          handleChipKeyDown(e, option.value, chipIndex);
                                        }
                                      }}
                                    >
                                      <svg
                                        className="h-2 w-2"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                      >
                                        <path
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                      </svg>
                                      <span className="sr-only">Remove {option.label}</span>
                                    </button>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="mb-2 w-full border-t" />
                            </div>
                          </div>
                        </>
                      )}

                      <div
                        className="max-h-[300px] flex-1 overflow-y-auto"
                        aria-multiselectable={multiple}
                        aria-labelledby={accessibleLabel}
                        role="listbox"
                        tabIndex={-1}
                      >
                        {filteredOptions.length > 0 ? (
                          <div className="flex flex-col">
                            {filteredOptions?.map((option: Option, index) => {
                              const isOptionSelected = multiple
                                ? selectedOptions.some((item) => item?.value === option?.value)
                                : selected?.value === option?.value;

                              return (
                                <React.Fragment key={option?.id ?? option?.value}>
                                  {option?.sectionName && (
                                    <div className="mb-1 ml-1 border-b-[1px] p-1 text-sm font-semibold">
                                      {option.sectionName}
                                    </div>
                                  )}
                                  <ComboboxOption
                                    key={option?.id ?? option?.value}
                                    value={multiple ? option : option?.value}
                                    className={classNames(
                                      'relative cursor-pointer rounded-md py-2 pr-9 pl-3 select-none',
                                      index === activeIndex ? 'bg-hover' : 'text-default',
                                      props?.optionClassName
                                    )}
                                    onClick={() => {
                                      setActiveIndex(index);
                                      if (!multiple) {
                                        setTimeout(() => {
                                          clearSearch();
                                          setIsOpen(false);
                                          onCloseTrigger?.();
                                          inputRef.current?.focus();
                                        }, 0);
                                      }
                                    }}
                                  >
                                    {() => (
                                      <div
                                        onKeyDown={(e) => handleOptionKeyDown(e, index)}
                                        onMouseEnter={() => handleOptionMouseEnter(index)}
                                        onMouseMove={(e) => {
                                          handleOptionMouseMove();
                                          handleOptionMouseEnter(index);
                                        }}
                                        ref={(el) => {
                                          if (el) {
                                            optionRefs.current[index] = el;
                                          }
                                        }}
                                        tabIndex={0}
                                        role="option"
                                        aria-selected={isOptionSelected}
                                        id={`option-${option?.value}`}
                                        className="focus-visible:outline-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                      >
                                        {renderOptionLabel(option, isOptionSelected)}
                                        {isOptionSelected && (
                                          <span
                                            className={classNames(
                                              'text-primary absolute inset-y-0 right-0 flex items-center px-4'
                                            )}
                                            aria-hidden="true"
                                          >
                                            <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </ComboboxOption>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex-flex-row text-default p-2 text-sm">
                            No records found
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 border-t">
                        {addNewButton && (
                          <button
                            data-add-new-button
                            id="add_new_btn"
                            className="text-primary focus:ring-primary px-2 text-xs hover:underline focus:ring"
                            onClick={(e) => {
                              setIsOpen(false);
                              onCloseTrigger?.();
                              handleAddNewButton && handleAddNewButton?.();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault();
                                closeButtonRef.current?.focus();
                              } else {
                                handleKeyNavigation(e, 'addNewButton');
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            Add New
                          </button>
                        )}
                        <button
                          ref={closeButtonRef}
                          type="button"
                          className="link-text text-primary px-2 text-xs"
                          aria-label={`close ${accessibleLabel}`}
                          onClick={() => {
                            setIsOpen(false);
                            onCloseTrigger?.();
                            setTimeout(() => inputRef.current?.focus(), 0);
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onKeyDown={(e) => handleKeyNavigation(e, 'closeButton')}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </ComboboxOptions>
                )}
              </div>
            )}
          </Combobox>
          {isError && (
            <p className="-mt-2 text-xs text-red-600" id={`${id}-error`} role="alert">
              {typeof errors[name]?.message === 'string' ? errors[name]?.message : ''}
            </p>
          )}
        </div>
      )}
    </>
  );
}
