import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  RotateCcw,
  Search,
  Users,
} from 'lucide-react';
import {
  createAvailabilityLocationRows,
  type CreateAvailabilityLocationRow,
} from '../../../config/availabilityCreateLocations';
import { availabilityCreateDrawer } from './availabilityCreateDrawer';
import './createAvailabilityLocationTable.css';

const PAGE_SIZE_OPTIONS = [50, 25, 100] as const;

type Props = {
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
};

export function CreateAvailabilityLocationStep({ selectedIds, onSelectionChange }: Props) {
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(50);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return createAvailabilityLocationRows;
    return createAvailabilityLocationRows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.group.toLowerCase().includes(q) ||
        row.address.toLowerCase().includes(q),
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const togglePageAll = () => {
    const pageIds = pageRows.map((r) => r.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    const next = new Set(selectedIds);
    if (allSelected) {
      pageIds.forEach((id) => next.delete(id));
    } else {
      pageIds.forEach((id) => next.add(id));
    }
    onSelectionChange(next);
  };

  const clearAll = () => onSelectionChange(new Set());

  const pageAllChecked =
    pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));
  const pageSomeChecked =
    pageRows.some((r) => selectedIds.has(r.id)) && !pageAllChecked;

  const hasSelection = selectedIds.size > 0;

  return (
    <div className={availabilityCreateDrawer.locationCard}>
      <div
        className={availabilityCreateDrawer.locationScroll}
        data-has-selection={hasSelection ? 'true' : 'false'}
      >
        <div className={availabilityCreateDrawer.filterBar}>
          <label className={availabilityCreateDrawer.searchInput}>
            <Search className="size-4 shrink-0 text-[#888888]" strokeWidth={2} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search by location name"
              className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#212121] outline-none placeholder:text-[#9ca3af]"
            />
          </label>
          <button type="button" className={availabilityCreateDrawer.facetBtn}>
            <MapPin className="size-3.5 text-[#616161]" strokeWidth={2} />
            State
          </button>
          <button type="button" className={availabilityCreateDrawer.facetBtn}>
            <Users className="size-3.5 text-[#616161]" strokeWidth={2} />
            Groups
          </button>
          <button
            type="button"
            aria-label="Reset filters"
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[4px] text-[#6b7280] hover:bg-[#f5f5f5]"
            onClick={() => {
              setQuery('');
              setPage(0);
            }}
          >
            <RotateCcw className="size-4 -scale-x-100" strokeWidth={1.75} />
          </button>
        </div>

        {hasSelection ? (
          <div className={availabilityCreateDrawer.selectionBar}>
            <span>
              {selectedIds.size} location{selectedIds.size === 1 ? '' : 's'} selected.
            </span>
            <button type="button" className={availabilityCreateDrawer.clearAllBtn} onClick={clearAll}>
              Clear All
            </button>
          </div>
        ) : null}

        <table className={availabilityCreateDrawer.table}>
          <thead className="create-loc-table-head">
            <tr>
              <th className={`${availabilityCreateDrawer.th} w-12`}>
                <input
                  type="checkbox"
                  className="create-loc-checkbox rounded-[2px] border-[#888888]"
                  checked={pageAllChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = pageSomeChecked;
                  }}
                  aria-label="Select all locations on this page"
                  onChange={togglePageAll}
                />
              </th>
              <th className={availabilityCreateDrawer.th}>
                <span className="inline-flex items-center gap-1">
                  Location name
                  <ArrowUpDown className="size-3.5 text-[#616161]" strokeWidth={2} aria-hidden />
                </span>
              </th>
              <th className={`${availabilityCreateDrawer.th} w-[100px]`}>Type</th>
              <th className={`${availabilityCreateDrawer.th} min-w-[160px]`}>Group</th>
              <th className={availabilityCreateDrawer.th}>Location address</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <LocationRow
                key={row.id}
                row={row}
                selected={selectedIds.has(row.id)}
                onToggle={() => toggleRow(row.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className={availabilityCreateDrawer.paginationBar}>
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            className="h-8 rounded-[4px] border border-[#d1d5dc] bg-white px-2 text-[13px] text-[#212121]"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
              setPage(0);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <span>
          Page {safePage + 1} of {pageCount} ({filtered.length} items)
        </span>
        <div className="flex items-center gap-1">
          <PaginationIconBtn
            label="First page"
            disabled={safePage === 0}
            onClick={() => setPage(0)}
          >
            <ChevronsLeft className="size-4" />
          </PaginationIconBtn>
          <PaginationIconBtn
            label="Previous page"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="size-4" />
          </PaginationIconBtn>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i)
            .filter((i) => i < pageCount)
            .map((i) => (
              <button
                key={i}
                type="button"
                className={`flex size-8 items-center justify-center rounded-[4px] text-[13px] ${
                  i === safePage ? 'bg-[#3f51b5] text-white' : 'text-[#424242] hover:bg-[#f5f5f5]'
                }`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
          <PaginationIconBtn
            label="Next page"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            <ChevronRight className="size-4" />
          </PaginationIconBtn>
          <PaginationIconBtn
            label="Last page"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(pageCount - 1)}
          >
            <ChevronsRight className="size-4" />
          </PaginationIconBtn>
        </div>
      </div>
    </div>
  );
}

function LocationRow({
  row,
  selected,
  onToggle,
}: {
  row: CreateAvailabilityLocationRow;
  selected: boolean;
  onToggle: () => void;
}) {
  const cellClass = selected
    ? `${availabilityCreateDrawer.td} ${availabilityCreateDrawer.tdSelected}`
    : availabilityCreateDrawer.td;

  return (
    <tr>
      <td className={cellClass}>
        <input
          type="checkbox"
          className="create-loc-checkbox rounded-[2px] border-[#888888]"
          checked={selected}
          aria-label={`Select ${row.name}`}
          onChange={onToggle}
        />
      </td>
      <td className={cellClass}>
        <button type="button" className={availabilityCreateDrawer.locationNameLink}>
          {row.name}
        </button>
      </td>
      <td className={cellClass}>{row.type}</td>
      <td className={cellClass}>
        {row.group}
        {row.groupExtra ? (
          <span className={availabilityCreateDrawer.groupMore}> +{row.groupExtra} more</span>
        ) : null}
      </td>
      <td className={cellClass}>{row.address}</td>
    </tr>
  );
}

function PaginationIconBtn({
  children,
  label,
  disabled,
  onClick,
}: {
  children: ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className="flex size-8 items-center justify-center rounded-[4px] text-[#424242] hover:bg-[#f5f5f5] disabled:opacity-40"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
