import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { templatesForEvent } from '../../../config/emailTemplates';
import { useEmailTemplates } from '../../../config/emailTemplateStore';
import {
  recipientSummary,
  type NotificationChannels,
  type NotificationRecipient,
} from '../../../config/notificationPreferences';
import { notificationCategories } from '../../../config/notificationPreferences';
import { useNotificationPrefs } from '../../../config/notificationPreferenceStore';
import { es } from '../email-setup/emailSetupTokens';
import { sc } from '../siteConfigurationTokens';
import { NotificationMatrix } from './NotificationMatrix';
import { NotificationPreviewDialog } from './NotificationPreviewDialog';
import { RecipientsSheet } from './RecipientsSheet';

const USER_ROLES = [
  { id: 'site-admin', label: 'Site Admin' },
  { id: 'location-coordinator', label: 'Location Coordinator' },
  { id: 'discipline-coordinator', label: 'Discipline Coordinator' },
  { id: 'location-discipline-coordinator', label: 'Location-Discipline Coordinator' },
  { id: 'preceptor', label: 'Preceptor' },
] as const;

export function NotificationConfigurationPage() {
  const [saved, setSaved] = useNotificationPrefs();
  const [templates] = useEmailTemplates();
  const [locks, setLocks] = useState(saved.locks);
  const [channels, setChannels] = useState(saved.channels);
  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [roleId, setRoleId] = useState<(typeof USER_ROLES)[number]['id']>('site-admin');
  const roleLabel = USER_ROLES.find((role) => role.id === roleId)?.label ?? 'Site Admin';
  const [preview, setPreview] = useState<{ eventId: string; categoryId: string; label: string } | null>(
    null,
  );

  const setChannel = (eventId: string, key: keyof NotificationChannels, value: boolean) => {
    setChannels((current) => ({
      ...current,
      [eventId]: { ...current[eventId], [key]: value },
    }));
  };

  const setCategoryChannel = (categoryId: string, key: keyof NotificationChannels, value: boolean) => {
    const category = notificationCategories().find((item) => item.id === categoryId);
    if (!category) return;
    setChannels((current) => {
      const next = { ...current };
      for (const event of category.events) {
        next[event.id] = { ...next[event.id], [key]: value };
      }
      return next;
    });
  };

  const previewTemplate = preview
    ? (templatesForEvent(templates, 'automated', preview.categoryId, preview.eventId).find(
        (item) => item.isDefault,
      ) ??
      templatesForEvent(templates, 'automated', preview.categoryId, preview.eventId)[0] ??
      null)
    : null;

  return (
    <div className={`${sc.font} pb-6 pt-1`}>
      <div className={`${sc.infoCard} p-6`}>
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className={sc.cardTitle}>Notification Configuration</h1>
            <p className={es.pageIntro}>Configure in-app and email notifications for users.</p>
          </div>
        </header>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[14px] text-[#212121]" role="group" aria-labelledby="notification-user-label">
            <span id="notification-user-label">User</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex h-9 min-w-[280px] items-center justify-between gap-3 rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[14px] font-normal text-[#212121] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
              >
                <span>{roleLabel}</span>
                <ChevronDown className="size-4 shrink-0 text-[#616161]" aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-[8px] border-[#e5e7eb] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                {USER_ROLES.map((role) => {
                  const selected = role.id === roleId;
                  return (
                    <DropdownMenuItem
                      key={role.id}
                      className={`justify-between rounded-[6px] px-3 py-2.5 text-[14px] text-[#212121] focus:bg-[#f5f6fc] focus:text-[#212121] ${
                        selected ? 'bg-[#eef0fb]' : ''
                      }`}
                      onSelect={() => setRoleId(role.id)}
                    >
                      <span>{role.label}</span>
                      {selected ? <Check className="size-4 text-[#212121]" aria-hidden /> : <span className="size-4" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-[14px] text-[#212121]">
            Recipients: {recipientSummary(saved.recipients)}{' '}
            <button
              type="button"
              className="rounded-[4px] font-medium text-[#3f51b5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
              aria-label="Edit recipients"
              onClick={() => setRecipientsOpen(true)}
            >
              Edit
            </button>
          </p>
        </div>
        <p className="mb-3 text-[13px] text-[#616161]">
          Notification delivery preferences by category and channel
        </p>
        <NotificationMatrix
          mode="admin"
          locks={locks}
          channels={channels}
          onLock={(categoryId, locked) => setLocks((current) => ({ ...current, [categoryId]: locked }))}
          onChannel={setChannel}
          onCategoryChannel={setCategoryChannel}
          onPreview={(eventId, categoryId) => {
            const event = notificationCategories()
              .find((category) => category.id === categoryId)
              ?.events.find((item) => item.id === eventId);
            setPreview({ eventId, categoryId, label: event?.label ?? 'Notification' });
          }}
        />
        <div className="mt-6 flex flex-col items-start gap-3">
          <p className="text-[13px] text-[#616161]">
            We may still send you important notifications about your account outside of the
            notification settings.
          </p>
          <button
            type="button"
            className={es.btnPrimary}
            onClick={() => {
              setSaved((current) => ({ ...current, locks, channels }));
              toast.success('Notification settings saved.');
            }}
          >
            Save Now
          </button>
        </div>
      </div>
      <RecipientsSheet
        open={recipientsOpen}
        onOpenChange={setRecipientsOpen}
        roleLabel={roleLabel}
        recipients={saved.recipients}
        onSave={(next: NotificationRecipient[]) =>
          setSaved((current) => ({ ...current, recipients: next }))
        }
      />
      <NotificationPreviewDialog
        open={preview !== null}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
        eventLabel={preview?.label ?? ''}
        template={previewTemplate}
      />
    </div>
  );
}
