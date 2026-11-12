import { useMatch } from 'react-router';
import { SchedulesTopTabs } from './SchedulesTopTabs';
import { schedulesChrome } from './schedulesTypography';

const RESERVED_SCHEDULE_SEGMENTS = new Set(['overview', 'list', 'calendar', 'report']);

export function SchedulesModuleChrome() {
  const detailMatch = useMatch('/site/:siteId/schedules/:scheduleId');
  const onDetail =
    !!detailMatch && !RESERVED_SCHEDULE_SEGMENTS.has(detailMatch.params.scheduleId ?? '');

  return (
    <div className={schedulesChrome.moduleHeaderInner}>
      <h1 className={schedulesChrome.moduleTitle}>Schedules and Onboarding</h1>
      <div className={schedulesChrome.tabPillWrap}>
        <SchedulesTopTabs />
      </div>
      <div className={schedulesChrome.addBtnWrap}>
        {onDetail ? null : (
          <button
            type="button"
            className={schedulesChrome.addBtn}
            onClick={() => console.log('Add Schedule stub')}
          >
            + Add Schedule
          </button>
        )}
      </div>
    </div>
  );
}
