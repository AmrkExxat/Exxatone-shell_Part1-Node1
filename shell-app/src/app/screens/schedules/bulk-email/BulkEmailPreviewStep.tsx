import { Fragment, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, OctagonAlert, Paperclip } from 'lucide-react';
import {
  extractMergeTokens,
  getHeaderFooterLayout,
  MOCK_SENDER,
  resolveMergeToken,
  type BulkEmailRecipient,
  type HeaderFooterLayoutId,
} from '../../../config/bulkEmail';
import { EmailFooterLogoBand, EmailHeaderLogoBand } from './BulkEmailLogoBands';
import { PublishPreferenceDatePickerField } from '../../availability/create/publishPreferenceDatePickerField';
import type { Attachment } from './BulkEmailComposeStep';
import { bulkEmailDrawer as d } from './bulkEmailDrawer';

export type DeliveryMode = 'now' | 'scheduled';

type Props = {
  recipients: BulkEmailRecipient[];
  subject: string;
  body: string;
  replyTo: string;
  cc: string;
  bcc: string;
  attachments: Attachment[];
  testAddressEnabled: boolean;
  testAddress: string;
  delivery: DeliveryMode;
  onDeliveryChange: (mode: DeliveryMode) => void;
  scheduleDate: string | null;
  onScheduleDateChange: (value: string | null) => void;
  scheduleTime: string;
  onScheduleTimeChange: (value: string) => void;
  onBlockingChange: (blocked: boolean) => void;
  goToCompose: () => void;
  /** Null when composing from a template — logo bands apply to scratch emails only. */
  headerFooterLayout: HeaderFooterLayoutId | null;
};

function renderTokenized(text: string, recipient: BulkEmailRecipient | null) {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{\{(\w+)\}\}$/);
    if (!match) return <Fragment key={i}>{part}</Fragment>;
    const token = match[1];
    if (!recipient) {
      return (
        <span key={i} className={d.tokenMissing}>
          {part}
        </span>
      );
    }
    const resolution = resolveMergeToken(recipient, token);
    if (resolution.status === 'resolved') {
      return (
        <span key={i} className={d.tokenResolved}>
          {resolution.value}
        </span>
      );
    }
    return (
      <span key={i} className={d.tokenMissing}>
        {part}
      </span>
    );
  });
}

