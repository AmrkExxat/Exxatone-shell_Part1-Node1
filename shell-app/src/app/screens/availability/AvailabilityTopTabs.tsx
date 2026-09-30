import { NavLink, useParams } from 'react-router';
import { availabilityChrome, partnersFont } from './availabilityTypography';

/** Figma Consortium 571:14960 — Tab List (segmented, not inset pills). */
const TABS = [
  { to: 'overview', label: 'Overview' },
  { to: 'list', label: 'Availability List' },
  { to: 'map', label: 'Map View' },
  { to: 'reports', label: 'Reports' },
] as const;

export function AvailabilityTopTabs() {
  const { siteId } = useParams<{ siteId: string }>();
  const base = `/site/${siteId}/availability`;
  const lastIndex = TABS.length - 1;

  return (
    <nav className={availabilityChrome.tabListOuter} aria-label="Availability views">
      <div className={`${availabilityChrome.tabListRow} ${partnersFont}`}>
        {TABS.map((tab, index) => (
          <NavLink
            key={tab.to}
            to={`${base}/${tab.to}`}
            end
            className={({ isActive }) => {
              const baseCls = availabilityChrome.tabSegment;
              if (isActive) {
                return `${baseCls} ${availabilityChrome.tabSegmentActive}`;
              }
              let idle = `${baseCls} ${availabilityChrome.tabSegmentIdle}`;
              if (index === 0) idle += ` ${availabilityChrome.tabSegmentFirst}`;
              if (index === lastIndex) idle += ` ${availabilityChrome.tabSegmentLast}`;
              return idle;
            }}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
