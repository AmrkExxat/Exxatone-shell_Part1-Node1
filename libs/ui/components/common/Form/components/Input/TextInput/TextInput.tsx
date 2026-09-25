import classNames from 'classnames';
import { JSX, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
import { faCircleXmark } from '@fortawesome/pro-solid-svg-icons';

import utils from './TextInput.utils';
import CONSTANTS from './TextInput.constants';
import { InputHelpText } from '../InputHelpText';
import { type TextInputProps } from '../constants';
import { RenderLabel } from '../../../shared';
import { ShowMore } from '../../../../ShowMore';
import RenderPreviousData from '../../RenderPreviousData/RenderPreviousData';

export default function TextInput({
  label,
  helpText,
  disabled = false,
  enableLabelClass = false,
  errors = {},
  name,
  registerReturn,
  LeadingIcon,
  TrailingIcon,
  id,
  testid,
  required = false,
  className = '',
  infoMsg,
  showClearButton = false,
  handleClear,
  showMoreProp = { maxLength: 2 },
  isDisableTextUI = false,
  enablePrevRender = false,
  prevDefaultData = { label: 'Edited by Site', data: null },
  type = 'text',
  ...props
}: TextInputProps): JSX.Element {
  const { onChange: onChangeProp, ...restProps } = props;

  const isError = Boolean(errors[name]?.message);
  const hasLeadingIcon = Boolean(LeadingIcon);
  const hasTrailingIcon = Boolean(TrailingIcon);

  const inputClassName = utils.getInputClassName(isError, disabled, hasLeadingIcon);

  const handleChange = onChangeProp
    ? (e: ChangeEvent<HTMLInputElement>) => {
        registerReturn?.onChange?.(e);
        onChangeProp(e);
      }
    : registerReturn?.onChange;

  return (
    <div className="relative">
      {prevDefaultData?.data && disabled ? (
        <div className="flex w-full flex-wrap items-center justify-between gap-1">
          {RenderLabel({ label, id, required, disabled, enableLabelClass, infoMsg })}
          <RenderPreviousData
            label={prevDefaultData?.label}
            id={id}
            data={props?.defaultValue}
            previousData={prevDefaultData?.data}
            dataType={'string'}
          />
        </div>
      ) : (
        RenderLabel({ label, id, required, disabled, enableLabelClass, infoMsg })
      )}
      <div
        className={classNames(
          (isError || hasLeadingIcon || hasTrailingIcon || showClearButton) &&
            CONSTANTS.ICON_CONTAINING_DIV,
          label && 'mt-1'
        )}
      >
        {disabled && isDisableTextUI ? (
          <div className="form-disabled-value-text pl-0.5">
            {props?.defaultValue ? (
              <ShowMore
                type="list"
                rowData={[{ label: props?.defaultValue }]}
                selector={['label']}
                showTooltip={true}
                moreTextRequired={false}
                {...showMoreProp}
              />
            ) : (
              <>Not Specified</>
            )}
          </div>
        ) : (
          <>
            {hasLeadingIcon && LeadingIcon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {LeadingIcon}
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
              data-testid={testid}
              testid={testid}
              className={`${inputClassName} ${className}`}
              type={type}
              onChange={handleChange}
            />

            {/* Trailing Icon */}
            {hasTrailingIcon && !isError && TrailingIcon && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                {TrailingIcon}
              </div>
            )}

            {/* Clear Button */}
            {showClearButton && !disabled && (
              <button
                type="button"
                onClick={handleClear && handleClear}
                className="absolute inset-y-0 flex items-center px-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear input"
                style={{
                  right: '25px',
                }}
              >
                <FontAwesomeIcon icon={faCircleXmark} className="h-4 w-4" />
              </button>
            )}

            {/* Error Icon */}
            {isError && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="h-4 w-4 text-red-600"
                  aria-hidden="true"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Help Text */}
      {helpText && (
        <InputHelpText id={`${id}-help`} name={name} helpText={helpText} errors={errors} />
      )}

      {/* Error Message */}
      {isError && (
        <p className="my-1 text-xs text-red-600" id={`${id}-error`} role="alert">
          {typeof errors[name]?.message === 'string' ? errors[name]?.message : ''}
        </p>
      )}
    </div>
  );
}
