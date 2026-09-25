/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';

import { type StateChange, StepProps } from './types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-light-svg-icons';
import { Button } from '../Buttons';

export default function Stepper({
  steps,
  onStepChange,
  isNextButtonEnable = false,
  isPreviousButtonEnable = true,
  onStepsComplete,
  defaultStep = 0,
  ariaLabel = 'progress',
  nextStep,
  prevStep,
  hideStepChangeButtons = false,
  buttonEnableCheck = true,
  fullWidth = true,
  labelCss = '',
  ariaDescribedBy: ariaDescribedBy,
}: StepProps): JSX.Element {
  const [stepsState] = useState(steps);
  const [currentStepIndex, setCurrentStepIndex] = useState(defaultStep);
  const stepRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const stepListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    onStepChange(currentStepIndex);
    scrollCurrentStepIntoView();
  }, [currentStepIndex]);

  const scrollCurrentStepIntoView = () => {
    if (stepRefs.current[currentStepIndex] && stepListRef.current) {
      const currentStepElement = stepRefs.current[currentStepIndex];
      const stepList = stepListRef.current;

      const stepRect = currentStepElement.getBoundingClientRect();
      const listRect = stepList.getBoundingClientRect();

      const isStepOutsideView = stepRect.left < listRect.left || stepRect.right > listRect.right;

      if (isStepOutsideView) {
        const scrollLeft =
          currentStepElement.offsetLeft - stepList.clientWidth / 2 + stepRect.width / 2;

        stepList.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    if (nextStep && nextStep > 0) {
      if (buttonEnableCheck) {
        if (isNextButtonEnable) {
          changeStep('inc');
        }
      } else {
        changeStep('inc');
      }
    }
  }, [nextStep]);

  useEffect(() => {
    if (prevStep && prevStep > 0) {
      if (buttonEnableCheck) {
        if (isPreviousButtonEnable) {
          changeStep('dec');
        }
      } else {
        changeStep('dec');
      }
    }
  }, [prevStep]);

  function changeStep(stateChange: StateChange, stepValue?: number): null {
    switch (stateChange) {
      case 'inc':
        next();
        break;
      case 'dec':
        previous();
        break;
      case 'custom':
        if (stepValue !== undefined && stepValue >= 0 && stepValue < steps.length) {
          setCurrentStepIndex(stepValue);
        }
        break;
    }
    return null;
  }

  const next: () => void = () => {
    if (currentStepIndex < stepsState.length - 1) {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      const newActiveTab = stepRefs.current[nextStepIndex];
      if (newActiveTab) {
        newActiveTab.focus();
      }
    } else if (currentStepIndex === stepsState.length - 1) {
      onStepsComplete();
    }
  };

  const previous: () => void = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      const stepId = steps[newIndex]?.id;
      if (stepId) {
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
          stepElement.focus();
        }
      }
    }
  };

  return (
    <nav
      aria-label={ariaLabel}
      className="flex w-full flex-col flex-wrap items-center justify-between gap-2 sm:flex-row"
    >
      <ul
        ref={stepListRef}
        className={`stepper no-scrollbar overflow-x-auto overflow-y-hidden whitespace-nowrap lg:max-w-6xl ${fullWidth ? 'lg:flex-1' : ''} w-[100%]`}
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="inline-block" aria-selected={currentStepIndex === stepIdx}>
            {stepIdx < currentStepIndex ? (
              <a
                id={step.id}
                ref={(el) => (stepRefs.current[stepIdx] = el)}
                aria-current={stepIdx === currentStepIndex ? 'page' : undefined}
                className={classNames(
                  stepIdx === currentStepIndex
                    ? 'active-item focus-visible:outline-white'
                    : 'focus-visible:outline-primary',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-5px]'
                )}
                onClick={() => {
                  changeStep('custom', stepIdx);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    changeStep('custom', stepIdx);
                  }
                }}
                tabIndex={0}
              >
                <div className="flex flex-row items-center">
                  <FontAwesomeIcon icon={faPen} className="text-default h-3 w-3" />
                  <span
                    className={classNames(
                      labelCss,
                      'text-default ml-2 truncate text-sm',
                      stepIdx === currentStepIndex ? 'font-semibold' : ''
                    )}
                    title={step?.name}
                  >
                    {step.name}
                  </span>
                </div>
              </a>
            ) : (
              <a
                id={step.id}
                ref={(el) => (stepRefs.current[stepIdx] = el)}
                aria-current={stepIdx === currentStepIndex ? 'page' : undefined}
                className={classNames(
                  stepIdx === currentStepIndex
                    ? 'active-item focus-visible:outline-white'
                    : 'focus-visible:outline-primary',
                  'focus-visible:outline-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-5px]'
                )}
                tabIndex={stepIdx === currentStepIndex ? 0 : -1}
              >
                <div className="flex flex-row items-center">
                  <span className={labelCss}>{step.id}.</span>
                  <span
                    title={step?.name}
                    className={`ml-2 ${stepIdx === currentStepIndex ? '' : ''} ${labelCss}`}
                  >
                    {step.name}
                  </span>
                </div>
              </a>
            )}
          </li>
        ))}
      </ul>
      <span className="flex flex-row items-center justify-end gap-4">
        {currentStepIndex !== 0 && !hideStepChangeButtons && (
          <Button
            testid="stepper_previous_btn"
            id="stepper_previous_btn"
            variant="stroked"
            size="lg"
            className="min-h-[36px] min-w-[80px] sm:min-h-[36px] sm:min-w-[80px]"
            disabled={!isPreviousButtonEnable}
            onClick={() => {
              if (!isPreviousButtonEnable) return;
              changeStep('dec');
            }}
          >
            {steps[currentStepIndex].previousButtonText ?? 'Previous'}
          </Button>
        )}
        {!hideStepChangeButtons && (
          <Button
            variant="flat"
            className="flex min-h-[36px] min-w-[80px] items-center justify-center sm:min-h-[36px] sm:min-w-[80px]"
            disabled={!isNextButtonEnable}
            testid="stepper_next_btn"
            id="stepper_next_btn"
            onClick={() => {
              if (!isNextButtonEnable) return;
              changeStep('inc');
            }}
            ariaDescribedBy={ariaDescribedBy}
          >
            {steps[currentStepIndex].nextButtonText ?? 'Next'}
          </Button>
        )}
      </span>
    </nav>
  );
}
