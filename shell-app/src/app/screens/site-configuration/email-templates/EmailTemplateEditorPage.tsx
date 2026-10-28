import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bold,
  ChevronLeft,
  Eye,
  Italic,
  Link2,
  List,
  ListOrdered,
  MoreVertical,
  RemoveFormatting,
  Underline,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { HEADER_FOOTER_LAYOUTS, getHeaderFooterLayout, type HeaderFooterLayoutId } from '../../../config/bulkEmail';
import { linksForEvent, mergeFieldsForEvent, type MergeField } from '../../../config/emailTemplateFields';
import {
  EMAIL_PREVIEW_DISPLAY_NAME,
  deleteBlockedReason,
  findEventSelection,
  formatTemplateTimestamp,
  historyTypeLabel,
  type EmailTemplateRecord,
} from '../../../config/emailTemplates';
import { useEmailTemplates } from '../../../config/emailTemplateStore';
import { siteConfigPath } from '../../../config/siteConfiguration';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Switch } from '../../../components/ui/switch';
import uploadCloudIcon from '../../../../assets/site-configuration/icon-upload-cloud.svg';
import { EmailFooterLogoBand, EmailHeaderLogoBand } from '../../schedules/bulk-email/BulkEmailLogoBands';
import { es } from '../email-setup/emailSetupTokens';
import { sc } from '../siteConfigurationTokens';
import { EmailTemplatePreviewDialog } from './EmailTemplatePreviewDialog';
import { EmailTemplatesDeleteDialog } from './EmailTemplatesDeleteDialog';
import { et } from './emailTemplatesTokens';

const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
) {
  const selected = value.slice(start, end) || 'text';
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  const cursor = start + before.length + selected.length + after.length;
  return { next, cursor };
}

