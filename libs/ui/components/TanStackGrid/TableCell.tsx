'use client';

import React, { useCallback, useMemo } from 'react';
import { Cell, Row, flexRender } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { getBorderStyle } from './utils/tableUtils';

interface TableCellProps {
  cell: Cell<any, any>;
  isRowSelected?: boolean;
  isRowEven?: boolean;
  getPinningStyles?: (
    column: any,
    isHeader: boolean,
    rowState?: { isHovered: boolean; isSelected: boolean; isEven: boolean }
  ) => any;
  enableHierarchy?: boolean;
  enableNestedGrid?: boolean;
  isFirstDataCell?: boolean;
  row?: Row<any>;
  cellClassName?: string;
}

const HierarchyIndent = ({ depth }: { depth: number }) => (
  <div className="flex-shrink-0" style={{ width: `${depth * 24}px` }} aria-hidden="true" />
);

const ExpandButton = ({
  isExpanded,
  onClick,
}: {
  isExpanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    onDoubleClick={(e) => e.preventDefault()}
    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-gray-500 transition-all duration-150 hover:bg-gray-200 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
    aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
    aria-expanded={isExpanded}
  >
    <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} className="h-3 w-3" />
  </button>
);

const ExpandSpacer = () => <div className="h-5 w-5 flex-shrink-0" aria-hidden="true" />;

export function TableCell({
  cell,
  isRowSelected = false,
  isRowEven = false,
  getPinningStyles,
  enableHierarchy = false,
  enableNestedGrid = false,
  isFirstDataCell = false,
  row,
  cellClassName = '',
}: TableCellProps) {
  const isPinned = cell.column.getIsPinned();
  const isSelectColumn = cell.column.id === '__select';
  const canSelect = row?.getCanSelect() ?? true;

  const pinningStyles = useMemo(
    () =>
      getPinningStyles?.(cell.column, false, {
        isHovered: false,
        isSelected: isRowSelected,
        isEven: isRowEven,
      }) ?? {},
    [getPinningStyles, cell.column, isRowSelected, isRowEven]
  );

  const { isFixedColumn, isActuallySticky } = useMemo(
    () => ({
      isFixedColumn:
        pinningStyles.transform !== undefined ||
        (pinningStyles.position === 'sticky' && pinningStyles.left !== undefined && !isPinned),
      isActuallySticky: pinningStyles.position === 'sticky',
    }),
    [pinningStyles, isPinned]
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      row?.toggleExpanded();
    },
    [row]
  );

  const renderCellContent = useCallback(() => {
    const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());

    if ((enableHierarchy || enableNestedGrid) && isFirstDataCell && row) {
      const depth = row.depth;
      const canExpand = row.getCanExpand();
      const isExpanded = row.getIsExpanded();

      return (
        <div className="flex min-w-0 items-center gap-1 px-4">
          {enableHierarchy && depth > 0 && <HierarchyIndent depth={depth} />}
          {canExpand ? (
            <ExpandButton isExpanded={isExpanded} onClick={handleToggle} />
          ) : (
            <ExpandSpacer />
          )}
          <div className="min-w-0 flex-1 overflow-hidden break-words">{cellContent}</div>
        </div>
      );
    }

    return <div className="min-w-0 overflow-hidden px-4 break-words">{cellContent}</div>;
  }, [cell, enableHierarchy, enableNestedGrid, isFirstDataCell, row, handleToggle]);

  const cellContent = renderCellContent();

  const borderStyle = useMemo(
    () => getBorderStyle(isActuallySticky, isPinned, isFixedColumn),
    [isActuallySticky, isPinned, isFixedColumn]
  );

  const baseClasses = useMemo(
    () =>
      `text-md text-black ${borderStyle} ${cellClassName} border-b border-r border-gray-200 last:border-r-0 group-hover:border-gray-300`,
    [borderStyle, cellClassName]
  );

  if (isSelectColumn) {
    return (
      <td
        style={pinningStyles}
        className={`${baseClasses} bg-[var(--row-bg)] ${canSelect ? '' : 'pointer-events-none'}`}
        aria-hidden={canSelect ? undefined : true}
      >
        <div className="flex min-h-[2.75rem] items-center justify-center px-2 py-3">
          {cellContent}
        </div>
      </td>
    );
  }

  return (
    <td style={pinningStyles} className={baseClasses}>
      <div className="min-w-0 overflow-hidden py-3">{cellContent}</div>
    </td>
  );
}
