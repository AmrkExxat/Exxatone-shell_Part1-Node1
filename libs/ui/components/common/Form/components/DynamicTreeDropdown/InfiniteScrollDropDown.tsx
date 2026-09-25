import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Props, TreeNode } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import {
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleMinus,
  faCircleXmark,
} from '@fortawesome/pro-light-svg-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import useDebounce from '../../../../../../utilities/utils/debounce';
import { announce } from '@react-aria/live-announcer';
import { Tooltip } from '../../../Tooltip';

export default function InfiniteScrollDropDown({
  queryKey,
  fetchDataOnScroll,
  onChange,
  placeholder,
  label,
  dropIcon,
  defaultValues = [],
  isFilter = false,
  disabled = false,
  clearButtonReq = true,
  id,
  multiple = false,
  buttonElement = null,
  searchable = true,
  clearBit = 0,
  detachedBox = false,
  maxHeightForMenuItems,
  clearList,
  maxWidth = '320px',
  disableChildIfParentIsChecked = false,
  autoHierarchySelection = true,
  canInitialFetch = true,
  specificSearchToolTipText = '',
  extraFilter = false,
  addedFilter = false,
  hideFilter,
  isDarkTheme = false,
  selectParentOnChildSelect = false,
  hideLabelOnSelect = false,
  disabledLabel = '',
  ...props
}: Props) {
  const singleSelectAllowed = !multiple;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const clearSelectionRef = useRef<HTMLButtonElement>(null);
  const [selectedContainerFocused, setSelectedContainerFocused] = useState(false);
  const selectedContainerRef = useRef<HTMLDivElement>(null);

  const [searchKey, setSearchKey] = useState('');
  const [selectedItems, setSelectedItems] = useState<TreeNode[]>(defaultValues);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showSelected, setShowSelected] = useState<boolean>(false);
  const [openedOnce, setOpenedOnce] = useState<boolean>(false);

  const [disabledByParent, setDisabledByParent] = useState<Set<string>>(new Set());
  const announceTimeoutRef = useRef(null);

  const debouncedSearch = useDebounce(searchKey, 500);
  const queryClient = useQueryClient();
  const [searchFocused, setSearchFocused] = useState(false);

  const [dropboxStyle, setDropboxStyle] = useState<any>({
    minWidth: '264px',
    maxWidth: maxWidth ?? '320px',
    display: 'none',
  });

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
      return expandMap;
    }
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
    if (clearList?.length && clearList.includes(id)) {
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

  const findParentNode = (itemId: string, nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
      if (node.children?.some((child) => child.id === itemId)) return node;
      if (node.children?.length) {
        const found = findParentNode(itemId, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const syncAncestors = (
    itemId: string,
    currentUpdated: TreeNode[],
    treeData: TreeNode[]
  ): TreeNode[] => {
    const parent = findParentNode(itemId, treeData);
    if (!parent) return currentUpdated;

    const directChildren = parent?.children ?? [];
    const selectedInUpdated = directChildren?.filter((c) =>
      currentUpdated.some((i) => i.id === c.id)
    );
    const selectedCount = selectedInUpdated?.length;
    const allFullyChecked =
      selectedCount === directChildren?.length &&
      selectedInUpdated?.every((c) => {
        const match = currentUpdated?.find((i) => i.id === c.id);
        return match && !match.intermediate;
      });

    let result = currentUpdated?.filter((i) => i.id !== parent.id);

    if (selectedCount === 0) {
    } else if (allFullyChecked) {
      result.push({ ...parent, checked: true, intermediate: false });
    } else {
      result.push({ ...parent, checked: false, intermediate: true });
    }

    return syncAncestors(parent?.id, result, treeData);
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

  const toggleSelect = (item: TreeNode, parent = false) => {
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
        if (selectParentOnChildSelect) {
          updated = syncAncestors(item.id, updated, flatData);
        }
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
        if (selectParentOnChildSelect) {
          updated = syncAncestors(item.id, updated, flatData);
        }
      }
    }

    updated = Array.from(new Map(updated.map((i) => [i.id, i])).values());

    setSelectedItems(updated);
    setDisabledByParent(newDisabledByParent);
    onChange?.(updated);
  };

  useEffect(() => {
    queryClient.clear();
  }, [debouncedSearch]);

  const { data, fetchNextPage, isFetching, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey,
    queryFn: (params) => fetchDataOnScroll({ params, debouncedSearch }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => lastPageParam + 1,
    refetchOnWindowFocus: false,
    enabled: canInitialFetch ? true : openedOnce,
  });

  const flatData = useMemo(() => data?.pages?.flatMap((page) => page?.data ?? []) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.totalCount ?? 0;
  const totalFetched = flatData.length;

  useEffect(() => {
    if (defaultValues.length > 0 && data?.pages?.length > 0) {
      const dataToBeChecked =
        data?.pages?.[data?.pages?.length - 1]?.data?.length > 0
          ? data?.pages?.[data?.pages?.length - 1]?.data
          : [];
      const selectedIds = new Set(defaultValues.map((item) => item.id));
      const expandMap = findAndExpandAncestors(dataToBeChecked, selectedIds);
      setExpanded((prev) => ({ ...prev, ...expandMap }));

      if (selectParentOnChildSelect && flatData.length > 0) {
        let synced: TreeNode[] = [...defaultValues];
        defaultValues.forEach((item) => {
          synced = syncAncestors(item.id, synced, flatData);
        });
        setSelectedItems(synced);
      }
    }
  }, [defaultValues, flatData]);

  useEffect(() => {
    if (!isFetching && !isLoading && flatData.length >= 0) {
      if (announceTimeoutRef.current) {
        clearTimeout(announceTimeoutRef.current);
      }

      announceTimeoutRef.current = setTimeout(() => {
        const countAllNodes = (nodes: TreeNode[]) => {
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

  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
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

  const renderItem = (item: TreeNode, level = 0, indexOverride?: number): JSX.Element => {
    const isExpanded = expanded[item.id];
    const hasChildren = item.hasChildren && item.children && item.children.length > 0;
    const index =
      typeof indexOverride === 'number'
        ? indexOverride
        : visibleItems.findIndex((v) => v.node.id === item.id);
    const isDisabledByParent = disabledByParent.has(item.id);

    let nameOfInput = undefined;
    if (singleSelectAllowed) {
      if (level === 0) {
        nameOfInput = `radio-root-${id || label}`;
      } else {
        const parentInfo = findParentInfo(item.id, flatData);
        nameOfInput = parentInfo.parentId
          ? `radio-${parentInfo.parentId}-${parentInfo.parentLabel?.trim().replace(/\s+/g, '-').toLowerCase()}`
          : `radio-${item.id}`;
      }
    }

    return (
      <div
        key={item.id}
        id={`treeitem-${item.id}`}
        tabIndex={focusedIndex === index ? 0 : -1}
        role="treeitem"
        aria-level={level + 1}
        aria-expanded={hasChildren ? !!isExpanded : undefined}
        aria-selected={selectedItems.some((i) => i.id === item.id)}
        className={classNames(
          'p-1 outline-none hover:bg-gray-100',
          item.disabled || isDisabledByParent
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:bg-gray-100',
          focusedIndex === index ? 'focus-indicator bg-hover' : ''
        )}
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
        <div
          className="flex items-center justify-between rounded px-1 py-1 text-sm"
          style={{ marginLeft: level * 12 }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <input
                tabIndex={-1}
                type={singleSelectAllowed ? 'radio' : 'checkbox'}
                name={nameOfInput}
                ref={(el) => {
                  if (el && !singleSelectAllowed && selectParentOnChildSelect) {
                    el.indeterminate = selectedItems.some(
                      (i) => i.id === item.id && i.intermediate
                    );
                  }
                }}
                checked={
                  singleSelectAllowed
                    ? selectedItems?.[0]?.id === item.id
                    : selectParentOnChildSelect
                      ? selectedItems.some((i) => i.id === item.id && !i.intermediate) ||
                        (!autoHierarchySelection && isDisabledByParent)
                      : selectedItems.some((i) => i.id === item.id) ||
                        (!autoHierarchySelection && isDisabledByParent)
                }
                onChange={() => !(item.disabled || isDisabledByParent) && toggleSelect(item, true)}
                disabled={item.disabled || isDisabledByParent}
                className={
                  singleSelectAllowed
                    ? 'focus-visible:primary text-primary top-1/2 mt-1 h-4 w-4 cursor-pointer rounded-full border-[#888888] disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200'
                    : 'mt-[1px] h-[1.1rem] w-[1.1rem] cursor-pointer rounded-[3px] ' +
                      (item.disabled || isDisabledByParent
                        ? ' cursor-not-allowed text-gray-500 opacity-50'
                        : 'text-primary')
                }
                aria-label={item?.label}
              />
              <FontAwesomeIcon
                icon={isExpanded ? faChevronDown : faChevronRight}
                className={`ml-auto h-3 w-3 cursor-pointer text-gray-500 ${hasChildren ? 'visible' : 'invisible'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item);
                }}
                data-expand-chev
              />
            </div>
            <div>
              <div className={item.disabled || isDisabledByParent ? 'text-gray-400' : ''}>
                {item.label}
              </div>
              {item?.subLabel?.length > 0 && level === 0 && (
                <Tooltip
                  triggerWrapperClass="truncate"
                  triggerElement={() => (
                    <span className="text-xs text-gray-400">{item?.subLabel}</span>
                  )}
                  tooltip={() => <div className="w-full p-2">{item?.subLabel}</div>}
                />
              )}
            </div>
          </div>
        </div>
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
            maxWidth: maxWidth ?? '320px',
            left: left,
            bottom: bottom,
            display: 'flex',
            zIndex: 70,
            maxHeight: window.innerHeight - (buttonRect.top + 20),
          });
        } else {
          setDropboxStyle({
            minWidth: '264px',
            maxWidth: maxWidth ?? '320px',
            left: left,
            top: top,
            display: 'flex',
            zIndex: 70,
            maxHeight: window.innerHeight - (buttonRect.bottom + 20),
          });
        }

        dropdownElement.style.visibility = '';
      } else {
        setDropboxStyle({
          minWidth: '264px',
          maxWidth: maxWidth ?? '320px',
          display: 'flex',
          zIndex: 51,
        });
      }
    } else {
      setDropboxStyle({
        minWidth: '264px',
        maxWidth: maxWidth ?? '320px',
        display: 'none',
      });
    }
  };

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
  const selectedRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const renderSearchTooltip = () => {
    if (specificSearchToolTipText?.length > 0) {
      return `${specificSearchToolTipText}`;
    }

    return 'Type at least 3 characters to search';
  };

  return (
    <div className={`flex ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`} ref={wrapperRef}>
      <Popover
        className={`relative ${isFilter ? '' : 'text-start'} ${props?.mainWrapperClass ?? ''}`}
      >
        {({ open, close }) => {
          const popoverButton = (
            <PopoverButton
              ref={mainButtonRef}
              style={{ borderRadius: '0.25rem' }}
              id={id ?? label}
              disabled={disabled}
              role="combobox"
              tabIndex={0}
              className={`focus-indicator relative w-fit ${props?.btnWrapperClass ?? ''}`}
              onClick={() => updateDropBoxStyles(true)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && dropboxStyle.display !== 'flex') {
                  e.preventDefault();
                  updateDropBoxStyles(true);
                }
              }}
            >
              <>
                {!buttonElement ? (
                  <div
                    style={{ borderRadius: '0.25rem' }}
                    className={classNames(
                      props?.buttonElementClass ?? '',
                      'focus-indicator relative flex w-fit items-center border px-2 py-1.5 text-sm',
                      disabled
                        ? 'bg-disabled bg-opacity-75 text-disabled cursor-not-allowed border-[#e5e7eb] shadow-none'
                        : selectedItems?.length && open
                          ? 'selected-opened-filter'
                          : selectedItems?.length && !open
                            ? 'selected-filter'
                            : open && !selectedItems?.length
                              ? 'opened-filter'
                              : 'newState-filter'
                    )}
                  >
                    {dropIcon && <FontAwesomeIcon icon={dropIcon} className="filter-icon mr-2" />}
                    <div className={`${selectedItems?.length > 0 ? 'mr-8' : 'mr-2'}`}>
                      {hideLabelOnSelect && selectedItems?.length > 0 ? '' : label}
                      {selectedItems?.length > 0 && !singleSelectAllowed && (
                        <>
                          {!hideLabelOnSelect && <span className="pl-2">|</span>}
                          <span className="text-primary mr-1 px-2 text-[.8rem] font-semibold">
                            {selectableItems.length === 1
                              ? selectableItems[0].label
                              : `${selectableItems.length} selected`}
                          </span>
                        </>
                      )}
                      {selectedItems?.length > 0 && singleSelectAllowed && (
                        <>
                          {!hideLabelOnSelect && <span className="pl-2">|</span>}
                          <span className="text-primary mr-1 px-2 text-[.8rem] font-semibold">
                            {selectedItems?.[0]?.label}
                          </span>
                        </>
                      )}
                    </div>
                    {addedFilter && selectedItems?.length === 0 && (
                      <button
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          close();
                          hideFilter?.();
                        }}
                        aria-label={`Clear selection for ${label} Filter`}
                      >
                        <FontAwesomeIcon icon={faCircleMinus} className={`h-4 w-4`} />
                      </button>
                    )}
                  </div>
                ) : (
                  <>{buttonElement}</>
                )}
              </>
            </PopoverButton>
          );

          return (
            <>
              {disabledLabel && disabled ? (
                <Tooltip
                  triggerWrapperClass="inline-flex w-fit"
                  triggerElement={() => popoverButton}
                  tooltip={() => <span className="p-3 text-sm text-gray-700">{disabledLabel}</span>}
                />
              ) : (
                popoverButton
              )}

              {selectedItems.length > 0 && (
                <button
                  className={`focus-indicator absolute top-1/2 right-3 z-10 flex -translate-y-1/2 ${props?.xMarkClass}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItems([]);
                    onChange?.([]);
                    setFocusedIndex(-1);
                    setShowSelected(false);
                    setTimeout(() => {
                      searchInputRef.current?.focus();
                    }, 50);
                  }}
                  disabled={disabled}
                  ref={clearButtonRef}
                  aria-label={`Clear selection for ${label} Filter`}
                >
                  <FontAwesomeIcon icon={faCircleXmark} className="text-primary h-5 w-5" />
                </button>
              )}

              <PopoverPanel
                portal={detachedBox ? true : false}
                ref={dropdownRef}
                unmount={false}
                style={dropboxStyle}
                className={classNames(
                  'bg-card rounded-lg border shadow-md',
                  detachedBox ? 'fixed' : 'absolute',
                  isDarkTheme ? 'dark-variant' : 'blue-variant'
                )}
                role="tree"
                tabIndex={-1}
                onKeyDown={handlePanelKeyDown}
              >
                <div className="w-full">
                  <div>
                    <div className="mt-2 flex items-center justify-between px-2 text-xs">
                      <label
                        htmlFor={`search_${label}`}
                        className="font-semibold text-gray-500"
                        role="heading"
                        aria-level={3}
                      >
                        {label}
                      </label>
                      {selectedItems?.length > 0 && (
                        <button
                          ref={selectedButtonRef}
                          onClick={toggleShowSelected}
                          className="link-text font-semibold"
                          aria-label={`${selectableItems?.length} options selected`}
                          aria-expanded={showSelected ? 'true' : 'false'}
                          aria-live="polite"
                          tabIndex={0}
                          disabled={false}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown' && visibleItems.length > 0) {
                              e.preventDefault();
                              setFocusedIndex(0);
                              const firstItemId = `treeitem-${visibleItems[0].node.id}`;
                              setTimeout(() => {
                                document.getElementById(firstItemId)?.focus();
                              }, 0);
                            } else if (e.key === 'ArrowUp' && visibleItems.length > 0) {
                              e.preventDefault();
                              setFocusedIndex(visibleItems.length - 1);
                              const lastItemId = `treeitem-${visibleItems[visibleItems.length - 1].node.id}`;
                              setTimeout(() => {
                                document.getElementById(lastItemId)?.focus();
                              }, 0);
                            } else if (e.key === 'Tab') {
                              if (e.shiftKey) {
                                e.preventDefault();
                                searchInputRef.current?.focus();
                              } else if (showSelected && flatSelectedNodes.length > 0) {
                                e.preventDefault();
                                setSelectedContainerFocused(true);
                                setTimeout(() => {
                                  selectedContainerRef.current?.focus();
                                }, 0);
                              }
                            } else if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleShowSelected();
                            }
                          }}
                        >
                          {`${selectableItems?.length} selected`}

                          <FontAwesomeIcon
                            icon={showSelected ? faChevronUp : faChevronDown}
                            className="ml-2"
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>
                    {showSelected && (
                      <div
                        ref={selectedContainerRef}
                        id="selected-items-container"
                        className={classNames(
                          'overflow-y-auto p-1 outline-none',
                          selectedContainerFocused ? 'focus-indicator focus-visible ring-inset' : ''
                        )}
                        style={{ maxHeight: '150px' }}
                        aria-label="Selected options"
                        role="group"
                        aria-describedby="selected-options-count"
                        tabIndex={selectedContainerFocused ? 0 : -1}
                        onFocus={() => setSelectedContainerFocused(true)}
                        onBlur={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            setSelectedContainerFocused(false);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) {
                            return;
                          }
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setSelectedContainerFocused(false);
                            if (flatSelectedNodes.length > 0) {
                              const firstItemId = `selected-item-${flatSelectedNodes[0].item.id}`;
                              setTimeout(() => {
                                document.getElementById(firstItemId)?.focus();
                              }, 0);
                            }
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setSelectedContainerFocused(false);
                            if (flatSelectedNodes.length > 0) {
                              const lastItemId = `selected-item-${flatSelectedNodes[flatSelectedNodes.length - 1].item.id}`;
                              setTimeout(() => {
                                document.getElementById(lastItemId)?.focus();
                              }, 0);
                            }
                          } else if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedContainerFocused(false);
                            if (flatSelectedNodes.length > 0) {
                              const firstItemId = `selected-item-${flatSelectedNodes[0].item.id}`;
                              setTimeout(() => {
                                document.getElementById(firstItemId)?.focus();
                              }, 0);
                            }
                          }
                        }}
                      >
                        <span id="selected-options-count" className="sr-only">
                          {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}{' '}
                          selected
                        </span>
                        {flatSelectedNodes.map(({ item, level }, idx) => (
                          <div
                            key={item.id}
                            id={`selected-item-${item.id}`}
                            ref={(el) => (selectedRefs.current[idx] = el)}
                            tabIndex={0}
                            style={{ marginLeft: level * 12 }}
                            className={classNames(
                              'flex cursor-pointer items-center gap-2 rounded p-1',
                              'text-sm',
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
                                  console.log(prevItemId);
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
                            <input
                              tabIndex={-1}
                              type={singleSelectAllowed ? 'radio' : 'checkbox'}
                              ref={(el) => {
                                if (el && !singleSelectAllowed && selectParentOnChildSelect) {
                                  el.indeterminate = selectedItems.some(
                                    (i) => i.id === item.id && i.intermediate
                                  );
                                }
                              }}
                              checked={
                                singleSelectAllowed
                                  ? selectedItems?.[0]?.id === item.id
                                  : selectParentOnChildSelect
                                    ? selectedItems.some((i) => i.id === item.id && !i.intermediate)
                                    : selectedItems.some((i) => i.id === item.id)
                              }
                              onChange={() => handleUnselectAndFocus(item, idx)}
                              disabled={item.disabled}
                              className={
                                singleSelectAllowed
                                  ? 'focus-visible:primary text-primary top-1/2 mt-1 h-4 w-4 cursor-pointer rounded-full border-[#888888] disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200'
                                  : 'mt-[1px] h-[1.1rem] w-[1.1rem] cursor-pointer rounded-[3px] ' +
                                    (item.disabled
                                      ? ' cursor-not-allowed text-gray-500 opacity-50'
                                      : 'text-primary')
                              }
                              aria-label={item?.label}
                            />
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
                        ))}
                      </div>
                    )}
                    {searchFocused && searchKey.length < 3 && (
                      <div className="px-2 pt-2">
                        <div
                          id={`${label}-search-input-tooltip`}
                          role="tooltip"
                          className="text-default bg-card sticky top-0 z-10 mb-2 flex min-w-[250px] items-center justify-center rounded border px-3 py-1 text-sm shadow-lg"
                        >
                          {renderSearchTooltip()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search */}
                  {searchable && (
                    <div
                      className={`w-full px-2 ${searchFocused && searchKey.length < 3 ? 'pt-0' : showSelected ? 'pt-1' : 'pt-2'}`}
                    >
                      <input
                        ref={searchInputRef}
                        id={
                          placeholder
                            ? placeholder?.split(' ')?.join('_')
                            : 'dynamic_dropdown_search'
                        }
                        type="text"
                        className="w-full rounded-md border px-3 py-1.5 text-sm shadow-sm placeholder:text-[#5D5D5D]"
                        autoComplete="off"
                        onChange={(e) => setSearchKey(e.target.value)}
                        value={searchKey}
                        placeholder={placeholder ?? 'Search'}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        aria-describedby={`${label}-search-input-tooltip`}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            if (e.shiftKey && selectedItems.length > 0) {
                              e.preventDefault();
                              if (showSelected && flatSelectedNodes.length > 0) {
                                setSelectedContainerFocused(true);
                                setTimeout(() => {
                                  document.getElementById('selected-items-container')?.focus();
                                }, 0);
                              } else {
                                selectedButtonRef.current?.focus();
                              }
                            } else if (!e.shiftKey) {
                              setTimeout(() => {
                                optionsContainerRef.current?.focus();
                              }, 0);
                            }
                          }
                          if (e.key === 'ArrowDown' && visibleItems.length > 0) {
                            e.preventDefault();
                            setFocusedIndex(0);
                          }
                        }}
                      />
                    </div>
                  )}

                  <div
                    className={classNames(
                      'overflow-y-auto',
                      containerFocused ? 'focus-indicator focus-visible-ring ring-primary' : ''
                    )}
                    style={{
                      maxHeight: maxHeightForMenuItems ?? '260px',
                    }}
                    ref={(el) => {
                      tableContainerRef.current = el;
                      optionsContainerRef.current = el;
                    }}
                    id="options-container"
                    tabIndex={containerFocused ? 0 : -1}
                    onFocus={() => setContainerFocused(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setContainerFocused(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.target !== e.currentTarget) {
                        return;
                      }

                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setContainerFocused(false);

                        const firstSelectableIdx = visibleItems.findIndex(
                          ({ node }) => !node.disabled
                        );
                        if (firstSelectableIdx !== -1) {
                          setFocusedIndex(firstSelectableIdx);
                          const firstItemId = `treeitem-${visibleItems[firstSelectableIdx].node.id}`;
                          setTimeout(() => {
                            const element = document.getElementById(firstItemId);
                            if (element) {
                              element.focus();
                            }
                          }, 0);
                        }
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setContainerFocused(false);

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
                            const element = document.getElementById(lastItemId);
                            if (element) {
                              element.focus();
                            }
                          }, 0);
                        }
                      }
                    }}
                    onScroll={(e) => {
                      fetchMoreOnBottomReached(e.currentTarget);
                    }}
                  >
                    <div className="flex flex-col" role={singleSelectAllowed ? '' : 'group'}>
                      {visibleItems.map(({ node, level }, idx) => renderItem(node, level, idx))}
                      {(isFetchingNextPage || isLoading) && (
                        <div className="px-2 text-xs text-gray-400">Loading more...</div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-card flex items-center justify-between border-t px-2 py-2">
                    {clearButtonReq && (
                      <button
                        ref={clearSelectionRef}
                        className={`text-xs ${
                          selectedItems.length > 0
                            ? 'link-text cursor-pointer'
                            : 'cursor-not-allowed text-[#868686]'
                        }`}
                        disabled={selectedItems.length === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItems([]);
                          onChange?.([]);
                          setFocusedIndex(-1);
                          searchInputRef.current?.focus();
                        }}
                      >
                        Clear Selection
                      </button>
                    )}
                    <button
                      className="link-text cursor-pointer text-xs"
                      onClick={() => {
                        mainButtonRef.current?.click();
                        mainButtonRef.current?.focus?.();
                      }}
                      ref={closeButtonRef}
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
    </div>
  );
}
