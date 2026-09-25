import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { ThemeDecorator } from '../ThemeDecorator';
import { AccordionListContentDropZone } from '../../libs/ui';

const meta = {
  title: 'Common/AccordionList/AccordionListContentDropZone',
  component: AccordionListContentDropZone,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Droppable wrapper for draggable child rows inside an accordion body. Optionally wraps children in `SortableContext` when `sortableIds` is provided. Must be used inside a `draggable` `AccordionList`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    accordionId: {
      control: 'text',
      description: 'Id of the parent accordion that owns this drop zone. Required.',
    },
    children: {
      control: false,
      description: 'Row content rendered inside the drop zone.',
    },
    sortableIds: {
      control: false,
      description:
        'When provided, children are wrapped in `SortableContext`. Use each child item `id` (must be unique across the whole list).',
      table: { type: { summary: 'UniqueIdentifier[]' } },
    },
    sortableStrategy: {
      control: false,
      description:
        'Sortable strategy passed to `SortableContext`. Defaults to `verticalListSortingStrategy`.',
    },
    className: {
      control: 'text',
      description: 'Class name for the drop zone container.',
    },
    activeClassName: {
      control: 'text',
      description: 'Class name applied while a dragged item is over the zone.',
    },
  },
  args: {
    accordionId: 'accordion_section_1',
    className: 'flex flex-col gap-2 min-h-[48px] rounded border p-2',
    activeClassName: 'ring-primary/40 bg-primary/5 ring-2',
  },
} satisfies Meta<typeof AccordionListContentDropZone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AccordionListContentDropZone {...args}>
      <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-600">
        Drop zone content goes here
      </div>
    </AccordionListContentDropZone>
  ),
};
