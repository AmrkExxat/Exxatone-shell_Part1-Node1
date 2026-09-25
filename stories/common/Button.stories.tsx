import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { EnvelopeIcon } from '@heroicons/react/20/solid';
import { Button } from '../../libs/ui';
import React from 'react';

const meta = {
  title: 'Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    variant: 'basic',
    children: 'Basic Button',
    color: 'primary',
    id: 'basic-btn',
    testid: 'basic-btn',
    size: 'lg',
  },
};

export const Flat: Story = {
  args: {
    variant: 'flat',
    color: 'primary',
    children: 'Flat Button',
    id: 'flat-btn',
    testid: 'flat-btn',
    size: 'md',
  },
};

export const Stroked: Story = {
  args: {
    variant: 'stroked',
    color: 'primary',
    children: 'Stroked Button',
    id: 'stroked-btn',
    testid: 'stroked-btn',
    size: 'sm',
  },
};

export const Raised: Story = {
  args: {
    variant: 'raised',
    color: 'primary',
    children: 'Raised Button',
    id: 'raised-btn',
    testid: 'raised-btn',
    size: 'md',
  },
};

export const CustomClass: Story = {
  args: {
    variant: 'custom',
    children: <span className="text-yellow-500">Custom Button Here</span>,
    className: 'rounded-full text-white bg-black ',
    id: 'custom-btn',
    testid: 'custom-btn',
    size: 'md',
  },
};

export const IconButton: Story = {
  args: {
    variant: 'basic',
    children: <EnvelopeIcon className="h-5 w-5 text-gray-500" />,
    id: 'icon-btn',
    testid: 'icon-btn',
    'aria-label': 'Icon Button',
  },
};

export const LinkButton: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
    id: 'link-btn',
    testid: 'link-btn',
  },
};
