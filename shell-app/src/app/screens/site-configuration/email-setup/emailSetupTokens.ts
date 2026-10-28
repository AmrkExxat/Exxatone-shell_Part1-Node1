/** Form controls for Email Setup — card chrome uses `sc` from siteConfigurationTokens. */
export const es = {
  pageIntro: 'text-[14px] font-normal leading-5 text-[#4a5565]',
  block: 'space-y-3',
  blockDivider: 'border-t border-[#e5e7eb] pt-8',
  fieldStack: 'space-y-2',
  fieldLabel: 'text-[14px] font-semibold leading-5 text-[#111827]',
  fieldIntro: 'text-[14px] font-normal leading-5 text-[#4a5565]',
  /** Shared width for text, chips, upload, and footer fields. */
  fieldWidth: 'w-full max-w-[640px]',
  controlShell:
    'rounded-[4px] border border-[#e5e7eb] bg-white transition-[border-color,box-shadow] hover:border-[#d1d5dc] focus-within:border-[#3f51b5] focus-within:ring-2 focus-within:ring-[#3f51b5]',
  textInputInner:
    'h-[34px] w-full border-0 bg-transparent px-3 text-[14px] font-normal leading-5 text-[#111827] outline-none placeholder:text-[#9e9e9e]',
  textArea:
    'min-h-[120px] w-full resize-y rounded-[4px] border border-[#e5e7eb] bg-white px-3 py-2 text-[14px] font-normal leading-5 text-[#111827] outline-none transition-[border-color,box-shadow] placeholder:text-[#9e9e9e] hover:border-[#d1d5dc] focus:border-[#3f51b5] focus-visible:ring-2 focus-visible:ring-[#3f51b5]',
  fieldHint: 'text-[12px] font-normal leading-4 text-[#757575]',
  charCount: 'text-[12px] font-normal leading-4 text-[#757575]',
  chipField:
    'flex min-h-[34px] w-full flex-wrap items-center gap-1.5 px-2 py-1.5',
  chip: 'inline-flex max-w-full items-center gap-1 rounded-full border border-[#c5cae9] bg-[#eef0fb] py-0.5 pl-2.5 pr-1 text-[12px] font-medium text-[#283593]',
  chipRemove:
    'inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[#283593] hover:bg-[#dfe3f8]',
  chipInput:
    'min-w-[120px] flex-1 border-0 bg-transparent px-1 py-0.5 text-[14px] text-[#212121] outline-none placeholder:text-[#9e9e9e]',
  uploadZone:
    'flex min-h-[125px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-[#888888] bg-white px-6 py-4 text-center hover:bg-[#fafafa]',
  uploadTitle: 'text-[14px] font-semibold leading-6 text-[#3f51b5]',
  uploadHint: 'text-[12px] font-medium leading-5 text-[#4a5565]',
  uploadFileName: 'text-[13px] font-normal text-[#3f51b5]',
  errorHint: 'text-[12px] font-normal leading-4 text-[#c62828]',
  btnPrimary:
    'inline-flex h-9 w-auto shrink-0 items-center justify-center self-start rounded-[6px] bg-[#3f51b5] px-5 text-[14px] font-medium text-white hover:bg-[#3544a5] disabled:cursor-not-allowed disabled:border disabled:border-[#e0e0e0] disabled:bg-[#eeeeee] disabled:text-[#9e9e9e] disabled:hover:bg-[#eeeeee]',
  savedBanner:
    'rounded-[6px] border border-[#c5cae9] bg-[#eef0fb] px-3 py-2 text-[13px] font-normal leading-5 text-[#283593]',
  saveRow: 'flex flex-col items-start gap-3 pt-2',
} as const;
