import { type ReactNode } from 'react';

export default interface CheckBoxGroupProps {
  title?: string;
  children: ReactNode;
  required?: boolean;
}
