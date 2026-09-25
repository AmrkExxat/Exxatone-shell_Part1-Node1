import { BaseComponentProps } from '../../../../../../utilities';

export interface RadioGroupProps extends BaseComponentProps {
  title?: string;
  'aria-labelledby'?: string;
  children: React.ReactNode;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
  onChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  clearTrigger?: number;
}
