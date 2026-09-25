export interface NotificationConfigurationObject {
  icon?: any;
  heading: string;
  subHeading?: string;
  email?: boolean;
  inApp?: boolean;
  notificationKey?: string;
  disabled?: boolean;
  emailDisabled?: boolean;
  children?: NotificationConfigurationObject[];
  isChild: boolean;
}
