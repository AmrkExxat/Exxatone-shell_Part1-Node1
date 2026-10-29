import { useMemo, useState, type KeyboardEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../components/ui/dialog';
import { resolveMergeToken } from '../../../config/bulkEmail';
import {
  BULK_TEMPLATE_PREVIEW_RECIPIENT,
  resolvePreviewToken,
  type EmailTemplateRecord,
} from '../../../config/emailTemplates';
import { et } from '../email-templates/emailTemplatesTokens';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventLabel: string;
  template: EmailTemplateRecord | null;
};

function highlight(text: string) {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return parts.map((part, index) => {
    const match = part.match(/^\{\{(\w+)\}\}$/);
    if (!match) return <span key={index}>{part}</span>;
    const value = resolvePreviewToken(
      'automated',
      match[1],
      BULK_TEMPLATE_PREVIEW_RECIPIENT,
      resolveMergeToken,
    );
    if (!value) return <span key={index}>{part}</span>;
    return (
      <span key={index} className={et.tokenHighlight}>
        {value}
      </span>
    );
  });
}

const PREVIEW_TABS = ['in-app', 'email'] as const;

export function NotificationPreviewDialog({ open, onOpenChange, eventLabel, template }: Props) {
  const [tab, setTab] = useState<(typeof PREVIEW_TABS)[number]>('in-app');
  const kind = template?.kind ?? 'standard';
  const body = useMemo(() => template?.body ?? '', [template]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = PREVIEW_TABS.indexOf(tab);
    const move = (next: number) => {
      event.preventDefault();
      const id = PREVIEW_TABS[next];
      setTab(id);
      event.currentTarget.querySelector<HTMLButtonElement>(`#preview-tab-${id}`)?.focus();
    };
    if (event.key === 'ArrowRight') move((index + 1) % PREVIEW_TABS.length);
    if (event.key === 'ArrowLeft') move((index - 1 + PREVIEW_TABS.length) % PREVIEW_TABS.length);
    if (event.key === 'Home') move(0);
    if (event.key === 'End') move(PREVIEW_TABS.length - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 rounded-lg border-[#eceef1] p-0 sm:max-w-[560px] [&>button]:inline-flex [&>button]:size-8 [&>button]:items-center [&>button]:justify-center">
        <div className={et.dialogHeader}>
          <DialogTitle className={et.dialogTitle}>Notification preview</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2 text-[13px] text-[#616161]">
            {eventLabel}
            <span className={`${et.badgeBase} ${kind === 'customized' ? et.badgeCustomized : et.badgeStandard}`}>
              {kind === 'customized' ? 'Customized' : 'Standard'}
            </span>
          </DialogDescription>
        </div>
        <div
          className="border-b border-[#eceef1] px-6"
          role="tablist"
          aria-label="Preview format"
          onKeyDown={onTabKeyDown}
        >
          {PREVIEW_TABS.map((id) => (
            <button
              key={id}
              id={`preview-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-controls={`preview-panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              className={`mr-4 min-h-8 border-b-2 py-2 text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5] ${
                tab === id
                  ? 'border-[#3f51b5] text-[#3f51b5]'
                  : 'border-transparent text-[#616161]'
              }`}
              onClick={() => setTab(id)}
            >
              {id === 'in-app' ? 'In app' : 'Email'}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="preview-panel-in-app"
          aria-labelledby="preview-tab-in-app"
          hidden={tab !== 'in-app'}
          tabIndex={0}
          className="px-6 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3f51b5]"
        >
          <div className="rounded-[8px] border border-[#eceef1] p-4">
            <span className="inline-flex rounded-full bg-[#eef0fb] px-2 py-0.5 text-[11px] font-semibold text-[#283593]">
              Update
            </span>
            <div className="mt-3 flex items-start gap-3">
              <span
                className="inline-flex size-9 items-center justify-center rounded-full bg-[#eef0fb] text-[12px] font-semibold text-[#283593]"
                aria-hidden
              >
                JL
              </span>
              <div>
                <p className="text-[14px] font-semibold text-[#111827]">Jordan Lee</p>
                <p className="text-[12px] text-[#757575]">2 hours ago</p>
                <p className="mt-2 text-[14px] text-[#212121]">{eventLabel}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          role="tabpanel"
          id="preview-panel-email"
          aria-labelledby="preview-tab-email"
          hidden={tab !== 'email'}
          tabIndex={0}
          className="px-6 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3f51b5]"
        >
          {template ? (
            <div className="rounded-[8px] border border-[#eceef1] p-4 text-[14px] leading-6 text-[#212121]">
              <p className="font-semibold">{highlight(template.subject)}</p>
              <p className="mt-3 whitespace-pre-wrap">{highlight(body)}</p>
            </div>
          ) : (
            <p className="text-[14px] text-[#616161]">No email template for this event yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
