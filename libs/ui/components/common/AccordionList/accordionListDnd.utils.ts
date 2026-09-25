import {
  Active,
  Collision,
  DragEndEvent,
  DroppableContainer,
  Over,
  pointerWithin,
  closestCenter,
  CollisionDetection,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { isEqual } from 'lodash';

export const ACCORDION_LIST_DRAG_TYPES = {
  ACCORDION: 'accordion',
  CHILD: 'child',
  ACCORDION_DROP: 'accordion-drop',
} as const;

export interface AccordionListAccordionDragData {
  type: typeof ACCORDION_LIST_DRAG_TYPES.ACCORDION;
  accordionId: string;
}

export interface AccordionListChildDragData {
  type: typeof ACCORDION_LIST_DRAG_TYPES.CHILD;
  accordionId: string;
  itemId: string;
}

export interface AccordionListChildDragOverlayData extends AccordionListChildDragData {
  width?: number;
  item?: AccordionListDragChildItem;
}

export interface AccordionListAccordionDragOverlayData {
  accordionId: string;
  index: number;
  width?: number;
}

export interface AccordionListAccordionDropData {
  type: typeof ACCORDION_LIST_DRAG_TYPES.ACCORDION_DROP;
  accordionId: string;
}

export type AccordionListDragData =
  AccordionListAccordionDragData | AccordionListChildDragData | AccordionListAccordionDropData;

export interface AccordionListDragChildItem {
  id: string;
  label: string;
  [key: string]: unknown;
}

export type ChildItemsByAccordion = Record<string, AccordionListDragChildItem[]>;

export const getAccordionDropZoneId = (accordionId: string) => `accordion-drop-${accordionId}`;

/** Item ids must be unique across all accordions in a list. */
export const createAccordionChildSortableId = (_accordionId: string, itemId: string) => itemId;

export const createAccordionDragData = (accordionId: string): AccordionListAccordionDragData => ({
  type: ACCORDION_LIST_DRAG_TYPES.ACCORDION,
  accordionId,
});

export const createAccordionChildDragData = (
  accordionId: string,
  itemId: string
): AccordionListChildDragData => ({
  type: ACCORDION_LIST_DRAG_TYPES.CHILD,
  accordionId,
  itemId,
});

export const createAccordionDropData = (accordionId: string): AccordionListAccordionDropData => ({
  type: ACCORDION_LIST_DRAG_TYPES.ACCORDION_DROP,
  accordionId,
});

const getDragData = (entity: Active | Over | DroppableContainer | null | undefined) =>
  entity?.data?.current as AccordionListDragData | undefined;

const getCollisionDragData = (collision: Collision) => {
  const collisionData = collision.data as { droppableContainer?: DroppableContainer } | undefined;

  return collisionData?.droppableContainer?.data?.current as AccordionListDragData | undefined;
};

export const isAccordionDrag = (active: Active | null | undefined) =>
  getDragData(active)?.type === ACCORDION_LIST_DRAG_TYPES.ACCORDION;

export const isChildDrag = (active: Active | null | undefined) =>
  getDragData(active)?.type === ACCORDION_LIST_DRAG_TYPES.CHILD;

const isAccordionDropTarget = (over: Over | null | undefined) => {
  const type = getDragData(over)?.type;

  return (
    type === ACCORDION_LIST_DRAG_TYPES.ACCORDION_DROP ||
    type === ACCORDION_LIST_DRAG_TYPES.ACCORDION
  );
};

export const getAccordionDropTargetId = (over: Over | null | undefined) => {
  const data = getDragData(over);

  if (
    data?.type === ACCORDION_LIST_DRAG_TYPES.ACCORDION_DROP ||
    data?.type === ACCORDION_LIST_DRAG_TYPES.ACCORDION
  ) {
    return data.accordionId;
  }

  if (data?.type === ACCORDION_LIST_DRAG_TYPES.CHILD) {
    return data.accordionId;
  }

  return undefined;
};

const getDragType = (entity: Active | Over | DroppableContainer | null | undefined) =>
  getDragData(entity)?.type;

export const accordionListCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);

  if (isChildDrag(args.active)) {
    const activeId = String(args.active.id);
    const activeData = args.active.data?.current as AccordionListChildDragData | undefined;
    const sourceAccordionId = activeData?.accordionId;

    const childCollisions = pointerCollisions.filter((collision) => {
      const type = getCollisionDragData(collision)?.type;

      return type === ACCORDION_LIST_DRAG_TYPES.CHILD && String(collision.id) !== activeId;
    });

    if (childCollisions.length > 0) {
      const crossAccordionChild = childCollisions.find((collision) => {
        const data = getCollisionDragData(collision);

        return (
          data?.type === ACCORDION_LIST_DRAG_TYPES.CHILD && data.accordionId !== sourceAccordionId
        );
      });

      if (crossAccordionChild) {
        return [crossAccordionChild];
      }

      return [childCollisions[0]];
    }

    const dropCollision = pointerCollisions.find(
      (collision) =>
        getCollisionDragData(collision)?.type === ACCORDION_LIST_DRAG_TYPES.ACCORDION_DROP
    );

    if (dropCollision) {
      return [dropCollision];
    }

    const accordionCollision = pointerCollisions.find((collision) => {
      const data = getCollisionDragData(collision);

      return (
        data?.type === ACCORDION_LIST_DRAG_TYPES.ACCORDION && data.accordionId !== sourceAccordionId
      );
    });

    if (accordionCollision) {
      return [accordionCollision];
    }

    return closestCenter(args);
  }

  const childCollision = pointerCollisions.find(
    (collision) => getCollisionDragData(collision)?.type === ACCORDION_LIST_DRAG_TYPES.CHILD
  );

  if (childCollision) {
    return [childCollision];
  }

  const dropCollision = pointerCollisions.find(
    (collision) =>
      getCollisionDragData(collision)?.type === ACCORDION_LIST_DRAG_TYPES.ACCORDION_DROP
  );

  if (dropCollision) {
    return [dropCollision];
  }

  const accordionContainers = args.droppableContainers.filter(
    (container) => getDragType(container) === ACCORDION_LIST_DRAG_TYPES.ACCORDION
  );

  if (accordionContainers.length > 0) {
    const accordionCollisions = closestCenter({
      ...args,
      droppableContainers: accordionContainers,
    });

    if (accordionCollisions.length > 0) {
      return [accordionCollisions[0]];
    }
  }

  return closestCenter(args);
};

