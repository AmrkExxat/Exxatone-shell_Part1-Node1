import { BaseComponentProps } from '../../../../utilities';

export interface BreadCrumbItemType {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadCrumbsProps extends BaseComponentProps {
  items: BreadCrumbItemType[];
  metaInformation?: React.ReactNode;
  onItemClick?: (item: BreadCrumbItemType) => void;
  separator?: React.ReactNode;
  ariaLabel?: string;
  router?: any;
}
