import React, { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import moment from 'moment';
import { faCalendar } from '@fortawesome/pro-light-svg-icons';

import { CustomDatePicker } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Filters/CustomDatePicker',
  component: CustomDatePicker,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    topLabel: 'Start Date',
    placeholderText: 'Select or Enter date',
    dropIcon: faCalendar,
    id: 'custom-date-picker',
    portal: true,
  },
  argTypes: {
    topLabel: { control: 'text' },
    placeholderText: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showTopLabel: { control: 'boolean' },
    portal: { control: 'boolean' },
    useUnderlineStyle: { control: 'boolean' },
    disableYearsBefore2023: { control: 'boolean' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    isDarkTheme: { control: 'boolean' },
    isPlainTheme: { control: 'boolean' },
    pickerDateFormat: {
      control: 'text',
      description: 'Passed to react-datepicker (date-fns tokens)',
    },
    displayFormat: {
      control: 'text',
      description: 'moment() format for the closed trigger label',
    },
    pickerTypeProps: {
      control: 'object',
      description: 'e.g. showYearPicker, showMonthYearPicker, showTimeSelect',
    },
    yearRangeSectionStyles: { control: 'object' },
    closeIcon: { control: false },
  },
} satisfies Meta<typeof CustomDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function StatefulCustomDatePicker(props: React.ComponentProps<typeof CustomDatePicker>) {
  const [value, setValue] = useState<Date | null>(
    props.defaultValue ? new Date(props.defaultValue as any) : null
  );
  const [clearBit, setClearBit] = useState(0);

  const minDate = useMemo(
    () => (props.minDate ? new Date(props.minDate as any) : undefined),
    [props.minDate]
  );
  const maxDate = useMemo(
    () => (props.maxDate ? new Date(props.maxDate as any) : undefined),
    [props.maxDate]
  );

  return (
    <div className="bg-card h-[520px] p-6">
      <div className="flex items-center gap-3">
        <div className="w-[320px]">
          <CustomDatePicker
            {...props}
            minDate={minDate}
            maxDate={maxDate}
            defaultValue={value}
            yearRangeSectionStyles={{
              yearButton: 'ring-[transparent]',
            }}
            clearBit={clearBit}
            onChange={(next) => {
              setValue(next ?? null);
              props.onChange?.(next);
            }}
          />
        </div>

        <button
          className="text-primary rounded px-3 py-2 text-sm"
          onClick={() => setClearBit((x) => x + 1)}
        >
          Clear
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        <div>
          <span className="font-semibold">Selected:</span>{' '}
          {value
            ? (() => {
                const pt = props.pickerTypeProps ?? {};
                if (pt.showYearPicker) return moment(value).format(props.displayFormat ?? 'YYYY');
                if (pt.showMonthYearPicker)
                  return moment(value).format(props.displayFormat ?? 'MMM YYYY');
                return moment(value).format(props.displayFormat ?? 'MMM dd, yyyy');
              })()
            : 'None'}
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const WithMinMax: Story = {
  args: {
    topLabel: 'Due Date',
    minDate: new Date('2024-05-14'),
    maxDate: new Date('2024-05-30'),
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    topLabel: 'Disabled Date',
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const UnderlineStyle: Story = {
  args: {
    useUnderlineStyle: true,
    topLabel: 'Underline Style',
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const PortalOff: Story = {
  args: {
    portal: false,
    topLabel: 'Portal Off',
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const DarkTheme: Story = {
  args: {
    isDarkTheme: true,
    topLabel: 'Dark Theme',
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const PlainTheme: Story = {
  args: {
    isPlainTheme: true,
    topLabel: 'Plain Theme',
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const SelectionModeYear: Story = {
  name: 'Selection Mode: Year',
  args: {
    topLabel: 'Year',
    placeholderText: 'Select a year',
    disableYearsBefore2023: false,
    pickerDateFormat: 'yyyy',
    displayFormat: 'YYYY',
    pickerTypeProps: { showYearPicker: true },
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const SelectionModeMonth: Story = {
  name: 'Selection Mode: Month',
  args: {
    topLabel: 'Month',
    placeholderText: 'Select a month',
    disableYearsBefore2023: false,
    pickerDateFormat: 'MMM yyyy',
    displayFormat: 'MMM YYYY',
    pickerTypeProps: { showMonthYearPicker: true },
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const WithPlaceholder: Story = {
  name: 'With Placeholder',
  args: {
    topLabel: 'Due Date',
    placeholderText: 'Pick a due date',
    pickerDateFormat: 'MMM dd, yyyy',
    displayFormat: 'MMM dd, yyyy',
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const WithCustomCloseIcon: Story = {
  name: 'Custom Close Icon',
  args: {
    topLabel: 'Start Date',
    closeIcon: <span style={{ fontSize: '0.75rem' }}>✕ Dismiss</span>,
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};

export const YearRangeSectionStyles: Story = {
  name: 'Year Range Section Styles',
  args: {
    topLabel: 'Styled Year Picker',
    placeholderText: 'Select a month',
    disableYearsBefore2023: false,
    pickerDateFormat: 'MMM yyyy',
    displayFormat: 'MMM YYYY',
    pickerTypeProps: { showMonthYearPicker: true },
    yearRangeSectionStyles: {
      container: 'gap-2',
      yearButton: 'rounded-full border border-gray-300 font-medium',
      selectedYearButton: 'bg-blue-600 text-white border-blue-600',
    },
  },
  render: (args) => <StatefulCustomDatePicker {...args} />,
};
