import { HTMLProps } from 'react';
import { BaseComponentProps } from '../../../../utilities';

export interface AvatarPropsType extends HTMLProps<HTMLElement>, BaseComponentProps {
  firstName?: string;
  lastName?: string;
  bgColor?: string;
  fgColor?: string;
  src?: string;
  alt?: string;
}
