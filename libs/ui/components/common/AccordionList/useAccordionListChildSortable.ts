import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { createAccordionChildDragData } from './accordionListDnd.utils';

export interface UseAccordionListChildSortableOptions {
  id: string;
  accordionId: string;
  itemId: string;
  disabled?: boolean;
}

export function useAccordionListChildSortable({
  id,
  accordionId,
  itemId,
  disabled = false,
}: UseAccordionListChildSortableOptions) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
    data: createAccordionChildDragData(accordionId, itemId),
  });

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    // Hide the source row while dragging; DragOverlay shows the floating preview.
    visibility: isDragging ? ('hidden' as const) : undefined,
  };

  return {
    attributes,
    listeners,
    setNodeRef,
    style,
    isDragging,
  };
}
