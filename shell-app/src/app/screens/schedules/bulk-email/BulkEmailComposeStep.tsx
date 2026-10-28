import { useRef, useState } from 'react';
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
  type BulkEmailTemplate,
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
};

const TEMPLATE_CATEGORIES: BulkEmailTemplate['category'][] = ['Schedules', 'Onboarding', 'General'];

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
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const selectedTemplate = BULK_EMAIL_TEMPLATES.find((t) => t.id === templateId) ?? null;
  const layout = getHeaderFooterLayout(headerFooterLayout);

  const handlePickTemplate = (template: BulkEmailTemplate) => {
    onTemplateChange(template.id);
    onSubjectChange(template.subject);
    onBodyChange(template.body);
    setTemplatePickerOpen(false);
  };

  const insertToken = (token: string) => {
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
                  <button type="button" className={d.templateSelectTrigger}>
                    <span className={selectedTemplate ? 'text-[#212121]' : 'text-[#9e9e9e]'}>
                      {selectedTemplate ? selectedTemplate.label : 'Choose a template…'}
                    </span>
                    <Sparkles className="size-4 shrink-0 text-[#9e9e9e]" strokeWidth={1.75} aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[360px] p-0">
                  {TEMPLATE_CATEGORIES.map((category) => (
                    <div key={category}>
                      <p className={d.mergeFieldGroupLabel}>{category}</p>
                      {BULK_EMAIL_TEMPLATES.filter((t) => t.category === category).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={d.mergeFieldItem}
                          onClick={() => handlePickTemplate(t)}
                        >
                          <span>{t.label}</span>
                          <span className={d.roleBadge}>{t.roleTag}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          ) : null}

          {mode === 'scratch' ? (
            <EmailHeaderLogoBand logo={layout.header} variant="compose" />
          ) : null}

          <div className={d.fieldGroup}>
            <label htmlFor="bulk-email-subject" className={d.fieldLabel}>
              Subject <span className="text-[#c62828]">*</span>
            </label>
            <input
              id="bulk-email-subject"
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className={d.textInput}
              placeholder="Email subject…"
            />
          </div>

          <div className={d.fieldGroup}>
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
                  <MergeFieldPicker onPick={insertToken} />
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
                onChange={(e) => onBodyChange(e.target.value)}
                className={d.editorBody}
                placeholder="Compose your email body… or pick a template above."
              />
            </div>

            {mode === 'scratch' && layout.exxatFooter ? (
              <div className="mt-3">
                <EmailFooterLogoBand show variant="compose" />
              </div>
            ) : null}

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

function MergeFieldPicker({ onPick }: { onPick: (token: string) => void }) {
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
        {MERGE_FIELD_GROUPS.map((group) => {
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
