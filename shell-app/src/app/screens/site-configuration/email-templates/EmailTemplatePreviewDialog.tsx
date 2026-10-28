import { Fragment } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../components/ui/dialog';
import { getHeaderFooterLayout, resolveMergeToken } from '../../../config/bulkEmail';
import {
  BULK_TEMPLATE_PREVIEW_RECIPIENT,
  EMAIL_PREVIEW_DISPLAY_NAME,
  resolvePreviewToken,
  type EmailTemplateGroupId,
  type EmailTemplateRecord,
} from '../../../config/emailTemplates';
import { EmailFooterLogoBand, EmailHeaderLogoBand } from '../../schedules/bulk-email/BulkEmailLogoBands';
import { et } from './emailTemplatesTokens';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function bodyHtml(text: string, groupId: EmailTemplateGroupId) {
  const withBreaks = text.includes('<') ? text : escapeHtml(text).replace(/\n/g, '<br />');
  return withBreaks.replace(/\{\{(\w+)\}\}/g, (full, token: string) => {
    const value = resolvePreviewToken(
      groupId,
      token,
      BULK_TEMPLATE_PREVIEW_RECIPIENT,
      resolveMergeToken,
    );
    if (!value) return full;
    const safe = escapeHtml(value);
    if (value.startsWith('http')) {
      return `<a href="${safe}" class="rounded-sm bg-[#fff3cd] px-0.5 text-[#7a5c00] underline">${safe}</a>`;
    }
    return `<span class="rounded-sm bg-[#fff3cd] px-0.5 text-[#7a5c00]">${safe}</span>`;
  });
}

function renderMergedText(text: string, groupId: EmailTemplateGroupId) {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{\{(\w+)\}\}$/);
    if (!match) return <Fragment key={i}>{part}</Fragment>;
    const token = match[1];
    const value = resolvePreviewToken(
      groupId,
      token,
      BULK_TEMPLATE_PREVIEW_RECIPIENT,
      resolveMergeToken,
    );
    if (value) {
      const highlighted = (
        <span key={i} className={et.tokenHighlight}>
          {value}
        </span>
      );
      if (value.startsWith('http')) {
        return (
          <a key={i} href={value} className={`${et.tokenHighlight} underline`}>
            {value}
          </a>
        );
      }
      return highlighted;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplateRecord | null;
  /** Event name shown in the preview description. */
  eventLabel: string;
};

export function EmailTemplatePreviewDialog({
  open,
  onOpenChange,
  template,
  eventLabel,
}: Props) {
  if (!template) return null;

  const layoutDef = getHeaderFooterLayout(template.headerFooterLayout ?? 'siteHeaderExxatFooter');
  const showDisplayName = !layoutDef.header;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 rounded-lg border-[#eceef1] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:max-w-[640px] [&>button]:top-4 [&>button]:right-4">
        <div className={et.dialogHeader}>
          <DialogTitle className={et.dialogTitle}>Preview email</DialogTitle>
          <DialogDescription className={et.dialogDesc}>
            {eventLabel || template.name}. Sample values are filled in. Highlighted text comes from
            merge fields.
          </DialogDescription>
        </div>
        <div className="px-6 pb-6">
          <div className="overflow-hidden rounded-[8px] border border-[#eceef1] bg-white">
            {layoutDef.header || showDisplayName ? (
              <div className="flex flex-col items-center gap-2 border-b border-[#eceef1] px-4 py-4">
                {layoutDef.header ? (
                  <EmailHeaderLogoBand logo={layoutDef.header} variant="preview" compact />
                ) : null}
                {showDisplayName ? (
                  <p className="text-center text-[14px] font-semibold text-[#212121]">
                    {EMAIL_PREVIEW_DISPLAY_NAME}
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="px-4 py-4 text-[14px] leading-6 text-[#212121]">
              <p className="font-semibold">{renderMergedText(template.subject, template.groupId)}</p>
              <div
                className="mt-3 whitespace-pre-wrap [&_a]:text-[#3f51b5] [&_a]:underline"
                dangerouslySetInnerHTML={{
                  __html: bodyHtml(template.body, template.groupId),
                }}
              />
            </div>
            {layoutDef.exxatFooter ? <EmailFooterLogoBand show variant="preview" /> : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
