import { createAccordionChildSortableId } from './accordionListDnd.utils';
import { useAccordionListChildSortable } from './useAccordionListChildSortable';

export interface UseDraggableItemOptions {
  accordionId: string;
  itemId: string;
  disabled?: boolean;
}

export function useDraggableItem({
  accordionId,
  itemId,
  disabled = false,
}: UseDraggableItemOptions) {
  const sortableId = createAccordionChildSortableId(accordionId, itemId);
  const { attributes, listeners, setNodeRef, style, isDragging } = useAccordionListChildSortable({
    id: sortableId,
    accordionId,
    itemId,
    disabled,
  });

  return {
    sortableId,
    setNodeRef,
    style,
    isDragging,
    attributes,
    listeners,
    dragHandleProps: {
      ...attributes,
      ...(disabled ? {} : listeners),
    },
  };
}
