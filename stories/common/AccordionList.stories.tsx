import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useMemo, useState } from 'react';
import { ThemeDecorator } from '../ThemeDecorator';
import {
  AccordionList as AccordionListComponent,
  AccordionListContentDropZone,
  createDraggableItemId,
  getChildMoveControlProps,
  useDraggableItem,
  useMoveChildItem,
} from '../../libs/ui';
import type {
  AccordionItem,
  AccordionListChildItem,
  AccordionListRef,
  DragIconPosition,
  ReorderButtonPosition,
} from '../../libs/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const onClickButton = (id: string) => {
  console.log('button clicked', id);
};

const initialAccordions: AccordionItem[] = [
  {
    id: 'accordion_section_1',
    title: 'Section 1',
    header: (
      <div className="accordion-header-title">
        <span>Section 1</span>
      </div>
    ),
    children: <div>Content for the first accordion section.</div>,
  },
  {
    id: 'accordion_section_2',
    title: 'Section 2',
    header: (
      <div className="accordion-header-title flex items-center justify-between gap-5">
        <span>Section 2</span>
        <button
          onClick={(e) => {
            onClickButton('accordion_section_2');
          }}
        >
          click me
        </button>
      </div>
    ),
    children: <div>Content for the second accordion section.</div>,
  },
  {
    id: 'accordion_section_3',
    title: 'Section 3',
    header: (
      <div className="accordion-header-title flex items-center justify-between gap-5">
        <span>Section 3</span>
        <button
          onClick={(e) => {
            onClickButton('accordion_section_3');
          }}
        >
          click me
        </button>
      </div>
    ),
    children: <div>Content for the third accordion section.</div>,
  },
];

