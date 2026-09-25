import React, { useState } from 'react';
import moment from 'moment';
import { ThemeDecorator } from '../ThemeDecorator';
import { CustomDateRangePicker, CustomDateRangePickerOptionType } from '../../libs/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCircleXmark, faRefresh } from '@fortawesome/pro-light-svg-icons';

const meta = {
  title: 'Filters/CustomDateRangePicker',
  component: CustomDateRangePicker,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomDateRangePicker>;

export default meta;

type Story = StoryObj<typeof CustomDateRangePicker>;

const _options: CustomDateRangePickerOptionType[] = [
  {
    id: 'last_7_days',
    label: 'Last 7 Days',
    value: 'last_7_days',
  },
  {
    id: 'last_14_days',
    label: 'Last 14 Days',
    value: 'last_14_days',
  },
  {
    id: 'last_30_days',
    label: 'Last 30 Days',
    value: 'last_30_days',
  },
  {
    id: 'custom_range',
    label: 'Custom Date Range',
    value: 'custom_range',
  },
];

export const Default: Story = {
  render: () => {
    const [selectedData, setSelectedData] = useState<{
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    } | null>(null);

    const [clearBit, setClearBit] = useState(0);

    const handleChange = (data: {
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    }) => {
      setSelectedData(data);
      console.log('CustomDateRangePicker onChange:', data);
    };

    const handleReset = () => {
      setClearBit((prev) => prev + 1);
    };

    return (
      <div className="bg-card h-full w-full space-y-6 p-6">
        <div className="flex items-center gap-4">
          <div className="w-[300px]">
            <CustomDateRangePicker
              id="custom-date-range-picker"
              options={_options}
              label={'Published Date'}
              icon={faUsers}
              clearBit={clearBit}
              onChange={handleChange}
              iconClassName="text-red-500 hover:text-white"
              selectedIconClassName="text-blue-500"
              labelClassName="text-red-500"
              optionClassName="text-blue-500 hover:bg-blue-500 hover:text-white"
              className="rounded-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              closeButtonClassName="text-green-500 hover:text-white"
              dateInputClassName="text-green-500"
              tabButtonClassName="text-yellow-500 hover:text-white hover:bg-yellow-500 bg-red-500"
            />
          </div>
          <button
            onClick={handleReset}
            className="text-primary rounded p-2"
            title="Reset Date Picker"
          >
            <FontAwesomeIcon icon={faRefresh} className="h-4 w-4" />
          </button>
        </div>

        {selectedData && (
          <div className="max-w-md rounded-lg bg-gray-100 p-4">
            <h3 className="mb-2 text-lg font-semibold">Selected Data:</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Option:</strong> {selectedData.selectedOption?.label || 'None'}
              </p>
              <p>
                <strong>Value:</strong> {selectedData.selectedOption?.value || 'None'}
              </p>
              <p>
                <strong>Start Date:</strong>{' '}
                {selectedData.startDate ? selectedData.startDate.toLocaleDateString() : 'None'}
              </p>
              <p>
                <strong>End Date:</strong>{' '}
                {selectedData.endDate ? selectedData.endDate.toLocaleDateString() : 'None'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const WithoutIcon: Story = {
  render: () => {
    const [selectedData, setSelectedData] = useState<{
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    } | null>(null);

    const handleChange = (data: {
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    }) => {
      setSelectedData(data);
      console.log('CustomDateRangePicker onChange:', data);
    };

    return (
      <div className="space-y-6 p-6">
        <div className="w-[300px]">
          <CustomDateRangePicker
            id="date-range-without-icon"
            options={_options}
            label={'Date Range'}
            onChange={handleChange}
          />
        </div>

        {selectedData && (
          <div className="max-w-md rounded-lg bg-gray-100 p-4">
            <h3 className="mb-2 text-lg font-semibold">Selected Data:</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Option:</strong> {selectedData.selectedOption?.label || 'None'}
              </p>
              <p>
                <strong>Value:</strong> {selectedData.selectedOption?.value || 'None'}
              </p>
              <p>
                <strong>Start Date:</strong>{' '}
                {selectedData.startDate ? selectedData.startDate.toLocaleDateString() : 'None'}
              </p>
              <p>
                <strong>End Date:</strong>{' '}
                {selectedData.endDate ? selectedData.endDate.toLocaleDateString() : 'None'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="p-6">
      <div className="w-[300px]">
        <CustomDateRangePicker
          id="disabled-date-range-picker"
          options={_options}
          label={'Date Range'}
          disabled={true}
        />
      </div>
    </div>
  ),
};

export const ExtraFilter: Story = {
  render: () => (
    <div className="p-6">
      <div className="w-[300px]">
        <CustomDateRangePicker
          id="extra-filter-date-range-picker"
          options={_options}
          label={'Extra Filter Date Range'}
          extraFilter={true}
          hideFilter={() => console.log('Hide filter clicked')}
        />
      </div>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => {
    const [selectedData, setSelectedData] = useState<{
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    } | null>(null);

    const handleChange = (data: {
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    }) => {
      setSelectedData(data);
      console.log('CustomDateRangePicker onChange:', data);
    };

    // Default value with "Last 30 Days" pre-selected
    const defaultDateValue = {
      selectedOption: _options.find((option) => option.value === 'last_30_days')!,
      startDate: moment().subtract(29, 'days').toDate(),
      endDate: moment().toDate(),
    };

    return (
      <div className="space-y-6 p-6">
        <div className="w-[300px]">
          <CustomDateRangePicker
            id="date-range-with-default"
            options={_options}
            label={'Date Range with Default'}
            icon={faUsers}
            defaultValue={defaultDateValue}
            onChange={handleChange}
          />
        </div>

        {selectedData && (
          <div className="max-w-md rounded-lg bg-gray-100 p-4">
            <h3 className="mb-2 text-lg font-semibold">Selected Data:</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Option:</strong> {selectedData.selectedOption?.label || 'None'}
              </p>
              <p>
                <strong>Value:</strong> {selectedData.selectedOption?.value || 'None'}
              </p>
              <p>
                <strong>Start Date:</strong>{' '}
                {selectedData.startDate ? selectedData.startDate.toLocaleDateString() : 'None'}
              </p>
              <p>
                <strong>End Date:</strong>{' '}
                {selectedData.endDate ? selectedData.endDate.toLocaleDateString() : 'None'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const CustomRangeWithDefaultValue: Story = {
  render: () => {
    const [selectedData, setSelectedData] = useState<{
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    } | null>(null);

    const handleChange = (data: {
      selectedOption: CustomDateRangePickerOptionType | null;
      startDate: Date | null;
      endDate: Date | null;
    }) => {
      setSelectedData(data);
      console.log('CustomDateRangePicker onChange:', data);
    };

    // Default value with "Custom Date Range" pre-selected
    const customDefaultValue = {
      selectedOption: _options.find((option) => option.value === 'custom_range')!,
      startDate: moment().subtract(7, 'days').toDate(),
      endDate: moment().toDate(),
    };

    return (
      <div className="space-y-6 p-6">
        <div className="w-[300px]">
          <CustomDateRangePicker
            id="custom-range-with-default"
            options={_options}
            label={'Custom Range with Default'}
            icon={faUsers}
            defaultValue={customDefaultValue}
            onChange={handleChange}
          />
        </div>

        <div className="max-w-md rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-blue-800">Custom Range Default:</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Component starts with "Custom Date Range" selected</p>
            <p>• Start date: 7 days ago</p>
            <p>• End date: Today</p>
            <p>• Users can modify the dates in the date picker</p>
          </div>
        </div>

        {selectedData && (
          <div className="max-w-md rounded-lg bg-gray-100 p-4">
            <h3 className="mb-2 text-lg font-semibold">Selected Data:</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Option:</strong> {selectedData.selectedOption?.label || 'None'}
              </p>
              <p>
                <strong>Value:</strong> {selectedData.selectedOption?.value || 'None'}
              </p>
              <p>
                <strong>Start Date:</strong>{' '}
                {selectedData.startDate ? selectedData.startDate.toLocaleDateString() : 'None'}
              </p>
              <p>
                <strong>End Date:</strong>{' '}
                {selectedData.endDate ? selectedData.endDate.toLocaleDateString() : 'None'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
};
