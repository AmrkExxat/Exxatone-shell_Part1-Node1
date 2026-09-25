'use client';

import React, { useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import { TableCell } from './TableCell';

interface TableRowProps<TData> {
  row: Row<TData>;
  visibleCellsCount: number;
  isSelected: boolean;
  rowIndex: number;
  getPinningStyles?: (
    column: any,
    isHeader: boolean,
    rowState?: { isHovered: boolean; isSelected: boolean; isEven: boolean }
  ) => any;
  enableHierarchy?: boolean;
  enableNestedGrid?: boolean;
  nestedGridRenderer?: (row: Row<TData>) => React.ReactNode;
  enableStripedRows?: boolean;
  rowClassName?: string;
  cellClassName?: string;
}

export function TableRow<TData>({
  row,
  visibleCellsCount,
  isSelected,
  rowIndex,
  getPinningStyles,
  enableHierarchy = false,
  enableNestedGrid = false,
  nestedGridRenderer,
  enableStripedRows = true,
  rowClassName = '',
  cellClassName = '',
}: TableRowProps<TData>) {
  const cells = row.getVisibleCells();
  const isExpanded = row.getIsExpanded();
  const isEvenRow = rowIndex % 2 === 0;

  const firstDataCellIndex = useMemo(
    () => cells.findIndex((cell) => !cell.column.id.startsWith('__')),
    [cells]
  );

  // Single source for row background: --row-bg. Row and pinned cells both use it so they always match.
  const rowClassNameResolved = useMemo(() => {
    const base = isSelected
      ? '[--row-bg:#C7CBE8]'
      : enableStripedRows && !isEvenRow
        ? '[--row-bg:rgb(249,250,251)]'
        : '[--row-bg:white]';
    const hover = isSelected ? '' : 'hover:[--row-bg:rgb(243,244,246)]';
    return `group transition-colors duration-150 bg-[var(--row-bg)] ${base} ${hover} ${rowClassName}`.trim();
  }, [isSelected, enableStripedRows, isEvenRow, rowClassName]);

  return (
    <>
      <tr
        aria-expanded={enableNestedGrid && row.getCanExpand() ? isExpanded : undefined}
        aria-selected={isSelected}
        className={rowClassNameResolved}
      >
        {cells.map((cell, cellIndex) => (
          <TableCell
            key={cell.id}
            cell={cell}
            isRowSelected={isSelected}
            isRowEven={isEvenRow}
            getPinningStyles={getPinningStyles}
            enableHierarchy={enableHierarchy}
            enableNestedGrid={enableNestedGrid}
            isFirstDataCell={cellIndex === firstDataCellIndex}
            row={row}
            cellClassName={cellClassName}
          />
        ))}
      </tr>
      {enableNestedGrid && isExpanded && nestedGridRenderer && (
        <tr>
          <td colSpan={visibleCellsCount} className="bg-gray-50 p-0">
            {nestedGridRenderer(row)}
          </td>
        </tr>
      )}
    </>
  );
}
