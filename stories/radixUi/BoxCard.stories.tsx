import React from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { BoxCard } from '../../libs/ui/radixUi/BoxCard';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Radix UI/BoxCard',
  component: BoxCard,
  decorators: [
    ThemeDecorator,
    (Story) => (
      <div className="bg-gray-50 p-10">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean', description: 'Highlights the card when true' },
    disabled: { control: 'boolean', description: 'Disables interactions and dims the card' },
    className: { control: 'text' },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof BoxCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const CardContent = ({ title }: { title: string }) => (
  <div className="flex flex-col gap-1">
    <div className="text-sm font-semibold text-gray-900">{title}</div>
    <div className="text-xs text-gray-500">Supporting description for this card.</div>
  </div>
);

export const Default: Story = {
  args: {
    active: false,
    children: <CardContent title="Default card" />,
  },
};

export const Active: Story = {
  args: {
    active: true,
    children: <CardContent title="Active card" />,
  },
};

export const Clickable: Story = {
  args: {
    active: true,
    children: <CardContent title="Clickable card (with onClick)" />,
  },
};

export const Disabled: Story = {
  args: {
    active: false,
    disabled: true,
    children: <CardContent title="Disabled card" />,
  },
};

export const CustomClassName: Story = {
  args: {
    active: false,
    className: 'border-dashed border-2 border-primary bg-card',
    children: <CardContent title="Custom class name" />,
  },
};
