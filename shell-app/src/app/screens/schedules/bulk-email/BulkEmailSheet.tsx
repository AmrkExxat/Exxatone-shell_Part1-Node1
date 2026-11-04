import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Sheet, SheetContent, SheetTitle } from '../../../components/ui/sheet';
import { partnersDrawer, partnersFont } from '../../partners/partnersTypography';
import {
  BULK_EMAIL_PERSONAS,
  deriveBulkEmailRecipients,
  groupedLetterFor,
  isGroupedTemplateId,
  type BulkEmailPersonaId,
  type BulkEmailRecipient,
  type BulkEmailSendMode,
} from '../../../config/bulkEmail';
import type { ScheduleListKind, ScheduleRecord } from '../../../config/schedules';
import { BULK_EMAIL_STEPS, bulkEmailDrawer } from './bulkEmailDrawer';
import { BulkEmailChevronStepper } from './BulkEmailChevronStepper';
import { BulkEmailRecipientsStep } from './BulkEmailRecipientsStep';
import { BulkEmailComposeStep, type Attachment, type ComposeMode } from './BulkEmailComposeStep';
import { BulkEmailPreviewStep, type DeliveryMode } from './BulkEmailPreviewStep';
import type { HeaderFooterLayoutId } from '../../../config/bulkEmail';

const LAST_STEP_INDEX = BULK_EMAIL_STEPS.length - 1;

export interface BulkEmailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listKind: ScheduleListKind;
  selectedRows: ScheduleRecord[];
}

