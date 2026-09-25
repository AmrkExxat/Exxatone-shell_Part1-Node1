import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { RadixAccordion } from '../../libs/ui/radixUi/RadixAccordion';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Radix UI/RadixAccordion',
  component: RadixAccordion,
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
    defaultOpen: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    disabled: { control: 'boolean' },
    width: { control: 'text' },
    maxWidth: { control: 'text' },
    height: { control: 'text' },
  },
} satisfies Meta<typeof RadixAccordion>;

export default meta;

type Story = StoryObj<typeof RadixAccordion>;

/* ------------------ Default ------------------ */

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <RadixAccordion
          open={open}
          onOpenChange={setOpen}
          width={'600px'}
          title={<span className="text-lg font-bold">What is Radix UI?</span>}
          subtitle={
            <p className="text-xs text-gray-600">
              Radix UI is a low-level UI component library with a focus on accessibility,
              customization and developer experience.
            </p>
          }
          children={
            <p className="pb-5 text-sm text-gray-600">
              Radix UI is a low-level UI component library with a focus on accessibility,
              customization and developer experience.
            </p>
          }
        />
      </div>
    );
  },
};
export const Disabled: Story = {
  render: () => {
    return (
      <div>
        <RadixAccordion
          disabled={true}
          width={'600px'}
          title={<span className="text-lg font-bold">What is Radix UI?</span>}
          subtitle={
            <p className="text-xs text-gray-600">
              Radix UI is a low-level UI component library with a focus on accessibility,
              customization and developer experience.
            </p>
          }
          children={
            <p className="pb-5 text-sm text-gray-600">
              Radix UI is a low-level UI component library with a focus on accessibility,
              customization and developer experience.
            </p>
          }
        />
      </div>
    );
  },
};

export const OpenedDisabled: Story = {
  render: () => {
    return (
      <div>
        <RadixAccordion
          disabled={true}
          open={true}
          width={'600px'}
          title={<span className="text-lg font-bold">What is Radix UI?</span>}
          subtitle={
            <p className="text-xs text-gray-600">
              Radix UI is a low-level UI component library with a focus on accessibility,
              customization and developer experience.
            </p>
          }
          children={
            <p className="pb-5 text-sm text-gray-600">
              Radix UI is a low-level UI component library with a focus on accessibility,
              customization and developer experience.
            </p>
          }
        />
      </div>
    );
  },
};
