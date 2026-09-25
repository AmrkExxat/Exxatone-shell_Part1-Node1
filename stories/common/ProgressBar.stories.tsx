import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { ProgressBar } from '../../libs/ui';

const meta = {
  title: 'Common/ProgressBar',
  component: ProgressBar,
  decorators: [ThemeDecorator],
  parameters: {
    layout: '',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const DeterminteProgress: Story = {
  args: {
    progressVariant: 'determinate',
    progressValue: 50,
  },
};
export const IndeterminateProgress: Story = {
  args: {
    progressVariant: 'indeterminate',
  },
};
export const CustomColorProgress: Story = {
  args: {
    progressVariant: 'determinate',
    progressValue: 50,
    barColor: 'green',
  },
};
