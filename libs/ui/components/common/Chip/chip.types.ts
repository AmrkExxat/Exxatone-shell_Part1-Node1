import { HTMLProps } from 'react';
import { SxProps } from '@mui/system';
import { AvatarProps } from '@mui/material/Avatar';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { BaseComponentProps } from '../../../../utilities';

export interface ChipProps
  extends Omit<HTMLProps<HTMLDivElement>, 'color' | 'size'>, BaseComponentProps {
  label: string;
  ref?: React.Ref<HTMLDivElement>;
  onDelete?: () => void;
  disabled?: boolean;
  icon?: React.ReactElement<SvgIconProps>;
  avatar?: React.ReactElement<AvatarProps>;
  variant?: 'filled' | 'outlined';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium';
  sx?: SxProps;
  clickable?: boolean;
  component?: string;
  deleteIcon?: any;
  className?: string;
}