export const getChildDropInsertionIndex = (
  event: { active: Active; over: Over | null },
  items: AccordionListDragChildItem[]
) => {
  const { active, over } = event;

  if (!over) {
    return items.length;
  }

  const translated = active.rect?.current?.translated;
  const overRect = over.rect;
  const activeCenterY = translated != null ? translated.top + translated.height / 2 : undefined;

  // Pointer is in drop-zone padding/gaps (not over a child). Map Y → index so
  // top padding = start and bottom padding = end (previously always appended).
  if (isAccordionDropTarget(over)) {
    if (items.length === 0) {
      return 0;
    }

    if (activeCenterY != null && overRect) {
      const ratio = (activeCenterY - overRect.top) / Math.max(overRect.height, 1);
      const clamped = Math.max(0, Math.min(1, ratio));

      return Math.round(clamped * items.length);
    }

    return items.length;
  }

  const overData = getDragData(over);
  const overItemId =
    overData?.type === ACCORDION_LIST_DRAG_TYPES.CHILD ? overData.itemId : String(over.id);
  const overItemIndex = items.findIndex((item) => item.id === overItemId);

  if (overItemIndex === -1) {
    return items.length;
  }

  if (activeCenterY != null && overRect) {
    const isFirst = overItemIndex === 0;
    const isLast = overItemIndex === items.length - 1;

    // Widen first/last hit areas so edge drops need less precision.
    if (isFirst && isLast) {
      const insertAfter = activeCenterY > overRect.top + overRect.height / 2;

      return insertAfter ? 1 : 0;
    }

    if (isFirst) {
      // Top ~65% of the first row → insert at start
      const insertAfter = activeCenterY > overRect.top + overRect.height * 0.65;

      return insertAfter ? 1 : 0;
    }

    if (isLast) {
      // Bottom ~65% of the last row → insert at end
      const insertAfter = activeCenterY > overRect.top + overRect.height * 0.35;

      return insertAfter ? items.length : overItemIndex;
    }

    const insertAfter = activeCenterY > overRect.top + overRect.height / 2;

    return insertAfter ? overItemIndex + 1 : overItemIndex;
  }

  return overItemIndex;
};

const findChildItem = (items: AccordionListDragChildItem[], itemId: string) =>
  items.find((item) => item.id === itemId);

