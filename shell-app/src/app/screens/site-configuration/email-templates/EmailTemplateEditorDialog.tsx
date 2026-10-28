import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../components/ui/dialog';
import { et } from './emailTemplatesTokens';

export type EditorDraft = {
  name: string;
  subject: string;
  body: string;
  audience?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initial: EditorDraft;
  showAudience?: boolean;
  onSave: (draft: EditorDraft) => void;
};

export function EmailTemplateEditorDialog({
  open,
  onOpenChange,
  title,
  description,
  initial,
  showAudience,
  onSave,
}: Props) {
  const [draft, setDraft] = useState(initial);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  const canSave = draft.name.trim() && draft.subject.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 rounded-lg border-[#eceef1] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:max-w-[560px] [&>button]:top-4 [&>button]:right-4">
        <div className={et.dialogHeader}>
          <DialogTitle className={et.dialogTitle}>{title}</DialogTitle>
          <DialogDescription className={et.dialogDesc}>{description}</DialogDescription>
        </div>
        <div className={`${et.dialogBody} space-y-3`}>
          <div>
            <label htmlFor="tpl-editor-name" className="mb-1.5 block text-[14px] font-semibold text-[#111827]">
              Template name
            </label>
            <input
              id="tpl-editor-name"
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className={et.textInput}
            />
          </div>
          {showAudience ? (
            <div>
              <label htmlFor="tpl-editor-audience" className="mb-1.5 block text-[14px] font-semibold text-[#111827]">
                Audience
              </label>
              <input
                id="tpl-editor-audience"
                type="text"
                value={draft.audience ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, audience: e.target.value }))}
                className={et.textInput}
              />
            </div>
          ) : null}
          <div>
            <label htmlFor="tpl-editor-subject" className="mb-1.5 block text-[14px] font-semibold text-[#111827]">
              Subject
            </label>
            <input
              id="tpl-editor-subject"
              type="text"
              value={draft.subject}
              onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
              className={et.textInput}
            />
          </div>
          <div>
            <label htmlFor="tpl-editor-body" className="mb-1.5 block text-[14px] font-semibold text-[#111827]">
              Body
            </label>
            <textarea
              id="tpl-editor-body"
              value={draft.body}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
              className="min-h-[140px] w-full resize-y rounded-[4px] border border-[#e5e7eb] px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#3f51b5] focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
            />
          </div>
        </div>
        <div className={et.dialogFooter}>
          <button type="button" className={et.dialogBtnSecondary} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            type="button"
            className={et.dialogBtnPrimary}
            disabled={!canSave}
            onClick={() => onSave(draft)}
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
