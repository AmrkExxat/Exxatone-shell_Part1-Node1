export interface HorizontalStep {
  id: string;
  title: string;
  description?: string;
  step: number;
}

export interface HorizontalStepperProps {
  steps: HorizontalStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  canNavigateToStep?: (stepIndex: number) => boolean;
  showBackButton?: boolean;
  showNextButton?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  completedSteps?: number[];
  className?: string;
  activeStepColor?: string;
  completedStepColor?: string;
  inactiveStepColor?: string;
  showConnectingLines?: boolean;
  ariaLabel?: string;
  enablePulseAnimation?: boolean;
  showNextButtonOnLastStep?: boolean;
  lastStepButtonText?: string;
  ariaDescribedBy?: string;
  afterNavWrapperClass?: string;
  beforeUlClass?: string;
  ulClass?: string;
  isDarkTheme?: boolean;
}

export interface StepIndicatorProps {
  step: HorizontalStep;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  canNavigate: boolean;
  onClick?: (index: number) => void;
  activeColor?: string;
  completedColor?: string;
  inactiveColor?: string;
  showConnectingLine?: boolean;
  isLast?: boolean;
  enablePulseAnimation?: boolean;
  totalSteps?: any;
  isDarkTheme?: boolean;
}
