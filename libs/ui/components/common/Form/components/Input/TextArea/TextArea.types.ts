import { type FieldValues, type UseFormRegisterReturn, type FieldErrors } from 'react-hook-form';
import { BaseComponentProps } from '../../../../../../../utilities';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>, BaseComponentProps {
  label?: string;
  ref?: React.Ref<HTMLInputElement>;
  registerReturn?: UseFormRegisterReturn<string>;
  disabled?: boolean;
  helpText?: string;
  name: string;
  value?: string;
  errors?: FieldErrors<FieldValues>;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
