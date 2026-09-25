export type NotificationDrawerProps = {
  drawerTitle?: any;
  /** Tab to open when the drawer opens: 0 = All, 1 = All Messages, 2 = All Updates. Defaults to 0. */
  tabIndex?: number;
  /** Unread Only toggle state when the drawer opens. Defaults to false. */
  unreadOnly?: boolean;
  onMarkAllRead: (data?: any) => void;
  onSettingClick: (data?: any) => void;
  onMessageClick: (data: any) => void;
  onMessageMarkAsReadClick: (data: any) => void;
  showSettingsIcon: boolean;
  pageSize: number;
  fetchPaginatedData: (
    page: number,
    filter: PaginationFilters,
    pageSize: number
  ) => Promise<{ totalCount: number; data: NotificationItemType[] }>;
  topReload?: number;
};

export type NotificationItemType = {
  id: any;
  title: string;
  description: string;
  type: 'message' | 'update' | 'UPDATE' | 'MESSAGE';
  primaryImage: any;
  secondaryImage?: any;
  sendBy: any;
  isRead: boolean;
  date: Date;
  timezone: string;
};

export type PaginationFilters = {
  type: string;
  unRead: boolean;
};

export type NotificationDrawerStateType = {
  open: boolean;
  loading: boolean;
  toggleAllRead?: boolean;
};

export const NotificationDrawerInitialState: NotificationDrawerStateType = {
  open: false,
  loading: true,
};

export type NotificationDrawerFunctions = {
  handleDrawer: (drawerStateData?: NotificationDrawerStateType) => void;
  closeDrawer: () => void;
};
