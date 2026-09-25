import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Popover from '@radix-ui/react-popover';
import {
  faCheck,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleMinus,
  faCircleXmark,
  faXmark,
} from '@fortawesome/pro-light-svg-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { announce } from '@react-aria/live-announcer';
import Tooltip from '../../components/common/Tooltip/Tooltip';
import useDebounce from '../../../utilities/utils/debounce';
import classNames from 'classnames';
import {
  BORDER_COLOR,
  ICON_SIZE_SM,
  ICON_SIZE_MD,
  ICON_SIZE_CHECKBOX,
  CHIP_STYLES,
  CHIP_REMOVE_BTN,
  SECTION_SEARCH,
  SECTION_FOOTER,
  OPTION_BORDER_B,
  DEFAULT_WIDTH,
  TRIGGER_HEIGHT,
  CHIPS_CONTAINER_HEIGHT,
  OPTION_ICON_WRAPPER,
  FOCUS_STYLES,
} from '../radixDropdownStyles';

export type TreeNode = {
  id: string;
  label: string;
  value: string;
  checked?: boolean;
  hasChildren: boolean;
  disabled?: boolean;
  /** Optional secondary text used for tooltips in RadixInfiniteDropDown. */
  subLabel?: string;
  /** Optional leading icon for each option node. */
  icon?: React.ReactNode;
  children: TreeNode[];
};

export type RadixInfiniteDropDown = {
  queryKey?: string[];
  fetchDataOnScroll?: (args: {
    params: { pageParam?: number; [key: string]: unknown };
    debouncedSearch: string;
  }) => Promise<{ data: TreeNode[]; totalCount: number }>;
  onChange?: (checked: TreeNode[], parentReset?: boolean) => void;
  placeholder?: string;
  label?: string;
  dropIcon?: any;
  defaultValues?: TreeNode[];
  isFilter?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearButtonReq?: boolean;
  staticDropdown?: boolean;
  clearList?: string[];
  closeButtonReq?: boolean;
  buttonElement?: any;
  options?: any;
  clearBit?: any;
  id?: string;
  infoMsg?: string;
  maxHeightForMenuItems?: number | string;
  multiple?: boolean;
  detachedBox?: boolean;
  disableChildIfParentIsChecked?: boolean;
  autoHierarchySelection?: boolean;
  canInitialFetch?: boolean;
  maxWidth?: string;
  specificSearchToolTipText?: string;
  /** When true, hides the radio input for single-select mode in tree items. */
  hideRadioButton?: boolean;

  /** Additional behavioral flags shared with RadixInfiniteDropDown */
  extraFilter?: boolean;
  addedFilter?: boolean;
  hideFilter?: () => void;

  /** Styling / className props shared with RadixInfiniteDropDown */
  mainWrapperClass?: string;
  btnWrapperClass?: string;
  xMarkClass?: string;
  refetchOnClear?: boolean;

  /** Radix-style visual customization props */
  variant?: 'pill' | 'custom';
  hideLabel?: boolean;
  width?: string;
  selectedBgColor?: string;
  selectedTextColor?: string;
  unSelectedBorderColor?: string;
  height?: string;
  triggerClassName?: string;
  contentClassName?: string;
  renderSelectedItemsInTreeStructure?: boolean;
  wrapperClassName?: string;
  showSelectedItems?: boolean;
};

