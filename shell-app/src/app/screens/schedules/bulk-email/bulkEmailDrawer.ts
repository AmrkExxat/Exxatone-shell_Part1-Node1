/** Bulk Email compose drawer — mirrors Create Availability sheet chrome (shell tokens). */
export const bulkEmailDrawer = {
  sheet:
    'flex h-full flex-col gap-0 bg-[#f5f5f5] p-0 !w-[min(92vw,1320px)] !max-w-[min(92vw,1320px)] sm:!max-w-[min(92vw,1320px)] [&>button]:hidden',
  metaRow: 'shrink-0 border-b border-[#eceef1] bg-white px-4 py-2.5',
  metaLabel: 'text-[13px] font-normal leading-5 text-[#616161]',
  metaValue: 'text-[13px] font-semibold leading-5 text-[#212121]',
  stepperRow: 'shrink-0 border-b border-[#eceef1] bg-white px-4 py-3',
  stepperBar:
    'flex min-h-[44px] w-full items-stretch overflow-hidden rounded-[4px] border border-[#d1d5dc] bg-white',
  stepperTrack: 'flex min-w-0 flex-1 items-stretch overflow-x-auto',
  stepperActions: 'flex shrink-0 items-center justify-end gap-2 bg-white px-4 py-2',
  btnPrimary:
    'inline-flex h-8 min-w-[96px] items-center justify-center rounded-[6px] bg-[#3f51b5] px-5 text-[14px] font-medium text-white hover:bg-[#3544a5] disabled:cursor-not-allowed disabled:border disabled:border-[#e0e0e0] disabled:bg-[#eeeeee] disabled:text-[#9e9e9e] disabled:hover:bg-[#eeeeee]',
  btnSecondary:
    'inline-flex h-8 min-w-[72px] items-center justify-center rounded-[6px] border border-[#3f51b5] bg-white px-4 text-[14px] font-medium text-[#3f51b5] hover:bg-[#f5f7ff] disabled:cursor-not-allowed disabled:opacity-50',
  body: 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f5f5]',
  bodyScroll: 'min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3',

  card: 'rounded-lg border border-[#eceef1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  cardHeader: 'border-b border-[#eceef1] px-4 py-3',
  cardTitle: 'text-[14px] font-semibold leading-5 text-[#212121]',
  cardSubtitle: 'mt-0.5 text-[12px] font-normal leading-4 text-[#757575]',
  cardBody: 'p-4',

  /** Step 1 — recipients. */
  recipientsGrid: 'grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,0.9fr)]',
  personaRow:
    'flex items-start gap-3 border-b border-[#eceef1] px-4 py-3 last:border-b-0 hover:bg-[#fafafa]',
  personaCheckboxCol: 'pt-0.5',
  personaLabelRow: 'flex flex-wrap items-center gap-2',
  personaLabel: 'text-[14px] font-semibold leading-5 text-[#212121]',
  personaCount:
    'inline-flex items-center rounded-full bg-[#eef0fb] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#3f51b5]',
  personaDescription: 'mt-0.5 text-[12px] font-normal leading-4 text-[#757575]',
  recipientsTableWrap: 'max-h-[360px] overflow-y-auto',
  recipientsTable: 'w-full table-fixed border-collapse text-[13px] leading-5',
  recipientsTh:
    'sticky top-0 z-[1] border-b border-[#eceef1] bg-[#fafafa] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.02em] text-[#616161]',
  recipientsTd:
    'break-words border-b border-[#f3f4f6] px-3 py-2.5 align-top text-[13px] text-[#212121]',
  recipientsColName: 'w-[30%]',
  recipientsColEmail: 'w-[42%]',
  recipientsColDetails: 'w-[28%]',
  recipientsEmptyState:
    'flex min-h-[220px] flex-col items-center justify-center px-6 text-center text-[13px] text-[#757575]',
  roleBadge:
    'inline-flex w-fit items-center whitespace-nowrap rounded-full bg-[#eef0fb] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#3f51b5]',
  fieldGroup: 'flex flex-col gap-1.5',
  fieldLabel: 'text-[13px] font-semibold leading-5 text-[#212121]',
  fieldHint: 'text-[12px] font-normal leading-4 text-[#757575]',
  textInput:
    'h-[34px] w-full rounded-[4px] border border-[#888888] bg-white px-2.5 text-[14px] text-[#212121] outline-none placeholder:text-[#9e9e9e] focus-visible:ring-2 focus-visible:ring-[#3f51b5]',
  testAddressTrigger:
    'flex w-full items-center justify-between gap-2 text-left text-[13px] font-medium text-[#3f51b5] hover:underline',
  testAddressBanner:
    'mt-2 rounded-[4px] border border-[#ffe0b2] bg-[#fff8e1] px-3 py-2 text-[12px] leading-4 text-[#8d6e00]',

  /** Step 2 — compose. */
  composeModeRow: 'flex items-center gap-3 border-b border-[#eceef1] px-4 py-3',
  composeModeOption:
    'inline-flex h-8 items-center rounded-[6px] px-3 text-[13px] font-medium transition-colors',
  composeModeActive: 'bg-[#3f51b5] text-white',
  composeModeIdle: 'bg-white text-[#424242] hover:bg-[#f5f5f5]',
  composeGrid: 'grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]',
  templateSelectTrigger:
    'flex h-[38px] w-full items-center justify-between rounded-[6px] border border-[#888888] bg-white px-3 text-left text-[14px] text-[#212121] shadow-[0_1px_3px_rgba(0,0,0,0.1)]',
  editorToolbar:
    'flex flex-wrap items-center gap-0.5 border-b border-[#eceef1] bg-[#fafafa] px-2 py-1.5',
  editorToolbarBtn:
    'flex h-7 w-7 items-center justify-center rounded text-[#424242] hover:bg-[#eceef1]',
  editorToolbarDivider: 'mx-1 h-5 w-px shrink-0 bg-[#e0e0e0]',
  editorBody:
    'min-h-[260px] w-full resize-none border-0 bg-white px-3 py-2.5 text-[14px] leading-6 text-[#212121] outline-none placeholder:text-[#9e9e9e]',
  mergeFieldPopover: 'w-[300px] p-0',
  mergeFieldSearch:
    'w-full border-0 border-b border-[#eceef1] px-3 py-2 text-[13px] outline-none placeholder:text-[#9e9e9e]',
  mergeFieldGroupLabel:
    'px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#757575]',
  mergeFieldItem:
    'flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-[13px] text-[#212121] hover:bg-[#f5f6fc]',
  mergeFieldToken: 'shrink-0 font-mono text-[11px] text-[#3f51b5]',
  attachmentsRow: 'mt-3 flex flex-wrap items-center gap-2',
  attachmentsHint: 'mt-1.5 text-[12px] font-normal leading-4 text-[#9e9e9e]',
  attachmentChip:
    'inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#e0e0e0] bg-[#fafafa] py-1 pl-3 pr-1.5 text-[12px] text-[#424242]',
  attachmentChipHighlighted:
    'inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#c5cae9] bg-[#eef0fb] py-1 pl-2.5 pr-1.5 text-[12px] font-medium text-[#283593]',
  headerFooterOption: 'flex cursor-pointer items-start gap-2.5 py-2',
  headerFooterRadio:
    'mt-0.5 border-[#bdbdbd] bg-white shadow-none data-[state=checked]:border-[#3f51b5] [&_svg]:fill-[#3f51b5] [&_svg]:text-[#3f51b5]',
  logoBand: 'flex flex-col gap-1.5',
  logoBandCaption: 'text-[12px] font-semibold leading-4 text-[#616161]',
  logoBandFrame:
    'flex min-h-[64px] items-center justify-center rounded-[6px] border border-dashed border-[#d1d5db] bg-[#fafafa] px-4 py-3',
  headerFooterLabel: 'text-[13px] font-normal leading-5 text-[#212121]',

  /** Step 3 — preview & send. */
  previewGrid: 'grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)]',
  previewingAsRow: 'flex flex-wrap items-center gap-2 border-b border-[#eceef1] px-4 py-2.5',
  previewFrame: 'bg-[#f0f1f3] p-4',
  previewCard: 'rounded-[8px] border border-[#e5e7eb] bg-white',
  previewLogoHeader: 'flex items-center justify-center border-b border-[#f3f4f6] px-4 py-4',
  previewLogoFooter: 'flex items-center justify-center border-t border-[#f3f4f6] px-4 py-3',
  previewFromRow: 'flex items-center gap-2.5 border-b border-[#f3f4f6] px-4 py-3',
  previewAvatar: 'size-8 shrink-0 rounded-full bg-[#dfe3f8]',
  previewFromName: 'text-[13px] font-semibold leading-5 text-[#212121]',
  previewFromMeta: 'truncate text-[12px] font-normal leading-4 text-[#757575]',
  previewSubjectRow: 'border-b border-[#f3f4f6] px-4 py-2.5',
  previewSubjectLabel: 'text-[10px] font-semibold uppercase tracking-[0.04em] text-[#9e9e9e]',
  previewSubjectText: 'mt-0.5 text-[14px] font-semibold leading-5 text-[#212121]',
  previewBody: 'whitespace-pre-line px-4 py-3 text-[13px] leading-6 text-[#212121]',
  previewAttachments:
    'border-t border-[#f3f4f6] bg-[#fafafa] px-4 py-3',
  previewAttachmentsLabel:
    'mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#616161]',
  previewFooter:
    'border-t border-[#f3f4f6] px-4 py-3 text-[11px] leading-4 text-[#9e9e9e]',
  tokenResolved: 'rounded-sm bg-[#fff3cd] px-0.5 text-[#7a5c00]',
  tokenMissing: 'rounded-sm bg-[#fde2e1] px-0.5 text-[#b3261e] font-medium',
  alertBlock:
    'mb-3 flex items-start gap-2.5 rounded-[6px] border px-3 py-2.5 text-[13px] leading-5',
  alertBlocking: 'border-[#f5c2c0] bg-[#fdecea] text-[#8a241f]',
  alertWarning: 'border-[#ffe0b2] bg-[#fff8e1] text-[#8d6e00]',
  alertLink: 'font-medium text-[#3f51b5] hover:underline',
  summaryRow: 'flex items-center justify-between gap-3 border-b border-[#f3f4f6] px-4 py-2.5 last:border-b-0',
  summaryLabel: 'text-[13px] font-normal leading-5 text-[#616161]',
  summaryValue: 'text-[13px] font-semibold leading-5 text-[#212121]',
  deliveryOptionRow: 'flex flex-wrap items-center gap-4',
  deliveryOption: 'flex items-center gap-2 text-[13px] font-normal leading-5 text-[#212121]',
} as const;

export const BULK_EMAIL_STEPS = [
  { id: 'recipients', label: 'Recipients', numberedLabel: '1. Recipients' },
  { id: 'compose', label: 'Compose', numberedLabel: '2. Compose' },
  { id: 'preview', label: 'Preview', numberedLabel: '3. Preview' },
] as const;

export type BulkEmailStepId = (typeof BULK_EMAIL_STEPS)[number]['id'];
