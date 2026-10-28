import { SchedulesTopTabs } from './SchedulesTopTabs';
import { schedulesChrome } from './schedulesTypography';

export function SchedulesModuleChrome() {
  return (
    <div className={schedulesChrome.moduleHeaderInner}>
      <h1 className={schedulesChrome.moduleTitle}>Schedules and Onboarding</h1>
      <div className={schedulesChrome.tabPillWrap}>
        <SchedulesTopTabs />
      </div>
      <div className={schedulesChrome.addBtnWrap}>
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
