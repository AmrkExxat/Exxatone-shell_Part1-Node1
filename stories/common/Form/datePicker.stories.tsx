import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { DatePicker } from '../../../libs/ui';
import { ThemeDecorator } from '../../ThemeDecorator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-light-svg-icons';

const meta: Meta<typeof DatePicker> = {
  title: 'Form/DatePicker',
  component: DatePicker,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onChange: { action: 'selected' },
  },
  tags: ['autodocs'],
};

export default meta;

type StoryType = StoryObj<typeof DatePicker>;

export const DatePickerSimple: StoryType = (args) => <DatePicker {...args} />;
DatePickerSimple.args = {
  datefmt: 'MMM dd, YYYY',
  calendarType: 'Date Picker',
  id: 'date picker',
  testid: 'date picker component',
  hintText: 'MMM dd, YYYY',
  label: 'simple date picker',
};

export const DatePickerMinMax: StoryType = (args) => <DatePicker {...args} />;
DatePickerMinMax.args = {
  minDate: new Date('2024-05-14'),
  maxDate: new Date('2024-05-30'),
  calendarType: 'Date Picker',
  isClearable: true,
  calendarLabel: 'Min Max',
};

export const DatePickerDisabled: StoryType = (args) => <DatePicker {...args} />;
DatePickerDisabled.args = {
  disabled: true,
  placeholderText: 'DatePicker Disabled',
};

export const DatePickerMonth: StoryType = (args) => <DatePicker {...args} />;
DatePickerMonth.args = {
  calendarType: 'Month Picker',
  placeholderText: 'Select Month',
  isClearable: true,
};

export const DatePickerMonthYear: StoryType = (args) => <DatePicker {...args} />;
DatePickerMonthYear.args = {
  calendarType: 'Month Year Picker',
  placeholderText: 'Select Month & Year',
  isClearable: false,
  LeadingIcon: <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-500" />,
};

export const DatePickerYear: StoryType = (args) => <DatePicker {...args} />;
DatePickerYear.args = {
  calendarType: 'Year Picker',
  placeholderText: 'Select Year',
  isClearable: true,
};
