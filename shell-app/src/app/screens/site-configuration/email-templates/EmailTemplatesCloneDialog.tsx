import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../components/ui/dialog';
import { et } from './emailTemplatesTokens';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceName: string;
  onConfirm: (name: string) => void;
};

export function EmailTemplatesCloneDialog({
  open,
  onOpenChange,
  sourceName,
  onConfirm,
}: Props) {
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
          <label htmlFor="clone-template-name" className="mb-1.5 block text-[14px] font-semibold text-[#111827]">
            Template name
          </label>
          <input
            id="clone-template-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
