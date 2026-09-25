import { BaseComponentProps } from '../../../../utilities';
import { ButtonColor, ButtonVariant } from '../Buttons';

export interface ModalProps extends BaseComponentProps {
  children?: React.ReactNode;
  open: boolean;
  setOpen: (s: boolean) => void;
  title?: string;
  description?: string;
  onSecondary?: (closeModal: boolean) => void;
  OnPrimary?: (isConfirmed: boolean) => void;
  secondaryAction?: string;
  primaryAction?: string;
  primaryButtonVariant?: ButtonVariant;
  primaryButtonColor?: ButtonColor;
  secondaryButtonVariant?: ButtonVariant;
  secondaryButtonColor?: ButtonColor;
  modalTitle?: string;
  zIndex?: string;
}
