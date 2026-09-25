'use client';

import { Select } from '@ui/components';

import React from 'react';

export default function Page() {
  const options = [
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

  return (
    <>
      <span className="text-4xl font-bold">Select</span>
      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <Select
            name="discipline"
            multiple={false}
            options={options}
            id="default_select"
            label="Discipline"
          />
        </div>
        <div className="w-1/2">
          <Select
            name="discipline"
            multiple={true}
            options={options}
            id="default_select"
            label="Discipline"
          />
        </div>
      </div>
    </>
  );
}