const meta: Meta<typeof AccordionListComponent> = {
  title: 'Common/AccordionList',
  component: AccordionListComponent,
  subcomponents: { AccordionListContentDropZone },
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
    docs: {
      description: {
        component: `
Renders multiple \`Accordion\` panels with optional accordion reordering and cross-accordion child drag-and-drop.

### AccordionItem shape
Each entry in \`accordions\` supports:
- \`id\`, \`header\`, \`children\`, \`title\`, \`disabled\`, \`expanded\`
- \`childItems\` — \`{ id, label, ... }\` objects with globally unique \`id\` values
- \`contentClass\`, \`accordionWrapperClass\` — per-accordion overrides

### Child drag setup
1. Enable \`draggable\` on \`AccordionList\`
2. Set \`childItems\` on each accordion
3. Provide \`children\` as a render function: \`(accordion) => ...\`
4. Wrap rows in \`AccordionListContentDropZone\` with \`sortableIds\`
5. Use \`useDraggableItem\` on each row and spread \`dragHandleProps\` onto the drag handle
6. Handle \`onChildItemsChange\` to persist order after drop
7. Optional: use \`useMoveChildItem()\` for up/down button reordering (within and across sections). Spread \`getChildMoveControlProps(...)\` onto move buttons so keyboard focus is restored after cross-accordion moves.

Same-accordion child reorder uses Sortable transforms during drag. Cross-accordion drag shows a floating overlay plus an insertion gap in the target accordion so you can see exactly where the item will land; order still commits on drop via \`onChildItemsChange\`.
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    accordions: {
      control: false,
      description:
        'Accordion panels to render. Each item needs `header` and optionally `children`, `childItems`, `id`, `title`, `expanded`, and per-item style overrides.',
      table: { type: { summary: 'AccordionItem[]' } },
    },
    listClassName: {
      control: 'text',
      description: 'Class name applied to the root `accordion-list` wrapper.',
    },
    listWrapperClass: {
      control: 'text',
      description:
        'Class name applied to the inner list container. Defaults to `flex flex-col gap-2`.',
    },
    htmlAlsoNeededOnReturn: {
      control: 'boolean',
      description:
        'When true, `onToggle` callback data includes `header` and `children` fields from the accordion item.',
    },
    draggable: {
      control: 'boolean',
      description:
        'Enables drag-and-drop for accordion reordering and child item drag when `childItems` are provided.',
    },
    dragIconPosition: {
      control: { type: 'radio' },
      options: ['inside', 'outside'],
      description: 'Position of the accordion drag handle relative to the header.',
    },
    showReorderButtons: {
      control: 'boolean',
      description: 'Shows up/down buttons to reorder accordions without dragging.',
    },
    reorderButtonPosition: {
      control: { type: 'select' },
      options: ['beside-handle', 'around-handle', 'stacked-handle'],
      description: 'Layout of the accordion reorder buttons when `showReorderButtons` is enabled.',
    },
    onReorder: {
      control: false,
      description: 'Called when accordion order changes via drag or reorder buttons.',
      table: { type: { summary: '(accordions: AccordionItem[]) => void' } },
    },
    onToggle: {
      control: false,
      description:
        'Called when an accordion header is toggled. Receives index, expanded state, event, and accordion data.',
      table: { type: { summary: '(emitData: AccordionListOnToggleType) => void' } },
    },
    isHeaderButton: {
      control: 'boolean',
      description: 'When true, the accordion header is rendered as a button element.',
    },
    preventHeaderToggleOnInteractiveClick: {
      control: 'boolean',
      description:
        'When true, clicks on buttons, inputs, and other interactive elements inside the header do not toggle the accordion.',
    },
    collapseOnDrag: {
      control: 'boolean',
      description:
        'During accordion drag, collapses all sections and shows `title` in the header. Restores expanded state when drag ends. Does not affect child drags.',
    },
    onDragStart: {
      control: false,
      description: 'Forwarded from the shared `DndContext` when any drag starts.',
      table: { type: { summary: '(event: DragStartEvent) => void' } },
    },
    onDragMove: {
      control: false,
      description: 'Forwarded from the shared `DndContext` on drag move.',
      table: { type: { summary: '(event: DragMoveEvent) => void' } },
    },
    onDragEnd: {
      control: false,
      description: 'Forwarded from the shared `DndContext` when any drag ends.',
      table: { type: { summary: '(event: DragEndEvent) => void' } },
    },
    onDragCancel: {
      control: false,
      description: 'Forwarded from the shared `DndContext` when any drag is cancelled.',
      table: { type: { summary: '(event: DragCancelEvent) => void' } },
    },
    onChildItemsChange: {
      control: false,
      description:
        'Called when a child drag completes. Receives the updated accordion list with reordered `childItems`. Required to persist child order.',
      table: { type: { summary: '(accordions: AccordionItem[]) => void' } },
    },
    renderChildDragOverlay: {
      control: false,
      description:
        'Custom floating preview while dragging a child item. Receives `itemId`, `accordionId`, `item`, and captured `width`.',
      table: { type: { summary: '(data: AccordionListChildDragOverlayData) => ReactNode' } },
    },
    childDragOverlayZIndex: {
      control: { type: 'number' },
      description: 'z-index for accordion and child drag overlays. Defaults to `1000`.',
    },
    id: {
      control: 'text',
      description: 'Root element id. Also used as a prefix when accordion items have no `id`.',
    },
    testid: {
      control: 'text',
      description: 'Value for the root `data-testid` attribute.',
    },
    className: {
      control: 'text',
      description:
        'Default class name passed to each nested `Accordion` when not overridden per item.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all accordions when no per-item `disabled` override is set.',
    },
    showToggleIcon: {
      control: 'boolean',
      description: 'Shows the expand/collapse icon on each accordion header.',
    },
    expanded: {
      control: 'boolean',
      description: 'Default expanded state for accordions without a per-item `expanded` value.',
    },
    startingButton: {
      control: 'boolean',
      description: 'Passed through to each nested `Accordion`.',
    },
    contentClass: {
      control: 'text',
      description: 'Default content class for each accordion body.',
    },
    accordionWrapperClass: {
      control: 'text',
      description: 'Default wrapper class for each accordion panel.',
    },
    treeIcon: {
      control: 'boolean',
      description: 'Passed through to each nested `Accordion`.',
    },
    iconSize: {
      control: 'text',
      description:
        'Toggle icon size class passed to each nested `Accordion`. Defaults to `h-4 w-4`.',
    },
    toggleOnCount: {
      control: 'number',
      description: 'Passed through to each nested `Accordion` for count-based toggle behavior.',
    },
    keepMounted: {
      control: 'boolean',
      description: 'Keeps accordion content mounted in the DOM when collapsed.',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the accordion list root.',
    },
  },
  args: {
    accordions: initialAccordions,
    preventHeaderToggleOnInteractiveClick: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const handleReorder =
  (setAccordions: React.Dispatch<React.SetStateAction<AccordionItem[]>>) =>
  (reorderedAccordions: AccordionItem[]) => {
    console.log('onReorder', reorderedAccordions);
    setAccordions(reorderedAccordions);
  };

const ReorderableAccordionList = ({
  id,
  testid,
  dragIconPosition = 'outside',
  reorderButtonPosition = 'beside-handle',
  showReorderButtons = true,
}: {
  id: string;
  testid: string;
  dragIconPosition?: DragIconPosition;
  reorderButtonPosition?: ReorderButtonPosition;
  showReorderButtons?: boolean;
}) => {
  const [accordions, setAccordions] = useState<AccordionItem[]>(initialAccordions);

  return (
    <div className="p-4">
      <AccordionListComponent
        id={id}
        testid={testid}
        listClassName="flex flex-col gap-2"
        preventHeaderToggleOnInteractiveClick
        draggable
        dragIconPosition={dragIconPosition}
        showReorderButtons={showReorderButtons}
        reorderButtonPosition={reorderButtonPosition}
        accordions={accordions}
        onReorder={handleReorder(setAccordions)}
      />
    </div>
  );
};

export const AccordionList: Story = {
  render: () => (
    <div className="p-4">
      <AccordionListComponent
        id="accordion_list_example"
        testid="accordion_list_example"
        listClassName="flex flex-col gap-2"
        preventHeaderToggleOnInteractiveClick
        onToggle={(event) => {
          console.log(event);
        }}
        accordions={initialAccordions}
      />
    </div>
  ),
};

export const DraggableAccordionList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Drag accordion sections using the header handle. Set `draggable` to enable accordion reordering.',
      },
    },
  },
  render: () => {
    const [accordions, setAccordions] = useState<AccordionItem[]>(initialAccordions);

    return (
      <div className="p-4">
        <AccordionListComponent
          id="accordion_list_draggable_example"
          testid="accordion_list_draggable_example"
          listClassName="flex flex-col gap-2"
          preventHeaderToggleOnInteractiveClick
          draggable
          dragIconPosition="outside"
          accordions={accordions}
          onReorder={handleReorder(setAccordions)}
        />
      </div>
    );
  },
};

export const DraggableAccordionListWithInsideIcon: Story = {
  render: () => {
    const [accordions, setAccordions] = useState<AccordionItem[]>(initialAccordions);

    return (
      <div className="p-4">
        <AccordionListComponent
          id="accordion_list_draggable_inside_example"
          testid="accordion_list_draggable_inside_example"
          listClassName="flex flex-col gap-2"
          preventHeaderToggleOnInteractiveClick
          draggable
          dragIconPosition="inside"
          accordions={accordions}
          onReorder={handleReorder(setAccordions)}
        />
      </div>
    );
  },
};

export const AccordionListWithReorderButtons: Story = {
  render: () => (
    <ReorderableAccordionList
      id="accordion_list_reorder_buttons_example"
      testid="accordion_list_reorder_buttons_example"
      dragIconPosition="inside"
      reorderButtonPosition="beside-handle"
    />
  ),
};

export const AccordionListRefMoveItem: Story = {
  render: () => {
    const listRef = React.useRef<AccordionListRef>(null);
    const [accordions, setAccordions] = useState<AccordionItem[]>(initialAccordions);
    const [selectedId, setSelectedId] = useState('accordion_section_2');

    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="ref_move_item_select" className="text-sm font-medium">
            Accordion
          </label>
          <select
            id="ref_move_item_select"
            className="rounded border px-2 py-1"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {accordions.map((accordion) => (
              <option key={accordion.id} value={accordion.id}>
                {accordion.id}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded border px-3 py-1"
            onClick={() => listRef.current?.moveItem(selectedId, 'up')}
          >
            Move up
          </button>
          <button
            type="button"
            className="rounded border px-3 py-1"
            onClick={() => listRef.current?.moveItem(selectedId, 'down')}
          >
            Move down
          </button>
        </div>

        <AccordionListComponent
          ref={listRef}
          id="accordion_list_ref_move_example"
          testid="accordion_list_ref_move_example"
          listClassName="flex flex-col gap-2"
          preventHeaderToggleOnInteractiveClick
          accordions={accordions}
          onReorder={handleReorder(setAccordions)}
        />
      </div>
    );
  },
};

const createTaskChildItem = (
  id: string,
  label: string,
  extra?: Record<string, unknown>
): AccordionListChildItem => ({
  id,
  label,
  ...extra,
});

const initialCrossAccordionChildItems: Record<string, AccordionListChildItem[]> = {
  accordion_section_1: [
    createTaskChildItem('task-a', 'Task A'),
    createTaskChildItem('task-b', 'Task B'),
    createTaskChildItem('task-c', 'Task C'),
  ],
  accordion_section_2: [
    createTaskChildItem('task-d', 'Task D'),
    createTaskChildItem('task-e', 'Task E'),
  ],
};

const ComposableSortableRow = ({
  accordionId,
  item,
}: {
  accordionId: string;
  item: AccordionListChildItem;
}) => {
  const { setNodeRef, style, dragHandleProps } = useDraggableItem({
    accordionId,
    itemId: item.id,
  });
  const { moveChildItem, canMoveChildItem } = useMoveChildItem();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card flex items-center gap-2 rounded-md border"
    >
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center text-gray-500 hover:text-gray-700 active:cursor-grabbing"
        aria-label={`Drag ${item.label}`}
        {...dragHandleProps}
      >
        ⋮⋮
      </button>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={!canMoveChildItem(accordionId, item.id, 'up')}
          aria-label={`Move ${item.label} up`}
          className="flex h-4 w-4 items-center justify-center text-gray-600 hover:text-gray-700 disabled:cursor-not-allowed"
          {...getChildMoveControlProps(accordionId, item.id, 'up')}
          onClick={(event) => {
            event.stopPropagation();
            moveChildItem(accordionId, item.id, 'up');
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} size="xs" />
        </button>
        <button
          type="button"
          disabled={!canMoveChildItem(accordionId, item.id, 'down')}
          aria-label={`Move ${item.label} down`}
          className="flex h-4 w-4 items-center justify-center text-gray-600 hover:text-gray-700 disabled:cursor-not-allowed"
          {...getChildMoveControlProps(accordionId, item.id, 'down')}
          onClick={(event) => {
            event.stopPropagation();
            moveChildItem(accordionId, item.id, 'down');
          }}
        >
          <FontAwesomeIcon icon={faArrowDown} size="xs" />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-between px-3 py-2">
        <span className="text-sm font-medium">{item.label}</span>
        <span className="text-xs text-gray-500">Custom content</span>
      </div>
    </div>
  );
};

const ComposableAccordionChildren = ({
  accordionId,
  items,
  staticLabel,
}: {
  accordionId: string;
  items: AccordionListChildItem[];
  staticLabel: string;
}) => {
  const sortableIds = useMemo(
    () => items.map((item) => createDraggableItemId(accordionId, item.id)),
    [accordionId, items]
  );

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-600">{staticLabel}</div>

      <AccordionListContentDropZone
        accordionId={accordionId}
        sortableIds={sortableIds}
        className="flex flex-col py-5"
      >
        {items.map((item) => (
          <ComposableSortableRow
            key={createDraggableItemId(accordionId, item.id)}
            accordionId={accordionId}
            item={item}
          />
        ))}
      </AccordionListContentDropZone>
    </div>
  );
};

const createAccordionChildren =
  (staticLabel?: string) =>
  (accordion: AccordionItem, context: { accordionId: string; index: number }) => (
    <ComposableAccordionChildren
      accordionId={context.accordionId}
      items={(accordion.childItems ?? []) as AccordionListChildItem[]}
      staticLabel={staticLabel ?? `Static content in ${accordion.id}`}
    />
  );

export const CrossAccordionChildDrag: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Child drag with custom row UI. Provide `childItems` as `{ id, label, ... }` objects and a `children` render function that reads `accordion.childItems`.',
      },
    },
  },
  render: () => {
    const [accordions, setAccordions] = useState<AccordionItem[]>([
      {
        id: 'accordion_section_1',
        title: 'Section 1',
        expanded: true,
        header: <span className="font-semibold">Section 1</span>,
        childItems: initialCrossAccordionChildItems.accordion_section_1,
        children: createAccordionChildren(),
      },
      {
        id: 'accordion_section_2',
        title: 'Section 2',
        expanded: true,
        header: <span className="font-semibold">Section 2</span>,
        childItems: initialCrossAccordionChildItems.accordion_section_2,
        children: createAccordionChildren(),
      },
    ]);

    return (
      <div className="flex flex-col gap-4 p-4">
        <AccordionListComponent
          id="accordion_list_cross_child_drag"
          testid="accordion_list_cross_child_drag"
          draggable
          collapseOnDrag
          dragIconPosition="inside"
          reorderButtonPosition="around-handle"
          showReorderButtons={true}
          accordions={accordions}
          onReorder={handleReorder(setAccordions)}
          onChildItemsChange={(e) => {
            console.log('onChildItemsChange', e);
            setAccordions(e);
          }}
          renderChildDragOverlay={(data) => (
            <div className="flex w-full items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 cursor-grabbing items-center justify-center rounded border text-gray-500">
                ⋮⋮
              </span>
              <div className="bg-card flex w-full flex-1 items-center justify-between rounded border px-3 py-2 shadow-lg ring-1 ring-black/10">
                <span className="text-sm font-medium">{data.item?.label ?? data.itemId}</span>
              </div>
            </div>
          )}
        />
      </div>
    );
  },
};

export const ContentDropZoneGuide: Story = {
  name: 'Child Drag Example',
  parameters: {
    docs: {
      description: {
        story:
          'Live example using `AccordionListContentDropZone`, `useDraggableItem`, `useMoveChildItem`, and `onChildItemsChange`. Same-accordion reorder shifts rows via Sortable transforms; cross-accordion shows an insertion gap in the target section before drop. Up/down controls call `useMoveChildItem()` — spread `getChildMoveControlProps(...)` on any move button (`<button>` or `<Button>`) so keyboard focus is restored after cross-accordion moves.',
      },
    },
  },
  render: () => {
    const [accordions, setAccordions] = useState<AccordionItem[]>([
      {
        id: 'accordion_section_1',
        title: 'Section 1',
        expanded: true,
        header: <span className="font-semibold">Section 1</span>,
        childItems: [
          createTaskChildItem('task-a', 'Task A'),
          createTaskChildItem('task-b', 'Task B'),
        ],
        children: createAccordionChildren('Static content can live outside the drop zone.'),
      },
      {
        id: 'accordion_section_2',
        title: 'Section 2',
        expanded: true,
        header: <span className="font-semibold">Section 2</span>,
        childItems: [createTaskChildItem('task-c', 'Task C')],
        children: createAccordionChildren('Static content can live outside the drop zone.'),
      },
    ]);

    return (
      <div className="flex flex-col gap-4 p-4">
        <AccordionListComponent
          id="accordion_list_content_drop_zone_docs"
          testid="accordion_list_content_drop_zone_docs"
          draggable
          collapseOnDrag
          accordions={accordions}
          onReorder={handleReorder(setAccordions)}
          onChildItemsChange={setAccordions}
          renderChildDragOverlay={(data) => (
            <div className="flex w-full items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 cursor-grabbing items-center justify-center rounded border text-gray-500">
                ⋮⋮
              </span>
              <div className="bg-card flex w-full flex-1 items-center rounded border px-3 py-2 shadow-lg ring-1 ring-black/10">
                <span className="text-sm font-medium">{data.item?.label ?? data.itemId}</span>
              </div>
            </div>
          )}
        />
      </div>
    );
  },
};
