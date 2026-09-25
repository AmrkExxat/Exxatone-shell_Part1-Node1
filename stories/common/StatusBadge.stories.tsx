import React from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { StatusBadge } from '../../libs/ui/components/common/StatusBadge';
import { ThemeDecorator } from '../ThemeDecorator';
import type { StatusBadgeVariant } from '../../libs/ui/components/common/StatusBadge/types';

const meta = {
  title: 'Common/StatusBadge',
  component: StatusBadge,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'confirmed',
        'compliant',
        'not-confirmed',
        'not-started',
        'action-needed',
        'in-progress',
        'canceled',
        'processing',
        'revoked',
        'pending',
        'na',
      ] satisfies StatusBadgeVariant[],
    },
    showChevron: { control: 'boolean' },
    label: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    label: 'Status',
    variant: 'confirmed',
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Confirmed',
    variant: 'confirmed',
  },
};

export const Clickable: Story = {
  args: {
    label: 'Some Action Needed',
    variant: 'action-needed',
    onClick: fn(),
  },
};

export const WithLink: Story = {
  args: {
    label: 'In Progress',
    variant: 'in-progress',
    href: '#',
  },
};

export const WithChevron: Story = {
  args: {
    label: 'Pending',
    variant: 'pending',
    showChevron: true,
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants: { label: string; variant: StatusBadgeVariant }[] = [
      { label: 'Confirmed', variant: 'confirmed' },
      { label: 'Compliant', variant: 'compliant' },
      { label: 'Non-Compliant', variant: 'non-compliant' },
      { label: 'Not Confirmed', variant: 'not-confirmed' },
      { label: 'Not Started', variant: 'not-started' },
      { label: 'Some Action Needed', variant: 'action-needed' },
      { label: 'In Progress', variant: 'in-progress' },
      { label: 'Canceled', variant: 'canceled' },
      { label: 'Processing', variant: 'processing' },
      { label: 'Revoked', variant: 'revoked' },
      { label: 'Pending', variant: 'pending' },
      { label: 'N/A', variant: 'na' },
    ];

    return (
      <div className="flex flex-wrap gap-3">
        {variants.map(({ label, variant }) => (
          <StatusBadge key={variant} label={label} variant={variant} />
        ))}
      </div>
    );
  },
};

export const AllVariantsWithChevron: Story = {
  render: () => {
    const variants: { label: string; variant: StatusBadgeVariant }[] = [
      { label: 'Confirmed', variant: 'confirmed' },
      { label: 'Compliant', variant: 'compliant' },
      { label: 'Not Confirmed', variant: 'not-confirmed' },
      { label: 'Not Started', variant: 'not-started' },
      { label: 'Some Action Needed', variant: 'action-needed' },
      { label: 'In Progress', variant: 'in-progress' },
      { label: 'Canceled', variant: 'canceled' },
      { label: 'Processing', variant: 'processing' },
      { label: 'Revoked', variant: 'revoked' },
      { label: 'Pending', variant: 'pending' },
      { label: 'N/A', variant: 'na' },
    ];

    return (
      <div className="flex flex-wrap gap-3">
        {variants.map(({ label, variant }) => (
          <StatusBadge key={variant} label={label} variant={variant} showChevron />
        ))}
      </div>
    );
  },
};
