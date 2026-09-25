import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { faBell, faInfo } from '@fortawesome/free-solid-svg-icons';

import { BannerComponent } from '../../libs/ui/radixUi/Banner';
import { ThemeDecorator } from '../ThemeDecorator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const meta = {
  title: 'Radix UI/Banner',
  component: BannerComponent,
  decorators: [
    ThemeDecorator,
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['info', 'success', 'warning', 'error'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    align: {
      control: 'radio',
      options: ['start', 'center', 'end'],
    },
    alignmentClass: {
      control: 'radio',
      options: ['left', 'center', 'right'],
    },
    bgClassName: { control: 'text' },
    textClassName: { control: 'text' },
    icon: { control: false },
    hideIcon: { control: 'boolean' },
    testId: { control: 'text' },
  },
} satisfies Meta<typeof BannerComponent>;

export default meta;

type Story = StoryObj<typeof BannerComponent>;

export const Default: Story = {
  args: {
    isHeading: 2,
    type: 'info',
    title: 'Information',
    message: 'This is an informational banner to guide the user.',
    size: 'sm',
  },
};

export const CustomIcon: Story = {
  args: {
    type: 'info',
    title: 'Custom Icon',
    message: 'Using a custom icon passed as a prop.',
    icon: <FontAwesomeIcon icon={faInfo} className="bg-card h-3 w-3 rounded-full p-3" />,
  },
};

export const HiddenIcon: Story = {
  args: {
    type: 'warning',
    title: 'No Icon Banner',
    message: 'This banner has no icon displayed.',
    hideIcon: true,
    className: 'p-4',
    titleClassName: 'text-lg',
    messageClassName: 'text-sm font-bold',
    iconClassName: 'text-lg',
  },
};
