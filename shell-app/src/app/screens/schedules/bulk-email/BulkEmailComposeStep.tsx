import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Paperclip,
  RemoveFormatting,
  Sparkles,
  Underline,
  X,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import {
  BULK_EMAIL_TEMPLATES,
  HEADER_FOOTER_LAYOUTS,
  MERGE_FIELD_GROUPS,
  getHeaderFooterLayout,
  type BulkEmailSendMode,
  type BulkEmailTemplate,
  type GroupedLetter,
  type GroupedLetterField,
  type HeaderFooterLayoutId,
} from '../../../config/bulkEmail';
import { EmailFooterLogoBand, EmailHeaderLogoBand } from './BulkEmailLogoBands';
import { bulkEmailDrawer as d } from './bulkEmailDrawer';

export type ComposeMode = 'template' | 'scratch';

export type Attachment = { id: string; name: string };

type Props = {
  mode: ComposeMode;
  onModeChange: (mode: ComposeMode) => void;
  templateId: string | null;
  onTemplateChange: (templateId: string) => void;
  subject: string;
  onSubjectChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  attachments: Attachment[];
  onAddAttachment: (attachment: Attachment) => void;
  onRemoveAttachment: (id: string) => void;
  headerFooterLayout: HeaderFooterLayoutId;
  onHeaderFooterLayoutChange: (id: HeaderFooterLayoutId) => void;
  sendMode: BulkEmailSendMode;
  /** Grouped letter for the selected persona, when one email per person applies — narrows the merge-field list. */
  letter: GroupedLetter | null;
};

const TEMPLATE_CATEGORIES: BulkEmailTemplate['category'][] = ['Schedules', 'Onboarding', 'General'];

type MentionField = 'subject' | 'body';
type Mention = { field: MentionField; query: string; start: number };

function flattenFieldGroups(
  groups: { label: string; fields: GroupedLetterField[] }[],
): GroupedLetterField[] {
  return groups.flatMap((group) => group.fields);
}

