import { useCallback } from 'react';

export const useDragAndDrop = (
  allowReorder: boolean,
  columnId: string,
  onColumnReorder: (draggedId: string, targetId: string) => void
) => {
  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (!allowReorder) return;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', columnId);

      const th = event.currentTarget as HTMLElement;
      const dragImage = th.cloneNode(true) as HTMLElement;
      Object.assign(dragImage.style, {
        width: `${th.offsetWidth}px`,
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        opacity: '0.8',
        backgroundColor: '#e8eaf6',
      });
      document.body.appendChild(dragImage);
      event.dataTransfer.setDragImage(dragImage, th.offsetWidth / 2, th.offsetHeight / 2);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    },
    [allowReorder, columnId]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      if (allowReorder) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }
    },
    [allowReorder]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      if (allowReorder) {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData('text/plain');
        if (draggedId && draggedId !== columnId) {
          onColumnReorder(draggedId, columnId);
        }
      }
    },
    [allowReorder, columnId, onColumnReorder]
  );

  return { handleDragStart, handleDragOver, handleDrop };
};
