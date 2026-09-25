import React, { useState, Children, cloneElement, useEffect, useRef } from 'react';
import { RadioGroupProps } from './RadioGroup.types';

export default function RadioGroup({
  id,
  title,
  'aria-labelledby': ariaLabelledBy,
  children,
  required = false,
  orientation = 'vertical',
  className = '',
  onChange,
  value,
  defaultValue,
  disabled = false,
  error,
  clearTrigger,
  ...props
}: RadioGroupProps): JSX.Element {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value ?? defaultValue);
  const prevClearTrigger = useRef(clearTrigger);
  const groupId = id || `radio-group-${title?.toLowerCase().replace(/\s+/g, '-')}`;

  // Sync with controlled value prop if provided
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Handle clear trigger - only when it actually changes
  useEffect(() => {
    if (clearTrigger !== undefined && clearTrigger !== prevClearTrigger.current) {
      prevClearTrigger.current = clearTrigger;
      setSelectedValue(undefined);
      if (onChange) {
        onChange(undefined);
      }
    }
  }, [clearTrigger]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Update internal state if uncontrolled
    if (value === undefined) {
      setSelectedValue(newValue);
    }

    // Always call onChange
    if (onChange) {
      onChange(newValue);
    }
  };

  const getFocusableRadios = (container: HTMLElement): HTMLInputElement[] => {
    return Array.from(
      container.querySelectorAll('input[type="radio"]:not([disabled])')
    ) as HTMLInputElement[];
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusableRadios = getFocusableRadios(event.currentTarget);
    const currentIndex = focusableRadios.findIndex((radio) => radio === document.activeElement);

    let nextIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= focusableRadios.length) {
          nextIndex = 0;
        }
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = focusableRadios.length - 1;
        }
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = focusableRadios.length - 1;
        break;

      default:
        return;
    }

    if (nextIndex !== -1) {
      focusableRadios[nextIndex]?.focus?.();
      event.preventDefault();
    }
  };

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : selectedValue;

  return (
    <div className={`${className} ${disabled ? 'cursor-not-allowed' : ''}`} {...props}>
      {title && (
        <div className="flex items-baseline justify-between">
          <div
            id={`${groupId}-title`}
            className={`block text-sm leading-6 font-medium ${
              disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {title}
            {required && (
              <span className="ml-1 text-red-600" aria-hidden="true">
                *
              </span>
            )}
          </div>
        </div>
      )}
      <div
        role="radiogroup"
        aria-labelledby={title ? `${groupId}-title` : ariaLabelledBy}
        aria-required={required}
        aria-invalid={error ? true : false}
        aria-disabled={disabled}
        aria-orientation={orientation}
        className={` ${orientation === 'horizontal' ? 'flex flex-row space-x-4' : 'flex flex-col space-y-2'} ${disabled ? 'opacity-50' : ''} `}
        onKeyDown={handleKeyDown}
      >
        {Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return cloneElement(child, {
              name: groupId,
              checked: currentValue === child.props.value,
              onChange: handleChange,
              disabled: disabled || child.props.disabled,
            });
          }
          return child;
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${groupId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
