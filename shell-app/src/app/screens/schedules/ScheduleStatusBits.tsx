import { ChevronRight, Clipboard, ClipboardCheck, User, Users } from 'lucide-react';
import type { ClearanceIconState } from '../../data/prototype/clearanceLogic';
import { clearanceTip } from '../../data/prototype/clearanceLogic';
import type { OnboardingStatus } from '../../data/prototype/scheduleRecords';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { schedulesChrome } from './schedulesTypography';

export function onboardingPillClass(status: OnboardingStatus) {
  if (status === 'Compliant') return schedulesChrome.statusPillGreen;
  if (status === 'Some Action Needed') return schedulesChrome.statusPillAmber;
  if (status === 'Not Compliant') return schedulesChrome.onboardingPillRed;
  if (status === 'Not Started') return schedulesChrome.onboardingPillBlue;
  return schedulesChrome.statusPillGray;
}

export function scheduleStatusClass(status: string) {
  if (status === 'Confirmed' || status === 'Completed') return schedulesChrome.statusPillGreen;
  if (status === 'Not Confirmed') return schedulesChrome.statusPillAmber;
  if (status === 'Cancelled' || status === 'Canceled') return schedulesChrome.onboardingPillRed;
  if (status === 'Ongoing') return schedulesChrome.statusPillAmber;
  if (status === 'To be Scheduled') return schedulesChrome.statusPillYellow;
  return schedulesChrome.statusPillGray;
}

function TagPill({
  label,
  className,
  onClick,
}: {
  label: string;
  className: string;
  onClick?: () => void;
}) {
  const tone = `${className} whitespace-nowrap`;
  if (!onClick) return <span className={tone}>{label}</span>;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${tone} cursor-pointer gap-0.5 pr-1.5 hover:brightness-95`}
    >
      {label}
      <ChevronRight className="size-3.5 shrink-0" aria-hidden />
    </button>
  );
}

export function OnboardingPill({
  status,
  onClick,
}: {
  status: OnboardingStatus;
  onClick?: () => void;
}) {
  return (
    <TagPill
      label={status}
      className={onboardingPillClass(status)}
      onClick={status === 'Not Applicable' ? undefined : onClick}
    />
  );
}

export function ScheduleStatusPill({ status, onClick }: { status: string; onClick?: () => void }) {
  return <TagPill label={status} className={scheduleStatusClass(status)} onClick={onClick} />;
}

export function ScheduleKindIcon({ kind }: { kind: 'group' | 'individual' }) {
  const Icon = kind === 'group' ? Users : User;
  return (
    <Icon
      className="mt-0.5 size-4 shrink-0 text-[#616161]"
      strokeWidth={1.75}
      aria-label={kind === 'group' ? 'Group schedule' : 'Individual schedule'}
    />
  );
}

export function ClearanceIconButton({
  state,
  target,
  note,
  onClick,
}: {
  state: ClearanceIconState;
  target: { role?: 'student' | 'ci'; isGroup?: boolean };
  note?: string;
  onClick: () => void;
}) {
  if (state === 'na') return null;
  const label = clearanceTip(state, target);
  const Icon = state === 'complete' ? ClipboardCheck : Clipboard;
  const tone =
    state === 'complete'
      ? 'border-[#a5d6a7] bg-[#e8f5e9] text-[#1b5e20]'
      : 'border-[#f1d893] bg-[#fff6db] text-[#875a00]';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className={`inline-grid size-7 shrink-0 place-items-center rounded-md border ${tone}`}
        >
          <Icon className="size-4" strokeWidth={1.75} aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[280px] border-0 bg-[#283593] px-3 py-2 text-left text-white shadow-lg [&>svg]:bg-[#283593] [&>svg]:fill-[#283593]"
      >
        <p className="text-[13px] font-semibold">{label}</p>
        {note ? (
          <>
            <div className="my-1.5 h-px bg-white/30" />
            <p className="text-[12px] leading-4 font-normal">{note}</p>
          </>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

export function personInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
