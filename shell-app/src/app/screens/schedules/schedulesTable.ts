import { partnersTableGrid } from '../partners/partnersTable';
import {
  schedulesStickyOnboardingRightPx,
  schedulesStickyScheduleStatusRightPx,
  schedulesStickyStudentLeftPx,
  schedulesTableWidthPx,
} from './schedulesTableColumns';

export const schedulesTableGrid = {
  ...partnersTableGrid,
  table: 'border-separate border-spacing-0 table-fixed text-[14px] leading-5',
  tableWidthStyle: { width: schedulesTableWidthPx, minWidth: schedulesTableWidthPx },
  pinShadowRight: 'avail-pin-shadow-right',
  pinShadowLeft: 'avail-pin-shadow-left',
  pinActionsDivider: 'avail-pin-actions-divider',
  stickyHeadPin: 'sticky z-[5] bg-[#e2e4f4]',
  stickyHeadPinLeft: 'sticky z-[7] bg-[#e2e4f4] avail-pin-shadow-right',
  stickyHeadPinRight: 'sticky z-[7] bg-[#e2e4f4] avail-pin-shadow-left',
  stickyHeadPinActions: 'sticky z-[5] bg-[#e2e4f4] avail-pin-actions-divider',
  stickyBodyPin: 'sticky z-[3] bg-white group-hover:bg-[#fafafa]',
  stickyBodyPinLeft: 'sticky z-[5] bg-white group-hover:bg-[#fafafa] avail-pin-shadow-right',
  stickyBodyPinRight: 'sticky z-[5] bg-white group-hover:bg-[#fafafa] avail-pin-shadow-left',
  stickyBodyPinActions: 'sticky z-[3] bg-white group-hover:bg-[#fafafa] avail-pin-actions-divider',
  stickyStudentLeftPx: schedulesStickyStudentLeftPx,
  stickyScheduleStatusRightPx: schedulesStickyScheduleStatusRightPx,
  stickyOnboardingRightPx: schedulesStickyOnboardingRightPx,
} as const;
