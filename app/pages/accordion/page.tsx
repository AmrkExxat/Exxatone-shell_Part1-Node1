'use client';

import React from 'react';

import { Accordion } from '../../../libs';

export default function Page() {
  return (
    <div className="h-full w-full">
      <div className="my-4 text-2xl font-bold">Accordion Examples</div>
      <Accordion
        id="accordion_example"
        testid="accordion_example"
        header={
          <div className="accordion-header-title">
            <span> This is a Title</span>
          </div>
        }
      >
        <div>This is the intended content to be added into the requirement</div>
      </Accordion>
    </div>
  );
}