export function BulkEmailSheet({ open, onOpenChange, listKind, selectedRows }: BulkEmailSheetProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);

  const [selectedPersona, setSelectedPersona] = useState<BulkEmailPersonaId | null>(null);
  const [sendMode, setSendMode] = useState<BulkEmailSendMode>('perPerson');
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [scheduleListOpen, setScheduleListOpen] = useState(false);
  const [replyTo, setReplyTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [testAddressEnabled, setTestAddressEnabled] = useState(false);
  const [testAddress, setTestAddress] = useState('');

  const [mode, setMode] = useState<ComposeMode>('template');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [headerFooterLayout, setHeaderFooterLayout] = useState<HeaderFooterLayoutId>('none');

  const [delivery, setDelivery] = useState<DeliveryMode>('now');
  const [scheduleDate, setScheduleDate] = useState<string | null>(null);
  const [scheduleTime, setScheduleTime] = useState('');
  const [previewBlocked, setPreviewBlocked] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setMaxVisitedStep(0);
      setSelectedPersona(null);
      setSendMode('perPerson');
      setExcludedIds(new Set());
      setScheduleListOpen(false);
      setReplyTo('');
      setCc('');
      setBcc('');
      setTestAddressEnabled(false);
      setTestAddress('');
      setMode('template');
      setTemplateId(null);
      setSubject('');
      setBody('');
      setAttachments([]);
      setHeaderFooterLayout('none');
      setDelivery('now');
      setScheduleDate(null);
      setScheduleTime('');
      setPreviewBlocked(false);
      return;
    }
    setReplyTo('clinical.placements@medstarhealth.org');
  }, [open]);

  const recipientsByPersona = useMemo(() => {
    const map = {} as Record<BulkEmailPersonaId, BulkEmailRecipient[]>;
    for (const persona of BULK_EMAIL_PERSONAS) {
      map[persona.id] = deriveBulkEmailRecipients(selectedRows, persona.id);
    }
    return map;
  }, [selectedRows]);

  const personaCounts = useMemo(() => {
    const counts = {} as Record<BulkEmailPersonaId, number>;
    for (const persona of BULK_EMAIL_PERSONAS) {
      counts[persona.id] = recipientsByPersona[persona.id].length;
    }
    return counts;
  }, [recipientsByPersona]);

  const personaRecipients = useMemo(
    () => (selectedPersona ? recipientsByPersona[selectedPersona] : []),
    [selectedPersona, recipientsByPersona],
  );
  const recipients = useMemo(
    () => personaRecipients.filter((r) => !excludedIds.has(r.id)),
    [personaRecipients, excludedIds],
  );

  const clearComposeDraft = () => {
    setTemplateId(null);
    setSubject('');
    setBody('');
  };

  const selectPersona = (id: BulkEmailPersonaId) => {
    if (id === selectedPersona) return;
    setSelectedPersona(id);
    setSendMode('perPerson');
    setExcludedIds(new Set());
    clearComposeDraft();
  };

  const changeSendMode = (mode: BulkEmailSendMode) => {
    setSendMode(mode);
    if (mode !== 'perPerson' && isGroupedTemplateId(templateId)) {
      clearComposeDraft();
    }
  };

  const toggleRecipient = (id: string) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllRecipients = (include: boolean) => {
    setExcludedIds(include ? new Set() : new Set(personaRecipients.map((r) => r.id)));
  };

  const isStep1 = currentStep === 0;
  const isStep2 = currentStep === 1;
  const isLastStep = currentStep === LAST_STEP_INDEX;

  const isStep1NextDisabled = recipients.length === 0 || replyTo.trim() === '';
  const isStep2NextDisabled = subject.trim() === '' || body.trim() === '';
  const isSendDisabled = previewBlocked || recipients.length === 0;

  const isNextDisabled = isStep1 ? isStep1NextDisabled : isStep2 ? isStep2NextDisabled : isSendDisabled;

  const nextLabel = isLastStep
    ? delivery === 'scheduled'
      ? 'Schedule email'
      : 'Send email'
    : 'Next';

  const letter = groupedLetterFor(selectedPersona, sendMode, selectedRows);

  const goNext = () => {
    if (isNextDisabled) return;
    if (isStep1 && letter && subject.trim() === '' && body.trim() === '') {
      setTemplateId(letter.template.id);
      setSubject(letter.template.subject);
      setBody(letter.template.body);
    }
    if (isLastStep) {
      console.log('Bulk email send stub', {
        listKind,
        recipients,
        sendMode,
        subject,
        body,
        replyTo,
        cc,
        bcc,
        testAddressEnabled,
        testAddress,
        attachments,
        delivery,
        scheduleDate,
        scheduleTime,
      });
      onOpenChange(false);
      return;
    }
    const next = Math.min(LAST_STEP_INDEX, currentStep + 1);
    setCurrentStep(next);
    setMaxVisitedStep((m) => Math.max(m, next));
  };

  const goPrevious = () => setCurrentStep((s) => Math.max(0, s - 1));

  const scheduleNoun = selectedRows.length === 1 ? 'schedule' : 'schedules';
  const scheduleKind = listKind === 'group' ? 'group ' : listKind === 'individual' ? 'individual ' : '';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={`${partnersFont} ${bulkEmailDrawer.sheet}`}>
        <SheetTitle className="sr-only">Compose Bulk Email</SheetTitle>

        <div className={partnersDrawer.header}>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className={partnersDrawer.closeBtn}
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
            <h2 className={`${partnersDrawer.title} truncate`}>Compose Bulk Email</h2>
          </div>
        </div>

        <div className={bulkEmailDrawer.metaRow}>
          <span className={bulkEmailDrawer.metaLabel}>
            <span className={bulkEmailDrawer.metaValue}>
              {selectedRows.length} {scheduleKind}
              {scheduleNoun}
            </span>{' '}
            selected
          </span>
          {selectedRows.length > 0 ? (
            <Popover open={scheduleListOpen} onOpenChange={setScheduleListOpen}>
              <PopoverTrigger asChild>
                <button type="button" className={bulkEmailDrawer.metaLink}>
                  View
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[380px] p-0" aria-label={`Selected ${scheduleNoun}`}>
                <p className="border-b border-[#eceef1] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.03em] text-[#616161]">
                  Selected {scheduleNoun}
                </p>
                <ul className="max-h-[280px] overflow-y-auto py-1">
                  {selectedRows.map((row) => (
                    <li key={row.id} className="flex gap-3 px-3 py-2 text-[13px] leading-5">
                      <span className="w-[72px] shrink-0 font-semibold text-[#212121]">
                        {row.scheduleId}
                      </span>
                      <span className="min-w-0 text-[#424242]">
                        {row.primaryName} — {row.availability}
                      </span>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          ) : null}
        </div>

        <div className={bulkEmailDrawer.stepperRow}>
          <BulkEmailChevronStepper
            currentStep={currentStep}
            maxVisitedStep={maxVisitedStep}
            onStepClick={setCurrentStep}
            onPrevious={goPrevious}
            onNext={goNext}
            isNextDisabled={isNextDisabled}
            nextLabel={nextLabel}
          />
        </div>

        <div className={bulkEmailDrawer.body}>
          <div className={bulkEmailDrawer.bodyScroll}>
            {isStep1 ? (
              <BulkEmailRecipientsStep
                personaCounts={personaCounts}
                selectedPersona={selectedPersona}
                onSelectPersona={selectPersona}
                sendMode={sendMode}
                onSendModeChange={changeSendMode}
                recipients={personaRecipients}
                excludedIds={excludedIds}
                onToggleRecipient={toggleRecipient}
                onToggleAllRecipients={toggleAllRecipients}
                replyTo={replyTo}
                onReplyToChange={setReplyTo}
                cc={cc}
                onCcChange={setCc}
                bcc={bcc}
                onBccChange={setBcc}
                testAddressEnabled={testAddressEnabled}
                onToggleTestAddress={() => setTestAddressEnabled((v) => !v)}
                testAddress={testAddress}
                onTestAddressChange={setTestAddress}
              />
            ) : null}
            {isStep2 ? (
              <BulkEmailComposeStep
                mode={mode}
                onModeChange={setMode}
                templateId={templateId}
                onTemplateChange={setTemplateId}
                subject={subject}
                onSubjectChange={setSubject}
                body={body}
                onBodyChange={setBody}
                attachments={attachments}
                onAddAttachment={(a) => setAttachments((prev) => [...prev, a])}
                onRemoveAttachment={(id) =>
                  setAttachments((prev) => prev.filter((a) => a.id !== id))
                }
                headerFooterLayout={headerFooterLayout}
                onHeaderFooterLayoutChange={setHeaderFooterLayout}
                sendMode={sendMode}
                letter={letter}
              />
            ) : null}
            {isLastStep ? (
              <BulkEmailPreviewStep
                recipients={recipients}
                selectedRows={selectedRows}
                sendMode={sendMode}
                subject={subject}
                body={body}
                replyTo={replyTo}
                cc={cc}
                bcc={bcc}
                attachments={attachments}
                testAddressEnabled={testAddressEnabled}
                testAddress={testAddress}
                delivery={delivery}
                onDeliveryChange={setDelivery}
                scheduleDate={scheduleDate}
                onScheduleDateChange={setScheduleDate}
                scheduleTime={scheduleTime}
                onScheduleTimeChange={setScheduleTime}
                onBlockingChange={setPreviewBlocked}
                goToCompose={() => setCurrentStep(1)}
                headerFooterLayout={mode === 'scratch' ? headerFooterLayout : null}
              />
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
