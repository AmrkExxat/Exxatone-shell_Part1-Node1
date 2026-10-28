import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '../../../components/ui/checkbox';
import {
  BULK_EMAIL_PERSONAS,
  type BulkEmailPersonaId,
  type BulkEmailRecipient,
} from '../../../config/bulkEmail';
import { bulkEmailDrawer as d } from './bulkEmailDrawer';

type Props = {
  personaCounts: Record<BulkEmailPersonaId, number>;
  tickedPersonas: Set<BulkEmailPersonaId>;
  onTogglePersona: (id: BulkEmailPersonaId) => void;
  recipients: BulkEmailRecipient[];
  validRecipientCount: number;
  replyTo: string;
  onReplyToChange: (value: string) => void;
  cc: string;
  onCcChange: (value: string) => void;
  bcc: string;
  onBccChange: (value: string) => void;
  testAddressEnabled: boolean;
  onToggleTestAddress: () => void;
  testAddress: string;
  onTestAddressChange: (value: string) => void;
};

export function BulkEmailRecipientsStep({
  personaCounts,
  tickedPersonas,
  onTogglePersona,
  recipients,
  validRecipientCount,
  replyTo,
  onReplyToChange,
  cc,
  onCcChange,
  bcc,
  onBccChange,
  testAddressEnabled,
  onToggleTestAddress,
  testAddress,
  onTestAddressChange,
}: Props) {
  const selectedCount = tickedPersonas.size;

  return (
    <div className={d.recipientsGrid}>
      <section className={d.card}>
        <div className={d.cardHeader}>
          <h3 className={d.cardTitle}>
            Who should receive this? — {selectedCount} of {BULK_EMAIL_PERSONAS.length} selected
          </h3>
        </div>
        <div>
          {BULK_EMAIL_PERSONAS.map((persona) => {
            const count = personaCounts[persona.id] ?? 0;
            const checked = tickedPersonas.has(persona.id);
            return (
              <label key={persona.id} className={d.personaRow}>
                <span className={d.personaCheckboxCol}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => onTogglePersona(persona.id)}
                    aria-label={`Include ${persona.label}`}
                  />
                </span>
                <span className="min-w-0">
                  <span className={d.personaLabelRow}>
                    <span className={d.personaLabel}>{persona.label}</span>
                    <span className={d.personaCount}>
                      {count} {count === 1 ? 'person' : 'people'}
                    </span>
                  </span>
                  <p className={d.personaDescription}>{persona.description}</p>
                </span>
              </label>
            );
          })}
        </div>
        <p className="border-t border-[#eceef1] px-4 py-2.5 text-[12px] leading-4 text-[#757575]">
          Tick one or more. Their recipients are added automatically from the selected schedules.
        </p>
      </section>

      <section className={d.card}>
        <div className={d.cardHeader}>
          <h3 className={d.cardTitle}>
            Recipients — {validRecipientCount} valid
          </h3>
        </div>
        <div className={d.recipientsTableWrap}>
          {recipients.length === 0 ? (
            <div className={d.recipientsEmptyState}>
              <Users className="mb-2 size-6 text-[#bdbdbd]" strokeWidth={1.5} aria-hidden />
              No recipients yet — tick a persona on the left.
            </div>
          ) : (
            <table className={d.recipientsTable}>
              <thead>
                <tr>
                  <th className={`${d.recipientsTh} ${d.recipientsColName}`}>Name</th>
                  <th className={`${d.recipientsTh} ${d.recipientsColEmail}`}>Email</th>
                  <th className={`${d.recipientsTh} ${d.recipientsColDetails}`}>Details</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((r) => (
                  <tr key={r.id}>
                    <td className={`${d.recipientsTd} ${d.recipientsColName}`}>{r.name}</td>
                    <td className={`${d.recipientsTd} ${d.recipientsColEmail} break-all`}>
                      {r.email}
                    </td>
                    <td className={`${d.recipientsTd} ${d.recipientsColDetails}`}>
                      <span className="flex flex-col items-start gap-1">
                        <span className={d.roleBadge}>{r.roleLabel}</span>
                        {r.details.map((line) => (
                          <span key={line} className="text-[12px] text-[#757575]">
                            {line}
                          </span>
                        ))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className={d.card}>
        <div className={d.cardHeader}>
          <h3 className={d.cardTitle}>Email settings</h3>
        </div>
        <div className={`${d.cardBody} flex flex-col gap-4`}>
          <div className={d.fieldGroup}>
            <label htmlFor="bulk-email-reply-to" className={d.fieldLabel}>
              Reply to <span className="text-[#c62828]">*</span>
            </label>
            <input
              id="bulk-email-reply-to"
              type="email"
              value={replyTo}
              onChange={(e) => onReplyToChange(e.target.value)}
              className={d.textInput}
              placeholder="clinical.placements@yourorg.org"
            />
          </div>
          <div className={d.fieldGroup}>
            <label htmlFor="bulk-email-cc" className={d.fieldLabel}>
              CC
            </label>
            <input
              id="bulk-email-cc"
              type="text"
              value={cc}
              onChange={(e) => onCcChange(e.target.value)}
              className={d.textInput}
              placeholder="cc@example.com, another@example.com"
            />
            <p className={d.fieldHint}>Separate multiple addresses with commas.</p>
          </div>
          <div className={d.fieldGroup}>
            <label htmlFor="bulk-email-bcc" className={d.fieldLabel}>
              BCC
            </label>
            <input
              id="bulk-email-bcc"
              type="text"
              value={bcc}
              onChange={(e) => onBccChange(e.target.value)}
              className={d.textInput}
              placeholder="bcc@example.com"
            />
          </div>

          <TestAddressDisclosure
            enabled={testAddressEnabled}
            onToggle={onToggleTestAddress}
            value={testAddress}
            onChange={onTestAddressChange}
            recipientCount={validRecipientCount}
          />
        </div>
      </section>
    </div>
  );
}

function TestAddressDisclosure({
  enabled,
  onToggle,
  value,
  onChange,
  recipientCount,
}: {
  enabled: boolean;
  onToggle: () => void;
  value: string;
  onChange: (value: string) => void;
  recipientCount: number;
}) {
  const [open, setOpen] = useState(enabled);

  return (
    <div className="border-t border-[#eceef1] pt-3">
      <button
        type="button"
        className={d.testAddressTrigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1.5">
          {open ? (
            <ChevronDown className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <ChevronRight className="size-3.5" strokeWidth={2} aria-hidden />
          )}
          Send to a test address instead
        </span>
      </button>
      {open ? (
        <div className="mt-2 flex items-start gap-2.5">
          <span className="pt-0.5">
            <Checkbox
              checked={enabled}
              onCheckedChange={onToggle}
              aria-label="Send every email to a test address instead"
            />
          </span>
          <div className="min-w-0 flex-1">
            <input
              type="email"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={!enabled}
              className={`${d.textInput} disabled:bg-[#f5f5f5] disabled:text-[#9e9e9e]`}
              placeholder="e.g. test@example.com"
            />
            {enabled && value ? (
              <p className={d.testAddressBanner}>
                All emails will go to {value} instead of the {recipientCount}{' '}
                {recipientCount === 1 ? 'recipient' : 'recipients'}.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
