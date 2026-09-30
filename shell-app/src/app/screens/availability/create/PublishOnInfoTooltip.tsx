import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import { PUBLISH_ON_SCHEDULE_TOOLTIP } from '../../../config/availabilityPublishPreferences';

/** Publish on field — hover info (Figma schedule publishing). */
export function PublishOnInfoTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[#616161] hover:text-[#424242]"
          aria-label={PUBLISH_ON_SCHEDULE_TOOLTIP}
        >
          <Info className="size-3.5" strokeWidth={2} aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={6}
        className="max-w-[240px] rounded-[4px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] font-normal leading-4 text-[#616161] shadow-[0_2px_8px_rgba(0,0,0,0.12)] [&>svg]:hidden"
      >
        {PUBLISH_ON_SCHEDULE_TOOLTIP}
      </TooltipContent>
    </Tooltip>
  );
}
