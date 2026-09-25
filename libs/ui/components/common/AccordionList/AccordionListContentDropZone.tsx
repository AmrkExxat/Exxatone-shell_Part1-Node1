import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, SortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { UniqueIdentifier } from '@dnd-kit/core';

import { createAccordionDropData, getAccordionDropZoneId } from './accordionListDnd.utils';
import { useAccordionListChildDragContext } from './AccordionListChildDragContext';

export interface AccordionListContentDropZoneProps {
  accordionId: string;
  children: React.ReactNode;
  /** When provided, children are wrapped in SortableContext automatically. */
  sortableIds?: UniqueIdentifier[];
  sortableStrategy?: SortingStrategy;
  className?: string;
  activeClassName?: string;
  itemGapClassName?: string;
}

const DEFAULT_PLACEHOLDER_HEIGHT = 40;

export default function AccordionListContentDropZone({
  accordionId,
  children,
  sortableIds,
  sortableStrategy = verticalListSortingStrategy,
  className,
  itemGapClassName = 'gap-4',
  activeClassName = 'outline-dashed outline-1 outline-black/20 outline-offset-7 rounded-md bg-primary/5',
}: AccordionListContentDropZoneProps): React.JSX.Element {
  const { setNodeRef, isOver } = useDroppable({
    id: getAccordionDropZoneId(accordionId),
    data: createAccordionDropData(accordionId),
  });
  const { activeHeight, dropIndicator } = useAccordionListChildDragContext();

  const contentWithPlaceholder = useMemo(() => {
    const childNodes = React.Children.toArray(children);
    const showPlaceholder = dropIndicator != null && dropIndicator.accordionId === accordionId;

    if (!showPlaceholder) {
      return childNodes;
    }

    const insertIndex = Math.max(0, Math.min(dropIndicator.insertIndex, childNodes.length));
    const height = activeHeight ?? DEFAULT_PLACEHOLDER_HEIGHT;
    const placeholder = (
      <div
        key="accordion-list-drop-placeholder"
        aria-hidden
        className="accordion-list-drop-placeholder border-primary/50 bg-primary/5 pointer-events-none box-border rounded border-2 border-dashed"
        style={{ minHeight: height }}
        data-accordion-drop-placeholder={accordionId}
      />
    );

    return [...childNodes.slice(0, insertIndex), placeholder, ...childNodes.slice(insertIndex)];
  }, [accordionId, activeHeight, children, dropIndicator]);

  const content =
    sortableIds != null ? (
      <SortableContext items={sortableIds} strategy={sortableStrategy}>
        {contentWithPlaceholder}
      </SortableContext>
    ) : (
      contentWithPlaceholder
    );

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        'accordion-list-content-drop-zone flex min-h-[48px] flex-col py-2',
        itemGapClassName,
        className,
        {
          [activeClassName]: isOver || dropIndicator?.accordionId === accordionId,
        }
      )}
      data-accordion-drop-zone={accordionId}
    >
      {content}
    </div>
  );
}
