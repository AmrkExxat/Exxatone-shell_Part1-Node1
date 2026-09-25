import { type PencilIcon } from '@heroicons/react/24/outline';
import { type HTMLProps } from 'react';
import { type FieldValues, type FieldErrors, type UseFormRegisterReturn } from 'react-hook-form';
import { BaseComponentProps } from '../../../../../../../utilities';

export type HeroIcon = typeof PencilIcon;

export interface TextInputProps extends HTMLProps<HTMLInputElement>, BaseComponentProps {
  label?: string;
  ref?: React.Ref<HTMLInputElement>;
  TrailingIcon?: React.ReactNode;
  LeadingIcon?: React.ReactNode;
  name: string;
  registerReturn?: UseFormRegisterReturn<string>;
  errors?: FieldErrors<FieldValues>;
  helpText?: string;
  value?: string;
  enableLabelClass?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  infoMsg?: string;
  prevDefaultData?: any;
}

export type InputHelpTextProps = {
  helpText?: string;
  errors?: FieldErrors<FieldValues>;
  name: string;
  id: string;
};

export type InputClassTypes = 'Normal' | 'Disabled' | 'Error';
