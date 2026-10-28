import { NavLink, useParams } from 'react-router';
import type { ScheduleListKind } from '../../config/schedules';
import { schedulesChrome } from './schedulesTypography';

const KINDS: { id: ScheduleListKind; label: string }[] = [
  { id: 'all', label: 'All Schedules' },
  { id: 'group', label: 'Group' },
  { id: 'individual', label: 'Individual' },
];

export function SchedulesListKindTabs() {
  const { siteId } = useParams<{ siteId: string }>();
  const base = `/site/${siteId}/schedules/list`;

  return (
    <nav className={schedulesChrome.listKindTabRow} aria-label="Schedule list type">
      {KINDS.map((kind, index) => (
        <NavLink
          key={kind.id}
          to={`${base}/${kind.id}`}
          end
          className={({ isActive }) =>
            `${schedulesChrome.listKindTab} ${
              isActive ? schedulesChrome.listKindActive : schedulesChrome.listKindIdle
            } ${index === 0 ? 'rounded-l-lg' : ''} ${index === KINDS.length - 1 ? 'rounded-r-lg' : ''}`
          }
        >
          {kind.label}
        </NavLink>
      ))}
    </nav>
  );
}
