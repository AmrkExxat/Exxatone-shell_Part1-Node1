import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import DragHandle from './DragHandle';
import { DragIconPosition } from './AccordionList.types';
import { createAccordionDragData } from './accordionListDnd.utils';

interface SortableAccordionItemProps {
  id: string;
  accordionId: string;
  disabled?: boolean;
  dragIconPosition?: DragIconPosition;
  renderControls?: (dragHandle: React.ReactNode) => React.ReactNode;
  children: (headerPrefix: React.ReactNode) => React.ReactNode;
}

export default function SortableAccordionItem({
  id,
  accordionId,
  disabled = false,
  dragIconPosition = 'outside',
  renderControls,
  children,
}: SortableAccordionItemProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
    data: createAccordionDragData(accordionId),
  });

  const style: React.CSSProperties = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    // Hide the source row while dragging; DragOverlay shows the floating preview.
    visibility: isDragging ? ('hidden' as const) : undefined,
    alignSelf: 'flex-start',
    width: '100%',
    flexShrink: 0,
  };

  const dragHandle = (
    <DragHandle
      disabled={disabled}
      attributes={attributes}
      listeners={listeners}
      variant={dragIconPosition === 'inside' ? 'inline' : 'button'}
      className={dragIconPosition === 'outside' ? '' : undefined}
    />
  );

  const controls = renderControls?.(dragHandle);

  if (dragIconPosition === 'inside') {
    return (
      <div ref={setNodeRef} style={style} role="listitem" data-sortable-id={id}>
        {children(controls ?? dragHandle)}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="listitem"
      data-sortable-id={id}
      className="flex items-start gap-2"
    >
      {controls}
      <div className="min-w-0 flex-1">{children(null)}</div>
    </div>
  );
}
