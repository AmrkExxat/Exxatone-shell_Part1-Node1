import { useEffect, useMemo, useState } from 'react';
import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
  ExpandedState,
  PaginationState,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';
import { gridUserInteraction } from './gridUserInteraction';

export interface GridState {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilterValue: string;
  rowSelection: RowSelectionState;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  columnVisibility: ColumnVisibilityState;
  columnSizing: ColumnSizingState;
  expanded: ExpandedState;
  debouncedGlobalFilter: string;
}

export interface GridStateSetters {
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setGlobalFilterValue: React.Dispatch<React.SetStateAction<string>>;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  setColumnOrder: React.Dispatch<React.SetStateAction<ColumnOrderState>>;
  setColumnPinning: React.Dispatch<React.SetStateAction<ColumnPinningState>>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibilityState>>;
  setColumnSizing: React.Dispatch<React.SetStateAction<ColumnSizingState>>;
  setExpanded: React.Dispatch<React.SetStateAction<ExpandedState>>;
  setDebouncedGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

interface UseGridStateProps {
  id?: string;
  saveUserInteraction?: boolean;
  interactionKey?: string;
  pageSize: number;
  filters: ColumnFiltersState;
  initialPinning: ColumnPinningState;
  initialHiddenColumnIds?: string[];
}

/**
 * Manages all grid state with optional persistence
 */
export function useGridState({
  id,
  saveUserInteraction,
  interactionKey,
  pageSize,
  filters,
  initialPinning,
  initialHiddenColumnIds,
}: UseGridStateProps): [GridState, GridStateSetters] {
  // Load saved user interactions
  const userInteraction = useMemo(() => {
    if (!saveUserInteraction || !id) return null;
    return gridUserInteraction(id, 'get', interactionKey);
  }, [id, saveUserInteraction, interactionKey]);

  // Initialize all state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: userInteraction?.pagination?.pageIndex ?? 0,
    pageSize: userInteraction?.pagination?.pageSize ?? pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>(userInteraction?.sorting ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    userInteraction?.columnFilters ?? filters
  );
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    userInteraction?.columnOrder ?? []
  );
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    userInteraction?.columnPinning ?? initialPinning
  );
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() => {
    if (userInteraction?.columnVisibility) return userInteraction.columnVisibility;
    if (initialHiddenColumnIds?.length) {
      return initialHiddenColumnIds.reduce<ColumnVisibilityState>((acc, columnId) => {
        acc[columnId] = false;
        return acc;
      }, {});
    }
    return {};
  });
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    userInteraction?.columnSizing ?? {}
  );
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState('');

  const state: GridState = {
    pagination,
    sorting,
    columnFilters,
    globalFilterValue,
    rowSelection,
    columnOrder,
    columnPinning,
    columnVisibility,
    columnSizing,
    expanded,
    debouncedGlobalFilter,
  };

  const setters: GridStateSetters = {
    setPagination,
    setSorting,
    setColumnFilters,
    setGlobalFilterValue,
    setRowSelection,
    setColumnOrder,
    setColumnPinning,
    setColumnVisibility,
    setColumnSizing,
    setExpanded,
    setDebouncedGlobalFilter,
  };

  return [state, setters];
}

/**
 * Saves grid state to localStorage when it changes
 */
export function useSaveGridState(
  saveUserInteraction: boolean,
  id: string,
  interactionKey: string,
  state: Pick<
    GridState,
    | 'sorting'
    | 'columnFilters'
    | 'columnVisibility'
    | 'columnOrder'
    | 'columnPinning'
    | 'columnSizing'
    | 'pagination'
  >
) {
  useEffect(() => {
    if (!saveUserInteraction || !id) return;

    const interactionData = {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      columnOrder: state.columnOrder,
      columnPinning: state.columnPinning,
      columnSizing: state.columnSizing,
      pagination: {
        pageSize: state.pagination.pageSize,
        pageIndex: state.pagination.pageIndex,
      },
    };

    gridUserInteraction(id, 'set', interactionKey, interactionData);
  }, [
    saveUserInteraction,
    id,
    interactionKey,
    state.sorting,
    state.columnFilters,
    state.columnVisibility,
    state.columnOrder,
    state.columnPinning,
    state.columnSizing,
    state.pagination.pageSize,
    state.pagination.pageIndex,
  ]);
}

/**
 * Syncs pagination when page size changes
 */
export function usePaginationSync(
  pageSize: number,
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
) {
  useEffect(() => {
    setPagination((current) =>
      current.pageSize === pageSize ? current : { ...current, pageIndex: 0, pageSize }
    );
  }, [pageSize, setPagination]);
}

/**
 * Prevents going beyond max page index
 */
export function usePaginationBounds(
  rowCount: number,
  pagination: PaginationState,
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
) {
  useEffect(() => {
    const maxPageIndex = Math.max(0, Math.ceil(rowCount / pagination.pageSize) - 1);
    if (pagination.pageIndex > maxPageIndex) {
      setPagination((prev) => ({ ...prev, pageIndex: maxPageIndex }));
    }
  }, [rowCount, pagination.pageSize, pagination.pageIndex, setPagination]);
}

/**
 * Debounces global filter input
 */
export function useGlobalFilterDebounce(
  debouncedGlobalFilter: string,
  setGlobalFilterValue: React.Dispatch<React.SetStateAction<string>>
) {
  useEffect(() => {
    const handler = setTimeout(() => setGlobalFilterValue(debouncedGlobalFilter), 300);
    return () => clearTimeout(handler);
  }, [debouncedGlobalFilter, setGlobalFilterValue]);
}
