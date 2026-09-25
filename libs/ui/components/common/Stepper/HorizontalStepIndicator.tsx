import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { StepIndicatorProps } from './HorizontalStepperTypes';

const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  index,
  isActive,
  isCompleted,
  canNavigate,
  activeColor = '#4355B6',
  completedColor = '#16a34a',
  inactiveColor = '#F1E9FE',
  showConnectingLine = true,
  isLast = false,
  enablePulseAnimation = true,
  totalSteps,
  isDarkTheme = false,
}) => {
  const sizeClasses = {
    circle: 'w-8 h-8 md:w-8 md:h-8 text-base',
    text: 'text-sm md:text-base',
    line: 'w-12 h-px',
  };

  return (
    <div className="flex flex-row items-center">
      <div className="relative flex flex-col items-center md:flex-row md:items-center">
        <div
          className={classNames(
            'focus-indicator relative z-10 flex flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 focus-visible:ring-offset-2',
            sizeClasses.circle,
            {
              'cursor-pointer hover:opacity-80': canNavigate,
              'cursor-not-allowed opacity-50': !canNavigate,
              'animate-ring-pulse text-white': isActive && enablePulseAnimation,
              'text-white': isActive || isCompleted,
              'text-gray-600': !isActive && !isCompleted,
              'border-8': isCompleted && !isActive,
              'border-2': !isCompleted || isActive,
            }
          )}
          tabIndex={canNavigate ? 0 : -1}
          id={`horizontal-step-${step.id}`}
          aria-current={isActive ? 'step' : undefined}
          role="tab"
          aria-controls={`horizontal-step-panel-${step.id}`}
          aria-disabled={!canNavigate}
          aria-label={`Step ${index + 1} of ${totalSteps}: ${step.title}${step.description ? `. ${step.description}` : ''} ${isCompleted ? ' (completed)' : ''}${!canNavigate ? ' (not available)' : ''}`}
          style={
            {
              backgroundColor: isActive
                ? activeColor
                : isCompleted && !isActive
                  ? 'white'
                  : inactiveColor,
              borderColor: isActive ? activeColor : isCompleted ? completedColor : inactiveColor,
              ...(isActive && {
                '--ring-color': activeColor,
              }),
            } as React.CSSProperties
          }
        >
          {isCompleted && !isActive ? (
            <FontAwesomeIcon
              icon={faCheck}
              className="h-2 w-3"
              style={{ color: completedColor }}
              aria-hidden="true"
            />
          ) : (
            <span className={classNames('font-semibold', sizeClasses.text)} aria-hidden="true">
              {index + 1}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-col justify-center text-center md:mt-0 md:ml-4 md:text-left">
          <p
            className={classNames('font-medium transition-colors duration-200', sizeClasses.text, {
              'text-gray-500 dark:text-gray-400': !isActive && !isCompleted,
            })}
            style={{
              color: isActive ? activeColor : isCompleted ? completedColor : undefined,
            }}
            aria-hidden="true"
          >
            {step.title}
          </p>
          {step.description && (
            <p className="mt-1 text-xs text-gray-500 md:text-sm" aria-hidden="true">
              {step.description}
            </p>
          )}
        </div>
      </div>

      {!isLast && showConnectingLine && (
        <div
          className={classNames('mx-3', sizeClasses.line)}
          style={{
            backgroundColor: isCompleted ? completedColor : '#d1d5db',
          }}
          aria-hidden="true"
          role="presentation"
        />
      )}
    </div>
  );
};

export default StepIndicator;
