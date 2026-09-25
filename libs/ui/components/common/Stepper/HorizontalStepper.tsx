'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button } from '../Buttons';
import StepIndicator from './HorizontalStepIndicator';
import { HorizontalStepperProps } from './HorizontalStepperTypes';
import { JobsButton } from '../JobsButton';

const HorizontalStepper: React.FC<HorizontalStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  canNavigateToStep,
  showBackButton = true,
  showNextButton = true,
  onBack,
  onNext,
  backButtonText = 'Back',
  nextButtonText = 'Next',
  isNextDisabled = false,
  isBackDisabled = false,
  completedSteps = [],
  className = '',
  activeStepColor = '#4355B6',
  completedStepColor = '#16a34a',
  inactiveStepColor = '#F1E9FE',
  showConnectingLines = true,
  ariaLabel = 'Step progress',
  enablePulseAnimation = true,
  showNextButtonOnLastStep = true,
  lastStepButtonText = 'Finish',
  ariaDescribedBy,
  afterNavWrapperClass = 'mb-4',
  beforeUlClass = 'px-4',
  ulClass = 'py-4',
  isDarkTheme = false,
}) => {
  const stepperRef = useRef<HTMLUListElement>(null);
  const stepRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusedStepIndex, setFocusedStepIndex] = useState<number>(currentStep);

  useEffect(() => {
    if (stepperRef.current) {
      const currentStepElement = stepRefs.current[currentStep];
      if (currentStepElement) {
        currentStepElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
    setFocusedStepIndex(currentStep);
  }, [currentStep]);

  const focusStep = (stepIndex: number) => {
    const stepElement = stepRefs.current[stepIndex];
    if (stepElement) {
      stepElement.focus();
      setFocusedStepIndex(stepIndex);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (onStepClick && canNavigateToStep?.(stepIndex) !== false) {
      onStepClick(stepIndex);
      focusStep(stepIndex);
    }
  };

  const handleStepKeyDown = (e: React.KeyboardEvent, stepIndex: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStepClick(stepIndex);
    }
  };

  const handleBack = () => {
    if (onBack && !isBackDisabled) {
      onBack();
      setTimeout(() => {
        const back = document.getElementById('horizontal-stepper-back-btn');
        const next = document.getElementById('horizontal-stepper-next-btn');
        (back && !back.disabled ? back : next)?.focus();
      }, 100);
    }
  };

  const handleNext = () => {
    if (onNext && !isNextDisabled) {
      onNext();
      setTimeout(() => {
        const next = document.getElementById('horizontal-stepper-next-btn');
        const back = document.getElementById('horizontal-stepper-back-btn');
        (next && !next.disabled ? next : (back ?? stepRefs.current[currentStep + 1]))?.focus();
      }, 100);
    }
  };

  const isStepCompleted = (stepIndex: number): boolean => {
    return completedSteps.includes(stepIndex) || stepIndex < currentStep;
  };

  const canNavigate = (stepIndex: number): boolean => {
    if (canNavigateToStep) {
      return canNavigateToStep(stepIndex);
    }
    return stepIndex <= currentStep || isStepCompleted(stepIndex);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={classNames('horizontal-stepper w-full', className)}
      role="navigation"
    >
      <div className={`bg-card rounded-xl border ${afterNavWrapperClass}`}>
        <div className={`mx-auto w-full ${beforeUlClass} flex items-center justify-between`}>
          <ul
            className={`hide-scrollbar flex w-full items-center justify-start overflow-x-auto pl-2 ${ulClass}`}
            ref={stepperRef}
            role="tablist"
            aria-orientation="horizontal"
            tabIndex={-1}
          >
            {steps.map((step, index) => (
              <li key={step.id} className="inline-block" role="presentation">
                <a
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className={classNames(
                    'focus-indicator',
                    index === currentStep
                      ? 'focus-visible:outline-white'
                      : isDarkTheme
                        ? 'focus-visible:outline-black'
                        : 'focus-visible:outline-blue-500',
                    {
                      'cursor-pointer': canNavigate(index),
                      'cursor-not-allowed': !canNavigate(index),
                    }
                  )}
                  onClick={() => handleStepClick(index)}
                  onKeyDown={(e) => handleStepKeyDown(e, index)}
                  aria-label={`Step ${index + 1} of ${steps.length}: ${step.title}${step.description ? `. ${step.description}` : ''}${index === currentStep ? ' (current step)' : ''}${isStepCompleted(index) ? ' (completed)' : ''}${!canNavigate(index) ? ' (not available)' : ''}`}
                  data-testid={`horizontal-stepper-step-${index}`}
                  title={step.title}
                >
                  <StepIndicator
                    step={step}
                    index={index}
                    isActive={index === currentStep}
                    isCompleted={isStepCompleted(index)}
                    canNavigate={canNavigate(index)}
                    onClick={handleStepClick}
                    activeColor={activeStepColor}
                    completedColor={completedStepColor}
                    inactiveColor={inactiveStepColor}
                    showConnectingLine={showConnectingLines}
                    isLast={index === steps.length - 1}
                    enablePulseAnimation={enablePulseAnimation}
                    totalSteps={steps.length}
                    isDarkTheme={isDarkTheme}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-6 flex flex-shrink-0 items-center gap-3">
            {showBackButton && currentStep > 0 && (
              <>
                {isDarkTheme ? (
                  <JobsButton
                    testid="horizontal-stepper-back-btn"
                    id="horizontal-stepper-back-btn"
                    aria-label={`Back to previous step: ${steps[currentStep - 1]?.title || 'Back'}`}
                    variant="outlined"
                    onClick={handleBack}
                    disabled={isBackDisabled || currentStep === 0}
                  >
                    {backButtonText}
                  </JobsButton>
                ) : (
                  <Button
                    testid="horizontal-stepper-back-btn"
                    id="horizontal-stepper-back-btn"
                    variant="stroked"
                    onClick={handleBack}
                    disabled={isBackDisabled || currentStep === 0}
                    aria-label={`Back to previous step: ${steps[currentStep - 1]?.title || 'Back'}`}
                    className={
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
                    }
                  >
                    {backButtonText}
                  </Button>
                )}
              </>
            )}
            {showNextButton && (currentStep < steps.length - 1 || showNextButtonOnLastStep) && (
              <>
                {isDarkTheme ? (
                  <JobsButton
                    testid="horizontal-stepper-next-btn"
                    id="horizontal-stepper-next-btn"
                    aria-label={
                      currentStep === steps.length - 1
                        ? lastStepButtonText
                        : `Go to next step: ${steps[currentStep + 1]?.title || 'Next'}`
                    }
                    variant="filled"
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    ariaDescribedBy={ariaDescribedBy}
                  >
                    {currentStep === steps.length - 1 ? lastStepButtonText : nextButtonText}
                  </JobsButton>
                ) : (
                  <Button
                    testid="horizontal-stepper-next-btn"
                    id="horizontal-stepper-next-btn"
                    variant="flat"
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    aria-label={
                      currentStep === steps.length - 1
                        ? lastStepButtonText
                        : `Go to next step: ${steps[currentStep + 1]?.title || 'Next'}`
                    }
                    className={
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
                    }
                    ariaDescribedBy={ariaDescribedBy}
                  >
                    {currentStep === steps.length - 1 ? lastStepButtonText : nextButtonText}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalStepper;
