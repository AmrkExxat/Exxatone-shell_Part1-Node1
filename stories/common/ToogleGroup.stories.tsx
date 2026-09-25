import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { ToggleGroupButton } from '../../libs/ui';

const meta = {
  title: 'Common/ToggleGroupButton',
  component: ToggleGroupButton,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroupButton>;

export default meta;

type Story = StoryObj<typeof ToggleGroupButton>;

export const toggleGroupButton: Story = {
  render: () => {
    const handleToggleChange = (
      event: React.MouseEvent<HTMLElement>,
      newValue: string | number | null
    ) => {
      console.log('Selected option:', newValue);
    };

    const options = [
      { id: 'option_1', label: 'Option 1', value: 'option1' },
      { id: 'option_2', label: 'Option 2', value: 'option2' },
      { id: 'option_3', label: 'Option 3', value: 'option3' },
    ];

    return (
      <ToggleGroupButton
        id="toggle_button"
        options={options}
        initialSelected={'option2'}
        onChange={handleToggleChange}
        disabled={false}
        size="small" // Can be 'small', 'medium', or 'large'
      />
    );
  },
};

export const roundedToggleGroupButton: Story = {
  render: () => {
    const handleToggleChange = (
      event: React.MouseEvent<HTMLElement>,
      newValue: string | number | null
    ) => {
      console.log('Selected option:', newValue);
    };

    const options = [
      { id: 'option_1', label: 'Option 1', value: 'option1' },
      { id: 'option_2', label: 'Option 2', value: 'option2' },
      { id: 'option_3', label: 'Option 3', value: 'option3' },
    ];

    return (
      <ToggleGroupButton
        id="toggle_button"
        options={options}
        initialSelected={'option2'}
        onChange={handleToggleChange}
        disabled={false}
        size="small" // Can be 'small', 'medium', or 'large'
        customStyles={{
          borderRadius: '24px',
        }}
      />
    );
  },
};

export const customBGToggleGroupButton: Story = {
  render: () => {
    const handleToggleChange = (
      event: React.MouseEvent<HTMLElement>,
      newValue: string | number | null
    ) => {
      console.log('Selected option:', newValue);
    };

    const options = [
      { id: 'option_1', label: 'Option 1', value: 'option1' },
      { id: 'option_2', label: 'Option 2', value: 'option2' },
      { id: 'option_3', label: 'Option 3', value: 'option3' },
    ];

    return (
      <ToggleGroupButton
        id="toggle_button"
        options={options}
        initialSelected={'option2'}
        onChange={handleToggleChange}
        disabled={false}
        size="small" // Can be 'small', 'medium', or 'large'
        customStyles={{
          selectedBg: '#ffA500',
          selectedColor: '',
          defaultBg: '',
          defaultColor: '',
          hoverBg: '',
          hoverColor: '',
        }}
      />
    );
  },
};

export const disabledAllButton: Story = {
  render: () => {
    const handleToggleChange = (
      event: React.MouseEvent<HTMLElement>,
      newValue: string | number | null
    ) => {
      console.log('Selected option:', newValue);
    };

    const options = [
      { id: 'option_1', label: 'Option 1', value: 'option1' },
      { id: 'option_2', label: 'Option 2', value: 'option2' },
      { id: 'option_3', label: 'Option 3', value: 'option3' },
    ];

    return (
      <ToggleGroupButton
        id="toggle_button"
        options={options}
        initialSelected={'option2'}
        onChange={handleToggleChange}
        disabled={true}
        size="small" // Can be 'small', 'medium', or 'large'
      />
    );
  },
};

export const disabledAnyButton: Story = {
  render: () => {
    const handleToggleChange = (
      event: React.MouseEvent<HTMLElement>,
      newValue: string | number | null
    ) => {
      console.log('Selected option:', newValue);
    };

    const options = [
      { id: 'option_1', label: 'Option 1', value: 'option1', disabled: true },
      { id: 'option_2', label: 'Option 2', value: 'option2' },
      { id: 'option_3', label: 'Option 3', value: 'option3' },
    ];

    return (
      <ToggleGroupButton
        id="toggle_button"
        options={options}
        initialSelected={'option2'}
        onChange={handleToggleChange}
        disabled={false}
        size="small" // Can be 'small', 'medium', or 'large'
      />
    );
  },
};
