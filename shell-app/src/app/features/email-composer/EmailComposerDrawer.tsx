import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Clock, Maximize, Minimize, Paperclip, Plus, Send, X } from 'lucide-react';
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
const selectedBadge = 'inline-flex items-center rounded-full bg-[#e8eaf6] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#283593]';

function AttachmentHints({ files }: { files?: { name: string }[] }) {
  const count = files?.length ?? 0;
  if (!count) return null;
  return (
    <small className="mt-0.5 block text-xs leading-4 text-[#5c6bc0]">
      {count} {count === 1 ? 'attachment' : 'attachments'}
    </small>
  );
}
const letterText = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
const attachmentNames = (files: { name: string }[]) => files.map((file) => file.name).sort().join('\0');

function PersonChips({
  people,
  onRemove,
}: {
  people: { id: string; name: string; email: string }[];
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!people.length) return null;
  const visible = 6;
  const shown = open ? people : people.slice(0, visible);
  const more = people.length - visible;
  return (
    <>
      {shown.map((person) => (
        <Badge key={person.id} variant="secondary" className="gap-0.5 py-0.5 pl-2 pr-0.5 text-[13px] font-normal">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-[180px] truncate">{person.name}</span>
            </TooltipTrigger>
            <TooltipContent>{person.email || 'No email address'}</TooltipContent>
          </Tooltip>
          <IconButton
            label={`Remove ${person.name}`}
            tooltipSide="top"
            className="size-4 rounded-sm text-muted-foreground hover:text-foreground"
            onClick={() => onRemove(person.id)}
          >
            <X className="size-3" />
          </IconButton>
        </Badge>
      ))}
      {more > 0 && (
        <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setOpen((value) => !value)}>
          {open ? 'Show less' : `+${more} more`}
        </Button>
      )}
    </>
  );
}

/**
 * The composer drawer. Everything it knows about the page comes from `ctx`: who can be
 * emailed, which placements they are on (merge fields, @Schedule table), who is sending.
 */
