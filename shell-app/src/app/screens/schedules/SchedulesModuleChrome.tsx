import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { SchedulesTopTabs } from './SchedulesTopTabs';
import { schedulesChrome } from './schedulesTypography';

const SetEmailHistory = createContext<(handler: (() => void) | null) => void>(() => {});
const EmailHistory = createContext<(() => void) | null>(null);

export function SchedulesHeaderProvider({ children }: { children: ReactNode }) {
  const [onHistory, setOnHistory] = useState<(() => void) | null>(null);
  return (
    <SetEmailHistory.Provider value={setOnHistory}>
      <EmailHistory.Provider value={onHistory}>{children}</EmailHistory.Provider>
    </SetEmailHistory.Provider>
  );
}

/** The list page registers how Email history opens for the schedules currently on screen. */
export function useEmailHistoryAction(handler: () => void) {
  const set = useContext(SetEmailHistory);
  useEffect(() => {
    set(() => handler);
    return () => set(null);
  }, [set, handler]);
}

export function SchedulesModuleChrome() {
  const onHistory = useContext(EmailHistory);
  return (
    <div className={schedulesChrome.moduleHeaderInner}>
      <h1 className={schedulesChrome.moduleTitle}>Schedules and Onboarding</h1>
      <div className={schedulesChrome.tabPillWrap}>
        <SchedulesTopTabs />
      </div>
      <div className={schedulesChrome.addBtnWrap}>
        {onHistory ? (
          <button type="button" className={schedulesChrome.historyBtn} onClick={onHistory}>
            Email history
          </button>
        ) : null}
        <button
          type="button"
          className={schedulesChrome.addBtn}
          onClick={() => console.log('Add Schedule stub')}
        >
          + Add Schedule
        </button>
      </div>
    </div>
  );
}
