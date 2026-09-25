/* eslint-disable react/display-name */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Switch } from '../../libs/ui/radixUi/Switch';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Radix UI/Switch',
  component: Switch,
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
  args: {
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'success', 'warning', 'error', 'custom'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'default', 'lg'],
    },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    checkedColor: {
      control: 'color',
      description:
        'Custom background color (CSS color value) when switch is ON. Required when variant="custom".',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof Switch>;

/* ------------------ Core ------------------ */

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/* ------------------ Variants ------------------ */

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch checked />
      <Switch variant="success" checked />
      <Switch variant="warning" checked />
      <Switch variant="error" checked />
    </div>
  ),
};

/* ------------------ Sizes ------------------ */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch size="sm" />
      <Switch />
      <Switch size="lg" />
    </div>
  ),
};

/* ------------------ Custom Checked Color ------------------ */

export const CustomCheckedColor: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        variant="custom"
        checkedColor="#000000"
        testId="switch-custom-checked-color"
        onCheckedChange={setChecked}
      />
    );
  },
};
