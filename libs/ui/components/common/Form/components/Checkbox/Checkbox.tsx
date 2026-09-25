import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type CheckboxProps } from './Checkbox.types';

export default function Checkbox({
  id,
  testid,
  name,
  label,
  helpText,
  registerReturn,
  disabled,
  required,
  className = '',
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  checked = false,
  indeterminate = false,
  ...props
}: CheckboxProps): JSX.Element {
  const { ref: incomingRef, ...restProps } = props as any;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isChecked, setIsChecked] = useState(checked);

  const mergedInputRef = useCallback(
    (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (registerReturn?.ref) {
        if (typeof registerReturn.ref === 'function') {
          registerReturn.ref(el);
        } else {
          (registerReturn.ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
        }
      }
      if (incomingRef) {
        if (typeof incomingRef === 'function') {
          incomingRef(el);
        } else {
          (incomingRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
        }
      }
    },
    [registerReturn, incomingRef]
  );

  const registerWithoutRef = useMemo(() => {
    if (!registerReturn) return {};
    const { ref: _regRef, ...rest } = registerReturn;
    return rest;
  }, [registerReturn]);

  const inputClasses =
    `h-4 w-4 rounded text-primary focus-indicator border disabled:cursor-not-allowed disabled:bg-disabled ${className}`.trim();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const newCheckedState = !isChecked;
      setIsChecked(newCheckedState);
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    if (onChange) {
      onChange(event);
    }
  };

  useEffect(() => {
    if (checked !== isChecked) {
      setIsChecked(checked);
    }
  }, [checked]);

  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  const ariaChecked = indeterminate ? 'mixed' : isChecked ? 'true' : 'false';

  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={id}
          data-testid={testid}
          testid={testid}
          name={name}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          required={required}
          aria-checked={ariaChecked}
          aria-disabled={disabled ? 'true' : 'false'}
          aria-labelledby={restProps['aria-label'] || label}
          aria-describedby={helpText ? `${id}-helptext` : undefined}
          aria-readonly={restProps['aria-readonly']}
          aria-hidden={restProps['aria-hidden']}
          tabIndex={restProps.tabIndex}
          role={restProps.role || 'checkbox'}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          onKeyUp={onKeyUp}
          className={inputClasses}
          {...restProps}
          {...registerWithoutRef}
          ref={mergedInputRef}
        />
      </div>
      <div className="text-sm leading-6">
        {label && (
          <label
            id={label}
            htmlFor={id}
            className={`ml-3 cursor-pointer font-medium ${disabled ? 'text-disabled' : 'text-default'}`}
          >
            {label}
          </label>
        )}
        {helpText && (
          <p
            id={`${id}-helptext`}
            className={`ml-3 ${disabled ? 'text-disabled' : 'text-gray-500'}`}
          >
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
}
