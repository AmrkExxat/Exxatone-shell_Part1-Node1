'use client';

import React, { memo, useMemo } from 'react';
import { Header } from '@tanstack/react-table';
import { TableHeaderCell } from './TableHeaderCell';

interface DraggableTableHeaderProps<TData> {
  header: Header<TData, unknown>;
  canSort: boolean;
  canReorder: boolean;
  canResize: boolean;
  onColumnReorder: (draggedId: string, targetId: string) => void;
}

export const DraggableTableHeader = memo(
  function DraggableTableHeader<TData>({
    header,
    canSort,
    canReorder,
    canResize,
    onColumnReorder,
  }: DraggableTableHeaderProps<TData>) {
    const isPinned = header.column.getIsPinned();
    const leftPos = isPinned === 'left' ? header.column.getStart('left') : undefined;
    const rightPos = isPinned === 'right' ? header.column.getAfter('right') : undefined;

    const pinningStyles = useMemo(() => {
      if (!isPinned) {
        return {
          position: 'sticky' as const,
          top: 0,
          zIndex: 20,
          backgroundColor: '#f9fafb',
        };
      }

      return {
        position: 'sticky' as const,
        left: isPinned === 'left' && leftPos != null ? `${leftPos}px` : undefined,
        right: isPinned === 'right' && rightPos != null ? `${rightPos}px` : undefined,
        top: 0,
        zIndex: 30,
        backgroundColor: '#f9fafb',
      };
    }, [isPinned, leftPos, rightPos]);

    const handleDragOver = (event: React.DragEvent) => {
      if (canReorder) {
        event.preventDefault();
      }
    };

    const handleDrop = (event: React.DragEvent) => {
      if (canReorder) {
        const draggedId = event.dataTransfer.getData('text/plain');
        onColumnReorder(draggedId, header.column.id);
      }
    };

    return (
      <th
        colSpan={header.colSpan}
        style={{
          width: header.getSize(),
          minWidth: header.getSize(),
          ...pinningStyles,
        }}
        className="relative border-b border-zinc-200"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {header.isPlaceholder ? null : (
          <TableHeaderCell
            header={header}
            canSort={canSort}
            canReorder={canReorder}
            canResize={canResize}
            onColumnReorder={onColumnReorder}
          />
        )}
      </th>
    );
  },
  (prev, next) => {
    if (next.header.column.id === '__select') {
      return false;
    }

    const prevPinned = prev.header.column.getIsPinned();
    const nextPinned = next.header.column.getIsPinned();
    const prevLeftPos = prevPinned === 'left' ? prev.header.column.getStart('left') : undefined;
    const nextLeftPos = nextPinned === 'left' ? next.header.column.getStart('left') : undefined;
    const prevRightPos = prevPinned === 'right' ? prev.header.column.getAfter('right') : undefined;
    const nextRightPos = nextPinned === 'right' ? next.header.column.getAfter('right') : undefined;

    return (
      prev.header.id === next.header.id &&
      prev.header.column.getIsSorted() === next.header.column.getIsSorted() &&
      prev.header.column.getSize() === next.header.column.getSize() &&
      prev.header.column.getIsResizing() === next.header.column.getIsResizing() &&
      prevPinned === nextPinned &&
      prevLeftPos === nextLeftPos &&
      prevRightPos === nextRightPos &&
      prev.canSort === next.canSort &&
      prev.canReorder === next.canReorder &&
      prev.canResize === next.canResize
    );
  }
) as <TData>(props: DraggableTableHeaderProps<TData>) => React.ReactElement;
