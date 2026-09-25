import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';

import { HorizontalStepper } from '../../libs/ui/components/common/Stepper';
import { HorizontalStep } from '../../libs/ui/components/common/Stepper/HorizontalStepperTypes';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/HorizontalStepper',
  component: HorizontalStepper,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
  argTypes: {
    activeStepColor: {
      control: { type: 'color' },
    },
    completedStepColor: {
      control: { type: 'color' },
    },
    inactiveStepColor: {
      control: { type: 'color' },
    },
    showBackButton: {
      control: { type: 'boolean' },
    },
    showNextButton: {
      control: { type: 'boolean' },
    },
    showConnectingLines: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof HorizontalStepper>;

export default meta;

type Story = StoryObj<typeof HorizontalStepper>;

const defaultSteps: HorizontalStep[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    step: 1,
  },
  {
    id: 'preferences',
    title: 'Preferences',
    step: 2,
  },
  {
    id: 'review',
    title: 'Review',
    step: 3,
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    step: 4,
  },
];

export const Default: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const handleStepClick = (stepIndex: number) => {
      setCurrentStep(stepIndex);
    };

    const canNavigateToStep = (stepIndex: number): boolean => {
      return stepIndex <= currentStep + 1 || completedSteps.includes(stepIndex);
    };

    const handleBack = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleNext = () => {
      if (currentStep < defaultSteps.length - 1) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep]);
        }
        setCurrentStep(currentStep + 1);
      }
    };

    return (
      <div className="p-6">
        <HorizontalStepper
          {...args}
          steps={defaultSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
          onBack={handleBack}
          onNext={handleNext}
          completedSteps={completedSteps}
        />
        <HorizontalStepper
          {...args}
          steps={defaultSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
          onBack={handleBack}
          onNext={handleNext}
          completedSteps={completedSteps}
          isDarkTheme={true}
          activeStepColor={'#39393C'}
          inactiveStepColor={'#F3F4F6'}
        />

        <div className="mt-8 rounded-lg bg-gray-50 p-6">
          <h3 className="mb-2 text-lg font-semibold">Current Step Content</h3>
          <p className="text-gray-600">
            Step {currentStep + 1}: {defaultSteps[currentStep]?.title}
          </p>
          <p className="mt-1 text-sm text-gray-500">{defaultSteps[currentStep]?.description}</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Completed Steps:{' '}
              {completedSteps.length > 0 ? completedSteps.map((i) => i + 1).join(', ') : 'None'}
            </p>
          </div>
        </div>
      </div>
    );
  },
  args: {
    showBackButton: true,
    showNextButton: true,
    backButtonText: 'Back',
    nextButtonText: 'Next',
    activeStepColor: '#4355B6',
    completedStepColor: '#16a34a',
    inactiveStepColor: '#F1E9FE',
    showConnectingLines: true,
    enablePulseAnimation: true,
  },
};

