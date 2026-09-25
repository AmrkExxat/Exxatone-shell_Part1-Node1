import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../../utilities';

export interface DrawerProps extends BaseComponentProps {
  title: string | ReactNode;
  onClose: () => void;
}

export const DrawerWidth = {
  small: 'max-w-2xl',
  medium: 'max-w-4xl',
  large: 'max-w-7xl',
  xLarge: 'max-w-10xl',
};

export type DrawerComponentProps = {
  drawerOpen: boolean;
  size?: 'medium' | 'small' | 'large' | 'xLarge';
  drawer: DrawerProps;
  children: React.ReactNode;
  actionButtons?: React.ReactNode; // Mark as optional
  fullDrawer?: boolean;
  closeButtonTitle?: string;
  zIndexClass?: string;
  contentClass?: string;
};
