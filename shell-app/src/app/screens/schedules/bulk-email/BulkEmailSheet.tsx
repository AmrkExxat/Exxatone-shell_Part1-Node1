import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../../../components/ui/sheet';
import { partnersDrawer, partnersFont } from '../../partners/partnersTypography';
import {
  BULK_EMAIL_PERSONAS,
  deriveBulkEmailRecipients,
  type BulkEmailPersonaId,
  type BulkEmailRecipient,
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

  const [tickedPersonas, setTickedPersonas] = useState<Set<BulkEmailPersonaId>>(new Set());
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
      setTickedPersonas(new Set());
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

  const recipients = useMemo(
    () =>
      BULK_EMAIL_PERSONAS.filter((p) => tickedPersonas.has(p.id)).flatMap(
        (p) => recipientsByPersona[p.id],
      ),
    [tickedPersonas, recipientsByPersona],
  );

  const togglePersona = (id: BulkEmailPersonaId) => {
    setTickedPersonas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  const goNext = () => {
    if (isNextDisabled) return;
    if (isLastStep) {
      console.log('Bulk email send stub', {
        listKind,
        recipients,
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

  const stepHeading =
    listKind === 'group' ? 'Group' : listKind === 'individual' ? 'Individual' : 'All';

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
            <span className={bulkEmailDrawer.metaValue}>{selectedRows.length}</span>{' '}
            {selectedRows.length === 1 ? 'schedule' : 'schedules'} selected · {stepHeading}
          </span>
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
                tickedPersonas={tickedPersonas}
                onTogglePersona={togglePersona}
                recipients={recipients}
                validRecipientCount={recipients.length}
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
              />
            ) : null}
            {isLastStep ? (
              <BulkEmailPreviewStep
                recipients={recipients}
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
