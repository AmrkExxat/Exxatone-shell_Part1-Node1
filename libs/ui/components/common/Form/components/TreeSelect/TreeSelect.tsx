/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOptions } from '@headlessui/react';
import React, { useEffect, useState, useRef, KeyboardEvent, JSX, ReactNode } from 'react';

import { classNames, isPropValid } from './utils';
import { type TreeSelectOption, type TreeSelectProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleXmark,
} from '@fortawesome/pro-light-svg-icons';
import { RenderLabel } from '../../shared';
import { announce } from '@react-aria/live-announcer';
import { ShowMoreTree } from '../../../ShowMoreTree';
import { RenderPreviousData } from '../RenderPreviousData';

const TreeSelect = ({
  isDisableTextUI = false,
  showMoreProp = { maxLength: 1 },
  prevDefaultData = { label: 'Edited by Site', data: null },
  ...props
}: TreeSelectProps): JSX.Element => {
  const [selectedRawNodes, setSelectedRawNodes] = useState<TreeSelectOption[]>([]);
  const [forceRefocus, setForceRefocus] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const [visibleOptions, setVisibleOptions] = useState<TreeSelectOption[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const [rawNodes, setRawNodes] = useState<TreeSelectOption[]>([]);
  const [filteredRawNodes, setFilteredRawNodes] = useState<TreeSelectOption[]>([]);

  const viewType = props?.type ?? 'checkbox';
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [prevSelectedList, setPrevSelectedList] = useState<any>(null);

  function removeListboxRoleAttribute() {
    const timeout = setTimeout(() => {
      const specificListbox = document.querySelector(
        'div.bg-card.z-50[role="listbox"][id^="headlessui-combobox-options"]'
      );
      if (specificListbox) {
        specificListbox.removeAttribute('role');
      }
    }, 200);

    return () => clearTimeout(timeout);
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
      clearSearch();
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const count = visibleOptions.length;
      if (searchKey && searchKey.trim()) {
        announce(
          count === 0 ? 'No records found' : `${count} record${count === 1 ? '' : 's'} found`
        );
      } else {
        announce(`${count} record${count === 1 ? '' : 's'} found`);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [searchKey]);

  useEffect(() => {
    if (isPropValid(props?.options) && props?.options?.length > 0) {
      const rawNodesData = props?.options.flatMap((item) => [item, ...(item?.children ?? [])]);

      setRawNodes(rawNodesData);

      setDefaultSelected(rawNodesData, props?.defaultValues, true);
      if (prevDefaultData?.data?.length && props?.disabled) {
        setDefaultSelected(rawNodesData, prevDefaultData?.data, false);
      }
    }
  }, [props?.options]);

  useEffect(() => {
    if (!searchKey || searchKey.length === 0) {
      setFilteredRawNodes(rawNodes);
    }
  }, [rawNodes]);

  useEffect(() => {
    if (searchKey !== undefined && searchKey !== null && searchKey?.length > 0) {
      filterNodes(searchKey);
    } else {
      setFilteredRawNodes(rawNodes);
    }
  }, [searchKey]);

  useEffect(() => {
    updateVisibleOptions();
  }, [filteredRawNodes]);

  const updateVisibleOptions = () => {
    const visibleOpts: TreeSelectOption[] = [];
    const rootOptions = filteredRawNodes.filter((option) => !option.parentId);
    rootOptions.forEach((option) => {
      visibleOpts.push(option);

      if (option.isExpanded) {
        const children =
          searchKey && searchKey.length > 0
            ? getMatchingChildrenByParentId(option.id)
            : getChildrenByParentId(option.id);

        visibleOpts.push(...children);
      }
    });
    if (props?.bifurcate && props?.sections?.length > 0) {
      if (visibleOpts?.length) {
        const updatedOptions = [];
        for (let i = 0; i < props?.sections.length; i++) {
          const section = props?.sections?.[i];
          if (section) {
            const sectionOptions = visibleOpts.filter((op) => op?.section === section);
            if (sectionOptions?.length) {
              sectionOptions[0].showSectionHeader = true;
              updatedOptions.push(...sectionOptions);
            }
          }
        }
        setVisibleOptions(updatedOptions);
      } else {
        setVisibleOptions(visibleOptions);
      }
    } else {
      setVisibleOptions(visibleOpts);
    }

    if (document.activeElement === inputRef.current) {
      setFocusedOptionIndex(-1);
    }
  };

  const setDefaultSelected = (
    inputRawNodes: TreeSelectOption[],
    defaultVals: any,
    canSetRawNodes: boolean
  ): void => {
    if (
      inputRawNodes !== undefined &&
      inputRawNodes !== null &&
      inputRawNodes?.length > 0 &&
      defaultVals !== undefined &&
      defaultVals !== null &&
      defaultVals?.length > 0
    ) {
      let effectiveDefaultValues = defaultVals;

      // For radio type, we need to filter the default values to only include the last item and its related nodes
      if (viewType === 'radio' && effectiveDefaultValues.length > 0) {
        const lastItemId = effectiveDefaultValues[effectiveDefaultValues.length - 1];
        const lastItem = inputRawNodes.find((node) => node.id === lastItemId);

        const validSelections: string[] = [];

        if (lastItem) {
          validSelections.push(lastItemId);

          if (lastItem.parentId) {
            validSelections.push(lastItem.parentId);

            const siblings = inputRawNodes.filter(
              (node) =>
                node.parentId === lastItem.parentId && effectiveDefaultValues.includes(node.id)
            );

            siblings.forEach((sibling) => {
              if (!validSelections.includes(sibling.id)) {
                validSelections.push(sibling.id);
              }
            });
          }
        }

        effectiveDefaultValues = validSelections;
      }

      let updatedOptions = inputRawNodes.map((prevOption: TreeSelectOption) => {
        if (effectiveDefaultValues.includes(prevOption?.id)) {
          return {
            ...prevOption,
            isChecked: true,
            isIndeterminate: false,
          };
        } else {
          return {
            ...prevOption,
            isChecked: false,
            isIndeterminate: false,
          };
        }
      });

      if (viewType === 'radio') {
        updatedOptions = updatedOptions.map((node) => {
          if (node.isParent && node.children && node.children.length > 0) {
            const hasSelectedChild = node.children.some((child) =>
              effectiveDefaultValues.includes(child.id)
            );

            return {
              ...node,
              isChecked: effectiveDefaultValues.includes(node.id) || hasSelectedChild,
              isIndeterminate: false, // Radio doesn't use indeterminate state It's checked and checked if one child is presnt.
            };
          }
          return node;
        });
      } else {
        updatedOptions = updatedOptions.map((node) => {
          if (node.isParent && node.children && node.children.length > 0) {
            const childrenIds = node.children.map((child) => child.id);
            const childNodes = updatedOptions.filter((option) => childrenIds.includes(option.id));

            const checkedChildrenCount = childNodes.filter((child) =>
              effectiveDefaultValues.includes(child.id)
            ).length;

            if (checkedChildrenCount === 0) {
              return {
                ...node,
                isChecked: effectiveDefaultValues.includes(node.id),
                isIndeterminate: false,
              };
            } else if (checkedChildrenCount === childNodes.length) {
              return {
                ...node,
                isChecked: true,
                isIndeterminate: false,
              };
            } else {
              return {
                ...node,
                isChecked: false,
                isIndeterminate: true,
              };
            }
          }
          return node;
        });
      }
      if (canSetRawNodes) {
        setRawNodes(updatedOptions);
      } else {
        getPrevSelectedRawNodes(updatedOptions);
      }
    }
  };

  const getPrevSelectedRawNodes = (rawOps: any) => {
    if (rawOps !== undefined && rawOps !== null && rawOps?.length > 0) {
      const allSelectedNodes = rawOps?.filter((item: any) => {
        if (item.isChecked) return true;

        if (item.isIndeterminate) return true;

        if (item.isParent && item.children && item.children.some((child: any) => child.isChecked))
          return true;

        return false;
      });
      setPrevSelectedList(allSelectedNodes);
    }
  };

  useEffect(() => {
    if (rawNodes !== undefined && rawNodes !== null && rawNodes?.length > 0) {
      const allSelectedNodes = rawNodes?.filter((item) => {
        if (item.isChecked) return true;

        if (item.isIndeterminate) return true;

        if (item.isParent && item.children && item.children.some((child) => child.isChecked))
          return true;

        return false;
      });

      setSelectedRawNodes(allSelectedNodes);
    }
  }, [rawNodes]);

  const getMatchingChildrenByParentId = (parentId: string): TreeSelectOption[] => {
    if (!searchKey || searchKey.length === 0) return getChildrenByParentId(parentId);

    const formattedSearchKey = searchKey?.trim()?.toLowerCase();
    return rawNodes?.filter(
      (item) =>
        item?.parentId === parentId &&
        item?.label?.trim()?.toLowerCase()?.includes(formattedSearchKey)
    );
  };

  const filterNodes = (searchKey: string | undefined): void => {
    if (searchKey !== undefined && searchKey !== null && searchKey?.length > 0) {
      const formattedSearchKey = searchKey?.trim()?.toLowerCase();
      const matchingNodes = rawNodes.filter((node) =>
        node?.label?.trim()?.toLowerCase()?.includes(formattedSearchKey)
      );

      const parentIdsOfMatchingChildren = matchingNodes
        .filter((node) => node.parentId)
        .map((node) => node.parentId);

      const parentsOfMatchingChildren = rawNodes.filter((node) =>
        parentIdsOfMatchingChildren.includes(node.id)
      );

      const filteredNodes = [...matchingNodes, ...parentsOfMatchingChildren];

      const uniqueFilteredNodes = filteredNodes.filter(
        (node, index, self) => index === self.findIndex((n) => n.id === node.id)
      );

      if (parentIdsOfMatchingChildren.length > 0) {
        const updatedNodes = rawNodes.map((node) => {
          if (parentIdsOfMatchingChildren.includes(node.id)) {
            return { ...node, isExpanded: true };
          }
          return node;
        });
        setRawNodes(updatedNodes);
      }

      setFilteredRawNodes(uniqueFilteredNodes);
    } else {
      setFilteredRawNodes(rawNodes);
    }
  };

  const toggleExpanded = (optionId: string): void => {
    setRawNodes((prevOptions: TreeSelectOption[]) => {
      const newExpandedState = !rawNodes.find((item) => item.id === optionId)?.isExpanded;
      announce(`${newExpandedState ? 'expanded' : 'collapsed'}`);
      const updatedOptions = prevOptions.map((prevOption: TreeSelectOption) => {
        if (prevOption?.id === optionId) {
          return {
            ...prevOption,
            isExpanded: !prevOption.isExpanded,
          };
        }
        return prevOption;
      });
      return updatedOptions;
    });

    setTimeout(updateVisibleOptions, 0);
  };

  const handleChipRemove = (optionId: string, index: number): void => {
    const selectableParentNodes = selectedRawNodes.filter(
      (node) => node.isParent && (node.isChecked || node.isIndeterminate)
    );
    const totalChips = selectableParentNodes.length;

    toggleChecked(optionId, false, true);

    setTimeout(() => {
      if (totalChips > 1) {
        let nextIndex = index == 0 ? 1 : index - 1;
        if (index >= totalChips - 1) {
          nextIndex = index - 1;
        }

        if (nextIndex >= 0) {
          // Try to find the next chip to focus
          const nextChip = selectableParentNodes[nextIndex];
          if (nextChip) {
            const chipElement = document.getElementById(`chip-close-btn-${nextChip.id}`);
            if (chipElement) {
              chipElement.focus();
            } else {
              inputRef.current?.focus();
            }
          } else {
            inputRef.current?.focus();
          }
        } else {
          inputRef.current?.focus();
        }
      } else {
        inputRef.current?.focus();
      }
    }, 100);
  };

  const toggleChecked = (
    optionId: string,
    value: boolean,
    isParent: boolean = false,
    parentId?: string
  ): void => {
    if (!isParent && parentId !== undefined && parentId !== null && parentId?.length > 0) {
      // Child node toggled
      const updatedOptions = rawNodes.map((prevOption: TreeSelectOption) => {
        // Check if this is the parent of the toggled child
        // Update this part of your toggleChecked function for radio type
        if (prevOption?.id === parentId) {
          // Update the specific child
          prevOption.children = prevOption?.children?.map((prevChildOption: TreeSelectOption) => {
            if (prevChildOption?.id === optionId) {
              return {
                ...prevChildOption,
                isChecked: value,
              };
            }
            return prevChildOption;
          });

          // For radio type, parent should be checked even if one child is checked
          if (viewType === 'radio' && value) {
            prevOption.isChecked = true;
            prevOption.isIndeterminate = false;
          } else {
            // Original checkbox behavior
            if (
              prevOption.children !== undefined &&
              prevOption.children !== null &&
              prevOption.children?.length > 0
            ) {
              const checkedChildren = prevOption?.children?.filter((item) => item?.isChecked) ?? [];

              if (checkedChildren?.length === 0) {
                // No checked children
                prevOption.isChecked = false;
                prevOption.isIndeterminate = false;
              } else if (checkedChildren?.length === prevOption?.children?.length) {
                // All children checked
                prevOption.isChecked = true;
                prevOption.isIndeterminate = false;
              } else {
                // Some children checked - indeterminate state
                prevOption.isChecked = viewType === 'radio' ? true : false;
                prevOption.isIndeterminate = viewType === 'radio' ? false : true;
              }
            }
          }
          return prevOption;
        } else if (prevOption?.id === optionId) {
          return {
            ...prevOption,
            isChecked: value,
          };
        } else {
          if (viewType === 'radio') {
            // For radio mode, when a child is clicked:
            // 1. If this is another parent, unselect it and all its children
            if (prevOption.isParent && prevOption.id !== parentId) {
              return {
                ...prevOption,
                isChecked: false,
                isIndeterminate: false,
                children: prevOption.children?.map((child) => ({
                  ...child,
                  isChecked: false,
                })),
              };
            }
            // 2. If this is a child of another parent, unselect it
            else if (prevOption.parentId && prevOption.parentId !== parentId) {
              return {
                ...prevOption,
                isChecked: false,
              };
            }
            return prevOption;
          } else {
            return prevOption;
          }
        }
      });

      setRawNodes(updatedOptions);
      setFilteredRawNodes((prevFilteredNodes) => {
        return prevFilteredNodes.map((node) => {
          const updatedNode = updatedOptions.find((item) => item.id === node.id);
          return updatedNode || node;
        });
      });
      emitOnChange(updatedOptions);
    } else {
      const childrenIds = rawNodes
        ?.find((item) => item?.id === optionId)
        ?.children?.map((item) => {
          return item?.id;
        });

      const updatedOptions = rawNodes.map((prevOption: TreeSelectOption) => {
        if (prevOption?.id === optionId) {
          const updatedChildren = prevOption?.children?.map((prevChildOption: TreeSelectOption) => {
            return {
              ...prevChildOption,
              isChecked: value,
            };
          });

          return {
            ...prevOption,
            isChecked: value,
            isIndeterminate: false, // Clear indeterminate state when explicitly checked/unchecked
            isExpanded: value, // We'll set this value after discussion with Elizabeth.
            children: updatedChildren,
          };
        } else if (
          childrenIds !== undefined &&
          childrenIds !== null &&
          childrenIds?.includes(prevOption.id)
        ) {
          return {
            ...prevOption,
            isChecked: value,
          };
        } else {
          if (viewType === 'radio') {
            // In radio mode:
            // 1. If this is another parent, uncheck it and all its children
            if (prevOption.isParent && prevOption.id !== optionId) {
              return {
                ...prevOption,
                isChecked: false,
                isIndeterminate: false,
                children: prevOption.children?.map((child) => ({
                  ...child,
                  isChecked: false,
                })),
              };
            }
            // 2. If this is a child of another parent, uncheck it
            else if (prevOption.parentId && !childrenIds?.includes(prevOption.id)) {
              return {
                ...prevOption,
                isChecked: false,
              };
            }
            return prevOption;
          } else {
            return prevOption;
          }
        }
      });
      setRawNodes(updatedOptions);
      setFilteredRawNodes((prevFilteredNodes) => {
        return prevFilteredNodes.map((node) => {
          const updatedNode = updatedOptions.find((item) => item.id === node.id);
          return updatedNode || node;
        });
      });
      emitOnChange(updatedOptions);
    }
  };

  const emitOnChange = (rawNodes: TreeSelectOption[]): void => {
    if (rawNodes !== undefined && rawNodes !== null && rawNodes?.length > 0) {
      const allSelectedNodes = rawNodes.filter((item) => item.isChecked || item.isIndeterminate);

      setSelectedRawNodes(allSelectedNodes);
      if (props.onChange) {
        props.onChange(allSelectedNodes);
      }
    } else if (props.onChange) {
      props.onChange([]);
    }
  };

  const getChildrenByParentId = (parentId: string): TreeSelectOption[] => {
    const children = rawNodes?.filter((item) => item?.parentId === parentId);

    return children ?? [];
  };

  useEffect(() => {
    if (props?.reset === true) {
      resetOptions();
    }
  }, [props?.reset]);

  const resetOptions = (): void => {
    const updatedOptions = updateIsChecked(rawNodes, false);

    setRawNodes(updatedOptions);

    emitOnChange([]);
  };

  const updateIsChecked = (nodes: TreeSelectOption[], isChecked: boolean): TreeSelectOption[] => {
    return nodes.map((node) => ({
      ...node,
      isChecked,
      isIndeterminate: false, // Clear indeterminate state on reset
      children:
        node?.children !== undefined && node?.children?.length > 0
          ? updateIsChecked(node?.children, isChecked)
          : [],
    }));
  };

  const getPlaceholder = (): string => {
    if (selectedRawNodes?.length > 0) {
      const displayNodes = selectedRawNodes.filter(
        (item) => item?.isParent && (item.isChecked || item.isIndeterminate)
      );
      return displayNodes?.map((option: any) => option?.label).join(', ');
    } else {
      return props?.placeholder ?? 'Please select an option';
    }
  };

  const clearSearch = (): void => {
    setSearchKey('');
    setFilteredRawNodes(rawNodes);
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const handleClearButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Tab' && !e.shiftKey && isOpen) {
      e.preventDefault();

      const selectableParentNodes = selectedRawNodes.filter(
        (node) => node.isParent && (node.isChecked || node.isIndeterminate)
      );

      if (selectableParentNodes.length > 0) {
        const firstChipId = `chip-close-btn-${selectableParentNodes[0]?.id}`;
        setTimeout(() => {
          document.getElementById(firstChipId)?.focus();
        }, 0);
      } else if (visibleOptions.length > 0) {
        setFocusedOptionIndex(0);
        setForceRefocus((prev) => !prev);
        announceOptionsList();
      } else {
        closeButtonRef.current?.focus();
      }
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        const selectableParentNodes = selectedRawNodes.filter(
          (node) => node.isParent && (node.isChecked || node.isIndeterminate)
        );
        if (selectableParentNodes.length > 0) {
          const firstChipId = `chip-close-btn-${selectableParentNodes[0]?.id}`;
          setTimeout(() => {
            document.getElementById(firstChipId)?.focus();
          }, 0);
          return;
        }
        if (visibleOptions.length > 0) {
          setFocusedOptionIndex(0);
          setForceRefocus((prev) => !prev);
          announceOptionsList();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen && focusedOptionIndex > 0) {
          setFocusedOptionIndex((prev) => prev - 1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        clearSearch();

        break;
      case 'Enter':
        e.preventDefault();
        toggleDropdown();
        break;
      case 'Tab':
        if (isOpen) {
          if (e.shiftKey) {
            e.preventDefault();
            closeButtonRef.current?.focus();
            break;
          }
          const selectableParentNodes = selectedRawNodes.filter(
            (node) => node.isParent && (node.isChecked || node.isIndeterminate)
          );

          if (!searchKey) {
            e.preventDefault();
            if (selectableParentNodes.length > 0) {
              const firstChipId = `chip-close-btn-${selectableParentNodes[0]?.id}`;
              setTimeout(() => {
                document.getElementById(firstChipId)?.focus();
              }, 0);
            } else if (visibleOptions.length > 0) {
              setFocusedOptionIndex(0);
              setForceRefocus((prev) => !prev);
            } else {
              inputRef.current?.focus();
            }
          }
        }
        break;
      default:
        break;
    }
  };

  const handleOptionHover = (index: number): void => {
    if (document.activeElement !== inputRef.current) {
      setFocusedOptionIndex(index);
    }
  };

  const handleOptionKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    option: TreeSelectOption,
    index: number
  ): void => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (index < visibleOptions.length - 1) {
          setFocusedOptionIndex(index + 1);
        } else {
          setFocusedOptionIndex(0);
          setForceRefocus((prev) => !prev);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          setFocusedOptionIndex(index - 1);
        } else {
          setFocusedOptionIndex(visibleOptions.length - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (option.children && option.children.length > 0 && !option.isExpanded) {
          toggleExpanded(option.id);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (option.children && option.children.length > 0 && option.isExpanded) {
          toggleExpanded(option.id);
        }
        break;
      case ' ':
        e.preventDefault();
        toggleChecked(option.id, !option.isChecked, option.isParent, option.parentId);
        break;
      case 'Enter':
        e.preventDefault();
        toggleChecked(option.id, !option.isChecked, option.isParent, option.parentId);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        clearSearch();
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          // When Shift+Tab focus goes to last chip if exists.
          const selectableParentNodes = selectedRawNodes.filter(
            (node) => node.isParent && (node.isChecked || node.isIndeterminate)
          );

          if (selectableParentNodes.length > 0) {
            // Focus the last chip
            setTimeout(() => {
              const lastChipId = `chip-close-btn-${selectableParentNodes[selectableParentNodes.length - 1]?.id}`;
              document.getElementById(lastChipId)?.focus();
            }, 0);
          } else {
            // If no chips, focus the input
            inputRef.current?.focus();
          }
        } else {
          if (searchKey && clearButtonRef.current) {
            clearButtonRef.current.focus();
          } else {
            inputRef.current?.focus();
          }
        }
        break;
      default:
        break;
    }
  };

  const handleChipKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    optionId: string,
    index: number
  ): void => {
    const selectableParentNodes = selectedRawNodes.filter(
      (node) => node.isParent && (node.isChecked || node.isIndeterminate)
    );
    const totalChips = selectableParentNodes.length;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (index < totalChips - 1) {
          setTimeout(() => {
            const nextChipId = `chip-close-btn-${selectableParentNodes[index + 1]?.id}`;
            document.getElementById(nextChipId)?.focus();
          }, 100);
        } else {
          setTimeout(() => {
            const firstChipId = `chip-close-btn-${selectableParentNodes[0]?.id}`;
            document.getElementById(firstChipId)?.focus();
          }, 100);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        // Move to previous chip with circular navigation
        if (index > 0) {
          setTimeout(() => {
            const prevChipId = `chip-close-btn-${selectableParentNodes[index - 1]?.id}`;
            document.getElementById(prevChipId)?.focus();
          }, 100);
        } else {
          setTimeout(() => {
            const lastChipId = `chip-close-btn-${selectableParentNodes[totalChips - 1]?.id}`;
            document.getElementById(lastChipId)?.focus();
          }, 100);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setFocusedOptionIndex(0);
        setForceRefocus((prev) => !prev);
        announceOptionsList();
        break;
      case 'Tab':
        if (e.shiftKey) {
          e.preventDefault();
          if (index === 0) {
            if (searchKey && clearButtonRef.current) {
              clearButtonRef.current.focus();
            } else {
              inputRef.current?.focus();
            }
          } else {
            setTimeout(() => {
              const prevChipId = `chip-close-btn-${selectableParentNodes[index - 1]?.id}`;
              document.getElementById(prevChipId)?.focus();
            }, 100);
          }
        } else {
          if (index === totalChips - 1) {
            e.preventDefault();
            if (visibleOptions.length === 0) {
              inputRef.current?.focus();
            } else {
              setFocusedOptionIndex(0);
              setForceRefocus((prev) => !prev);
            }
          } else {
            e.preventDefault();
            setTimeout(() => {
              const nextChipId = `chip-close-btn-${selectableParentNodes[index + 1]?.id}`;
              document.getElementById(nextChipId)?.focus();
            }, 100);
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleChipRemove(optionId, index);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        clearSearch();
        if (inputRef?.current) {
          inputRef?.current?.focus();
        }
        break;
      default:
        break;
    }
  };

  // This effect handles scrolling the focused option into view
  useEffect(() => {
    if (focusedOptionIndex >= 0 && optionsRef?.current) {
      const options = optionsRef?.current?.querySelectorAll('[role="treeitem"]');
      if (options[focusedOptionIndex]) {
        options[focusedOptionIndex].scrollIntoView({ block: 'nearest' });

        // Set focus to the option itself
        const focusableOption = options[focusedOptionIndex] as HTMLElement;
        if (focusableOption && focusableOption.tabIndex !== undefined) {
          focusableOption.focus();
        }
      }
    }
  }, [focusedOptionIndex, forceRefocus]);

  const toggleDropdown = (state?: boolean): void => {
    const newState = state !== undefined ? state : !isOpen;
    setIsOpen(newState);
    announce(`${newState ? 'expanded' : 'collapsed'}`);
    if (newState === true) {
    } else {
      clearSearch();
      setTimeout(() => {
        setFilteredRawNodes([...filteredRawNodes]);
      }, 0);
    }
  };

  const IndeterminateCheckbox = ({
    id,
    isChecked,
    isIndeterminate,
    onChange,
    label,
    ariaLabel,
  }: {
    id: string;
    isChecked: boolean;
    isIndeterminate?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    ariaLabel?: string;
  }) => {
    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = !!isIndeterminate;
      }
    }, [isIndeterminate]);

    return (
      <input
        ref={checkboxRef}
        id={id}
        aria-describedby={label}
        name={label}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="focus-visible:primary text-primary h-4 w-4 cursor-pointer rounded"
      />
    );
  };

  const handleOptionsMouseDown = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChevronClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  };
  const announceOptionsList = () => {
    const totalVisibleOptions = visibleOptions.length;
    announce(
      `${props.label || 'Search and select options'} options list with ${totalVisibleOptions} ${totalVisibleOptions === 1 ? 'item' : 'items'}. Use arrow keys to navigate.`
    );
  };

  // Prevent dropdown from closing when clicking inside it
  const handleOptionContainerClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  const accessibleLabel = props.label
    ? `${props.label}`
    : props.labelledby
      ? props.labelledby
      : (props.placeholder ?? 'Please select an option');
  const ariaLabel = props.ariaLabel || accessibleLabel;
  const labelledby = props.labelledby;

  return (
    <div ref={componentRef}>
      <Combobox as="div" ref={comboboxRef} disabled={props?.disabled} onClose={() => {}}>
        {prevSelectedList ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-1">
            {RenderLabel({
              label: props?.label,
              id: props?.id,
              required: props?.isRequired,
              disabled: props?.disabled,
            })}
            <RenderPreviousData
              label={prevDefaultData?.label}
              id={props?.id}
              data={selectedRawNodes}
              previousData={prevSelectedList}
              isTree={true}
              dataType={'list'}
            />
          </div>
        ) : (
          RenderLabel({
            label: props?.label,
            id: props?.id,
            required: props?.isRequired,
            disabled: props?.disabled,
          })
        )}
        {props?.disabled && isDisableTextUI ? (
          <div className="form-disabled-value-text pl-0.5">
            {!selectedRawNodes?.length ? (
              <>Not Specified</>
            ) : (
              <ShowMoreTree
                type="list"
                data={selectedRawNodes ?? []}
                selector={['label']}
                showTooltip={true}
                moreTextRequired={false}
                {...showMoreProp}
              />
            )}
          </div>
        ) : (
          <div className={classNames('relative', props?.label && 'mt-1')}>
            <div className="relative">
              <ComboboxInput
                ref={inputRef}
                value={searchKey}
                autoComplete="off"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchKey(event?.target?.value);
                  setIsOpen(true);
                  setFocusedOptionIndex(-1);
                }}
                onKeyDown={handleInputKeyDown}
                onClick={() => toggleDropdown(true)}
                placeholder={getPlaceholder()}
                id={props?.id}
                className="bg-input disabled:text-disabled disabled:bg-disabled disabled:bg-opacity-75 w-full rounded-md border py-1.5 pr-20 pl-3 shadow-sm disabled:cursor-not-allowed disabled:shadow-none sm:text-sm sm:leading-6"
                aria-label={`${ariaLabel} ${
                  Object.keys(selectedRawNodes ?? {}).length > 0
                    ? `${Object.keys(selectedRawNodes).length} ${
                        Object.keys(selectedRawNodes).length === 1 ? 'Option' : 'Options'
                      } selected`
                    : ''
                }`}
                aria-labelledby={labelledby}
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                {searchKey != '' && (
                  <button
                    ref={clearButtonRef}
                    type="button"
                    onClick={clearSearch}
                    onKeyDown={handleClearButtonKeyDown}
                    className={classNames(
                      'text-default inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg',
                      'link-text'
                    )}
                    aria-label={`Clear ${ariaLabel} search`}
                    tabIndex={0}
                  >
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="text-secondary h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                )}

                <ComboboxButton
                  ref={dropdownButtonRef}
                  className={classNames(
                    'focus-indicator group z-50 inline-flex items-center rounded-md px-2 py-1'
                  )}
                  aria-label={`${ariaLabel}`}
                  onClick={handleChevronClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      toggleDropdown();
                      inputRef.current?.focus();
                    }
                  }}
                >
                  {selectedRawNodes !== undefined &&
                    selectedRawNodes !== null &&
                    selectedRawNodes?.length > 0 && (
                      <>
                        <div
                          aria-hidden="true"
                          className="bg-primary-50 text-primary mr-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-xs"
                        >
                          {selectedRawNodes.length}
                        </div>
                        <span
                          id="selected-count-status"
                          className="sr-only"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {selectedRawNodes.length}{' '}
                          {selectedRawNodes.length === 1 ? 'item' : 'items'} selected
                        </span>
                      </>
                    )}

                  <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className="text-default ml-2 h-3 w-3"
                    aria-hidden="true"
                  />
                </ComboboxButton>
              </div>
            </div>

            {isOpen && (
              <ComboboxOptions
                key={`dropdown-${isOpen}`}
                anchor="bottom"
                className={classNames(
                  'bg-card mt-1 w-[var(--input-width)] rounded-md border shadow-lg [--anchor-gap:var(--spacing-1)] focus-visible:outline-none',
                  'z-50 flex flex-col gap-1 p-1 transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
                  props?.optionsContainerClassName
                )}
                static={isOpen}
                hold={false}
                onClick={handleOptionContainerClick}
                onMouseDown={handleOptionsMouseDown}
              >
                <div ref={optionsRef}>
                  {selectedRawNodes?.length > 0 && (
                    <div
                      className="mb-2 flex max-h-[60px] flex-wrap gap-2 overflow-y-auto border-b p-2"
                      onClick={(e) => e.stopPropagation()}
                      role="group"
                      aria-label={`Selected options`}
                    >
                      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                        {selectedRawNodes
                          ?.filter(
                            (option) =>
                              option?.isParent && (option.isChecked || option.isIndeterminate)
                          )
                          .map((option: TreeSelectOption, idx: number) => (
                            <li key={option?.id} className="m-0 p-0">
                              <div
                                className="bg-primary-50 text-primary flex flex-row items-center justify-start gap-2 rounded-md px-2 py-1 text-xs"
                                key={option?.id}
                              >
                                {option?.label}
                                <button
                                  type="button"
                                  id={`chip-close-btn-${option?.id}`}
                                  className="focus-indicator text-primary hover:bg-primary-100 hover:text-primary ms-2 inline-flex items-center rounded-md bg-transparent p-1 text-sm"
                                  aria-label={`Remove ${option?.label}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChipRemove(option?.id, idx);
                                  }}
                                  onKeyDown={(e) => handleChipKeyDown(e, option?.id, idx)}
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
                                </button>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  <div
                    className="flex max-h-[300px] w-full flex-col overflow-y-auto"
                    role="tree"
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {visibleOptions.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {visibleOptions.map((option: TreeSelectOption, optionIndex) => {
                          const isOptionFocused = optionIndex === focusedOptionIndex;
                          const isParentOption = !option?.parentId;
                          const paddingLeft = isParentOption
                            ? 'pl-2'
                            : viewType === 'checkbox'
                              ? 'pl-12'
                              : 'pl-8';
                          const hasChildren = option?.children && option.children.length > 0;
                          return (
                            <>
                              {props?.bifurcate && isParentOption && option.showSectionHeader && (
                                <div
                                  className={`${optionIndex > 0 ? 'border-t border-gray-200' : ''} text-secondary bg-card sticky top-0 z-10 py-2 pl-3 text-sm font-semibold ${props?.sectionLabelClass ?? ''}`}
                                  key={`section-header-${option.id}`}
                                >
                                  {option.section}
                                </div>
                              )}
                              <div
                                onMouseEnter={() => handleOptionHover(optionIndex)}
                                key={option?.id}
                                role={'treeitem'}
                                aria-level={isParentOption ? 0 : 1}
                                tabIndex={optionIndex === 0 ? 0 : -1}
                                className={classNames(
                                  'flex w-full cursor-pointer flex-row items-center justify-between rounded-md py-1.5',
                                  paddingLeft,
                                  isOptionFocused
                                    ? 'bg-hover focus-visible:outline-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]'
                                    : 'hover:bg-hover'
                                )}
                                aria-selected={option.isChecked}
                                {...(!option.parentId &&
                                !(option.children && option.children.length > 0)
                                  ? { 'aria-label': option.label }
                                  : {
                                      'aria-labelledby':
                                        option.isParent && hasChildren
                                          ? `subitems-desc-${option.id}`
                                          : undefined,
                                    })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Tab' && !e.shiftKey) {
                                    e.preventDefault();
                                    closeButtonRef.current?.focus();
                                  } else {
                                    handleOptionKeyDown(e, option, optionIndex);
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  if (viewType === 'radio' && isParentOption) {
                                    // For radio type, toggle check without affecting children
                                    toggleChecked(
                                      option.id,
                                      !option.isChecked,
                                      option.isParent,
                                      option.parentId
                                    );
                                  } else {
                                    // For checkbox type or child nodes in radio mode
                                    toggleChecked(
                                      option.id,
                                      !option.isChecked,
                                      option.isParent,
                                      option.parentId
                                    );
                                  }
                                }}
                              >
                                {option.isParent && hasChildren && (
                                  <span
                                    id={`subitems-desc-${option.id}`}
                                    className="sr-only absolute -z-0 !m-0 !inline !h-0 !w-0 !overflow-hidden !p-0 !leading-none"
                                  >
                                    {option?.isExpanded ? 'collapse' : 'expand'} {option.label}
                                  </span>
                                )}

                                <div className="flex flex-row items-center gap-2">
                                  {viewType === 'checkbox' && option.isParent && (
                                    <div className="flex items-center" style={{ width: '24px' }}>
                                      {hasChildren ? (
                                        <button
                                          type="button"
                                          className="hover:bg-primary-100 flex cursor-pointer items-center justify-center rounded-sm border-none bg-transparent p-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpanded(option.id);
                                          }}
                                          aria-expanded={option.isExpanded}
                                          aria-label={`${option.isExpanded ? 'collapse' : 'expand'}`}
                                        >
                                          <FontAwesomeIcon
                                            icon={
                                              option.isExpanded ? faChevronDown : faChevronRight
                                            }
                                            className="text-secondary h-3 w-3"
                                            aria-hidden="true"
                                          />
                                        </button>
                                      ) : (
                                        <span className="w-5"></span>
                                      )}
                                    </div>
                                  )}

                                  {viewType === 'checkbox' || !isParentOption ? (
                                    <IndeterminateCheckbox
                                      id={`checkbox-${option.id}`}
                                      isChecked={option.isChecked}
                                      isIndeterminate={option.isIndeterminate}
                                      label={option.label}
                                      ariaLabel={
                                        !hasChildren ? `Select ${option.label}` : undefined
                                      }
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        toggleChecked(
                                          option.id,
                                          e.target.checked,
                                          option.isParent,
                                          option.parentId
                                        );
                                      }}
                                    />
                                  ) : (
                                    <input
                                      id={`radio-${option.id}`}
                                      name="treeSelect"
                                      type="radio"
                                      checked={option.isChecked}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        toggleChecked(
                                          option?.id,
                                          e.target.checked,
                                          option?.isParent,
                                          option?.parentId
                                        );
                                      }}
                                      className="focus-visible:primary text-primary mt-1 h-4 w-4 cursor-pointer rounded-full"
                                      aria-label={`Select ${option?.label}`}
                                    />
                                  )}
                                  {viewType === 'radio' && isParentOption ? (
                                    <div className="ml-2 flex max-w-[80%] flex-col items-start justify-start">
                                      <span className="block truncate text-sm font-medium break-words">
                                        {option?.label}
                                      </span>
                                      {!props?.hideSecondaryLabel && (
                                        <span className="text-secondary text-xs">
                                          {option?.children?.length ?? 0}{' '}
                                          {props?.secondaryLabel &&
                                          props?.secondaryLabel?.length > 0
                                            ? props?.secondaryLabel
                                            : option?.children?.length === 1
                                              ? 'Specialization'
                                              : 'Specializations'}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="ml-2 block max-w-[80%] text-sm font-medium break-words">
                                      {option?.label}
                                    </span>
                                  )}
                                </div>
                                {viewType === 'radio' && isParentOption && hasChildren && (
                                  <button
                                    type="button"
                                    className="hover:bg-primary-100 mr-2 flex cursor-pointer items-center justify-center rounded-sm border-none bg-transparent p-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpanded(option.id);
                                    }}
                                    aria-label={`${option.isExpanded ? 'Collapse' : 'Expand'} ${option.label}`}
                                  >
                                    <FontAwesomeIcon
                                      icon={option.isExpanded ? faChevronDown : faChevronRight}
                                      className="text-default h-3 w-3"
                                      aria-hidden="true"
                                    />
                                  </button>
                                )}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex-flex-row text-default p-2 text-sm">No records found</div>
                    )}
                  </div>
                  <div
                    className={classNames(
                      'flex flex-row items-center gap-2 border-t',
                      props?.footerButtonNode ? 'justify-between' : 'justify-end'
                    )}
                  >
                    {props?.footerButtonNode && (
                      <div className="flex flex-row items-center justify-start">
                        {props?.footerButtonNode as ReactNode}
                      </div>
                    )}
                    <div className="flex flex-row items-center justify-end">
                      <button
                        ref={closeButtonRef}
                        type="button"
                        className="link-text text-primary px-2 text-xs"
                        aria-label={`close ${ariaLabel}`}
                        onClick={() => {
                          setIsOpen(false);
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab' && !e.shiftKey) {
                            // Tab: focus input
                            e.preventDefault();
                            inputRef.current?.focus();
                          } else if (e.key === 'Tab' && e.shiftKey) {
                            // Shift+Tab: focus first option, else last chip, else clear button, else input
                            e.preventDefault();
                            if (visibleOptions.length > 0) {
                              setFocusedOptionIndex(0);
                              setForceRefocus((prev) => !prev);
                            } else {
                              const selectableParentNodes = selectedRawNodes.filter(
                                (node) => node.isParent && (node.isChecked || node.isIndeterminate)
                              );
                              if (selectableParentNodes.length > 0) {
                                const lastChipId = `chip-close-btn-${selectableParentNodes[selectableParentNodes.length - 1]?.id}`;
                                document.getElementById(lastChipId)?.focus();
                              } else if (searchKey && clearButtonRef.current) {
                                clearButtonRef.current.focus();
                              } else {
                                inputRef.current?.focus();
                              }
                            }
                          }
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </ComboboxOptions>
            )}
          </div>
        )}
      </Combobox>
    </div>
  );
};

export default TreeSelect;
