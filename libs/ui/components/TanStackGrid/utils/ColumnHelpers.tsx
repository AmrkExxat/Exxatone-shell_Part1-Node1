import { ColumnDef, Row, Table } from '@tanstack/react-table';

export type SelectionMode = 'single' | 'multiple' | 'hierarchySingleSelect' | 'none';

function getRowSelectionState<TData>(row: Row<TData>): {
  isSelected: boolean;
  isIndeterminate: boolean;
} {
  if (!row.subRows?.length) {
    return { isSelected: row.getIsSelected(), isIndeterminate: false };
  }

  const states = row.subRows.map(getRowSelectionState);
  const selectedCount = states.filter((s) => s.isSelected || s.isIndeterminate).length;

  if (selectedCount === 0) return { isSelected: false, isIndeterminate: false };
  if (
    selectedCount === row.subRows.length &&
    states.every((s) => s.isSelected && !s.isIndeterminate)
  ) {
    return { isSelected: true, isIndeterminate: false };
  }
  return { isSelected: false, isIndeterminate: true };
}

function getSelectAllState<TData>(table: Table<TData>): {
  isAllSelected: boolean;
  isIndeterminate: boolean;
} {
  const selectableRows = table.getRowModel().rows.filter((row) => row.getCanSelect());
  if (!selectableRows.length) return { isAllSelected: false, isIndeterminate: false };

  const states = selectableRows.map(getRowSelectionState);
  const selectedCount = states.filter((s) => s.isSelected || s.isIndeterminate).length;

  if (selectedCount === 0) return { isAllSelected: false, isIndeterminate: false };
  if (
    selectedCount === selectableRows.length &&
    states.every((s) => s.isSelected && !s.isIndeterminate)
  ) {
    return { isAllSelected: true, isIndeterminate: false };
  }
  return { isAllSelected: false, isIndeterminate: true };
}

function hasAncestorSelected<TData>(row: Row<TData>): boolean {
  let parent = row.getParentRow();
  while (parent) {
    if (parent.getIsSelected()) return true;
    parent = parent.getParentRow();
  }
  return false;
}