export const FormValidationExample: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const [formData, setFormData] = useState({
      step0: { name: '', email: '' },
      step1: { company: '', position: '' },
      step2: { preferences: '', notifications: false },
    });

    const formSteps: HorizontalStep[] = [
      {
        id: 'personal-info',
        title: 'Personal Info',
        description: 'Enter your personal details',
        step: 1,
      },
      {
        id: 'professional-info',
        title: 'Professional Info',
        description: 'Enter your work details',
        step: 2,
      },
      {
        id: 'preferences',
        title: 'Preferences',
        description: 'Set your preferences',
        step: 3,
      },
      {
        id: 'review',
        title: 'Review & Save',
        description: 'Review and save your profile',
        step: 4,
      },
    ];

    const isStepValid = (stepIndex: number): boolean => {
      switch (stepIndex) {
        case 0:
          return formData.step0.name.trim() !== '' && formData.step0.email.trim() !== '';
        case 1:
          return formData.step1.company.trim() !== '' && formData.step1.position.trim() !== '';
        case 2:
          return formData.step2.preferences.trim() !== '';
        case 3:
          return true;
        default:
          return false;
      }
    };

    const handleInputChange = (step: string, field: string, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        [step]: {
          ...prev[step as keyof typeof prev],
          [field]: value,
        },
      }));
    };

    const handleStepClick = (stepIndex: number) => {
      if (stepIndex <= currentStep || (stepIndex === currentStep + 1 && isStepValid(currentStep))) {
        setCurrentStep(stepIndex);
      }
    };

    const canNavigateToStep = (stepIndex: number): boolean => {
      return stepIndex <= currentStep || completedSteps.includes(stepIndex);
    };

    const handleBack = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleNext = () => {
      if (isStepValid(currentStep)) {
        if (currentStep < formSteps.length - 1) {
          if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep]);
          }
          setCurrentStep(currentStep + 1);
        } else {
          alert('Profile saved successfully!');
          if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep]);
          }
        }
      }
    };

    const renderStepContent = () => {
      const stepId = formSteps[currentStep]?.id;
      switch (currentStep) {
        case 0:
          return (
            <div
              className="space-y-4"
              id={`horizontal-step-panel-${stepId}`}
              role="tabpanel"
              aria-labelledby={`horizontal-step-${stepId}`}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  value={formData.step0.name}
                  onChange={(e) => handleInputChange('step0', 'name', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.step0.email}
                  onChange={(e) => handleInputChange('step0', 'email', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
          );
        case 1:
          return (
            <div
              className="space-y-4"
              id={`horizontal-step-panel-${stepId}`}
              role="tabpanel"
              aria-labelledby={`horizontal-step-${stepId}`}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.step1.company}
                  onChange={(e) => handleInputChange('step1', 'company', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your company name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Position *</label>
                <input
                  type="text"
                  value={formData.step1.position}
                  onChange={(e) => handleInputChange('step1', 'position', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your position"
                />
              </div>
            </div>
          );
        case 2:
          return (
            <div
              className="space-y-4"
              id={`horizontal-step-panel-${stepId}`}
              role="tabpanel"
              aria-labelledby={`horizontal-step-${stepId}`}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Preferences *
                </label>
                <textarea
                  value={formData.step2.preferences}
                  onChange={(e) => handleInputChange('step2', 'preferences', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your preferences"
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={formData.step2.notifications}
                  onChange={(e) => handleInputChange('step2', 'notifications', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="notifications" className="text-sm text-gray-700">
                  Enable email notifications
                </label>
              </div>
            </div>
          );
        case 3:
          return (
            <div
              className="space-y-4"
              id={`horizontal-step-panel-${stepId}`}
              role="tabpanel"
              aria-labelledby={`horizontal-step-${stepId}`}
            >
              <h3 className="text-lg font-semibold text-gray-900">Review Your Information</h3>
              <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                <div>
                  <span className="font-medium text-gray-700">Name:</span> {formData.step0.name}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span> {formData.step0.email}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Company:</span>{' '}
                  {formData.step1.company}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Position:</span>{' '}
                  {formData.step1.position}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Preferences:</span>{' '}
                  {formData.step2.preferences}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Notifications:</span>{' '}
                  {formData.step2.notifications ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Please review your information above. Click "Save" to create your profile.
              </p>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="p-6">
        <h2 className="mb-6 text-xl font-bold">Form Validation Example</h2>
        <HorizontalStepper
          steps={formSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
          onBack={handleBack}
          onNext={handleNext}
          completedSteps={completedSteps}
          nextButtonText="Next"
          isNextDisabled={!isStepValid(currentStep)}
          activeStepColor="#4355B6"
          completedStepColor="#16a34a"
          enablePulseAnimation={true}
          showNextButtonOnLastStep={true}
          lastStepButtonText="Save"
        />

        <div className="bg-card mt-8 rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Step {currentStep + 1}: {formSteps[currentStep]?.title}
          </h3>
          <p className="mb-6 text-gray-600">{formSteps[currentStep]?.description}</p>

          {renderStepContent()}
        </div>
      </div>
    );
  },
};
