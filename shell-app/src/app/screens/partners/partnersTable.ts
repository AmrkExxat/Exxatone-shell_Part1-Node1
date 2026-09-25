/** Exxat One partner data-table grid (Figma node 1020:1618). Light grid: #eceef1. */
export const partnersTableGrid = {
  table: 'w-full min-w-[1650px] border-collapse text-[14px] leading-5',
  outer:
    'overflow-hidden rounded-lg border border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  headCell:
    'h-[45px] border-b border-r border-[#eceef1] bg-[#e2e4f4] px-4 py-3 text-left align-middle text-[14px] font-medium uppercase tracking-[0.7px] leading-5 text-[#111827] whitespace-nowrap last:border-r-0',
  /** Long labels: wrap at spaces only (never mid-word, e.g. ACTIONS). */
  headCellWrap:
    'min-h-[45px] max-w-0 border-b border-r border-[#eceef1] bg-[#e2e4f4] px-4 py-3 text-left align-middle text-[14px] font-medium uppercase tracking-[0.7px] leading-5 text-[#111827] whitespace-normal break-normal last:border-r-0',
  bodyCell:
    'min-h-[56px] border-b border-r border-[#eceef1] px-4 py-4 align-top text-[14px] leading-5 text-[#424242] last:border-r-0',
  bodyRow: 'bg-white hover:bg-[#fafafa]',
  footer: 'border-t border-[#eceef1] bg-[#fafafa] px-4 py-3 text-[14px] leading-5 text-[#424242]',
  /** Program Contacts on partner detail — fits card width (no list min-width). */
  contactsTable: 'w-full max-w-full border-collapse text-[14px] leading-5 table-fixed',
  contactsHeadCell:
    'h-[45px] border-b border-r border-[#eceef1] bg-[#e2e4f4] px-3 py-3 text-left align-middle text-[14px] font-medium uppercase tracking-[0.7px] leading-5 text-[#111827] whitespace-nowrap last:border-r-0',
  contactsBodyCell:
    'border-b border-r border-[#eceef1] px-3 py-3 align-middle text-[14px] leading-5 text-[#424242] last:border-r-0',
} as const;
