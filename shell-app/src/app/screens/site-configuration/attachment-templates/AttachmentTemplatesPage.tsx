import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bold,
  ChevronDown,
  Copy,
  Eye,
  FileText,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pencil,
  RemoveFormatting,
  Search,
  Trash2,
  Underline,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/sheet';
import {
  ATTACHMENT_AUDIENCES,
  ATTACHMENT_FIELD_COUNT,
  ATTACHMENT_FIELD_GROUPS,
  ATTACHMENT_SAMPLES,
  audienceLabel,
  tokensInBody,
  unknownTokens,
  type AttachmentAudienceId,
  type AttachmentTemplate,
} from '../../../config/attachmentTemplates';
import { useAttachmentTemplates } from '../../../config/attachmentTemplateStore';
import { et } from '../email-templates/emailTemplatesTokens';
import { es } from '../email-setup/emailSetupTokens';
import { sc } from '../siteConfigurationTokens';

function newId() {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function fieldsMatching(query: string) {
  const normalized = query.trim().toLowerCase();
  return ATTACHMENT_FIELD_GROUPS.flatMap((group) =>
    group.fields.filter(
      (field) =>
        !normalized ||
        field.label.toLowerCase().includes(normalized) ||
        field.token.toLowerCase().includes(normalized),
    ),
  );
}

function wrapSelection(value: string, start: number, end: number, before: string, after: string) {
  const selected = value.slice(start, end) || 'text';
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  return { next, cursor: start + before.length + selected.length + after.length };
}

function highlightedBody(body: string) {
  return body.split(/(\{\{\w+\}\})/g).map((part, index) => {
    const match = part.match(/^\{\{(\w+)\}\}$/);
    if (!match) return <span key={index}>{part}</span>;
    const value = ATTACHMENT_SAMPLES[match[1]];
    if (!value) return <span key={index}>{part}</span>;
    return (
      <span key={index} className={et.tokenHighlight}>
        {value}
      </span>
    );
  });
}

export function AttachmentTemplatesPage() {
  const [templates, setTemplates] = useAttachmentTemplates();
  const [sheet, setSheet] = useState<{ mode: 'create' | 'edit'; template: AttachmentTemplate | null } | null>(
    null,
  );
  const [preview, setPreview] = useState<AttachmentTemplate | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AttachmentTemplate | null>(null);
  const [cloneTarget, setCloneTarget] = useState<AttachmentTemplate | null>(null);

  return (
    <div className={`${sc.font} pb-6 pt-1`}>
      <div className={`${sc.infoCard} p-6`}>
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[640px] space-y-1">
            <h1 className={sc.cardTitle}>Attachment Templates</h1>
            <p className={es.pageIntro}>
              System-generated documents, such as thank-you letters, that senders can attach to a
              bulk email instead of uploading a file. Merge fields are checked when you save. A
              template with an unrecognized token cannot be saved.
            </p>
          </div>
          <button
            type="button"
            className={et.btnPrimary}
            onClick={() => setSheet({ mode: 'create', template: null })}
          >
            + Create Attachment Template
          </button>
        </header>
        {templates.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-[#757575]">
            No attachment templates yet. Create one to get started.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-[8px] border border-[#eceef1]">
            {templates.map((template) => {
              const count = tokensInBody(template.body).length;
              const valid = unknownTokens(template.body).length === 0;
              return (
                <li key={template.id} className="border-b border-[#eceef1] last:border-b-0">
                  <div className="flex items-center hover:bg-[#f5f5f5]">
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left"
                      onClick={() => setPreview(template)}
                    >
                      <FileText className="size-4 shrink-0 text-[#616161]" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold text-[#111827]">
                          {template.name}
                        </span>
                        <span className="block text-[12px] text-[#757575]">
                          {count} merge {count === 1 ? 'field' : 'fields'} · Created {template.createdAt}
                        </span>
                      </span>
                      <span className={`${et.badgeBase} ${et.badgeAudience}`}>
                        {audienceLabel(template.audienceId)}
                      </span>
                      <span className={`${et.badgeBase} ${valid ? et.badgeDefault : et.badgeStandard}`}>
                        {valid ? 'Valid' : 'Needs review'}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 pr-3">
                      <IconButton label="Preview" onClick={() => setPreview(template)}>
                        <Eye className="size-4" strokeWidth={1.75} />
                      </IconButton>
                      <IconButton label="Clone" onClick={() => setCloneTarget(template)}>
                        <Copy className="size-4" strokeWidth={1.75} />
                      </IconButton>
                      <IconButton label="Edit" onClick={() => setSheet({ mode: 'edit', template })}>
                        <Pencil className="size-4" strokeWidth={1.75} />
                      </IconButton>
                      <IconButton label="Delete" onClick={() => setPendingDelete(template)}>
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </IconButton>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AttachmentSheet
        open={sheet !== null}
        mode={sheet?.mode ?? 'create'}
        template={sheet?.template ?? null}
        onOpenChange={(open) => {
          if (!open) setSheet(null);
        }}
        onSave={(record) => {
          setTemplates((current) => {
            const exists = current.some((item) => item.id === record.id);
            if (!exists) return [record, ...current];
            return current.map((item) => (item.id === record.id ? record : item));
          });
          toast.success(sheet?.mode === 'edit' ? 'Template saved.' : 'Attachment template created.');
          setSheet(null);
        }}
      />

      <Dialog open={preview !== null} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="gap-0 rounded-lg border-[#eceef1] p-0 sm:max-w-[560px]">
          <div className={et.dialogHeader}>
            <DialogTitle className={et.dialogTitle}>{preview?.name}</DialogTitle>
            <DialogDescription className={et.dialogDesc}>
              Sample values are filled in. Highlighted text comes from merge fields.
            </DialogDescription>
          </div>
          <div className="whitespace-pre-wrap px-6 py-4 text-[14px] leading-6 text-[#212121]">
            {preview ? highlightedBody(preview.body) : null}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent className="rounded-lg border-[#eceef1] sm:max-w-[440px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[16px] font-semibold text-[#212121]">
              Delete this template?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-[#616161]">
              &quot;{pendingDelete?.name}&quot; will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9 rounded-[6px] border-[#3f51b5] text-[#3f51b5]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-9 rounded-[6px] bg-[#c62828] text-white hover:bg-[#b71c1c]"
              onClick={() => {
                if (!pendingDelete) return;
                setTemplates((current) => current.filter((item) => item.id !== pendingDelete.id));
                setPendingDelete(null);
                toast.success('Template deleted.');
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CloneNameDialog
        open={cloneTarget !== null}
        sourceName={cloneTarget?.name ?? ''}
        onOpenChange={(open) => {
          if (!open) setCloneTarget(null);
        }}
        onConfirm={(name) => {
          if (!cloneTarget) return;
          const copy: AttachmentTemplate = {
            ...cloneTarget,
            id: `att-${Date.now()}`,
            name,
            createdAt: new Date().toISOString().slice(0, 10),
          };
          setTemplates((current) => [copy, ...current]);
          setCloneTarget(null);
          toast.success('Template cloned.');
        }}
      />
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className={et.iconBtn} aria-label={label} onClick={onClick}>
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function AttachmentSheet({
  open,
  mode,
  template,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  template: AttachmentTemplate | null;
  onOpenChange: (open: boolean) => void;
  onSave: (record: AttachmentTemplate) => void;
}) {
  const [name, setName] = useState(template?.name ?? '');
  const [audienceId, setAudienceId] = useState<AttachmentAudienceId>(template?.audienceId ?? 'student');
  const [body, setBody] = useState(template?.body ?? '');
  const [error, setError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [sheetHost, setSheetHost] = useState<HTMLDivElement | null>(null);
  const [mention, setMention] = useState<{ query: string; start: number } | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const invalid = useMemo(() => unknownTokens(body), [body]);
  const audienceName = audienceLabel(audienceId);
  const mentionFields = useMemo(() => fieldsMatching(mention?.query ?? ''), [mention?.query]);

  useEffect(() => {
    if (!open) return;
    setName(template?.name ?? '');
    setAudienceId(template?.audienceId ?? 'student');
    setBody(template?.body ?? '');
    setError(null);
    setMention(null);
  }, [open, template, mode]);

  useEffect(() => {
    setMentionIndex(0);
  }, [mention?.query]);

  const reset = (next: AttachmentTemplate | null) => {
    setName(next?.name ?? '');
    setAudienceId(next?.audienceId ?? 'student');
    setBody(next?.body ?? '');
    setError(null);
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

  const trackMention = (value: string, cursor: number) => {
    const match = value.slice(0, cursor).match(/@(\w*)$/);
    if (!match) {
      setMention(null);
      return;
    }
    setMention({ query: match[1].toLowerCase(), start: cursor - match[0].length });
  };

  const insertMention = (token: string) => {
    if (!mention) return;
    const snippet = `{{${token}}}`;
    const next =
      body.slice(0, mention.start) + snippet + body.slice(mention.start + 1 + mention.query.length);
    const cursor = mention.start + snippet.length;
    setBody(next);
    setMention(null);
    requestAnimationFrame(() => {
      bodyRef.current?.focus();
      bodyRef.current?.setSelectionRange(cursor, cursor);
    });
  };

  const onBodyKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!mention) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMention(null);
      return;
    }
    if (mentionFields.length === 0) return;
    const index = Math.min(mentionIndex, mentionFields.length - 1);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setMentionIndex((index + 1) % mentionFields.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setMentionIndex((index - 1 + mentionFields.length) % mentionFields.length);
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      insertMention(mentionFields[index].token);
    }
  };
  const insertToken = (token: string) => {
    const el = bodyRef.current;
    const cursor = el?.selectionStart ?? body.length;
    const snippet = `{{${token}}}`;
    const next = body.slice(0, cursor) + snippet + body.slice(cursor);
    setBody(next);
    setMention(null);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(cursor + snippet.length, cursor + snippet.length);
    });
  };

  const save = () => {
    if (!name.trim()) {
      setError('Add a template name.');
      return;
    }
    if (invalid.length > 0) {
      setError('Remove unrecognized merge fields before saving.');
      return;
    }
    onSave({
      id: template?.id ?? newId(),
      name: name.trim(),
      audienceId,
      body,
      createdAt: template?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) reset(mode === 'edit' ? template : null);
        onOpenChange(next);
      }}
    >
      <SheetContent
        className="w-full gap-0 bg-white p-0 sm:max-w-[640px] [&>button]:hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div ref={setSheetHost} className="flex h-full min-h-0 flex-col bg-[#f5f5f5]">
          <SheetHeader className="flex-row items-center gap-3 border-b border-[#eceef1] bg-white px-4 py-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetClose
                  aria-label="Close"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f3f4f6] text-[#424242] hover:bg-[#e5e7eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
                >
                  <X className="size-4" aria-hidden />
                </SheetClose>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
            <SheetTitle className="min-w-0 flex-1 text-left text-[16px] font-semibold text-[#212121]">
              {mode === 'edit' ? 'Edit Attachment Template' : 'Create Attachment Template'}
            </SheetTitle>
            <button type="button" className={et.btnPrimary} onClick={save}>
              {mode === 'edit' ? 'Save Changes' : 'Create Template'}
            </button>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-4 rounded-[8px] border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_1.5px_rgba(0,0,0,0.08)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className={es.fieldLabel}>Audience Type</span>
                  <div className={`${es.controlShell} relative`}>
                    <select
                      value={audienceId}
                      onChange={(event) => setAudienceId(event.target.value as AttachmentAudienceId)}
                      className={`${es.textInputInner} appearance-none pr-10 focus-visible:outline-none`}
                    >
                      {ATTACHMENT_AUDIENCES.map((audience) => (
                        <option key={audience.id} value={audience.id}>
                          {audience.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#616161]"
                      aria-hidden
                    />
                  </div>
                  <span className="block text-[12px] text-[#757575]">
                    Labels who this document is written for. The same merge fields work for every audience.
                  </span>
                </label>
                <label className="space-y-1.5">
                  <span className={es.fieldLabel}>Template Name</span>
                  <div className={es.controlShell}>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Clinical Rotation Thank-You Letter"
                      className={es.textInputInner}
                    />
                  </div>
                </label>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span id="attachment-body-label" className={es.fieldLabel}>
                    Document Content
                  </span>
                  <InsertFieldMenu
                    title={`${audienceName} fields`}
                    container={sheetHost}
                    onOpen={() => setMention(null)}
                    onPick={insertToken}
                  />
                </div>
                <Popover open={mention !== null} onOpenChange={(next) => !next && setMention(null)}>
                  <PopoverAnchor asChild>
                    <div className={es.controlShell}>
                      <div className="flex flex-wrap gap-1 border-b border-[#e5e7eb] bg-[#fafafa] px-2 py-1.5">
                        <ToolButton label="Bold" onClick={() => applyWrap('<strong>', '</strong>')}>
                          <Bold className="size-4" />
                        </ToolButton>
                        <ToolButton label="Italic" onClick={() => applyWrap('<em>', '</em>')}>
                          <Italic className="size-4" />
                        </ToolButton>
                        <ToolButton label="Underline" onClick={() => applyWrap('<u>', '</u>')}>
                          <Underline className="size-4" />
                        </ToolButton>
                        <ToolButton label="Bulleted list" onClick={() => applyWrap('\n• ', '')}>
                          <List className="size-4" />
                        </ToolButton>
                        <ToolButton label="Numbered list" onClick={() => applyWrap('\n1. ', '')}>
                          <ListOrdered className="size-4" />
                        </ToolButton>
                        <ToolButton label="Link" onClick={() => applyWrap('<a href="https://">', '</a>')}>
                          <Link2 className="size-4" />
                        </ToolButton>
                        <ToolButton
                          label="Clear formatting"
                          onClick={() => setBody(body.replace(/<\/?(strong|em|u|a)[^>]*>/gi, ''))}
                        >
                          <RemoveFormatting className="size-4" />
                        </ToolButton>
                      </div>
                      <textarea
                        ref={bodyRef}
                        aria-labelledby="attachment-body-label"
                        aria-describedby={
                          [
                            'attachment-body-hint',
                            error ? 'attachment-body-error' : '',
                            invalid.length > 0 ? 'attachment-body-invalid' : '',
                          ]
                            .filter(Boolean)
                            .join(' ') || undefined
                        }
                        aria-invalid={error || invalid.length > 0 ? true : undefined}
                        value={body}
                        onChange={(event) => {
                          setBody(event.target.value);
                          trackMention(event.target.value, event.target.selectionStart);
                        }}
                        onClick={(event) =>
                          trackMention(event.currentTarget.value, event.currentTarget.selectionStart)
                        }
                        onKeyDown={onBodyKeyDown}
                        onBlur={(event) => {
                          const next = event.relatedTarget;
                          if (next instanceof Element && next.closest('[data-field-palette]')) return;
                          setMention(null);
                        }}
                        placeholder="Compose your document..."
                        className="min-h-[220px] w-full resize-y border-0 bg-transparent px-3 py-2 text-[14px] leading-6 outline-none"
                      />
                    </div>
                  </PopoverAnchor>
                  <PopoverContent
                    align="start"
                    side="top"
                    sideOffset={8}
                    container={sheetHost}
                    className="w-[380px] p-0"
                    onOpenAutoFocus={(event) => event.preventDefault()}
                    onCloseAutoFocus={(event) => event.preventDefault()}
                    onInteractOutside={(event) => {
                      const target = event.target;
                      if (target instanceof Node && bodyRef.current?.contains(target)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    {mention ? (
                      <FieldPalette
                        title={`${audienceName} fields`}
                        query={mention.query}
                        readOnly
                        activeToken={mentionFields[Math.min(mentionIndex, Math.max(mentionFields.length - 1, 0))]?.token}
                        onHoverToken={(token) => {
                          const index = mentionFields.findIndex((field) => field.token === token);
                          if (index >= 0) setMentionIndex(index);
                        }}
                        onPick={insertMention}
                      />
                    ) : null}
                  </PopoverContent>
                </Popover>
                <p id="attachment-body-hint" className="text-[12px] text-[#757575]">
                  Type @ in the body to pick a merge field.
                </p>
                {error ? (
                  <p id="attachment-body-error" role="alert" className="text-[12px] text-[#c62828]">
                    {error}
                  </p>
                ) : null}
                {invalid.length > 0 ? (
                  <p id="attachment-body-invalid" role="alert" className="text-[12px] text-[#c62828]">
                    Unrecognized merge field: {invalid.map((token) => `{{${token}}}`).join(', ')}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="inline-flex size-8 items-center justify-center rounded-[4px] text-[#616161] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function InsertFieldMenu({
  title,
  container,
  onOpen,
  onPick,
}: {
  title: string;
  container: HTMLElement | null;
  onOpen: () => void;
  onPick: (token: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setQuery('');
          onOpen();
        }
      }}
    >
      <PopoverTrigger asChild>
        <button type="button" className={et.dialogBtnSecondary + ' h-8 px-3 text-[13px]'}>
          {'{{ }}'} Insert field
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        container={container}
        className="w-[380px] p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <FieldPalette title={title} query={query} onQueryChange={setQuery} searchRef={searchRef} onPick={(token) => {
          onPick(token);
          setOpen(false);
        }} />
      </PopoverContent>
    </Popover>
  );
}

function FieldPalette({
  title,
  query,
  onQueryChange,
  readOnly = false,
  activeToken,
  onHoverToken,
  onPick,
  searchRef,
}: {
  title: string;
  query: string;
  onQueryChange?: (value: string) => void;
  readOnly?: boolean;
  activeToken?: string;
  onHoverToken?: (token: string) => void;
  onPick: (token: string) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);
  const normalized = query.trim().toLowerCase();
  const groups = ATTACHMENT_FIELD_GROUPS.map((group) => ({
    ...group,
    fields: group.fields.filter(
      (field) =>
        !normalized ||
        field.label.toLowerCase().includes(normalized) ||
        field.token.toLowerCase().includes(normalized),
    ),
  })).filter((group) => group.fields.length > 0);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeToken]);

  return (
    <div
      data-field-palette
      onMouseDown={(event) => {
        if (!readOnly && event.target instanceof HTMLInputElement) return;
        event.preventDefault();
      }}
    >
      <div className="px-3 pb-2 pt-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#757575]">
          {title}
        </p>
        <div className="flex items-center rounded-[8px] border border-[#d1d5dc] bg-white focus-within:border-[#3f51b5] focus-within:ring-2 focus-within:ring-[#3f51b5]">
          <Search className="ml-3 size-4 shrink-0 text-[#9e9e9e]" aria-hidden />
          <input
            ref={searchRef}
            type="text"
            value={query}
            readOnly={readOnly}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder={`Search ${ATTACHMENT_FIELD_COUNT} fields`}
            aria-label="Search merge fields"
            className="h-9 w-full border-0 bg-transparent px-2 text-[14px] outline-none placeholder:text-[#9e9e9e] read-only:cursor-default"
          />
        </div>
      </div>
      <div data-field-scroll className="max-h-[320px] overflow-y-auto overscroll-contain pb-2">
        {groups.length === 0 ? (
          <p className="px-3 py-4 text-[13px] text-[#757575]">No matching fields.</p>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#757575]">
                {group.label}
              </p>
              {group.fields.map((field) => {
                const selected = field.token === activeToken;
                return (
                  <button
                    key={field.token}
                    ref={selected ? activeRef : undefined}
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-[13px] ${
                      selected ? 'bg-[#eef0fb] text-[#283593]' : 'text-[#212121] hover:bg-[#f5f6fc]'
                    }`}
                    onMouseEnter={() => onHoverToken?.(field.token)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      onPick(field.token);
                    }}
                  >
                    <span>{field.label}</span>
                    <span className="shrink-0 font-mono text-[11px] text-[#3f51b5]">{`{{${field.token}}}`}</span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CloneNameDialog({
  open,
  sourceName,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  sourceName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState(`${sourceName} copy`);

  useEffect(() => {
    if (open) setName(`${sourceName} copy`);
  }, [open, sourceName]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={et.dialogContent}>
        <div className={et.dialogHeader}>
          <DialogTitle className={et.dialogTitle}>Clone template</DialogTitle>
          <DialogDescription className={et.dialogDesc}>
            Name the copy. Nothing is created until you confirm.
          </DialogDescription>
        </div>
        <div className={et.dialogBody}>
          <label htmlFor="clone-attachment-name" className="mb-1.5 block text-[14px] font-semibold text-[#111827]">
            Template name
          </label>
          <input
            id="clone-attachment-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={et.textInput}
          />
        </div>
        <div className={et.dialogFooter}>
          <button type="button" className={et.dialogBtnSecondary} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            type="button"
            className={et.dialogBtnPrimary}
            disabled={!name.trim()}
            onClick={() => onConfirm(name.trim())}
          >
            Clone
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
