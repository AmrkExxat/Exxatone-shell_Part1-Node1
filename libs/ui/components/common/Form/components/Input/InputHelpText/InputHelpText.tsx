import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { type InputHelpTextProps } from '../constants';

export default function InputHelpText({
  errors = {},
  helpText,
  name,
  id,
}: InputHelpTextProps): JSX.Element | null {
  if (errors[name]?.message !== undefined) {
    return (
      <ErrorMessage
        name={name}
        errors={errors}
        render={({ messages, message }) => {
          if (message !== undefined) {
            return (
              <p className="mt-2 text-sm text-red-600" id="email-error" role="alert">
                {message}
              </p>
            );
          }
          return (
            messages !== undefined &&
            Object.entries(messages).map(([type, message]) => (
              <p key={type} className="mt-2 text-sm text-red-600" id="email-error">
                {String(message)}
              </p>
            ))
          );
        }}
      />
    );
  } else if (helpText !== undefined) {
    return (
      <p className="my-1 text-xs font-thin text-gray-500" id={id}>
        {helpText}
      </p>
    );
  } else {
    return null;
  }
}
