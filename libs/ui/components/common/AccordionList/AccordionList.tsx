import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { cloneDeep, isEqual } from 'lodash';
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import Accordion from '../Accordion/Accordion';
import { OnToggleType } from '../Accordion/Accordion.types';
import {
  isAccordionDrag,
  isChildDrag,
  accordionListCollisionDetection,
  applyChildDrag,
  applyChildDragAtIndex,
  applySameAccordionChildDragEnd,
  getAccordionDropTargetId,
  getChildDropInsertionIndex,
} from './accordionListDnd.utils';
import type {
  AccordionListAccordionDragOverlayData,
  AccordionListChildDragData,
  AccordionListChildDragOverlayData,
  ChildItemsByAccordion,
} from './accordionListDnd.utils';
import AccordionListAccordionDragOverlay from './AccordionListAccordionDragOverlay';
import AccordionListChildDragOverlay from './AccordionListChildDragOverlay';
import {
  AccordionListChildDragProvider,
  AccordionListChildDropIndicator,
} from './AccordionListChildDragContext';
import { AccordionListChildActionsProvider } from './AccordionListChildActionsContext';
import {
  canMoveChildItem,
  focusChildMoveControl,
  moveChildItemInAccordions,
} from './accordionListChildMove.utils';
import AccordionListControls from './AccordionListControls';
import DragHandle from './DragHandle';
import SortableAccordionItem from './SortableAccordionItem';
import {
  AccordionItem,
  AccordionListChildItem,
  AccordionListProps,
  AccordionListRef,
  AccordionMoveDirection,
} from './AccordionList.types';

const getAccordionId = (accordion: AccordionItem, index: number, listId?: string): string =>
  accordion.id ?? `${listId ?? 'accordion'}-${index}`;

interface DragState {
  isActive: boolean;
  expandedById: Record<string, boolean>;
}

interface ActiveAccordionDragState {
  data: AccordionListAccordionDragOverlayData;
}

interface ActiveChildDragState {
  data: AccordionListChildDragData;
  item: AccordionListChildItem;
  width?: number;
  height?: number;
}

const findChildItemById = (accordions: AccordionItem[], itemId: string) =>
  accordions.flatMap((accordion) => accordion.childItems ?? []).find((item) => item.id === itemId);

const getIsExpanded = (accordionId: string, accordion: AccordionItem, defaultExpanded: boolean) => {
  const headerElement = document.getElementById(accordionId);

  if (headerElement) {
    return headerElement.getAttribute('aria-expanded') === 'true';
  }

  return accordion.expanded ?? defaultExpanded;
};

const getAccordionTitle = (accordion: AccordionItem, index: number, accordionId: string) =>
  accordion.title ?? accordionId ?? `Section ${index + 1}`;

const resolveAccordionChildren = (accordion: AccordionItem, accordionId: string, index: number) => {
  if (accordion.children == null) {
    return null;
  }

  if (typeof accordion.children === 'function') {
    return accordion.children(accordion, { accordionId, index });
  }

  return accordion.children;
};

const getChildItemsByAccordion = (
  accordions: AccordionItem[],
  listId?: string
): ChildItemsByAccordion => {
  const childItemsByAccordion: ChildItemsByAccordion = {};

  accordions.forEach((accordion, index) => {
    if (!accordion.childItems) {
      return;
    }

    const accordionId = getAccordionId(accordion, index, listId);
    childItemsByAccordion[accordionId] = accordion.childItems;
  });

  return childItemsByAccordion;
};

const mergeChildItemsIntoAccordions = (
  accordions: AccordionItem[],
  childItemsByAccordion: ChildItemsByAccordion,
  listId?: string
) =>
  accordions.map((accordion, index) => {
    const accordionId = getAccordionId(accordion, index, listId);
    const nextChildItems = childItemsByAccordion[accordionId];

    if (nextChildItems === undefined) {
      return accordion;
    }

    return {
      ...accordion,
      childItems: nextChildItems,
    };
  });

