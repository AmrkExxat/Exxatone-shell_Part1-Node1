import { useCallback } from 'react';
import { Header } from '@tanstack/react-table';

export const useHeaderKeyboard = <TData>(
  header: Header<TData, any>,
  isSortable: boolean,
  allowResize: boolean,
  allowReorder: boolean,
  columnId: string,
  columnSize: number,
  minSize: number,
  maxSize: number,
  onColumnResize: (columnId: string, newSize: number) => void,
  resizeHandleWidth: number
) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableCellElement>) => {
      if (isSortable && (e.key === 'Enter' || e.key === ' ') && !e.shiftKey) {
        e.preventDefault();
        header.column.getToggleSortingHandler()?.(e);
      }

      if (allowResize && e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        e.stopPropagation();

        const currentSize = columnSize;
        const delta = e.key === 'ArrowRight' ? 10 : -10;
        const newSize = Math.max(minSize, Math.min(maxSize, currentSize + delta));

        onColumnResize(columnId, newSize);
      }
    },
    [isSortable, allowResize, header, columnId, columnSize, minSize, maxSize, onColumnResize]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLTableCellElement>) => {
      if (header.isPlaceholder) return;
      const th = e.currentTarget;
      const rect = th.getBoundingClientRect();
      const isResizeArea =
        allowResize && e.clientX >= rect.right - resizeHandleWidth && e.clientX <= rect.right;
      if (!isResizeArea && isSortable) {
        header.column.getToggleSortingHandler()?.(e);
      }
    },
    [header, allowResize, isSortable, resizeHandleWidth]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLTableCellElement>) => {
      if (header.isPlaceholder) return;
      const th = e.currentTarget;
      const rect = th.getBoundingClientRect();
      const isResizeArea =
        allowResize && e.clientX >= rect.right - resizeHandleWidth && e.clientX <= rect.right;

      th.style.cursor = isResizeArea
        ? 'col-resize'
        : allowReorder
          ? 'grab'
          : isSortable
            ? 'pointer'
            : '';
    },
    [header, allowResize, allowReorder, isSortable, resizeHandleWidth]
  );

  return { handleKeyDown, handleClick, handleMouseMove };
};
