import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { ToggleSwitch } from '../../libs/ui';

const meta = {
  title: 'Common/ToggleSwitch',
  component: ToggleSwitch,
  decorators: [ThemeDecorator],
  parameters: {
    layout: '',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CheckedSwitchButton: Story = {
  args: {
    defaultChecked: true,
    disabled: false,
    id: 'switch_checked',
    ariaLabel: 'xyz',
  },
};
export const SwitchButton: Story = {
  args: {
    checked: false,
    disabled: false,
    id: 'switch_Switch',
    ariaLabel: 'xyz',
  },
};
export const DisabledSwitchButton: Story = {
  args: {
    checked: false,
    disabled: true,
    id: 'switch_disabled',
    ariaLabel: 'xyz',
  },
};
