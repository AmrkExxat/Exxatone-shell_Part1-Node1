import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';

import { Stepper } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';
const meta = {
  title: 'Common/Stepper',
  component: Stepper,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof Stepper>;

export const StepperStory: Story = {
  render: () => {
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
        />

        <div className="mt-16 flex justify-center">
          <div className="text-center">
            {isSave ? 'All tab contents are saved' : `current Tab is ${currentTab}`}
          </div>
        </div>
      </>
    );
  },
};