export function BulkEmailPreviewStep({
  recipients,
  subject,
  body,
  replyTo,
  cc,
  bcc,
  attachments,
  testAddressEnabled,
  testAddress,
  delivery,
  onDeliveryChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange,
  onBlockingChange,
  goToCompose,
  headerFooterLayout,
}: Props) {
  const layout = headerFooterLayout ? getHeaderFooterLayout(headerFooterLayout) : null;
  const [previewingAsId, setPreviewingAsId] = useState<string | null>(recipients[0]?.id ?? null);
  const [warningExpanded, setWarningExpanded] = useState(false);

  const analysis = useMemo(() => {
    const tokens = extractMergeTokens(`${subject}\n${body}`);
    const globalMissing = tokens.filter((token) =>
      recipients.every((r) => resolveMergeToken(r, token).status === 'missing'),
    );
    const globalMissingSet = new Set(globalMissing);

    const excluded: { recipient: BulkEmailRecipient; missingTokens: string[] }[] = [];
    const valid: BulkEmailRecipient[] = [];
    for (const r of recipients) {
      const missing = tokens.filter(
        (t) => !globalMissingSet.has(t) && resolveMergeToken(r, t).status === 'missing',
      );
      if (missing.length > 0) excluded.push({ recipient: r, missingTokens: missing });
      else valid.push(r);
    }

    return { tokens, globalMissing, excluded, valid };
  }, [subject, body, recipients]);

  const isBlocked = analysis.globalMissing.length > 0;
  useEffect(() => {
    onBlockingChange(isBlocked);
  }, [isBlocked, onBlockingChange]);

  const previewingAs =
    recipients.find((r) => r.id === previewingAsId) ?? recipients[0] ?? null;
  const previewingAsMissingData =
    previewingAs && analysis.excluded.some((e) => e.recipient.id === previewingAs.id);

  const finalSendTarget =
    testAddressEnabled && testAddress
      ? `the test address (${testAddress})`
      : `${analysis.valid.length} ${analysis.valid.length === 1 ? 'recipient' : 'recipients'}`;

  return (
    <div className={d.previewGrid}>
      <section className={d.card}>
        {isBlocked ? (
          <div className="p-4 pb-0">
            <div className={`${d.alertBlock} ${d.alertBlocking}`}>
              <OctagonAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
              <span>
                {analysis.globalMissing.map((t) => `{{${t}}}`).join(', ')} has no value for any
                recipient — replace it with your own text in Compose. It can’t be sent as
                written.{' '}
                <button type="button" className={d.alertLink} onClick={goToCompose}>
                  Fix in Compose
                </button>
              </span>
            </div>
          </div>
        ) : null}

        {!isBlocked && analysis.excluded.length > 0 ? (
          <div className="p-4 pb-0">
            <div className={`${d.alertBlock} ${d.alertWarning}`}>
              <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 font-medium"
                  onClick={() => setWarningExpanded((v) => !v)}
                >
                  {warningExpanded ? (
                    <ChevronDown className="size-3.5" strokeWidth={2} aria-hidden />
                  ) : (
                    <ChevronRight className="size-3.5" strokeWidth={2} aria-hidden />
                  )}
                  {analysis.excluded.length}{' '}
                  {analysis.excluded.length === 1 ? 'recipient' : 'recipients'} excluded
                </button>
                {warningExpanded ? (
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {analysis.excluded.flatMap(({ recipient, missingTokens }) =>
                      missingTokens.map((token) => (
                        <li key={`${recipient.id}-${token}`}>
                          {`{{${token}}}`} has no value on their record ({recipient.name})
                        </li>
                      )),
                    )}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className={d.previewingAsRow}>
          <span className="text-[12px] font-normal leading-4 text-[#757575]">Previewing as</span>
          <select
            value={previewingAs?.id ?? ''}
            onChange={(e) => setPreviewingAsId(e.target.value)}
            className="h-8 rounded border border-[#d1d5db] bg-white px-2 text-[13px] text-[#212121]"
          >
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
                {analysis.excluded.some((e) => e.recipient.id === r.id) ? ' — missing data' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className={d.previewFrame}>
          <div className={d.previewCard}>
            <div className={d.previewFromRow}>
              <span className={d.previewAvatar} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className={`block ${d.previewFromName}`}>{MOCK_SENDER.senderOrganization}</span>
                <span className={d.previewFromMeta}>
                  From: {MOCK_SENDER.senderOrganization} {'<noreply@exxat.com>'} · Reply-To:{' '}
                  {replyTo || '—'}
                </span>
              </span>
            </div>
            <EmailHeaderLogoBand logo={layout?.header ?? null} variant="preview" />
            <div className={d.previewSubjectRow}>
              <span className={d.previewSubjectLabel}>Subject</span>
              <p className={d.previewSubjectText}>{renderTokenized(subject, previewingAs)}</p>
            </div>
            <div className={d.previewBody}>{renderTokenized(body, previewingAs)}</div>
            <EmailFooterLogoBand show={layout?.exxatFooter ?? false} variant="preview" />
            {attachments.length > 0 ? (
              <div className={d.previewAttachments}>
                <p className={d.previewAttachmentsLabel}>Attachments ({attachments.length})</p>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file) => (
                    <span key={file.id} className={d.attachmentChipHighlighted}>
                      <Paperclip
                        className="size-3 shrink-0 text-[#3f51b5]"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span className="min-w-0 truncate">{file.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className={d.previewFooter}>
              This email was sent by {MOCK_SENDER.senderOrganization} via Exxat One. If you
              believe you received this in error, please contact support@exxat.com.
            </div>
          </div>
          {previewingAsMissingData ? (
            <p className="mt-2 text-[12px] font-medium text-[#b3261e]">
              This recipient will be excluded — highlighted fields above have no value on
              their record.
            </p>
          ) : null}
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <section className={d.card}>
          <div className={d.cardHeader}>
            <h3 className={d.cardTitle}>Summary</h3>
          </div>
          <div>
            <div className={d.summaryRow}>
              <span className={d.summaryLabel}>Valid recipients</span>
              <span className={d.summaryValue}>{analysis.valid.length}</span>
            </div>
            <div className={d.summaryRow}>
              <span className={d.summaryLabel}>Excluded</span>
              <span className={d.summaryValue}>{analysis.excluded.length}</span>
            </div>
            <div className={d.summaryRow}>
              <span className={d.summaryLabel}>CC</span>
              <span className={d.summaryValue}>{cc || '—'}</span>
            </div>
            <div className={d.summaryRow}>
              <span className={d.summaryLabel}>BCC</span>
              <span className={d.summaryValue}>{bcc || '—'}</span>
            </div>
            <div className={`${d.summaryRow} ${attachments.length > 0 ? 'items-start' : ''}`}>
              <span className={d.summaryLabel}>Attachments</span>
              {attachments.length > 0 ? (
                <ul className="flex max-w-[55%] flex-col gap-1 text-right">
                  {attachments.map((file) => (
                    <li
                      key={file.id}
                      className={`${d.summaryValue} truncate`}
                      title={file.name}
                    >
                      {file.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className={d.summaryValue}>—</span>
              )}
            </div>
          </div>
        </section>

        <section className={d.card}>
          <div className={d.cardHeader}>
            <h3 className={d.cardTitle}>Delivery</h3>
            <p className={d.cardSubtitle}>Will send to {finalSendTarget}.</p>
          </div>
          <div className={`${d.cardBody} flex flex-col gap-3`}>
            <div className={d.deliveryOptionRow}>
              <label className={d.deliveryOption}>
                <input
                  type="radio"
                  name="bulk-email-delivery"
                  checked={delivery === 'now'}
                  onChange={() => onDeliveryChange('now')}
                  className="size-4 accent-[#3f51b5]"
                />
                Send email now
              </label>
              <label className={d.deliveryOption}>
                <input
                  type="radio"
                  name="bulk-email-delivery"
                  checked={delivery === 'scheduled'}
                  onChange={() => onDeliveryChange('scheduled')}
                  className="size-4 accent-[#3f51b5]"
                />
                Send at a specific date and time
              </label>
            </div>
            {delivery === 'scheduled' ? (
              <div className="flex flex-wrap items-center gap-2">
                <PublishPreferenceDatePickerField
                  id="bulk-email-schedule-date"
                  value={scheduleDate}
                  onChange={onScheduleDateChange}
                  showClear
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => onScheduleTimeChange(e.target.value)}
                  className="h-[38px] rounded-[6px] border border-[#888888] bg-white px-2.5 text-[14px] text-[#212121]"
                />
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
