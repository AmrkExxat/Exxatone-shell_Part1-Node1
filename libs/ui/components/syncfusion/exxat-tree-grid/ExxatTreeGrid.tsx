'use client';

import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TreeGridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Reorder,
  Resize,
  Freeze,
  VirtualScroll,
  ColumnChooser,
  Inject,
} from '@syncfusion/ej2-react-treegrid';
import { RowDataBoundEventArgs, type RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { DataManager } from '@syncfusion/ej2-data';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { Button, Spinner, Tooltip } from '../../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/pro-light-svg-icons';
import classNames from 'classnames';
import { registerLicense } from '@syncfusion/ej2-base';

import ColumnSettingsDrawer, {
  type ColumnSettingsFunction,
} from '../settings/ColumnSettingsDrawer';
import { ExxatTreeGridProps } from './types';
import ExxatTreeGridCustomAdaptor from './ExxatTreeGridCustomAdaptor';
import Pagination from './Pagination';
import { gridUserInteraction } from '../utils';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXped3RdRGBfU0B0XUtWYE4='
);
const ExxatTreeGrid = forwardRef<TreeGridComponent, ExxatTreeGridProps>(
  (props: ExxatTreeGridProps, ref: any) => {
    const {
      columns = [],
      metaData,
      fetchData,
      children,
      height,
      configureColumns = false,
      parentMapping = 'parentItem',
      childMapping = 'children',
      pagingSize = 50,
      allowReordering = true,
      allowSorting = true,
      allowMultiSorting = false,
      allowResizing = true,
      allowFiltering = false,
      allowKeyboard = true,
      allowSelection = false,
      checkboxSelection = false,
      checkboxMode = 'Default',
      checkboxSelectionType = 'Multiple',
      showSelectAll = false,
      onColumnSettingsSave,
      onCheckboxSelect,
      treeColumnIndex = 1,
      selectedIds = [],
      autoCheckHierarchy = false,
      showCheckbox = false,
      recordPrimaryKey = 'id',
      uniqueEntityName = 'name',
      saveUserInteraction = false,
      id = '',
      interactionKey = '',
      clearAllBit = 0, // A number to reset selected checkboxes. Pass a value greater than zero to reset selections.
      disableAllSelection = false,
    } = props;

    const isSelectionDisabled = disableAllSelection;

    const settingsRef = useRef<ColumnSettingsFunction>(null);
    const userInteraction = saveUserInteraction
      ? gridUserInteraction(id, 'get', interactionKey)
      : null;
    const [refreshing, setRefreshing] = useState(false);
    const [tableColumns, setTableColumns] = useState<any[]>(columns);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());
    const treeGridRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<any>(null);
    const gridReadyRef = useRef(false);
    const [defaultSortSetting, setDefaultSortSetting] = useState<any>(() =>
      userInteraction?.sort ? { columns: [userInteraction.sort] } : null
    );

    const customAdaptorRef = useRef<ExxatTreeGridCustomAdaptor>();

    const [currentPage, setCurrentPage] = useState(
      userInteraction?.page && typeof userInteraction.page === 'number' ? userInteraction.page : 1
    );
    const [pageSize, setPageSize] = useState(pagingSize);
    const [totalCount, setTotalCount] = useState(0);
    const pageSizes = [50, 75, 100];
    const pageCount = 5;
    const [lastFocusedButtonID, setLastFocusedButtonID] = useState('');
    const [headerSelectAllChecked, setHeaderSelectAllChecked] = useState(false);
    const [headerSelectAllIndeterminate, setHeaderSelectAllIndeterminate] = useState(false);
    const skipNextHeaderChangeRef = useRef(false);

    const dataManager = useMemo(() => {
      const adaptor = new ExxatTreeGridCustomAdaptor(
        metaData?.tenantId,
        fetchData,
        metaData?.filterPayload,
        {
          id,
          can: saveUserInteraction,
          interactionKey,
        },
        {
          onDataLoadStart: () => setEmptyCellMessageVisibility(false),
          onDataLoadEnd: (result: any) => {
            setTimeout(() => {
              setEmptyCellMessageVisibility(true);
            }, 500);

            if (result?.totalCount && typeof result.totalCount === 'number') {
              setTotalCount(result.totalCount);
            }
          },
          pageIndex: currentPage,
          pageSize: pageSize,
        }
      );
      customAdaptorRef.current = adaptor;
      return new DataManager({
        url: 'https://your.api/endpoint',
        adaptor,
        crossDomain: true,
      });
    }, [metaData?.tenantId, fetchData, metaData?.filterPayload, currentPage, pageSize]);

    useEffect(() => {
      if (clearAllBit > 0) {
        ref.current?.clearSelection();
        onCheckboxChange({ rowElement: null, rowData: [], checked: false, name: 'checkboxChange' });
      }
    }, [clearAllBit]);

    const applyLockToRenderedRows = useCallback(() => {
      const grid: any = ref.current;
      if (!gridReadyRef.current || !grid) return;

      // Keep header checkbox in sync.
      // When selection is locked (select across pages), force header "select all" to look checked+disabled.
      if (isSelectionDisabled) {
        setHeaderSelectAllChecked(true);
        setHeaderSelectAllIndeterminate(false);
      } else {
        const rowCountForHeader: number = grid?.getRows?.()?.length ?? 0;
        const checkedCountForHeader: number = grid?.getCheckedRowIndexes?.()?.length ?? 0;
        setHeaderSelectAllChecked(
          rowCountForHeader > 0 && checkedCountForHeader === rowCountForHeader
        );
        setHeaderSelectAllIndeterminate(
          checkedCountForHeader > 0 && checkedCountForHeader < rowCountForHeader
        );
      }

      // Disable/enable header "select all" checkbox (Syncfusion-rendered) when locked.
      const headerFirstCell = (grid?.element as HTMLElement | undefined)?.querySelector?.(
        '.e-headercontent thead tr th'
      ) as HTMLElement | null;
      const headerCheckbox = headerFirstCell?.querySelector?.(
        'input[type="checkbox"]'
      ) as HTMLInputElement | null;
      if (headerCheckbox) {
        if (isSelectionDisabled) {
          // Force visual checked state for locked "select across pages" mode.
          headerCheckbox.checked = true;
          headerCheckbox.disabled = true;
          headerCheckbox.setAttribute('aria-disabled', 'true');
          headerFirstCell?.classList?.add('cursor-not-allowed', 'pointer-events-none');
        } else {
          headerCheckbox.disabled = false;
          headerCheckbox.removeAttribute('aria-disabled');
          headerFirstCell?.classList?.remove('cursor-not-allowed', 'pointer-events-none');
        }
      }
    }, [isSelectionDisabled]);

    useEffect(() => {
      if (!gridReadyRef.current) return;
      requestAnimationFrame(applyLockToRenderedRows);
    }, [isSelectionDisabled, applyLockToRenderedRows]);

    useEffect(() => {
      setCurrentPage(1);
    }, [JSON.stringify(metaData?.filterPayload)]);

    useEffect(() => {
      if (document.getElementById('syncfusion-treegrid-checkbox-focus-styles')) return;

      const styleEl = document.createElement('style');
      styleEl.id = 'syncfusion-treegrid-checkbox-focus-styles';
      styleEl.textContent = `
			  .e-treegrid .e-rowcell.e-treegridcheckbox:focus-within,
			  .e-treegrid .e-rowcell.e-treegridcheckbox:focus-visible {
				outline: 2px double #3F51B5 !important;
				outline-offset: -5px !important;
			  }
			`;

      document.head.appendChild(styleEl);

      return () => document.getElementById('syncfusion-treegrid-checkbox-focus-styles')?.remove();
    }, []);

    useEffect(() => {
      setTableColumns(columns);
    }, [columns]);

    const cacheGridInstance = useCallback(() => {
      if (!gridReadyRef.current) return;
      const gridEl = document.querySelector?.('.e-treegrid') as any;
      gridRef.current = gridEl?.ej2_instances?.[0] || null;
    }, []);

    const updateSortableIcons = useCallback(() => {
      if (!gridReadyRef.current) return;

      document.querySelectorAll('th[aria-sort]').forEach((header) => {
        const headerElement = header as HTMLElement;
        const headerDiv = headerElement.querySelector('.e-headercelldiv') as HTMLElement;

        const isFirstColumn = headerElement.getAttribute('aria-colindex') === '1';
        const headerText = headerElement.querySelector('.e-headertext')?.textContent?.trim() || '';
        const hasNoText = !headerText;

        if (isFirstColumn || hasNoText) {
        }

        if (headerDiv) {
          const sortableSpan = headerDiv.querySelector('.sortable-indicator') as HTMLElement;
          const sortDirection = headerElement.getAttribute('aria-sort');

          if (sortDirection === 'none') {
            if (sortableSpan) {
              sortableSpan.textContent = '↕';
              sortableSpan.style.display = 'inline';
            }
          } else {
            if (sortableSpan) {
              sortableSpan.textContent = '';
              sortableSpan.style.display = 'none';
            }
          }

          const headerTextSpan =
            headerElement.querySelector('.header-text')?.textContent?.trim() || '';
          const ariaLabel =
            sortDirection === 'none'
              ? `${headerTextSpan}, sortable column header, clickable`
              : `${headerTextSpan}, sorted in ${sortDirection} order`;
          headerDiv.setAttribute('aria-label', ariaLabel);
        }
      });
    }, []);

    useEffect(() => {
      if (!gridReadyRef.current) return;
      const gridInstance = ref as React.RefObject<TreeGridComponent>;
      const gridElement = gridInstance?.current?.element;

      if (!gridElement) return;

      const focusableHeaders = () => {
        document.querySelectorAll('th[aria-sort]').forEach((header) => {
          const headerElement = header as HTMLElement;
          const headerDiv = headerElement.querySelector('.e-headercelldiv') as HTMLElement;

          const isFirstColumn = headerElement.getAttribute('aria-colindex') === '1';
          const headerText =
            headerElement.querySelector('.e-headertext')?.textContent?.trim() || '';
          const hasNoText = !headerText;

          if (isFirstColumn || hasNoText) {
            headerElement.removeAttribute('tabindex');
            return;
          }

          if (headerDiv) {
            headerDiv.setAttribute('role', 'button');
            headerDiv.setAttribute('tabindex', '0');
            headerDiv.classList.add('focus-indicator');

            headerDiv.innerHTML = '';

            const contentContainer = document.createElement('div');
            contentContainer.className = 'flex justify-between items-center w-full';

            const textSpan = document.createElement('span');
            textSpan.textContent = headerText;
            textSpan.className = 'header-text';
            contentContainer.appendChild(textSpan);

            const sortableSpan = document.createElement('span');
            sortableSpan.className =
              'sortable-indicator ml-1 text-xs px-1.5 pb-0.5 rounded text-[#374151] cursor-pointer transition hover:text-black';
            sortableSpan.textContent = '↕';
            sortableSpan.setAttribute('aria-hidden', 'true');
            contentContainer.appendChild(sortableSpan);

            headerDiv.appendChild(contentContainer);

            headerDiv.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              headerElement.click();
            });

            headerDiv.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                headerElement.click();
              }
            });
          }
        });
      };

      setTimeout(focusableHeaders, 100);
    }, [ref]);

    const handleGridKeyPress = useCallback((args: any) => {
      if (!gridReadyRef.current) return;

      const { keyCode, shiftKey } = args || {};
      const activeElement = document?.activeElement;

      if (keyCode === 32) {
        args.cancel = true;
        return;
      }
      if (keyCode >= 37 && keyCode <= 40) {
        args.cancel = true;
        return;
      }
      if (!activeElement || keyCode !== 13) return;

      if (keyCode === 13) {
        const currentTd =
          activeElement.tagName === 'TD' ? activeElement : activeElement.closest?.('td');
        const currentTh =
          activeElement.tagName === 'TH' ? activeElement : activeElement.closest?.('th');
        const currentHeaderDiv = activeElement.classList?.contains('e-headercelldiv')
          ? activeElement
          : activeElement.closest?.('.e-headercelldiv');

        const focusInput = (input: HTMLElement) => {
          input?.classList?.add('focus-indicator');
          input?.focus?.();
          requestAnimationFrame(() =>
            input?.dispatchEvent?.(new MouseEvent('click', { bubbles: true, cancelable: true }))
          );
        };

        if (currentTd) {
          const input =
            activeElement.tagName === 'INPUT' ? activeElement : currentTd?.querySelector?.('input');
          if (input) focusInput(input as HTMLElement);
        } else if (currentHeaderDiv) {
          currentHeaderDiv.dispatchEvent?.(
            new MouseEvent('click', { bubbles: true, cancelable: true })
          );
        } else if (currentTh?.hasAttribute?.('aria-sort')) {
          requestAnimationFrame(() => {
            currentTh.dispatchEvent?.(new MouseEvent('click', { bubbles: true, cancelable: true }));
            requestAnimationFrame(() => {
              const refreshedTh = document.querySelector?.(
                `th[aria-colindex="${currentTh.getAttribute?.('aria-colindex')}"][aria-sort]`
              );
            });
          });
        } else if (currentTh) {
          const input =
            activeElement.tagName === 'INPUT' ? activeElement : currentTh?.querySelector?.('input');
          if (input) focusInput(input as HTMLElement);
        }
      }
    }, []);

    // Focus management logic for pagination
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      syncHeaderSelectAllState();
    };

    const handlePageSizeChange = (newSize: number) => {
      setPageSize(newSize);
      setCurrentPage(1);
      syncHeaderSelectAllState();
    };

    // Handle Tab navigation from grid to pagination
    const handleTabNavigation = useCallback((e: KeyboardEvent) => {
      if (!gridReadyRef.current) return;

      if (e.key === 'Tab' && !e.shiftKey) {
        const activeElement = document.activeElement;
        const gridElement = treeGridRef.current?.querySelector('.e-treegrid');

        if (gridElement && gridElement.contains(activeElement)) {
          const allFocusableElements = gridElement.querySelectorAll(
            'input, button, select, textarea, [tabindex]:not([tabindex="-1"]), .e-headercelldiv[tabindex="0"]'
          );
          const lastFocusableElement = allFocusableElements[allFocusableElements.length - 1];

          if (activeElement === lastFocusableElement) {
            const pageSizeSelect = document.getElementById('pageSizeSelect');
            if (pageSizeSelect) {
              e.preventDefault();
              setTimeout(() => {
                pageSizeSelect.focus();
              }, 50);
            }
          }
        }
      }
    }, []);

    // Only add event listener when grid is ready
    useEffect(() => {
      if (!gridReadyRef.current) return;

      document.addEventListener('keydown', handleTabNavigation);
      return () => {
        document.removeEventListener('keydown', handleTabNavigation);
      };
    }, [handleTabNavigation]);

    const handleGridCreated = useCallback(() => {
      const spans = document.querySelectorAll?.('[id^="headerTitle-grid-column"]') || [];

      spans.forEach((span) => {
        const text = span.textContent?.trim();
        if (text === 'Press Ctrl space to group' || text === 'Press Enter to sort.') {
          span.remove?.();
        } else if (text?.includes('Press Ctrl space to group')) {
          span.textContent = text.replace('Press Ctrl space to group', '').trim();
        }
      });
      const firstColumnHeader = document.querySelector(
        'th[aria-colindex="1"] [id^="headerTitle-grid-column"]'
      );
      if (firstColumnHeader?.textContent?.trim() === 'Press Enter to sort') {
        firstColumnHeader.remove();
      }
      removeIncorrectAriaProperties();

      requestAnimationFrame(() => {
        cacheGridInstance();
        gridReadyRef.current = true;
      });

      const treeGridElement = document.querySelector('.e-treegrid');
      if (treeGridElement) {
        treeGridElement.removeEventListener('keydown', handleGridKeyPress);

        treeGridElement.addEventListener(
          'keydown',
          (e) => {
            if (e.key === 'Tab') {
              e.stopPropagation();
              return;
            }

            handleGridKeyPress({
              keyCode: e.keyCode || e.which,
              shiftKey: e.shiftKey,
              cancel: false,
              preventDefault: () => e.preventDefault(),
            });
          },
          true
        );
      }
    }, [cacheGridInstance, handleGridKeyPress]);

    useEffect(() => {
      if (!gridReadyRef.current) return;

      const removeTabIndex = () => {
        if (treeGridRef.current) {
          const treeGridElement = treeGridRef.current.querySelector('.e-treegrid');
          if (treeGridElement && treeGridElement.hasAttribute('tabindex')) {
            treeGridElement.removeAttribute('tabindex');
          }
        }
      };
      removeTabIndex();
      const observer = new MutationObserver(removeTabIndex);
      if (treeGridRef.current) {
        observer.observe(treeGridRef.current, { childList: true, subtree: true });
      }

      return () => {
        observer.disconnect();
      };
    }, []);

    const handleOpenSettings = () => {
      settingsRef.current?.handleDrawer({
        open: true,
        columns: [...columns],
        loading: false,
      });
    };

    const handleSaveSettings = (updatedCols: any[]) => {
      const grid = ref.current;

      if (grid) {
        setRefreshing(true);

        const gridColumns = grid.columns;

        updatedCols.forEach((col) => {
          const existing = gridColumns.find((c: any) => c.field === col.fieldName);
          if (existing) {
            existing.freeze = col.freeze;
            existing.visible = col.visible;
          }
        });

        grid.setProperties(
          {
            columns: gridColumns,
            pageRequireRefresh: false,
            isManualRefresh: false,
          },
          false
        );

        grid.refreshColumns();
      }

      onColumnSettingsSave?.(updatedCols);
    };

    const handleOnActionComplete = (args: any) => {
      if (args?.requestType === 'sorting') {
        setTimeout(updateSortableIcons, 50);
      }
    };

    const handleFocusChange = (buttonId: string) => {
      setLastFocusedButtonID(buttonId);
    };

    // Parent (root-level) rows only: level 0 or no parent. Children are default-selected when showCheckbox; only parents count toward "Select All".
    const isParentRecord = useCallback(
      (record: any) =>
        record?.level === 0 ||
        record?.[parentMapping] == null ||
        record?.[parentMapping] === undefined,
      [parentMapping]
    );

    const syncHeaderSelectAllState = useCallback(() => {
      const grid: any = ref.current;
      if (!gridReadyRef.current || !grid) return;

      // Skip the next header checkbox change so we don't run toggleSelectAllCurrentPage(false) when we programmatically set unchecked (e.g. after moving to page 2).
      skipNextHeaderChangeRef.current = true;

      if (isSelectionDisabled) {
        setHeaderSelectAllChecked(true);
        setHeaderSelectAllIndeterminate(false);
        requestAnimationFrame(() => {
          skipNextHeaderChangeRef.current = false;
        });
        return;
      }

      // Replicate Syncfusion's header logic: use getCheckedRowIndexes() as source of truth, restricted to parent rows.
      const rowCount: number = grid?.getRows?.()?.length ?? 0;
      const viewRecords: any[] =
        grid?.getCurrentViewRecords?.() ?? grid?.currentViewRecords ?? grid?.flatData ?? [];
      const pageRecords = viewRecords.slice(0, rowCount);

      const parentCount = pageRecords.filter((x: any) => !x.parentItem).length;
      const checkedParentCount = pageRecords.filter(
        (x: any) => !x.parentItem && (x.isSelected || x.checkboxState === 'check')
      ).length;
      // Syncfusion: checked = all checked, indeterminate = some checked, unchecked = none checked
      const allParentsChecked = parentCount > 0 && checkedParentCount === parentCount;
      const indeterminate = checkedParentCount > 0 && checkedParentCount < parentCount;

      setHeaderSelectAllChecked(allParentsChecked);
      setHeaderSelectAllIndeterminate(indeterminate);

      const applyHeaderCheckboxState = () => {
        const root = treeGridRef?.current ?? grid?.element;
        if (!root) return;
        const container = root.querySelector('.custom-header-checkbox');
        if (!container) return;
        const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
        const wrapper = container.querySelector('.e-checkbox-wrapper');
        const frame = container.querySelector('.e-frame');
        if (input) {
          input.checked = allParentsChecked;
          input.indeterminate = indeterminate;
        }
        if (wrapper) {
          wrapper.classList.toggle('e-checkbox-checked', allParentsChecked);
          wrapper.classList.toggle('e-checkbox-indeterminate', indeterminate);
        }
        // Syncfusion uses .e-stop on .e-frame for indeterminate and .e-check for checked
        if (frame) {
          frame.classList.toggle('e-check', allParentsChecked);
          frame.classList.toggle('e-stop', indeterminate);
        }
      };
      applyHeaderCheckboxState();
      requestAnimationFrame(() => {
        applyHeaderCheckboxState();
        requestAnimationFrame(() => {
          skipNextHeaderChangeRef.current = false;
        });
      });
    }, [ref, isSelectionDisabled, isParentRecord]);

    const toggleSelectAllCurrentPage = useCallback(() => {
      const grid: any = ref.current;
      if (!gridReadyRef.current || !grid) return;
      if (isSelectionDisabled) return;

      const rowCount: number = grid?.getRows?.()?.length ?? 0;
      const viewRecords: any[] =
        grid?.getCurrentViewRecords?.() ?? grid?.currentViewRecords ?? grid?.flatData ?? [];
      const pageRows = viewRecords.slice(0, rowCount);

      // Syncfusion TreeGrid `selectCheckboxes()` TOGGLES checkboxState per row.
      // So for "select all" / "unselect all", we must pass only the rows that are not already
      // in the desired state.

      const parentCount: number = pageRows.filter((x: any) => !x.parentItem).length;
      const checkedParentCount: number = pageRows.filter(
        (x: any) => !x.parentItem && (x.isSelected || x.checkboxState === 'check')
      ).length;

      const checkedFromEvent = checkedParentCount !== parentCount;

      const checkedCount: number = grid?.getCheckedRowIndexes?.()?.length ?? 0;
      const isAllCurrentlyChecked = rowCount > 0 && checkedCount === rowCount;
      const shouldCheckAll =
        typeof checkedFromEvent === 'boolean' ? checkedFromEvent : !isAllCurrentlyChecked;

      const indexesToToggle: number[] = [];
      for (let i = 0; i < pageRows.length; i++) {
        const state = pageRows[i]?.checkboxState; // 'check' | 'uncheck' | 'indeterminate' | undefined
        if (shouldCheckAll) {
          if (state !== 'check') indexesToToggle.push(i);
        } else {
          if (state !== 'uncheck') indexesToToggle.push(i);
        }
      }

      try {
        // Notify caller so data-driven checkbox retention stays in sync.
        onCheckboxSelect?.(pageRows, shouldCheckAll === true);

        if (typeof grid.selectCheckboxes === 'function') {
          grid.selectCheckboxes(indexesToToggle);
        } else if (shouldCheckAll && typeof grid.selectAll === 'function') {
          grid.selectAll();
        } else if (!shouldCheckAll && typeof grid.clearSelection === 'function') {
          grid.clearSelection();
        }
      } catch {
        // no-op: avoid hard crash; selection can still be managed externally via data isSelected
      }

      requestAnimationFrame(() => {
        syncHeaderSelectAllState();

        const rows: HTMLTableRowElement[] = grid?.getRows?.() ?? [];
        const viewRecordsAfter: any[] =
          grid?.getCurrentViewRecords?.() ?? grid?.currentViewRecords ?? grid?.flatData ?? [];

        for (let i = 0; i < rows.length && i < viewRecordsAfter.length; i++) {
          const rowEl = rows[i];
          if (!rowEl) continue;
          const state = viewRecordsAfter[i]?.checkboxState;
          rowEl.classList.toggle('row-selected', state === 'check' || state === 'indeterminate');
        }

        // When Select All is used, hide child checkboxes for every selected parent (same as when checking a parent individually)
        // When Select All is unchecked, show child checkboxes again for every parent
        if (autoCheckHierarchy) {
          const flatData = grid?.flatData ?? [];
          if (shouldCheckAll) {
            const checkedIndexes = grid?.getCheckedRowIndexes?.() ?? [];
            checkedIndexes.forEach((index: number) => {
              const record = flatData[index];
              if (record?.childRecords?.length) {
                toggleDisableAllDescendants(record, true);
              }
            });
          } else {
            flatData.forEach((record: any) => {
              if (record?.childRecords?.length) {
                toggleDisableAllDescendants(record, false);
              }
            });
          }
        }
      });
    }, [
      ref,
      onCheckboxSelect,
      syncHeaderSelectAllState,
      isSelectionDisabled,
      isParentRecord,
      autoCheckHierarchy,
    ]);

    const rowDataBound = (args: RowDataBoundEventArgs) => {
      const rowElement: Element | HTMLTableRowElement | undefined = args?.row;

      const rowData: any = args?.data;

      const rowIndex: number = rowData?.index;

      const status = (rowData?.status as string)?.toLowerCase();

      const isCancelledOrRevoked = ['cancelled', 'revoked'].includes(status);

      const isDisabled = rowData?.disabled;

      const isSelected = rowData?.isSelected;

      if (!rowElement) return;

      if (isCancelledOrRevoked || isDisabled) {
        rowElement?.classList.add('row-disabled');
      }

      if (isDisabled) {
        args.isSelectable = false;
        if (checkboxSelection) {
          const checkboxCell = (rowElement as HTMLTableRowElement)?.cells?.[0];
          const checkbox = checkboxCell?.querySelector(
            'input.e-treecheckselect'
          ) as HTMLInputElement;
          const checkboxWrapper = checkboxCell?.querySelector('.e-checkbox-wrapper') as HTMLElement;

          // Actually disable the checkbox input
          if (checkbox) {
            checkbox.disabled = true;
            checkbox.setAttribute('aria-disabled', 'true');
          }

          // Use Syncfusion's disabled class so styling matches Syncfusion's disabled checkbox UI
          if (checkboxWrapper) {
            checkboxWrapper.classList.add('e-checkbox-disabled');
          }

          checkboxCell?.classList.add('cursor-not-allowed', 'pointer-events-none', 'row-disabled');

          // Add background color to the entire cell
          if (checkboxCell) {
            (checkboxCell as HTMLElement).style.backgroundColor = '#f9fafb'; // Very light gray
          }
        }
      } else {
        if (checkboxSelection) {
          const checkboxCell = (rowElement as HTMLTableRowElement)?.cells?.[0];
          const checkbox = checkboxCell?.querySelector(
            'input.e-treecheckselect'
          ) as HTMLInputElement;
          const checkboxWrapper = checkboxCell?.querySelector('.e-checkbox-wrapper') as HTMLElement;
          if (checkbox) {
            checkbox.disabled = false;
            checkbox.removeAttribute('aria-disabled');
            if (checkboxWrapper) checkboxWrapper.classList.remove('e-checkbox-disabled');
          }
          if (checkbox && checkboxCell) {
            checkbox.classList.add('focus-indicator');
            checkboxCell.classList.add('focus-indicator');
            const ariaLabel = rowData?.[uniqueEntityName] || 'Select Row';
            checkbox.setAttribute('aria-label', `${ariaLabel}`);
          }
        }
        if (isSelected) {
          args.isSelectable = true;
          const updatedSet = new Set(selectedRowIds);
          updatedSet.add(rowIndex);
          setSelectedRowIds(updatedSet);
        }
      }
    };

    const setupTreeGridCollapseButtons = () => {
      setTimeout(() => {
        document.querySelectorAll<HTMLElement>('.e-treegridcollapse').forEach((span) => {
          span.tabIndex = 0;
          span.setAttribute('role', 'button');
          span.classList.add('focus-indicator', 'focus-visible:ring-inset');

          const parentCell = span.closest('td.e-rowcell');
          const textContent = parentCell?.querySelector('.e-treecell')?.textContent?.trim();

          if (textContent) {
            span.setAttribute('aria-label', textContent);
          }
          span.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              span.click();
              setTimeout(() => {
                span.focus();
              }, 100);
            }
          });
        });
      }, 100);
    };

    // const removeTabIndexFromFirstHeader = () => {
    // 	setTimeout(() => {
    // 		const firstHeader = document.querySelector('th[aria-colindex="1"]');
    // 		if (firstHeader) {
    // 			firstHeader.removeAttribute('tabindex');
    // 		}
    // 	}, 100);
    // };

    const selectAndExpand = () => {
      const grid: TreeGridComponent = ref.current;
      const { selectedIndexes, expandedIndexes } = getSelectedAndExpandedIndexes();
      if (selectedIndexes?.length > 0) {
        if (autoCheckHierarchy) {
          grid?.selectCheckboxes(selectedIndexes);

          selectedIndexes?.forEach((index: number) => {
            const rowData = grid?.flatData[index];

            const rowElement = grid?.getRowByIndex(index);

            const args = {
              checked: true,
              rowIndex: index,
              rowData,
              rowElement,
            };

            onCheckboxChange(args);
          });
        } else {
          grid?.selectRows(selectedIndexes);
        }
      }

      if (expandedIndexes?.length > 0) {
        expandedIndexes?.forEach((index: number) => {
          const _row: any = grid?.getRowByIndex(index);

          if (!_row) return;

          grid?.expandRow(_row);
        });
      }
    };

    const userExpand = () => {
      const grid: TreeGridComponent = ref?.current;
      if (saveUserInteraction && grid) {
        const userInt = gridUserInteraction(id, 'get', interactionKey);
        if (userInt?.expandIds?.length) {
          const idx = [];
          grid?.flatData?.forEach((item: any, index: number) => {
            if (userInt.expandIds.includes(item[recordPrimaryKey])) {
              idx.push(index);
            }
          });
          idx?.forEach((index: number) => {
            const _row: any = grid?.getRowByIndex(index);
            if (_row) {
              grid?.expandRow(_row);
            }
          });
        }
      }
    };

    const onDataBound = () => {
      setRefreshing(false);

      const grid: TreeGridComponent = ref.current;
      userExpand();
      selectAndExpand();
      syncHeaderSelectAllState();

      grid?.hideSpinner();
      const eContentDiv = document.querySelector('.e-content');
      if (eContentDiv && eContentDiv.hasAttribute('tabindex')) {
        eContentDiv.removeAttribute('tabindex');
      }
      removeIncorrectAriaProperties();
      setTimeout(updateSortableIcons, 100);
      setupTreeGridCollapseButtons();
    };

    const getSelectedAndExpandedIndexes = useCallback((): {
      selectedIndexes: number[];
      expandedIndexes: number[];
    } => {
      const grid: TreeGridComponent = ref.current;

      const selectedIndexes: number[] = [];

      const expandedIndexes: number[] = [];

      grid?.flatData?.forEach((item: any, index: number) => {
        if (item?.isSelected) {
          selectedIndexes?.push(index);
        }

        if (item?.isExpanded) {
          expandedIndexes?.push(index);
        }
      });

      return {
        selectedIndexes,
        expandedIndexes,
      };
    }, []);

    const onRowSelecting = useCallback(
      (args: any) => {
        if (!gridReadyRef.current) return;
        const selectedIndexes = ref.current?.getSelectedRowIndexes() || [];

        if (selectedIndexes.length > 0 && checkboxSelectionType === 'Single') {
          ref.current?.clearSelection();
        }
      },
      [checkboxSelectionType]
    );

    const onRowSelected = useCallback(
      (args: RowSelectEventArgs) => {
        if (!gridReadyRef.current) return;
        const rowIndex = args?.rowIndex;

        if (rowIndex === undefined) return;

        const updatedSet = new Set(selectedRowIds);

        if (checkboxSelectionType === 'Single') {
          updatedSet.clear();
        }

        updatedSet.add(rowIndex);

        setSelectedRowIds(updatedSet);

        onCheckboxSelect?.(Array.isArray(args?.data) ? args?.data : [args?.data], true);
        syncHeaderSelectAllState();
      },
      [checkboxSelectionType, selectedRowIds, onCheckboxSelect]
    );

    const onRowDeselected = useCallback(
      (args: RowSelectEventArgs) => {
        if (!gridReadyRef.current) return;

        if (args?.isInteracted) {
          const rowIndex = args?.rowIndex;
          if (rowIndex === undefined) return;

          const updatedSet = new Set(selectedRowIds);
          updatedSet.delete(rowIndex);
          setSelectedRowIds(updatedSet);

          onCheckboxSelect?.([args?.data], false);
          syncHeaderSelectAllState();
        }
      },
      [selectedRowIds, onCheckboxSelect]
    );

    const clearAllSelections = (row: any = null, clearSelectedRowIds: boolean = false) => {
      const grid: TreeGridComponent = ref.current;
      let val = grid?.getCheckedRowIndexes();
      if (val?.length && row) {
        val = val.filter((i) => i !== row?.index);
      }
      grid.selectCheckboxes(val);
      if (grid?.flatData?.length) {
        grid.flatData.forEach((item: any, index: any) => {
          if (!row || row[recordPrimaryKey] !== item[recordPrimaryKey]) {
            item.isSelected = false;
            const row = grid?.getRowByIndex(index);
            row.classList.remove('row-selected');
            toggleDisableStateRow(row, false);

            row.classList.toggle('row-selected', false);
            const checkboxCell = row?.getElementsByClassName('e-treegridcheckbox')?.[0];
            const checkBoxContainer = checkboxCell?.getElementsByClassName(
              'e-treecheckbox-container'
            )?.[0];
            const checkBox = checkboxCell?.querySelector(
              'input.e-treecheckselect'
            ) as HTMLInputElement;
            if (checkBox?.checked) {
              checkBox.checked = false;
            }
            const eCheckContainer = checkBoxContainer?.getElementsByClassName('e-check')?.[0];
            eCheckContainer?.classList?.remove('hidden-check-mark');
            toggleDisableAllDescendants(item, false);
          }
        });
      }
      if (clearSelectedRowIds) {
        setSelectedRowIds(new Set());
      }
    };

    const onCheckboxChange = useCallback(
      (args: any) => {
        if (!gridReadyRef.current) return;

        if (autoCheckHierarchy) {
          const { rowElement, rowData: selectedRowData, checked } = args;

          if (rowElement) {
            rowElement.classList.toggle('row-selected', checked === true);
          }

          const checkboxCell = rowElement?.getElementsByClassName('e-treegridcheckbox')?.[0];

          const checkBoxContainer = checkboxCell?.getElementsByClassName(
            'e-treecheckbox-container'
          )?.[0];

          const eCheckContainer = checkBoxContainer?.getElementsByClassName('e-check')?.[0];

          eCheckContainer?.classList?.remove('hidden-check-mark');

          const rowIndex = selectedRowData?.index;

          let updatedSet = new Set(selectedRowIds);
          if (checkboxSelectionType === 'Single') {
            updatedSet.clear();
          }

          const allDescendantIds: number[] =
            getAllDescendants(selectedRowData)?.map((x: any) => x?.index) ?? [];

          if (checked) {
            updatedSet.add(rowIndex);
          } else {
            updatedSet.delete(rowIndex);
          }

          allDescendantIds?.forEach((childIndex: any) => updatedSet.delete(childIndex));

          setSelectedRowIds(updatedSet);

          toggleDisableAllDescendants(selectedRowData, checked === true);

          if (args?.name === 'checkboxChange') {
            onCheckboxSelect?.(
              Array.isArray(selectedRowData) ? selectedRowData : [selectedRowData],
              checked === true
            );
          }
        }
      },
      [autoCheckHierarchy, selectedRowIds, onCheckboxSelect]
    );

    const getAllDescendants = useCallback((record: any): any[] => {
      const _record = Array?.isArray(record) ? record?.[0] : record;

      const descendants: any[] = [];

      const traverse = (node: any) => {
        if (node?.childRecords?.length > 0) {
          node.childRecords.forEach((child: any) => {
            descendants?.push(child);
            traverse(child);
          });
        }
      };

      traverse(_record);

      return descendants;
    }, []);

    const toggleDisableAllDescendants = (record: any, disable: boolean) => {
      const grid: TreeGridComponent = ref?.current;

      const allDescendants = getAllDescendants(record) ?? [];

      if (!allDescendants.length) return;

      const dataRows: any[] = grid?.flatData ?? [];

      const indexesToToggle = allDescendants
        .map((rowItem) =>
          dataRows.findIndex((item) => item?.[recordPrimaryKey] === rowItem?.[recordPrimaryKey])
        )
        .filter((index) => index !== -1);

      indexesToToggle?.forEach((index: number) => {
        const _row = grid?.getRowByIndex(index);

        toggleDisableStateRow(_row, disable);
      });
    };

    const toggleDisableStateRow = useCallback(
      (_row: HTMLTableRowElement | Element, disable: boolean) => {
        if (!_row) return;

        const checkboxCell = _row?.getElementsByClassName('e-treegridcheckbox')?.[0];

        const checkBoxContainer = checkboxCell?.getElementsByClassName(
          'e-treecheckbox-container'
        )?.[0];

        const eCheckContainer = checkBoxContainer?.getElementsByClassName('e-check')?.[0];

        if (disable) {
          _row?.classList?.add('row-selected');

          checkboxCell?.classList?.add(
            'cursor-not-allowed',
            'pointer-event-none',
            'bg-primary-100',
            'row-selected'
          );

          checkBoxContainer?.classList?.add('hidden');
        } else {
          _row?.classList?.remove('row-selected');

          _row?.removeAttribute('style');

          checkboxCell?.classList.remove(
            'cursor-not-allowed',
            'pointer-event-none',
            'bg-primary-100',
            'row-selected'
          );

          eCheckContainer?.classList?.add('hidden-check-mark');

          checkBoxContainer?.classList?.remove('hidden');
        }
      },
      []
    );

    const setEmptyCellMessageVisibility = useCallback((isVisible: boolean = false) => {
      const grid: TreeGridComponent = ref?.current;

      const emptyRow = grid?.element?.getElementsByClassName('e-emptyrow')?.[0];

      if (emptyRow !== undefined && emptyRow !== null) {
        if (isVisible) {
          emptyRow?.setAttribute('style', 'color:#111827 !important');
        }
      }
    }, []);

    const removeIncorrectAriaProperties = useCallback(() => {
      if (!gridReadyRef.current) return;

      setTimeout(() => {
        const gridInstance = ref as React.RefObject<TreeGridComponent>;
        const gridElement = gridInstance?.current?.element;
        if (!gridElement) return;

        const gridChildren = gridElement.children;
        if (gridChildren && gridChildren.length >= 2) {
          const secondChild = gridChildren[1] as HTMLElement;
          if (secondChild) {
            secondChild.removeAttribute('aria-rowcount');
            secondChild.removeAttribute('aria-colcount');
            secondChild.removeAttribute('aria-multiselectable');
          }
        }

        // Remove aria-label from all td elements
        const tdElementsList = gridElement.querySelectorAll('td');
        tdElementsList.forEach((td) => {
          td.removeAttribute('aria-label');
        });
      }, 500);
    }, []);

    const checkboxChangeFromGrid = (args: any) => {
      if (checkboxSelectionType === 'Single') {
        const { rowData: selectedRowData } = args;
        if (selectedRowData) {
          clearAllSelections(selectedRowData);
        }
      }
      onCheckboxChange(args);
      // Defer so Syncfusion has updated getCheckedRowIndexes() before we read it for indeterminate
      requestAnimationFrame(() => syncHeaderSelectAllState());
    };

    const expandCollapseRow = (expand: boolean, rowData: any) => {
      if (!saveUserInteraction) return;

      const rowId = rowData?.data?.[recordPrimaryKey];
      if (!rowId) return;
      let userInt = gridUserInteraction(id, 'get', interactionKey) ?? {};
      let expandIds: string[] = userInt.expandIds ?? [];

      if (expand) {
        if (!expandIds.includes(rowId)) {
          expandIds = [...expandIds, rowId];
        }
      } else {
        expandIds = expandIds.filter((item) => item !== rowId);
      }
      gridUserInteraction(id, 'set', interactionKey, { ...userInt, expandIds });
    };

    return (
      <>
        {metaData?.tenantId ? (
          <div ref={treeGridRef}>
            <div className="bg-card flex w-full flex-row items-start rounded-t-md border py-2 pr-4">
              <div className="min-w-0 flex-1">{children}</div>
              <div className="mt-2 flex items-center gap-2">
                {configureColumns && (
                  <Tooltip
                    triggerElement={() => (
                      <Button
                        id="tooltip"
                        variant="basic"
                        className="focus-indicator ml-2 h-7 w-7 p-2"
                        aria-label="Configure column options"
                        onClick={handleOpenSettings}
                      >
                        <FontAwesomeIcon icon={faWrench} className="text-default h-4 w-4" />
                      </Button>
                    )}
                    tooltip={() => <div className="p-2">Configure column options</div>}
                  />
                )}
              </div>
            </div>

            <div className="control-pane">
              <div className="control-section">
                <div style={{ position: 'relative' }}>
                  <TreeGridComponent
                    ref={ref}
                    dataSource={dataManager}
                    childMapping={childMapping}
                    loadChildOnDemand={false}
                    height={height}
                    selectionSettings={{
                      checkboxMode,
                      type: checkboxSelectionType,
                      checkboxOnly: true,
                    }}
                    treeColumnIndex={treeColumnIndex}
                    allowReordering={allowReordering}
                    allowSorting={allowSorting}
                    allowResizing={allowResizing}
                    allowKeyboard={allowKeyboard}
                    allowFiltering={allowFiltering}
                    expanded={(e) => expandCollapseRow(true, e)}
                    collapsed={(e) => expandCollapseRow(false, e)}
                    checkboxChange={checkboxChangeFromGrid}
                    // allowPaging={true}
                    enableCollapseAll={true}
                    idMapping="id"
                    rowSelecting={onRowSelecting}
                    rowDataBound={rowDataBound}
                    rowSelected={onRowSelected}
                    rowDeselected={onRowDeselected}
                    dataBound={onDataBound}
                    parentIdMapping={parentMapping}
                    sortSettings={defaultSortSetting}
                    className={classNames(
                      // When we use custom header checkbox, hide Syncfusion's so only one shows.
                      showCheckbox && showSelectAll
                        ? 'hide-header-checkbox'
                        : showSelectAll
                          ? 'm-0'
                          : 'hide-header-checkbox',
                      checkboxSelection ? 'm-0' : 'enable-horizontal-scroll'
                    )}
                    created={handleGridCreated}
                    onActionComplete={handleOnActionComplete}
                  >
                    <ColumnsDirective>
                      {checkboxSelection && (
                        <ColumnDirective
                          type={showCheckbox ? undefined : 'checkbox'}
                          width="20"
                          freeze="Left"
                          field="checkboxField"
                          headerText=""
                          allowReordering={false}
                          showCheckbox={showCheckbox}
                          headerTemplate={
                            showCheckbox && showSelectAll
                              ? () => (
                                  <div
                                    className="custom-header-checkbox"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <CheckBoxComponent
                                      checked={isSelectionDisabled ? true : headerSelectAllChecked}
                                      indeterminate={
                                        isSelectionDisabled ? false : headerSelectAllIndeterminate
                                      }
                                      disabled={isSelectionDisabled}
                                      // Use grid-derived toggle to avoid stale event values.
                                      change={(e: any) => {
                                        toggleSelectAllCurrentPage();
                                      }}
                                      htmlAttributes={{
                                        'aria-label': 'Select all rows on this page',
                                      }}
                                    />
                                  </div>
                                )
                              : undefined
                          }
                        />
                      )}

                      {tableColumns.map((col, i) => (
                        <ColumnDirective
                          key={`${col.fieldName}_${i}`}
                          field={col.fieldName}
                          headerText={col.headerName}
                          minWidth={col.width}
                          width={col.width}
                          freeze={col.freeze ?? 'None'}
                          allowSorting={col.canSort ?? false}
                          visible={col.visible ?? true}
                          clipMode={col?.clipMode ?? 'EllipsisWithTooltip'}
                          template={col.renderCell}
                          showCheckbox={col?.showCheckbox}
                        />
                      ))}
                    </ColumnsDirective>
                    <Inject
                      services={[
                        Page,
                        Sort,
                        Filter,
                        Reorder,
                        Resize,
                        Freeze,
                        VirtualScroll,
                        ColumnChooser,
                      ]}
                    />
                  </TreeGridComponent>
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    pageSizes={pageSizes}
                    pageCount={pageCount}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    lastFocusedButtonID={lastFocusedButtonID}
                    onFocusChange={handleFocusChange}
                  />
                </div>
                <ColumnSettingsDrawer
                  handleOnSave={handleSaveSettings}
                  gridTitle="Table"
                  ref={settingsRef}
                />
              </div>
            </div>
          </div>
        ) : (
          <Spinner size={'md'} className="" id="sync-fusion-tree-grid-spinner" />
        )}
      </>
    );
  }
);

ExxatTreeGrid.displayName = 'ExxatTreeGrid';

export default ExxatTreeGrid;
