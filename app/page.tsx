'use client';

import { faRefresh, faUsers } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CustomDateRangePicker, CustomDateRangePickerOptionType } from '@ui/shared';
import React, { useState } from 'react';

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

export default function Home() {
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
        {/* <div className="w-[300px]"> */}
        <CustomDateRangePicker
          id="custom-date-range-picker"
          options={_options}
          label={'Published Date'}
          icon={faUsers}
          clearBit={clearBit}
          onChange={handleChange}
        />
        {/* </div> */}
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
}
