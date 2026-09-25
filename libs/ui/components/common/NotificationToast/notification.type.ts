export type NotificationType = 'Message' | 'Update';

export type NotificationSubType =
  | 'Slot Requested' // CREATE/Slot-Request
  | 'Slot Declined' // UPDATE/Slot-Request
  | 'Slot Approved' // UPDATE/Slot-Request
  | 'Request Updated'
  | 'Student Assigned' //  CREATE-ASSIGNEE/Slot-Request
  | 'Student Removed' // DELETE-ASSIGNEE/Slot-Request
  | 'Schedule Updated' // UPDATE/Assignments
  | 'Schedule Canceled';

export interface NotificationProps {
  type: NotificationType;
  heading: string;
  subHeading: string;
  imageLogo: string | null;
  siteName: string;
  subType?: NotificationSubType;
  isReadReceptEnabled?: boolean;
  isRead?: boolean;
  onClick?: (index: number) => undefined;
  onMarkToggle?: (newReadStatus: boolean) => undefined;
  extraDetails?: string;
  index?: number;
  closeOnClick?: boolean;
  /** Auto-dismiss delay in ms. Default 5000. Pass false to disable. */
  autoCloseMs?: number | false;
  /** Pause auto-close while the pointer is over the toast. Default true. */
  pauseOnHover?: boolean;
  /** Stable id (e.g. FCM msgId) — used as react-toastify toastId for dismiss/dedup */
  messageId?: string;
}
