import { type HTMLProps } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';
import { BaseComponentProps } from '../../../../../../utilities';

export interface RadioProps extends Omit<HTMLProps<HTMLInputElement>, 'type'>, BaseComponentProps {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
  registerReturn?: UseFormRegisterReturn<string>;
  checked?: boolean;
  helpText?: string;
  errorText?: string;
  flexDir?: string;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
