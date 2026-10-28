import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../components/ui/dialog';
import type { EmailTemplateRecord } from '../../../config/emailTemplates';
import { et } from './emailTemplatesTokens';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTemplates: EmailTemplateRecord[];
  onStartFromScratch: () => void;
  onPickTemplate: (template: EmailTemplateRecord) => void;
};

export function EmailTemplatesAddDialog({
  open,
  onOpenChange,
  eventTemplates,
  onStartFromScratch,
  onPickTemplate,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={et.dialogContent}>
        <div className={et.dialogHeader}>
          <DialogTitle className={et.dialogTitle}>Add template</DialogTitle>
          <DialogDescription className={et.dialogDesc}>
            Start from scratch or pick an existing template for this event. Nothing is added until
            you save.
          </DialogDescription>
        </div>
        <div className={`${et.dialogBody} space-y-3`}>
          <button type="button" className={et.scratchBtn} onClick={onStartFromScratch}>
            Start from scratch
          </button>
          {eventTemplates.length > 0 ? (
            <>
              <p className={et.orLabel}>Or pick a template</p>
              <ul className="space-y-2">
                {eventTemplates.map((tpl) => (
                  <li key={tpl.id}>
                    <button
                      type="button"
                      className={`${et.pickCard} flex-row items-start justify-between`}
                      onClick={() => onPickTemplate(tpl)}
                    >
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold text-[#212121]">{tpl.name}</span>
                        <span className="mt-1 block text-[13px] font-normal text-[#616161]">
                          {tpl.subject}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1">
                        <span className={`${et.badgeBase} ${et.badgeCustomized}`}>Customized</span>
                        {tpl.isDefault ? (
                          <span className={`${et.badgeBase} ${et.badgeDefault}`}>Default</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <div className={et.dialogFooter}>
          <button type="button" className={et.dialogBtnSecondary} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
