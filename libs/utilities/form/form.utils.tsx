import { FormControlFormStateType } from './types';

export const getFormControlEror = (
  controlName: keyof FormControlFormStateType,
  formControlState: FormControlFormStateType | null
) => {
  return formControlState?.[controlName]?.error;
};

export const setFormControlState = (
  fieldName: string,
  formControlState: FormControlFormStateType | null,
  setFormControlState: React.Dispatch<React.SetStateAction<FormControlFormStateType | null>>,
  isTouched?: boolean,
  isValid?: boolean,
  error?: string
): void => {
  if (formControlState) {
    setFormControlState({
      ...formControlState,
      [fieldName]: {
        isTouched,
        isValid,
        error,
      },
    });
  } else {
    setFormControlState({
      [fieldName]: {
        isTouched,
        isValid,
        error,
      },
    });
  }
};
