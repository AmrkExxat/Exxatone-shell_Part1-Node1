import React, { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { StackedCards } from '../../libs/ui/radixUi/StackedCards';
import { ThemeDecorator } from '../ThemeDecorator';

type RoleCard = {
  id: string;
  title: string;
  detail: string;
};

const meta = {
  title: 'Radix UI/StackedCards',
  component: StackedCards,
  decorators: [
    ThemeDecorator,
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    activeIndex: { control: 'number' },
    defaultIndex: { control: 'number' },
    stackDepth: { control: 'number' },
    stackOffset: { control: 'number' },
    stackScaleStep: { control: 'number' },
    className: { control: 'text' },
    cardClassName: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
} satisfies Meta<typeof StackedCards>;

export default meta;

type Story = StoryObj<typeof StackedCards>;

const baseItems: RoleCard[] = [
  {
    id: 'role-1',
    title: 'Orthopedic Physical Therapy',
    detail: 'Outpatient clinic, post-op rehab, hands-on caseload.',
  },
  {
    id: 'role-2',
    title: 'Sports Rehabilitation',
    detail: 'Athlete-focused setting with return-to-play emphasis.',
  },
  {
    id: 'role-3',
    title: 'Neuro Rehab',
    detail: 'Inpatient program with interdisciplinary care.',
  },
];

const DefaultStory = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useMemo(() => baseItems, []);

  return (
    <div className="flex flex-col items-start gap-4">
      <StackedCards<RoleCard>
        items={items}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        testId="stacked-cards-root"
        renderCard={(item, index) => (
          <div className="bg-card w-[520px] rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="text-lg font-semibold text-[#111827]">{item.title}</div>
            <div className="mt-2 text-sm text-[#6B7280]">{item.detail}</div>
            <div className="mt-4 text-xs text-[#9CA3AF]">Card {index + 1}</div>
          </div>
        )}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="bg-card rounded-md border border-[#D1D5DC] px-3 py-1.5 text-sm text-[#111827]"
          onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
          data-testid="stacked-cards-prev"
        >
          Previous
        </button>
        <button
          type="button"
          className="rounded-md bg-[#111827] px-3 py-1.5 text-sm text-white"
          onClick={() => setActiveIndex((prev) => Math.min(prev + 1, items.length - 1))}
          data-testid="stacked-cards-next"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    activeIndex: 2,
  },

  render: () => <DefaultStory />,
};

export const Children: Story = {
  render: () => (
    <StackedCards testId="stacked-cards-children" stackDepth={2} defaultIndex={1}>
      <div className="bg-card w-[460px] rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="text-lg font-semibold text-[#111827]">Pediatrics</div>
        <div className="mt-2 text-sm text-[#6B7280]">
          Outpatient pediatrics with caregiver training.
        </div>
      </div>
      <div className="bg-card w-[460px] rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="text-lg font-semibold text-[#111827]">Acute Care</div>
        <div className="mt-2 text-sm text-[#6B7280]">
          Hospital rotations with early mobility focus.
        </div>
      </div>
      <div className="bg-card w-[460px] rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="text-lg font-semibold text-[#111827]">Home Health</div>
        <div className="mt-2 text-sm text-[#6B7280]">Flexible scheduling with in-home visits.</div>
      </div>
    </StackedCards>
  ),
};

const basicCards = ['roles-1', 'roles-2', 'roles-3'];

const BasicDesignStory = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <StackedCards
      testId="stacked-cards-basic"
      stackDepth={3}
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
      items={basicCards}
      renderCard={(item, index) => (
        <div className="bg-card w-[680px] rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <div className="text-2xl font-semibold text-[#111827]">
            Tell Us What Kind Of Roles You're Looking For
          </div>
          <div className="mt-2 text-sm text-[#6B7280]">Card {index + 1}</div>
          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm font-medium text-[#111827]"
              onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
              data-testid={`stacked-cards-basic-prev-${item}`}
            >
              Back
            </button>
            <button
              type="button"
              className="rounded-md bg-[#111827] px-4 py-2 text-sm font-medium text-white"
              onClick={() => setActiveIndex((prev) => Math.min(prev + 1, basicCards.length - 1))}
              data-testid={`stacked-cards-basic-next-${item}`}
            >
              Keep Going
            </button>
          </div>
        </div>
      )}
    />
  );
};

export const BasicDesign: Story = {
  render: () => <BasicDesignStory />,
};
