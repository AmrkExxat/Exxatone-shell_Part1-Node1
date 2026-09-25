import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { FilterForm } from '../../libs/ui';
import { filterConfig } from '../shared-ui/data/dummyJson';
import { faCalendar, faCalendarRange } from '@fortawesome/pro-light-svg-icons';
const meta = {
  title: 'Filters/DateSelection',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const SingleDatePicker: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'dueDate',
              type: 'datePicker',
              label: 'Single Date Picker',
              defaultValues: null,
              icon: faCalendar,
              portal: true,
              placeholder: 'Select a date',
            },
          ]}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};

export const SingleDatePickerDark: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'dueDate',
              type: 'datePicker',
              label: 'Single Date Picker',
              defaultValues: null,
              icon: faCalendar,
              portal: true,
              isDarkTheme: true,
              placeholder: 'Select a date',
            },
          ]}
          isDarkTheme={true}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};
export const SingleDatePickerLight: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'dueDate',
              type: 'datePicker',
              label: 'Single Date Picker',
              defaultValues: null,
              icon: faCalendar,
              portal: true,
              placeholder: 'Select a date',
            },
          ]}
          isPlainTheme={true}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};

export const DateRangePicker: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'createdDate',
              type: 'dateRange',
              label: 'Date Range Picker',
              defaultValues: null,
              placeholder: 'Select a date range',
              icon: faCalendarRange,
              showSelected: true,
              extraFilter: false,
              hidden: false,
            },
          ]}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};
