import { type Meta, type StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';
import { Checkbox } from '../../../libs/ui';
import { CheckBoxGroup } from '../../../libs/ui';
import { ThemeDecorator } from '../../ThemeDecorator';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },

  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const CheckboxWithLabel: Story = {
  render: () => {
    return (
      <>
        <div>
          <h1 className="text-2xl font-bold">Checkbox with label</h1>
          <div className="mt-5 flex flex-col gap-4">
            <CheckBoxGroup title="CheckBox Group Title" required>
              <Checkbox id="honda" testid="honda" label="Honda" name="cars" value="test car 1" />
              <Checkbox
                id="tesla"
                testid="tesla"
                label="Tesla"
                name="cars"
                value="test car 2"
                disabled
              />
              <Checkbox
                id="volkswagen"
                testid="volkswagen"
                label="Volkswagen"
                name="cars"
                value="test car 3"
                checked
              />
              <Checkbox
                id="audi"
                testid="audi"
                label="Audi"
                name="cars"
                value="test car 4"
                disabled
                checked
              />
            </CheckBoxGroup>
          </div>
        </div>
      </>
    );
  },
};
