import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { RadixSliderFilter } from '../../libs/ui/radixUi/RadixSliderFilter';
import { ThemeDecorator } from '../ThemeDecorator';
import { faDollarSign } from '@fortawesome/pro-light-svg-icons';

const meta = {
  title: 'Radix UI/RadixSliderFilter',
  component: RadixSliderFilter,
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
    label: {
      control: 'text',
      description: 'Optional label displayed above the slider trigger.',
    },
    min: {
      control: { type: 'number', min: 0 },
      description: 'Minimum value of the range.',
    },
    max: {
      control: { type: 'number', min: 0 },
      description: 'Maximum value of the range.',
    },
    step: {
      control: { type: 'number', min: 1 },
      description: 'Step interval for the slider thumb.',
    },
    unit: {
      control: 'text',
      description: 'Unit label to display with values (e.g. "$", "%", "kg").',
    },
    unitPrefix: {
      control: 'boolean',
      description:
        'If true, the unit is shown before the value (e.g. "$10"); otherwise after (e.g. "10kg").',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger and slider interaction.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required in the label.',
    },
    width: {
      control: 'text',
      description: 'Width of the trigger and popover content (e.g. "260px", "100%").',
    },
    height: {
      control: 'text',
      description: 'Height of the trigger (defaults to the dropdown trigger height).',
    },
    addDebounce: {
      control: 'boolean',
      description: 'Whether to debounce the onChange callback.',
    },
    debounceDelay: {
      control: { type: 'number', min: 0 },
      description: 'Debounce delay (in ms) when addDebounce is true.',
    },
    freezeMinThumb: {
      control: 'boolean',
      description: 'When true, the minimum (left) thumb is fixed and cannot be moved.',
    },
    freezeMaxThumb: {
      control: 'boolean',
      description: 'When true, the maximum (right) thumb is fixed and cannot be moved.',
    },
  },
} satisfies Meta<typeof RadixSliderFilter>;

export default meta;

type Story = StoryObj<typeof RadixSliderFilter>;

/* ------------------ Basic Usage ------------------ */

export const Default: Story = {
  args: {
    label: 'Price range',
    min: 0,
    max: 100,
    unit: '$',
    unitPrefix: true,
    width: '260px',
    addDebounce: false,
    dropIcon: faDollarSign,
    onChange: (value) => {
      console.log(value);
    },
  },
};

export const SuffixUnit: Story = {
  args: {
    label: 'Weight range',
    min: 0,
    max: 200,
    step: 5,
    defaultValue: { min: 50, max: 150 },
    unit: 'kg',
    unitPrefix: false,
    width: '260px',
    addDebounce: false,
    onChange: (value) => {
      console.log(value);
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled range',
    min: 0,
    max: 100,
    defaultValue: { min: 30, max: 70 },
    width: '260px',
    disabled: true,
    onChange: (value) => {
      console.log(value);
    },
  },
};

/* ------------------ Frozen Thumbs ------------------ */

export const FreezeMinThumb: Story = {
  args: {
    label: 'Min frozen range',
    min: 0,
    max: 100,
    defaultValue: { min: 20, max: 80 },
    width: '260px',
    freezeMinThumb: true,
    addDebounce: false,
    onChange: (value) => {
      console.log(value);
    },
  },
};

export const FreezeMaxThumb: Story = {
  args: {
    label: 'Max frozen range',
    min: 0,
    max: 100,
    defaultValue: { min: 20, max: 80 },
    width: '260px',
    freezeMaxThumb: true,
    addDebounce: false,
    onChange: (value) => {
      console.log(value);
    },
  },
};

/* ------------------ Custom Styling ------------------ */

export const CustomStyling: Story = {
  args: {
    label: 'Custom styled range',
    min: 0,
    max: 100,
    defaultValue: { min: 25, max: 75 },
    width: '320px',
    unit: '$',
    addDebounce: false,
    triggerClassName: 'border-0 bg-gray-900 text-white shadow-lg',
    contentClassName: 'shadow-2xl border border-slate-200',
    trackClassName: 'bg-gray-300',
    trackStyle: { height: 6 },
    radarClassName: 'bg-red-300',
    thumbClassName:
      'h-2 w-2 border-2 border-white bg-red-500 shadow-[0_0_0_2px_rgba(15,23,42,0.6)] hover:bg-gray-800',
    onChange: (value) => {
      console.log(value);
    },
  },
};

/* ------------------ Controlled Usage ------------------ */

const ControlledSliderExample = (): React.ReactElement => {
  const [value, setValue] = useState({ min: 10, max: 90 });

  return (
    <div className="flex flex-col gap-4">
      <RadixSliderFilter
        label="Controlled range"
        min={0}
        max={100}
        value={value}
        unit="%"
        width="260px"
        addDebounce={false}
        onChange={setValue}
      />

      <div className="text-sm text-gray-700">
        Current value:{' '}
        <span className="font-semibold">
          {value.min}% – {value.max}%
        </span>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledSliderExample />,
};
