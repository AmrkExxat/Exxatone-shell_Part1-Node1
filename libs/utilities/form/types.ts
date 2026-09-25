export interface FormControlType {
  isValid?: boolean;
  isTouched?: boolean;
  error?: string;
}

export type FormControlFormStateType = Record<string, FormControlType>;
