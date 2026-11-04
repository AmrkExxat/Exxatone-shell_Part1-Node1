import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Clock, Maximize, Minimize, Paperclip, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { IconButton } from '../../components/ui/icon-button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { SheetContent, SheetFooter } from '../../components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { cn } from '../../components/ui/utils';
import { CheckItem } from './CheckItem';
import { ChipInput, suggest, type Suggestion } from './ChipInput';
import { TagField } from './TagField';
import { tagDetails, type DescribeTag } from './TagDetails';
import { typeahead } from './TagTypeahead';
import { DrawerHeader } from './DrawerHeader';
import {
  FOOTER_OPTIONS,
  FooterBlock,
  HEADER_OPTIONS,
  HeaderBlock,
  HeaderFooterPicker,
  type FooterKind,
  type HeaderKind,
} from './HeaderFooter';
import { GmailPreview } from './GmailPreview';
import { LeoWrite } from './LeoWrite';
import { RecipientsReview } from './RecipientsReview';
import { RichTextEditor } from './RichTextEditor';
import { useEmailTemplates } from '../../config/emailTemplateStore';
import { BLANK_BODY, MERGE_TAGS, templatesFor, type ComposerTemplate } from './templates';
import { resolveFor, resolveSubjectFor } from './merge';
import {
  COMPOSER_ROLES,
  ROLE_LABEL,
  emailProblem,
  isEmptyGroupScheduleRow,
  isEmptyRosterRecipient,
  sendableScheduleRows,
  type Attachment,
  type ComposerContext,
  type ComposerRecipient,
  type ComposerRole,
} from './types';

interface Props {
  ctx: ComposerContext;
  onClose: () => void;
}

const emails = (k: number) => (k === 1 ? 'email' : 'emails');

function audienceCount(n: number, role: ComposerRole): string {
  const many = ROLE_LABEL[role].toLowerCase();
  const one = many.replace(/s$/, '');
  return `${n} ${n === 1 ? one : many}`;
}

/** Group schedules in this send, counted once even when several people share the same id. */
function groupScheduleCoverage(ctx: ComposerContext): { total: number; empty: number } {
  const byId = new Map<string, boolean>();
  ctx.recipients.forEach((person) => {
    person.rows.forEach((row) => {
      if (!row.group || !row.scheduleId) return;
      const empty = isEmptyGroupScheduleRow(row);
      const previous = byId.get(row.scheduleId);
      if (previous === undefined) byId.set(row.scheduleId, empty);
      else if (!empty) byId.set(row.scheduleId, false);
    });
  });
  const empty = [...byId.values()].filter(Boolean).length;
  return { total: byId.size, empty };
}

function emptyRosterHint(total: number, empty: number): string | null {
  if (!empty || !total) return null;
  const verb = empty === 1 ? 'has' : 'have';
  const pronoun = empty === 1 ? 'it' : 'they';
  return `${empty} of ${total} selected group schedules ${verb} no students assigned yet, so ${pronoun} will not get an email.`;
}

function formatScheduleStamp(date: string, time: string): string {
  const when = new Date(`${date}T${time || '09:00'}`);
  if (Number.isNaN(when.getTime())) return 'Pick a date and time';
  return when.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function SendCheck({
  rows,
  hints,
}: {
  rows: { label: string; value: string }[];
  hints: string[];
}) {
  return (
    <div className="grid gap-3">
      <dl className="grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-[#6b7280]">{row.label}</dt>
            <dd className="min-w-0 break-words text-[#111827]">{row.value}</dd>
          </div>
        ))}
      </dl>
      {hints.map((hint) => (
        <p key={hint} className="text-[13px] font-medium leading-5 text-[#e65100]">
          {hint}
        </p>
      ))}
    </div>
  );
}