const moveChildItemBetweenLists = (
  sourceItems: AccordionListDragChildItem[],
  targetItems: AccordionListDragChildItem[],
  itemId: string,
  insertIndex: number
) => {
  const draggedItem = findChildItem(sourceItems, itemId) ?? findChildItem(targetItems, itemId);

  if (!draggedItem) {
    return { nextSource: sourceItems, nextTarget: targetItems };
  }

  const nextSource = sourceItems.filter((item) => item.id !== itemId);
  const nextTarget = targetItems.filter((item) => item.id !== itemId);
  const clampedIndex = Math.max(0, Math.min(insertIndex, nextTarget.length));
  const targetIndex = targetItems.findIndex((item) => item.id === itemId);

  if (!sourceItems.some((item) => item.id === itemId) && targetIndex === clampedIndex) {
    return { nextSource: sourceItems, nextTarget: targetItems };
  }

  nextTarget.splice(clampedIndex, 0, draggedItem);

  return { nextSource, nextTarget };
};

export const applyChildDragAtIndex = (
  childItemsByAccordion: ChildItemsByAccordion,
  sourceAccordionId: string,
  targetAccordionId: string,
  itemId: string,
  insertIndex: number
): ChildItemsByAccordion | null => {
  if (!itemId || targetAccordionId === sourceAccordionId) {
    return null;
  }

  const sourceItems = childItemsByAccordion[sourceAccordionId] ?? [];
  const targetItems = childItemsByAccordion[targetAccordionId] ?? [];
  const { nextSource, nextTarget } = moveChildItemBetweenLists(
    sourceItems,
    targetItems,
    itemId,
    insertIndex
  );

  const nextChildItemsByAccordion = {
    ...childItemsByAccordion,
    [sourceAccordionId]: nextSource,
    [targetAccordionId]: nextTarget,
  };

  return isEqual(nextChildItemsByAccordion, childItemsByAccordion)
    ? null
    : nextChildItemsByAccordion;
};

export const applyChildDrag = (
  event: { active: Active; over: Over | null },
  childItemsByAccordion: ChildItemsByAccordion
): ChildItemsByAccordion | null => {
  if (!isChildDrag(event.active) || !event.over) {
    return null;
  }

  const activeData = event.active.data?.current as AccordionListChildDragData | undefined;

  if (!activeData?.itemId) {
    return null;
  }

  const { itemId, accordionId: sourceAccordionId } = activeData;
  const targetAccordionId = getAccordionDropTargetId(event.over);

  if (!targetAccordionId || targetAccordionId === sourceAccordionId) {
    return null;
  }

  const targetItems = childItemsByAccordion[targetAccordionId] ?? [];
  const insertIndex = getChildDropInsertionIndex(event, targetItems);

  return applyChildDragAtIndex(
    childItemsByAccordion,
    sourceAccordionId,
    targetAccordionId,
    itemId,
    insertIndex
  );
};

export const applySameAccordionChildDragEnd = (
  event: DragEndEvent,
  childItemsByAccordion: ChildItemsByAccordion
): ChildItemsByAccordion | null => {
  const { active, over } = event;

  if (!isChildDrag(active) || !over) {
    return null;
  }

  const activeData = active.data?.current as AccordionListChildDragData | undefined;

  if (!activeData?.itemId) {
    return null;
  }

  const { accordionId, itemId } = activeData;
  const items = childItemsByAccordion[accordionId];

  if (!items?.length) {
    return null;
  }

  const activeIndex = items.findIndex((item) => item.id === itemId);

  if (activeIndex === -1) {
    return null;
  }

  const overData = getDragData(over);
  let overIndex = activeIndex;

  if (overData?.type === ACCORDION_LIST_DRAG_TYPES.CHILD) {
    if (overData.accordionId !== accordionId) {
      return null;
    }

    overIndex = items.findIndex((item) => item.id === overData.itemId);
  } else if (isAccordionDropTarget(over)) {
    if (getAccordionDropTargetId(over) !== accordionId) {
      return null;
    }

    overIndex = items.length - 1;
  } else {
    return null;
  }

  if (overIndex === -1) {
    overIndex = items.length - 1;
  }

  if (activeIndex === overIndex) {
    return null;
  }

  return {
    ...childItemsByAccordion,
    [accordionId]: arrayMove(items, activeIndex, overIndex),
  };
};
