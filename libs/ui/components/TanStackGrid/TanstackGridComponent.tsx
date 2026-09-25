'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { ColumnSettingsDrawer } from './settings/ColumnSettings';
import { getPinningStylesForCell } from './utils/PinningStyles';
import {
  createSelectionColumn,
  buildInitialPinning,
  buildInitialHiddenColumnIds,
  getDescendantIds,
} from './utils/ColumnHelpers';
import {
  useGridState,
  useSaveGridState,
  usePaginationSync,
  usePaginationBounds,
  useGlobalFilterDebounce,
} from './utils/gridStateHooks';
import {
  useScrollTracking,
  useGridVirtualization,
  useColumnKeys,
  useGridMetrics,
  useRowIndices,
} from './utils/GridUIHooks';
import { TableRow } from './TableRow';
import { TableHeaderCell } from './TableHeaderCell';
import { SkeletonRow } from './SkeletonRow';
import { ColumnFilterCell } from './ColumnFilterCell';
import { PaginationControls } from './PaginationControls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faSearch } from '@fortawesome/pro-solid-svg-icons';

type PinPosition = 'left' | 'right' | 'fixed' | false;

export type GridColumnDef<TData, TValue = any> = ColumnDef<TData, TValue> & {
  pinPosition?: PinPosition;
  disableColumnConfig?: boolean;
  hiddenByDefault?: boolean;
};

export type GridFetchArgs = {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  signal?: AbortSignal;
};

export type GridFetchResult<TData> = {
  data: TData[];
  total: number;
};

export type GridSortState = {
  columnId: string;
  direction: 'asc' | 'desc';
} | null;

export type TanstackGridRef = {
  openSettingsDrawer: () => void;
  closeSettingsDrawer: () => void;
  clearSelection: () => void;
  getSortState: () => GridSortState;
};

type TanstackGridProps<TData> = {
  columns: GridColumnDef<TData, any>[];
  data?: TData[];
  fetchData?: (args: GridFetchArgs) => Promise<GridFetchResult<TData>>;
  serverData?: boolean;
  pageSize?: number;
  filters?: ColumnFiltersState;
  canSort?: boolean;
  selectionMode?: 'single' | 'multiple' | 'hierarchySingleSelect' | 'none';
  canSelectAll?: boolean;
  showSelectAllCheckbox?: boolean;
  canResize?: boolean;
  canReorder?: boolean;
  showColumnFilters?: boolean;
  canPinning?: boolean;
  globalFilter?: boolean;
  getRowId?: (originalRow: TData, index: number) => string;
  getRowCanSelect?: (row: Row<TData>) => boolean;
  getSubRows?: (originalRow: TData) => TData[] | undefined;
  enableVirtualization?: boolean;
  enableHierarchy?: boolean;
  enableNestedGrid?: boolean;
  nestedGridRenderer?: (row: Row<TData>) => React.ReactNode;
  autoExpandAll?: boolean;
  selectChildrenOnParentSelect?: boolean;
  disableDescendantsWhenParentSelected?: boolean;
  children?: React.ReactNode;
  gridHeight?: number | string;
  id?: string;
  saveUserInteraction?: boolean;
  interactionKey?: string;
  queryKey?: string;
  queryKeyDependencies?: unknown;
  onSelectedRowsChange?: (rows: TData[]) => void;
  showToolbar?: boolean;
  showConfigureColumns?: boolean;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  enableStripedRows?: boolean;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  noRecordsMessage?: string;
  disableAllSelection?: boolean;
  initialSelectedRowIds?: string[];
  toolbarClassName?: string;
  containerClassName?: string;
  childrenClassName?: string;
  overscan?: number;
  showFetchedDataCount?: boolean;
  countSectionClassName?: string;
  initialHiddenColumnIds?: string[];
};

