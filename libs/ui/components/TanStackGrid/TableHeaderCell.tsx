'use client';

import React, { useMemo } from 'react';
import { Header, flexRender } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faSort, faSortUp, faSortDown } from '@fortawesome/pro-solid-svg-icons';
import { getBorderStyle } from './utils/tableUtils';
import { useColumnResize } from './utils/useColumnResize';
import { useDragAndDrop } from './utils/useDragAndDrop';
import { useHeaderKeyboard } from './utils/useHeaderKeyboard';

interface TableHeaderCellProps<TData> {
  header: Header<TData, any>;
  canSort: boolean;
  canReorder: boolean;
  canResize: boolean;
  isFixedColumn: boolean;
  pinningStyles: any;
  onColumnReorder: (draggedId: string, targetId: string) => void;
  onColumnResize: (columnId: string, newSize: number) => void;
  headerClassName?: string;
}

const RESIZE_HANDLE_WIDTH = 8;

export function TableHeaderCell<TData>({
  header,
  canSort,
  canReorder,
  canResize,
  isFixedColumn,
  pinningStyles,
  onColumnReorder,
  onColumnResize,
  headerClassName = '',
}: TableHeaderCellProps<TData>) {
  const columnId = header.column.id;
  const columnSize = header.column.getSize();
  const minSize = header.column.columnDef.minSize ?? 100;
  const maxSize = header.column.columnDef.maxSize ?? 500;

  const isPinned = header.column.getIsPinned();
  const isSortable = canSort && header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();
  const isSpecialColumn = columnId === '__select';

  const allowReorder = canReorder && !isSpecialColumn && !isPinned;
  const allowResize = canResize && !isSpecialColumn;

  const borderStyle = useMemo(() => {
    const isActuallySticky = pinningStyles.position === 'sticky';
    return getBorderStyle(isActuallySticky, isPinned, isFixedColumn);
  }, [pinningStyles, isPinned, isFixedColumn]);

  const { handleResizeMouseDown, handleResizeTouchStart } = useColumnResize(
    allowResize,
    columnId,
    columnSize,
    minSize,
    maxSize,
    onColumnResize
  );

  const { handleDragStart, handleDragOver, handleDrop } = useDragAndDrop(
    allowReorder,
    columnId,
    onColumnReorder
  );

  const { handleKeyDown, handleClick, handleMouseMove } = useHeaderKeyboard(
    header,
    isSortable,
    allowResize,
    allowReorder,
    columnId,
    columnSize,
    minSize,
    maxSize,
    onColumnResize,
    RESIZE_HANDLE_WIDTH
  );

  const sortIcon = useMemo(() => {
    if (!isSortable) return null;
    return (
      <span
        className="flex flex-shrink-0 cursor-pointer items-center justify-center"
        aria-hidden="true"
      >
        <FontAwesomeIcon
          icon={sortDirection === 'asc' ? faSortUp : sortDirection === 'desc' ? faSortDown : faSort}
          className="h-3 w-3 text-gray-600"
        />
      </span>
    );
  }, [isSortable, sortDirection]);

  const reorderIcon = useMemo(() => {
    if (!allowReorder) return null;
    return (
      <span
        className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={faGripVertical} className="h-2.5 w-2.5 text-gray-500" />
      </span>
    );
  }, [allowReorder]);

  const headerContent = useMemo(
    () => flexRender(header.column.columnDef.header, header.getContext()),
    [header]
  );

  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      data-column-id={columnId}
      draggable={allowReorder && !header.isPlaceholder}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      tabIndex={isSortable || allowResize ? 0 : -1}
      role="columnheader"
      aria-sort={
        sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none'
      }
      aria-label={
        allowResize
          ? `${headerContent} column. ${isSortable ? 'Press Enter to sort. ' : ''}${allowResize ? 'Press Shift + Left/Right arrow to resize.' : ''}`
          : undefined
      }
      style={{
        width: columnSize,
        minWidth: columnSize,
        position: 'relative',
        ...pinningStyles,
      }}
      className={`${columnId === '__select' ? 'px-2' : 'px-4'} border-r border-b border-gray-300 py-3 text-left text-sm tracking-wider text-black uppercase last:border-r-0 ${borderStyle} ${isSortable || allowReorder ? 'focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset' : ''} group ${headerClassName}`}
    >
      {header.isPlaceholder ? null : (
        <div
          className={`flex w-full min-w-0 items-center gap-2 overflow-hidden ${isSpecialColumn ? 'justify-center' : ''}`}
        >
          <span
            className={`min-w-0 font-medium text-black ${isSpecialColumn ? '' : 'flex-1 truncate'}`}
          >
            {headerContent}
          </span>
          {sortIcon}
          {reorderIcon}
        </div>
      )}

      {allowResize && !header.isPlaceholder && (
        <>
          <div
            onMouseDown={handleResizeMouseDown}
            onTouchStart={handleResizeTouchStart}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-0 bottom-0 cursor-col-resize"
            aria-hidden="true"
            style={{
              touchAction: 'none',
              right: 0,
              width: RESIZE_HANDLE_WIDTH,
              zIndex: 10,
            }}
          />
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-indigo-400 opacity-0 transition-opacity group-hover:opacity-40"
            aria-hidden="true"
            style={{ right: 0 }}
          />
        </>
      )}
    </th>
  );
}
