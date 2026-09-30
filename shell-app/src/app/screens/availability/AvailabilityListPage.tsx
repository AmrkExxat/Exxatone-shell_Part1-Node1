import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Files,
  Grid3X3,
  MapPin,
  Pencil,
  RotateCcw,
  Trash2,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { AvailabilityRecord, AvailabilityTimeline } from '../../config/availability';
import { useAvailability } from '../../data/AvailabilityContext';
import { AvailabilitySearchCombo } from './AvailabilitySearchCombo';
import { availabilityColumnWidths } from './availabilityTableColumns';
import { availabilityTableGrid } from './availabilityTable';
import './availabilityTablePins.css';
import {
  availabilityChrome,
  partnersListChrome,
  partnersType,
} from './availabilityTypography';

const PAGE_SIZE = 50;

type StatusFilter = 'all' | AvailabilityTimeline;

const STATUS_TABS: { id: StatusFilter; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'All', icon: Grid3X3 },
  { id: 'upcoming', label: 'Upcoming', icon: ChevronRight },
  { id: 'current', label: 'Current', icon: RotateCcw },
  { id: 'completed', label: 'Completed', icon: Check },
];

export function AvailabilityListPage() {
  const { records } = useAvailability();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('current');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = records;
    if (statusFilter !== 'all') {
      rows = rows.filter((r) => r.timeline === statusFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }
    return rows;
  }, [records, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const headScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const syncHeadScrollFromBody = useCallback(() => {
    const head = headScrollRef.current;
    const body = bodyScrollRef.current;
    if (head && body) head.scrollLeft = body.scrollLeft;
  }, []);

  return (
    <>
      <div className={availabilityChrome.listStickyToolbar}>
        <div className={partnersListChrome.contentInset}>
          <div className={availabilityChrome.tableCardTop}>
            <nav className={availabilityChrome.statusSubNav} aria-label="Availability status">
            {STATUS_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setPage(0);
                  }}
                  className={`inline-flex items-center gap-1.5 ${
                    active ? availabilityChrome.statusSubActive : availabilityChrome.statusSubIdle
                  }`}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className={`${partnersListChrome.filterBarInner} ${availabilityChrome.filterBarRow}`}>
            <AvailabilitySearchCombo
              value={query}
              onChange={(next) => {
                setQuery(next);
                setPage(0);
              }}
            />
            <FacetBtn icon={MapPin} label="Discipline" />
            <FacetBtn icon={Grid3X3} label="Programs" />
            <FacetBtn icon={MapPin} label="Location Groups" />
            <FacetBtn icon={MapPin} label="Locations" />
            <FacetBtn icon={Check} label="Status" />
            <button
              type="button"
              className="text-[13px] font-medium text-[#3f51b5] hover:underline"
            >
              + Add Filter
            </button>
            <button
              type="button"
              aria-label="Refresh"
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md text-[#6b7280] hover:bg-neutral-50"
            >
              <RotateCcw className="h-4 w-4 -scale-x-100" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label="Table settings"
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md text-[#6b7280] hover:bg-neutral-50"
            >
              <Wrench className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <div ref={headScrollRef} className={partnersListChrome.headScroll}>
            <table className={availabilityTableGrid.table} style={availabilityTableGrid.tableWidthStyle}>
              <AvailabilityColGroup />
              <thead>
                <AvailabilityHeaderRow />
              </thead>
            </table>
          </div>
          </div>
        </div>
      </div>

      <div className={`${partnersListChrome.contentInset} pb-6`}>
        <div className={availabilityChrome.tableCardBottom}>
          <div
            ref={bodyScrollRef}
            className={partnersListChrome.bodyScroll}
            onScroll={syncHeadScrollFromBody}
          >
            <table className={availabilityTableGrid.table} style={availabilityTableGrid.tableWidthStyle}>
              <AvailabilityColGroup />
              <tbody>
                {pageItems.map((row) => (
                  <AvailabilityRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`flex flex-wrap items-center justify-between gap-3 ${availabilityTableGrid.footer}`}
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
              <PagerBtn
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
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
    </>
  );
}

function colWidthStyle(key: keyof typeof availabilityColumnWidths): CSSProperties {
  const w = availabilityColumnWidths[key];
  return { width: w, minWidth: w, maxWidth: w };
}

function AvailabilityColGroup() {
  return (
    <colgroup>
      {(Object.keys(availabilityColumnWidths) as (keyof typeof availabilityColumnWidths)[]).map(
        (key) => (
          <col key={key} style={{ width: availabilityColumnWidths[key] }} />
        ),
      )}
    </colgroup>
  );
}

function AvailabilityHeaderRow() {
  const g = availabilityTableGrid;
  const h = g.headCell;
  return (
    <tr>
      <th
        className={`${h} ${g.stickyHeadPin}`}
        style={{ ...colWidthStyle('check'), left: 0 }}
      >
        <input
          type="checkbox"
          className="size-4 rounded border-[#888]"
          aria-label="Select all rows on current page"
        />
      </th>
      <th
        className={`${h} ${g.stickyHeadPinLeft}`}
        style={{ ...colWidthStyle('name'), left: g.stickyNameLeftPx }}
      >
        Availability name
      </th>
      <th className={h} style={colWidthStyle('availabilityId')}>
        Availability ID
      </th>
      <th className={h} style={colWidthStyle('locationName')}>
        Location name
      </th>
      <th className={h} style={colWidthStyle('discipline')}>
        Discipline/Specialization
      </th>
      <th className={h} style={colWidthStyle('experienceType')}>
        Experience type
      </th>
      <th className={h} style={colWidthStyle('totalSlots')}>
        Total slots
      </th>
      <th className={h} style={colWidthStyle('pendingRequests')}>
        Pending requests
      </th>
      <th className={h} style={colWidthStyle('requestedSlots')}>
        Requested slots
      </th>
      <th className={h} style={colWidthStyle('createdOn')}>
        Created on
      </th>
      <th className={h} style={colWidthStyle('duration')}>
        Availability duration
      </th>
      <th className={h} style={colWidthStyle('createdBy')}>
        Created by
      </th>
      <th
        className={`${h} ${g.stickyHeadPinRight}`}
        style={{ ...colWidthStyle('status'), right: g.stickyStatusRightPx }}
      >
        Status
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

function AvailabilityRow({ row }: { row: AvailabilityRecord }) {
  const g = availabilityTableGrid;
  const c = g.bodyCell;
  return (
    <tr className={`group ${g.bodyRow}`}>
      <td
        className={`${c} ${g.stickyBodyPin}`}
        style={{ ...colWidthStyle('check'), left: 0 }}
      >
        <input type="checkbox" className="size-4 rounded border-[#888]" aria-label={`Select ${row.name}`} />
      </td>
      <td
        className={`${c} ${g.stickyBodyPinLeft}`}
        style={{ ...colWidthStyle('name'), left: g.stickyNameLeftPx }}
      >
        <button type="button" className={`text-left ${partnersType.link}`}>
          {row.name}
        </button>
      </td>
      <td className={c} style={colWidthStyle('availabilityId')}>
        {row.availabilityId}
      </td>
      <td className={c} style={colWidthStyle('locationName')}>
        <span className="block text-[#212121]">{row.locationName}</span>
        <span className="block text-[12px] text-[#757575]">({row.locationParent})</span>
      </td>
      <td className={c} style={colWidthStyle('discipline')}>
        <span>{row.disciplines[0]}</span>
        {row.disciplines.length > 1 && (
          <button type="button" className="ml-1 text-[#2563eb] hover:underline">
            Show More
          </button>
        )}
      </td>
      <td className={c} style={colWidthStyle('experienceType')}>
        {row.experienceType}
      </td>
      <td className={c} style={colWidthStyle('totalSlots')}>
        {row.totalSlots}
      </td>
      <td className={c} style={colWidthStyle('pendingRequests')}>
        {row.pendingRequests}
      </td>
      <td className={c} style={colWidthStyle('requestedSlots')}>
        {row.requestedSlots}
      </td>
      <td className={c} style={colWidthStyle('createdOn')}>
        {row.createdOn}
      </td>
      <td className={c} style={colWidthStyle('duration')}>
        {row.durationLabel}
      </td>
      <td className={c} style={colWidthStyle('createdBy')}>
        {row.createdBy}
      </td>
      <td
        className={`${c} ${g.stickyBodyPinRight} align-middle`}
        style={{ ...colWidthStyle('status'), right: g.stickyStatusRightPx }}
      >
        {row.status === 'Published' ? (
          <span className={availabilityChrome.publishedPill}>Published</span>
        ) : (
          <span className={availabilityChrome.draftPill}>{row.status}</span>
        )}
      </td>
      <td
        className={`${c} ${g.stickyBodyPinActions} align-middle last:border-r-0`}
        style={{ ...colWidthStyle('actions'), right: 0 }}
      >
        <div className="flex items-center justify-center gap-2.5">
          <IconBtn label={`Edit ${row.name}`} icon={Pencil} variant="default" />
          <IconBtn label={`Duplicate ${row.name}`} icon={Files} variant="default" />
          <IconBtn label={`Delete ${row.name}`} icon={Trash2} variant="destructive" />
        </div>
      </td>
    </tr>
  );
}

function IconBtn({
  label,
  icon: Icon,
  variant,
}: {
  label: string;
  icon: LucideIcon;
  variant: 'default' | 'destructive';
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`rounded p-0.5 ${
        variant === 'destructive'
          ? 'text-[#ef5350] hover:bg-red-50'
          : 'text-[#424242] hover:bg-neutral-100'
      }`}
      onClick={() => console.log(label)}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
    </button>
  );
}

function FacetBtn({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      className="flex h-[34px] shrink-0 items-center gap-2 rounded border border-[#d1d5db] bg-white px-2.5 text-[13px] text-[#111827]"
    >
      <Icon className="h-4 w-4 shrink-0 text-[#6b7280]" strokeWidth={1.75} />
      {label}
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
