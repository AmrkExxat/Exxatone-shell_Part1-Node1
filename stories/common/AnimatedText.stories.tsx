import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ThemeDecorator } from '../ThemeDecorator';
import { AnimatedText } from '../../libs/ui';

const meta = {
  title: 'Common/AnimatedText',
  component: AnimatedText,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to animate character by character',
    },
    delayPerCharMs: {
      control: { type: 'number', min: 0, step: 10 },
      description: 'Delay between characters in milliseconds',
    },
  },
} satisfies Meta<typeof AnimatedText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Animated text',
  },
};

export const Slow: Story = {
  args: {
    text: 'Slow animation Slow animation Slow animation',
    delayPerCharMs: 150,
  },
};

export const Fast: Story = {
  args: {
    text: 'Fast animation Fast animation Fast animation',
    delayPerCharMs: 20,
  },
};

export const Backward: Story = {
  args: {
    text: 'Backward animation Backward animation Backward animation',
    animationVariant: 'backward',
    delayPerCharMs: 150,
  },
};

export const WithCustomClass: Story = {
  args: {
    text: 'Animated with custom styles Animated with custom styles Animated with custom styles',
    className: 'text-primary text-lg font-semibold',
  },
};
