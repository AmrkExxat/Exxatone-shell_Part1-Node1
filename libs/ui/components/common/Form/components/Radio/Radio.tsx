import React from 'react';
import { RadioProps } from './Radio.types';

export default function Radio({
  id,
  testid,
  label,
  name,
  registerReturn,
  disabled = false,
  required = false,
  checked = false,
  helpText,
  className = '',
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  errorText,
  flexDir = 'column',
  ...props
}: RadioProps): JSX.Element {
  const inputClasses = `
    h-4 w-4 
    border border-gray-300
    text-primary 
    focus-indicator focus-visible:ring-offset-2
    dark:border-gray-600 dark:bg-gray-700
    transition-colors duration-200 mt-1
    ${
      disabled
        ? checked
          ? 'bg-gray-400 border-gray-400 cursor-not-allowed opacity-60'
          : 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60'
        : checked
          ? 'bg-primary border-primary cursor-pointer'
          : 'bg-card dark:bg-gray-800 cursor-pointer'
    }
    ${className}
  `.trim();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    // Only handle Space and Enter for selection
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (onChange && !disabled) {
        const syntheticEvent = {
          target: {
            checked: true,
            value: props.value,
            name: name,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  return (
    <div className={`flex items-start ${disabled ? 'cursor-not-allowed' : ''}`}>
      <input
        {...registerReturn}
        id={id}
        data-testid={testid}
        testid={testid}
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        required={required}
        value={props.value}
        aria-checked={checked}
        aria-disabled={disabled}
        aria-labelledby={props['aria-label'] || label}
        aria-describedby={helpText ? `${id}-helptext` : undefined}
        aria-readonly={props['aria-readonly']}
        aria-hidden={props['aria-hidden']}
        aria-required={required}
        tabIndex={disabled ? -1 : (props.tabIndex ?? 0)}
        role="radio"
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        onKeyUp={onKeyUp}
        className={inputClasses}
      />
      <div className={`${flexDir === 'column' ? 'flex-col' : 'flex-row'} ml-3 flex gap-1`}>
        <label
          htmlFor={id}
          className={`block text-sm leading-6 font-medium select-none ${
            disabled
              ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
              : 'cursor-pointer text-gray-900 dark:text-gray-100'
          }`}
        >
          {label}
        </label>
        {helpText && (
          <span
            id={`${id}-helptext`}
            className={`text-sm ${
              disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {helpText}
          </span>
        )}
        {errorText && (
          <span id={`${id}-helptext`} className="text-xs text-red-600">
            {errorText}
          </span>
        )}
      </div>
    </div>
  );
}