const TanstackGridComponentInner = <TData,>(
  {
    columns,
    data = [],
    fetchData,
    serverData = false,
    pageSize = 10,
    filters = [],
    canSort = false,
    selectionMode = 'none',
    canSelectAll = false,
    showSelectAllCheckbox = true,
    canResize = true,
    canReorder = true,
    showColumnFilters = false,
    canPinning = false,
    globalFilter = false,
    getRowId,
    getRowCanSelect,
    getSubRows,
    enableVirtualization = false,
    enableHierarchy = false,
    enableNestedGrid = false,
    nestedGridRenderer,
    autoExpandAll = false,
    selectChildrenOnParentSelect = true,
    disableDescendantsWhenParentSelected = true,
    children,
    gridHeight = 400,
    id = '',
    saveUserInteraction = false,
    interactionKey = '',
    queryKey = 'grid-data',
    queryKeyDependencies,
    onSelectedRowsChange,
    showToolbar = true,
    showConfigureColumns = true,
    showPagination = true,
    pageSizeOptions,
    enableStripedRows = true,
    headerClassName = '',
    rowClassName = '',
    cellClassName = '',
    noRecordsMessage = 'No records found',
    disableAllSelection = false,
    initialSelectedRowIds,
    toolbarClassName = '',
    containerClassName = '',
    childrenClassName = '',
    overscan = 10,
    showFetchedDataCount = false,
    countSectionClassName = 'text-right text-sm px-2',
    initialHiddenColumnIds,
  }: TanstackGridProps<TData>,
  ref: React.ForwardedRef<TanstackGridRef>
) => {
  const tableInstanceRef = useRef<any>(null);
  const lastNotifiedSelectionKeyRef = useRef<string | null>(null);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

  const { containerRef, scrollLeft } = useScrollTracking();

  const initialPinning = useMemo(
    () => buildInitialPinning(columns, selectionMode),
    [columns, selectionMode]
  );

  const mergedInitialHiddenColumnIds = useMemo(() => {
    const fromColumns = buildInitialHiddenColumnIds(columns);
    if (!initialHiddenColumnIds?.length) return fromColumns;
    return Array.from(new Set([...fromColumns, ...initialHiddenColumnIds]));
  }, [columns, initialHiddenColumnIds]);

  const [state, setters] = useGridState({
    id,
    saveUserInteraction,
    interactionKey,
    pageSize,
    filters,
    initialPinning,
    initialHiddenColumnIds: mergedInitialHiddenColumnIds,
  });

  const queryArgs = useMemo(
    () => ({
      pagination: state.pagination,
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilterValue,
    }),
    [state.pagination, state.sorting, state.columnFilters, state.globalFilterValue]
  );

  const dataQuery = useQuery({
    queryKey: [
      queryKey,
      ...(queryKeyDependencies !== undefined ? [queryKeyDependencies] : []),
      queryArgs,
    ],
    queryFn: ({ signal }) =>
      fetchData?.({ ...queryArgs, signal }) ?? Promise.resolve({ data: [], total: 0 }),
    enabled: serverData && Boolean(fetchData),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const tableData = serverData ? (dataQuery.data?.data ?? []) : data;
  const rowCount = serverData ? (dataQuery.data?.total ?? 0) : 0;

  const selectionColumn = createSelectionColumn<TData>(
    selectionMode,
    canSelectAll,
    showSelectAllCheckbox,
    disableAllSelection,
    serverData && dataQuery.isFetching,
    disableDescendantsWhenParentSelected
  );

  const mergedColumns = useMemo<ColumnDef<TData, any>[]>(
    () => (selectionMode === 'none' ? columns : [selectionColumn, ...columns]),
    [columns, selectionColumn, selectionMode]
  );
  const defaultColumn = useMemo(
    () => ({ minSize: 100, size: 150, maxSize: 500, enableResizing: true }),
    []
  );

  const table = useReactTable({
    data: tableData,
    columns: mergedColumns,
    defaultColumn,
    rowCount: serverData ? rowCount : undefined,
    state: {
      pagination: state.pagination,
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilterValue,
      rowSelection: state.rowSelection,
      columnOrder: state.columnOrder,
      columnPinning: state.columnPinning,
      columnVisibility: state.columnVisibility,
      columnSizing: state.columnSizing,
      expanded: state.expanded,
    },
    onPaginationChange: setters.setPagination,
    onSortingChange: setters.setSorting,
    onColumnFiltersChange: setters.setColumnFilters,
    onGlobalFilterChange: setters.setGlobalFilterValue,
    onRowSelectionChange: setters.setRowSelection,
    onColumnOrderChange: setters.setColumnOrder,
    onColumnPinningChange: setters.setColumnPinning,
    onColumnVisibilityChange: setters.setColumnVisibility,
    onColumnSizingChange: setters.setColumnSizing,
    onExpandedChange: setters.setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: serverData ? undefined : getFilteredRowModel(),
    getSortedRowModel: serverData ? undefined : getSortedRowModel(),
    getPaginationRowModel: serverData ? undefined : getPaginationRowModel(),
    getExpandedRowModel:
      enableHierarchy || enableNestedGrid || getSubRows ? getExpandedRowModel() : undefined,
    enableSorting: canSort,
    enableMultiRowSelection:
      selectionMode === 'multiple' || selectionMode === 'hierarchySingleSelect',
    enableColumnResizing: canResize,
    enablePinning: canPinning,
    enableHiding: true,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    manualPagination: serverData,
    manualSorting: serverData,
    manualFiltering: serverData,
    getRowId,
    enableRowSelection:
      selectionMode !== 'none'
        ? getRowCanSelect
          ? (row: Row<TData>) => getRowCanSelect(row)
          : true
        : false,
    getSubRows: enableNestedGrid ? () => undefined : getSubRows,
    getRowCanExpand: enableNestedGrid ? () => true : undefined,
    sortDescFirst: false,
  });

  const totalCount = serverData ? rowCount : table?.getFilteredRowModel()?.rows?.length;

  tableInstanceRef.current = table;

  const { virtualRows, paddingTop, paddingBottom } = useGridVirtualization(
    enableVirtualization,
    table.getRowModel().rows.length,
    containerRef,
    overscan
  );
  const { columnOrderKey, columnPinningKey } = useColumnKeys(
    table.getVisibleLeafColumns(),
    state.columnPinning
  );
  const { totalTableWidth, calculatedGridHeight } = useGridMetrics(
    table.getVisibleLeafColumns(),
    state.columnSizing,
    gridHeight
  );
  const { skeletonIndices } = useRowIndices(table.getState().pagination.pageSize);

  const calculatePinningStyles = useCallback(
    (
      column: any,
      isHeader: boolean,
      rowState?: { isHovered: boolean; isSelected: boolean; isEven: boolean }
    ) => {
      return getPinningStylesForCell({
        column,
        isHeader,
        rowState,
        columnPinning: state.columnPinning as any,
        enableStripedRows,
        scrollLeft,
        allColumns: tableInstanceRef.current?.getAllLeafColumns() ?? [],
        containerWidth: containerRef.current?.clientWidth ?? 0,
      });
    },
    [state.columnPinning, enableStripedRows, scrollLeft, containerRef]
  );

  useEffect(() => {
    if (autoExpandAll && (enableHierarchy || enableNestedGrid) && tableData.length > 0) {
      const expandAll: ExpandedState = {};
      const expandRecursive = (rows: TData[]) => {
        rows.forEach((row, index) => {
          const rowId = getRowId ? getRowId(row, index) : String(index);
          const subRows = getSubRows?.(row);
          if ((enableHierarchy && subRows?.length) || enableNestedGrid) {
            expandAll[rowId] = true;
            if (subRows?.length) expandRecursive(subRows);
          }
        });
      };
      expandRecursive(tableData);
      setters.setExpanded(expandAll);
    }
  }, [autoExpandAll, enableHierarchy, enableNestedGrid, tableData, getRowId, getSubRows, setters]);

  useSaveGridState(saveUserInteraction, id, interactionKey, state);

  usePaginationSync(pageSize, setters.setPagination);
  usePaginationBounds(
    serverData ? rowCount : table.getFilteredRowModel().rows.length,
    state.pagination,
    setters.setPagination
  );
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = 0;
    }
  }, [state.pagination.pageIndex, containerRef]);

  useGlobalFilterDebounce(state.debouncedGlobalFilter, setters.setGlobalFilterValue);

  const [selectionVersion, setSelectionVersion] = useState(0);

  const handleRowSelectionChange = useCallback(
    (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
      if (selectionMode === 'hierarchySingleSelect') {
        const next = typeof updater === 'function' ? updater({}) : updater;
        const clickedRowId = Object.keys(next).find((id) => next[id]);

        if (!clickedRowId) {
          setters.setRowSelection({});
          return;
        }

        if (state.rowSelection[clickedRowId]) {
          setters.setRowSelection({});
          return;
        }
        const allRows = table.getCoreRowModel().flatRows;
        const clickedRow = allRows.find((r) => r.id === clickedRowId);

        if (!clickedRow) {
          return;
        }

        const newSelection: RowSelectionState = { [clickedRowId]: true };

        const collectAllDescendants = (row: Row<TData>): void => {
          if (row.subRows && row.subRows.length > 0) {
            row.subRows.forEach((subRow) => {
              newSelection[subRow.id] = true;
              collectAllDescendants(subRow);
            });
          }
        };

        collectAllDescendants(clickedRow);

        flushSync(() => {
          setters.setRowSelection(newSelection);
          setSelectionVersion((v) => v + 1);
        });
        return;
      }

      setters.setRowSelection((old) => {
        const next = typeof updater === 'function' ? updater(old) : updater;

        if (selectionMode === 'single') {
          const selectedIds = Object.keys(next).filter((id) => next[id]);
          return selectedIds.length ? { [selectedIds[selectedIds.length - 1]]: true } : {};
        }

        if (
          selectionMode === 'multiple' &&
          enableHierarchy &&
          selectChildrenOnParentSelect &&
          !enableNestedGrid
        ) {
          const newSelection = { ...next };
          const allRows = table.getCoreRowModel().flatRows;
          Object.keys(next).forEach((rowId) => {
            if (next[rowId] !== old[rowId]) {
              const row = allRows.find((r) => r.id === rowId);
              if (row && row.subRows) {
                const collectDescendants = (parentRow: Row<TData>) => {
                  if (parentRow.subRows && parentRow.subRows.length > 0) {
                    parentRow.subRows.forEach((subRow) => {
                      newSelection[subRow.id] = next[rowId];
                      collectDescendants(subRow);
                    });
                  }
                };
                collectDescendants(row);
              }
            }
          });
          return newSelection;
        }

        return next;
      });
    },
    [selectionMode, enableHierarchy, enableNestedGrid, selectChildrenOnParentSelect, table, setters]
  );

  useEffect(() => {
    table.options.onRowSelectionChange = handleRowSelectionChange;
  }, [handleRowSelectionChange, table]);

  const hasRestoredSelectionRef = useRef(false);
  const lastRestoredDataKeyRef = useRef<string>('');
  const lastInitialSelectedRowIdsRef = useRef<string>('');

  useEffect(() => {
    if (!initialSelectedRowIds || initialSelectedRowIds.length === 0) {
      hasRestoredSelectionRef.current = false;
      lastInitialSelectedRowIdsRef.current = '';
      return;
    }
    if (!tableData || tableData.length === 0) return;

    const initialIdsKey = [...initialSelectedRowIds].sort().join(',');
    const dataKey = serverData
      ? `${queryKey}-${JSON.stringify(queryKeyDependencies)}-${tableData.length}`
      : `${tableData.length}-${tableData[0]?.id || ''}`;

    const currentSelection = Object.keys(state.rowSelection).filter((id) => state.rowSelection[id]);
    const currentSelectionSet = new Set(currentSelection);

    const selectionMatches =
      currentSelection.length === initialSelectedRowIds.length &&
      initialSelectedRowIds.every((id) => currentSelectionSet.has(id));

    const initialIdsChanged = lastInitialSelectedRowIdsRef.current !== initialIdsKey;
    const dataChanged = lastRestoredDataKeyRef.current !== dataKey;
    const isSelectionEmpty = currentSelection.length === 0;
    const shouldRestore =
      !selectionMatches &&
      isSelectionEmpty &&
      initialSelectedRowIds.length > 0 &&
      (initialIdsChanged || dataChanged || !hasRestoredSelectionRef.current);

    if (shouldRestore) {
      const idsToSelect = new Set<string>(initialSelectedRowIds);
      if ((enableHierarchy || getSubRows) && table) {
        const flatRows = table.getCoreRowModel().flatRows;
        initialSelectedRowIds.forEach((id) => {
          const row = flatRows.find((r) => r.id === id);
          if (row?.subRows?.length) {
            const addDescendants = (r: Row<TData>) => {
              (r.subRows || []).forEach((sub: Row<TData>) => {
                idsToSelect.add(sub.id);
                addDescendants(sub);
              });
            };
            addDescendants(row);
          }
        });
      }
      const rowSelection: RowSelectionState = {};
      idsToSelect.forEach((id) => {
        rowSelection[id] = true;
      });
      setters.setRowSelection(rowSelection);
      hasRestoredSelectionRef.current = true;
      lastRestoredDataKeyRef.current = dataKey;
      lastInitialSelectedRowIdsRef.current = initialIdsKey;
    }
  }, [
    initialSelectedRowIds,
    tableData,
    setters,
    serverData,
    queryKey,
    queryKeyDependencies,
    table,
    enableHierarchy,
    getSubRows,
    interactionKey,
    state.rowSelection,
  ]);

  const handleColumnReorder = useCallback(
    (draggedId: string, targetId: string) => {
      if (
        !canReorder ||
        draggedId === targetId ||
        draggedId.startsWith('__') ||
        targetId.startsWith('__')
      )
        return;

      const { left = [], right = [], fixed = [] } = state.columnPinning as any;
      const getZone = (id: string) =>
        left.includes(id) ? 'left' : right.includes(id) ? 'right' : 'center';

      const nextOrder = [
        ...(table.getState().columnOrder.length
          ? table.getState().columnOrder
          : table.getAllLeafColumns().map((c) => c.id)),
      ];
      const fromIdx = nextOrder.indexOf(draggedId);
      const toIdx = nextOrder.indexOf(targetId);
      if (fromIdx === -1 || toIdx === -1) return;

      nextOrder.splice(fromIdx, 1);
      nextOrder.splice(toIdx, 0, draggedId);

      const draggedZone = getZone(draggedId);
      const targetZone = getZone(targetId);

      if (draggedZone !== targetZone) {
        let nextLeft = left.filter((id: string) => id !== draggedId);
        let nextRight = right.filter((id: string) => id !== draggedId);
        let nextFixed = fixed.filter((id: string) => id !== draggedId);

        if (targetZone === 'left') nextLeft.push(draggedId);
        else if (targetZone === 'right') nextRight.push(draggedId);
        else nextFixed.push(draggedId);

        flushSync(() => {
          setters.setColumnPinning({ left: nextLeft, right: nextRight, fixed: nextFixed });
          setters.setColumnOrder(nextOrder);
        });
      } else {
        setters.setColumnOrder(nextOrder);
      }
    },
    [canReorder, state.columnPinning, table, setters]
  );

  const settingsColumns = useMemo(
    () => table.getAllLeafColumns().filter((column) => column.id !== '__select'),
    [table, columns]
  );

  const handleSaveColumnSettings = useCallback(
    (config: {
      columnOrder: ColumnOrderState;
      columnPinning: ColumnPinningState;
      columnVisibility: VisibilityState;
    }) => {
      const hiddenIds = Object.keys(config.columnVisibility).filter(
        (id) => !config.columnVisibility[id]
      );
      const updatedPinning = {
        left: config.columnPinning.left?.filter((id) => !hiddenIds.includes(id)) || [],
        right: config.columnPinning.right?.filter((id) => !hiddenIds.includes(id)) || [],
        fixed:
          (config.columnPinning as any).fixed?.filter((id: string) => !hiddenIds.includes(id)) ||
          [],
      };

      const specialColumns = table
        .getAllLeafColumns()
        .filter((col) => col.id.startsWith('__'))
        .map((col) => col.id);
      const fullColumnOrder = [...specialColumns, ...config.columnOrder];

      flushSync(() => {
        setters.setColumnPinning(updatedPinning);
        setters.setColumnOrder(fullColumnOrder);
        setters.setColumnVisibility((prev) => ({ ...prev, ...config.columnVisibility }));
      });
      document.getElementById('configure_column_settings_btn')?.focus();
    },
    [table, setters]
  );

  useEffect(() => {
    if (!onSelectedRowsChange) return;
    if (serverData && dataQuery.isFetching) return;

    const flatRows = table.getCoreRowModel().flatRows;
    const valid = new Set(flatRows.map((r) => r.id));
    const selectedIds = Object.keys(state.rowSelection).filter((id) => state.rowSelection[id]);
    const prunedIds = valid.size === 0 ? [] : selectedIds.filter((id) => valid.has(id));

    const selKey = [...selectedIds].sort().join('\0');
    const pruKey = [...prunedIds].sort().join('\0');
    const selectionPruned = selKey !== pruKey;

    if (selectionPruned) {
      const next: RowSelectionState = {};
      prunedIds.forEach((id) => {
        next[id] = true;
      });
      if (initialSelectedRowIds?.length) {
        for (const id of initialSelectedRowIds) {
          if (valid.has(id)) next[id] = true;
        }
      }
      lastNotifiedSelectionKeyRef.current = null;
      setters.setRowSelection(next);
      return;
    }

    const notifyKey = [...prunedIds].sort().join('\0');
    if (notifyKey === lastNotifiedSelectionKeyRef.current) {
      return;
    }
    lastNotifiedSelectionKeyRef.current = notifyKey;

    const selectedRows = prunedIds
      .map((id) => flatRows.find((r) => r.id === id))
      .filter(Boolean)
      .map((r) => r!.original);

    onSelectedRowsChange(selectedRows);
  }, [
    onSelectedRowsChange,
    state.rowSelection,
    table,
    serverData,
    dataQuery.isFetching,
    dataQuery.data,
    interactionKey,
    queryKey,
    initialSelectedRowIds,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      openSettingsDrawer: () => setIsSettingsDrawerOpen(true),
      closeSettingsDrawer: () => setIsSettingsDrawerOpen(false),
      clearSelection: () => setters.setRowSelection({}),
      getSortState: (): GridSortState => {
        const sorting = table.getState().sorting;
        const first = sorting[0];
        if (!first) return null;
        return { columnId: first.id, direction: first.desc ? 'desc' : 'asc' };
      },
    }),
    [setters, table, interactionKey, queryKey, showConfigureColumns]
  );

  const headerGroups = table.getHeaderGroups();
  const leafHeaders = headerGroups[headerGroups.length - 1];
  const rowModel = table.getRowModel();
  const visibleColumns = table.getVisibleLeafColumns();
  const isLoading = serverData && dataQuery.isFetching;
  const hasNoData = !isLoading && !rowModel.rows.length;

  return (
    <div className={`w-full ${containerClassName || 'space-y-4 p-4'}`}>
      {showToolbar && (
        <div className={`flex flex-wrap items-center justify-between gap-4 ${toolbarClassName}`}>
          <div className={childrenClassName || 'min-w-0'}>{children}</div>
          <div className="flex flex-shrink-0 items-center gap-3">
            {globalFilter && (
              <>
                <label htmlFor="global-filter" className="text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="relative">
                  <input
                    id="global-filter"
                    type="text"
                    value={state.debouncedGlobalFilter}
                    onChange={(e) => setters.setDebouncedGlobalFilter(e.target.value)}
                    className="bg-card w-64 rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm transition-shadow focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Search all columns..."
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </>
            )}
            {showConfigureColumns && (
              <button
                id="configure_column_settings_btn"
                onClick={() => setIsSettingsDrawerOpen(true)}
                className="bg-card inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Configure columns"
              >
                <FontAwesomeIcon icon={faWrench} className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {isSettingsDrawerOpen && (
        <ColumnSettingsDrawer
          isOpen
          columns={settingsColumns}
          columnVisibility={state.columnVisibility}
          columnPinning={state.columnPinning}
          columnOrder={state.columnOrder}
          onClose={() => {
            document.getElementById('configure_column_settings_btn')?.focus();
            setIsSettingsDrawerOpen(false);
          }}
          onSave={handleSaveColumnSettings}
        />
      )}

      <div className="bg-card relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div
          ref={containerRef}
          className="bg-card overflow-x-auto overflow-y-auto"
          style={{ height: calculatedGridHeight, minHeight: calculatedGridHeight }}
          role="region"
        >
          <table
            className="tanstack-grid-table min-w-full table-fixed"
            style={{
              tableLayout: 'fixed',
              width: '100%',
              minWidth: totalTableWidth,
              borderCollapse: 'separate',
              borderSpacing: 0,
            }}
          >
            <colgroup>
              {leafHeaders.headers.map((header) => (
                <col key={header.id} style={{ width: header.getSize() }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 z-30" style={{ backgroundColor: '#e8eaf6' }}>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHeaderCell
                      key={header.id}
                      header={header}
                      canSort={canSort}
                      canReorder={canReorder}
                      canResize={canResize}
                      isFixedColumn={(state.columnPinning as any).fixed?.includes(header.column.id)}
                      pinningStyles={calculatePinningStyles(header.column, true)}
                      onColumnReorder={handleColumnReorder}
                      onColumnResize={(columnId, newSize) =>
                        table.setColumnSizing((prev) => ({ ...prev, [columnId]: newSize }))
                      }
                      headerClassName={headerClassName}
                    />
                  ))}
                </tr>
              ))}
              {showColumnFilters && (
                <tr style={{ backgroundColor: '#e8eaf6' }}>
                  {leafHeaders.headers.map((header) => (
                    <ColumnFilterCell key={header.id} header={header} />
                  ))}
                </tr>
              )}
            </thead>
            <tbody className="bg-card">
              {isLoading ? (
                skeletonIndices.map((idx) => (
                  <SkeletonRow key={`skeleton-${idx}`} rowIndex={idx} columns={visibleColumns} />
                ))
              ) : hasNoData ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length}
                    className="bg-card px-4 py-3 text-sm text-gray-500"
                    style={{ height: `calc(${calculatedGridHeight} - 48px)`, verticalAlign: 'top' }}
                  >
                    {noRecordsMessage}
                  </td>
                </tr>
              ) : enableVirtualization && virtualRows.length ? (
                <>
                  {paddingTop > 0 && (
                    <tr>
                      <td style={{ height: `${paddingTop}px` }} />
                    </tr>
                  )}
                  {virtualRows.map((vRow) => {
                    const row = rowModel.rows[vRow.index];
                    return (
                      <TableRow
                        key={`${row.id}-v${selectionVersion}`}
                        row={row}
                        visibleCellsCount={visibleColumns.length}
                        columnOrderKey={columnOrderKey}
                        columnPinningKey={columnPinningKey}
                        isSelected={row.getIsSelected()}
                        rowIndex={vRow.index}
                        getPinningStyles={calculatePinningStyles}
                        enableHierarchy={enableHierarchy}
                        enableNestedGrid={enableNestedGrid}
                        nestedGridRenderer={nestedGridRenderer}
                        enableStripedRows={enableStripedRows}
                        rowClassName={rowClassName}
                        cellClassName={cellClassName}
                      />
                    );
                  })}
                  {paddingBottom > 0 && (
                    <tr>
                      <td style={{ height: `${paddingBottom}px` }} />
                    </tr>
                  )}
                </>
              ) : (
                rowModel.rows.map((row, idx) => (
                  <TableRow
                    key={`${row.id}-v${selectionVersion}`}
                    row={row}
                    visibleCellsCount={visibleColumns.length}
                    columnOrderKey={columnOrderKey}
                    columnPinningKey={columnPinningKey}
                    isSelected={row.getIsSelected()}
                    rowIndex={idx}
                    getPinningStyles={calculatePinningStyles}
                    enableHierarchy={enableHierarchy}
                    enableNestedGrid={enableNestedGrid}
                    nestedGridRenderer={nestedGridRenderer}
                    enableStripedRows={enableStripedRows}
                    rowClassName={rowClassName}
                    cellClassName={cellClassName}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {showPagination && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-sm text-zinc-600">
              {(() => {
                const { pageIndex, pageSize } = state.pagination;
                const start = pageIndex * pageSize + 1;
                const end = Math.min(
                  (pageIndex + 1) * pageSize,
                  serverData ? rowCount : table.getFilteredRowModel().rows.length
                );
                const total = serverData ? rowCount : table.getFilteredRowModel().rows.length;
                return ``;
              })()}
            </div>
            <PaginationControls
              table={table}
              isFetching={dataQuery.isFetching}
              pageSizeOptions={pageSizeOptions}
              totalItems={serverData ? rowCount : table.getFilteredRowModel().rows.length}
            />
          </div>
        )}
        {showFetchedDataCount && totalCount > 0 && (
          <div id="fetched-count-section" className={`${countSectionClassName}`}>
            Showing {totalCount} of {totalCount} results
          </div>
        )}
      </div>
    </div>
  );
};

const TanstackGridComponent = forwardRef(TanstackGridComponentInner) as <TData>(
  props: TanstackGridProps<TData> & { ref?: React.ForwardedRef<TanstackGridRef> }
) => React.ReactElement;

export default TanstackGridComponent;
