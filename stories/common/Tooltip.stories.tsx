import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { Button, Tooltip } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/Tooltip',
  component: Tooltip,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'center',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TooltipStory: Story = {
  args: {
    triggerElement: () => <div tabIndex={0}>Hello , this is a tooltip example</div>,
    tooltip: () => <div className="p-1">This is a tooltip</div>,
  },
};
export const TooltipWithContent: Story = {
  render: () => {
    const triggerElement = () => {
      return (
        <div>
          <div>Hello , this is a tooltip example</div>
        </div>
      );
    };

    const tooltip = () => {
      return (
        <div className="p-4">
          <h2 className="mb-2 text-xl font-bold">Card Title</h2>
          <p className="mb-2">
            This is the content of the card. You can put any text or components here.
          </p>
          <Button id="action">Action</Button>
        </div>
      );
    };

    return (
      <div className="flex h-full w-full items-center justify-center">
        <Tooltip triggerElement={triggerElement} tooltip={tooltip} tabIndex={0} />
      </div>
    );
  },
};