function Row({ label, children, className, required }: { label: string; children: React.ReactNode; className?: string; required?: boolean }) {
  return (
    <div className={cn('grid grid-cols-[84px_1fr] items-start gap-3 border-b px-4 py-2 text-sm', className)}>
      <span className="pt-1 text-muted-foreground">
        {label}
        {required && <b className="ml-0.5 text-destructive">*</b>}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Matches the "Default" badge on Email Templates cards. */
const defaultBadge = 'inline-flex items-center rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#2e7d32]';

function NameLines({
  people,
  onMore,
}: {
  people: { id: string; name: string; email: string }[];
  onMore: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const limit = el.clientHeight;
    let count = 0;
    Array.from(el.children).forEach((child) => {
      const node = child as HTMLElement;
      if (node.offsetTop + 4 >= limit) count += 1;
    });
    setHidden(count);
  }, [people]);
  if (!people.length) return null;
  return (
    <div className="relative mt-1">
      <div ref={ref} className="flex max-h-[4.5rem] flex-wrap items-center gap-x-1 overflow-hidden text-sm leading-6">
        {people.map((person, index) => (
          <Tooltip key={person.id}>
            <TooltipTrigger asChild>
              <span className="cursor-default text-[#212121]">
                {person.name}
                {index < people.length - 1 ? ',' : ''}
              </span>
            </TooltipTrigger>
            <TooltipContent>{person.email || 'No email address'}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      {hidden > 0 && (
        <button type="button" className="absolute bottom-0 right-0 bg-white pl-2 text-sm font-medium text-[#3f51b5]" onClick={onMore}>
          +{hidden} more
        </button>
      )}
    </div>
  );
}

/**
 * The composer drawer. Everything it knows about the page comes from `ctx`: who can be
 * emailed, which placements they are on (merge fields, @Schedule table), who is sending.
 */
export function EmailComposerDrawer({ ctx, onClose }: Props) {
  const brand = ctx.sender.brand;
  const [emailTemplates] = useEmailTemplates();
  const TPL = useMemo(() => templatesFor(emailTemplates, ctx.kind ?? 'individual'), [emailTemplates, ctx.kind]);
  const rolesAvail = useMemo(() => COMPOSER_ROLES.filter((r) => ctx.recipients.some((p) => p.role === r)), [ctx]);

  const [role, setRole] = useState<ComposerRole | null>(ctx.prefill?.role ?? null);
  const [ccPicked, setCcPicked] = useState<Set<string>>(new Set());
  const [ccBrowse, setCcBrowse] = useState<ComposerRole | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [extras, setExtras] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [from, setFrom] = useState<string[]>([ctx.sender.name]);
  const [replyTo, setReplyTo] = useState<string[]>([ctx.sender.replyTo]);
  const [showCc, setShowCc] = useState(false);
  const senderOptions: Suggestion[] = useMemo(
    () => [
      { value: ctx.sender.name, name: ctx.sender.name, email: ctx.sender.email, tag: 'Shared inbox' },
      { value: ctx.sender.replyTo, name: ctx.sender.replyTo, email: ctx.sender.me, tag: 'Coordinator' },
    ],
    [ctx.sender],
  );
  const people_dir: Suggestion[] = useMemo(
    () => [
      ...ctx.recipients.map((r) => ({ value: r.email, name: r.name, email: r.email, tag: ROLE_LABEL[r.role].replace(/s$/, '') })),
      ...senderOptions.map((o) => ({ ...o, value: o.email })),
    ],
    [ctx.recipients, senderOptions],
  );
  const [showBcc, setShowBcc] = useState(false);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [skipPrev, setSkipPrev] = useState(false);
  const [split, setSplit] = useState(false);
  const [copyMe, setCopyMe] = useState(false);
  const [tplBy, setTplBy] = useState<Record<string, string>>(() => Object.fromEntries(COMPOSER_ROLES.map((r) => [r, TPL[r][0].id])));
  const [subjectBy, setSubjectBy] = useState<Record<string, string>>(() => Object.fromEntries(COMPOSER_ROLES.map((r) => [r, ctx.prefill?.role === r ? ctx.prefill.subject : TPL[r][0].subject])));
  const [bodyBy, setBodyBy] = useState<Record<string, string>>(() => Object.fromEntries(COMPOSER_ROLES.map((r) => [r, ctx.prefill?.role === r ? ctx.prefill.body : TPL[r][0].body])));
  const [over, setOver] = useState<Record<string, { subject: string; body: string }>>({});
  const defaultIsOwn = (r: ComposerRole) => TPL[r][0]?.id === 'blank';
  const [hdr, setHdr] = useState<HeaderKind>(() =>
    rolesAvail[0] && defaultIsOwn(rolesAvail[0]) ? 'none' : 'logo',
  );
  const [ftr, setFtr] = useState<FooterKind>(() =>
    rolesAvail[0] && defaultIsOwn(rolesAvail[0]) ? 'none' : 'exxat',
  );
  const [stage, setStage] = useState<'review' | 'compose'>('review');
  const [reviewVisit, setReviewVisit] = useState<'start' | 'edit' | 'copy'>('start');
  const [emailFix, setEmailFix] = useState<Record<string, string>>({});
  const [hiddenTemplates, setHiddenTemplates] = useState<Set<string>>(new Set());
  const [templateQuery, setTemplateQuery] = useState('');
  const [templateEvent, setTemplateEvent] = useState('all');
  const [managingTemplates, setManagingTemplates] = useState(false);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const asAttachments = (t: { attachments?: { name: string; size: number }[] }): Attachment[] =>
    (t.attachments ?? []).map((a) => ({ id: `t-${a.name}`, name: a.name, size: a.size, fromTemplate: true }));
  const [attBy, setAttBy] = useState<Record<string, Attachment[]>>(() =>
    Object.fromEntries(COMPOSER_ROLES.map((r) => [r, ctx.prefill?.role === r ? [] : asAttachments(TPL[r][0])])),
  );
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [dlg, setDlg] = useState<null | 'now' | 'later'>(null);
  const [date, setDate] = useState('2026-11-03');
  const [time, setTime] = useState('09:00');

  useEffect(() => {
    if (role || !rolesAvail[0]) return;
    setRole(rolesAvail[0]);
  }, [role, rolesAvail]);

  const locked = !role;
  const recipients = useMemo(
    () => ctx.recipients.map((person) => (emailFix[person.id] ? { ...person, email: emailFix[person.id] } : person)),
    [ctx.recipients, emailFix],
  );
  const people = useMemo(() => (role ? recipients.filter((p) => p.role === role) : []), [recipients, role]);
  const blocked = (p: ComposerRecipient) =>
    !!emailProblem(p) || (skipPrev && !!p.lastEmailed) || isEmptyRosterRecipient(p);
  const eligible = people.filter((p) => !blocked(p) && !excluded.has(p.id));
  const alreadyEmailed = people.filter((p) => skipPrev && !!p.lastEmailed).length;
  const missingEmail = people.filter((p) => !!emailProblem(p)).length;
  const canSplit = role === 'faculty' || role === 'preceptor';
  const n = eligible.length + extras.length;
  const copyRoles = useMemo(() => rolesAvail.filter((item) => item !== role), [rolesAvail, role]);
  useEffect(() => {
    if (ccBrowse && copyRoles.includes(ccBrowse)) return;
    setCcBrowse(copyRoles[0] ?? null);
  }, [ccBrowse, copyRoles]);
  useEffect(() => {
    if (!role) return;
    setCcPicked((prev) => {
      const owned = new Set(recipients.filter((person) => person.role === role).map((person) => person.id));
      let changed = false;
      const next = new Set(prev);
      owned.forEach((id) => {
        if (next.delete(id)) changed = true;
      });
      return changed ? next : prev;
    });
  }, [role, recipients]);
  const ccEligible = recipients.filter(
    (person) => person.role !== role && ccPicked.has(person.id) && !emailProblem(person) && !(skipPrev && person.lastEmailed),
  );
  const ccEmails = [...ccEligible.map((p) => p.email).filter(Boolean), ...cc];
  const units =
    split && canSplit
      ? eligible.reduce((a, p) => a + sendableScheduleRows(p.rows).length, 0) + extras.length
      : n;
  const multi = eligible.filter((p) => p.rows.length > 1);
  /** Reflects what the user has actually chosen so far, not just what the page handed over. */
  const selectionBadge = role
    ? `${ROLE_LABEL[role]} · ${eligible.length} of ${people.length} selected${extras.length ? ` + ${extras.length} added` : ''} · ${units} ${emails(units)}`
    : `${ctx.source}${ctx.subtitle ? ` · ${ctx.subtitle}` : ''}`;

  const fp = expanded && openId ? people.find((p) => p.id === openId) ?? null : null;
  const shownFor = (p: ComposerRecipient) =>
    over[p.id] ?? { subject: resolveSubjectFor(p, subjectBy[p.role]), body: resolveFor(p, bodyBy[p.role]) };
  const subject = locked ? '' : fp ? shownFor(fp).subject : subjectBy[role!];
  const body = locked ? '' : fp ? shownFor(fp).body : bodyBy[role!];
  const tpl = role ? TPL[role].find((t) => t.id === tplBy[role]) : undefined;
  const dirty = !!role && !fp && !!tpl && (tpl.id === 'blank' || tpl.body !== bodyBy[role] || tpl.subject !== subjectBy[role]);

  const setSubject = (v: string) => {
    if (!role) return;
    if (fp) setOver((o) => ({ ...o, [fp.id]: { ...shownFor(fp), subject: v } }));
    else setSubjectBy((s) => ({ ...s, [role]: v }));
  };
  const setBody = (html: string) => {
    if (!role) return;
    if (fp) {
      if (html !== shownFor(fp).body) setOver((o) => ({ ...o, [fp.id]: { ...shownFor(fp), body: html } }));
    } else setBodyBy((b) => ({ ...b, [role]: html }));
  };
  const applyTemplate = (id: string) => {
    if (!role) return;
    const t = TPL[role].find((x) => x.id === id)!;
    const own = id === 'blank';
    setHdr(own ? 'none' : 'logo');
    setFtr(own ? 'none' : 'exxat');
    if (fp) {
      setOver((o) => ({ ...o, [fp.id]: { subject: resolveSubjectFor(fp, t.subject), body: resolveFor(fp, t.body) } }));
      toast(own ? `Cleared for ${fp.name}` : `Template applied to ${fp.name}`, { position: 'top-center' });
    } else {
      if (tplBy[role] === id) return;
      setTplBy((m) => ({ ...m, [role]: id }));
      setAttBy((m) => ({ ...m, [role]: [...(m[role] ?? []).filter((a) => !a.fromTemplate), ...(own ? [] : asAttachments(t))] }));
      setSubjectBy((s) => ({ ...s, [role]: own ? '' : t.subject }));
      setBodyBy((b) => ({ ...b, [role]: own ? BLANK_BODY : t.body }));
      if (!own) {
        const attached = t.attachments?.length ?? 0;
        toast(
          attached
            ? `Template applied to ${ROLE_LABEL[role]}, with ${attached} attachment${attached === 1 ? '' : 's'}`
            : `Template applied to ${ROLE_LABEL[role]}`,
          { position: 'top-center' },
        );
      }
    }
    setTemplateOpen(false);
  };
  const closeCc = () => {
    setShowCc(false);
    setCc([]);
    setCcPicked(new Set());
    if (reviewVisit === 'copy') setStage('compose');
    setReviewVisit('start');
  };
  const closeBcc = () => {
    setShowBcc(false);
    setBcc([]);
    setCopyMe(false);
  };
  const setMany = (ids: string[], on: boolean) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (on ? next.delete(id) : next.add(id)));
      return next;
    });
  const setManyCc = (ids: string[], on: boolean) =>
    setCcPicked((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
      return next;
    });
  const openRecipients = (which: 'to' | 'cc') => {
    setReviewVisit(which === 'cc' ? 'copy' : 'edit');
    setStage('review');
  };
  const backToLetter = () => {
    setReviewVisit('start');
    setStage('compose');
  };
  const toggleCopy = (v: boolean) => {
    setCopyMe(v);
    if (v) {
      setBcc((b) => (b.includes(ctx.sender.me) ? b : [...b, ctx.sender.me]));
      setShowBcc(true);
    } else setBcc((b) => b.filter((x) => x !== ctx.sender.me));
  };

  const attachments = role ? attBy[role] ?? [] : [];
  const previewPerson = fp ?? people.find((p) => p.id === previewId) ?? eligible[0] ?? people[0];
  /** What a merge tag turns into for the person being previewed (shown in the tag's details). */
  const describe: DescribeTag = (tag) => {
    if (!previewPerson) return null;
    const n = previewPerson.rows.length;
    return {
      person: previewPerson.name,
      value: tag === '@Schedule table' ? `a table with ${n} placement row${n === 1 ? '' : 's'}` : resolveFor(previewPerson, tag).replace(/<[^>]+>/g, ''),
    };
  };
  const coverage = groupScheduleCoverage(ctx);
  const issueHints = [
    emptyRosterHint(coverage.total, coverage.empty),
    alreadyEmailed
      ? `${alreadyEmailed} ${alreadyEmailed === 1 ? 'person already received' : 'people already received'} this email and ${alreadyEmailed === 1 ? 'is' : 'are'} skipped.`
      : null,
    missingEmail
      ? `${missingEmail} ${missingEmail === 1 ? 'person has' : 'people have'} no usable email address and ${missingEmail === 1 ? 'is' : 'are'} skipped.`
      : null,
  ].filter((line): line is string => Boolean(line));
  const deliveryShape =
    split && canSplit
      ? 'one email for each schedule'
      : multi.length
        ? 'one per person; people with more than one schedule get them in a single email'
        : 'one per person';
  const summaryRows = (when: 'now' | 'later') => {
    const rows: { label: string; value: string }[] = [
      { label: 'Template', value: tpl?.label || 'Blank email' },
      { label: 'To', value: role ? `${audienceCount(eligible.length, role)}${extras.length ? ` and ${extras.length} added` : ''}` : '—' },
      { label: 'Emails', value: `${units}${when === 'now' ? ' now' : ''} — ${deliveryShape}` },
      { label: 'Subject', value: subject.replace(/<[^>]+>/g, '').trim() || 'No subject' },
      { label: 'From', value: brand.name },
    ];
    if (when === 'later') rows.push({ label: 'Scheduled for', value: formatScheduleStamp(date, time) });
    if (attachments.length) rows.push({ label: 'Attachments', value: attachments.map((file) => file.name).join(', ') });
    if (ccEmails.length) rows.push({ label: 'Cc', value: ccEmails.join(', ') });
    if (bcc.length) rows.push({ label: 'Bcc', value: bcc.join(', ') });
    return rows;
  };

  const reviewProps = {
    roles: rolesAvail,
    role: role!,
    onRole: (next: ComposerRole) => {
      setRole(next);
      setOpenId(null);
    },
    peopleFor: (next: ComposerRole) => recipients.filter((person) => person.role === next),
    included: (person: ComposerRecipient) => !blocked(person) && !excluded.has(person.id),
    onToggle: (id: string, on: boolean) => setMany([id], on),
    onSetMany: setMany,
    onFixEmail: (id: string, email: string) => setEmailFix((current) => ({ ...current, [id]: email })),
    split,
    canSplit,
    onSplit: setSplit,
    skipPrev,
    onSkipPrev: setSkipPrev,
    copyMe,
    onCopyMe: toggleCopy,
    meEmail: ctx.sender.me,
    recipientCount: n,
    emailCount: units,
  };

  const send = (when: string | null) => {
    toast.success(when ? `${units} ${emails(units)} scheduled for ${when}` : `${units} ${emails(units)} queued`, {
      description: `From ${ctx.source}. You can follow delivery from the Email Dashboard.`,
    });
    setDlg(null);
    onClose();
  };

  return (
    <SheetContent
      className={cn(
        'gap-0 p-0 transition-[width,max-width] duration-300 [&>button.absolute]:hidden',
        expanded ? 'w-screen max-w-none sm:max-w-none' : 'w-[680px] sm:max-w-[680px]',
      )}
      onEscapeKeyDown={(e) => (typeahead.open || tagDetails.open || suggest.open) && e.preventDefault()}
    >
      <DrawerHeader
        title={stage === 'review' ? 'Recipients and options' : 'New email'}
        badge={selectionBadge}
        description={
          stage === 'review'
            ? reviewVisit === 'copy'
              ? 'Copy people from the other audiences on these schedules.'
              : 'Check who will get this email, then write it.'
            : 'Write an email to people on the schedules you selected.'
        }
      >
        {stage === 'compose' && (
          <Button type="button" variant="outline" size="sm" onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}>
            {view === 'edit' ? 'Preview' : 'Edit'}
          </Button>
        )}
        <IconButton
          label={expanded ? 'Exit full screen' : 'Full screen'}
          className="size-8"
          onClick={() => { setExpanded(!expanded); setOpenId(null); }}
        >
          {expanded ? <Minimize /> : <Maximize />}
        </IconButton>
      </DrawerHeader>
      <p id="tag-hint" className="sr-only">Type @ to insert a merge tag, such as the recipient's first name.</p>

      <div className="flex min-h-0 flex-1">
        {expanded && stage === 'compose' && role && (
          <TemplateLibrary
            templates={TPL[role]}
            selectedId={tplBy[role]}
            hidden={hiddenTemplates}
            query={templateQuery}
            event={templateEvent}
            managing={managingTemplates}
            onQuery={setTemplateQuery}
            onEvent={setTemplateEvent}
            onManaging={setManagingTemplates}
            onPick={applyTemplate}
            onHide={(id) => setHiddenTemplates((current) => new Set(current).add(id))}
            onShow={(id) =>
              setHiddenTemplates((current) => {
                const next = new Set(current);
                next.delete(id);
                return next;
              })
            }
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {stage === 'review' && role ? (
            reviewVisit === 'copy' && ccBrowse ? (
              <RecipientsReview
                {...reviewProps}
                variant="copy"
                showStats={false}
                roles={copyRoles}
                role={ccBrowse}
                onRole={setCcBrowse}
                included={(person) => ccPicked.has(person.id)}
                onToggle={(id, on) => setManyCc([id], on)}
                onSetMany={setManyCc}
              />
            ) : (
              <RecipientsReview {...reviewProps} showStats={reviewVisit === 'start'} />
            )
          ) : view === 'preview' ? (
            <GmailPreview
              locked={locked}
              person={previewPerson}
              people={eligible.length ? eligible : people}
              onPick={setPreviewId}
              subject={previewPerson ? (fp ? subject : resolveSubjectFor(previewPerson, subject)) : ''}
              bodyHtml={previewPerson ? (fp ? body : resolveFor(previewPerson, body)) : ''}
              hdr={hdr}
              ftr={ftr}
              brand={brand}
              from={{ name: from.join(', ') || ctx.sender.name, email: ctx.sender.email, replyTo: replyTo.join(', ') || ctx.sender.email }}
              cc={ccEmails}
              attachments={attachments}
            />
          ) : (
          <>
          <div className="border-b px-4 py-2 text-sm">
            <div className="grid grid-cols-[84px_1fr] items-center gap-3 py-1">
              <span className="text-[#6b7280]">From</span>
              <ChipInput list={from} onChange={setFrom} label="Send from" placeholder="Add name or email" suggestions={senderOptions} />
            </div>
            <div className="grid grid-cols-[84px_1fr] items-center gap-3 py-1">
              <span className="text-[#6b7280]">Reply to</span>
              <ChipInput list={replyTo} onChange={setReplyTo} label="Reply to" placeholder="Add name or email" suggestions={people_dir} />
            </div>
          </div>
          <div className="border-b px-4 py-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-[#6b7280]">To</span>
              <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => openRecipients('to')}>
                Edit recipients
              </Button>
              <span className="ml-auto flex items-center gap-2">
                {!showCc && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setShowCc(true)}>
                    Cc
                  </Button>
                )}
                {!showBcc && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setShowBcc(true)}>
                    Bcc
                  </Button>
                )}
              </span>
            </div>
            <NameLines
              people={eligible.map((person) => ({ id: person.id, name: person.name, email: person.email }))}
              onMore={() => openRecipients('to')}
            />
          </div>
          {showCc && (
            <Row label="Cc">
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => openRecipients('cc')} disabled={!copyRoles.length}>
                    Add recipients
                  </Button>
                  <button
                    type="button"
                    className="ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded text-[#616161] hover:bg-[#f5f5f5] hover:text-[#424242]"
                    aria-label="Close Cc"
                    onClick={closeCc}
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <NameLines
                  people={ccEligible.map((person) => ({ id: person.id, name: person.name, email: person.email }))}
                  onMore={() => openRecipients('cc')}
                />
                <ChipInput
                  list={cc}
                  onChange={setCc}
                  label="Add Cc"
                  placeholder="Add name or email"
                  suggestions={people_dir}
                  className="w-full flex-none"
                />
              </div>
            </Row>
          )}
          {showBcc && (
            <Row label="Bcc">
              <div className="flex min-w-0 items-start gap-2">
                <ChipInput
                  list={bcc}
                  onChange={(v) => { setBcc(v); setCopyMe(v.includes(ctx.sender.me)); }}
                  label="Add Bcc"
                  placeholder="Add name or email"
                  suggestions={people_dir}
                  className="min-w-0 flex-1"
                />
                <button
                  type="button"
                  className="ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded text-[#616161] hover:bg-[#f5f5f5] hover:text-[#424242]"
                  aria-label="Close Bcc"
                  onClick={closeBcc}
                >
                  <X className="size-4" />
                </button>
              </div>
            </Row>
          )}

          <div className={cn('flex flex-1 flex-col', locked && 'pointer-events-none select-none opacity-45')} aria-disabled={locked}>
            {(
              <DropdownMenu open={!!role && templateOpen} onOpenChange={setTemplateOpen}>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={cn('grid w-full grid-cols-[84px_1fr] items-center gap-3 border-b px-4 py-2 text-left text-sm hover:bg-accent/40', expanded && 'lg:hidden')}>
                    <span className="text-muted-foreground">Template</span>
                    <span className="flex min-w-0 items-center justify-between gap-2">
                      <span className="truncate font-medium" title={tpl?.label}>
                        {fp && over[fp.id] ? 'Edited for one person' : tpl?.label ?? ''}
                      </span>
                      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-96 w-[min(560px,90vw)]">
                  {role && TPL[role].filter((item) => item.id !== 'blank').length >= 7 && (
                    <div className="p-2">
                      <Input
                        value={templateQuery}
                        onChange={(event) => setTemplateQuery(event.target.value)}
                        onKeyDown={(event) => event.stopPropagation()}
                        placeholder="Search templates"
                        aria-label="Search templates"
                        className="h-8"
                      />
                    </div>
                  )}
                  {role && (
                    <CheckItem selected={tplBy[role] === 'blank'} onSelect={() => applyTemplate('blank')} className="items-start">
                      <span className="min-w-0 break-words">
                        Write your own
                        <small className="block text-xs text-muted-foreground">Start with an empty email</small>
                      </span>
                    </CheckItem>
                  )}
                  <DropdownMenuSeparator />
                  {(role ? TPL[role] : [])
                    .filter((item) => item.id !== 'blank' && !hiddenTemplates.has(item.id))
                    .filter((item) => {
                      const q = templateQuery.trim().toLowerCase();
                      return !q || `${item.label} ${item.subject}`.toLowerCase().includes(q);
                    })
                    .map((t) => (
                      <CheckItem key={t.id} selected={!!role && tplBy[role] === t.id} onSelect={() => applyTemplate(t.id)} className="items-start">
                        <span className="min-w-0 break-words">
                          <span className="inline-flex items-center gap-2">
                            {t.label}
                            {t.isDefault && <span className={defaultBadge}>Default</span>}
                          </span>
                          {t.subject && <small className="line-clamp-1 block text-xs text-muted-foreground">{t.subject}</small>}
                        </span>
                      </CheckItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Row label="Subject">
              <TagField value={subject} onChange={setSubject} disabled={locked} label="Subject" placeholder="Subject" describe={describe} />
            </Row>

            {fp && (
              <div className="flex items-center justify-between gap-3 border-b bg-accent/50 px-4 py-2 text-sm">
                <div>
                  <b>{fp.name}</b> <Badge variant="secondary">{ROLE_LABEL[fp.role].replace(/s$/, '')}</Badge>{' '}
                  <span className="text-muted-foreground">{fp.email || 'no email address'}</span>
                  <div className="text-xs text-muted-foreground">You are editing the email this person will get. Changes apply to them only.</div>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" disabled={!over[fp.id]} onClick={() => { setOver(({ [fp.id]: _x, ...rest }) => rest); toast('Back to the template'); }}>
                    Reset to template
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setOpenId(null)}>
                    Back to template
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-1 flex-col gap-2 px-4 pb-2 pt-3">
              {view === 'edit' ? (
                <RichTextEditor
                  value={body}
                  onChange={setBody}
                  tags={MERGE_TAGS}
                  describe={describe}
                  onAttach={(f) => role && setAttBy((m) => ({ ...m, [role]: [...(m[role] ?? []), ...f.map((x, i) => ({ id: `u-${Date.now()}-${i}`, name: x.name, size: x.size }))] }))}
                  disabled={locked}
                  placeholder="Write email content, or enter @ to insert a merge field"
                  top={
                    <HeaderFooterPicker noun="header" position="top" value={hdr} options={HEADER_OPTIONS} onChange={setHdr}>
                      <HeaderBlock kind={hdr} brand={brand} />
                    </HeaderFooterPicker>
                  }
                  bottom={
                    <HeaderFooterPicker noun="footer" position="bottom" value={ftr} options={FOOTER_OPTIONS} onChange={setFtr}>
                      <FooterBlock kind={ftr} brand={brand} />
                    </HeaderFooterPicker>
                  }
                  toolbarStart={
                    role && (
                      <LeoWrite
                        role={role}
                        brandName={brand.name}
                        count={n}
                        disabled={locked}
                        onInsert={(d) => {
                          if (fp) setOver((o) => ({ ...o, [fp.id]: { subject: resolveSubjectFor(fp, d.subject), body: resolveFor(fp, d.body) } }));
                          else {
                            setSubjectBy((m) => ({ ...m, [role]: d.subject }));
                            setBodyBy((m) => ({ ...m, [role]: d.body }));
                          }
                          toast('Draft from Leo added. Review it before you send.');
                        }}
                      />
                    )
                  }
                  below={
                    attachments.length > 0 ? (
                      <ul className="flex flex-wrap gap-1.5 pt-2" aria-label="Attachments">
                        {attachments.map((a) => (
                          <Badge
                            key={a.id}
                            variant="outline"
                            className="h-7 gap-1.5 rounded-full border-[#c5cae9] bg-[#eef0fb] px-2.5 py-0 text-[13px] font-normal text-[#3f51b5]"
                          >
                            <Paperclip className="size-3.5" />
                            <span className="max-w-[280px] truncate" title={a.name}>{a.name}</span>
                            <IconButton
                              label={`Remove ${a.name}`}
                              tooltipSide="top"
                              className="size-4 rounded-sm text-[#3f51b5] hover:bg-transparent hover:text-[#283593]"
                              onClick={() => role && setAttBy((m) => ({ ...m, [role]: (m[role] ?? []).filter((x) => x.id !== a.id) }))}
                            >
                              <X className="size-3" />
                            </IconButton>
                          </Badge>
                        ))}
                      </ul>
                    ) : null
                  }
                />
              ) : null}
            </div>
          </div>
          </>
          )}
        </div>
        </div>
      </div>

      <SheetFooter className="mt-0 flex-row items-center gap-2 border-t p-3">
        {stage === 'review' ? (
          <>
            <Button disabled={reviewVisit === 'start' && !n} onClick={() => (reviewVisit === 'start' ? setStage('compose') : backToLetter())}>
              {reviewVisit === 'start' ? 'Compose' : 'Done'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </>
        ) : (
        <>
        <div className="flex">
          <Button className="rounded-r-none" disabled={!n} onClick={() => setDlg('now')}>
            {n && units !== n ? `Send ${units} ${emails(units)}` : n ? `Send to ${n}` : 'Send'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-l-none border-l border-primary-foreground/25 px-2" disabled={!n} aria-label="More send options">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuItem onSelect={() => setDlg('now')}>
                <Send /> <span>Send now<small className="block text-xs text-muted-foreground">Starts sending immediately</small></span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDlg('later')}>
                <Clock /> <span>Schedule for later<small className="block text-xs text-muted-foreground">Pick a date and time</small></span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline" disabled={locked} onClick={() => toast.success(`Test email sent to ${ctx.sender.me}`)}>
          Send test email
        </Button>
        {dirty && (
          <Button variant="ghost" className="ml-auto" onClick={() => toast.success('Saved as a template')}>
            Save as template
          </Button>
        )}
        </>
        )}
      </SheetFooter>

      <AlertDialog open={dlg === 'now'} onOpenChange={(o) => !o && setDlg(null)}>
        <AlertDialogContent className="sm:max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Send this email?</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Review the template, recipients, and any schedules that will not get an email before sending.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <SendCheck rows={summaryRows('now')} hints={issueHints} />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => send(null)}>Send {units} {emails(units)}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={dlg === 'later'} onOpenChange={(o) => !o && setDlg(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Schedule this email?</DialogTitle>
            <DialogDescription className="sr-only">
              Review the template, recipients, and send time before scheduling. Times use your time zone.
            </DialogDescription>
          </DialogHeader>
          <SendCheck rows={summaryRows('later')} hints={issueHints} />
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm font-medium">
              Date
              <Input type="date" value={date} min="2026-11-02" onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Time
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          </div>
          <p className="text-xs text-[#6b7280]">Times use your time zone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDlg(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const d = new Date(`${date}T${time || '09:00'}`);
                send(isNaN(d.getTime()) ? 'later' : d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }));
              }}
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SheetContent>
  );
}

