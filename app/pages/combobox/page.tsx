'use client';

import React, { useState } from 'react';
import { Select } from '../../../libs/ui';

export default function Page() {
  const [reset, setReset] = useState<boolean>();

  return (
    <>
      <span className="text-4xl font-bold">Combobox</span>
      <Select
        id="reset-combobox"
        disabled={false}
        required={true}
        searchable={true}
        hidden={false}
        label="Discipline"
        defaultValues={[{ label: 'Art Therapy', value: 'option1', id: 'option1' }]}
        options={[
          { label: 'Art Therapy', value: 'option1', id: 'option1' },
          { label: 'Bio Chemistry', value: 'option2', id: 'option2' },
          { label: 'Speech Pathology', value: 'option3', id: 'option3' },
        ]}
        onChange={(value) => {
          console.log(value);
          setReset(false);
        }}
        reset={reset}
        name={'Options'}
      ></Select>
    </>
  );
}
