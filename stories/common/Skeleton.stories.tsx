import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { Skeleton } from '../../libs/ui';

const meta = {
  title: 'Common/Skeleton',
  component: Skeleton,
  decorators: [ThemeDecorator],
  parameters: {
    layout: '',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['default', 'card', 'text', 'image', 'widget', 'list', 'stacked'],
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'default',
  },
};

export const Card: Story = {
  args: {
    type: 'card',
  },
};
export const Text: Story = {
  args: {
    type: 'text',
  },
};
export const Image: Story = {
  args: {
    type: 'image',
  },
};
export const Widget: Story = {
  args: {
    type: 'widget',
  },
};
export const List: Story = {
  args: {
    type: 'list',
  },
};

export const Stacked: Story = {
  args: {
    type: 'stacked',
    lines: 2,
    height: 'h-[50px]',
    className: 'rounded-[8px] bg-gray-200 dark:bg-gray-700',
    width: 'w-[277px]',
  },
};
