import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { clearanceChecklist, type ClearanceChecklistItem } from './prototype/clearanceChecklist';
import { bindClearanceRuntime } from './prototype/clearanceLogic';
import { prototypeScheduleRecords, type PrototypeScheduleRecord } from './prototype/scheduleRecords';

export type ChecklistHistoryEntry = { when: string; who: string; what: string };

const seedHistory: ChecklistHistoryEntry[] = [
  { when: 'Nov 3, 2026, 4:12 PM', who: 'Emily Carter', what: 'Marked “Locker assignment” inactive' },
  { when: 'Nov 1, 2026, 11:05 AM', who: 'Emily Carter', what: 'Added “Access to Workday” for each student on group schedules' },
  { when: 'Oct 28, 2026, 9:40 AM', who: 'Emily Carter', what: 'Turned on clearance tracking' },
];

export type ClearanceItemUpdate = { personId: string; itemId: string; completed: boolean };
export type GroupItemUpdate = { itemId: string; completed: boolean };

export type SchedulePatch = Partial<
  Pick<PrototypeScheduleRecord, 'shift' | 'daysOfWeek' | 'preceptor' | 'scheduleStatus' | 'scheduleStatusNote'>
>;

type ClearanceRecordsContextValue = {
  records: PrototypeScheduleRecord[];
  saveClearance: (
    scheduleId: string,
    payload: { items: ClearanceItemUpdate[]; groupItems?: GroupItemUpdate[]; note: string; files: string[] },
  ) => void;
  patchSchedule: (scheduleId: string, patch: SchedulePatch) => void;
  checklist: ClearanceChecklistItem[];
  trackingEnabled: boolean;
  checklistHistory: ChecklistHistoryEntry[];
  saveChecklist: (checklist: ClearanceChecklistItem[], trackingEnabled: boolean) => void;
};

const ClearanceRecordsContext = createContext<ClearanceRecordsContextValue | null>(null);

function cloneRecords() {
  return structuredClone(prototypeScheduleRecords);
}

function savedAt() {
  return new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ClearanceRecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<PrototypeScheduleRecord[]>(cloneRecords);
  const [checklist, setChecklist] = useState<ClearanceChecklistItem[]>(clearanceChecklist);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [checklistHistory, setChecklistHistory] = useState<ChecklistHistoryEntry[]>(seedHistory);
  bindClearanceRuntime({ items: checklist, trackingEnabled });

  const value = useMemo<ClearanceRecordsContextValue>(
    () => ({
      records,
      saveClearance: (scheduleId, payload) => {
        setRecords((current) =>
          current.map((schedule) => {
            if (schedule.id !== scheduleId) return schedule;
            const next = structuredClone(schedule);
            payload.items.forEach((update) => {
              const person = next.people.find((row) => row.id === update.personId);
              if (!person) return;
              person.clearance[update.itemId] = {
                status: update.completed ? 'Completed' : 'Not Started',
              };
            });
            payload.groupItems?.forEach((update) => {
              next.groupClearance[update.itemId] = {
                status: update.completed ? 'Completed' : 'Not Started',
              };
            });
            next.clearanceNote = payload.note.trim() || undefined;
            next.clearanceFiles = payload.files;
            next.clearanceHistory = [
              { who: 'You', what: 'Saved clearance', when: savedAt() },
              ...next.clearanceHistory,
            ];
            return next;
          }),
        );
      },
      patchSchedule: (scheduleId, patch) => {
        setRecords((current) =>
          current.map((schedule) => (schedule.id === scheduleId ? { ...schedule, ...patch } : schedule)),
        );
      },
      checklist,
      trackingEnabled,
      checklistHistory,
      saveChecklist: (next, tracking) => {
        setChecklist(next);
        setTrackingEnabled(tracking);
        setChecklistHistory((current) => [
          { when: savedAt(), who: 'You', what: tracking ? 'Saved schedule clearance' : 'Turned off clearance tracking' },
          ...current,
        ]);
      },
    }),
    [records, checklist, trackingEnabled, checklistHistory],
  );

  return <ClearanceRecordsContext.Provider value={value}>{children}</ClearanceRecordsContext.Provider>;
}

export function useClearanceRecords() {
  const value = useContext(ClearanceRecordsContext);
  if (!value) throw new Error('useClearanceRecords must be used inside ClearanceRecordsProvider');
  return value;
}