const AccordionList = forwardRef<AccordionListRef, AccordionListProps>(function AccordionList(
  {
    accordions,
    className = '',
    disabled = false,
    showToggleIcon = true,
    expanded = false,
    onToggle = () => {},
    startingButton = false,
    contentClass = '',
    accordionWrapperClass = '',
    iconSize = 'h-4 w-4',
    treeIcon = false,
    toggleOnCount = null,
    keepMounted = false,
    listClassName = '',
    listWrapperClass = 'flex flex-col gap-2',
    htmlAlsoNeededOnReturn = false,
    draggable = false,
    dragIconPosition = 'inside',
    showReorderButtons = false,
    reorderButtonPosition = 'beside-handle',
    onReorder = () => {},
    onDragStart,
    onDragMove,
    onDragEnd: onDragEndProp,
    onDragCancel: onDragCancelProp,
    onChildItemsChange,
    renderChildDragOverlay,
    childDragOverlayZIndex = 1000,
    id,
    testid,
    isHeaderButton = false,
    preventHeaderToggleOnInteractiveClick = true,
    collapseOnDrag = false,
    ...props
  },
  ref
) {
  const [orderedAccordions, setOrderedAccordions] = useState<AccordionItem[]>(accordions);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeAccordionDrag, setActiveAccordionDrag] = useState<ActiveAccordionDragState | null>(
    null
  );
  const [activeChildDrag, setActiveChildDrag] = useState<ActiveChildDragState | null>(null);
  const [childDropIndicator, setChildDropIndicator] =
    useState<AccordionListChildDropIndicator | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const childItemsSnapshotRef = useRef<ChildItemsByAccordion | null>(null);
  const childDropIndicatorRef = useRef<AccordionListChildDropIndicator | null>(null);
  const pendingChildMoveFocusRef = useRef<{
    itemId: string;
    direction: AccordionMoveDirection;
  } | null>(null);

  dragStateRef.current = dragState;
  childDropIndicatorRef.current = childDropIndicator;

  const hasControls = draggable || showReorderButtons;
  const hasSharedDndContext = draggable;

  useEffect(() => {
    setOrderedAccordions((current) => (isEqual(current, accordions) ? current : accordions));
  }, [accordions]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemsToRender = draggable || showReorderButtons ? orderedAccordions : accordions;

  const sortableIds = useMemo(
    () => itemsToRender.map((accordion, index) => getAccordionId(accordion, index, id)),
    [itemsToRender, id]
  );

  const hasChildItems = useMemo(
    () => itemsToRender.some((accordion) => accordion.childItems != null),
    [itemsToRender]
  );

  const handleChildItemsChange = useCallback(
    (nextChildItemsByAccordion: ChildItemsByAccordion) => {
      const nextAccordions = mergeChildItemsIntoAccordions(
        itemsToRender,
        nextChildItemsByAccordion,
        id
      );

      if (draggable || showReorderButtons) {
        setOrderedAccordions(nextAccordions);
      }

      return nextAccordions;
    },
    [draggable, id, itemsToRender, showReorderButtons]
  );

  const commitChildItemsChange = useCallback(
    (nextChildItemsByAccordion: ChildItemsByAccordion) => {
      const nextAccordions = handleChildItemsChange(nextChildItemsByAccordion);
      onChildItemsChange?.(nextAccordions);
      return nextAccordions;
    },
    [handleChildItemsChange, onChildItemsChange]
  );

  const applyReorder = useCallback(
    (reorderedAccordions: AccordionItem[]) => {
      if (draggable || showReorderButtons) {
        setOrderedAccordions(reorderedAccordions);
      }
      onReorder(reorderedAccordions);
    },
    [draggable, onReorder, showReorderButtons]
  );

  const captureExpandedState = useCallback(() => {
    const expandedById: Record<string, boolean> = {};

    itemsToRender.forEach((accordion, index) => {
      const accordionId = getAccordionId(accordion, index, id);
      expandedById[accordionId] = getIsExpanded(accordionId, accordion, expanded);
    });

    return expandedById;
  }, [expanded, id, itemsToRender]);

  const finishDrag = useCallback(
    (items: AccordionItem[], current: DragState) => {
      const mergedItems = items.map((accordion, index) => {
        const accordionId = getAccordionId(accordion, index, id);
        const savedExpanded = current.expandedById[accordionId];

        if (savedExpanded === undefined) {
          return accordion;
        }

        return { ...accordion, expanded: savedExpanded };
      });

      if (draggable || showReorderButtons) {
        setOrderedAccordions(mergedItems);
      }

      return mergedItems;
    },
    [draggable, id, showReorderButtons]
  );

  const handleDragStart = (event: DragStartEvent) => {
    onDragStart?.(event);

    if (isAccordionDrag(event.active)) {
      const accordionId = String(event.active.id);
      const index = sortableIds.indexOf(accordionId);

      setActiveAccordionDrag({
        data: {
          accordionId,
          index: index !== -1 ? index : 0,
          width: event.active.rect.current.initial?.width ?? undefined,
        },
      });
    }

    if (isChildDrag(event.active)) {
      const data = event.active.data?.current as AccordionListChildDragData;
      const draggedItem = findChildItemById(itemsToRender, data.itemId);

      if (!draggedItem) {
        return;
      }

      childItemsSnapshotRef.current = getChildItemsByAccordion(itemsToRender, id);

      setActiveChildDrag({
        data,
        item: draggedItem,
        width: event.active.rect.current.initial?.width ?? undefined,
        height: event.active.rect.current.initial?.height ?? undefined,
      });
    }

    if (!collapseOnDrag || !isAccordionDrag(event.active)) {
      return;
    }

    setDragState({
      isActive: true,
      expandedById: captureExpandedState(),
    });
  };

  const handleDragMove = (event: DragMoveEvent) => {
    onDragMove?.(event);
  };

  const clearChildDropIndicator = useCallback(() => {
    if (childDropIndicatorRef.current != null) {
      childDropIndicatorRef.current = null;
      setChildDropIndicator(null);
    }
  }, []);

  const handleDragOver = (event: DragOverEvent) => {
    if (!isChildDrag(event.active) || !hasChildItems) {
      return;
    }

    const snapshot = childItemsSnapshotRef.current;
    const activeData = event.active.data?.current as AccordionListChildDragData | undefined;

    if (snapshot == null || !activeData || !event.over) {
      clearChildDropIndicator();
      return;
    }

    const sourceAccordionId = activeData.accordionId;
    const targetAccordionId = getAccordionDropTargetId(event.over);

    // Same-accordion uses Sortable transforms; only show a gap for cross-accordion.
    if (!targetAccordionId || targetAccordionId === sourceAccordionId) {
      clearChildDropIndicator();
      return;
    }

    const targetItems = snapshot[targetAccordionId] ?? [];
    const insertIndex = getChildDropInsertionIndex(event, targetItems);
    const nextIndicator: AccordionListChildDropIndicator = {
      accordionId: targetAccordionId,
      insertIndex,
    };
    const current = childDropIndicatorRef.current;

    if (
      current?.accordionId === nextIndicator.accordionId &&
      current?.insertIndex === nextIndicator.insertIndex
    ) {
      return;
    }

    childDropIndicatorRef.current = nextIndicator;
    setChildDropIndicator(nextIndicator);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const current = dragStateRef.current;
    const isAccordionReorder = isAccordionDrag(event.active);

    if (isAccordionReorder) {
      const { active, over } = event;
      let nextItems = orderedAccordions;

      if (over && active.id !== over.id && sortableIds.includes(over.id as string)) {
        const oldIndex = sortableIds.indexOf(active.id as string);
        const newIndex = sortableIds.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
          nextItems = arrayMove(orderedAccordions, oldIndex, newIndex);
        }
      }

      if (current) {
        applyReorder(finishDrag(nextItems, current));
        setDragState(null);
      } else if (over && active.id !== over.id) {
        applyReorder(nextItems);
      }
    } else if (current) {
      applyReorder(finishDrag(orderedAccordions, current));
      setDragState(null);
    } else if (isChildDrag(event.active) && hasChildItems) {
      const snapshot = childItemsSnapshotRef.current;
      const activeData = event.active.data?.current as AccordionListChildDragData | undefined;
      const dropIndicator = childDropIndicatorRef.current;

      if (snapshot != null && activeData?.itemId) {
        const sourceAccordionId = activeData.accordionId;
        let nextChildItems = snapshot;

        // Cross-accordion: commit exactly where the dashed placeholder was shown.
        if (dropIndicator && dropIndicator.accordionId !== sourceAccordionId) {
          nextChildItems =
            applyChildDragAtIndex(
              snapshot,
              sourceAccordionId,
              dropIndicator.accordionId,
              activeData.itemId,
              dropIndicator.insertIndex
            ) ?? snapshot;
        } else if (event.over) {
          const targetAccordionId = getAccordionDropTargetId(event.over);
          nextChildItems =
            targetAccordionId === sourceAccordionId
              ? (applySameAccordionChildDragEnd(event, snapshot) ?? snapshot)
              : (applyChildDrag(event, snapshot) ?? snapshot);
        }

        if (!isEqual(nextChildItems, snapshot)) {
          commitChildItemsChange(nextChildItems);
        }
      }
    }

    setActiveAccordionDrag(null);
    setActiveChildDrag(null);
    childItemsSnapshotRef.current = null;
    clearChildDropIndicator();
    onDragEndProp?.(event);
  };

  const handleDragCancel = (event: DragCancelEvent) => {
    const current = dragStateRef.current;

    if (current) {
      applyReorder(finishDrag(orderedAccordions, current));
      setDragState(null);
    }

    setActiveAccordionDrag(null);
    setActiveChildDrag(null);
    childItemsSnapshotRef.current = null;
    clearChildDropIndicator();
    onDragCancelProp?.(event);
  };

  const handleMove = useCallback(
    (index: number, direction: AccordionMoveDirection) => {
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= itemsToRender.length) {
        return;
      }

      applyReorder(arrayMove(itemsToRender, index, newIndex));
    },
    [applyReorder, itemsToRender]
  );

  const moveItem = useCallback(
    (accordionId: string, direction: AccordionMoveDirection) => {
      const index = itemsToRender.findIndex(
        (accordion, itemIndex) => getAccordionId(accordion, itemIndex, id) === accordionId
      );

      if (index === -1) {
        return;
      }

      handleMove(index, direction);
    },
    [handleMove, id, itemsToRender]
  );

  const moveChildItem = useCallback(
    (accordionId: string, itemId: string, direction: AccordionMoveDirection) => {
      if (!hasChildItems) {
        return;
      }

      const nextAccordions = moveChildItemInAccordions(
        itemsToRender,
        accordionId,
        itemId,
        direction,
        id
      );

      if (isEqual(nextAccordions, itemsToRender)) {
        return;
      }

      pendingChildMoveFocusRef.current = { itemId, direction };
      commitChildItemsChange(getChildItemsByAccordion(nextAccordions, id));
    },
    [commitChildItemsChange, hasChildItems, id, itemsToRender]
  );

  useLayoutEffect(() => {
    const pendingFocus = pendingChildMoveFocusRef.current;

    if (!pendingFocus) {
      return;
    }

    pendingChildMoveFocusRef.current = null;
    focusChildMoveControl(pendingFocus.itemId, pendingFocus.direction);
  }, [itemsToRender]);

  const canMoveChildItemFn = useCallback(
    (accordionId: string, itemId: string, direction: AccordionMoveDirection) =>
      canMoveChildItem(itemsToRender, accordionId, itemId, direction, id),
    [id, itemsToRender]
  );

  const childActionsContextValue = useMemo(
    () => ({
      moveChildItem,
      canMoveChildItem: canMoveChildItemFn,
    }),
    [canMoveChildItemFn, moveChildItem]
  );

  useImperativeHandle(
    ref,
    () => ({
      moveItem,
      moveChildItem,
    }),
    [moveChildItem, moveItem]
  );

  const renderAccordionContent = (
    accordion: AccordionItem,
    index: number,
    options?: {
      dragHandle?: React.ReactNode;
      accordionId?: string;
    }
  ) => {
    const accordionId = options?.accordionId ?? getAccordionId(accordion, index, id);
    const isAccordionDragMode = collapseOnDrag && dragState?.isActive;
    const savedExpanded = dragState?.expandedById[accordionId];
    const isExpanded = isAccordionDragMode
      ? false
      : (savedExpanded ?? accordion.expanded ?? expanded);
    const header = isAccordionDragMode ? (
      <span className="accordion-header-title truncate font-semibold">
        {getAccordionTitle(accordion, index, accordionId)}
      </span>
    ) : (
      accordion.header
    );

    const accordionChildren = resolveAccordionChildren(accordion, accordionId, index);

    const data = cloneDeep(accordion);
    if (!htmlAlsoNeededOnReturn) {
      delete data.children;
      delete data.header;
    }

    return (
      <Accordion
        id={accordionId}
        isHeaderButton={isHeaderButton}
        header={header}
        headerPrefix={options?.dragHandle}
        disabled={accordion.disabled ?? disabled}
        expanded={isExpanded}
        syncExpanded={collapseOnDrag && dragState != null}
        contentClass={accordion.contentClass ?? contentClass}
        accordionWrapperClass={accordion.accordionWrapperClass ?? accordionWrapperClass}
        showToggleIcon={showToggleIcon}
        startingButton={startingButton}
        iconSize={iconSize}
        treeIcon={treeIcon}
        toggleOnCount={toggleOnCount}
        keepMounted={keepMounted}
        className={className}
        onToggle={(emitData: OnToggleType) => onToggle({ ...emitData, index, data })}
        preventHeaderToggleOnInteractiveClick={preventHeaderToggleOnInteractiveClick}
        {...props}
      >
        {isAccordionDragMode ? null : accordionChildren}
      </Accordion>
    );
  };

  const renderVisualDragHandle = () => (
    <DragHandle
      visualOnly
      variant={dragIconPosition === 'inside' ? 'inline' : 'button'}
      className={dragIconPosition === 'outside' ? 'mt-2' : undefined}
    />
  );

  const renderControls = (
    accordion: AccordionItem,
    index: number,
    dragHandle?: React.ReactNode,
    options?: { visualOnly?: boolean }
  ) => {
    const accordionId = getAccordionId(accordion, index, id);
    const itemDisabled = accordion.disabled ?? disabled;
    const controlsDragHandle = draggable
      ? options?.visualOnly
        ? renderVisualDragHandle()
        : dragHandle
      : undefined;

    return (
      <AccordionListControls
        dragHandle={controlsDragHandle}
        showReorderButtons={showReorderButtons}
        reorderButtonPosition={reorderButtonPosition}
        idPrefix={accordionId}
        isFirst={index === 0}
        isLast={index === itemsToRender.length - 1}
        disabled={itemDisabled}
        onMoveUp={() => handleMove(index, 'up')}
        onMoveDown={() => handleMove(index, 'down')}
        insideHeader={dragIconPosition === 'inside'}
      />
    );
  };

  const renderAccordion = (accordion: AccordionItem, index: number) => {
    const accordionId = getAccordionId(accordion, index, id);

    if (!hasControls) {
      return (
        <React.Fragment key={accordionId}>
          {renderAccordionContent(accordion, index)}
        </React.Fragment>
      );
    }

    if (!draggable) {
      return (
        <div key={accordionId} role="listitem" className="flex items-start gap-2">
          {renderControls(accordion, index)}
          <div className="min-w-0 flex-1">{renderAccordionContent(accordion, index)}</div>
        </div>
      );
    }

    return (
      <SortableAccordionItem
        key={accordionId}
        id={accordionId}
        accordionId={accordionId}
        disabled={accordion.disabled ?? disabled}
        dragIconPosition={dragIconPosition}
        renderControls={(dragHandle) => renderControls(accordion, index, dragHandle)}
      >
        {(headerPrefix) =>
          renderAccordionContent(accordion, index, {
            dragHandle: dragIconPosition === 'inside' ? headerPrefix : undefined,
          })
        }
      </SortableAccordionItem>
    );
  };

  const listContent = (
    <div role={hasControls ? 'list' : undefined} className={listWrapperClass}>
      {itemsToRender.map((accordion, index) => renderAccordion(accordion, index))}
    </div>
  );

  const renderAccordionDragOverlayContent = () => {
    if (!activeAccordionDrag) {
      return null;
    }

    const { accordionId, width } = activeAccordionDrag.data;
    const accordionIndex = itemsToRender.findIndex(
      (accordion, index) => getAccordionId(accordion, index, id) === accordionId
    );

    if (accordionIndex === -1) {
      return null;
    }

    const accordion = itemsToRender[accordionIndex];

    const isAccordionDragMode = collapseOnDrag && dragState?.isActive;
    const header = isAccordionDragMode ? (
      <span className="accordion-header-title truncate font-semibold">
        {getAccordionTitle(accordion, accordionIndex, accordionId)}
      </span>
    ) : (
      accordion.header
    );
    const overlayStyle = width ? { width } : undefined;

    const accordionPreview = (
      <div className="accordion bg-card min-w-0 flex-1 rounded-lg border shadow-lg ring-1 ring-black/10">
        <div className="accordion-header flex items-center gap-2 px-4 py-2">
          {dragIconPosition === 'inside' ? renderVisualDragHandle() : null}
          <div className="min-w-0 flex-1">{header}</div>
        </div>
      </div>
    );

    return (
      <AccordionListAccordionDragOverlay style={overlayStyle}>
        {dragIconPosition === 'outside' ? (
          <div className="flex items-start gap-2">
            {renderControls(accordion, accordionIndex, renderVisualDragHandle(), {
              visualOnly: true,
            })}
            {accordionPreview}
          </div>
        ) : (
          accordionPreview
        )}
      </AccordionListAccordionDragOverlay>
    );
  };

  const renderChildDragOverlayContent = () => {
    if (!activeChildDrag) {
      return null;
    }

    const { data, item, width } = activeChildDrag;
    const overlayData: AccordionListChildDragOverlayData = {
      ...data,
      width,
      item,
    };
    const overlayStyle = width ? { width } : undefined;

    if (renderChildDragOverlay) {
      return (
        <div className="box-border" style={overlayStyle}>
          {renderChildDragOverlay(overlayData)}
        </div>
      );
    }

    const overlayLabel = item.label ?? data.itemId;

    return (
      <div
        className="accordion-list-child-drag-overlay box-border flex items-center gap-2"
        style={overlayStyle}
      >
        <DragHandle visualOnly variant="inline" />
        <AccordionListChildDragOverlay className="w-full flex-1">
          <span className="text-sm font-medium">{overlayLabel}</span>
        </AccordionListChildDragOverlay>
      </div>
    );
  };

  const childDragContextValue = useMemo(
    () => ({
      activeItemId: activeChildDrag?.data.itemId ?? null,
      activeHeight: activeChildDrag?.height,
      dropIndicator: childDropIndicator,
    }),
    [activeChildDrag?.data.itemId, activeChildDrag?.height, childDropIndicator]
  );

  const sortableContent = (
    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
      {listContent}
    </SortableContext>
  );

  return (
    <div className={classNames('accordion-list', listClassName)} id={id} data-testid={testid}>
      <AccordionListChildActionsProvider value={childActionsContextValue}>
        {hasSharedDndContext ? (
          <DndContext
            sensors={sensors}
            collisionDetection={accordionListCollisionDetection}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <AccordionListChildDragProvider value={childDragContextValue}>
              {sortableContent}
              <DragOverlay zIndex={childDragOverlayZIndex}>
                {renderAccordionDragOverlayContent() ?? renderChildDragOverlayContent()}
              </DragOverlay>
            </AccordionListChildDragProvider>
          </DndContext>
        ) : (
          listContent
        )}
      </AccordionListChildActionsProvider>
    </div>
  );
});

export default AccordionList;
