import React, { useState } from 'react';
import { type Meta, type StoryObj } from '@storybook/nextjs';

import { Button, Select } from '../../../libs/ui';

import { ThemeDecorator } from '../../ThemeDecorator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-light-svg-icons';

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  component: Select,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Select>;

const _options = [
  { label: 'Art Therapy', value: 'option1', id: 'option1' },
  { label: 'Bio Chemistry', value: 'option2', id: 'option2' },
  { label: 'Speech Pathology', value: 'option3', id: 'option3' },
  { label: 'Physics', value: 'option4', id: 'option4' },
  { label: 'Mathematics', value: 'option5', id: 'option5' },
  { label: 'Computer Science', value: 'option6', id: 'option6' },
  { label: 'Mechanical Engineering', value: 'option7', id: 'option7' },
  { label: 'Civil Engineering', value: 'option8', id: 'option8' },
  { label: 'Electrical Engineering', value: 'option9', id: 'option9' },
  { label: 'Philosophy', value: 'option10', id: 'option10' },
  { label: 'Psychology', value: 'option11', id: 'option11' },
  { label: 'Economics', value: 'option12', id: 'option12' },
  { label: 'Political Science', value: 'option13', id: 'option13' },
  { label: 'History', value: 'option14', id: 'option14' },
  { label: 'Sociology', value: 'option15', id: 'option15' },
  { label: 'Anthropology', value: 'option16', id: 'option16' },
  { label: 'Linguistics', value: 'option17', id: 'option17' },
  { label: 'Environmental Science', value: 'option18', id: 'option18' },
];

export const SingleSelect: Story = {
  args: {
    disabled: false,
    LeadingIcon: <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />,
    required: true,
    id: 'discipline-single-select',
    label: 'Discipline',
    defaultValue: 'option1',
    'aria-describedby': 'Hello_id',
    options: _options,
    onBlur: () => {
      console.log('Blur Called');
    },
    handleAddNewButton: () => {
      console.log('handleAddNewButton Called');
    },
    onChange: (e) => {
      console.log('Current selected values list: ', e);
    },
    addNewButton: true,
  },
};

export const MultiSelect: Story = {
  args: {
    LeadingIcon: <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />,
    disabled: false,
    required: true,
    multiple: true,
    id: 'discipline-multi-select',
    label: 'Discipline',
    options: _options,
    'aria-describedby': 'Hello_id',
    defaultValues: [
      { label: 'Bio Chemistry', value: 'option2', id: 'option2' },
      { label: 'Mechanical Engineering', value: 'option7', id: 'option7' },
      { label: 'Environmental Science', value: 'option18', id: 'option18' },
    ],
    onBlur: () => {
      console.log('Blur Called');
    },
    onChange: (e) => {
      console.log('selected value', e);
    },
  },
};

export const DisabledSelect: Story = {
  args: {
    disabled: true,
    required: true,
    id: 'discipline-select',
    label: 'Discipline',
    defaultValue: 'option5',
    options: _options,
  },
};

export const WithReset: Story = {
  render: () => {
    const [reset, setReset] = useState<boolean>();

    return (
      <div className="flex flex-col gap-2">
        <Select
          id="reset-select"
          disabled={false}
          required={true}
          multiple
          defaultValues={[
            { label: 'Bio Chemistry', value: 'option2', id: 'option2' },
            {
              label: 'Mechanical Engineering',
              value: 'option7',
              id: 'option7',
            },
            {
              label: 'Environmental Science',
              value: 'option18',
              id: 'option18',
            },
          ]}
          label="Discipline"
          options={_options}
          onChange={(value) => {
            setReset(false);
          }}
          reset={reset}
          name={'Options'}
        />
        <div className="flex flex-row items-center justify-start">
          <Button
            id="reset-btn"
            onClick={() => {
              setReset(true);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  },
};
