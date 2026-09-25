import { AccordionTypes, OnToggleType } from '../Accordion/Accordion.types';
import { DragCancelEvent, DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core';
import type { AccordionListChildDragOverlayData } from './accordionListDnd.utils';

export interface AccordionListChildItem {
  id: string;
  label: string;
  [key: string]: unknown;
}

export interface AccordionListChildrenRenderContext {
  accordionId: string;
  index: number;
}

export type AccordionListChildren =
  | React.ReactNode
  | ((accordion: AccordionItem, context: AccordionListChildrenRenderContext) => React.ReactNode);

export interface AccordionItem {
  header: React.ReactNode;
  /**
   * Accordion body content. Use a render function to read live `childItems` from the accordion argument.
   */
  children?: AccordionListChildren;
  /**
   * Draggable child item state. Each item must have a unique `id` across the whole list.
   * Use with `children` and `onChildItemsChange` — AccordionList does not auto-render rows.
   */
  childItems?: AccordionListChildItem[];
  /** Plain-text title shown in place of header content while dragging (when collapseOnDrag is enabled). */
  title?: string;
  id?: string;
  disabled?: boolean;
  expanded?: boolean;
  contentClass?: string;
  accordionWrapperClass?: string;
}

export interface AccordionListOnToggleType extends OnToggleType {
  index: number;
  data: Partial<AccordionItem>;
}

export type DragIconPosition = 'inside' | 'outside';

export type ReorderButtonPosition = 'beside-handle' | 'around-handle' | 'stacked-handle';

export type AccordionListProps = Omit<AccordionTypes, 'header' | 'children'> & {
  accordions: AccordionItem[];
  listClassName?: string;
  listWrapperClass?: string;
  htmlAlsoNeededOnReturn?: boolean;
  draggable?: boolean;
  dragIconPosition?: DragIconPosition;
  showReorderButtons?: boolean;
  reorderButtonPosition?: ReorderButtonPosition;
  onReorder?: (accordions: AccordionItem[]) => void;
  onToggle?: (emitData: AccordionListOnToggleType) => void;
  isHeaderButton?: boolean;
  preventHeaderToggleOnInteractiveClick?: boolean;
  /**
   * When true, all accordions collapse and show only `title` in the header during accordion drag.
   * Previously expanded sections are restored when the drag ends. Does not apply to child drags.
   */
  collapseOnDrag?: boolean;
  /** Called when any drag starts inside the shared AccordionList DndContext. */
  onDragStart?: (event: DragStartEvent) => void;
  /** Called when any drag move happens inside the shared AccordionList DndContext. */
  onDragMove?: (event: DragMoveEvent) => void;
  /** Called when any drag ends inside the shared AccordionList DndContext. */
  onDragEnd?: (event: DragEndEvent) => void;
  /** Called when any drag is cancelled inside the shared AccordionList DndContext. */
  onDragCancel?: (event: DragCancelEvent) => void;
  /**
   * Called when a child drag completes with the updated accordion list.
   * Provide `childItems` on each accordion to enable child drag reordering.
   */
  onChildItemsChange?: (accordions: AccordionItem[]) => void;
  /** Renders the floating preview shown while dragging child items between accordions. */
  renderChildDragOverlay?: (data: AccordionListChildDragOverlayData) => React.ReactNode;
  /** z-index for drag overlays. Defaults to 1000. */
  childDragOverlayZIndex?: number;
};

export type AccordionMoveDirection = 'up' | 'down';

export interface AccordionListRef {
  moveItem: (accordionId: string, direction: AccordionMoveDirection) => void;
  moveChildItem: (accordionId: string, itemId: string, direction: AccordionMoveDirection) => void;
}
