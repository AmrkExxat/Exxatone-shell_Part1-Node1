import { type HTMLProps } from 'react';
import { BaseComponentProps } from '../../../../utilities';

export type ButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'link' | 'custom';

export type ButtonColor = 'primary' | 'accent' | 'warn' | any;

export type ButtonType = 'button' | 'submit' | 'reset' | undefined;

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;

export interface ButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size'>, BaseComponentProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  type?: ButtonType;
  disabled?: boolean;
  size?: ButtonSize;
  rounded?: string;
  ariaDescribedBy?: string;
  ariaCurrent?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
