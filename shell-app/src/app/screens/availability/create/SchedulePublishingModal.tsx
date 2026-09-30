import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { tierCategoryLabel, type TierPublishDates } from '../../../config/availabilityPublishPreferences';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '../../../components/ui/dialog';
import { cn } from '../../../components/ui/utils';
import { partnersDrawer, partnersType } from '../../partners/partnersTypography';
import { availabilityCreateDrawer } from './availabilityCreateDrawer';
import { PublishOnInfoTooltip } from './PublishOnInfoTooltip';
import { PublishPreferenceDatePickerField } from './publishPreferenceDatePickerField';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tierCategoryIds: string[];
  getEntityLabel?: (id: string) => string;
  /** Snapshot when the modal opens (avoids stale parent state on first paint). */
  draftSeed: Record<string, TierPublishDates>;
  onSave: (dates: Record<string, TierPublishDates>) => void;
};

export function SchedulePublishingModal({
  open,
  onOpenChange,
  tierCategoryIds,
  getEntityLabel = tierCategoryLabel,
  draftSeed,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<Record<string, TierPublishDates>>({});
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(draftSeed);
    setOpenPickerId(null);
  }, [open, draftSeed]);

  const updateTier = (tierId: string, patch: Partial<TierPublishDates>) => {
    setDraft((prev) => ({
      ...prev,
      [tierId]: { ...prev[tierId], ...patch },
    }));
  };

  const canSave = tierCategoryIds.every((id) => Boolean(draft[id]?.publishOn));

  const handleSave = () => {
    if (!canSave) return;
    onSave(draft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[100]" />
        <DialogPrimitive.Content
          aria-describedby="schedule-publishing-hint"
          className={cn(
            availabilityCreateDrawer.schedulePublishingDialog,
            'bg-background fixed top-[50%] left-[50%] z-[100] flex w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col gap-0 rounded-lg border p-0 shadow-lg duration-200 outline-none sm:max-w-[920px]',
          )}
        >
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-xs text-[#616161] opacity-80 hover:opacity-100 focus:outline-hidden">
            <X className="size-4" strokeWidth={2} aria-hidden />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        <div className={availabilityCreateDrawer.schedulePublishingHeader}>
          <div className="flex items-start gap-2 pr-8">
            <Calendar className="mt-0.5 size-5 shrink-0 text-[#212121]" strokeWidth={2} aria-hidden />
            <div>
              <DialogTitle className={availabilityCreateDrawer.schedulePublishingTitle}>
                Schedule Publishing
              </DialogTitle>
              <DialogDescription
                id="schedule-publishing-hint"
                className={availabilityCreateDrawer.schedulePublishingHint}
              >
                Select the date and time to schedule publishing for the selected categories
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className={availabilityCreateDrawer.schedulePublishingBody}>
          {tierCategoryIds.map((tierId) => (
            <div key={tierId} className={availabilityCreateDrawer.schedulePublishingRow}>
              <p className={availabilityCreateDrawer.schedulePublishingTierName}>
                {getEntityLabel(tierId)}
              </p>
              <div className={availabilityCreateDrawer.schedulePublishingDateCol}>
                <label className={`${partnersDrawer.fieldLabel} mb-2 flex items-center gap-1`}>
                  Publish on
                  <span className="text-[#d32f2f]">*</span>
                  <PublishOnInfoTooltip />
                </label>
                <PublishPreferenceDatePickerField
                  id={`schedule-publish-on-${tierId}`}
                  fullWidth
                  variant="emphasis"
                  showClear
                  clearOpensCalendar
                  value={draft[tierId]?.publishOn ?? null}
                  onChange={(publishOn) => updateTier(tierId, { publishOn })}
                  open={openPickerId === `publish-${tierId}`}
                  onOpenChange={(next) => setOpenPickerId(next ? `publish-${tierId}` : null)}
                />
              </div>
              <div className={availabilityCreateDrawer.schedulePublishingDateCol}>
                <label className={`${partnersDrawer.fieldLabel} mb-2 block`}>Due Date</label>
                <PublishPreferenceDatePickerField
                  id={`schedule-due-${tierId}`}
                  fullWidth
                  showClear
                  value={draft[tierId]?.dueOn ?? null}
                  onChange={(dueOn) => updateTier(tierId, { dueOn })}
                  open={openPickerId === `due-${tierId}`}
                  onOpenChange={(next) => setOpenPickerId(next ? `due-${tierId}` : null)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={availabilityCreateDrawer.schedulePublishingFooter}>
          <button
            type="button"
            className={partnersType.outlinePrimaryButton}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${partnersType.primaryButton} h-9 px-4`}
            disabled={!canSave}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
