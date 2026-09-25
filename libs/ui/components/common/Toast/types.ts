import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../../utilities';
import { type HTMLProps } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'custom';
export type ToastPositionType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type ToastListProps = {
  data: ToastProps[];
  position: ToastPositionType;
  onClose: (id: string) => void;
  onClick: (id: any) => void;
  classWrapper?: string;
};

export interface ToastProps extends Omit<HTMLProps<HTMLDivElement>, 'size'>, BaseComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  message: ReactNode;
  type?: ToastType;
  onClose?: () => void;
  onClick?: (id: any) => void;
  showIcon?: boolean;
  showClose?: boolean;
  autoClose?: boolean;
  duration?: number;
  icon?: ReactNode;
  actionText?: string;
  customIcon?: ReactNode;
}