export function BulkEmailComposeStep({
  mode,
  onModeChange,
  templateId,
  onTemplateChange,
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  headerFooterLayout,
  onHeaderFooterLayoutChange,
  sendMode,
  letter,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [mention, setMention] = useState<Mention | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);

  const templates = letter
    ? [letter.template, ...BULK_EMAIL_TEMPLATES.filter((item) => item.id !== letter.template.id)]
    : BULK_EMAIL_TEMPLATES;
  const selectedTemplate = templates.find((t) => t.id === templateId) ?? null;
  const usingLetter = letter != null && templateId === letter.template.id;
  const layout = getHeaderFooterLayout(headerFooterLayout);

  /** Context-aware fields: the chosen letter's set, or the full picklist otherwise. */
  const fieldGroups = letter ? letter.fields : MERGE_FIELD_GROUPS;
  const flatFields = flattenFieldGroups(fieldGroups);

  const handlePickTemplate = (template: BulkEmailTemplate) => {
    onTemplateChange(template.id);
    onSubjectChange(template.subject);
    onBodyChange(template.body);
    setTemplatePickerOpen(false);
  };

  const insertTokenAtCursor = (token: string) => {
    const el = bodyRef.current;
    const insertion = `{{${token}}}`;
    if (!el) {
      onBodyChange(`${body}${insertion}`);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = `${body.slice(0, start)}${insertion}${body.slice(end)}`;
    onBodyChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + insertion.length;
    });
  };

  const trackMention = (field: MentionField, value: string, cursor: number) => {
    const match = value.slice(0, cursor).match(/@(\w*)$/);
    if (!match) {
      setMention(null);
      return;
    }
    setMention({ field, query: match[1].toLowerCase(), start: cursor - match[0].length });
  };

  const filteredFields = mention
    ? flatFields.filter(
        (field) =>
          field.label.toLowerCase().includes(mention.query) ||
          field.token.toLowerCase().includes(mention.query),
      )
    : [];

  useEffect(() => {
    setMentionIndex(0);
  }, [mention?.field, mention?.query]);

  const insertMention = (token: string) => {
    if (!mention) return;
    const snippet = `{{${token}}}`;
    const current = mention.field === 'subject' ? subject : body;
    const next =
      current.slice(0, mention.start) + snippet + current.slice(mention.start + 1 + mention.query.length);
    const cursor = mention.start + snippet.length;
    if (mention.field === 'subject') {
      onSubjectChange(next);
      requestAnimationFrame(() => subjectRef.current?.setSelectionRange(cursor, cursor));
    } else {
      onBodyChange(next);
      requestAnimationFrame(() => bodyRef.current?.setSelectionRange(cursor, cursor));
    }
    setMention(null);
  };

  const onMentionKeyDown = (event: React.KeyboardEvent, field: MentionField) => {
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
      insertMention(filteredFields[index].token);
    }
  };

  const closeMentionOnBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget;
    if (next instanceof Element && next.closest('[data-mention-menu]')) return;
    setMention(null);
  };

  return (
    <section className={d.card}>
      <div className={d.composeModeRow}>
        <div className="inline-flex items-center gap-1 rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] p-1">
          <button
            type="button"
            className={`${d.composeModeOption} ${mode === 'template' ? d.composeModeActive : d.composeModeIdle}`}
            onClick={() => onModeChange('template')}
          >
            Use a template
          </button>
          <button
            type="button"
            className={`${d.composeModeOption} ${mode === 'scratch' ? d.composeModeActive : d.composeModeIdle}`}
            onClick={() => onModeChange('scratch')}
          >
            Write from scratch
          </button>
        </div>
      </div>

      <div className={`${d.cardBody} ${d.composeGrid}`}>
        <div className="flex min-w-0 flex-col gap-4">
          {mode === 'template' ? (
            <div className={d.fieldGroup}>
              <label className={d.fieldLabel}>
                Pick a template <span className="text-[#c62828]">*</span>
              </label>
              <Popover open={templatePickerOpen} onOpenChange={setTemplatePickerOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className={d.templateSelectTrigger} aria-label="Pick a template">
                    <span className={selectedTemplate ? 'text-[#212121]' : 'text-[#9e9e9e]'}>
                      {selectedTemplate ? selectedTemplate.label : 'Choose a template…'}
                    </span>
                    <Sparkles className="size-4 shrink-0 text-[#9e9e9e]" strokeWidth={1.75} aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[440px] p-0">
                  {TEMPLATE_CATEGORIES.map((category) => {
                    const items = templates.filter((t) => t.category === category);
                    if (items.length === 0) return null;
                    return (
                      <div key={category}>
                        <p className={d.mergeFieldGroupLabel}>{category}</p>
                        {items.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className={d.mergeFieldItem}
                            onClick={() => handlePickTemplate(t)}
                          >
                            <span className="min-w-0 flex-1">{t.label}</span>
                            <span className={d.roleBadge}>{t.roleTag}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
          ) : null}

          {mode === 'scratch' ? (
            <EmailHeaderLogoBand logo={layout.header} variant="compose" />
          ) : null}

          <div className={`relative ${mention?.field === 'subject' ? 'z-10' : ''} ${d.fieldGroup}`}>
            <label htmlFor="bulk-email-subject" className={d.fieldLabel}>
              Subject <span className="text-[#c62828]">*</span>
            </label>
            <input
              id="bulk-email-subject"
              ref={subjectRef}
              type="text"
              value={subject}
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={mention?.field === 'subject'}
              aria-controls={mention?.field === 'subject' ? 'bulk-email-mention-menu' : undefined}
              aria-autocomplete="list"
              onChange={(e) => {
                onSubjectChange(e.target.value);
                trackMention('subject', e.target.value, e.target.selectionStart ?? e.target.value.length);
              }}
              onClick={(e) => trackMention('subject', subject, e.currentTarget.selectionStart ?? subject.length)}
              onKeyDown={(e) => onMentionKeyDown(e, 'subject')}
              onBlur={closeMentionOnBlur}
              className={d.textInput}
              placeholder="Email subject…"
            />
            {mention?.field === 'subject' ? (
              <MentionMenu
                fields={filteredFields}
                activeIndex={mentionIndex}
                onHover={setMentionIndex}
                onPick={insertMention}
              />
            ) : null}
          </div>

          <div className={`relative ${mention?.field === 'body' ? 'z-10' : ''} ${d.fieldGroup}`}>
            <div className="flex items-center justify-between">
              <label htmlFor="bulk-email-body" className={d.fieldLabel}>
                Email content <span className="text-[#c62828]">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="rounded border border-[#d1d5db] bg-white px-2.5 py-1 text-[12px] font-medium text-[#424242] hover:bg-[#fafafa]"
                  >
                    Insert Merge Field
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className={d.mergeFieldPopover}>
                  <MergeFieldPicker groups={fieldGroups} onPick={insertTokenAtCursor} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="overflow-hidden rounded-[6px] border border-[#888888] bg-white">
              <div className={d.editorToolbar}>
                <ToolbarIcon icon={Bold} label="Bold" />
                <ToolbarIcon icon={Italic} label="Italic" />
                <ToolbarIcon icon={Underline} label="Underline" />
                <span className={d.editorToolbarDivider} aria-hidden />
                <ToolbarIcon icon={ListOrdered} label="Numbered list" />
                <ToolbarIcon icon={List} label="Bulleted list" />
                <span className={d.editorToolbarDivider} aria-hidden />
                <ToolbarIcon icon={LinkIcon} label="Insert link" />
                <ToolbarIcon icon={RemoveFormatting} label="Clear formatting" />
              </div>
              <textarea
                id="bulk-email-body"
                ref={bodyRef}
                value={body}
                aria-controls={mention?.field === 'body' ? 'bulk-email-mention-menu' : undefined}
                aria-autocomplete="list"
                aria-describedby="bulk-email-send-mode-note"
                onChange={(e) => {
                  onBodyChange(e.target.value);
                  trackMention('body', e.target.value, e.target.selectionStart ?? e.target.value.length);
                }}
                onClick={(e) => trackMention('body', body, e.currentTarget.selectionStart ?? body.length)}
                onKeyDown={(e) => onMentionKeyDown(e, 'body')}
                onBlur={closeMentionOnBlur}
                className={d.editorBody}
                placeholder="Compose your email body… or pick a template above. Type @ to insert a merge field."
              />
            </div>
            {mention?.field === 'body' ? (
              <MentionMenu
                fields={filteredFields}
                activeIndex={mentionIndex}
                onHover={setMentionIndex}
                onPick={insertMention}
              />
            ) : null}
            <p id="bulk-email-send-mode-note" className={`${d.fieldHint} mt-1.5`}>
              {usingLetter && letter.template.body.includes('{{groupSummaryTable}}')
                ? 'One email per person: the summary table lists each group placement.'
                : usingLetter
                  ? 'One email per person: the Schedule Table lists that person’s group placements.'
                  : sendMode === 'perPerson'
                    ? 'One email per person: schedule details appear as a table in each email.'
                    : 'One email per schedule: schedule fields fill in for that schedule only.'}
            </p>

            {mode === 'scratch' && layout.exxatFooter ? (
              <div className="mt-3">
                <EmailFooterLogoBand show variant="compose" />
              </div>
            ) : null}
          </div>

          <div className={`${d.fieldGroup} mt-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={d.fieldLabel}>
                Attachments
                {attachments.length > 0 ? (
                  <span className="ml-1.5 text-[12px] font-semibold text-[#3f51b5]">
                    ({attachments.length})
                  </span>
                ) : null}
              </span>
            </div>
            <div className={d.attachmentsRow}>
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-[#d1d5db] bg-white px-3 text-[13px] font-medium text-[#424242] hover:bg-[#fafafa]"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="size-3.5" strokeWidth={1.75} aria-hidden />
                Add file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onAddAttachment({ id: `${Date.now()}-${file.name}`, name: file.name });
                  }
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-[#d1d5db] bg-white px-3 text-[13px] font-medium text-[#424242] hover:bg-[#fafafa]"
                onClick={() =>
                  onAddAttachment({
                    id: `${Date.now()}-generated`,
                    name: 'Generated document.pdf',
                  })
                }
              >
                Generate document
              </button>
              {attachments.map((file) => (
                <span key={file.id} className={d.attachmentChipHighlighted}>
                  <Paperclip className="size-3 shrink-0 text-[#3f51b5]" strokeWidth={1.75} aria-hidden />
                  <span className="min-w-0 truncate">{file.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    className="flex size-4 shrink-0 items-center justify-center rounded-full hover:bg-[#dfe3f8]"
                    onClick={() => onRemoveAttachment(file.id)}
                  >
                    <X className="size-3" strokeWidth={2} aria-hidden />
                  </button>
                </span>
              ))}
            </div>
            <p className={d.attachmentsHint}>PDF, DOCX, XLSX, PNG, JPG · 10 MB max · 3 files max</p>
          </div>
        </div>

        {mode === 'scratch' ? (
          <div className={d.fieldGroup}>
            <p className={d.fieldLabel}>Header and footer layout</p>
            <RadioGroup
              value={headerFooterLayout}
              onValueChange={(v) => onHeaderFooterLayoutChange(v as HeaderFooterLayoutId)}
            >
              {HEADER_FOOTER_LAYOUTS.map((option) => (
                <label key={option.id} className={d.headerFooterOption}>
                  <RadioGroupItem value={option.id} id={`hf-${option.id}`} className={d.headerFooterRadio} />
                  <span className={d.headerFooterLabel}>{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ToolbarIcon({ icon: Icon, label }: { icon: typeof Bold; label: string }) {
  return (
    <button type="button" aria-label={label} title={label} className={d.editorToolbarBtn}>
      <Icon className="size-4" strokeWidth={1.75} />
    </button>
  );
}

function MergeFieldPicker({
  groups,
  onPick,
}: {
  groups: { label: string; fields: GroupedLetterField[] }[];
  onPick: (token: string) => void;
}) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search merge fields…"
        className={d.mergeFieldSearch}
      />
      <div className="max-h-[320px] overflow-y-auto pb-2">
        {groups.map((group) => {
          const fields = group.fields.filter(
            (f) => !normalized || f.label.toLowerCase().includes(normalized),
          );
          if (fields.length === 0) return null;
          return (
            <div key={group.label}>
              <p className={d.mergeFieldGroupLabel}>{group.label}</p>
              {fields.map((field) => (
                <button
                  key={field.token}
                  type="button"
                  className={d.mergeFieldItem}
                  onClick={() => onPick(field.token)}
                >
                  <span>{field.label}</span>
                  <span className={d.mergeFieldToken}>{`{{${field.token}}}`}</span>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MentionMenu({
  fields,
  activeIndex,
  onPick,
  onHover,
}: {
  fields: GroupedLetterField[];
  activeIndex: number;
  onPick: (token: string) => void;
  onHover: (index: number) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <div
      data-mention-menu
      id="bulk-email-mention-menu"
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
