import { type HTMLProps } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';
import { BaseComponentProps } from '../../../../../../utilities';
export interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, 'type' | 'indeterminate'>, BaseComponentProps {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
  helpText?: string;
  registerReturn?: UseFormRegisterReturn<string>;
  indeterminate?: boolean;
}
