import { History } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Placeholder — full send-history table is a follow-up slice. */
export function BulkEmailHistoryDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-[#212121]">
            <History className="size-4 text-[#6b7280]" strokeWidth={1.75} aria-hidden />
            Email History
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#616161]">
            A log of bulk emails sent from this list — recipients, template, sender, and
            delivery status — will appear here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#e0e0e0] bg-[#fafafa] px-6 py-8 text-center">
          <History className="size-6 text-[#bdbdbd]" strokeWidth={1.5} aria-hidden />
          <p className="text-[13px] text-[#757575]">No bulk emails sent yet.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
