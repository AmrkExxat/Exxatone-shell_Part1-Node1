import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowRightToLine,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Grid3X3,
  MessageSquareText,
  Pencil,
  RotateCcw,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { SchedulesNeedsAttentionStrip } from './SchedulesNeedsAttentionStrip';
import { filterSchedulesForList, type ScheduleListKind } from '../../config/schedules';
import { useClearanceRecords } from '../../data/ClearanceRecordsContext';
import {
  groupOnboardingStatus,
  memberIconState,
  scheduleClearance,
  studentsOf,
} from '../../data/prototype/clearanceLogic';
import type { PrototypeScheduleRecord, SchedulePerson, ScheduleTimeline } from '../../data/prototype/scheduleRecords';
import { SchedulesListFilterBar } from './SchedulesListFilterBar';
import { SchedulesListKindTabs } from './SchedulesListKindTabs';
import { schedulesColumnWidths, type SchedulesColumnKey } from './schedulesTableColumns';
import { schedulesTableGrid } from './schedulesTable';
import '../availability/availabilityTablePins.css';
import { partnersListChrome, partnersType, schedulesChrome } from './schedulesTypography';
import { ClearanceDialog } from './ClearanceDialog';
import { EditScheduleDrawer } from './EditScheduleDrawer';
import { GroupDetailsDrawer } from './GroupDetailsDrawer';
import { MessageDrawer } from './MessageDrawer';
import { ClearanceIconButton, OnboardingPill, ScheduleKindIcon, ScheduleStatusPill } from './ScheduleStatusBits';

const PAGE_SIZE = 50;

type TimelineFilter = ScheduleTimeline | 'all';

const TIMELINE_TABS: { id: TimelineFilter; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'All', icon: Grid3X3 },
  { id: 'upcoming', label: 'Upcoming', icon: ArrowRightToLine },
  { id: 'current', label: 'Current', icon: RotateCcw },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const BASE_COLUMNS: SchedulesColumnKey[] = [
  'scheduleId',
  'student',
  'schoolName',
  'availability',
  'location',
  'duration',
  'discipline',
  'shift',
  'daysOfWeek',
  'preceptor',
  'clinicalInstructor',
  'programType',
];

const GROUP_COLUMNS: SchedulesColumnKey[] = [
  'groupName',
  'schoolName',
  'availability',
  'groupSlots',
  'groupMembers',
  'location',
  'duration',
  'discipline',
  'shift',
  'daysOfWeek',
  'preceptor',
  'clinicalInstructor',
  'programType',
];

function columnsFor(listKind: ScheduleListKind): SchedulesColumnKey[] {
  if (listKind === 'all') {
    return [...BASE_COLUMNS, 'groupOnboarding', 'scheduleStatus', 'studentOnboarding', 'actions'];
  }
  if (listKind === 'group') {
    return [...GROUP_COLUMNS, 'scheduleStatus', 'groupOnboarding', 'actions'];
  }
  return [...BASE_COLUMNS, 'scheduleStatus', 'onboardingStatus', 'actions'];
}

const STICKY_RIGHT = new Set<SchedulesColumnKey>([
  'scheduleStatus',
  'studentOnboarding',
  'onboardingStatus',
  'groupOnboarding',
  'actions',
]);

function isStickyRight(listKind: ScheduleListKind, key: SchedulesColumnKey) {
  if (listKind === 'all' && key === 'groupOnboarding') return false;
  return STICKY_RIGHT.has(key);
}

const HEADINGS: Record<SchedulesColumnKey, string> = {
  scheduleId: 'Schedule ID',
  student: 'Student',
  groupName: 'Group name & ID',
  schoolName: 'School name',
  groupSlots: 'Group slots',
  groupMembers: 'Group members',
  availability: 'Availability',
  location: 'Location',
  duration: 'Schedule duration',
  discipline: 'Discipline / Specialization',
  shift: 'Shift',
  daysOfWeek: 'Days of week',
  preceptor: 'Preceptor',
  clinicalInstructor: 'Clinical instructor',
  programType: 'Program type',
  groupOnboarding: 'Group onboarding status',
  scheduleStatus: 'Schedule status',
  studentOnboarding: 'Student onboarding status',
  onboardingStatus: 'Onboarding status',
  actions: 'Actions',
};