export default function RadixInfiniteDropDown({
  queryKey,
  fetchDataOnScroll,
  onChange,
  placeholder,
  label,
  dropIcon,
  defaultValues = [],
  isFilter = false,
  disabled = false,
  clearButtonReq = false,
  id,
  multiple = false,
  buttonElement = null,
  searchable = true,
  clearBit = 0,
  maxHeightForMenuItems = 300,
  clearList,
  disableChildIfParentIsChecked = false,
  autoHierarchySelection = true,
  canInitialFetch = true,
  specificSearchToolTipText = '',
  extraFilter = false,
  addedFilter = false,
  hideFilter,
  variant = 'custom',
  hideLabel = false,
  width,
  selectedBgColor = '#39393C',
  selectedTextColor = '#ffffff',
  unSelectedBorderColor = '#EAEAEB',
  height = TRIGGER_HEIGHT,
  triggerClassName,
  contentClassName,
  hideRadioButton = true,
  renderSelectedItemsInTreeStructure = false,
  closeButtonReq = true,
  wrapperClassName,
  showSelectedItems = false,
  ...props
}: RadixInfiniteDropDown) {
  const singleSelectAllowed = !multiple;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const clearSelectionRef = useRef<HTMLButtonElement>(null);

  const [selectedContainerFocused, setSelectedContainerFocused] = useState(false);
  const selectedContainerRef = useRef<HTMLDivElement>(null);
  const [searchKey, setSearchKey] = useState('');
  const [selectedItems, setSelectedItems] = useState<TreeNode[]>(defaultValues);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showSelected, setShowSelected] = useState(false);
  const [disabledByParent, setDisabledByParent] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState<number | null>(null);

  const announceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSearch = useDebounce(searchKey, 500);
  const queryClient = useQueryClient();
  // Computed values
  const isCustom = variant === 'custom';
  const dropdownWidth = width ?? DEFAULT_WIDTH;

  // When an explicit width is provided, the trigger should use it directly.
  // Otherwise, cap the trigger width with maxWidth so it can shrink if needed.
  const triggerWidthStyle = width ? { width: dropdownWidth } : { maxWidth: dropdownWidth };

  // For the popover content, prefer the measured trigger width to keep
  // the panel aligned with its trigger, mirroring RadixDropDown behavior.
  const contentWidthStyle = {
    width:
      anchorWidth !== null
        ? anchorWidth
        : isCustom
          ? (width ?? 'var(--radix-popover-anchor-width)')
          : dropdownWidth,
  };

  const heightStyle = { maxHeight: height };
  const chevronIcon = open ? faChevronUp : faChevronDown;

  const findAndExpandAncestors = (
    nodes: TreeNode[],
    selectedIds: Set<string>,
    path: string[] = [],
    expandMap: Record<string, boolean> = {}
  ): Record<string, boolean> => {
    if (nodes?.length > 0) {
      for (const node of nodes) {
        const currentPath = [...path, node.id];
        if (selectedIds.has(node.id)) {
          for (const id of path) {
            expandMap[id] = true;
          }
        }
        if (node.children?.length) {
          findAndExpandAncestors(node.children, selectedIds, currentPath, expandMap);
        }
      }
    }
    return expandMap;
  };

  const selectableItems = useMemo(() => {
    return selectedItems.filter((item) => !disabledByParent.has(item.id));
  }, [selectedItems, disabledByParent]);

  const clearSelection = (parentReset?: boolean) => {
    setSelectedItems([]);
    onChange?.([], parentReset);
    setExpanded({});
    setDisabledByParent(new Set());
  };

  useEffect(() => {
    if (clearBit > 0) {
      clearSelection();
      if (props?.refetchOnClear) {
        queryClient.clear();
      }
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && id && clearList.includes(id)) {
      clearSelection(true);
      if (props?.refetchOnClear) {
        queryClient.clear();
      }
    }
  }, [clearList]);

  const collectChildren = (node: TreeNode): TreeNode[] => {
    let result: TreeNode[] = [];
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        result.push(child, ...collectChildren(child));
      }
    }
    return result;
  };

  const toggleExpand = (item: any) => {
    const itemId = item.id;
    let updated: TreeNode[] = [...selectedItems];
    const selectedItemIds = selectedItems?.map((el: any) => el.id);
    const isIdsIncluded = selectedItemIds?.includes(itemId);

    if (disableChildIfParentIsChecked && selectedItems?.length > 0 && isIdsIncluded) {
      const children = collectChildren(item);
      const newDisabledByParent = new Set(disabledByParent);

      children.forEach((child) => {
        setExpanded((prev) => ({ ...prev, [child.id]: true }));
        if (disableChildIfParentIsChecked) {
          newDisabledByParent.add(child.id);
        }
        if (autoHierarchySelection) {
          if (!updated.some((i) => i.id === child.id)) {
            updated.push({ ...child, checked: true });
          }
        }
        setSelectedItems(updated);
      });

      setDisabledByParent(newDisabledByParent);
    }

    setExpanded((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const toggleSelect = (item: TreeNode, _fromChip?: boolean) => {
    if (item.disabled || disabledByParent.has(item.id)) {
      return;
    }

    const isSelected = selectedItems.some((i) => i.id === item.id);
    let updated: TreeNode[] = [...selectedItems];
    const newDisabledByParent = new Set(disabledByParent);

    if (singleSelectAllowed) {
      updated = isSelected ? [] : [{ ...item, checked: true }];
      newDisabledByParent.clear();
    } else {
      const children = collectChildren(item);
      if (isSelected) {
        const idsToRemove = new Set([item.id, ...children.map((c) => c.id)]);
        updated = updated.filter((i) => !idsToRemove.has(i.id));
        children.forEach((child) => newDisabledByParent.delete(child.id));
      } else {
        updated.push({ ...item, checked: true });
        setExpanded((prev) => ({ ...prev, [item.id]: true }));

        children.forEach((child) => {
          if (autoHierarchySelection) {
            if (!updated.some((i) => i.id === child.id)) {
              updated.push({ ...child, checked: true });
            }
          }
          setExpanded((prev) => ({ ...prev, [child.id]: true }));
          if (disableChildIfParentIsChecked) {
            newDisabledByParent.add(child.id);
          }
        });
      }
    }

    updated = Array.from(new Map(updated.map((i) => [i.id, i])).values());
    // console.log('updated', updated);
    setSelectedItems(updated);
    setDisabledByParent(newDisabledByParent);
    onChange?.(updated);
  };

  useEffect(() => {
    queryClient.clear();
  }, [debouncedSearch]);

  const { data, fetchNextPage, isFetching, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: queryKey ?? [],
    // Delegate paging details to the provided fetcher; we keep this loosely typed for flexibility.
    queryFn: (params: { pageParam?: number }) =>
      fetchDataOnScroll?.({ params, debouncedSearch }) ??
      Promise.resolve({ data: [] as TreeNode[], totalCount: 0 }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage: unknown, _allPages: unknown, lastPageParam: number) =>
      lastPageParam + 1,
    refetchOnWindowFocus: false,
    enabled: canInitialFetch ? true : false,
  } as any) as any;

  const flatData: TreeNode[] = useMemo(
    () => (data?.pages?.flatMap((page: any) => page?.data ?? []) ?? []) as TreeNode[],
    [data]
  );
  const totalDBRowCount: number = (data?.pages?.[0]?.totalCount as number) ?? 0;
  const totalFetched = flatData.length;

  useEffect(() => {
    if (defaultValues.length > 0 && data?.pages?.length > 0) {
      const pages: any[] = data?.pages ?? [];
      const lastPageIndex = pages.length - 1;
      const lastPage = lastPageIndex >= 0 ? (pages[lastPageIndex] ?? {}) : {};
      const dataToBeChecked = (lastPage as any)?.data?.length > 0 ? (lastPage as any).data : [];
      const selectedIds = new Set(defaultValues.map((item) => item.id));
      const expandMap = findAndExpandAncestors(dataToBeChecked, selectedIds);
      setExpanded((prev) => ({ ...prev, ...expandMap }));
    }
  }, [defaultValues, flatData]);

  useEffect(() => {
    if (!isFetching && !isLoading && flatData.length >= 0) {
      if (announceTimeoutRef.current) {
        clearTimeout(announceTimeoutRef.current);
      }
      announceTimeoutRef.current = setTimeout(() => {
        const countAllNodes = (nodes: TreeNode[]): number => {
          return nodes.reduce((count, node) => {
            return count + 1 + (node.children ? countAllNodes(node.children) : 0);
          }, 0);
        };
        const totalCount = countAllNodes(flatData);
        announce(`${totalCount || 'No'} result${totalCount === 1 ? '' : 's'} found`);
      }, 200);
    }
  }, [debouncedSearch, isFetching, isLoading, flatData]);

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement: HTMLDivElement | null) => {
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

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const [containerFocused, setContainerFocused] = useState(false);

  const flattenVisibleItems = (
    nodes: TreeNode[],
    level = 0,
    parentId: string | null = null
  ): { node: TreeNode; level: number; parentId: string | null }[] => {
    let result: { node: TreeNode; level: number; parentId: string | null }[] = [];
    for (const node of nodes) {
      result.push({ node, level, parentId });
      if (expanded[node.id] && node.children?.length) {
        result = result.concat(flattenVisibleItems(node.children, level + 1, node.id));
      }
    }
    return result;
  };

  const visibleItems = useMemo(() => flattenVisibleItems(flatData), [flatData, expanded]);

  const findParentInfo = (
    itemId: string,
    flatData: TreeNode[]
  ): { parentId?: string; parentLabel?: string } => {
    for (const node of flatData) {
      if (node.children?.some((child) => child.id === itemId)) {
        return { parentId: node.id, parentLabel: node.label };
      }
      if (node.children) {
        const result = findParentInfo(itemId, node.children);
        if (result.parentId) return result;
      }
    }
    return {};
  };

  const renderItem = (item: TreeNode, level = 0, indexOverride?: number): React.ReactElement => {
    const isExpanded = expanded[item.id];
    const hasChildren = item.hasChildren && item.children && item.children.length > 0;
    const index =
      typeof indexOverride === 'number'
        ? indexOverride
        : visibleItems.findIndex((v) => v.node.id === item.id);
    const isDisabledByParent = disabledByParent.has(item.id);
    const isSelected = selectedItems.some((i) => i.id === item.id);

    let nameOfInput = undefined;
    if (singleSelectAllowed) {
      if (level === 0) {
        nameOfInput = `radio-root-${id || label}`;
      } else {
        const parentInfo = findParentInfo(item.id, flatData);
        const parentLabelKey =
          parentInfo.parentLabel?.trim().replace(/\s+/g, '-').toLowerCase() ?? item.id;
        nameOfInput = parentInfo.parentId
          ? `radio-${parentInfo.parentId}-${parentLabelKey}`
          : `radio-${item.id}`;
      }
    }

    const optionBaseClass = classNames(
      'text-default relative flex cursor-pointer select-none rounded-none py-2 outline-none hover:bg-gray-100',
      'data-[highlighted]:bg-gray-100',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      !isCustom ? '' : OPTION_BORDER_B,
      item.disabled || isDisabledByParent ? 'cursor-not-allowed opacity-50' : '',
      focusedIndex === index ? 'bg-gray-100' : ''
    );

    return (
      <div
        key={item.id}
        id={`treeitem-${item.id}`}
        role="treeitem"
        aria-selected={isSelected}
        className={optionBaseClass}
        // Extra left padding per level to better visualize tree depth
        style={{ paddingLeft: 16 + level * 24 }}
        tabIndex={focusedIndex === index ? 0 : -1}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'ArrowDown': {
              e.preventDefault();
              let nextIndex = index + 1;
              while (
                nextIndex < visibleItems.length &&
                (visibleItems[nextIndex].node.disabled ||
                  disabledByParent.has(visibleItems[nextIndex].node.id))
              ) {
                nextIndex++;
              }
              if (nextIndex >= visibleItems.length) {
                nextIndex = visibleItems.findIndex(
                  ({ node }) => !node.disabled && !disabledByParent.has(node.id)
                );
              }
              if (nextIndex !== -1 && nextIndex !== index) {
                setFocusedIndex(nextIndex);
                const nextItemId = `treeitem-${visibleItems[nextIndex].node.id}`;
                setTimeout(() => {
                  document.getElementById(nextItemId)?.focus();
                }, 5);
              }
              break;
            }
            case 'ArrowUp': {
              e.preventDefault();
              let prevIndex = index - 1;
              while (
                prevIndex >= 0 &&
                (visibleItems[prevIndex].node.disabled ||
                  disabledByParent.has(visibleItems[prevIndex].node.id))
              ) {
                prevIndex--;
              }
              if (prevIndex < 0) {
                for (let i = visibleItems.length - 1; i >= 0; i--) {
                  if (
                    !visibleItems[i].node.disabled &&
                    !disabledByParent.has(visibleItems[i].node.id)
                  ) {
                    prevIndex = i;
                    break;
                  }
                }
              }
              if (prevIndex !== -1 && prevIndex !== index) {
                setFocusedIndex(prevIndex);
                const prevItemId = `treeitem-${visibleItems[prevIndex].node.id}`;
                setTimeout(() => {
                  document.getElementById(prevItemId)?.focus();
                }, 10);
              }
              break;
            }
            case 'ArrowRight': {
              e.preventDefault();
              if (item.hasChildren && !expanded[item.id]) {
                setExpanded((prev) => ({ ...prev, [item.id]: true }));
                announce(`${item.label} expanded`);
              } else if (item.hasChildren && expanded[item.id]) {
                const nextIndex = index + 1;
                if (
                  nextIndex < visibleItems.length &&
                  visibleItems[nextIndex].level > visibleItems[index].level
                ) {
                  setFocusedIndex(nextIndex);
                  const nextItemId = `treeitem-${visibleItems[nextIndex].node.id}`;
                  setTimeout(() => {
                    document.getElementById(nextItemId)?.focus();
                  }, 5);
                }
              }
              break;
            }
            case 'ArrowLeft': {
              e.preventDefault();
              if (item.hasChildren && expanded[item.id]) {
                setExpanded((prev) => ({ ...prev, [item.id]: false }));
                announce(`${item.label} collapsed`);
              } else {
                const currentLevel = visibleItems[index].level;
                const parentLevel = currentLevel - 1;
                if (parentLevel >= 0) {
                  for (let i = index - 1; i >= 0; i--) {
                    if (visibleItems[i].level === parentLevel) {
                      setFocusedIndex(i);
                      const parentItemId = `treeitem-${visibleItems[i].node.id}`;
                      setTimeout(() => {
                        document.getElementById(parentItemId)?.focus();
                      }, 0);
                      break;
                    }
                  }
                }
              }
              break;
            }
            case 'Enter':
            case ' ': {
              e.preventDefault();
              const wasSelected = selectedItems.some((i) => i.id === item.id);
              toggleSelect(item);
              announce(`${item.label} ${!wasSelected ? 'selected' : 'deselected'}`);
              break;
            }
            case 'Home': {
              e.preventDefault();
              const firstSelectableIdx = visibleItems.findIndex(({ node }) => !node.disabled);
              if (firstSelectableIdx !== -1) {
                setFocusedIndex(firstSelectableIdx);
                const firstItemId = `treeitem-${visibleItems[firstSelectableIdx].node.id}`;
                setTimeout(() => {
                  document.getElementById(firstItemId)?.focus();
                }, 0);
              }
              break;
            }
            case 'End': {
              e.preventDefault();
              let lastSelectableIdx = -1;
              for (let i = visibleItems.length - 1; i >= 0; i--) {
                if (!visibleItems[i].node.disabled) {
                  lastSelectableIdx = i;
                  break;
                }
              }
              if (lastSelectableIdx !== -1) {
                setFocusedIndex(lastSelectableIdx);
                const lastItemId = `treeitem-${visibleItems[lastSelectableIdx].node.id}`;
                setTimeout(() => {
                  document.getElementById(lastItemId)?.focus();
                }, 0);
              }
              break;
            }
            case 'Escape': {
              e.preventDefault();
              setContainerFocused(true);
              setTimeout(() => {
                document.getElementById('options-container')?.focus();
              }, 0);
              break;
            }
            default:
              break;
          }
        }}
        onClick={(e) => {
          if ((e.target as HTMLElement).getAttribute('data-expand-chev')) return;
          if (item.disabled || disabledByParent.has(item.id)) {
            e.preventDefault();
            return;
          }
          toggleSelect(item);
          setFocusedIndex(index);
        }}
      >
        <div className="flex items-center gap-2">
          {/* Checkbox/Radio */}
          {multiple ? (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelect(item)}
              disabled={item.disabled || isDisabledByParent}
              className={classNames(
                `h-4 w-4 flex-shrink-0 cursor-pointer rounded border ${BORDER_COLOR}`,
                isSelected ? 'border-gray-900 bg-gray-900' : '',
                item.disabled || isDisabledByParent ? 'cursor-not-allowed opacity-50' : ''
              )}
              aria-label={item?.label}
            />
          ) : !hideRadioButton ? (
            <input
              type="radio"
              name={nameOfInput}
              checked={isSelected}
              onChange={() => !(item.disabled || isDisabledByParent) && toggleSelect(item, true)}
              disabled={item.disabled || isDisabledByParent}
              className="text-primary mt-1 h-4 w-4 cursor-pointer rounded-full disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200"
              aria-label={item?.label}
            />
          ) : null}

          {/* Expand/Collapse Icon */}
          <FontAwesomeIcon
            icon={isExpanded ? faChevronDown : faChevronRight}
            className={`${ICON_SIZE_SM} ml-auto h-3 w-3 cursor-pointer text-gray-500 ${hasChildren ? 'visible' : 'invisible'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(item);
            }}
            data-expand-chev
            aria-hidden="true"
          />

          {/* Icon + Label */}
          <span className="truncate-content flex items-center gap-2 text-xs">
            {item?.icon && <span className={OPTION_ICON_WRAPPER}>{item.icon}</span>}
            <span>{item?.label}</span>
            {item?.subLabel && item?.subLabel?.length > 0 && level === 0 && (
              <Tooltip
                triggerElement={() => (
                  <div className="truncate-content text-xs text-gray-500">{item.subLabel}</div>
                )}
                tooltip={() => <div className="text-xs">{item?.subLabel}</div>}
                truncate
              />
            )}
          </span>
        </div>

        {/* Selected indicator for single select */}
        {!multiple && isSelected && (
          <span className="absolute right-3">
            <FontAwesomeIcon
              icon={faCheck}
              className={`${ICON_SIZE_SM} text-gray-900`}
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    );
  };

  function buildSelectedTreeFromSelected(items: TreeNode[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    items.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });

    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          if (map.has(child.id)) {
            map.get(item.id)!.children.push(map.get(child.id)!);
          }
        });
      }
    });

    items.forEach((item) => {
      const isChild = items.some((potentialParent) =>
        potentialParent.children?.some((child) => child.id === item.id)
      );
      if (!isChild) {
        roots.push(map.get(item.id)!);
      }
    });

    return roots;
  }

  const toggleShowSelected = () => {
    setShowSelected(!showSelected);
  };

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const getFocusableElements = () => {
    const elements: (HTMLElement | null)[] = [
      selectedButtonRef.current,
      searchInputRef.current,
      showSelected && selectedContainerFocused ? selectedContainerRef.current : null,
      optionsContainerRef.current,
      clearButtonReq ? clearSelectionRef.current : null,
      closeButtonRef.current,
    ];

    return elements.filter(
      (el): el is HTMLElement =>
        !!el && !el.hasAttribute('disabled') && !el.classList.contains('cursor-not-allowed')
    );
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const current = document.activeElement;
      const idx = focusable.indexOf(current as HTMLElement);
      let nextIdx;

      if (e.shiftKey) {
        nextIdx = idx <= 0 ? focusable.length - 1 : idx - 1;
      } else {
        nextIdx = idx === focusable.length - 1 ? 0 : idx + 1;
      }

      e.preventDefault();
      focusable[nextIdx]?.focus();
    }
  };

  const flatSelectedNodes: { item: TreeNode; level: number }[] = [];

  function flattenSelectedTree(nodes: TreeNode[], level = 0) {
    nodes.forEach((node) => {
      flatSelectedNodes.push({ item: node, level });
      if (expanded[node.id] && node.children && node.children.length > 0) {
        flattenSelectedTree(node.children, level + 1);
      }
    });
  }

  const selectedTree = buildSelectedTreeFromSelected(selectableItems);
  flattenSelectedTree(selectedTree);

  function handleUnselectAndFocus(item: TreeNode, idx: number) {
    const currentSelected = [...selectedItems];
    const children = collectChildren(item);
    const idsToRemove = new Set([item.id, ...children.map((c) => c.id)]);
    const newSelected = currentSelected.filter((i) => !idsToRemove.has(i.id));

    setSelectedItems(newSelected);
    toggleSelect(item, true);

    if (newSelected.length === 0) {
      setTimeout(() => {
        setShowSelected(false);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      }, 0);
      return;
    }

    setTimeout(() => {
      const newSelectedTree = buildSelectedTreeFromSelected(newSelected);
      const newFlatSelectedNodes: { item: TreeNode; level: number }[] = [];

      const flatten = (nodes: TreeNode[], level = 0) => {
        for (const node of nodes) {
          newFlatSelectedNodes.push({ item: node, level });
          if (expanded[node.id] && node.children && node.children.length > 0) {
            flatten(node.children, level + 1);
          }
        }
      };
      flatten(newSelectedTree);

      if (newFlatSelectedNodes.length === 0) {
        setShowSelected(false);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
        return;
      }

      const getParentId = (
        list: { item: TreeNode; level: number }[],
        startIdx: number,
        level: number
      ): string | null => {
        for (let i = startIdx; i >= 0; i--) {
          if (list[i].level === level - 1) return list[i].item.id;
        }
        return null;
      };

      let targetIdx = -1;
      const currentItemInfo = flatSelectedNodes[idx];

      if (!currentItemInfo) {
        targetIdx = 0;
      } else {
        const currentLevel = currentItemInfo.level;
        const parentId =
          currentLevel > 0 ? getParentId(flatSelectedNodes, idx - 1, currentLevel) : null;

        const findSibling = (direction: 1 | -1) => {
          for (let i = idx + direction; i >= 0 && i < flatSelectedNodes.length; i += direction) {
            const candidate = flatSelectedNodes[i];
            if (candidate.level < currentLevel) break;
            if (candidate.level === currentLevel) {
              const foundInNew = newFlatSelectedNodes.findIndex(
                (n) => n.item.id === candidate.item.id
              );
              if (foundInNew !== -1) {
                const candidateParentId =
                  currentLevel > 0 ? getParentId(flatSelectedNodes, i - 1, currentLevel) : null;
                if (candidateParentId === parentId) return foundInNew;
              }
            }
          }
          return -1;
        };

        targetIdx = findSibling(1);
        if (targetIdx === -1) targetIdx = findSibling(-1);

        if (targetIdx === -1 && parentId) {
          const foundParent = newFlatSelectedNodes.findIndex((n) => n.item.id === parentId);
          if (foundParent !== -1) targetIdx = foundParent;
        }

        if (targetIdx === -1) {
          if (idx < newFlatSelectedNodes.length) {
            targetIdx = idx;
          } else if (idx > 0) {
            targetIdx = Math.min(idx - 1, newFlatSelectedNodes.length - 1);
          } else {
            targetIdx = 0;
          }
        }

        targetIdx = Math.max(0, Math.min(targetIdx, newFlatSelectedNodes.length - 1));
      }

      const targetItemId = `selected-item-${newFlatSelectedNodes[targetIdx].item.id}`;
      setTimeout(() => {
        const el = document.getElementById(targetItemId);
        if (el) {
          el.focus();
        } else {
          searchInputRef.current?.focus();
        }
      }, 10);
    }, 50);
  }

  const hasValue = selectedItems.length > 0;

  const getDisplayText = (): React.ReactNode => {
    // Pill-style (non-custom) trigger text, mirroring RadixDropDown behavior.
    if (multiple) {
      if (!hasValue) {
        return label || placeholder || '';
      }

      if (selectableItems.length === 1) {
        return label ? `${label}: ${selectableItems[0].label}` : selectableItems[0].label;
      }

      // For multi-select with more than one selected item, return a React node:
      // "<label> | <badge with count>"
      return (
        <span className="inline-flex items-center gap-2">
          {label && <span>{label}</span>}
          <span
            className="bg-card inline-flex items-center rounded-full px-2 py-0.5 text-[10px]"
            style={{ color: selectedBgColor }}
          >
            {selectableItems.length}
          </span>
        </span>
      );
    }

    // Single select
    if (hasValue && selectedItems[0]?.label) {
      return label ? `${label}: ${selectedItems[0].label}` : selectedItems[0].label;
    }

    return label || placeholder || '';
  };
  const stopTriggerOpen = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedItems([]);
    onChange?.([]);
    setFocusedIndex(-1);
    setShowSelected(false);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  // Always keep track of the trigger's rendered width so we can explicitly
  // sync the popover content width to the trigger via this measured value.
  useEffect(() => {
    if (mainButtonRef.current) {
      const baseWidth = mainButtonRef.current.offsetWidth;
      setAnchorWidth(baseWidth ? baseWidth * 1.1 : baseWidth);
    }
  }, [width, open]);

  return (
    <div ref={wrapperRef} className={classNames('flex flex-col gap-1', wrapperClassName)}>
      {label && !hideLabel && <div className="text-sm font-medium text-gray-700">{label}</div>}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          {!buttonElement ? (
            <button
              ref={mainButtonRef}
              type="button"
              disabled={disabled}
              className={classNames(
                'inline-flex items-center justify-between text-xs outline-none',
                FOCUS_STYLES,
                'disabled:bg-disabled disabled:cursor-not-allowed disabled:opacity-50',
                isCustom
                  ? `justify-between rounded-md border ${BORDER_COLOR} text-default bg-input px-3 py-2 shadow-sm`
                  : classNames(
                      'gap-2 rounded-full border px-3 py-1.5 text-sm font-medium',
                      hasValue
                        ? ''
                        : 'hover:bg-selectedBgColor text-default bg-card hover:opacity-50'
                    ),
                triggerClassName
              )}
              style={{
                ...heightStyle,
                ...triggerWidthStyle,
                ...(!isCustom && hasValue
                  ? { backgroundColor: selectedBgColor, color: selectedTextColor }
                  : {}),
                ...(hasValue && !isCustom && { borderColor: selectedTextColor }),
                ...(!hasValue && !isCustom && { borderColor: unSelectedBorderColor }),
              }}
              aria-label={label || placeholder}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex w-full min-w-0 items-start gap-2 text-xs">
                  {dropIcon && (
                    <span
                      className={classNames(
                        !isCustom
                          ? hasValue
                            ? 'text-selectedTextColor'
                            : 'text-black'
                          : 'text-gray-500'
                      )}
                    >
                      <FontAwesomeIcon
                        icon={dropIcon}
                        className={ICON_SIZE_MD}
                        aria-hidden="true"
                      />
                    </span>
                  )}
                  <span className="flex min-w-0 flex-1 items-center gap-1">
                    <span className="flex min-w-0 items-start overflow-hidden text-ellipsis whitespace-nowrap">
                      <span className="block min-w-0 truncate">
                        {isCustom ? (
                          <>
                            {label}
                            {hasValue && (
                              <>
                                {' | '}
                                {singleSelectAllowed
                                  ? selectedItems[0]?.label
                                  : selectableItems.length === 1
                                    ? selectableItems[0].label
                                    : `${selectableItems.length} selected`}
                              </>
                            )}
                          </>
                        ) : (
                          <>{getDisplayText()}</>
                        )}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {hasValue && !isCustom && !multiple ? (
                    <button
                      type="button"
                      onClick={handleClear}
                      onPointerDownCapture={stopTriggerOpen}
                      className={classNames('flex-shrink-0 rounded p-1', FOCUS_STYLES)}
                      aria-label="Clear selection"
                      style={{ color: 'inherit' }}
                    >
                      <FontAwesomeIcon icon={faXmark} className={ICON_SIZE_MD} aria-hidden="true" />
                    </button>
                  ) : (
                    <FontAwesomeIcon
                      icon={chevronIcon}
                      className={`${ICON_SIZE_MD} flex-shrink-0 ${!isCustom ? 'hidden' : ''}`}
                      style={hasValue && !isCustom ? { color: 'inherit' } : { color: '#6b7280' }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                {addedFilter && !hasValue && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`hide ${label} Filter`}
                    id="select_remove_btn"
                    onClick={(e) => {
                      e.preventDefault();
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
                    onPointerDownCapture={stopTriggerOpen}
                    className="flex-shrink-0 cursor-pointer rounded p-1"
                  >
                    <FontAwesomeIcon icon={faCircleMinus} className="h-4 w-4" />
                  </span>
                )}
              </div>
            </button>
          ) : (
            <>{buttonElement}</>
          )}
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            ref={dropdownRef}
            className={classNames(
              'bg-card flex flex-col rounded-md text-xs shadow-xl',
              'shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]',
              'data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade will-change-[opacity,transform]',
              contentClassName
            )}
            sideOffset={4}
            align="start"
            side="bottom"
            avoidCollisions
            collisionPadding={8}
            style={{
              ...contentWidthStyle,
              maxHeight: 'var(--radix-popover-content-available-height)',
              zIndex: 9999,
            }}
            onKeyDown={handlePanelKeyDown}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex w-full items-center justify-between gap-2">
                <div className="p-2 text-[12px] font-semibold text-black">
                  {label && `${label} is`}
                </div>
                {closeButtonReq ? (
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    className={classNames(
                      'rounded text-[12px] text-black hover:underline',
                      FOCUS_STYLES
                    )}
                    aria-label="Close dropdown"
                    tabIndex={0}
                  >
                    <FontAwesomeIcon icon={faXmark} className={ICON_SIZE_MD} aria-hidden="true" />
                  </button>
                ) : (
                  <span />
                )}
              </div>

              {selectedItems.length > 0 && multiple && showSelectedItems && (
                <button
                  ref={selectedButtonRef}
                  type="button"
                  onClick={toggleShowSelected}
                  className={classNames(
                    'flex items-center gap-1 text-[10px] text-gray-700 hover:underline',
                    FOCUS_STYLES
                  )}
                  aria-expanded={showSelected}
                >
                  <span>{selectableItems.length} selected</span>
                  {/* <FontAwesomeIcon
                    icon={showSelected ? faChevronUp : faChevronDown}
                    className={ICON_SIZE_SM}
                    aria-hidden="true"
                  /> */}
                </button>
              )}
            </div>

            {showSelected && selectedItems.length > 0 && (
              <div
                ref={selectedContainerRef}
                className="flex flex-wrap gap-1 overflow-y-auto p-2"
                style={{ maxHeight: CHIPS_CONTAINER_HEIGHT, minHeight: '40px' }}
                tabIndex={0}
                onFocus={() => setSelectedContainerFocused(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setSelectedContainerFocused(false);
                  }
                }}
              >
                {renderSelectedItemsInTreeStructure ? (
                  <div id="selected-items-tree-structure">
                    {flatSelectedNodes.map(({ item, level }, idx) => {
                      return (
                        <div
                          key={item.id}
                          className={classNames(
                            'flex w-full cursor-pointer items-center gap-1 rounded p-1',
                            'text-xs',
                            'hover:bg-gray-100',
                            'focus-indicator',
                            'outline-none',
                            item.disabled ? 'text-gray-400' : ''
                          )}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              handleUnselectAndFocus(item, idx);
                            }
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              const nextIdx = idx < flatSelectedNodes.length - 1 ? idx + 1 : 0;
                              const nextItemId = `selected-item-${flatSelectedNodes[nextIdx].item.id}`;
                              setTimeout(() => {
                                document.getElementById(nextItemId)?.focus();
                              }, 10);
                            }
                            if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              const prevIdx = idx > 0 ? idx - 1 : flatSelectedNodes.length - 1;
                              const prevItemId = `selected-item-${flatSelectedNodes[prevIdx].item.id}`;
                              setTimeout(() => {
                                document.getElementById(prevItemId)?.focus();
                              }, 10);
                            }
                            if (e.key === 'Escape') {
                              e.preventDefault();
                              setTimeout(() => {
                                searchInputRef.current?.focus();
                              }, 50);
                            }
                            if (e.key === 'Tab') {
                              setSelectedContainerFocused(false);
                              searchInputRef.current?.focus();
                            }
                            if (
                              e.key === 'ArrowRight' &&
                              item.children &&
                              item.children.length > 0 &&
                              !expanded[item.id]
                            ) {
                              e.preventDefault();
                              setExpanded((prev) => ({ ...prev, [item.id]: true }));
                            }
                            if (
                              e.key === 'ArrowLeft' &&
                              item.children &&
                              item.children.length > 0 &&
                              expanded[item.id]
                            ) {
                              e.preventDefault();
                              setExpanded((prev) => ({ ...prev, [item.id]: false }));
                            }
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleUnselectAndFocus(item, idx);
                          }}
                          onFocus={() => setSelectedContainerFocused(false)}
                        >
                          <div
                            className="flex items-center gap-1"
                            style={{ marginLeft: level * 24 }}
                          >
                            {/* Checkbox / Radio for selected tree, styled to match main list */}
                            {multiple ? (
                              <div
                                className={classNames(
                                  `flex flex-shrink-0 ${ICON_SIZE_CHECKBOX} items-center justify-center rounded border ${BORDER_COLOR}`,
                                  selectedItems.some((i) => i.id === item.id)
                                    ? 'border-gray-900 bg-gray-900'
                                    : '',
                                  item.disabled ? 'cursor-not-allowed opacity-50' : ''
                                )}
                              >
                                {selectedItems.some((i) => i.id === item.id) && (
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className={`${ICON_SIZE_SM} text-white`}
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            ) : (
                              <input
                                tabIndex={-1}
                                type="radio"
                                checked={selectedItems?.[0]?.id === item.id}
                                onChange={() => handleUnselectAndFocus(item, idx)}
                                disabled={item.disabled}
                                className="focus-visible:primary text-primary top-1/2 mt-1 h-4 w-4 cursor-pointer rounded-full border-[#888888] disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200"
                                aria-label={item?.label}
                              />
                            )}
                            {item.children && item.children.length > 0 && (
                              <button
                                type="button"
                                tabIndex={-1}
                                className="hover:bg-primary-100 flex items-center justify-center rounded-sm border-none bg-transparent p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                                }}
                                aria-expanded={expanded[item.id]}
                                aria-label={`${expanded[item.id] ? 'Collapse' : 'Expand'} ${item.label}`}
                              >
                                <FontAwesomeIcon
                                  icon={expanded[item.id] ? faChevronDown : faChevronRight}
                                  className="text-secondary h-3 w-3"
                                  aria-hidden="true"
                                />
                              </button>
                            )}
                            <span className={item.disabled ? 'text-gray-400' : ''}>
                              {item.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    {flatSelectedNodes.map(({ item }, idx) => (
                      <span key={item.id} id={`selected-item-${item.id}`} className={CHIP_STYLES}>
                        {item.label}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnselectAndFocus(item, idx);
                          }}
                          className={classNames(CHIP_REMOVE_BTN, FOCUS_STYLES, 'rounded-full')}
                          aria-label={`Remove ${item.label}`}
                        >
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            className={ICON_SIZE_SM}
                            aria-hidden="true"
                          />
                        </button>
                      </span>
                    ))}
                  </>
                )}
              </div>
            )}
            {/* Search */}
            {searchable && (
              <div className={SECTION_SEARCH}>
                <div className="bg-card flex items-center gap-2 rounded-lg border border-[#EAEAEB] px-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={placeholder || 'Search'}
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    className={classNames(
                      'bg-card min-w-0 flex-1 border-0 p-1 py-2 text-sm text-xs text-gray-900 outline-none placeholder:text-gray-500',
                      FOCUS_STYLES
                    )}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              ref={(el) => {
                tableContainerRef.current = el;
                optionsContainerRef.current = el;
              }}
              id="options-container"
              className="overflow-x-hidden overflow-y-auto p-1"
              style={{ maxHeight: maxHeightForMenuItems }}
              role="tree"
              aria-label={label}
              tabIndex={containerFocused ? 0 : -1}
              onFocus={() => setContainerFocused(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setContainerFocused(false);
                }
              }}
              onScroll={(e) => {
                fetchMoreOnBottomReached(e.currentTarget);
              }}
            >
              {visibleItems && visibleItems.length > 0 ? (
                <>
                  {visibleItems.map(({ node, level }, idx) => renderItem(node, level, idx))}
                  {(isFetchingNextPage || isLoading) && (
                    <div className="px-2 pt-2 pb-1 text-start text-[11px] text-gray-500">
                      Loading more...
                    </div>
                  )}
                </>
              ) : (
                <>
                  {!isFetchingNextPage && !isLoading && (
                    <div className="flex items-center justify-center px-3 py-2 text-[11px] text-gray-500 italic">
                      No options found
                    </div>
                  )}
                  {(isFetchingNextPage || isLoading) && (
                    <div className="px-2 pt-2 pb-1 text-start text-[11px] text-gray-500">
                      Loading more...
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className={SECTION_FOOTER}>
              {clearButtonReq ? (
                <button
                  ref={clearSelectionRef}
                  type="button"
                  onClick={handleClear}
                  disabled={!hasValue}
                  className={classNames(
                    'rounded text-[12px] text-black hover:underline',
                    FOCUS_STYLES,
                    !hasValue && 'cursor-not-allowed opacity-50 hover:no-underline'
                  )}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && !e.shiftKey && clearSelectionRef.current) {
                      e.preventDefault();
                      setTimeout(() => clearSelectionRef.current?.focus(), 0);
                    }
                  }}
                  aria-label="Clear selection"
                  tabIndex={0}
                >
                  Clear all selections
                </button>
              ) : (
                <span />
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
