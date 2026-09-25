import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { Spinner } from '../../libs/ui';

const meta = {
  title: 'Common/Spinner',
  component: Spinner,
  decorators: [ThemeDecorator],
  parameters: {
    layout: '',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: ['normal', 'pie', 'star', 'dot'],
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariantsAndSizes: Story = {
  args: {
    size: 'md',
    variant: 'normal',
  },
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    const variants = ['normal', 'pie', 'star', 'dot'] as const;

    return (
      <div className="space-y-8">
        {variants.map((variant) => (
          <div key={variant} className="space-y-2">
            <div className="font-semibold capitalize">{variant} variant</div>
            <div className="flex flex-wrap items-center gap-6">
              {sizes.map((size) => (
                <div key={`${variant}-${size}`} className="flex flex-col items-center gap-2">
                  <Spinner id={`${variant}-${size}-spinner`} size={size} variant={variant} />
                  <span className="text-xs text-gray-600">{size}</span>
                </div>
              ))}
              {variant === 'normal' && (
                <div className="flex flex-col items-center gap-2">
                  <Spinner
                    size="md"
                    variant="normal"
                    trackColorClassName="text-[#DAE4FB]"
                    fillColorClassName="fill-[#2D63EB]"
                    className="h-[64px] w-[64px]"
                  />
                  <span className="text-xs text-gray-600">normal (custom size)</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <div className="font-semibold">Custom color examples</div>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner
                size="md"
                variant="normal"
                trackColorClassName="text-gray-300"
                fillColorClassName="fill-accent"
              />
              <span className="text-xs text-gray-600">normal</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" variant="pie" color="#F97316" />
              <span className="text-xs text-gray-600">pie (orange)</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Spinner
                size="md"
                variant="star"
                colors={['#EC4899', '#F472B6', '#F9A8D4', '#FCE7F3']}
                delay={100}
              />
              <span className="text-xs text-gray-600">star (pink trail)</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Spinner
                size="md"
                variant="dot"
                colors={['#EC4899', '#F472B6', '#F9A8D4', '#FCE7F3']}
              />
              <span className="text-xs text-gray-600">dot (pink trail)</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
