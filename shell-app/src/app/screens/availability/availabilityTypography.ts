import { partnersFont, partnersListChrome, partnersSurfaces, partnersType } from '../partners/partnersTypography';

export { partnersFont, partnersListChrome, partnersSurfaces, partnersType };

export const availabilityChrome = {
  moduleSticky: 'sticky top-0 z-30 bg-[#f5f5f5] border-b border-[#eceef1]',
  /** List: status sub-tabs + filters + table header — pins under module chrome while main scrolls. */
  listStickyToolbar:
    'sticky z-20 bg-[#f5f5f5] top-[var(--availability-module-chrome-height,56px)]',
  moduleHeaderInner:
    'grid grid-cols-1 items-center gap-y-3 px-6 py-3 min-h-[56px] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-4 lg:gap-y-0',
  moduleTitle: 'text-lg font-medium leading-6 text-[#212121] lg:justify-self-start',
  tabPillWrap: 'flex justify-center lg:justify-self-center',
  /** Figma 571:14960 — segmented tab list. */
  tabListOuter: 'flex justify-center',
  tabListRow:
    'inline-flex items-stretch overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]',
  tabSegment:
    'inline-flex min-h-[40px] items-center justify-center whitespace-nowrap px-6 text-center text-[14px] font-medium leading-5 no-underline transition-colors',
  tabSegmentActive: 'relative z-[1] rounded-lg bg-[#3f51b5] text-white',
  tabSegmentIdle: 'bg-white text-[#111827] hover:bg-[#f9fafb]',
  tabSegmentFirst: 'rounded-l-lg',
  tabSegmentLast: 'rounded-r-lg',
  addBtnWrap: 'flex shrink-0 flex-col items-stretch gap-1.5 lg:col-start-3 lg:justify-self-end',
  addBtn:
    'inline-flex h-9 min-w-[180px] items-center justify-between gap-2 rounded-[6px] bg-[#3f51b5] px-3 text-[14px] font-medium text-white shadow-[0_2px_4px_rgba(63,81,181,0.25)] hover:bg-[#3544a5]',
  bulkHistoryLink:
    'text-left text-[13px] font-normal leading-4 text-[#3f51b5] hover:underline',
  dropdownItem:
    'flex cursor-pointer items-start gap-2 py-2.5 text-[14px] leading-snug text-[#212121] focus:bg-[#f5f5f5]',
  statusSubNav: 'flex items-center gap-6 border-b border-[#eceef1] px-4 py-2',
  statusSubActive: 'border-b-2 border-[#3f51b5] pb-2 text-[14px] font-medium text-[#3f51b5]',
  statusSubIdle: 'pb-2.5 text-[14px] font-normal text-[#757575] hover:text-[#212121]',
  /** DS Status — Published (AvailabilityStatus.ACTIVE / StatusBadge confirmed). */
  publishedPill:
    'inline-flex items-center rounded-full bg-[#C1FB9B] px-2.5 py-0.5 text-[12px] font-medium text-[#333333]',
  draftPill:
    'inline-flex items-center rounded-full bg-[#E5E7EB] px-2.5 py-0.5 text-[12px] font-medium text-[#333333]',
  /** Figma 571:15049 — combined scope + search field. */
  searchComboOuter:
    'flex h-[34px] w-full min-w-[280px] max-w-[420px] shrink-0 items-center rounded-[4px] border border-[#888888] bg-white',
  searchComboScopeBtn:
    'flex h-full min-w-[100px] max-w-[100px] shrink-0 items-center justify-between gap-1 border-0 bg-transparent py-0 pl-2 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5] focus-visible:ring-offset-0',
  searchComboDivider: 'h-5 w-px shrink-0 bg-[#d1d5dc]',
  searchComboInput:
    'min-h-[20px] min-w-0 flex-1 border-0 bg-transparent px-2 text-[14px] font-normal leading-5 text-[#1f2937] placeholder:text-[#1f2937]/60 outline-none focus:ring-0',
  searchComboClear:
    'flex w-6 shrink-0 items-center justify-center text-[#888888] hover:text-[#424242]',
  searchComboSearchIcon: 'flex shrink-0 items-center px-2',
  filterBarRow: 'flex flex-wrap items-center gap-2',
  tableCardTop:
    'overflow-hidden rounded-t-lg border border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  tableCardBottom:
    '-mt-px overflow-hidden rounded-b-lg border border-t-0 border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
} as const;
