/** Overview page — Figma-aligned section chrome (hover + layout tokens). */
export const availabilityOverviewChrome = {
  kpiCard:
    'rounded-lg border border-[#eceef1] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
  kpiTitle: 'text-[13px] font-medium leading-snug text-[#424242]',
  kpiValue: 'mt-3 text-[28px] font-semibold leading-8 text-[#212121]',
  kpiSub: 'mt-1 text-[12px] font-normal leading-4 text-[#757575]',
  kpiCta: 'shrink-0 text-[13px] font-medium text-[#3f51b5] hover:underline',
  sectionTitle: 'text-base font-semibold leading-6 text-[#212121]',
  sectionSubtitle: 'mt-0.5 text-[13px] font-normal leading-5 text-[#757575]',
  activityItem:
    'rounded-lg px-3 py-3 transition-colors hover:bg-[#f8f9fa] [&:not(:last-child)]:mb-1',
  activityIconWrap:
    'flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ede7f6]',
  activityTitle: 'text-[13px] font-medium leading-5 text-[#212121]',
  activityLabel: 'font-semibold text-[#424242]',
  activityMeta: 'mt-1 text-[12px] leading-4 text-[#9e9e9e]',
  breakdownColumn: 'min-w-0 flex-1 px-5 first:pl-0 last:pr-0 md:border-r md:border-[#eceef1] md:last:border-r-0',
  breakdownColumnTitle: 'text-[13px] font-semibold text-[#424242]',
  breakdownCount: 'font-semibold text-[#212121]',
  breakdownPct: 'text-[#9e9e9e]',
  /** Fills card width — no horizontal scroll; columns share space via colgroup %. */
  highDemandTable: 'w-full max-w-full border-collapse text-[14px] leading-5 table-fixed',
  /** High-demand table headers — same typography/padding on every column. */
  highDemandHead:
    'max-w-0 min-h-[45px] overflow-hidden border-b border-r border-[#eceef1] bg-[#e2e4f4] px-2 py-2 text-left align-middle text-[11px] font-medium uppercase leading-[14px] tracking-[0.45px] text-[#111827] whitespace-normal break-normal',
  highDemandBodyCell: 'max-w-0 px-2',
  highDemandNameCell: 'whitespace-nowrap',
  highDemandNameLink: 'block w-full truncate text-left',
  highDemandMetricCell: 'whitespace-nowrap',
  highDemandRow: 'transition-colors hover:bg-[#eef2ff]',
  experiencePill:
    'inline-flex rounded-full bg-[#e3f2fd] px-2.5 py-0.5 text-[12px] font-medium text-[#1565c0]',
  metricBlue: 'font-medium text-[#2563eb]',
  metricGreen: 'font-medium text-[#2e7d32]',
} as const;
