import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  canDeleteTemplate,
  canEditTemplate,
  deleteBlockedReason,
  formatTemplateTimestamp,
  historyTypeLabel,
  type EmailTemplateRecord,
} from '../../../config/emailTemplates';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { et } from './emailTemplatesTokens';

type Props = {
  template: EmailTemplateRecord;
  siblings: EmailTemplateRecord[];
  showAudience: boolean;
  onSetDefault: () => void;
  onPreview: () => void;
  onClone: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function IconAction({
  label,
  disabled,
  disabledReason,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  disabledReason?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const btn = (
    <button
      type="button"
      className={et.iconBtn}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
  if (disabled && disabledReason) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{btn}</span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px] text-[12px]">
          {disabledReason}
        </TooltipContent>
      </Tooltip>
    );
  }
  return btn;
}

export function EmailTemplateCard({
  template,
  siblings,
  showAudience,
  onSetDefault,
  onPreview,
  onClone,
  onEdit,
  onDelete,
}: Props) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const editable = canEditTemplate(template);
  const deletable = canDeleteTemplate(template, siblings);
  const deleteReason = deleteBlockedReason(template, siblings);

  return (
    <article className={et.templateCard}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={et.templateName}>{template.name}</h3>
            {template.kind === 'customized' ? (
              <span className={`${et.badgeBase} ${et.badgeCustomized}`}>Customized</span>
            ) : (
              <span className={`${et.badgeBase} ${et.badgeStandard}`}>Standard</span>
            )}
            {template.isDefault ? (
              <span className={`${et.badgeBase} ${et.badgeDefault}`}>Default</span>
            ) : null}
            {showAudience && template.audience ? (
              <span className={`${et.badgeBase} ${et.badgeAudience}`}>{template.audience}</span>
            ) : null}
          </div>
          <p className={et.subjectPreview}>{template.subject}</p>
        </div>
      </div>

      <div className={et.actionsRow}>
        {!template.isDefault ? (
          <button type="button" className={et.linkAction} onClick={onSetDefault}>
            Set as default
          </button>
        ) : null}
        <div className={et.iconActions}>
          <IconAction label="Preview" onClick={onPreview}>
            <Eye className="size-4" strokeWidth={1.75} />
          </IconAction>
          <IconAction label="Clone" onClick={onClone}>
            <Copy className="size-4" strokeWidth={1.75} />
          </IconAction>
          <IconAction
            label="Edit"
            disabled={!editable}
            disabledReason="Standard templates cannot be edited. Clone to customize."
            onClick={onEdit}
          >
            <Pencil className="size-4" strokeWidth={1.75} />
          </IconAction>
          <IconAction
            label="Delete"
            disabled={!deletable}
            disabledReason={deleteReason ?? undefined}
            onClick={onDelete}
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </IconAction>
        </div>
      </div>

      <button
        type="button"
        className={et.historyStrip}
        aria-expanded={historyOpen}
        onClick={() => setHistoryOpen((v) => !v)}
      >
        <span>
          Last updated by {template.lastUpdatedBy} ·{' '}
          {formatTemplateTimestamp(template.lastUpdatedAt)}
        </span>
        {historyOpen ? (
          <ChevronUp className="size-4 shrink-0" aria-hidden />
        ) : (
          <ChevronDown className="size-4 shrink-0" aria-hidden />
        )}
      </button>
      {historyOpen ? (
        <ul className={et.historyPanel}>
          {[...template.history].reverse().map((entry) => (
            <li key={entry.id}>
              <span className="font-medium text-[#424242]">{historyTypeLabel(entry.type)}</span>
              {entry.type === 'cloned' && entry.detail ? (
                <> from &quot;{entry.detail}&quot;</>
              ) : null}
              {' · '}
              {entry.actor} · {formatTemplateTimestamp(entry.at)}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
