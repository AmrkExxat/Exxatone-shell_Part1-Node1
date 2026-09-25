import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { debounceSearch, type NodeType } from '../TreeCheckbox/TreeCheckbox.type';
import TreeCheckbox from '../TreeCheckbox/TreeCheckbox';
import {
  faChevronDown,
  faChevronUp,
  faCircleMinus,
  faCircleXmark,
  faXmark,
} from '@fortawesome/pro-light-svg-icons';
import { classNames } from '../../../components/common/Form/components/TreeSelect/utils';
import { cloneDeep } from 'lodash';
import { announce } from '@react-aria/live-announcer';
const TreeDropdown = ({
  options,
  dropIcon,
  defaultSelections = [],
  parentLabel,
  width,
  label,
  seachPlaceholder,
  dropdownClass = '',
  clearBit,
  onChange,
  extraFilter = false,
  hideFilter,
  hidden = false,
  buttonElement,
  popoverClassName,
  classWrap,
  id,
  clearList,
  useUnderlineStyle = false,
  addedFilter = false,
  isDarkTheme = false,
  ...props
}: {
  options: NodeType[];
  dropIcon: any;
  defaultSelections: NodeType[];
  parentLabel?: string;
  width?: string;
  label: string;
  seachPlaceholder: string;
  dropdownClass?: string;
  clearBit?: number;
  onChange: (selectedNodes: NodeType[], parentReset?: boolean) => void;
  extraFilter?: boolean;
  hideFilter?: () => void;
  hidden?: boolean;
  buttonElement?: ReactElement;
  popoverClassName?: string;
  classWrap?: string;
  id?: string;
  clearList?: string[];
  useUnderlineStyle?: boolean;
  addedFilter?: boolean;
  isDarkTheme?: boolean;
}) => {
  const [selected, setSelected] = useState<NodeType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedTreeData, setSelectedTreeData] = useState<NodeType[]>([]);
  const [defaultValues, setDefaultValues] = useState<any>(defaultSelections ?? []);
  const [showSelected, setShowSelected] = useState<boolean>(false);
  const [treeOptions, setTreeOptions] = useState<NodeType[]>(
    options?.length ? JSON.parse(JSON.stringify(options)) : []
  );
  const [initialRender, setInitialRender] = useState<boolean>(
    props?.initRender !== undefined ? props.initRender : true
  );
  const [resetting, setResetting] = useState<boolean>(false);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [hasSearchResults, setHasSearchResults] = useState(true);

  // Manually track open state separate from hidden prop
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Refs for focus management
  const popoverButtonRef = useRef(null);
  const searchInputRef = useRef(null);
  const lastFocusedCheckboxRef = useRef(null);
  const clearSelectionRef = useRef(null);
  const selectAllRef = useRef(null);
  const closeButtonRef = useRef(null);
  const showSelectedButtonRef = useRef(null);

  // Reference to track whether we should control Popover programmatically
  const shouldTriggerPopoverRef = useRef(false);

  // Handle clearBit changes
  useEffect(() => {
    if (clearBit > 0) {
      setResetting(true);
      clearSelection(null);
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && clearList.includes(id)) {
      setResetting(true);
      clearSelection(null, true);
    }
  }, [clearList]);

  // Handle extraFilter and hidden props
  useEffect(() => {
    if (extraFilter && hidden === false && !initialRender) {
      // We need to open the dropdown when hidden changes from true to false
      shouldTriggerPopoverRef.current = true;
      // Schedule click on the popover button to open it
      setTimeout(() => {
        if (popoverButtonRef?.current && shouldTriggerPopoverRef.current) {
          popoverButtonRef?.current.click();
          shouldTriggerPopoverRef.current = false;
        }
      }, 0);
    } else if (initialRender) {
      setInitialRender(false);
    }
  }, [hidden, extraFilter, initialRender]);

  // Handle visibility changes when isOpen state changes
  useEffect(() => {
    // Update allSelected state based on whether all items are selected
    const allOptionsSelected = checkIfAllSelected(options);
    setAllSelected(allOptionsSelected);

    // Auto-hide the selected view when there are no selections
    if (selectedCount === 0 && showSelected) {
      setShowSelected(false);
    }
  }, [selectedCount, options, selected, isOpen]);

  // Handle escape key for closing the popover
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // To ensure rotation of the focus within the popover - Needed cause we're using trap focus
  useEffect(() => {
    if (isOpen) {
      const handleTabKey = (e) => {
        // If Tab is pressed on close button, cycle back to first focusable element
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === closeButtonRef.current) {
          e.preventDefault();

          // Accessibility as in Prism Focus first actionable element either X view or search
          if (selectedCount > 0 && showSelectedButtonRef?.current) {
            showSelectedButtonRef?.current?.focus?.();
          } else {
            setFocus(`search_${label}`);
          }
        }

        // If Shift+Tab / Backward Navigtion is pressed on the first focusable element
        if (e.key === 'Tab' && e.shiftKey) {
          const firstElement =
            selectedCount > 0 && showSelectedButtonRef?.current
              ? showSelectedButtonRef?.current
              : document.getElementById(`search_${label}`);

          if (document.activeElement === firstElement) {
            e.preventDefault();
            closeButtonRef?.current?.focus?.();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, label, selectedCount]);

  const handleClose = () => {
    setIsOpen(false);
    if (popoverButtonRef?.current) {
      popoverButtonRef?.current.click();
      // Focus the triggering element after closing
      setTimeout(() => {
        if (popoverButtonRef?.current) {
          popoverButtonRef?.current?.focus?.();
        }
      }, 0);
    }
  };

  const checkIfAllSelected = (nodes: NodeType[]) => {
    const checkNodes = (nodeList: NodeType[]): boolean => {
      if (!nodeList || nodeList.length === 0) return true;

      return nodeList.every((node) => {
        const childrenSelected = checkNodes(node.children || []);
        return node.checked && childrenSelected;
      });
    };

    return checkNodes(nodes);
  };

  const setFocus = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element?.focus?.();
    }
  };

  // Handle focus when element opens
  const handlePopoverOpen = (open: boolean) => {
    // Track internal open state
    setIsOpen(open);

    if (open) {
      setTimeout(() => {
        // As in Prism On opening focus goes to X selected button it is initially actionable if available, otherwise search
        if (selectedCount > 0 && showSelectedButtonRef?.current) {
          showSelectedButtonRef?.current?.focus?.();
        } else {
          setFocus(`search_${label}`);
        }
      }, 100);
    }
  };

  const treeSelectChange = (values: any, triggerType: any) => {
    setSelected(values);
    getSelectedCount(values);
    createSelectedTreeData(values);
    if (triggerType !== 'initialTrigger') {
      onChange(values, resetting);
      setResetting(false);
    }
  };

  const getSelectedCount = (values) => {
    let count = 0;
    const traverse = (nodes) => {
      nodes.forEach((node) => {
        count++;
        if (node.children?.length) {
          traverse(node.children);
        }
      });
    };
    traverse(values);
    setSelectedCount(count);
  };

  const createSelectedTreeData = (values) => {
    let selectedTree = [...values];
    const traverse = (selectedTree) => {
      selectedTree.forEach((node) => {
        if (node.children?.length) {
          node['checked'] = true;
          node['indeterminate'] = false;
          // To mark the nodes as being in the selection list for focus management
          node['inSelectionList'] = true;
          traverse(node.children);
        } else {
          // marking leaf nodes too for searching
          node['inSelectionList'] = true;
        }
      });
    };
    traverse(selectedTree);
    setSelectedTreeData(selectedTree);
    if (!selectedTree.length) {
      setFocus(`search_${label}`);
    }
  };

  // Focus being managed among children Enhanced update function to handle focus management in selected tree
  const updateActualTree = (
    selected: NodeType[],
    checkboxClick: any = false,
    nodeId: string = null
  ) => {
    if (checkboxClick === true) {
      const defaultSelections = filterSelections(selected);
      setTreeOptions(options?.length ? JSON.parse(JSON.stringify(options)) : []);
      setDefaultValues(defaultSelections);

      // Find and focus the next appropriate element after node removal
      if (nodeId) {
        const findNextFocusTarget = () => {
          // Build a flat map of node relationships for better traversal
          const buildNodeMap = (nodes, parentId = null, map = {}, flatList = []) => {
            nodes.forEach((node, index) => {
              map[node.id] = {
                node,
                parentId,
                siblings: nodes.filter((n) => n.id !== node.id).map((n) => n.id),
                index,
                isInSelected: selected.some((s) => s.id === node.id),
              };
              flatList.push(node.id);

              if (node.children && node.children.length > 0) {
                buildNodeMap(node.children, node.id, map, flatList);
              }
            });
            return { map, flatList };
          };

          // Build relationship map from both trees
          const { map: selectedNodeMap, flatList: selectedFlatList } = buildNodeMap(
            cloneDeep(selectedTreeData)
          );

          // Get info about the removed node
          const removedNode = selectedNodeMap[nodeId];

          if (!removedNode) {
            // If node not found in map (rare case), default to search
            return null;
          }

          // Try to find a sibling that's still selected
          const remainingSiblings = removedNode.siblings.filter((id) =>
            selected.some((node) => node.id === id)
          );

          if (remainingSiblings.length > 0) {
            // Focus on first remaining sibling
            return remainingSiblings[0];
          }

          // If no siblings left and this was the last child, the parent might be gone too
          // Check if parent exists in selected data
          if (removedNode.parentId && selected.some((node) => node.id === removedNode.parentId)) {
            return removedNode.parentId;
          }

          // Try to find the nearest node in the flat list that's still selected
          if (selectedFlatList.length > 0) {
            const removedIndex = selectedFlatList.indexOf(nodeId);

            if (removedIndex >= 0) {
              // Try next node, then previous node
              for (let offset of [1, -1, 2, -2, 3, -3]) {
                const nearbyIndex = removedIndex + offset;
                if (
                  nearbyIndex >= 0 &&
                  nearbyIndex < selectedFlatList.length &&
                  selected.some((node) => node.id === selectedFlatList[nearbyIndex])
                ) {
                  return selectedFlatList[nearbyIndex];
                }
              }
            }
          }

          // If all fails, return null to focus on search
          return null;
        };

        const nextFocusId = findNextFocusTarget();

        // Set focus based on the result
        setTimeout(() => {
          if (nextFocusId && selected.length > 0) {
            const element = document.getElementById(`checkbox_${nextFocusId}`);
            if (element) {
              element?.focus?.();
            } else {
              setFocus(`search_${label}`);
            }
          } else if (selected.length === 0) {
            // No more selected items, focus on search
            setFocus(`search_${label}`);
          }
        }, 0);
      }
    }
  };

  const filterSelections = (nodes) => {
    return nodes.reduce((acc, node) => {
      if (node.checked || node.indeterminate) {
        const filteredNode = {
          id: node.id,
          label: node.label,
          children: node.children.length > 0 ? filterSelections(node.children) : [],
        };
        acc.push(filteredNode);
      }
      return acc;
    }, []);
  };

  // Enhanced clearSelection to manage focus properly
  const clearSelection = (e?: any, parentReset?: boolean) => {
    // Set empty selection
    setTreeOptions(options?.length ? JSON.parse(JSON.stringify(options)) : []);
    setDefaultValues([]);

    // Update selected state and notify parent
    setSelected([]);
    setSelectedCount(0);
    setSelectedTreeData([]);
    if (parentReset) {
      onChange([], parentReset);
    } else {
      onChange([], resetting);
    }
    setResetting(false);

    if (e) {
      e.stopPropagation();

      // Check if this is the X button click from the main button (not within dropdown)
      const isXButtonClick = e.currentTarget.closest('[role="combobox"]');

      if (isXButtonClick) {
        // Close the dropdown if it's open
        if (isOpen) {
          handleClose();
        }

        // Ensure focus returns to the trigger button
        setTimeout(() => {
          if (popoverButtonRef?.current) {
            popoverButtonRef?.current?.focus?.();
          }
        }, 0);
      } else if (isOpen) {
        // When dropdown is open and clear is clicked from inside dropdown
        setTimeout(() => {
          if (searchInputRef?.current) {
            searchInputRef?.current?.focus?.();
          } else {
            setFocus(`search_${label}`);
          }
        }, 0);
      }
    } else {
      // Case when called programmatically (like from useEffect)
      setFocus(`search_${label}`);
    }
  };

  const selectAll = (e?: any) => {
    //To select all nodes as selected
    const selectAllNodes = (nodes: NodeType[]): NodeType[] => {
      return nodes.map((node) => {
        const updatedNode = { ...node, checked: true, indeterminate: false };
        if (node.children && node.children.length > 0) {
          updatedNode.children = selectAllNodes(node.children);
        }
        return updatedNode;
      });
    };

    // Apply selection to tree options
    const updatedOptions = selectAllNodes(JSON.parse(JSON.stringify(options)));
    setTreeOptions(updatedOptions);

    // Update defaultValues to match all selections
    const allSelections = filterSelections(updatedOptions);
    setDefaultValues(allSelections);

    // Update selected nodes and notify parent
    setSelected(allSelections);
    getSelectedCount(allSelections);
    createSelectedTreeData(allSelections);
    onChange(allSelections, false);

    // Set focus to the clear selection button
    if (e) {
      e.stopPropagation();
    }
    setTimeout(() => {
      if (clearSelectionRef?.current) {
        clearSelectionRef?.current?.focus?.();
      } else {
        setFocus(`search_${label}`);
      }
    }, 0);

    setAllSelected(true);
  };

  // IMPROVED search function to properly handle expansion when child nodes match
  const performSearch = (searchText: string) => {
    // if (!searchText.trim()) {
    //   // Reset to original options if search is cleared
    //   setTreeOptions(options?.length ? JSON.parse(JSON.stringify(treeOptions)) : []);
    //   return;
    // }

    // Deep clone options to avoid modifying the original
    const clonedOptions = JSON.parse(JSON.stringify(treeOptions));

    // Function to find matching nodes and mark parents for expansion
    const processNodes = (nodes: NodeType[]): { hasMatch: boolean; nodes: NodeType[] } => {
      const result = nodes.map((node) => {
        const nodeClone = { ...node };

        // Check if current node matches
        const nodeMatches = nodeClone.label?.toLowerCase().includes(searchText.toLowerCase());

        // Process children nodes if exists
        let childrenResult = { hasMatch: false, nodes: [] };
        if (nodeClone.children && nodeClone.children.length > 0) {
          // If parent matches, ensure all children are visible without matching them
          if (nodeMatches) {
            nodeClone.children.forEach((child) => (child.hidden = false)); // Ensure all children are visible
          } else {
            // Otherwise, process the children normally
            childrenResult = processNodes(nodeClone.children);
            nodeClone.children = childrenResult.nodes;
          }
        }

        // Determine visibility based on self match or child matches
        const shouldBeVisible = nodeMatches || childrenResult.hasMatch;
        nodeClone.hidden = !shouldBeVisible;

        // Expand parent node if children match but parent doesn't
        if (childrenResult.hasMatch) {
          nodeClone.expanded = true;
        }

        return nodeClone;
      });

      // To Return if any node at this level matches
      return {
        hasMatch: result.some((node) => !node.hidden),
        nodes: result,
      };
    };

    const countSelectableOptions = (nodes: NodeType[]): number =>
      nodes.reduce(
        (count, node) =>
          !node.hidden
            ? count + 1 + (node.children?.length ? countSelectableOptions(node.children) : 0)
            : count,
        0
      );

    const searchResult = processNodes(clonedOptions);
    setTreeOptions(searchResult.nodes);
    setHasSearchResults(searchText.trim() ? searchResult.hasMatch : true);

    const total = countSelectableOptions(searchResult.nodes);
    if (searchText.trim())
      setTimeout(
        () =>
          announce(
            searchResult.hasMatch
              ? `${total} result${total - 1 ? 's' : ''} found`
              : 'No results found',
            'polite'
          ),
        100
      );
  };

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
    debounceSearch(() => performSearch(text), 300)();
  };

  // Track last focused checkbox for focus management
  const setLastFocusedCheckbox = (nodeId) => {
    if (lastFocusedCheckboxRef?.current) {
      lastFocusedCheckboxRef.current = nodeId;
    }
  };

  // Handle focus for selection list only (should move to search when empty)
  const handleSelectionListEmpty = () => {
    setFocus(`search_${label}`);
  };

  // Toggle selected view with focus management
  const toggleShowSelected = () => {
    const newState = !showSelected;
    setShowSelected(newState);

    // If hiding selection list, focus on the button
    if (!newState && showSelectedButtonRef?.current) {
      setTimeout(() => {
        showSelectedButtonRef?.current?.focus?.();
      }, 0);
    }
  };

  // If component is hidden entirely, return null or an empty fragment
  if (hidden && extraFilter) {
    return null;
  }

  return (
    <Popover
      className={`relative w-full ${classWrap} flex ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}
    >
      {({ open }) => {
        // Call the handler to manage focus when open changes
        useEffect(() => {
          handlePopoverOpen(open);
        }, [open]);

        return (
          <>
            {!buttonElement ? (
              <>
                <PopoverButton
                  suppressHydrationWarning={true}
                  ref={popoverButtonRef}
                  id={id ?? label}
                  className={`focus-indicator ${useUnderlineStyle ? '' : 'filter-round'} flex w-full items-center ${useUnderlineStyle ? 'cursor-pointer' : ''} filter-text-sm relative px-2 py-1.5 ${
                    useUnderlineStyle
                      ? `hover:border-primary focus:border-primary border-b-2 ${selected?.length && open ? 'border-primary' : selected?.length && !open ? 'border-primary' : open && !selected?.length ? 'border-primary' : 'border-gray-300'}`
                      : `border-[1px] ${selected?.length && open ? 'selected-opened-filter' : selected?.length && !open ? 'selected-filter' : open && !selected?.length ? 'opened-filter' : 'newState-filter'}`
                  } ${dropdownClass}`}
                >
                  {dropIcon && <FontAwesomeIcon icon={dropIcon} className={`filter-icon mr-2`} />}
                  <div
                    className={`${selectedCount > 0 || (extraFilter && !selectedCount) ? 'mr-8' : 'mr-2'} flex items-center`}
                  >
                    {label}
                    {selectedCount > 0 && (
                      <>
                        <span className="filter-selected-text pl-2">|</span>
                        <a
                          onClick={() => setShowSelected(true)}
                          className="focus-indicator filter-selected-text mr-1 px-2 text-[.8rem] font-semibold whitespace-nowrap"
                        >{`${selectedCount === 1 ? selected[0].label : selectedCount + ' selected'}`}</a>
                      </>
                    )}
                    {useUnderlineStyle && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''} text-gray-600`}
                      />
                    )}
                  </div>

                  {selectedCount > 0 && (
                    <button
                      className="focus-indicator absolute top-1/2 right-3 z-10 flex -translate-y-1/2"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSelection(e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          clearSelection(e);
                        }
                      }}
                      aria-label="Clear all selections"
                    >
                      <FontAwesomeIcon
                        icon={isDarkTheme ? faXmark : faCircleXmark}
                        className={`filter-cross-btn h-5 w-5`}
                      />
                    </button>
                  )}
                  {addedFilter && !selectedCount && (
                    <button
                      aria-label={`hide ${label} filter`}
                      className="h-4 w-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        hideFilter?.();
                      }}
                    >
                      <FontAwesomeIcon icon={faCircleMinus} className={`h-4 w-4`} />
                    </button>
                  )}
                </PopoverButton>
              </>
            ) : (
              <PopoverButton
                suppressHydrationWarning={true}
                ref={popoverButtonRef}
                id={id ?? label}
                style={{ borderRadius: '0.25rem' }}
                className={popoverClassName ? popoverClassName : ''}
              >
                {buttonElement}
              </PopoverButton>
            )}
            <PopoverPanel
              unmount={false}
              style={{ minWidth: '264px', maxWidth: '320px' }}
              className={`bg-card absolute top-[30px] z-50 max-h-[75vh] overflow-y-hidden rounded-lg border pt-2 ${open ? '' : 'hidden'} shadow-md ${width ? width : 'w-full'}`}
              static
            >
              <div>
                <div className="flex items-center justify-between px-2 text-xs">
                  <label
                    htmlFor={`search_${label}`}
                    className="drop-panel-label font-semibold"
                    role="heading"
                    aria-level={3}
                  >
                    {label}
                  </label>
                  {selectedCount > 0 && (
                    <button
                      ref={showSelectedButtonRef}
                      onClick={toggleShowSelected}
                      className="filter-text-primary"
                      aria-label={`${selectedCount} options selected`}
                      aria-expanded={showSelected ? 'true' : 'false'}
                      aria-live="polite"
                    >
                      {`${selectedCount} selected`}
                      <FontAwesomeIcon
                        icon={showSelected ? faChevronUp : faChevronDown}
                        className="ml-2"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
                {showSelected && selectedTreeData?.length > 0 && (
                  <div
                    tabIndex={-1}
                    className="max-h-[30vh]"
                    role="group"
                    aria-labelledby="selected-options-label"
                  >
                    <span id="selected-options-label" className="sr-only">
                      {label} Selected options
                    </span>
                    <TreeCheckbox
                      isDarkTheme={isDarkTheme}
                      options={selectedTreeData}
                      defaultSelections={selectedTreeData}
                      onChange={(selected, checkboxClick, nodeId) =>
                        updateActualTree(selected, checkboxClick, nodeId)
                      }
                      parentLabel={parentLabel}
                      wrapperClass={'max-h-[30vh]'}
                      onFocusChange={setLastFocusedCheckbox}
                      onEmptySelection={handleSelectionListEmpty}
                      maintainFocusWithinSelectionList={true}
                    />
                  </div>
                )}
                {/* Search code */}
                <div className="relative p-2">
                  <input
                    aria-label={label}
                    ref={searchInputRef}
                    value={searchValue}
                    onChange={(e) => {
                      handleSearchChange(e.target.value);
                    }}
                    id={`search_${label}`}
                    className="sm:filter-text-sm h-[35px] w-full rounded-md border-[1px] py-0 pr-2 pl-2 text-gray-900 placeholder:text-xs placeholder:text-[#5D5D5D]"
                    placeholder={seachPlaceholder}
                    name="search"
                    autoComplete="off"
                  />
                  {searchValue !== '' && (
                    <a
                      tabIndex={0}
                      role="button"
                      aria-label="Clear selection"
                      className={classNames(
                        'focus-indicator bg-card absolute top-1/3 right-5 flex items-center justify-center rounded-lg'
                      )}
                      onClick={(e) => {
                        setSearchValue('');
                        e.stopPropagation();
                        searchInputRef?.current?.focus();
                        handleSearchChange('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSearchValue('');
                          e.stopPropagation();
                          handleSearchChange('');
                          searchInputRef?.current?.focus();
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="filter-text-primary h-3 w-3"
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </div>
                <div className="max-h-[35vh]">
                  {searchValue.trim() && !hasSearchResults ? (
                    <div className="text-default p-4 text-center">No results found</div>
                  ) : (
                    <TreeCheckbox
                      options={treeOptions}
                      defaultSelections={defaultValues}
                      onChange={treeSelectChange}
                      parentLabel={parentLabel}
                      wrapperClass={'max-h-[35vh]'}
                      maintainFocusWithinSelectionList={false}
                      onFocusChange={setLastFocusedCheckbox}
                    />
                  )}
                </div>
                <div className="flex justify-between border-t p-2">
                  <div className="flex space-x-4">
                    <button
                      ref={selectAllRef}
                      className={`flex text-xs ${allSelected ? 'cursor-not-allowed text-[#868686]' : 'filter-text-primary cursor-pointer'}`}
                      onClick={selectAll}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          selectAll(e);
                        }
                      }}
                      disabled={allSelected}
                      aria-disabled={allSelected}
                    >
                      Select All
                    </button>
                    <button
                      ref={clearSelectionRef}
                      className={`flex text-xs ${selectedCount ? 'filter-text-primary cursor-pointer' : 'cursor-not-allowed text-[#868686]'}`}
                      onClick={clearSelection}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && selectedCount > 0) {
                          clearSelection(e);
                        }
                      }}
                      disabled={!selectedCount}
                      aria-disabled={!selectedCount}
                    >
                      Clear Selection
                    </button>
                  </div>
                  <button
                    ref={closeButtonRef}
                    className="filter-text-primary text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClose();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClose();
                      }
                    }}
                    tabIndex={0}
                    aria-label="Close dropdown"
                  >
                    Close
                  </button>
                </div>
              </div>
            </PopoverPanel>
          </>
        );
      }}
    </Popover>
  );
};

export default TreeDropdown;
