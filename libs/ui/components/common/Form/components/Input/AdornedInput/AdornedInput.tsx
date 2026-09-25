import { JSX, ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons';

import utils from './AdornedInput.utils';
import CONSTANTS from './AdornedInput.constants';
import { InputHelpText } from '../InputHelpText';
import { type AdornedInputProps } from './AdornedInput.types';
import { RenderLabel } from '../../../shared';

/**
 * A text input with optional start/end adornments (icons, prefix/suffix text, units).
 *
 * - Integrates with react-hook-form via `registerReturn` and `errors`.
 * - Renders label, help text, and validation error message with accessible IDs.
 * - When the field has an error, shows an error icon in the end slot (unless `showErrorIcon` is false).
 * - Supports custom class names for the wrapper, container, input, and adornment slots.
 *
 * @example
 * // With react-hook-form
 * const { register, formState: { errors } } = useForm();
 * <AdornedInput
 *   name="email"
 *   label="Email"
 *   registerReturn={register('email', { required: true })}
 *   errors={errors}
 *   startAdornment={<Icon icon={faEnvelope} />}
 * />
 *
 * @example
 * // With end adornment (e.g. unit)
 * <AdornedInput
 *   name="amount"
 *   label="Amount"
 *   endAdornment={<span className="text-muted">USD</span>}
 * />
 */
export default function AdornedInput({
  label,
  helpText,
  disabled = false,
  enableLabelClass = false,
  errors = {},
  name,
  registerReturn,
  startAdornment,
  endAdornment,
  id,
  testid,
  required = false,
  showErrorIcon = true,
  className,
  containerClassName,
  inputClassName,
  startAdornmentClassName,
  endAdornmentClassName,
  infoMsg,
  type = 'text',
  ...props
}: Readonly<AdornedInputProps>): JSX.Element {
  const { onChange: onChangeProp, ...restProps } = props;

  const isError = Boolean(errors[name]?.message);
  const shouldShowErrorIcon = isError && showErrorIcon;

  const containerClass = utils.getContainerClassName(isError, disabled);

  const handleChange = onChangeProp
    ? (e: ChangeEvent<HTMLInputElement>) => {
        registerReturn?.onChange?.(e);
        onChangeProp(e);
      }
    : registerReturn?.onChange;

  const ariaDescribedBy = [helpText ? `${id}-help` : undefined, isError ? `${id}-error` : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={twMerge('relative', className)}>
      {RenderLabel({ label, id, required, disabled, enableLabelClass, infoMsg })}

      <div className={twMerge(containerClass, label && 'mt-1', containerClassName)}>
        {startAdornment && (
          <div className={twMerge('flex shrink-0 items-center', startAdornmentClassName)}>
            {startAdornment}
          </div>
        )}

        <input
          {...restProps}
          {...registerReturn}
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={isError}
          aria-label={restProps['aria-label'] || label}
          aria-describedby={ariaDescribedBy || undefined}
          data-testid={testid}
          testid={testid}
          className={twMerge(CONSTANTS.INPUT_BASE, inputClassName)}
          type={type}
          onChange={handleChange}
        />

        {(endAdornment || shouldShowErrorIcon) && (
          <div className={twMerge('flex shrink-0 items-center gap-2', endAdornmentClassName)}>
            {endAdornment}
            {shouldShowErrorIcon && (
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="h-4 w-4 text-red-600"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>

      {helpText && (
        <InputHelpText id={`${id}-help`} name={name} helpText={helpText} errors={errors} />
      )}

      {isError && (
        <p className="my-1 text-xs text-red-600" id={`${id}-error`} role="alert">
          {typeof errors[name]?.message === 'string' ? errors[name]?.message : ''}
        </p>
      )}
    </div>
  );
}