type ListRow = { key: string; schedule: PrototypeScheduleRecord; student: SchedulePerson | null };

function rowsFor(records: PrototypeScheduleRecord[], listKind: ScheduleListKind): ListRow[] {
  const rows: ListRow[] = [];
  records.forEach((schedule) => {
    const students = studentsOf(schedule);
    if (listKind === 'all' && schedule.kind === 'group') {
      students.forEach((student) => rows.push({ key: `${schedule.id}:${student.id}`, schedule, student }));
      return;
    }
    if (schedule.kind === 'individual') {
      rows.push({ key: schedule.id, schedule, student: students[0] ?? null });
      return;
    }
    rows.push({ key: schedule.id, schedule, student: null });
  });
  return rows;
}

type Props = { listKind: ScheduleListKind };

export function SchedulesListPage({ listKind }: Props) {
  const { siteId = '' } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { records } = useClearanceRecords();
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [clearance, setClearance] = useState<{ scheduleId: string; focusPersonId: string | null } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ scheduleId: string } | null>(null);

  const columns = columnsFor(listKind);
  const filtered = useMemo(
    () => rowsFor(filterSchedulesForList(records, listKind, timelineFilter, query), listKind),
    [records, listKind, timelineFilter, query],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const tableWidthPx = columns.reduce((sum, key) => sum + schedulesColumnWidths[key], 0);
  const tableWidthStyle = { width: tableWidthPx, minWidth: tableWidthPx };
  const headScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const syncHeadScrollFromBody = useCallback(() => {
    const head = headScrollRef.current;
    const body = bodyScrollRef.current;
    if (head && body) head.scrollLeft = body.scrollLeft;
  }, []);

  const detailHref = (row: PrototypeScheduleRecord) =>
    `/site/${siteId}/schedules/${row.scheduleId}?from=${listKind}`;
  const openDetail = (row: PrototypeScheduleRecord) => navigate(detailHref(row));
  const groupSchedule = records.find((row) => row.id === groupId) ?? null;
  const clearanceSchedule = records.find((row) => row.id === clearance?.scheduleId) ?? null;
  const editSchedule = records.find((row) => row.id === editId) ?? null;
  const messageSchedule = records.find((row) => row.id === message?.scheduleId) ?? null;

  return (
    <>
      <div className={schedulesChrome.listStickyToolbar}>
        <div className={partnersListChrome.contentInset}>
          <div className="mb-3 pt-3">
            <SchedulesListKindTabs />
          </div>
          <div className={schedulesChrome.listTimelineRow}>
            <nav className={schedulesChrome.timelineSubNav} aria-label="Schedule timeline">
              {TIMELINE_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = timelineFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setTimelineFilter(tab.id);
                      setPage(0);
                    }}
                    className={active ? schedulesChrome.timelineSubActive : schedulesChrome.timelineSubIdle}
                  >
                    <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            <SchedulesNeedsAttentionStrip />
          </div>
          <div className={schedulesChrome.tableCardTop}>
            <div className={partnersListChrome.filterBarInner}>
              <SchedulesListFilterBar
                listKind={listKind}
                query={query}
                onQueryChange={(next) => {
                  setQuery(next);
                  setPage(0);
                }}
              />
            </div>
            <div ref={headScrollRef} className={partnersListChrome.headScroll}>
              <table className={schedulesTableGrid.table} style={tableWidthStyle}>
                <ColGroup columns={columns} />
                <thead>
                  <tr>
                    {columns.map((key) => (
                      <th
                        key={key}
                        className={`${headClass(listKind, key)} overflow-hidden text-ellipsis`}
                        style={pinStyle(listKind, columns, key)}
                      >
                        {HEADINGS[key]}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className={`${partnersListChrome.contentInset} pb-6`}>
        <div className={schedulesChrome.tableCardBottom}>
          <div ref={bodyScrollRef} className={partnersListChrome.bodyScroll} onScroll={syncHeadScrollFromBody}>
            <table className={schedulesTableGrid.table} style={tableWidthStyle}>
              <ColGroup columns={columns} />
              <tbody>
                {pageItems.map((row) => (
                  <tr key={row.key} className={`group ${schedulesTableGrid.bodyRow}`}>
                    {columns.map((key) => (
                      <td
                        key={key}
                        className={bodyClass(listKind, key)}
                        style={pinStyle(listKind, columns, key)}
                      >
                        <Cell
                          column={key}
                          row={row}
                          listKind={listKind}
                          onOpenDetail={() => openDetail(row.schedule)}
                          onOpenGroup={() => setGroupId(row.schedule.id)}
                          onOpenEdit={() => setEditId(row.schedule.id)}
                          onOpenMessage={() => setMessage({ scheduleId: row.schedule.id })}
                          onOpenClearance={(focusPersonId) =>
                            setClearance({ scheduleId: row.schedule.id, focusPersonId })
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={page} totalPages={totalPages} count={filtered.length} onPage={setPage} />
        </div>
      </div>

      <ClearanceDialog
        schedule={clearanceSchedule}
        focusPersonId={clearance?.focusPersonId}
        onOpenChange={(open) => {
          if (!open) setClearance(null);
        }}
      />
      <GroupDetailsDrawer
        schedule={groupSchedule}
        onOpenChange={(open) => {
          if (!open) setGroupId(null);
        }}
        onShowDetails={() => {
          if (!groupSchedule) return;
          setGroupId(null);
          navigate(detailHref(groupSchedule));
        }}
        onEdit={() => {
          if (!groupSchedule) return;
          setEditId(groupSchedule.id);
        }}
        onMessage={() => {
          if (!groupSchedule) return;
          setMessage({ scheduleId: groupSchedule.id });
        }}
      />
      <EditScheduleDrawer schedule={editSchedule} onOpenChange={(open) => { if (!open) setEditId(null); }} />
      <MessageDrawer
        schedule={messageSchedule}
        onOpenChange={(open) => { if (!open) setMessage(null); }}
      />
    </>
  );
}

function ColGroup({ columns }: { columns: SchedulesColumnKey[] }) {
  return (
    <colgroup>
      {columns.map((key) => (
        <col key={key} style={{ width: schedulesColumnWidths[key] }} />
      ))}
    </colgroup>
  );
}

function rightOffset(listKind: ScheduleListKind, columns: SchedulesColumnKey[], key: SchedulesColumnKey) {
  const index = columns.indexOf(key);
  return columns.slice(index + 1).reduce((sum, next) => {
    return sum + (isStickyRight(listKind, next) ? schedulesColumnWidths[next] : 0);
  }, 0);
}

function pinStyle(listKind: ScheduleListKind, columns: SchedulesColumnKey[], key: SchedulesColumnKey): CSSProperties {
  const width = schedulesColumnWidths[key];
  const base = { width, minWidth: width, maxWidth: width };
  if (key === 'scheduleId' || key === 'groupName') return { ...base, left: 0 };
  if (key === 'student') return { ...base, left: schedulesColumnWidths.scheduleId };
  if (listKind === 'group' && key === 'schoolName') return { ...base, left: schedulesColumnWidths.groupName };
  if (isStickyRight(listKind, key)) return { ...base, right: rightOffset(listKind, columns, key) };
  return base;
}

function headClass(listKind: ScheduleListKind, key: SchedulesColumnKey) {
  const h = schedulesTableGrid.headCell;
  const pinnedLeft = key === 'scheduleId' || key === 'student' || key === 'groupName' || (listKind === 'group' && key === 'schoolName');
  if (pinnedLeft) return `${h} ${schedulesTableGrid.stickyHeadPinLeft}`;
  if (key === 'actions') return `${h} ${schedulesTableGrid.stickyHeadPinActions} last:border-r-0`;
  if (isStickyRight(listKind, key)) return `${h} ${schedulesTableGrid.stickyHeadPinRight}`;
  return h;
}

function bodyClass(listKind: ScheduleListKind, key: SchedulesColumnKey) {
  const c = `${schedulesTableGrid.bodyCell} min-h-[72px]`;
  const pinnedLeft = key === 'scheduleId' || key === 'student' || key === 'groupName' || (listKind === 'group' && key === 'schoolName');
  if (pinnedLeft) return `${c} ${schedulesTableGrid.stickyBodyPinLeft}`;
  if (key === 'actions') return `${c} ${schedulesTableGrid.stickyBodyPinActions} align-middle last:border-r-0`;
  if (isStickyRight(listKind, key)) return `${c} ${schedulesTableGrid.stickyBodyPinRight} align-middle`;
  return c;
}

function Cell({
  column,
  row,
  listKind,
  onOpenDetail,
  onOpenGroup,
  onOpenEdit,
  onOpenMessage,
  onOpenClearance,
}: {
  column: SchedulesColumnKey;
  row: ListRow;
  listKind: ScheduleListKind;
  onOpenDetail: () => void;
  onOpenGroup: () => void;
  onOpenEdit: () => void;
  onOpenMessage: () => void;
  onOpenClearance: (focusPersonId: string | null) => void;
}) {
  const schedule = row.schedule;
  const students = studentsOf(schedule);
  const student = row.student;
  if (column === 'scheduleId') {
    return (
      <div className="flex items-start gap-1.5">
        <ScheduleKindIcon kind={schedule.kind} />
        <div className="min-w-0">
          <p className="font-medium text-[#212121]">{schedule.scheduleId}</p>
          {schedule.title ? <p className="truncate text-[12px] text-[#757575]">{schedule.title}</p> : null}
        </div>
      </div>
    );
  }
  if (column === 'groupName') {
    return (
      <div className="min-w-0">
        <button type="button" className={`max-w-full truncate text-left ${partnersType.link}`} onClick={onOpenGroup}>
          {schedule.title || schedule.scheduleId}
        </button>
        <p className="mt-0.5 text-[12px] text-[#757575]">{schedule.scheduleId}</p>
      </div>
    );
  }
  if (column === 'student') {
    return (
      <div>
        <span className={`inline-block text-left ${partnersType.link}`}>{student?.name}</span>
        {student?.flagged ? (
          <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-[#875a00]">
            <Star className="size-3" aria-hidden /> Flagged for Hire
          </p>
        ) : null}
        <p className="mt-0.5 truncate text-[12px] text-[#757575]">{student?.email}</p>
      </div>
    );
  }
  if (column === 'schoolName') return schedule.schoolName;
  if (column === 'groupSlots') {
    const instructors = schedule.people.filter((person) => person.role === 'ci');
    const filled = students.filter((person) => person.onboardingStatus === 'Compliant').length;
    const instructorLabel = instructors.length === 1 ? '1 Instructor' : `${instructors.length} Instructors`;
    return `${students.length} (${filled} Filled) | ${instructorLabel}`;
  }
  if (column === 'groupMembers') {
    const instructors = schedule.people.filter((person) => person.role === 'ci');
    return (
      <div className="min-w-0 text-[13px] leading-5 text-[#212121]">
        <p className="truncate">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#757575]">Students: </span>
          {students.map((person) => person.name).join(', ') || '—'}
        </p>
        <p className="truncate">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#757575]">Instructors: </span>
          {instructors.map((person) => person.name).join(', ') || '—'}
        </p>
      </div>
    );
  }
  if (column === 'availability') return schedule.availability;
  if (column === 'location') return schedule.location;
  if (column === 'duration') return schedule.durationLabel;
  if (column === 'discipline') return schedule.discipline;
  if (column === 'shift') return schedule.shift || '—';
  if (column === 'daysOfWeek') return schedule.daysOfWeek || '—';
  if (column === 'preceptor') return schedule.preceptor;
  if (column === 'clinicalInstructor') return schedule.clinicalInstructor;
  if (column === 'programType') return schedule.programType;
  if (column === 'scheduleStatus') {
    return (
      <div>
        <ScheduleStatusPill status={schedule.scheduleStatus} onClick={onOpenEdit} />
        {schedule.scheduleStatusNote ? <p className="mt-1 text-[12px] text-[#757575]">{schedule.scheduleStatusNote}</p> : null}
      </div>
    );
  }
  if (column === 'studentOnboarding' || column === 'onboardingStatus') {
    if (!student) return <span className="text-[13px] text-[#9e9e9e]">—</span>;
    const showIcon = column === 'onboardingStatus' || schedule.kind !== 'group';
    return (
      <span className="flex items-center gap-2">
        <OnboardingPill status={student.onboardingStatus} onClick={onOpenDetail} />
        {showIcon ? (
          <ClearanceIconButton
            state={memberIconState(schedule, student)}
            target={{ role: 'student' }}
            note={schedule.clearanceNote}
            onClick={() => onOpenClearance(student.id)}
          />
        ) : null}
      </span>
    );
  }
  if (column === 'groupOnboarding') {
    if (schedule.kind !== 'group') return <span className="text-[13px] text-[#9e9e9e]">—</span>;
    const schoolDone = schedule.schoolRequirements.every((row) => row.status === 'Approved');
    return (
      <div>
        <span className="flex items-center gap-2">
          <OnboardingPill status={groupOnboardingStatus(schedule)} onClick={onOpenDetail} />
          <ClearanceIconButton
            state={scheduleClearance(schedule).state}
            target={{ isGroup: true }}
            note={schedule.clearanceNote}
            onClick={() => onOpenClearance(null)}
          />
        </span>
        {listKind === 'group' ? (
          <p className="mt-1 text-[12px] text-[#757575]">School requirement: {schoolDone ? 'Completed' : 'Pending'}</p>
        ) : null}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-1">
      <button type="button" aria-label={`Edit schedule ${schedule.scheduleId}`} className="rounded p-1 text-[#424242] hover:bg-neutral-100" onClick={onOpenEdit}>
        <Pencil className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </button>
      <button type="button" aria-label={`Message about ${schedule.scheduleId}`} className="rounded p-1 text-[#424242] hover:bg-neutral-100" onClick={onOpenMessage}>
        <MessageSquareText className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function Pager({
  page,
  totalPages,
  count,
  onPage,
}: {
  page: number;
  totalPages: number;
  count: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${schedulesTableGrid.footer}`}>
      <span>
        Page {page + 1} of {totalPages} ({count} items)
      </span>
      <div className="flex items-center gap-1">
        <PagerBtn disabled={page === 0} onClick={() => onPage(0)}>
          <ChevronsLeft className="h-4 w-4" />
        </PagerBtn>
        <PagerBtn disabled={page === 0} onClick={() => onPage(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </PagerBtn>
        <PagerBtn active onClick={() => undefined}>
          {page + 1}
        </PagerBtn>
        <PagerBtn disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </PagerBtn>
        <PagerBtn disabled={page >= totalPages - 1} onClick={() => onPage(totalPages - 1)}>
          <ChevronsRight className="h-4 w-4" />
        </PagerBtn>
      </div>
    </div>
  );
}

function PagerBtn({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded border px-2 text-sm disabled:opacity-40 ${
        active ? 'border-[#3f51b5] bg-[#3f51b5] text-white' : 'border-[#eceef1] bg-white text-[#374151]'
      }`}
    >
      {children}
    </button>
  );
}
