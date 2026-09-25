import { useCallback } from 'react';

export const useColumnResize = (
  allowResize: boolean,
  columnId: string,
  columnSize: number,
  minSize: number,
  maxSize: number,
  onColumnResize: (columnId: string, newSize: number) => void
) => {
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!allowResize) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth = columnSize;

      const onMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const delta = moveEvent.clientX - startX;
        const newSize = Math.round(Math.max(minSize, Math.min(maxSize, startWidth + delta)));
        onColumnResize(columnId, newSize);
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [allowResize, columnId, columnSize, minSize, maxSize, onColumnResize]
  );

  const handleResizeTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!allowResize) return;
      e.preventDefault();

      const startX = e.touches[0].clientX;
      const startWidth = columnSize;

      const onMove = (moveEvent: TouchEvent) => {
        moveEvent.preventDefault();
        const delta = moveEvent.touches[0].clientX - startX;
        const newSize = Math.round(Math.max(minSize, Math.min(maxSize, startWidth + delta)));
        onColumnResize(columnId, newSize);
      };

      const onEnd = () => {
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      };

      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    },
    [allowResize, columnId, columnSize, minSize, maxSize, onColumnResize]
  );

  return { handleResizeMouseDown, handleResizeTouchStart };
};
