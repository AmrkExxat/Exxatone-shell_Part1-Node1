import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { DateTimePicker } from '../../../libs/ui';
import { ThemeDecorator } from '../../ThemeDecorator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarClock } from '@fortawesome/pro-light-svg-icons';

const meta: Meta<typeof DateTimePicker> = {
  title: 'Form/DateTimePicker',
  component: DateTimePicker,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    onClear: { action: 'onClear' },
    onBlur: { action: 'onBlur' },
    onChangeRaw: { action: 'onChangeRaw' },
  },
  tags: ['autodocs'],
};

export default meta;

type StoryType = StoryObj<typeof DateTimePicker>;

const StatefulDateTimePicker = (args: React.ComponentProps<typeof DateTimePicker>) => {
  const [selected, setSelected] = useState<Date | null>(args.selected ?? null);
  const { onChange, onClear, onBlur, onChangeRaw, ...rest } = args;

  return (
    <div className="p-6">
      <DateTimePicker
        {...rest}
        selected={selected}
        onChange={(next) => {
          console.log('onChange', next);
          setSelected(next);
          onChange?.(next);
        }}
        onClear={() => {
          console.log('onClear');
          onClear?.();
        }}
        onBlur={(event) => {
          console.log('onBlur', event);
          onBlur?.(event);
        }}
        onChangeRaw={(event) => {
          console.log('onChangeRaw', event.target.value, event);
          onChangeRaw?.(event);
        }}
      />
    </div>
  );
};

export const DateTimePickerSimple: StoryType = (args) => <StatefulDateTimePicker {...args} />;
DateTimePickerSimple.args = {
  id: 'datetime picker',
  testid: 'datetime picker component',
  label: 'simple date time picker',
  dateFormat: 'dd/MM/yyyy HH:mm',
  showTimeSelect: true,
  isClearable: true,
  hintText: 'dd/MM/yyyy HH:mm',
  calendarLabel: 'Open date and time picker',
};

export const DateTimePickerTwelveHour: StoryType = (args) => <StatefulDateTimePicker {...args} />;
DateTimePickerTwelveHour.args = {
  id: 'datetime 12 hour',
  label: '12-hour date time picker',
  dateFormat: 'MM/dd/yyyy hh:mm aa',
  showTimeSelect: true,
  selected: new Date(2026, 4, 14, 9, 0),
  showMonthDropdown: true,
  showYearDropdown: true,
  isClearable: true,
};

export const DateTimePickerTwelveHourWithTimeInput: StoryType = {
  render: (args) => <StatefulDateTimePicker {...args} />,
  args: {
    id: 'datetime twelve hour with time input',
    label: '12-hour date time picker with time input',
    dateFormat: 'MM/dd/yyyy hh:mm aa',
    showTimeSelect: false,
    showTimeInput: true,
    isClearable: true,
    hintText: 'MM/dd/yyyy hh:mm aa',
  },
};

export const DateTimePickerMinMax: StoryType = (args) => <StatefulDateTimePicker {...args} />;
DateTimePickerMinMax.args = {
  id: 'datetime min max',
  label: 'Min Max',
  dateFormat: 'dd/MM/yyyy HH:mm',
  showTimeSelect: true,
  isClearable: true,
  minDate: new Date('2024-05-14'),
  maxDate: new Date('2024-05-30'),
  calendarLabel: 'Min Max',
};

export const DateTimePickerTimeOnly: StoryType = (args) => <StatefulDateTimePicker {...args} />;
DateTimePickerTimeOnly.args = {
  id: 'datetime time only',
  label: 'Time only (24-hour)',
  dateFormat: 'HH:mm',
  showTimeSelect: true,
  showTimeSelectOnly: true,
  isClearable: true,
  placeholderText: 'Select Time',
  hintText: 'HH:mm',
};

export const DateTimePickerTimeOnlyTwelveHour: StoryType = (args) => (
  <StatefulDateTimePicker {...args} />
);
DateTimePickerTimeOnlyTwelveHour.args = {
  id: 'datetime time only 12 hour',
  label: 'Time only (12-hour)',
  showTimeSelect: true,
  showTimeSelectOnly: true,
  use12HourFormat: true,
  isClearable: true,
  placeholderText: 'Select Time',
  hintText: 'hh:mm aa',
};

export const DateTimePickerDisabled: StoryType = (args) => <StatefulDateTimePicker {...args} />;
DateTimePickerDisabled.args = {
  id: 'datetime disabled',
  label: 'Disabled',
  dateFormat: 'dd/MM/yyyy HH:mm',
  disabled: true,
  selected: new Date(2026, 6, 8, 14, 30),
  placeholderText: 'DateTimePicker Disabled',
};

export const DateTimePickerMonthYearDropdown: StoryType = (args) => (
  <StatefulDateTimePicker {...args} />
);
DateTimePickerMonthYearDropdown.args = {
  id: 'datetime month year dropdown',
  label: 'Month and year popover header',
  dateFormat: 'dd/MM/yyyy HH:mm',
  showTimeSelect: true,
  showMonthDropdown: true,
  showYearDropdown: true,
  isClearable: true,
  hintText: 'Year grid popover from CustomDatePicker pattern',
};

export const DateTimePickerWithLeadingIcon: StoryType = (args) => (
  <StatefulDateTimePicker {...args} />
);
DateTimePickerWithLeadingIcon.args = {
  id: 'datetime leading icon',
  label: 'With leading icon',
  dateFormat: 'dd/MM/yyyy HH:mm',
  showTimeSelect: true,
  isClearable: true,
  LeadingIcon: <FontAwesomeIcon icon={faCalendarClock} className="h-4 w-4 text-gray-500" />,
};
