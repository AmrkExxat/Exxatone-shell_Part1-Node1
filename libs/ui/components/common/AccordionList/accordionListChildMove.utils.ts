import { arrayMove } from '@dnd-kit/sortable';

import type { AccordionItem, AccordionMoveDirection } from './AccordionList.types';

export const resolveAccordionListItemId = (
  accordion: AccordionItem,
  index: number,
  listId?: string
): string => accordion.id ?? `${listId ?? 'accordion'}-${index}`;

export const moveChildItemInAccordions = (
  accordions: AccordionItem[],
  accordionId: string,
  itemId: string,
  direction: AccordionMoveDirection,
  listId?: string
): AccordionItem[] => {
  const accordionIndex = accordions.findIndex(
    (accordion, index) => resolveAccordionListItemId(accordion, index, listId) === accordionId
  );

  if (accordionIndex === -1) {
    return accordions;
  }

  const sourceAccordion = accordions[accordionIndex];
  const sourceItems = sourceAccordion.childItems ?? [];
  const itemIndex = sourceItems.findIndex((child) => child.id === itemId);

  if (itemIndex === -1) {
    return accordions;
  }

  const item = sourceItems[itemIndex];

  if (direction === 'up' && itemIndex > 0) {
    return accordions.map((accordion, index) =>
      index === accordionIndex
        ? { ...accordion, childItems: arrayMove(sourceItems, itemIndex, itemIndex - 1) }
        : accordion
    );
  }

  if (direction === 'down' && itemIndex < sourceItems.length - 1) {
    return accordions.map((accordion, index) =>
      index === accordionIndex
        ? { ...accordion, childItems: arrayMove(sourceItems, itemIndex, itemIndex + 1) }
        : accordion
    );
  }

  if (direction === 'up' && itemIndex === 0 && accordionIndex > 0) {
    const targetIndex = accordionIndex - 1;
    const targetItems = [...(accordions[targetIndex].childItems ?? []), item];
    const nextSourceItems = sourceItems.filter((child) => child.id !== itemId);

    return accordions.map((accordion, index) => {
      if (index === accordionIndex) {
        return { ...accordion, childItems: nextSourceItems };
      }

      if (index === targetIndex) {
        return { ...accordion, childItems: targetItems };
      }

      return accordion;
    });
  }

  if (
    direction === 'down' &&
    itemIndex === sourceItems.length - 1 &&
    accordionIndex < accordions.length - 1
  ) {
    const targetIndex = accordionIndex + 1;
    const targetItems = [item, ...(accordions[targetIndex].childItems ?? [])];
    const nextSourceItems = sourceItems.filter((child) => child.id !== itemId);

    return accordions.map((accordion, index) => {
      if (index === accordionIndex) {
        return { ...accordion, childItems: nextSourceItems };
      }

      if (index === targetIndex) {
        return { ...accordion, childItems: targetItems };
      }

      return accordion;
    });
  }

  return accordions;
};

export const canMoveChildItem = (
  accordions: AccordionItem[],
  accordionId: string,
  itemId: string,
  direction: AccordionMoveDirection,
  listId?: string
): boolean => {
  const accordionIndex = accordions.findIndex(
    (accordion, index) => resolveAccordionListItemId(accordion, index, listId) === accordionId
  );

  if (accordionIndex === -1) {
    return false;
  }

  const sourceItems = accordions[accordionIndex].childItems ?? [];
  const itemIndex = sourceItems.findIndex((child) => child.id === itemId);

  if (itemIndex === -1) {
    return false;
  }

  if (direction === 'up') {
    return accordionIndex > 0 || itemIndex > 0;
  }

  return accordionIndex < accordions.length - 1 || itemIndex < sourceItems.length - 1;
};

export const CHILD_MOVE_CONTROL_SELECTOR = '[data-accordion-list-child-move-control]';

export const getChildMoveControlProps = (
  accordionId: string,
  itemId: string,
  direction: AccordionMoveDirection
) => ({
  'data-accordion-list-child-move-control': true,
  'data-accordion-list-child-id': itemId,
  'data-accordion-list-accordion-id': accordionId,
  'data-accordion-list-move-direction': direction,
});

export const focusChildMoveControl = (itemId: string, direction: AccordionMoveDirection) => {
  const escapedItemId =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(itemId)
      : itemId.replace(/"/g, '\\"');
  const selector = `${CHILD_MOVE_CONTROL_SELECTOR}[data-accordion-list-child-id="${escapedItemId}"][data-accordion-list-move-direction="${direction}"]`;

  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>(selector)?.focus();
  });
};
