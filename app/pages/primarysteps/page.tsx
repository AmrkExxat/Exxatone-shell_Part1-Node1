'use client';

import React, { useState } from 'react';
import { Stepper } from '../../../libs';
export default function Page() {
  const [currentTab, setCurrentTab] = useState('Basic Info');
  const [isSave, setIsSave] = useState(false);
  const stepsData = [
    {
      id: '0',
      name: 'Basic Info',
      nextButtonText: 'Next',
    },
    {
      id: '1',
      name: 'Location',
      nextButtonText: 'Next',
    },
    {
      id: '2',
      name: 'Description',
      nextButtonText: 'Next',
    },
    {
      id: '3',
      name: 'Publish',
      nextButtonText: 'Save',
    },
  ];

  return (
    <>
      <span className="mb-8 text-4xl font-bold">Primary Stepper</span>
      <Stepper
        isNextButtonEnable={true}
        steps={stepsData}
        onStepChange={function (id: number): void {
          setIsSave(false);
          const currentIndex = stepsData.findIndex((step) => id.toString() === step.id);
          if (currentIndex >= 0) {
            setCurrentTab(stepsData[currentIndex].name);
          }
        }}
        onStepsComplete={function (): void {
          setIsSave(true);
        }}
        defaultStep={0}
        ariaLabel="Primary Stepper ProgressBar"
      />

      {/* <div className="flex justify-center mt-16">
        <div className="text-center ">
          {isSave
            ? "All tab contents are saved"
            : `current Tab is ${currentTab}`}
        </div>
      </div> */}
    </>
  );
}