function TemplateLibrary({
  templates,
  selectedId,
  hidden,
  query,
  event,
  managing,
  onQuery,
  onEvent,
  onManaging,
  onPick,
  onHide,
  onShow,
}: {
  templates: ComposerTemplate[];
  selectedId: string;
  hidden: Set<string>;
  query: string;
  event: string;
  managing: boolean;
  onQuery: (value: string) => void;
  onEvent: (value: string) => void;
  onManaging: (value: boolean) => void;
  onPick: (id: string) => void;
  onHide: (id: string) => void;
  onShow: (id: string) => void;
}) {
  const letters = templates.filter((item) => item.id !== 'blank');
  const events = ['all', ...new Set(letters.map((item) => item.eventLabel).filter((label): label is string => Boolean(label)))];
  const matches = (item: ComposerTemplate) => {
    if (event !== 'all' && item.eventLabel !== event) return false;
    const q = query.trim().toLowerCase();
    return !q || `${item.label} ${item.subject}`.toLowerCase().includes(q);
  };
  const shown = letters.filter((item) => !hidden.has(item.id) && matches(item));
  const concealed = letters.filter((item) => hidden.has(item.id) && matches(item));
  return (
    <aside className="hidden w-[320px] shrink-0 flex-col gap-3 overflow-y-auto border-r p-4 md:flex">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Templates</h2>
        <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onManaging(!managing)}>
          {managing ? 'Done' : 'Manage'}
        </Button>
      </div>
      <Input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search templates" aria-label="Search templates" className="h-8" />
      <select
        value={event}
        onChange={(e) => onEvent(e.target.value)}
        aria-label="Filter templates by event"
        className="h-8 rounded-md border border-[#e5e7eb] bg-white px-2 text-sm"
      >
        {events.map((item) => (
          <option key={item} value={item}>
            {item === 'all' ? 'All events' : item}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => onPick('blank')}
        aria-current={selectedId === 'blank'}
        className={cn(
          'grid gap-0.5 rounded-lg border p-3 text-left',
          selectedId === 'blank' ? 'border-[#3f51b5] bg-[#eef0fb]' : 'border-[#e5e7eb] hover:bg-muted',
        )}
      >
        <span className="text-sm font-semibold text-[#212121]">Write your own</span>
        <span className="text-xs text-[#616161]">Start with an empty email</span>
      </button>
      {shown.map((item) => (
        <div
          key={item.id}
          className={cn(
            'rounded-lg border p-3',
            selectedId === item.id ? 'border-[#3f51b5] bg-[#eef0fb]' : 'border-[#e5e7eb] hover:bg-muted',
          )}
        >
          <button type="button" onClick={() => onPick(item.id)} className="grid w-full gap-0.5 text-left">
            <span className="inline-flex flex-wrap items-center gap-2 text-sm font-semibold text-[#212121]">
              {item.label}
              {item.isDefault && <span className={defaultBadge}>Default</span>}
            </span>
            <span className="line-clamp-2 text-xs text-[#616161]">{item.subject || 'No subject'}</span>
          </button>
          {managing && item.id !== 'blank' && (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="mt-1 h-auto p-0 text-xs font-medium text-[#3f51b5] hover:text-[#283593]"
              onClick={() => onHide(item.id)}
            >
              Remove from list
            </Button>
          )}
        </div>
      ))}
      {managing && concealed.length > 0 && (
        <div className="grid gap-2">
          <h3 className="text-xs font-semibold text-muted-foreground">Hidden</h3>
          {concealed.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-dashed p-2">
              <span className="text-sm">{item.label}</span>
              <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onShow(item.id)}>
                Add
              </Button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
