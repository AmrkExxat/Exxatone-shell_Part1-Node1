/** Create Availability wide sheet — Figma 1045:19078 (shell tokens, ~90vw cap). */
export const availabilityCreateDrawer = {
  sheet:
    'flex h-full flex-col gap-0 bg-[#f5f5f5] p-0 !w-[min(90vw,1400px)] !max-w-[min(90vw,1400px)] sm:!max-w-[min(90vw,1400px)] [&>button]:hidden',
  metaRow: 'shrink-0 border-b border-[#eceef1] bg-white px-4 py-3',
  metaLabel: 'text-[14px] font-semibold text-[#111827] whitespace-nowrap',
  nameInput:
    'h-[34px] min-w-[140px] max-w-[200px] rounded-[4px] border border-[#888888] bg-white px-2 text-[14px] text-[#212121] outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]',
  modeBanner:
    'flex-1 rounded-[4px] border border-[#c5cae9] bg-[#e8eaf6] px-3 py-2 text-[13px] leading-snug text-[#3949ab]',
  stepperRow: 'shrink-0 border-b border-[#eceef1] bg-white px-4 py-3',
  /** Single bordered bar: chevron steps + vertical rule + Previous/Next (ref Figma 1045:52649). */
  stepperBar:
    'flex min-h-[44px] w-full items-stretch overflow-hidden rounded-[4px] border border-[#d1d5dc] bg-white',
  stepperTrack: 'flex min-w-0 flex-1 items-stretch overflow-x-auto',
  stepperActions:
    'flex shrink-0 items-center justify-end gap-2 bg-white px-4 py-2',
  btnPrimary:
    'inline-flex h-8 min-w-[80px] items-center justify-center rounded-[6px] bg-[#3f51b5] px-5 text-[14px] font-medium text-white hover:bg-[#3544a5] disabled:cursor-not-allowed disabled:border disabled:border-[#e0e0e0] disabled:bg-[#eeeeee] disabled:text-[#9e9e9e] disabled:hover:bg-[#eeeeee]',
  body: 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f5f5]',
  bodyScroll: 'min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3',
  bodyScrollLocation: 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f5f5] p-4',
  locationCard:
    'flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  locationScroll: 'create-loc-scroll min-h-0 flex-1 overflow-y-auto overflow-x-auto',
  filterBar:
    'create-loc-filter-bar flex flex-wrap items-center gap-2 border-b border-[#eceef1] bg-white px-4 py-3',
  searchInput:
    'flex h-[34px] min-w-[240px] flex-1 max-w-[400px] items-center gap-2 rounded-[4px] border border-[#888888] bg-white px-2.5',
  facetBtn:
    'inline-flex h-[34px] items-center gap-1.5 rounded-[4px] border border-[#d1d5dc] bg-white px-3 text-[13px] font-medium text-[#374151] hover:bg-[#fafafa]',
  selectionBar:
    'create-loc-selection-bar flex items-center justify-between border-b border-[#eceef1] bg-[#E8F0FE] px-4 py-2 text-[13px] font-normal text-[#1565c0]',
  clearAllBtn:
    'shrink-0 text-[13px] font-medium text-[#3f51b5] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f51b5]',
  table: 'create-loc-table w-full min-w-[720px] text-[13px] leading-5',
  th:
    'create-loc-table-head bg-[#F4F5FF] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.02em] text-[#424242]',
  td: 'bg-white px-3 py-2.5 align-middle text-[14px] font-normal text-[#212121]',
  tdSelected: 'bg-[#F4F5FF]',
  locationNameLink: 'text-left text-[14px] font-normal text-[#212121] hover:text-[#3f51b5] hover:underline',
  groupMore: 'text-[13px] text-[#757575]',
  paginationBar:
    'flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#eceef1] bg-white px-4 py-2.5 text-[13px] text-[#616161]',
  btnSecondary:
    'inline-flex h-8 min-w-[72px] items-center justify-center rounded-[6px] border border-[#3f51b5] bg-white px-4 text-[14px] font-medium text-[#3f51b5] hover:bg-[#f5f7ff] disabled:cursor-not-allowed disabled:opacity-50',
  placeholderPanel:
    'rounded-lg border border-dashed border-[#d1d5dc] bg-white p-8 text-center text-[14px] text-[#757575]',
} as const;

export const CREATE_AVAILABILITY_STEPS = [
  { id: 'location', label: 'Location', numberedLabel: '1. Location' },
  { id: 'basic-info', label: 'Basic Info', numberedLabel: '2. Basic Info' },
  { id: 'description', label: 'Description', numberedLabel: '3. Description' },
  { id: 'request-fields', label: 'Request Fields', numberedLabel: '4. Request Fields' },
  {
    id: 'publish-preferences',
    label: 'Publish Preferences',
    numberedLabel: '5. Publish Preferences',
  },
] as const;

export function generateAvailabilityDraftName(): string {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0')
    .slice(0, 6);
  return `INT-${hex}`;
}
