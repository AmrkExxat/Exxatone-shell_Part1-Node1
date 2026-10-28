import { partnersFont, partnersListChrome, partnersSurfaces, partnersType } from '../partners/partnersTypography';
import { partnersSearchFieldIcon } from '../partners/partnersTypography';

export { partnersFont, partnersListChrome, partnersSurfaces, partnersType, partnersSearchFieldIcon };

export const schedulesChrome = {
  moduleSticky: 'sticky top-0 z-30 bg-[#f5f5f5] border-b border-[#eceef1]',
  listStickyToolbar:
    'sticky z-20 bg-[#f5f5f5] top-[var(--schedules-module-chrome-height,72px)]',
  moduleHeaderInner:
    'grid grid-cols-1 items-center gap-y-3 px-6 py-3 min-h-[56px] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-4 lg:gap-y-0',
  moduleTitle: 'text-lg font-medium leading-6 text-[#212121] lg:justify-self-start',
  tabPillWrap: 'flex justify-center lg:justify-self-center',
  tabListOuter: 'flex justify-center',
  tabListRow:
    'inline-flex items-stretch overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]',
  tabSegment:
    'inline-flex min-h-[40px] items-center justify-center whitespace-nowrap px-6 text-center text-[14px] font-medium leading-5 no-underline transition-colors',
  tabSegmentActive: 'relative z-[1] rounded-lg bg-[#3f51b5] text-white',
  tabSegmentIdle: 'bg-white text-[#111827] hover:bg-[#f9fafb]',
  tabSegmentFirst: 'rounded-l-lg',
  tabSegmentLast: 'rounded-r-lg',
  tabNewBadge:
    'ml-1.5 inline-flex rounded bg-[#fef08a] px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none text-[#713f12]',
  addBtnWrap: 'flex shrink-0 lg:col-start-3 lg:justify-self-end',
  addBtn:
    'inline-flex h-8 items-center justify-center rounded-[6px] bg-[#3f51b5] px-3 text-[14px] font-medium text-white hover:bg-[#3544a5]',
  /** List kind: All Schedules | Group | Individual */
  listKindTabRow:
    'inline-flex items-stretch overflow-hidden rounded-lg border border-[#e5e7eb] bg-white',
  listKindTab:
    'inline-flex min-h-[40px] items-center justify-center whitespace-nowrap px-6 text-[14px] font-medium leading-5 no-underline',
  listKindActive: 'bg-[#3f51b5] text-white',
  listKindIdle: 'bg-white text-[#111827] hover:bg-[#f9fafb]',
  listTimelineRow:
    'mb-3 flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e7eb] pb-0 pt-1',
  timelineSubNav: 'flex flex-wrap items-center gap-6',
  timelineSubActive:
    'relative -mb-px inline-flex items-center gap-1.5 border-b-2 border-[#3f51b5] pb-2.5 pt-1 text-[14px] font-medium text-[#3f51b5]',
  timelineSubIdle:
    'inline-flex items-center gap-1.5 pb-2.5 pt-1 text-[14px] font-normal text-[#424242] hover:text-[#212121]',
  needsAttentionPanel:
    'overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
  needsAttentionHeader:
    'flex items-center gap-1.5 border-b border-[#f3f4f6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.04em] text-[#ea580c]',
  needsAttentionMetrics: 'flex items-stretch divide-x divide-[#eceef1]',
  needsAttentionMetric: 'flex min-w-[132px] items-center gap-2.5 px-3 py-2.5',
  needsAttentionIconWrap: 'flex size-9 shrink-0 items-center justify-center rounded-md',
  needsAttentionMetricTitle: 'text-[12px] leading-4 text-[#424242] whitespace-nowrap',
  needsAttentionViewLink: 'mt-0.5 text-[11px] font-medium text-[#3f51b5] hover:underline',
  searchComboOuter:
    'flex h-[34px] w-[300px] min-w-[220px] shrink items-center rounded-[4px] border border-[#888888] bg-white',
  searchComboScopeBtn:
    'flex h-full min-w-[108px] max-w-[128px] shrink-0 items-center justify-between gap-1 border-0 bg-transparent py-0 pl-2 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]',
  searchComboDivider: 'h-5 w-px shrink-0 bg-[#d1d5dc]',
  searchComboInput:
    'min-h-[20px] min-w-0 flex-1 border-0 bg-transparent px-2 text-[14px] font-normal leading-5 text-[#1f2937] placeholder:text-[#1f2937]/60 outline-none',
  searchComboClear:
    'flex w-6 shrink-0 items-center justify-center text-[#888888] hover:text-[#424242]',
  searchComboSearchIcon: 'flex shrink-0 items-center px-2',
  filterBarWrap: 'flex flex-col gap-2',
  filterBarPrimaryRow: 'flex flex-nowrap items-center justify-between gap-3',
  filterBarFacetsLine: 'flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden',
  filterBarSecondaryRow: 'flex flex-wrap items-center gap-2',
  facetBtn:
    'flex h-[34px] shrink-0 items-center gap-2 whitespace-nowrap rounded border border-[#d1d5db] bg-white px-2.5 text-[13px] text-[#111827] hover:bg-[#fafafa]',
  filterMoreLink:
    'shrink-0 whitespace-nowrap text-[12px] font-medium text-[#3f51b5] hover:underline',
  filterToolbarCluster: 'flex shrink-0 flex-nowrap items-center gap-0.5',
  addFilterBtn:
    'inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded border border-[#3f51b5] bg-white px-2 text-[13px] font-medium text-[#3f51b5] hover:bg-[#f5f6fc]',
  bulkEmailBtn:
    'inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded border border-[#d1d5db] bg-white px-2 text-[13px] font-medium text-[#424242] hover:bg-[#fafafa]',
  filterIconBtn:
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#6b7280] hover:bg-neutral-50',
  filterIconBtnBordered: 'rounded border border-[#d1d5db] bg-white hover:bg-[#fafafa]',
  filterToolbarDivider: 'mx-1 h-5 w-px shrink-0 bg-[#d1d5dc]',
  filterBarRow: 'flex flex-wrap items-center gap-2',
  tableCardTop:
    'overflow-hidden rounded-t-lg border border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  tableCardBottom:
    '-mt-px overflow-hidden rounded-b-lg border border-t-0 border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  statusPillGreen:
    'inline-flex items-center rounded-full bg-[#C1FB9B] px-2.5 py-0.5 text-[12px] font-medium text-[#333333]',
  statusPillAmber:
    'inline-flex items-center rounded-full bg-[#fff3e0] px-2.5 py-0.5 text-[12px] font-medium text-[#e65100]',
  statusPillGray:
    'inline-flex items-center rounded-full bg-[#E5E7EB] px-2.5 py-0.5 text-[12px] font-medium text-[#333333]',
  onboardingPillRed:
    'inline-flex items-center rounded-full bg-[#ffebee] px-2.5 py-0.5 text-[12px] font-medium text-[#c62828]',
  onboardingPillBlue:
    'inline-flex items-center rounded-full bg-[#e3f2fd] px-2.5 py-0.5 text-[12px] font-medium text-[#1565c0]',
} as const;

export const schedulesOverviewChrome = {
  kpiCard:
    'rounded-lg border border-[#eceef1] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] min-h-[126px]',
  kpiTitle: 'text-[13px] font-medium leading-snug text-[#424242]',
  kpiValue: 'mt-2 text-[28px] font-semibold leading-8 text-[#212121]',
  kpiSub: 'mt-1 text-[12px] font-normal leading-4 text-[#757575]',
  kpiCta: 'shrink-0 text-[13px] font-medium text-[#3f51b5] hover:underline inline-flex items-center gap-1',
  sectionTitle: 'text-base font-semibold leading-6 text-[#212121]',
  sectionSubtitle: 'mt-0.5 text-[13px] font-normal leading-5 text-[#757575]',
  chartPlaceholder:
    'flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-[#d1d5db] bg-[#fafafa] px-4 py-8 text-center text-[13px] text-[#757575]',
  activityItem:
    'rounded-lg px-3 py-3 transition-colors hover:bg-[#f8f9fa] [&:not(:last-child)]:mb-1',
  activityTitle: 'text-[13px] font-medium leading-5 text-[#212121]',
  activityMeta: 'mt-1 text-[12px] leading-4 text-[#9e9e9e]',
} as const;
