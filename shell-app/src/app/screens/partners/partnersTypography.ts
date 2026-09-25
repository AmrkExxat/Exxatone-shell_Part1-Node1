/** Typography + surfaces aligned to Consortium / Exxat One partner references (Source Sans 3). */
/** Matches Figma / live Exxat One partner screens (loaded in index.html). */
export const partnersFont = "font-['Source_Sans_3',sans-serif]";

export const partnersType = {
  pageTitle: 'text-lg font-medium leading-6 text-[#212121]',
  primaryButton:
    'inline-flex h-8 items-center gap-1 rounded-[4px] bg-[#3f51b5] px-3 text-[13px] font-medium leading-4 text-white hover:bg-[#3544a5]',
  drawerTitle: 'text-[18px] font-semibold leading-6 text-[#212121]',
  cardTitle: 'text-base font-semibold leading-6 text-[#212121]',
  sectionMeta: 'text-sm font-normal leading-5 text-[#424242]',
  fieldLabel: 'text-sm font-semibold leading-5 text-[#212121]',
  fieldValue: 'text-sm font-normal leading-5 text-[#424242]',
  link: 'text-[14px] font-normal leading-5 text-[#2563eb] hover:underline cursor-pointer',
  tableHeader:
    'text-[14px] font-medium uppercase tracking-[0.7px] leading-5 text-[#111827]',
  badgeSm: 'text-xs font-medium leading-4',
  /** Contract pills — no border; full literals for Tailwind JIT. */
  contractPillGreen:
    'inline-flex w-fit items-center rounded-full bg-[#e8f5e9] px-1.5 py-px text-[11px] font-medium leading-[14px] text-[#1b5e20]',
  contractPillOrange:
    'inline-flex w-fit items-center rounded-full bg-[#fff3e0] px-1.5 py-px text-[11px] font-medium leading-[14px] text-[#e65100]',
  breadcrumb: 'text-sm font-normal text-[#2563eb]',
  tabActive: 'text-sm font-medium text-[#3f51b5]',
  tabIdle: 'text-sm font-normal text-[#6b7280] hover:text-[#212121]',
  /** Partner detail cover + tabs (reference profile header). */
  detailTitle: 'text-lg font-semibold leading-6 text-[#212121]',
  detailMeta: 'text-[13px] font-normal leading-5 text-[#424242]',
  detailTabActive: 'text-[13px] font-medium text-[#3f51b5]',
  detailTabIdle: 'text-[13px] font-normal text-[#757575] hover:text-[#212121]',
  outlinePrimaryButton:
    'inline-flex h-[34px] items-center gap-1.5 rounded-[4px] border border-[#3f51b5] bg-white px-3 text-[13px] font-medium leading-4 text-[#3f51b5] hover:bg-[#f5f7ff]',
} as const;

export const partnersSurfaces = {
  page: 'bg-[#f5f5f5]',
  card: 'rounded-lg border border-[#eceef1] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
  drawerBody: 'bg-[#eeeeee]',
  drawerPanel: 'rounded-lg border border-[#eceef1] bg-white p-6 shadow-sm',
} as const;

/** Edit Category sheet — Figma 1024:4638 (full class literals for Tailwind JIT). */
export const partnersDrawer = {
  sheet:
    'flex h-full flex-col gap-0 bg-[#f7f7f7] p-0 !w-[672px] !max-w-[672px] sm:!max-w-[672px] [&>button]:hidden',
  header:
    'flex max-h-12 min-h-12 shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white pl-3 pr-4 py-3',
  closeBtn:
    'flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-[#e4e7f6] text-[#5c6bc0] hover:bg-[#d8dcf0]',
  title: 'min-w-0 flex-1 text-[16px] font-semibold leading-6 text-[#111827]',
  updateBtn:
    'flex h-8 shrink-0 items-center justify-center rounded-[6px] bg-[#3f51b5] px-3 text-[14px] font-normal leading-5 text-white hover:bg-[#3544a5] disabled:opacity-50',
  bodyScroll: 'flex-1 overflow-y-auto bg-[#f7f7f7] px-4 pb-6 pt-4',
  formCard:
    'w-full rounded-[8px] bg-white p-4 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]',
  fieldGrid: 'grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2',
  fieldLabel: 'text-[14px] font-semibold leading-5 text-[#111827]',
  fieldValue: 'text-[14px] font-normal leading-5 text-[#364153]',
  addressLink:
    'text-left text-[14px] font-normal leading-5 text-[#155dfc] hover:underline',
  categoryLabel: 'pl-[3px] text-[14px] font-semibold leading-6 text-[#111827]',
  selectTrigger:
    'flex h-[38px] w-full items-center justify-between rounded-[6px] border border-[#888888] bg-white py-1.5 pl-3 pr-2 text-left shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#3f51b5]',
  selectValue: 'truncate pr-2 text-[14px] font-normal leading-5 text-[#5d5d5d]',
  selectChevron: 'size-3 shrink-0 text-[#616161]',
  optionSelected: 'text-[14px] font-medium leading-5 text-[#155dfc]',
  optionDefault: 'text-[14px] font-normal leading-5 text-[#111827]',
  addHeaderActions: 'flex shrink-0 items-center gap-2',
  requestProgramBtn:
    'flex h-8 max-w-[200px] items-center justify-center rounded-[6px] border border-[#3f51b5] bg-white px-2 text-[13px] font-normal leading-4 text-[#3f51b5] hover:bg-[#f5f7ff] sm:max-w-none sm:px-3 sm:text-[14px]',
  sectionLabelMuted: 'mb-1 text-[12px] font-normal leading-4 text-[#757575]',
  programSelectBtn:
    'flex h-[38px] w-full items-center gap-2 rounded-[6px] border border-[#888888] bg-white px-3 text-left shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]',
  programSelectPlaceholder: 'text-[14px] font-normal leading-5 text-[#5d5d5d]',
  dropdownPanel:
    'absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-[6px] border border-[#e5e7eb] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]',
  dropdownFooter:
    'flex items-center justify-between border-t border-[#e5e7eb] bg-white px-3 py-2',
} as const;

/** List page: grey title, then one white table card (filters + header + body). */
export const partnersListChrome = {
  contentInset: 'px-6',
  stickyToolbar: 'sticky top-0 z-30 bg-[#f5f5f5]',
  titleBar: 'border-b border-[#eceef1] bg-[#f5f5f5]',
  titleBarInner: 'px-6 py-3.5',
  tableCardTop:
    'overflow-hidden rounded-t-lg border border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  tableCardBottom:
    '-mt-px overflow-hidden rounded-b-lg border border-t-0 border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  filterBarInner: 'border-b border-[#eceef1] px-4 py-3',
  /** Sync horizontal scroll with body; no visible scrollbar on header strip. */
  headScroll:
    'overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  bodyScroll: 'overflow-x-auto',
} as const;
