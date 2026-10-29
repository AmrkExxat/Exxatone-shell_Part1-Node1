import { useState } from 'react';
import { toast } from 'sonner';
import type { NotificationChannels } from '../../../config/notificationPreferences';
import { notificationCategories } from '../../../config/notificationPreferences';
import { useNotificationPrefs } from '../../../config/notificationPreferenceStore';
import { es } from '../email-setup/emailSetupTokens';
import { sc } from '../siteConfigurationTokens';
import { NotificationMatrix } from './NotificationMatrix';

export function MyNotificationsPage() {
  const [saved, setSaved] = useNotificationPrefs();
  const [channels, setChannels] = useState(saved.channels);

  const lockedCategory = (eventId: string) =>
    notificationCategories().find(
      (category) => category.events.some((event) => event.id === eventId) && saved.locks[category.id],
    );

  const setChannel = (eventId: string, key: keyof NotificationChannels, value: boolean) => {
    if (lockedCategory(eventId)) return;
    setChannels((current) => ({
      ...current,
      [eventId]: { ...current[eventId], [key]: value },
    }));
  };

  const setCategoryChannel = (categoryId: string, key: keyof NotificationChannels, value: boolean) => {
    if (saved.locks[categoryId]) return;
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

  return (
    <div className={`${sc.font} pb-6 pt-1`}>
      <div className={`${sc.infoCard} p-6`}>
        <header className="mb-6 space-y-1">
          <h1 className={sc.cardTitle}>My Notifications</h1>
          <p className={es.pageIntro}>
            Control how you receive notifications. These preferences apply only to your account.
          </p>
        </header>
        <NotificationMatrix
          mode="personal"
          locks={saved.locks}
          channels={channels}
          onLock={() => undefined}
          onChannel={setChannel}
          onCategoryChannel={setCategoryChannel}
        />
        <div className="mt-6">
          <button
            type="button"
            className={es.btnPrimary}
            onClick={() => {
              setSaved((current) => {
                const next = { ...current.channels };
                for (const category of notificationCategories()) {
                  if (current.locks[category.id]) continue;
                  for (const event of category.events) {
                    next[event.id] = channels[event.id];
                  }
                }
                return { ...current, channels: next };
              });
              toast.success('Preferences saved.');
            }}
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
