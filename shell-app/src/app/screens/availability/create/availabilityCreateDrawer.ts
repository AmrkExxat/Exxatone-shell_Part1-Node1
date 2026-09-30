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
  publishSection: 'rounded-lg border border-[#eceef1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  publishSectionHeader:
    'mb-4 flex flex-col gap-3 border-b border-[#eceef1] pb-4 sm:flex-row sm:items-start sm:justify-between',
  publishSectionTitle: 'text-[16px] font-semibold leading-6 text-[#212121]',
  publishSectionHint: 'mt-1 max-w-3xl text-[13px] leading-snug text-[#616161]',
  publishPreferenceGrid: 'grid grid-cols-1 items-start gap-4 lg:grid-cols-2',
  publishPreferenceCard:
    'flex h-auto flex-col self-start rounded-[8px] border border-[#eceef1] bg-white p-4 shadow-[0_1px_1.5px_rgba(0,0,0,0.06)]',
  publishRemoveBtn:
    'mt-4 inline-flex items-center gap-2 self-end text-[14px] font-normal leading-5',
  publishRemoveBtnEnabled: 'text-[#3f51b5] hover:text-[#303f9f]',
  publishRemoveBtnDisabled:
    'cursor-default text-[#bdbdbd] hover:text-[#bdbdbd] disabled:pointer-events-none',
  tierPreferredDatesBtn:
    'mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[6px] border border-[#3f51b5] bg-white px-3 text-[14px] font-normal leading-5 text-[#3f51b5] hover:bg-[#f5f7ff] sm:w-auto sm:justify-start',
  tierDatesAccordionTrigger:
    'mt-3 flex h-10 w-full items-center justify-between rounded-[6px] border border-[#e0e0e0] bg-[#fafafa] px-3 text-left',
  tierDatesAccordionTitle: 'text-[14px] font-semibold leading-5 text-[#212121]',
  tierDatesList:
    'max-h-[220px] overflow-y-auto rounded-b-[6px] border border-t-0 border-[#e0e0e0] bg-white',
  tierDatesRow: 'border-b border-[#eceef1] px-4 py-3 last:border-b-0',
  tierDatesRowTitle: 'mb-2 text-[14px] font-semibold leading-5 text-[#212121]',
  tierDatesColLabel: 'text-[12px] font-normal leading-4 text-[#757575]',
  tierDatesColValue: 'mt-0.5 text-[14px] font-normal leading-5 text-[#212121]',
  schedulePublishingDialog: 'max-h-[min(720px,85vh)] overflow-hidden',
  schedulePublishingHeader: 'border-b border-[#eceef1] px-6 py-5',
  schedulePublishingTitle: 'text-[18px] font-semibold leading-6 text-[#212121]',
  schedulePublishingHint: 'mt-1 text-[14px] font-normal leading-5 text-[#616161]',
  schedulePublishingBody: 'max-h-[min(480px,55vh)] overflow-y-auto px-6 py-2',
  schedulePublishingRow:
    'grid gap-4 border-b border-[#eceef1] py-4 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_200px_200px] lg:items-start',
  schedulePublishingTierName:
    'text-[14px] font-semibold leading-5 text-[#212121] lg:pt-8',
  schedulePublishingDateCol: 'min-w-0',
  schedulePublishingFooter:
    'flex justify-end gap-3 border-t border-[#eceef1] px-6 py-4',
  /** Due date field + popover — compact width (Figma publish preference). */
  datePickerWrap: 'relative w-full max-w-[252px]',
  datePickerTrigger:
    'flex h-[38px] w-full items-stretch overflow-hidden rounded-[6px] border shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]',
  datePickerTriggerBorderDefault: 'border-[#888888] bg-white',
  datePickerTriggerEmphasisEmpty: 'border-[#c5cae9] bg-white',
  /** Pre-filled Publish on (faint indigo wash). */
  datePickerTriggerEmphasisFilled:
    'border-[#c5cae9] bg-[#f5f6fc] shadow-[0_1px_3px_rgba(63,81,181,0.12)]',
  datePickerTriggerOpen: 'border-[#3f51b5] ring-2 ring-[#3f51b5]/20',
  datePickerTriggerBtn: 'flex min-h-0 min-w-0 flex-1 items-center gap-2 px-3 text-left',
  datePickerClearBtn:
    'flex shrink-0 items-center self-stretch px-2 text-[#888888] hover:text-[#424242]',
  datePickerPopover:
    'absolute left-0 top-full z-20 mt-1 w-[252px] max-w-[min(252px,calc(100vw-3rem))] overflow-hidden rounded-[6px] border border-[#e5e7eb] bg-white p-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]',
  datePickerDayCell:
    'mx-auto flex h-7 w-7 min-h-7 min-w-7 items-center justify-center rounded-full text-[11px] leading-none',
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
