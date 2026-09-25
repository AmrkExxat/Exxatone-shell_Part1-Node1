export type StatusPropsType = {
  label: string;
  showIcon?: boolean;
  showDot?: boolean;
  type:
    | 'request'
    | 'schedule'
    | 'requirement'
    | 'availability'
    | 'internship'
    | 'helpcenter'
    | 'wishlist';
  id?: string;
};

export type StatusDetails = {
  label: string;
  bgColor: string;
  fgColor: string;
  icon?: any;
  iconColor?: string;
};
