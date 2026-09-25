import { BaseComponentProps } from '@utilities';

export type StepStatus = 'complete' | 'current' | 'upcoming';

export type StateChange = 'inc' | 'dec' | 'custom';

export type Step = {
  id: string;
  name: string;
  nextButtonText?: string;
  previousButtonText?: string;
};

export interface StepProps extends BaseComponentProps {
  steps: Step[];
  onStepChange: (id: number) => void;
  onStepsComplete: () => void;
  isNextButtonEnable?: boolean;
  isPreviousButtonEnable?: boolean;
  defaultStep?: number;
  className?: string;
  ariaLabel?: string;
  nextStep?: number;
  prevStep?: number;
  hideStepChangeButtons?: boolean;
  buttonEnableCheck?: boolean;
  fullWidth?: boolean;
  labelCss?: string;
  ariaDescribedBy?: string;
}
