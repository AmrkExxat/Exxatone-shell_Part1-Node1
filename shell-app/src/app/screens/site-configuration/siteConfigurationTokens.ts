import { partnersFont } from '../partners/partnersTypography';

/** Tokens aligned to Figma node 48:30767 (Site Configuration | Exxat One). */
export const sc = {
  font: partnersFont,
  workspaceRoot:
    'flex min-h-0 flex-1 items-stretch gap-0 bg-[#f5f5f5] p-2',
  configCard:
    'flex h-full min-h-0 w-[300px] min-w-[300px] shrink-0 flex-col self-stretch overflow-hidden rounded-[8px] bg-white',
  configInner: 'flex h-full min-h-0 flex-1 flex-col overflow-hidden p-2',
  configNav: 'flex min-h-0 flex-1 flex-col overflow-y-auto',
  configTitle: 'px-2 pb-4 pt-0 text-[16px] font-semibold leading-6 text-[#111827]',
  sectionBtn:
    'flex h-10 max-h-10 min-h-10 w-full items-center gap-2 rounded-[4px] px-2 py-2 text-left hover:bg-[#fafafa]',
  sectionLabel:
    'min-w-0 flex-1 whitespace-nowrap text-[14px] font-semibold leading-5 text-[#1e2939]',
  chevron: 'size-3 shrink-0',
  navLeafWrap: 'px-2 pt-1',
  navLeafBase:
    'flex h-10 max-h-10 min-h-10 w-full items-center overflow-hidden rounded-[4px] px-4 text-[14px] leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5] focus-visible:ring-inset',
  navLeafIdle: 'font-medium text-[#364153] hover:bg-[#f5f5f5]',
  navLeafActive: 'bg-[#3f51b5] font-semibold text-white hover:bg-[#3544a5]',
  mainColumn: 'min-w-0 flex-1 pl-4',
  mainCanvas: 'bg-[#f5f5f5]',
  contentGrid: 'grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_386px]',
  rightRail: 'w-full max-w-[386px] shrink-0 lg:justify-self-end',
  logoBlock: 'w-full max-w-[386px] pt-1',
  infoCard:
    'rounded-[8px] bg-white shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]',
  cardHeader:
    'flex min-h-[44px] items-center justify-between border-b border-[#e5e7eb] px-4 py-2',
  cardTitle: 'text-[16px] font-semibold leading-4 text-[#101828]',
  cardBody: 'p-4',
  fieldGrid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
  fieldLabel: 'py-1 text-[14px] font-semibold leading-5 text-[#111827]',
  fieldValue: 'text-[14px] font-normal leading-5 text-[#4a5565]',
  fieldValueDark: 'text-[14px] font-normal leading-5 text-[#364153]',
  link: 'text-[14px] font-normal leading-5 text-[#3f51b5]',
  siteDescTitle: 'py-1 text-[14px] font-semibold leading-5 text-[#111827]',
  aboutTitle: 'text-[14px] font-bold leading-[17.5px] text-[#111827]',
  aboutBody: 'text-[14px] font-normal leading-[17.5px] text-[#4a5565]',
  footerLink: 'text-[14px] font-normal leading-[17.5px] text-[#2563eb] underline',
  metaFooter: 'pt-4 text-[14px] font-normal italic leading-5 text-[#111827]',
  logoImage: 'block h-[96px] w-full object-contain object-left',
  uploadCard:
    'w-full max-w-[386px] rounded-[6px] bg-white shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]',
  uploadHeader:
    'flex min-h-[44px] items-center border-b border-[#e5e7eb] px-4 py-3',
  uploadBody: 'p-4',
  uploadZone:
    'flex min-h-[125px] w-full items-center justify-center rounded-[8px] border border-dashed border-[#888888] px-6 py-4',
  uploadStack: 'flex flex-col items-center',
  uploadLink:
    'mt-4 text-center text-[14px] font-semibold leading-6 text-[#3f51b5] hover:underline',
  uploadHint: 'mt-0 text-center text-[12px] font-medium leading-5 text-[#4a5565]',
  placeholderBody: 'text-[14px] font-normal leading-5 text-[#616161]',
} as const;
