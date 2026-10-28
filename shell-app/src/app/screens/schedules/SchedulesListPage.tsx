import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowRightToLine,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Grid3X3,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { SchedulesNeedsAttentionStrip } from './SchedulesNeedsAttentionStrip';
import {
  filterSchedulesForList,
  SCHEDULE_MOCK_RECORDS,
  type ScheduleListKind,
  type ScheduleRecord,
  type ScheduleTimeline,
} from '../../config/schedules';
import { SchedulesListFilterBar } from './SchedulesListFilterBar';
import { SchedulesListKindTabs } from './SchedulesListKindTabs';
import {
  schedulesColumnWidths,
  schedulesSelectColumnWidth,
  type SchedulesColumnKey,
} from './schedulesTableColumns';
import { schedulesTableGrid } from './schedulesTable';
import { Checkbox } from '../../components/ui/checkbox';
import { BulkEmailSheet } from './bulk-email/BulkEmailSheet';
import { BulkEmailHistoryDialog } from './bulk-email/BulkEmailHistoryDialog';
import '../availability/availabilityTablePins.css';
import {
  partnersListChrome,
  partnersSearchFieldIcon,
  partnersType,
  schedulesChrome,
} from './schedulesTypography';

const PAGE_SIZE = 50;

type TimelineFilter = ScheduleTimeline | 'all';

const TIMELINE_TABS: { id: TimelineFilter; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'All', icon: Grid3X3 },
  { id: 'upcoming', label: 'Upcoming', icon: ArrowRightToLine },
  { id: 'current', label: 'Current', icon: RotateCcw },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

type Props = {
  listKind: ScheduleListKind;
};