export function EmailComposerDrawer({ ctx, onClose }: Props) {
  const brand = ctx.sender.brand;
  const [emailTemplates, setEmailTemplates] = useEmailTemplates();
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
  const [discardOpen, setDiscardOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
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
  const tpl = role && tplBy[role] ? TPL[role].find((t) => t.id === tplBy[role]) : undefined;
  const attachments = role ? attBy[role] ?? [] : [];
  const attachmentsDirty = !!tpl && tpl.id !== 'blank' && attachmentNames(attachments) !== attachmentNames(tpl.attachments ?? []);
  const dirty =
    !!role &&
    !fp &&
    (tpl
      ? tpl.id === 'blank' || tpl.body !== body || tpl.subject !== subject || attachmentsDirty
      : letterText(subject) !== '' || letterText(body) !== '' || attachments.length > 0);

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
  const askRemove = (id: string) => {
    setPendingRemove(id);
    setTemplateOpen(false);
  };
  const confirmRemove = () => {
    const id = pendingRemove;
    setPendingRemove(null);
    if (!id || !role) return;
    setHiddenTemplates((current) => new Set(current).add(id));
    if (tplBy[role] !== id) return;
    setTplBy((m) => ({ ...m, [role]: '' }));
    setSubjectBy((s) => ({ ...s, [role]: '' }));
    setBodyBy((b) => ({ ...b, [role]: BLANK_BODY }));
    setHdr('none');
    setFtr('none');
    setOver({});
    setAttBy((m) => ({ ...m, [role]: (m[role] ?? []).filter((a) => !a.fromTemplate) }));
  };
  const showTemplate = (id: string) =>
    setHiddenTemplates((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
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
      { label: 'Template', value: tpl?.label || 'Please select a template' },
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

  const saveTemplate = () => {
    if (!role || !tpl || tpl.id === 'blank') {
      toast.success('Saved as a template');
      return;
    }
    const templateId = tplBy[role];
    const at = new Date().toISOString();
    const savedAttachments = attachments.map((file, index) => ({
      id: file.id.startsWith('att-') ? file.id : `att-${templateId}-${index}-${Date.now()}`,
      name: file.name,
      size: file.size,
    }));
    setEmailTemplates((prev) =>
      prev.map((item) =>
        item.id === templateId
          ? {
              ...item,
              subject,
              body,
              attachments: savedAttachments,
              kind: 'customized' as const,
              lastUpdatedBy: 'You',
              lastUpdatedAt: at,
              history: [...item.history, { id: `hist-${Date.now()}`, type: 'edited' as const, actor: 'You', at }],
            }
          : item,
      ),
    );
    toast.success('Template saved.');
  };

  return (
    <SheetContent
      className={cn(
        'gap-0 p-0 transition-[width,max-width] duration-300 [&>button.absolute]:hidden',
        expanded ? 'w-screen max-w-none sm:max-w-none' : 'w-[680px] sm:max-w-[680px]',
      )}
      onEscapeKeyDown={(e) => {
        if (typeahead.open || tagDetails.open || suggest.open || templateOpen) {
          e.preventDefault();
          return;
        }
        if (discardOpen) {
          e.preventDefault();
          setDiscardOpen(false);
          return;
        }
        if (pendingRemove) {
          e.preventDefault();
          setPendingRemove(null);
          return;
        }
        if (dlg) return;
        e.preventDefault();
        setDiscardOpen(true);
      }}
      onPointerDownOutside={(e) => {
        const el = e.target instanceof Element ? e.target : null;
        if (el?.closest('[role="menu"], [data-radix-popper-content-wrapper], [data-slot="dialog-overlay"], [data-slot="dialog-content"], [data-slot="alert-dialog-overlay"], [data-slot="alert-dialog-content"]')) return;
        e.preventDefault();
        if (dlg || discardOpen || pendingRemove) return;
        setDiscardOpen(true);
      }}
    >
      <DrawerHeader
        onClose={() => setDiscardOpen(true)}
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
            onQuery={setTemplateQuery}
            onEvent={setTemplateEvent}
            onPick={applyTemplate}
            onHide={askRemove}
            onShow={showTemplate}
          />
        )}

        <div className="relative flex min-w-0 flex-1 flex-col">
        <div className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto', stage === 'compose' && view === 'edit' && 'pb-14')}>
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
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <PersonChips
                people={eligible.map((person) => ({ id: person.id, name: person.name, email: person.email }))}
                onRemove={(id) => setMany([id], false)}
              />
              <ChipInput
                list={extras}
                onChange={setExtras}
                label="Add To"
                placeholder="Add name or email"
                suggestions={people_dir}
                className="min-w-[12rem] flex-1"
              />
            </div>
          </div>
          {showCc && (
            <Row label="Cc">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <IconButton
                  label="Add recipients"
                  tooltipSide="top"
                  className="size-7"
                  disabled={!copyRoles.length}
                  onClick={() => openRecipients('cc')}
                >
                  <Plus className="size-4" />
                </IconButton>
                <PersonChips
                  people={ccEligible.map((person) => ({ id: person.id, name: person.name, email: person.email }))}
                  onRemove={(id) => setManyCc([id], false)}
                />
                <ChipInput
                  list={cc}
                  onChange={setCc}
                  label="Add Cc"
                  placeholder="Add name or email"
                  suggestions={people_dir}
                  className="min-w-[12rem] flex-1"
                />
                <button
                  type="button"
                  className="ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded text-[#616161] hover:bg-[#f5f5f5] hover:text-[#424242]"
                  aria-label="Close Cc"
                  onClick={closeCc}
                >
                  <X className="size-4" />
                </button>
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
                      <span className={cn('truncate', tpl ? 'font-medium' : 'text-[#9e9e9e]')} title={tpl?.label}>
                        {fp && over[fp.id] ? 'Edited for one person' : tpl?.label || 'Please select a template'}
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
                  {(role ? TPL[role] : [])
                    .filter((item) => item.id !== 'blank' && !hiddenTemplates.has(item.id))
                    .filter((item) => {
                      const q = templateQuery.trim().toLowerCase();
                      return !q || `${item.label} ${item.subject}`.toLowerCase().includes(q);
                    })
                    .map((t) => {
                      const selected = !!role && tplBy[role] === t.id;
                      return (
                      <div key={t.id} className={cn('flex items-start border-l-2', selected ? 'border-l-[#3f51b5] bg-[#eef0fb]' : 'border-l-transparent')}>
                        <CheckItem selected={selected} showCheck={false} onSelect={() => applyTemplate(t.id)} className="min-w-0 flex-1 items-start bg-transparent">
                          <span className="min-w-0 break-words">
                            <span className="inline-flex flex-wrap items-center gap-2">
                              {t.label}
                              {selected && <span className={selectedBadge}>Selected</span>}
                              {t.isDefault && <span className={defaultBadge}>Default</span>}
                            </span>
                            {t.subject && <small className="line-clamp-1 block text-xs text-muted-foreground">{t.subject}</small>}
                            <AttachmentHints files={t.attachments} />
                          </span>
                        </CheckItem>
                        <IconButton
                          label={`Remove ${t.label} from list`}
                          tooltipSide="left"
                          className="mt-1 size-6 shrink-0"
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={() => askRemove(t.id)}
                        >
                          <X className="size-3.5" />
                        </IconButton>
                      </div>
                      );
                    })}
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
        {stage === 'compose' && view === 'edit' && role && (
          <div className="pointer-events-none absolute right-4 bottom-3 z-20">
            <div className="pointer-events-auto rounded-md bg-white shadow-md">
              <LeoWrite
                role={role}
                brandName={brand.name}
                count={n}
                disabled={locked}
                contentSide="top"
                contentAlign="end"
                onInsert={(d) => {
                  if (fp) setOver((o) => ({ ...o, [fp.id]: { subject: resolveSubjectFor(fp, d.subject), body: resolveFor(fp, d.body) } }));
                  else {
                    setSubjectBy((m) => ({ ...m, [role]: d.subject }));
                    setBodyBy((m) => ({ ...m, [role]: d.body }));
                  }
                  toast('Draft from Leo added. Review it before you send.');
                }}
              />
            </div>
          </div>
        )}
        </div>
      </div>

      <SheetFooter className="mt-0 flex-row items-center gap-2 border-t p-3">
        {stage === 'review' ? (
          <>
            <Button disabled={reviewVisit === 'start' && !n} onClick={() => (reviewVisit === 'start' ? setStage('compose') : backToLetter())}>
              {reviewVisit === 'start' ? 'Compose' : 'Done'}
            </Button>
            <Button variant="outline" onClick={() => setDiscardOpen(true)}>
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
          <Button variant="ghost" className="ml-auto" onClick={saveTemplate}>
            Save as template
          </Button>
        )}
        </>
        )}
      </SheetFooter>

      <ConfirmPop
        open={discardOpen}
        titleId="discard-email-title"
        title="This action will discard all the changes you have made so far. Are you sure?"
        description="Closing the email discards the draft. Cancel keeps it open."
        confirm="Discard"
        onCancel={() => setDiscardOpen(false)}
        onConfirm={() => { setDiscardOpen(false); onClose(); }}
      />
      <ConfirmPop
        open={!!pendingRemove}
        titleId="remove-template-title"
        title="Are you sure to remove this template from list?"
        description="Removing the selected template clears the letter. Removing another template leaves the letter as it is."
        confirm="Remove"
        onCancel={() => setPendingRemove(null)}
        onConfirm={confirmRemove}
      />

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

function ConfirmPop({
  open,
  titleId,
  title,
  description,
  confirm,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  titleId: string;
  title: string;
  description: string;
  confirm: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close dialog" onClick={onCancel} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative z-10 w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
        <h2 id={titleId} className="text-base font-semibold leading-6 text-[#212121]">{title}</h2>
        <p className="sr-only">{description}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>{confirm}</Button>
        </div>
      </div>
    </div>
  );
}

function TemplateLibrary({
  templates,
  selectedId,
  hidden,
  query,
  event,
  onQuery,
  onEvent,
  onPick,
  onHide,
  onShow,
}: {
  templates: ComposerTemplate[];
  selectedId: string;
  hidden: Set<string>;
  query: string;
  event: string;
  onQuery: (value: string) => void;
  onEvent: (value: string) => void;
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
      <h2 className="text-sm font-semibold">Templates</h2>
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
      {shown.map((item) => (
        <div
          key={item.id}
          className={cn(
            'relative rounded-lg border border-l-4 p-3 pr-8',
            selectedId === item.id ? 'border-[#3f51b5] border-l-[#3f51b5] bg-[#eef0fb]' : 'border-[#e5e7eb] border-l-transparent hover:bg-muted',
          )}
        >
          <button type="button" onClick={() => onPick(item.id)} className="grid w-full gap-0.5 text-left">
            <span className="inline-flex flex-wrap items-center gap-2 text-sm font-semibold text-[#212121]">
              {item.label}
              {selectedId === item.id && <span className={selectedBadge}>Selected</span>}
              {item.isDefault && <span className={defaultBadge}>Default</span>}
            </span>
            <span className="line-clamp-2 text-xs text-[#616161]">{item.subject || 'No subject'}</span>
            <AttachmentHints files={item.attachments} />
          </button>
          <IconButton
            label={`Remove ${item.label} from list`}
            tooltipSide="left"
            className="absolute top-1.5 right-1.5 size-6"
            onClick={() => onHide(item.id)}
          >
            <X className="size-3.5" />
          </IconButton>
        </div>
      ))}
      {concealed.length > 0 && (
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