export function EmailTemplateEditorPage() {
  const { siteId = '' } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [templates, setTemplates] = useEmailTemplates();
  const mode = params.get('mode') === 'edit' ? 'edit' : 'create';
  const templateId = params.get('templateId');
  const groupId = params.get('group') ?? '';
  const categoryId = params.get('category') ?? '';
  const eventId = params.get('event') ?? '';
  const source = templates.find((item) => item.id === templateId) ?? null;
  const selection = findEventSelection(groupId, categoryId, eventId);
  const editing = mode === 'edit' && source?.kind === 'customized' ? source : null;
  const prefill = mode === 'create' ? source : null;

  const [name, setName] = useState(
    editing?.name ?? prefill?.name ?? (mode === 'create' ? selection?.event.label ?? '' : ''),
  );
  const [subject, setSubject] = useState(editing?.subject ?? prefill?.subject ?? '');
  const [body, setBody] = useState(editing?.body ?? prefill?.body ?? '');
  const [isDefault, setIsDefault] = useState(editing?.isDefault ?? false);
  const [layout, setLayout] = useState<HeaderFooterLayoutId>(
    editing?.headerFooterLayout ?? prefill?.headerFooterLayout ?? 'siteHeaderExxatFooter',
  );
  const [attachments, setAttachments] = useState(editing?.attachments ?? prefill?.attachments ?? []);
  const [mention, setMention] = useState<{
    field: 'subject' | 'body';
    query: string;
    start: number;
  } | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mentionMenuRef = useRef<HTMLDivElement>(null);

  const fields = mergeFieldsForEvent(eventId);
  const links = linksForEvent(eventId);
  const layoutDef = getHeaderFooterLayout(layout);
  const showDisplayName = !layoutDef.header;
  const siblings = templates.filter(
    (item) => item.groupId === groupId && item.categoryId === categoryId && item.eventId === eventId,
  );
  const deleteReason = editing ? deleteBlockedReason(editing, siblings) : null;

  const back = () => {
    const query = new URLSearchParams({ group: groupId, category: categoryId, event: eventId });
    navigate(`${siteConfigPath(siteId, 'notification/email-templates')}?${query.toString()}`);
  };

  const trackMention = (field: 'subject' | 'body', value: string, cursor: number) => {
    const match = value.slice(0, cursor).match(/@(\w*)$/);
    if (!match) {
      setMention(null);
      return;
    }
    setMention({ field, query: match[1].toLowerCase(), start: cursor - match[0].length });
  };

  const insertToken = (token: string) => {
    const snippet = `{{${token}}}`;
    if (!mention) return;
    const current = mention.field === 'subject' ? subject : body;
    const next = current.slice(0, mention.start) + snippet + current.slice(mention.start + 1 + mention.query.length);
    const cursor = mention.start + snippet.length;
    if (mention.field === 'subject') {
      setSubject(next);
      requestAnimationFrame(() => subjectRef.current?.setSelectionRange(cursor, cursor));
    } else {
      setBody(next);
      requestAnimationFrame(() => bodyRef.current?.setSelectionRange(cursor, cursor));
    }
    setMention(null);
  };

  const onMentionKeyDown = (event: React.KeyboardEvent, field: 'subject' | 'body') => {
    if (!mention || mention.field !== field) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMention(null);
      return;
    }
    if (filteredFields.length === 0) return;
    const index = Math.min(mentionIndex, filteredFields.length - 1);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setMentionIndex((index + 1) % filteredFields.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setMentionIndex((index - 1 + filteredFields.length) % filteredFields.length);
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      insertToken(filteredFields[index].token);
    }
  };

  const closeMentionOnBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget;
    if (next instanceof Node && mentionMenuRef.current?.contains(next)) return;
    setMention(null);
  };

  const applyWrap = (before: string, after: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const { next, cursor } = wrapSelection(body, el.selectionStart, el.selectionEnd, before, after);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  const addFiles = (files: FileList | File[] | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const next = [...attachments];
    for (const file of incoming) {
      if (next.length >= MAX_ATTACHMENTS) {
        toast.error('You can add up to 5 attachments.');
        break;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        toast.error(`${file.name} is larger than 10 MB.`);
        continue;
      }
      next.push({ id: newId('file'), name: file.name, size: file.size });
    }
    setAttachments(next);
  };

  const draft = useMemo<EmailTemplateRecord>(
    () => ({
      id: editing?.id ?? 'draft',
      groupId: groupId as EmailTemplateRecord['groupId'],
      categoryId,
      eventId,
      name: name || 'Untitled template',
      kind: 'customized',
      isDefault,
      subject,
      body,
      headerFooterLayout: layout,
      attachments,
      lastUpdatedBy: editing?.lastUpdatedBy ?? 'You',
      lastUpdatedAt: editing?.lastUpdatedAt ?? new Date().toISOString(),
      history: editing?.history ?? [],
      audience: editing?.audience ?? prefill?.audience,
    }),
    [attachments, body, categoryId, editing, eventId, groupId, isDefault, layout, name, prefill, subject],
  );

  const save = () => {
    if (!name.trim() || !subject.trim()) {
      toast.error('Add a template name and subject.');
      return;
    }
    const at = new Date().toISOString();
    if (editing) {
      setTemplates((prev) =>
        prev.map((item) => {
          const sameEvent =
            item.groupId === editing.groupId &&
            item.categoryId === editing.categoryId &&
            item.eventId === editing.eventId;
          if (item.id === editing.id) {
            return {
              ...item,
              name: name.trim(),
              subject: subject.trim(),
              body,
              isDefault,
              headerFooterLayout: layout,
              attachments,
              lastUpdatedBy: 'You',
              lastUpdatedAt: at,
              history: [
                ...item.history,
                { id: newId('hist'), type: 'edited', actor: 'You', at },
                ...(isDefault && !editing.isDefault
                  ? [{ id: newId('hist'), type: 'set_default' as const, actor: 'You', at }]
                  : []),
              ],
            };
          }
          if (sameEvent && isDefault) return { ...item, isDefault: false };
          return item;
        }),
      );
    } else {
      const created: EmailTemplateRecord = {
        ...draft,
        id: newId('tpl'),
        name: name.trim(),
        subject: subject.trim(),
        kind: 'customized',
        lastUpdatedBy: 'You',
        lastUpdatedAt: at,
        history: [
          prefill
            ? {
                id: newId('hist'),
                type: 'cloned' as const,
                actor: 'You',
                at,
                detail: prefill.name,
              }
            : { id: newId('hist'), type: 'created' as const, actor: 'You', at },
          ...(isDefault ? [{ id: newId('hist'), type: 'set_default' as const, actor: 'You', at }] : []),
        ],
      };
      setTemplates((prev) => {
        const withNew = [...prev, created];
        if (!isDefault) return withNew;
        return withNew.map((item) => {
          const sameEvent =
            item.groupId === created.groupId &&
            item.categoryId === created.categoryId &&
            item.eventId === created.eventId;
          if (!sameEvent) return item;
          return { ...item, isDefault: item.id === created.id };
        });
      });
    }
    toast.success('Template saved.');
    back();
  };

  const filteredFields = [...fields, ...links].filter((field) =>
    mention ? field.label.toLowerCase().includes(mention.query) || field.token.toLowerCase().includes(mention.query) : false,
  );

  useEffect(() => {
    setMentionIndex(0);
  }, [mention?.field, mention?.query]);

  useEffect(() => {
    if (!mention) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (mentionMenuRef.current?.contains(target)) return;
      const field = mention.field === 'subject' ? subjectRef.current : bodyRef.current;
      if (field?.contains(target)) return;
      setMention(null);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [mention]);

  return (
    <div className={`${sc.font} pb-6 pt-1`}>
      <div className="sticky top-0 z-40 -mt-1 mb-4 flex flex-wrap items-center justify-between gap-3 bg-[#f5f5f5] py-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Back"
            className="inline-flex size-8 items-center justify-center rounded-[6px] text-[#212121] hover:bg-[#f5f5f5]"
            onClick={back}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <h1 className="text-[18px] font-bold text-[#101828]">
            {editing ? 'Edit template' : 'Create template'}
          </h1>
          {editing ? <span className={`${et.badgeBase} ${et.badgeCustomized}`}>Customized</span> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="mr-1 flex items-center gap-2 text-[14px] font-medium text-[#212121]">
            Set as default
            <Switch
              checked={isDefault}
              onCheckedChange={setIsDefault}
              aria-label="Set as default"
              className="h-5 w-9 data-[state=checked]:bg-[#3f51b5] data-[state=unchecked]:bg-[#d1d5dc]"
            />
          </label>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] border border-[#d1d5dc] bg-white px-3 text-[14px] font-medium text-[#212121] hover:bg-[#fafafa]"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="size-4" aria-hidden />
            Preview
          </button>
          <button type="button" className={et.btnPrimary} onClick={save}>
            Save
          </button>
          {editing ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="More actions"
                  className="inline-flex size-9 items-center justify-center rounded-[6px] text-[#424242] hover:bg-[#f5f5f5]"
                >
                  <MoreVertical className="size-4" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem
                  className="text-[14px] text-[#212121]"
                  onSelect={(event) => {
                    if (deleteReason) {
                      event.preventDefault();
                      toast.error(deleteReason);
                      return;
                    }
                    setDeleteOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      <div className={`${sc.infoCard} space-y-6 p-6`}>
        <div className="max-w-[640px] space-y-4">
          <label className="block space-y-1.5">
            <span className={es.fieldLabel}>Template name</span>
            <div className={es.controlShell}>
              <input value={name} onChange={(e) => setName(e.target.value)} className={es.textInputInner} />
            </div>
          </label>
          <div>
            <p className={es.fieldLabel}>Category</p>
            <p className="text-[14px] text-[#4a5565]">
              {selection ? `${selection.category.label} · ${selection.event.label}` : '—'}
            </p>
          </div>
        </div>

        <div className={`rounded-[8px] border border-[#eceef1] ${mention ? 'relative z-20' : ''}`}>
          {layoutDef.header || showDisplayName ? (
            <div className="flex flex-col items-center gap-2 border-b border-[#eceef1] px-4 py-4">
              {layoutDef.header ? <EmailHeaderLogoBand logo={layoutDef.header} variant="preview" compact /> : null}
              {showDisplayName ? (
                <p className="text-[14px] font-semibold text-[#212121]">{EMAIL_PREVIEW_DISPLAY_NAME}</p>
              ) : null}
            </div>
          ) : null}
          <div className="space-y-4 px-4 py-4">
            <label className={`relative block w-full max-w-[640px] space-y-1.5 ${mention?.field === 'subject' ? 'z-10' : ''}`}>
              <span className={es.fieldLabel}>Subject</span>
              <div className={es.controlShell}>
                <input
                  ref={subjectRef}
                  value={subject}
                  aria-expanded={mention?.field === 'subject'}
                  aria-controls="merge-field-menu"
                  aria-autocomplete="list"
                  onChange={(e) => {
                    setSubject(e.target.value);
                    trackMention('subject', e.target.value, e.target.selectionStart ?? e.target.value.length);
                  }}
                  onClick={(e) => trackMention('subject', subject, e.currentTarget.selectionStart ?? subject.length)}
                  onKeyDown={(e) => onMentionKeyDown(e, 'subject')}
                  onBlur={closeMentionOnBlur}
                  className={es.textInputInner}
                />
              </div>
              {mention?.field === 'subject' ? (
                <MentionMenu
                  menuRef={mentionMenuRef}
                  fields={filteredFields}
                  activeIndex={mentionIndex}
                  onHover={setMentionIndex}
                  onPick={insertToken}
                />
              ) : null}
              <p className="text-[12px] text-[#757575]">Type @ in the subject to pick a merge field.</p>
            </label>
            <div className={`relative space-y-1.5 ${mention?.field === 'body' ? 'z-10' : ''}`}>
              <span className={es.fieldLabel}>Body</span>
              <div className={es.controlShell}>
              <div className="flex flex-wrap gap-1 rounded-t-[4px] border-b border-[#e5e7eb] bg-[#fafafa] px-2 py-1.5">
                <ToolbarButton label="Bold" onClick={() => applyWrap('<strong>', '</strong>')}>
                  <Bold className="size-4" />
                </ToolbarButton>
                <ToolbarButton label="Italic" onClick={() => applyWrap('<em>', '</em>')}>
                  <Italic className="size-4" />
                </ToolbarButton>
                <ToolbarButton label="Underline" onClick={() => applyWrap('<u>', '</u>')}>
                  <Underline className="size-4" />
                </ToolbarButton>
                <ToolbarButton label="Bulleted list" onClick={() => applyWrap('\n• ', '')}>
                  <List className="size-4" />
                </ToolbarButton>
                <ToolbarButton label="Numbered list" onClick={() => applyWrap('\n1. ', '')}>
                  <ListOrdered className="size-4" />
                </ToolbarButton>
                <ToolbarButton label="Link" onClick={() => applyWrap('<a href="https://">', '</a>')}>
                  <Link2 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                  label="Clear formatting"
                  onClick={() => setBody(body.replace(/<\/?(strong|em|u|a)[^>]*>/gi, ''))}
                >
                  <RemoveFormatting className="size-4" />
                </ToolbarButton>
              </div>
              <textarea
                ref={bodyRef}
                value={body}
                aria-expanded={mention?.field === 'body'}
                aria-controls="merge-field-menu"
                aria-autocomplete="list"
                onChange={(e) => {
                  setBody(e.target.value);
                  trackMention('body', e.target.value, e.target.selectionStart ?? e.target.value.length);
                }}
                onClick={(e) => trackMention('body', body, e.currentTarget.selectionStart ?? body.length)}
                onKeyDown={(e) => onMentionKeyDown(e, 'body')}
                onBlur={closeMentionOnBlur}
                className="min-h-[180px] w-full resize-y rounded-b-[4px] border-0 bg-transparent px-3 py-2 text-[14px] leading-6 text-[#111827] outline-none"
              />
              </div>
              {mention?.field === 'body' ? (
                <MentionMenu
                  menuRef={mentionMenuRef}
                  fields={filteredFields}
                  activeIndex={mentionIndex}
                  onHover={setMentionIndex}
                  onPick={insertToken}
                />
              ) : null}
              <p className="text-[12px] text-[#757575]">Type @ in the body to pick a merge field.</p>
            </div>
          </div>
          {layoutDef.exxatFooter ? <EmailFooterLogoBand show variant="preview" /> : null}
        </div>

        <section className="max-w-[640px] space-y-2">
          <h2 className="text-[14px] font-semibold text-[#111827]">Attachments</h2>
          <p className="text-[13px] text-[#616161]">Files are sent with this email template.</p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,image/*,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className={es.uploadZone}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
          >
            <span className={sc.uploadStack}>
              <img src={uploadCloudIcon} alt="" className="size-8" aria-hidden />
              <span className={es.uploadTitle}>Click to upload or drag &amp; drop</span>
              <span className={es.uploadHint}>PDF, DOC, or image · Up to 10 MB · Up to 5 files</span>
            </span>
          </button>
          {attachments.length > 0 ? (
            <ul className="space-y-1">
              {attachments.map((file) => (
                <li key={file.id} className="flex items-center justify-between text-[13px] text-[#212121]">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="text-[#3f51b5] hover:underline"
                    onClick={() => setAttachments((current) => current.filter((item) => item.id !== file.id))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="max-w-[640px] space-y-4">
          <fieldset className="space-y-2">
            <legend className="text-[14px] font-semibold text-[#111827]">Header and footer layouts</legend>
            {HEADER_FOOTER_LAYOUTS.map((option) => (
              <label key={option.id} className="flex items-center gap-2 text-[14px] text-[#212121]">
                <input
                  type="radio"
                  name="header-footer"
                  checked={layout === option.id}
                  onChange={() => setLayout(option.id)}
                  className="accent-[#3f51b5]"
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        </section>

        <section className="max-w-[720px] space-y-2">
          <h2 className="text-[14px] font-semibold text-[#111827]">Merge fields</h2>
          <p className="text-[13px] text-[#616161]">Type @ in a field to pick a merge field, or use the list below.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map((field) => (
              <FieldChip key={field.token} field={field} onInsert={() => insertAtBody(field.token)} />
            ))}
          </div>
        </section>

        <section className="max-w-[720px] space-y-2">
          <h2 className="text-[14px] font-semibold text-[#111827]">Links</h2>
          <p className="text-[13px] text-[#616161]">
            Type @ in the body to pick a deep link, or use the list below. Links become hyperlinks in preview.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {links.map((field) => (
              <FieldChip key={field.token} field={field} onInsert={() => insertAtBody(field.token)} />
            ))}
          </div>
        </section>

        {editing && editing.history.length > 0 ? (
          <section className="max-w-[640px] space-y-2">
            <h2 className="text-[14px] font-semibold text-[#111827]">Edit history</h2>
            <ul className="space-y-2 text-[13px] text-[#616161]">
              {[...editing.history].reverse().map((entry) => (
                <li key={entry.id}>
                  <span className="font-medium text-[#212121]">{historyTypeLabel(entry.type)}</span>
                  {entry.type === 'cloned' && entry.detail ? <> from &quot;{entry.detail}&quot;</> : null}
                  <span className="block">
                    {entry.actor} · {formatTemplateTimestamp(entry.at)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <EmailTemplatePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={draft}
        eventLabel={selection?.event.label ?? ''}
      />
      {editing ? (
        <EmailTemplatesDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          templateName={editing.name}
          onConfirm={() => {
            setTemplates((prev) => prev.filter((item) => item.id !== editing.id));
            setDeleteOpen(false);
            toast.success('Template deleted.');
            back();
          }}
        />
      ) : null}
    </div>
  );

  function insertAtBody(token: string) {
    const el = bodyRef.current;
    const cursor = el?.selectionStart ?? body.length;
    const snippet = `{{${token}}}`;
    const next = body.slice(0, cursor) + snippet + body.slice(cursor);
    setBody(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(cursor + snippet.length, cursor + snippet.length);
    });
  }
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center rounded-[4px] text-[#616161] hover:bg-white"
    >
      {children}
    </button>
  );
}

function FieldChip({ field, onInsert }: { field: MergeField; onInsert: () => void }) {
  return (
    <button
      type="button"
      onClick={onInsert}
      className="flex items-center justify-between rounded-[6px] border border-[#eceef1] bg-white px-3 py-2 text-left hover:bg-[#fafafa]"
    >
      <span className="text-[14px] text-[#212121]">{field.label}</span>
      <span className="text-[12px] text-[#757575]">{`{{${field.token}}}`}</span>
    </button>
  );
}

function MentionMenu({
  fields,
  activeIndex,
  onPick,
  onHover,
  menuRef,
}: {
  fields: MergeField[];
  activeIndex: number;
  onPick: (token: string) => void;
  onHover: (index: number) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <div
      ref={menuRef}
      id="merge-field-menu"
      role="listbox"
      aria-label="Merge fields"
      onMouseDown={(event) => event.preventDefault()}
      className="absolute left-0 top-full z-30 mt-1 w-[280px] overflow-hidden rounded-[6px] border border-[#e5e7eb] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
    >
      {fields.length === 0 ? (
        <p className="px-3 py-2 text-[13px] text-[#616161]">No matching fields</p>
      ) : (
        <ul className="max-h-60 overflow-y-auto py-1">
          {fields.map((field, index) => {
            const selected = index === Math.min(activeIndex, fields.length - 1);
            return (
              <li key={field.token} role="presentation">
                <button
                  ref={selected ? activeRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px] ${
                    selected ? 'bg-[#eef0fb] text-[#283593]' : 'text-[#212121] hover:bg-[#f5f7ff]'
                  }`}
                  onMouseEnter={() => onHover(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onPick(field.token);
                  }}
                >
                  <span>{field.label}</span>
                  <span className="text-[#757575]">{`{{${field.token}}}`}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
