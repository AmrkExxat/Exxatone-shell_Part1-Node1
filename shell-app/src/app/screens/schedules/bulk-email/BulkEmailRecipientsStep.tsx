import { AlertTriangle, ChevronDown, ChevronRight, Info, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Checkbox } from '../../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Switch } from '../../../components/ui/switch';
import {
  BULK_EMAIL_PERSONAS,
  bulkEmailCount,
  findRecipientConflicts,
  recipientScheduleCount,
  type BulkEmailPersonaId,
  type BulkEmailRecipient,
  type BulkEmailSendMode,
} from '../../../config/bulkEmail';
import { bulkEmailDrawer as d } from './bulkEmailDrawer';

type Props = {
  personaCounts: Record<BulkEmailPersonaId, number>;
  selectedPersona: BulkEmailPersonaId | null;
  onSelectPersona: (id: BulkEmailPersonaId) => void;
  sendMode: BulkEmailSendMode;
  onSendModeChange: (mode: BulkEmailSendMode) => void;
  recipients: BulkEmailRecipient[];
  excludedIds: Set<string>;
  onToggleRecipient: (id: string) => void;
  onToggleAllRecipients: (include: boolean) => void;
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

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

export function BulkEmailRecipientsStep({
  personaCounts,
  selectedPersona,
  onSelectPersona,
  sendMode,
  onSendModeChange,
  recipients,
  excludedIds,
  onToggleRecipient,
  onToggleAllRecipients,
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
  const included = useMemo(
    () => recipients.filter((r) => !excludedIds.has(r.id)),
    [recipients, excludedIds],
  );
  const multiSchedule = useMemo(
    () => included.filter((r) => recipientScheduleCount(r) > 1),
    [included],
  );
  const conflicts = useMemo(() => findRecipientConflicts(recipients), [recipients]);
  const flaggedIds = useMemo(
    () => new Set(conflicts.flatMap((c) => c.recipientIds)),
    [conflicts],
  );

  return (
    <div className={d.recipientsGrid}>
      <section className={d.card}>
        <div className={d.cardHeader}>
          <h3 id="bulk-email-persona-title" className={d.cardTitle}>
            Who should receive this?
          </h3>
          <p className={d.cardSubtitle}>Choose one group.</p>
        </div>
        <RadioGroup
          value={selectedPersona ?? ''}
          onValueChange={(value) => onSelectPersona(value as BulkEmailPersonaId)}
          aria-labelledby="bulk-email-persona-title"
          className="gap-0"
        >
          {BULK_EMAIL_PERSONAS.map((persona) => {
            const count = personaCounts[persona.id] ?? 0;
            const selected = selectedPersona === persona.id;
            const id = `bulk-email-persona-${persona.id}`;
            return (
              <div key={persona.id} className="border-b border-[#eceef1] last:border-b-0">
                <label
                  htmlFor={id}
                  className={`${d.personaRow} ${count === 0 ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${selected ? 'bg-[#f5f6fc] hover:bg-[#f5f6fc]' : ''}`}
                >
                  <span className={d.personaCheckboxCol}>
                    <RadioGroupItem
                      id={id}
                      value={persona.id}
                      disabled={count === 0}
                      className={d.personaRadio}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className={d.personaLabelRow}>
                      <span className={d.personaLabel}>{persona.label}</span>
                      <span className={d.personaCount}>{plural(count, 'person', 'people')}</span>
                    </span>
                    <p className={d.personaDescription}>{persona.description}</p>
                  </span>
                </label>
                {selected ? (
                  <SendModePanel
                    people={included.length}
                    multiSchedule={multiSchedule.length}
                    emails={bulkEmailCount(included, sendMode)}
                    sendMode={sendMode}
                    onSendModeChange={onSendModeChange}
                  />
                ) : null}
              </div>
            );
          })}
        </RadioGroup>
        <p className="border-t border-[#eceef1] px-4 py-2.5 text-[12px] leading-4 text-[#616161]">
          People are added from the selected schedules. Untick anyone you want to leave out.
        </p>
      </section>

      <section className={`${d.card} flex min-h-0 flex-col`}>
        <div className={`${d.cardHeader} flex items-center gap-3`}>
          {recipients.length > 0 ? (
            <Checkbox
              checked={
                included.length === recipients.length
                  ? true
                  : included.length === 0
                    ? false
                    : 'indeterminate'
              }
              onCheckedChange={() => onToggleAllRecipients(included.length !== recipients.length)}
              aria-label="Include all recipients"
            />
          ) : null}
          <h3 className={`${d.cardTitle} flex-1`}>Recipients</h3>
          {recipients.length > 0 ? (
            <span className="text-[13px] text-[#616161]" aria-live="polite">
              {included.length} of {recipients.length} selected
            </span>
          ) : null}
        </div>

        {recipients.length === 0 ? (
          <div className={d.recipientsEmptyState}>
            <Users className="mb-2 size-6 text-[#bdbdbd]" strokeWidth={1.5} aria-hidden />
            Choose who should receive this on the left.
          </div>
        ) : (
          <>
            {multiSchedule.length > 0 || conflicts.length > 0 ? (
              <div className="flex flex-col gap-2 border-b border-[#eceef1] px-4 py-3">
                {multiSchedule.length > 0 ? (
                  <div className={`${d.alertBlock} ${d.alertInfo} mb-0`}>
                    <Info className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
                    <span>
                      {plural(multiSchedule.length, 'person is', 'people are')} on more than one
                      schedule.{' '}
                      {sendMode === 'perPerson'
                        ? 'They’ll get one email each, listing all their schedules.'
                        : 'They’ll get one email for each schedule.'}
                    </span>
                  </div>
                ) : null}
                {conflicts.length > 0 ? (
                  <div className={`${d.alertBlock} ${d.alertWarning} mb-0`} role="status">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
                    <div className="min-w-0">
                      <p className="font-medium">Check details before sending</p>
                      <ul className="mt-1 flex flex-col gap-0.5">
                        {conflicts.map((c) => (
                          <li key={`${c.kind}-${c.value}`}>
                            {c.kind === 'sharedName'
                              ? `${c.value} is listed with ${c.recipientIds.length} email addresses.`
                              : `${c.value} is used by ${c.recipientIds.length} people.`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
            <ul className={d.recipientList} aria-label="Recipients">
              {recipients.map((r) => (
                <RecipientRow
                  key={r.id}
                  recipient={r}
                  included={!excludedIds.has(r.id)}
                  flagged={flaggedIds.has(r.id)}
                  sendMode={sendMode}
                  onToggle={() => onToggleRecipient(r.id)}
                />
              ))}
            </ul>
          </>
        )}
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
              aria-describedby="bulk-email-cc-hint"
            />
            <p id="bulk-email-cc-hint" className={d.fieldHint}>
              Separate multiple addresses with commas.
            </p>
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
            recipientCount={included.length}
          />
        </div>
      </section>
    </div>
  );
}

function SendModePanel({
  people,
  multiSchedule,
  emails,
  sendMode,
  onSendModeChange,
}: {
  people: number;
  multiSchedule: number;
  emails: number;
  sendMode: BulkEmailSendMode;
  onSendModeChange: (mode: BulkEmailSendMode) => void;
}) {
  if (people === 0) return null;
  if (multiSchedule === 0) {
    return (
      <p className="mx-4 mb-3 text-[12px] leading-4 text-[#616161]">
        Everyone is on one schedule, so each person gets one email.
      </p>
    );
  }
  const perSchedule = sendMode === 'perSchedule';
  return (
    <div className={d.sendModePanel}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="bulk-email-per-schedule" className="text-[13px] font-semibold leading-5 text-[#212121]">
          Send a separate email for each schedule
        </label>
        <Switch
          id="bulk-email-per-schedule"
          checked={perSchedule}
          onCheckedChange={(on) => onSendModeChange(on ? 'perSchedule' : 'perPerson')}
          aria-describedby="bulk-email-send-mode-hint"
          className={d.sendModeSwitch}
        />
      </div>
      <p id="bulk-email-send-mode-hint" className="mt-1 text-[12px] leading-4 text-[#616161]" aria-live="polite">
        <span className="font-semibold text-[#212121]">
          {plural(people, 'person', 'people')} · {plural(emails, 'email', 'emails')}.
        </span>{' '}
        {perSchedule
          ? 'The same person can get several emails.'
          : 'Recommended. Each person gets one email listing all their schedules.'}
      </p>
    </div>
  );
}

function RecipientRow({
  recipient,
  included,
  flagged,
  sendMode,
  onToggle,
}: {
  recipient: BulkEmailRecipient;
  included: boolean;
  flagged: boolean;
  sendMode: BulkEmailSendMode;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const scheduleCount = recipientScheduleCount(recipient);
  const panelId = `bulk-email-schedules-${recipient.id}`;
  const pillLabel =
    sendMode === 'perSchedule'
      ? plural(scheduleCount, 'email', 'emails')
      : plural(scheduleCount, 'schedule', 'schedules');

  return (
    <li className={d.recipientRow}>
      <span className="pt-0.5">
        <Checkbox
          checked={included}
          onCheckedChange={onToggle}
          aria-label={`Include ${recipient.name}, ${recipient.email}`}
        />
      </span>
      <div className={`min-w-0 flex-1 ${included ? '' : 'opacity-60'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={d.recipientName}>{recipient.name}</span>
          {scheduleCount > 0 ? (
            <button
              type="button"
              className={d.schedulePill}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setExpanded((v) => !v)}
            >
              {pillLabel}
              <ChevronDown
                className={`size-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                strokeWidth={2}
                aria-hidden
              />
            </button>
          ) : null}
          {flagged ? <span className={d.checkDetailsPill}>Check details</span> : null}
        </div>
        <p className={d.recipientEmail}>{recipient.email}</p>
        {expanded ? (
          <div id={panelId} className={d.scheduleTableWrap}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th scope="col" className={`${d.scheduleTh} w-[96px]`}>
                    Schedule
                  </th>
                  <th scope="col" className={d.scheduleTh}>
                    Student and rotation
                  </th>
                </tr>
              </thead>
              <tbody>
                {recipient.schedules.map((line) => (
                  <tr key={`${line.scheduleId}-${line.studentName}`}>
                    <td className={`${d.scheduleTd} font-semibold`}>{line.scheduleId}</td>
                    <td className={d.scheduleTd}>
                      {line.studentName} — {line.rotation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </li>
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
              aria-label="Test email address"
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
