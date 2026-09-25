import type { Meta, StoryObj } from '@storybook/react';
import { RadixProgressBar } from '../../libs/ui/radixUi/RadixProgressBar';
import React from 'react';

const meta: Meta<typeof RadixProgressBar> = {
  title: 'Radix UI/RadixProgressBar',
  component: RadixProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value (0-100)',
    },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'custom'],
      description: 'Visual variant of the progress bar',
    },
    indicatorColor: {
      control: 'color',
      description: 'Custom color for the progress indicator',
    },
    trackColor: {
      control: 'color',
      description: 'Custom background color for the track',
    },
    height: {
      control: { type: 'text' },
      description: 'Height of the progress bar (e.g., "8px", "1rem", 8)',
    },
    width: {
      control: { type: 'text' },
      description: 'Width of the progress bar (e.g., "100%", "200px")',
    },
    borderRadius: {
      control: { type: 'text' },
      description: 'Border radius of the progress bar',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether to show indeterminate animation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadixProgressBar>;

export const Default: Story = {
  args: {
    value: 60,
    width: '300px',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[300px] flex-col gap-4">
      <div>
        <p className="mb-2 text-sm text-gray-600">Primary</p>
        <RadixProgressBar value={60} variant="primary" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Success</p>
        <RadixProgressBar value={75} variant="success" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Warning</p>
        <RadixProgressBar value={45} variant="warning" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Error</p>
        <RadixProgressBar value={30} variant="error" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Black</p>
        <RadixProgressBar value={50} variant="black" />
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  args: {
    value: 70,
    variant: 'custom',
    indicatorColor: '#8b5cf6',
    trackColor: '#f3e8ff',
    width: '300px',
    className: 'border-2 border-[violet]',
  },
};

export const CustomDimensions: Story = {
  args: {
    value: 50,
    height: 5,
    width: '300px',
    borderRadius: 4,
    children: <span className="text-xs font-bold text-gray-600">50%</span>,
    wrapperClassName: 'flex gap-2 flex-col',
    showProgressValue: true,
    progressValueClassName: 'text-xs font-bold text-black',
    progressValueLabel: 'Completed',
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    width: '300px',
  },
};
