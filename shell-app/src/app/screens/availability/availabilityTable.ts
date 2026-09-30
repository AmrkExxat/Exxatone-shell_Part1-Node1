import { partnersTableGrid } from '../partners/partnersTable';
import {
  availabilityStickyNameLeftPx,
  availabilityStickyStatusRightPx,
  availabilityTableWidthPx,
} from './availabilityTableColumns';

/** Availability list grid — explicit width; grid lines match School Partners (#eceef1). */
export const availabilityTableGrid = {
  ...partnersTableGrid,
  table:
    'border-separate border-spacing-0 table-fixed text-[14px] leading-5',
  tableWidthStyle: { width: availabilityTableWidthPx, minWidth: availabilityTableWidthPx },
  headCell: partnersTableGrid.headCell,
  bodyCell: partnersTableGrid.bodyCell,
  pinShadowRight: 'avail-pin-shadow-right',
  pinShadowLeft: 'avail-pin-shadow-left',
  pinActionsDivider: 'avail-pin-actions-divider',
  stickyHeadPin: 'sticky z-[5] bg-[#e2e4f4]',
  /** Last left pin — shadow on right edge (Availability name). */
  stickyHeadPinLeft: 'sticky z-[7] bg-[#e2e4f4] avail-pin-shadow-right',
  /** First right pin — shadow on left edge (Status). */
  stickyHeadPinRight: 'sticky z-[7] bg-[#e2e4f4] avail-pin-shadow-left',
  stickyHeadPinActions: 'sticky z-[5] bg-[#e2e4f4] avail-pin-actions-divider',
  stickyBodyPin: 'sticky z-[3] bg-white group-hover:bg-[#fafafa]',
  stickyBodyPinLeft: 'sticky z-[5] bg-white group-hover:bg-[#fafafa] avail-pin-shadow-right',
  stickyBodyPinRight: 'sticky z-[5] bg-white group-hover:bg-[#fafafa] avail-pin-shadow-left',
  stickyBodyPinActions: 'sticky z-[3] bg-white group-hover:bg-[#fafafa] avail-pin-actions-divider',
  stickyNameLeftPx: availabilityStickyNameLeftPx,
  stickyStatusRightPx: availabilityStickyStatusRightPx,
} as const;