export function SchedulesListPage({ listKind }: Props) {
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [emailHistoryOpen, setEmailHistoryOpen] = useState(false);

  const filtered = useMemo(
    () =>
      filterSchedulesForList(SCHEDULE_MOCK_RECORDS, listKind, timelineFilter, query),
    [listKind, timelineFilter, query],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const headScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const syncHeadScrollFromBody = useCallback(() => {
    const head = headScrollRef.current;
    const body = bodyScrollRef.current;
    if (head && body) head.scrollLeft = body.scrollLeft;
  }, []);

  const studentHeader = listKind === 'group' ? 'Group' : 'Student';

  /** Row-select checkbox column: Group + Individual lists only, hidden on All. */
  const showSelectColumn = listKind !== 'all';
  const selectColW = schedulesSelectColumnWidth;
  const scheduleIdLeftPx = showSelectColumn ? selectColW : 0;
  const studentLeftPx = scheduleIdLeftPx + schedulesColumnWidths.scheduleId;
  const tableWidthPx = schedulesTableGrid.tableWidthStyle.width + (showSelectColumn ? selectColW : 0);
  const tableWidthStyle = { width: tableWidthPx, minWidth: tableWidthPx };

  const allVisibleSelected =
    pageItems.length > 0 && pageItems.every((row) => selectedIds.has(row.id));
  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev);
        pageItems.forEach((row) => next.delete(row.id));
        return next;
      }
      const next = new Set(prev);
      pageItems.forEach((row) => next.add(row.id));
      return next;
    });
  };
  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedRows = useMemo(
    () => filtered.filter((row) => selectedIds.has(row.id)),
    [filtered, selectedIds],
  );

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
                      setSelectedIds(new Set());
                    }}
                    className={
                      active ? schedulesChrome.timelineSubActive : schedulesChrome.timelineSubIdle
                    }
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
                selectedCount={selectedIds.size}
                onComposeEmail={() => setBulkEmailOpen(true)}
                onEmailHistory={() => setEmailHistoryOpen(true)}
              />
            </div>

            <div ref={headScrollRef} className={partnersListChrome.headScroll}>
              <table className={schedulesTableGrid.table} style={tableWidthStyle}>
                <SchedulesColGroup showSelectColumn={showSelectColumn} />
                <thead>
                  <SchedulesHeaderRow
                    studentHeader={studentHeader}
                    showSelectColumn={showSelectColumn}
                    scheduleIdLeftPx={scheduleIdLeftPx}
                    studentLeftPx={studentLeftPx}
                    allSelected={allVisibleSelected}
                    onToggleAll={toggleSelectAll}
                  />
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className={`${partnersListChrome.contentInset} pb-6`}>
        <div className={schedulesChrome.tableCardBottom}>
          <div
            ref={bodyScrollRef}
            className={partnersListChrome.bodyScroll}
            onScroll={syncHeadScrollFromBody}
          >
            <table className={schedulesTableGrid.table} style={tableWidthStyle}>
              <SchedulesColGroup showSelectColumn={showSelectColumn} />
              <tbody>
                {pageItems.map((row) => (
                  <SchedulesRow
                    key={row.id}
                    row={row}
                    showSelectColumn={showSelectColumn}
                    scheduleIdLeftPx={scheduleIdLeftPx}
                    studentLeftPx={studentLeftPx}
                    selected={selectedIds.has(row.id)}
                    onToggleSelected={() => toggleSelectRow(row.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`flex flex-wrap items-center justify-between gap-3 ${schedulesTableGrid.footer}`}
          >
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select
                className="h-8 rounded border border-[#eceef1] bg-white px-2"
                value={PAGE_SIZE}
                readOnly
                aria-readonly
              >
                <option value={50}>50</option>
              </select>
            </div>
            <span>
              Page {page + 1} of {totalPages} ({filtered.length} items)
            </span>
            <div className="flex items-center gap-1">
              <PagerBtn disabled={page === 0} onClick={() => setPage(0)}>
                <ChevronsLeft className="h-4 w-4" />
              </PagerBtn>
              <PagerBtn disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </PagerBtn>
              <PagerBtn active onClick={() => undefined}>
                {page + 1}
              </PagerBtn>
              <PagerBtn disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </PagerBtn>
              <PagerBtn
                disabled={page >= totalPages - 1}
                onClick={() => setPage(totalPages - 1)}
              >
                <ChevronsRight className="h-4 w-4" />
              </PagerBtn>
            </div>
          </div>
        </div>
      </div>

      <BulkEmailSheet
        open={bulkEmailOpen}
        onOpenChange={setBulkEmailOpen}
        listKind={listKind}
        selectedRows={selectedRows}
      />
      <BulkEmailHistoryDialog open={emailHistoryOpen} onOpenChange={setEmailHistoryOpen} />
    </>
  );
}

function colWidthStyle(key: SchedulesColumnKey): CSSProperties {
  const w = schedulesColumnWidths[key];
  return { width: w, minWidth: w, maxWidth: w };
}

function SchedulesColGroup({ showSelectColumn }: { showSelectColumn: boolean }) {
  return (
    <colgroup>
      {showSelectColumn ? <col style={{ width: schedulesSelectColumnWidth }} /> : null}
      {(Object.keys(schedulesColumnWidths) as SchedulesColumnKey[]).map((key) => (
        <col key={key} style={{ width: schedulesColumnWidths[key] }} />
      ))}
    </colgroup>
  );
}

function SchedulesHeaderRow({
  studentHeader,
  showSelectColumn,
  scheduleIdLeftPx,
  studentLeftPx,
  allSelected,
  onToggleAll,
}: {
  studentHeader: string;
  showSelectColumn: boolean;
  scheduleIdLeftPx: number;
  studentLeftPx: number;
  allSelected: boolean;
  onToggleAll: () => void;
}) {
  const g = schedulesTableGrid;
  const h = g.headCell;
  return (
    <tr>
      {showSelectColumn ? (
        <th
          className={`${h} ${g.stickyHeadPinLeft}`}
          style={{ width: schedulesSelectColumnWidth, minWidth: schedulesSelectColumnWidth, left: 0 }}
        >
          <Checkbox
            checked={allSelected}
            onCheckedChange={onToggleAll}
            aria-label="Select all schedules on this page"
          />
        </th>
      ) : null}
      <th
        className={`${h} ${g.stickyHeadPinLeft}`}
        style={{ ...colWidthStyle('scheduleId'), left: scheduleIdLeftPx }}
      >
        Schedule ID
      </th>
      <th
        className={`${h} ${g.stickyHeadPinLeft}`}
        style={{ ...colWidthStyle('student'), left: studentLeftPx }}
      >
        {studentHeader}
      </th>
      <th className={h} style={colWidthStyle('schoolName')}>
        School name
      </th>
      <th className={h} style={colWidthStyle('availability')}>
        Availability
      </th>
      <th className={h} style={colWidthStyle('location')}>
        Location
      </th>
      <th className={h} style={colWidthStyle('duration')}>
        Schedule duration
      </th>
      <th className={h} style={colWidthStyle('discipline')}>
        Discipline / Specialization
      </th>
      <th className={h} style={colWidthStyle('shift')}>
        Shift
      </th>
      <th className={h} style={colWidthStyle('daysOfWeek')}>
        Days of week
      </th>
      <th className={h} style={colWidthStyle('preceptor')}>
        Preceptor
      </th>
      <th className={h} style={colWidthStyle('clinicalInstructor')}>
        Clinical instructor
      </th>
      <th className={h} style={colWidthStyle('programType')}>
        Program type
      </th>
      <th
        className={`${h} ${g.stickyHeadPinRight}`}
        style={{ ...colWidthStyle('scheduleStatus'), right: g.stickyScheduleStatusRightPx }}
      >
        Schedule status
      </th>
      <th
        className={`${h} ${g.stickyHeadPinRight}`}
        style={{ ...colWidthStyle('onboardingStatus'), right: g.stickyOnboardingRightPx }}
      >
        Onboarding status
      </th>
      <th
        className={`${h} ${g.stickyHeadPinActions} last:border-r-0`}
        style={{ ...colWidthStyle('actions'), right: 0 }}
      >
        Actions
      </th>
    </tr>
  );
}

function SchedulesRow({
  row,
  showSelectColumn,
  scheduleIdLeftPx,
  studentLeftPx,
  selected,
  onToggleSelected,
}: {
  row: ScheduleRecord;
  showSelectColumn: boolean;
  scheduleIdLeftPx: number;
  studentLeftPx: number;
  selected: boolean;
  onToggleSelected: () => void;
}) {
  const g = schedulesTableGrid;
  const c = `${g.bodyCell} min-h-[81px]`;
  return (
    <tr className={`group ${g.bodyRow}`}>
      {showSelectColumn ? (
        <td
          className={`${c} ${g.stickyBodyPinLeft} align-middle`}
          style={{ width: schedulesSelectColumnWidth, minWidth: schedulesSelectColumnWidth, left: 0 }}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={onToggleSelected}
            aria-label={`Select schedule ${row.scheduleId}`}
          />
        </td>
      ) : null}
      <td
        className={`${c} ${g.stickyBodyPinLeft}`}
        style={{ ...colWidthStyle('scheduleId'), left: scheduleIdLeftPx }}
      >
        <div className="flex items-start gap-1">
          <Users className={`mt-1 size-3 shrink-0 ${partnersSearchFieldIcon}`} aria-hidden />
          <div className="min-w-0">
            <p className="font-medium text-[#212121]">{row.scheduleId}</p>
            <button type="button" className={`text-left ${partnersType.link}`}>
              {row.assignmentLabel}
            </button>
          </div>
        </div>
      </td>
      <td
        className={`${c} ${g.stickyBodyPinLeft}`}
        style={{ ...colWidthStyle('student'), left: studentLeftPx }}
      >
        <button type="button" className={`block text-left ${partnersType.link}`}>
          {row.primaryName}
        </button>
        {row.primarySubline ? (
          <p className="mt-0.5 truncate text-[12px] text-[#757575]">{row.primarySubline}</p>
        ) : null}
      </td>
      <td className={c} style={colWidthStyle('schoolName')}>
        {row.schoolName}
      </td>
      <td className={c} style={colWidthStyle('availability')}>
        {row.availability}
      </td>
      <td className={c} style={colWidthStyle('location')}>
        {row.location}
      </td>
      <td className={c} style={colWidthStyle('duration')}>
        {row.durationLabel}
      </td>
      <td className={c} style={colWidthStyle('discipline')}>
        {row.discipline}
      </td>
      <td className={c} style={colWidthStyle('shift')}>
        {row.shift}
      </td>
      <td className={c} style={colWidthStyle('daysOfWeek')}>
        {row.daysOfWeek}
      </td>
      <td className={c} style={colWidthStyle('preceptor')}>
        {row.preceptor}
      </td>
      <td className={c} style={colWidthStyle('clinicalInstructor')}>
        {row.clinicalInstructor}
      </td>
      <td className={c} style={colWidthStyle('programType')}>
        {row.programType}
      </td>
      <td
        className={`${c} ${g.stickyBodyPinRight} align-middle`}
        style={{ ...colWidthStyle('scheduleStatus'), right: g.stickyScheduleStatusRightPx }}
      >
        <ScheduleStatusPill status={row.scheduleStatus} />
      </td>
      <td
        className={`${c} ${g.stickyBodyPinRight} align-middle`}
        style={{ ...colWidthStyle('onboardingStatus'), right: g.stickyOnboardingRightPx }}
      >
        <OnboardingStatusPill status={row.onboardingStatus} />
      </td>
      <td
        className={`${c} ${g.stickyBodyPinActions} align-middle last:border-r-0`}
        style={{ ...colWidthStyle('actions'), right: 0 }}
      >
        <div className="flex items-center justify-center gap-1">
          <IconBtn label={`Edit schedule ${row.scheduleId}`} icon={Pencil} />
          <IconBtn label={`More actions for ${row.scheduleId}`} icon={MoreHorizontal} />
        </div>
      </td>
    </tr>
  );
}

function ScheduleStatusPill({ status }: { status: string }) {
  if (status === 'Confirmed' || status === 'Completed') {
    return <span className={schedulesChrome.statusPillGreen}>{status}</span>;
  }
  if (status === 'Ongoing') {
    return <span className={schedulesChrome.statusPillAmber}>{status}</span>;
  }
  return <span className={schedulesChrome.statusPillGray}>{status}</span>;
}

function OnboardingStatusPill({ status }: { status: string }) {
  if (status === 'Not Compliant' || status === 'Not Started') {
    return <span className={schedulesChrome.onboardingPillRed}>{status}</span>;
  }
  if (status === 'In Progress') {
    return <span className={schedulesChrome.onboardingPillBlue}>{status}</span>;
  }
  return <span className={schedulesChrome.statusPillGreen}>{status}</span>;
}

function IconBtn({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="rounded p-1 text-[#424242] hover:bg-neutral-100"
      onClick={() => console.log(label)}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
    </button>
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
        active
          ? 'border-[#3f51b5] bg-[#3f51b5] text-white'
          : 'border-[#eceef1] bg-white text-[#374151]'
      }`}
    >
      {children}
    </button>
  );
}
