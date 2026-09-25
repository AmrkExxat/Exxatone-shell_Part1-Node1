import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { Filter } from '../../libs/ui';

const meta = {
  title: 'Common/Filter',
  component: Filter,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Filter>;

export default meta;

type Story = StoryObj<typeof Filter>;

export const DynamicWithOptions: Story = {
  args: {
    filters: [
      {
        filterName: 'country',
        filterOptions: [
          { value: 'india', label: 'India', id: '1' },
          { value: 'canada', label: 'Canada', id: '2' },
          { value: 'mexico', label: 'Mexico', id: '3' },
          { value: 'brazil', label: 'Brazil', id: '4' },
          { value: 'argentina', label: 'Argentina', id: '5' },
          { value: 'uk', label: 'United Kingdom', id: '6' },
          { value: 'germany', label: 'Germany', id: '7' },
          { value: 'france', label: 'France', id: '8' },
          { value: 'italy', label: 'Italy', id: '9' },
          { value: 'spain', label: 'Spain', id: '10' },
        ],
        placeholder: 'Countries',
      },
      {
        filterName: 'citi',
        filterOptions: [
          { value: 'mumbai', label: 'Mumbai', id: '1' },
          { value: 'delhi', label: 'Delhi', id: '2' },
          { value: 'bangalore', label: 'Bangalore', id: '3' },
          { value: 'hyderabad', label: 'Hyderabad', id: '4' },
          { value: 'chennai', label: 'Chennai', id: '5' },
          { value: 'kolkata', label: 'Kolkata', id: '6' },
          { value: 'pune', label: 'Pune', id: '7' },
          { value: 'jaipur', label: 'Jaipur', id: '8' },
          { value: 'ahmedabad', label: 'Ahmedabad', id: '9' },
          { value: 'lucknow', label: 'Lucknow', id: '10' },
        ],
        placeholder: 'Cities',
        multiSelect: true,
      },
    ],
    onFilterChange: (selectedOptions) => {
      console.log(selectedOptions);
    },
  },
};
