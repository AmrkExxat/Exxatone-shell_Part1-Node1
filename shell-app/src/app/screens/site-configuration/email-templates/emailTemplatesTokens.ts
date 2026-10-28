export const et = {
  pageIntro: 'text-[14px] font-normal leading-5 text-[#4a5565]',
  layout: 'flex min-h-0 flex-col gap-4 lg:flex-row lg:items-start',
  treeCard:
    'w-full shrink-0 overflow-hidden rounded-[8px] bg-white shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] lg:w-[320px]',
  treeScroll: 'max-h-[min(720px,calc(100vh-220px))] overflow-y-auto',
  /** Quiet indigo wash; #283593 on #eef0fb meets WCAG AA for this size. */
  groupBar:
    'sticky z-20 flex h-9 items-center border-b border-[#d5daf5] bg-[#eef0fb] px-3 text-[12px] font-semibold leading-4 text-[#283593]',
  groupBarFirst: 'top-0 z-30',
  groupBarNext: 'top-9 z-20',
  categoryRow:
    'relative z-0 flex items-center gap-2 border-b border-[#eceef1] bg-[#fafafa] px-3 py-2 text-[13px] font-semibold text-[#364153]',
  eventBtn:
    'relative z-0 flex w-full items-start justify-between gap-2 border-b border-[#f3f4f6] px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3f51b5]',
  eventBtnIdle: 'bg-white text-[12px] font-normal leading-4 text-[#4a5565] hover:bg-[#f5f5f5]',
  /** Bold indigo + left bar. No row fill, so it does not match the group band. #283593 on white is 10.4:1. */
  eventBtnActive:
    'bg-white text-[13px] font-semibold leading-5 text-[#283593] shadow-[inset_3px_0_0_#3f51b5] hover:bg-[#f5f5f5]',
  /** Soft count pill. #3a3f47 on #eceef1 is 9.1:1 (WCAG AA). */
  countPill:
    'inline-flex min-w-[22px] shrink-0 items-center justify-center rounded-full bg-[#eceef1] px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-[#3a3f47]',
  mainPane: 'min-w-0 flex-1',
  paneHeader: 'mb-4 flex flex-wrap items-center justify-between gap-3',
  paneTitle: 'text-[18px] font-semibold leading-6 text-[#101828]',
  btnPrimary:
    'inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] bg-[#3f51b5] px-4 text-[14px] font-medium text-white hover:bg-[#3544a5]',
  cardStack: 'flex flex-col gap-3',
  templateCard:
    'rounded-[8px] bg-white p-4 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]',
  templateName: 'text-[15px] font-semibold leading-5 text-[#111827]',
  badgeBase: 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-4',
  badgeStandard: 'border border-[#d1d5dc] bg-white text-[#616161]',
  badgeCustomized: 'bg-[#eef0fb] text-[#283593]',
  badgeDefault: 'bg-[#e8f5e9] text-[#2e7d32]',
  badgeAudience: 'bg-[#f3f4f6] text-[#616161]',
  subjectPreview: 'mt-2 text-[14px] font-normal leading-5 text-[#4a5565]',
  actionsRow: 'mt-3 flex flex-wrap items-center justify-end gap-2',
  linkAction: 'text-[13px] font-medium text-[#3f51b5] hover:underline disabled:pointer-events-none disabled:text-[#9e9e9e]',
  iconActions: 'flex items-center gap-1',
  iconBtn:
    'inline-flex size-8 items-center justify-center rounded-[6px] text-[#616161] hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:text-[#bdbdbd] disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]',
  historyStrip:
    'mt-3 flex w-full items-center justify-between gap-2 rounded-[4px] bg-[#fafafa] px-3 py-2 text-left text-[12px] font-normal text-[#616161] hover:bg-[#f5f5f5]',
  historyPanel: 'mt-2 space-y-2 border-t border-[#eceef1] pt-3 text-[12px] leading-4 text-[#616161]',
  rulesHint: 'mt-4 text-[13px] font-normal leading-5 text-[#757575]',
  emptyState: 'px-4 py-12 text-center text-[14px] text-[#757575]',
  dialogContent:
    'gap-0 rounded-lg border-[#eceef1] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:max-w-[520px] [&>button]:top-4 [&>button]:right-4',
  dialogHeader: 'space-y-1 border-b border-[#eceef1] px-6 py-4 text-left',
  dialogTitle: 'text-[16px] font-semibold text-[#212121]',
  dialogDesc: 'text-[13px] font-normal leading-5 text-[#616161]',
  dialogBody: 'px-6 py-4',
  dialogFooter: 'flex justify-end gap-2 border-t border-[#eceef1] px-6 py-4',
  dialogBtnSecondary:
    'inline-flex h-9 items-center justify-center rounded-[6px] border border-[#3f51b5] bg-white px-4 text-[14px] font-medium text-[#3f51b5] hover:bg-[#f5f7ff]',
  dialogBtnPrimary:
    'inline-flex h-9 items-center justify-center rounded-[6px] bg-[#3f51b5] px-4 text-[14px] font-medium text-white hover:bg-[#3544a5] disabled:cursor-not-allowed disabled:bg-[#eeeeee] disabled:text-[#9e9e9e]',
  pickCard:
    'flex w-full flex-col gap-1 rounded-[6px] border border-[#eceef1] bg-white p-3 text-left hover:border-[#c5cae9] hover:bg-[#fafbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]',
  scratchBtn:
    'flex w-full items-center justify-center rounded-[6px] border border-[#888888] bg-white px-4 py-3 text-[14px] font-medium text-[#212121] hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]',
  orLabel: 'py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#9e9e9e]',
  textInput:
    'h-[34px] w-full rounded-[4px] border border-[#e5e7eb] bg-white px-3 text-[14px] text-[#212121] outline-none focus:border-[#3f51b5] focus-visible:ring-2 focus-visible:ring-[#3f51b5]',
  previewBody: 'max-h-[min(60vh,480px)] overflow-y-auto rounded-[6px] border border-[#eceef1] bg-white p-4 text-[14px] leading-6 text-[#212121] whitespace-pre-wrap',
  tokenHighlight: 'rounded-sm bg-[#fff3cd] px-0.5 text-[#7a5c00]',
} as const;
