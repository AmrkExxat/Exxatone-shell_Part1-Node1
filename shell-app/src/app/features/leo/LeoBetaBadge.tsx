import { cn } from '../../components/ui/utils';
import { LEO_BETA_BADGE_BORDER, LEO_BETA_SOLID_YELLOW } from './leoAssets';

/** Canonical yellow Beta pill — same fill and edge across Leo surfaces (leo-ai-q2 LeoBetaBadge). */
export function LeoBetaBadge({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-normal text-black/70',
        compact ? 'h-[14px] px-[5px] text-[10px] uppercase leading-[10px]' : 'h-4 px-1.5 text-xs leading-3',
        className,
      )}
      style={{ backgroundColor: LEO_BETA_SOLID_YELLOW, border: `1px solid ${LEO_BETA_BADGE_BORDER}` }}
    >
      Beta
    </span>
  );
}
