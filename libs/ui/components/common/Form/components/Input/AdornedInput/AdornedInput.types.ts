import { type HTMLProps } from 'react';
import { type FieldValues, type FieldErrors, type UseFormRegisterReturn } from 'react-hook-form';
import { BaseComponentProps } from '@utilities';

/**
 * Props for the AdornedInput component.
 * Extends native input attributes and supports react-hook-form integration plus optional adornments.
 */
export interface AdornedInputProps extends HTMLProps<HTMLInputElement>, BaseComponentProps {
  /** Label shown above the input. */
  label?: string;
  /** Form field name; used for registration and error lookup. */
  name: string;
  /** Marks the field as required (label indicator and native attribute). */
  required?: boolean;
  /** Disables the input and applies disabled styling. */
  disabled?: boolean;
  /** Content rendered at the start of the input (e.g. icon, prefix text). */
  startAdornment?: React.ReactNode;
  /** Content rendered at the end of the input (e.g. icon, suffix, unit). */
  endAdornment?: React.ReactNode;
  /** Return value from `register()` (react-hook-form); wires validation and change handling. */
  registerReturn?: UseFormRegisterReturn<string>;
  /** Form errors from react-hook-form; messages for `name` are shown below the input. */
  errors?: FieldErrors<FieldValues>;
  /** Helper text shown below the input; hidden when there is an error for this field. */
  helpText?: string;
  /** When true, applies label-specific styling classes to the label. */
  enableLabelClass?: boolean;
  /** Optional info message or tooltip content for the label. */
  infoMsg?: string;
  /** Optional change handler; runs in addition to registerReturn's onChange when both are set. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** When true (default), shows an error icon in the end slot when the field has an error. */
  showErrorIcon?: boolean;
  /** Class name for the outer wrapper (label + container + help/error). */
  className?: string;
  /** Class name for the flex container that wraps the input and adornments. */
  containerClassName?: string;
  /** Class name for the native input element. */
  inputClassName?: string;
  /** Class name for the start adornment wrapper. */
  startAdornmentClassName?: string;
  /** Class name for the end adornment wrapper (includes error icon when shown). */
  endAdornmentClassName?: string;
}
