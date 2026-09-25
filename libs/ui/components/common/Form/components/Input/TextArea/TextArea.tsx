import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { InputHelpText } from '../InputHelpText';
import { type TextAreaProps } from './TextArea.types';
import { RenderLabel } from '../../../shared';

export default function TextArea({
  label,
  ref,
  rows = 4,
  disabled = false,
  helpText,
  name,
  required = false,
  errors = {},
  value = '',
  id = '',
  testid,
  onChange,
  registerReturn,
  className,
  ...props
}: TextAreaProps): JSX.Element {
  const isError = Boolean(errors[name]?.message);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    console.log('Updating value:', value);
    setInputValue(value || '');
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };
  return (
    <div className="flex flex-col">
      {RenderLabel({ label, id, required, disabled })}
      <div className={classNames(label && 'mt-1')}>
        <textarea
          {...props}
          {...registerReturn}
          rows={rows}
          disabled={disabled}
          name={name}
          aria-label={props['aria-label'] || label}
          id={id}
          required={required}
          value={inputValue}
          onChange={(e) => {
            handleTextChange(e);
          }}
          data-testid={testid}
          testid={testid}
          className={classNames(
            'textArea-border block min-h-[60px] w-full rounded-md border py-1.5',
            isError
              ? 'bg-input border-red-500 pr-10 text-red-600 placeholder:text-red-400 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:outline-none sm:text-sm sm:leading-6'
              : 'focus-visible:ring-ring text-default bg-input shadow-sm placeholder:text-[#5D5D5D] focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:opacity-75 sm:text-sm sm:leading-6',
            className
          )}
        />
      </div>
      <div>
        <InputHelpText id={id} name={name} helpText={helpText} errors={errors}></InputHelpText>
      </div>
    </div>
  );
}
