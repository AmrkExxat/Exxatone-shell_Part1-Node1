import { NavLink, useLocation, useParams } from 'react-router';
import { partnersFont, schedulesChrome } from './schedulesTypography';

const TABS = [
  { to: 'overview', label: 'Overview' },
  { to: 'list/all', label: 'Schedules List' },
  { to: 'calendar', label: 'Calendar', badge: 'New' as const },
  { to: 'report', label: 'Report' },
] as const;

export function SchedulesTopTabs() {
  const { siteId } = useParams<{ siteId: string }>();
  const location = useLocation();
  const base = `/site/${siteId}/schedules`;
  const lastIndex = TABS.length - 1;

  const isTabActive = (to: string) => {
    if (to === 'overview') return location.pathname.endsWith('/schedules/overview');
    if (to.startsWith('list')) return location.pathname.includes('/schedules/list');
    if (to === 'calendar') return location.pathname.endsWith('/schedules/calendar');
    if (to === 'report') return location.pathname.endsWith('/schedules/report');
    return false;
  };

  return (
    <nav className={schedulesChrome.tabListOuter} aria-label="Schedules views">
      <div className={`${schedulesChrome.tabListRow} ${partnersFont}`}>
        {TABS.map((tab, index) => (
          <NavLink
            key={tab.to}
            to={`${base}/${tab.to}`}
            className={() => {
              const active = isTabActive(tab.to);
              const baseCls = schedulesChrome.tabSegment;
              if (active) {
                return `${baseCls} ${schedulesChrome.tabSegmentActive}`;
              }
              let idle = `${baseCls} ${schedulesChrome.tabSegmentIdle}`;
              if (index === 0) idle += ` ${schedulesChrome.tabSegmentFirst}`;
              if (index === lastIndex) idle += ` ${schedulesChrome.tabSegmentLast}`;
              return idle;
            }}
          >
            <span className="inline-flex items-center">
              {tab.label}
              {'badge' in tab && tab.badge ? (
                <span className={schedulesChrome.tabNewBadge}>{tab.badge}</span>
              ) : null}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
