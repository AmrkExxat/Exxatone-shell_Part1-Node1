import { Fragment, useEffect, useRef } from 'react';
import {
  Bell,
  CalendarDays,
  ClipboardList,
  Eye,
  Inbox,
  LockOpen,
  Mail,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import type { NotificationChannels } from '../../../config/notificationPreferences';
import { notificationCategories } from '../../../config/notificationPreferences';

const CATEGORY_ICONS: Record<string, typeof Mail> = {
  messages: Mail,
  'slot-request': Inbox,
  'schedule-management': CalendarDays,
  'onboarding-ooo': ClipboardList,
  'digest-notifications': Bell,
};

/** A 4% slate wash. The indigo band and white rows stay recognizable. */
const LOCKED_VEIL = 'bg-[linear-gradient(rgba(15,23,42,0.04),rgba(15,23,42,0.04))]';
function FilledLockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <rect
        x="3.75"
        y="11"
        width="16.5"
        height="9.5"
        rx="2"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

const PERMANENT_LOCK_LINES = [
  'This notification always stays on.',
  'Recipients will receive it and cannot turn it off.',
] as const;
const PERSONAL_LOCK_LINES = [
  'These notifications are locked.',
  'You cannot turn them off.',
] as const;
const UNLOCKED_LINES = [
  'Status: Unlocked.',
  'Click to lock and user action can be reverted.',
] as const;
const LOCKED_LINES = [
  'Status: Locked.',
  'Click to unlock and user action can be reverted.',
] as const;

function TwoLineTip({ lines }: { lines: readonly [string, string] }) {
  return (
    <span className="block text-left">
      <span className="block whitespace-nowrap">{lines[0]}</span>
      <span className="block whitespace-nowrap">{lines[1]}</span>
    </span>
  );
}

function ChannelBox({
  checked,
  indeterminate = false,
  disabled,
  label,
  describedBy,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label: string;
  describedBy?: string;
  onChange: (next: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);
  return (
    <label
      className={`inline-flex size-8 items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        ref={ref}
        type="checkbox"
        className="size-4 accent-[#3f51b5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5] disabled:opacity-50"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

type Mode = 'admin' | 'personal';

type Props = {
  mode: Mode;
  locks: Record<string, boolean>;
  channels: Record<string, NotificationChannels>;
  onLock: (categoryId: string, locked: boolean) => void;
  onChannel: (eventId: string, key: keyof NotificationChannels, value: boolean) => void;
  onCategoryChannel: (categoryId: string, key: keyof NotificationChannels, value: boolean) => void;
  onPreview?: (eventId: string, categoryId: string) => void;
};

export function NotificationMatrix({
  mode,
  locks,
  channels,
  onLock,
  onChannel,
  onCategoryChannel,
  onPreview,
}: Props) {
  const categories = notificationCategories();
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full min-w-[640px] border-collapse text-left"
        aria-label={mode === 'admin' ? 'Notification configuration' : 'My notifications'}
      >
        <thead>
          <tr className="border-b border-[#eceef1] text-[11px] font-semibold uppercase tracking-wide text-[#616161]">
            <th scope="col" className="px-4 py-3 font-semibold">
              {mode === 'admin' ? 'Event' : 'Notification event'}
            </th>
            <th scope="col" className="w-24 px-2 py-3 text-center font-semibold">
              <span className="inline-flex items-center gap-1">
                <Bell className="size-3.5" aria-hidden />
                In app
              </span>
            </th>
            <th scope="col" className="w-24 px-2 py-3 text-center font-semibold">
              <span className="inline-flex items-center gap-1">
                <Mail className="size-3.5" aria-hidden />
                Email
              </span>
            </th>
            {mode === 'admin' ? (
              <th scope="col" className="w-20 px-2 py-3 text-center font-semibold">
                Preview
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const locked = Boolean(locks[category.id]);
            const personalLocked = mode === 'personal' && locked;
            const checksDisabled = category.permanentLock || personalLocked;
            const Icon = CATEGORY_ICONS[category.id] ?? Mail;
            const lockNoteId = checksDisabled ? `${category.id}-lock-note` : undefined;
            const showLockBadge = category.permanentLock || personalLocked;
            const badgeLines = category.permanentLock ? PERMANENT_LOCK_LINES : PERSONAL_LOCK_LINES;
            const inAppValues = category.events.map((event) => channels[event.id]?.inApp ?? false);
            const emailValues = category.events.map((event) => channels[event.id]?.email ?? false);
            const inAppAll = inAppValues.every(Boolean);
            const emailAll = emailValues.every(Boolean);
            return (
              <Fragment key={category.id}>
                <tr className={`bg-[#eef0fb] ${locked ? LOCKED_VEIL : ''}`}>
                  <th scope="row" className="px-4 py-2.5 text-[13px] font-semibold text-[#283593]">
                    <span className="inline-flex flex-wrap items-center gap-2">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                      {category.label}
                      {showLockBadge ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              id={lockNoteId}
                              tabIndex={0}
                              className="inline-flex cursor-default items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-[#283593] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
                            >
                              Locked
                              <span className="pointer-events-none fixed top-0 left-0 m-0 h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap">
                                . {badgeLines.join(' ')}
                              </span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-none text-left">
                            <TwoLineTip lines={badgeLines} />
                          </TooltipContent>
                        </Tooltip>
                      ) : null}
                    </span>
                    {mode === 'admin' && !category.permanentLock ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="ml-2 inline-flex size-8 items-center justify-center rounded-[6px] text-[#283593] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
                            aria-label={locked ? `Unlock ${category.label}` : `Lock ${category.label}`}
                            aria-pressed={locked}
                            onClick={() => onLock(category.id, !locked)}
                          >
                            {locked ? (
                              <FilledLockIcon />
                            ) : (
                              <LockOpen className="size-4" strokeWidth={1.75} aria-hidden />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-none text-left">
                          <TwoLineTip lines={locked ? LOCKED_LINES : UNLOCKED_LINES} />
                        </TooltipContent>
                      </Tooltip>
                    ) : null}
                  </th>
                  <td className="px-2 py-2.5 text-center">
                    <ChannelBox
                      checked={inAppAll}
                      indeterminate={inAppValues.some(Boolean) && !inAppAll}
                      disabled={checksDisabled}
                      label={`${category.label} in app`}
                      describedBy={lockNoteId}
                      onChange={(value) => onCategoryChannel(category.id, 'inApp', value)}
                    />
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <ChannelBox
                      checked={emailAll}
                      indeterminate={emailValues.some(Boolean) && !emailAll}
                      disabled={checksDisabled}
                      label={`${category.label} email`}
                      describedBy={lockNoteId}
                      onChange={(value) => onCategoryChannel(category.id, 'email', value)}
                    />
                  </td>
                  {mode === 'admin' ? <td /> : null}
                </tr>
                {category.events.map((event) => {
                  const state = channels[event.id] ?? { inApp: false, email: false };
                  return (
                    <tr
                      key={event.id}
                      className={`border-b border-[#f3f4f6] ${locked ? LOCKED_VEIL : ''}`}
                    >
                      <th scope="row" className="px-4 py-3 font-normal">
                        <span className="block text-[14px] font-semibold text-[#111827]">
                          {event.label}
                        </span>
                        {mode === 'personal' ? (
                          <span className="mt-0.5 block text-[13px] font-normal text-[#4a5565]">
                            {event.description}
                          </span>
                        ) : null}
                      </th>
                      <td className="px-2 py-3 text-center">
                        <ChannelBox
                          checked={state.inApp}
                          disabled={checksDisabled}
                          label={`${event.label} in app`}
                          describedBy={lockNoteId}
                          onChange={(value) => onChannel(event.id, 'inApp', value)}
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <ChannelBox
                          checked={state.email}
                          disabled={checksDisabled}
                          label={`${event.label} email`}
                          describedBy={lockNoteId}
                          onChange={(value) => onChannel(event.id, 'email', value)}
                        />
                      </td>
                      {mode === 'admin' ? (
                        <td className="px-2 py-3 text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex size-8 items-center justify-center rounded-[6px] text-[#616161] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
                                aria-label={`Preview ${event.label}`}
                                onClick={() => onPreview?.(event.id, category.id)}
                              >
                                <Eye className="size-4" aria-hidden />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Preview {event.label}</TooltipContent>
                          </Tooltip>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