export function createSelectionColumn<TData>(
  selectionMode: SelectionMode,
  canSelectAll: boolean,
  showSelectAllCheckbox: boolean = false,
  disableAllSelection: boolean = false,
  isDataLoading: boolean = false,
  disableDescendantsWhenParentSelected: boolean = true
): ColumnDef<TData> {
  return {
    id: '__select',
    header: ({ table }) => {
      if (
        selectionMode === 'single' ||
        selectionMode === 'hierarchySingleSelect' ||
        !showSelectAllCheckbox
      ) {
        return null;
      }
      if (disableAllSelection) {
        return (
          <div className="flex items-center justify-center px-1">
            <input
              type="checkbox"
              checked
              disabled
              readOnly
              aria-label="All rows selected (selection disabled)"
              className="h-4 w-4 cursor-not-allowed rounded border-1 border-gray-400 bg-gray-400 text-gray-500"
            />
          </div>
        );
      }

      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomePageRowsSelected();
      const isDisabled = isDataLoading;

      return (
        <div className="flex items-center justify-center px-1">
          {!isDisabled && (
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isSomeSelected && !isAllSelected;
                }
              }}
              aria-checked={isSomeSelected ? 'mixed' : isAllSelected}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              aria-label="Select all rows on current page"
              className="h-4 w-4 cursor-pointer rounded border-1 border-gray-900 text-blue-600 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            />
          )}
        </div>
      );
    },
    cell: ({ row }) => {
      if (!row.getCanSelect()) return null;

      const baseClasses =
        'h-4 w-4 rounded border-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
      const radioBaseClasses =
        'h-4 w-4 rounded-full border-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
      const disabledSelectedClasses =
        'cursor-not-allowed border-gray-200 text-gray-500 bg-gray-400';
      const disabledUnselectedClasses =
        'cursor-not-allowed border-gray-200 text-gray-400 bg-gray-50';
      const enabledClasses = 'cursor-pointer border-gray-900 text-blue-600';

      // hierarchySingleSelect mode
      if (selectionMode === 'hierarchySingleSelect') {
        let parent = row.getParentRow();
        while (parent) {
          if (parent.getIsSelected()) return null;
          parent = parent.getParentRow();
        }

        return (
          <div className="flex items-center justify-center px-1">
            <input
              type="radio"
              name="hierarchySingleSelect"
              checked={row.getIsSelected()}
              onClick={(e) => {
                e.stopPropagation();
                row.toggleSelected(!row.getIsSelected());
              }}
              onChange={() => {}}
              tabIndex={-1}
              aria-label={`Select row ${row.index + 1}`}
              className={`${radioBaseClasses} ${enabledClasses}`}
            />
          </div>
        );
      }

      // single selection mode
      if (selectionMode === 'single') {
        return (
          <div className="flex items-center justify-center px-1">
            <input
              type="radio"
              checked={row.getIsSelected()}
              disabled={disableAllSelection}
              readOnly={disableAllSelection}
              onChange={() => !disableAllSelection && row.toggleSelected(!row.getIsSelected())}
              aria-label={`${disableAllSelection ? 'Row selected (disabled)' : 'Select row'} ${row.index + 1}`}
              className={`${radioBaseClasses} ${
                disableAllSelection
                  ? row.getIsSelected()
                    ? disabledSelectedClasses
                    : disabledUnselectedClasses
                  : enabledClasses
              }`}
            />
          </div>
        );
      }

      // When disableAllSelection is true, show all checkboxes as checked (for "select all across pages" mode)
      const ancestorSelected = disableDescendantsWhenParentSelected && hasAncestorSelected(row);
      const isChecked = disableAllSelection ? true : row.getIsSelected();
      const isDisabled = disableAllSelection || !row.getCanSelect() || ancestorSelected;
      return (
        <div className="flex items-center justify-center px-1">
          <input
            type="checkbox"
            checked={isChecked}
            disabled={isDisabled}
            readOnly={disableAllSelection || ancestorSelected}
            onChange={
              disableAllSelection || ancestorSelected ? () => {} : row.getToggleSelectedHandler()
            }
            aria-label={`${disableAllSelection ? 'Row selected (disabled)' : ancestorSelected ? 'Select row (parent selected)' : 'Select row'} ${row.index + 1}`}
            className={`${baseClasses} ${
              isDisabled
                ? isChecked
                  ? disabledSelectedClasses
                  : disabledUnselectedClasses
                : enabledClasses
            }`}
          />
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    enableHiding: false,
    enablePinning: false,
    size: 40,
    minSize: 40,
    maxSize: 40,
  };
}

export function buildInitialHiddenColumnIds<TData>(
  columns: Array<ColumnDef<TData> & { hiddenByDefault?: boolean }>
): string[] {
  const ids: string[] = [];
  columns.forEach((column) => {
    if (!column.hiddenByDefault) return;
    const columnId =
      column.id ??
      ('accessorKey' in column && typeof column.accessorKey === 'string'
        ? column.accessorKey
        : undefined);
    if (columnId) ids.push(columnId);
  });
  return ids;
}

export function buildInitialPinning<TData>(
  columns: Array<ColumnDef<TData> & { pinPosition?: 'left' | 'right' | 'fixed' | false }>,
  selectionMode: SelectionMode
) {
  const pinning: { left: string[]; right: string[]; fixed: string[] } = {
    left: [],
    right: [],
    fixed: [],
  };

  if (selectionMode !== 'none') pinning.left.push('__select');

  columns.forEach((column) => {
    const columnId =
      column.id ??
      ('accessorKey' in column && typeof column.accessorKey === 'string'
        ? column.accessorKey
        : undefined);
    if (!columnId || !column.pinPosition) return;

    if (column.pinPosition === 'left') pinning.left.push(columnId);
    else if (column.pinPosition === 'right') pinning.right.push(columnId);
    else if (column.pinPosition === 'fixed') pinning.fixed.push(columnId);
  });

  return pinning;
}

export function getDescendantIds<TData>(rowId: string, rows: Row<TData>[]): string[] {
  const row = rows.find((r) => r.id === rowId);
  if (!row) return [];

  const collectIds = (parentRow: Row<TData>): string[] =>
    (parentRow.subRows || []).flatMap((subRow) => [subRow.id, ...collectIds(subRow)]);

  return collectIds(row);
}
