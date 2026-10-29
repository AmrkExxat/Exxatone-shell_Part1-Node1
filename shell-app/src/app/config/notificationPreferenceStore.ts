import { useEffect, useState } from 'react';
import {
  createDefaultNotificationPrefs,
  type NotificationPrefs,
} from './notificationPreferences';

let prefs: NotificationPrefs = createDefaultNotificationPrefs();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function useNotificationPrefs() {
  const [value, setValue] = useState(prefs);

  useEffect(() => {
    const listener = () => setValue(prefs);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setPrefs = (next: NotificationPrefs | ((prev: NotificationPrefs) => NotificationPrefs)) => {
    prefs = typeof next === 'function' ? next(prefs) : next;
    setValue(prefs);
    emit();
  };

  return [value, setPrefs] as const;
}
