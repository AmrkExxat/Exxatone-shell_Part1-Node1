'use client';

import React from 'react';
import { ToggleGroupButton } from '../../../libs';

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

const disabledOption = [
  { id: 'option_1', label: 'Option 1', value: 'option1', disabled: true },
  { id: 'option_2', label: 'Option 2', value: 'option2', disabled: false },
  { id: 'option_3', label: 'Option 3', value: 'option3', disabled: false },
];

export default function Page() {
  return (
    <div className="h-full w-full">
      <div className="my-4 text-2xl font-bold">Toggle Group Button Example</div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="bg-card w-1/2 rounded-md border">
            <div className="flex flex-col p-4">
              <span className="text-md mb-8 font-semibold">Basic</span>
              <div className="flex flex-row flex-wrap gap-4">
                <ToggleGroupButton
                  id="toggle_button"
                  options={options}
                  initialSelected={'option2'}
                  onChange={handleToggleChange}
                  disabled={false}
                  size="small" // Can be 'small', 'medium', or 'large'
                />
              </div>
              <br />

              <span className="text-md mb-8 font-semibold">Rounded</span>
              <div className="flex flex-row flex-wrap gap-4">
                <ToggleGroupButton
                  id="toggle_button"
                  options={options}
                  initialSelected={'option2'}
                  onChange={handleToggleChange}
                  disabled={false}
                  size="medium"
                  customStyles={{
                    borderRadius: '24px',
                  }}
                />
              </div>
              <br />

              <span className="text-md mb-8 font-semibold">With Custom Background</span>
              <div className="flex flex-row flex-wrap gap-4">
                <ToggleGroupButton
                  id="toggle_button"
                  options={options}
                  initialSelected={'option2'}
                  onChange={handleToggleChange}
                  disabled={false}
                  size="large"
                  customStyles={{
                    selectedBg: '#ffA500',
                    selectedColor: '',
                    defaultBg: '',
                    defaultColor: '',
                  }}
                />
              </div>
              <br />

              <span className="text-md mb-8 font-semibold">Disable All Button</span>
              <div className="flex flex-row flex-wrap gap-4">
                <ToggleGroupButton
                  id="toggle_button"
                  options={options}
                  initialSelected={'option2'}
                  onChange={handleToggleChange}
                  disabled={true}
                  size="medium"
                />
              </div>
              <br />

              <span className="text-md mb-8 font-semibold">Disable Only First Button</span>
              <div className="flex flex-row flex-wrap gap-4">
                <ToggleGroupButton
                  id="toggle_button"
                  options={disabledOption}
                  initialSelected={'option2'}
                  onChange={handleToggleChange}
                  disabled={false}
                  size="medium"
                />
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
