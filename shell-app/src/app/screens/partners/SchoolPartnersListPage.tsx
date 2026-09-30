import { useCallback, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  MapPin,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { FontAwesomeIcon } from '../../components/font-awesome-icon';
import { Input } from '../../components/ui/input';
import { useSchoolPartners } from '../../data/SchoolPartnersContext';
import type { SchoolPartner } from '../../config/schoolPartners';
import { AddProgramPartnerSheet } from './AddProgramPartnerSheet';
import { EditCategorySheet } from './EditCategorySheet';
import { PartnerCategoryTableCell } from './partnerCategoryBadges';
import { ProgramContactsDialog } from './ProgramContactsDialog';
import { ContractPills } from './partnersShared';
import {
  partnersFont,
  partnersListChrome,
  partnersSurfaces,
  partnersType,
} from './partnersTypography';
import { partnersTableGrid } from './partnersTable';

const PAGE_SIZE = 50;

export function SchoolPartnersListPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const { partners, getPartner, updatePartnerCategories } = useSchoolPartners();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [editPartnerId, setEditPartnerId] = useState<string | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [contactsDialogPartner, setContactsDialogPartner] = useState<SchoolPartner | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return partners;
    return partners.filter(
      (p) =>
        p.schoolName.toLowerCase().includes(q) ||
        p.website.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q)) ||
        p.discipline.toLowerCase().includes(q),
    );
  }, [partners, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const editPartner = editPartnerId ? getPartner(editPartnerId) : null;

  const openEdit = (id: string) => {
    setEditPartnerId(id);
    setEditSheetOpen(true);
  };

  const base = `/site/${siteId}/partners`;

  const headScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const syncBodyScrollLeft = useCallback(() => {
    const head = headScrollRef.current;
    const body = bodyScrollRef.current;
    if (head && body) body.scrollLeft = head.scrollLeft;
  }, []);

  const syncHeadScrollLeft = useCallback(() => {
    const head = headScrollRef.current;
    const body = bodyScrollRef.current;
    if (head && body) head.scrollLeft = body.scrollLeft;
  }, []);

  const filterRow = (
    <div className={`${partnersListChrome.filterBarInner} flex items-center gap-2`}>
      <div className="relative w-full max-w-[280px] shrink-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search"
          className="h-[34px] pl-9 bg-white border-[#eceef1]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <FacetBtn icon={MapPin} label="State" />
        <FacetBtn icon={Building2} label="Category" />
        <FacetBtn icon={ClipboardCheck} label="Contract Status" />
        <FacetBtn icon={Users} label="Program Contact Details" />
        <FacetBtn icon={BookOpen} label="Discipline" />
        <button
          type="button"
          aria-label="Refresh"
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md text-[#6b7280] hover:bg-neutral-50"
        >
          <RotateCcw className="h-4 w-4 -scale-x-100" strokeWidth={1.75} />
        </button>
      </div>
      <button
        type="button"
        aria-label="Export"
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md border border-[#eceef1] bg-white text-[#6b7280] shadow-sm hover:bg-neutral-50"
      >
        <FontAwesomeIcon name="fileExport" className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );

  return (
    <div className={`min-h-full ${partnersSurfaces.page} ${partnersFont}`}>
      <div className={partnersListChrome.stickyToolbar}>
        <div className={partnersListChrome.titleBar}>
          <div
            className={`${partnersListChrome.titleBarInner} flex items-center justify-between gap-4`}
          >
            <h1 className={partnersType.pageTitle}>School Partners</h1>
            <button
              type="button"
              className={partnersType.primaryButton}
              onClick={() => setAddSheetOpen(true)}
            >
              <span aria-hidden>+</span>
              Add Partner
            </button>
          </div>
        </div>

        <div className={partnersListChrome.contentInset}>
          <div className={partnersListChrome.tableCardTop}>
            {filterRow}
            <div
              ref={headScrollRef}
              className={partnersListChrome.headScroll}
              onScroll={syncBodyScrollLeft}
            >
              <table className={`${partnersTableGrid.table} table-fixed`}>
                <PartnerTableColGroup />
                <thead>
                  <PartnerTableHeaderRow />
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className={`${partnersListChrome.contentInset} pb-6`}>
        <div className={partnersListChrome.tableCardBottom}>
          <div
            ref={bodyScrollRef}
            className={partnersListChrome.bodyScroll}
            onScroll={syncHeadScrollLeft}
          >
            <table className={`${partnersTableGrid.table} table-fixed`}>
              <PartnerTableColGroup />
              <tbody>
                {pageItems.map((row) => (
                  <PartnerRow
                    key={row.id}
                    row={row}
                    base={base}
                    onEdit={() => openEdit(row.id)}
                    onOpenContacts={() => setContactsDialogPartner(row)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`flex flex-wrap items-center justify-between gap-3 ${partnersTableGrid.footer}`}
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

      <AddProgramPartnerSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} />

      <EditCategorySheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        partner={editPartner ?? null}
        onUpdate={(categories) => {
          if (editPartnerId) updatePartnerCategories(editPartnerId, categories);
        }}
      />

      <ProgramContactsDialog
        open={contactsDialogPartner !== null}
        onOpenChange={(open) => {
          if (!open) setContactsDialogPartner(null);
        }}
        contacts={contactsDialogPartner?.contacts ?? []}
      />
    </div>
  );
}

function PartnerRow({
  row,
  base,
  onEdit,
  onOpenContacts,
}: {
  row: SchoolPartner;
  base: string;
  onEdit: () => void;
  onOpenContacts: () => void;
}) {
  const programContactBlank =
    !row.programContactPrimary ||
    row.programContactPrimary === '--' ||
    row.contacts.length === 0;
  return (
    <tr className={partnersTableGrid.bodyRow}>
      <td className={partnersTableGrid.bodyCell}>
        <Link to={`${base}/${row.id}`} className={partnersType.link}>
          {row.schoolName}
        </Link>
      </td>
      <td className={partnersTableGrid.bodyCell}>
        {row.website === '--' ? (
          <span className="text-[14px] text-[#757575]">--</span>
        ) : (
          <a href={row.websiteUrl || '#'} className={partnersType.link}>
            {row.website}
          </a>
        )}
      </td>
      <td className={partnersTableGrid.bodyCell}>
        <span className="line-clamp-4 text-[14px] leading-5 text-[#424242]">{row.address}</span>
      </td>
      <td className={`${partnersTableGrid.bodyCell} max-w-0 overflow-hidden align-middle`}>
        <PartnerCategoryTableCell categories={row.categories} />
      </td>
      <td className={partnersTableGrid.bodyCell}>
        <ContractPills contracts={row.contracts} />
      </td>
      <td className={partnersTableGrid.bodyCell}>
        {programContactBlank ? (
          <span className="text-[14px] text-[#757575]">--</span>
        ) : (
          <button
            type="button"
            className={`text-left ${partnersType.link}`}
            onClick={onOpenContacts}
            aria-haspopup="dialog"
            aria-label={`All contacts for ${row.schoolName}`}
          >
            {row.programContactPrimary}
            {row.programContactExtra > 0 ? (
              <span className="whitespace-nowrap"> +{row.programContactExtra}</span>
            ) : null}
          </button>
        )}
      </td>
      <td className={partnersTableGrid.bodyCell}>
        <span className="text-[14px] leading-5 text-[#424242]">{row.discipline}</span>
      </td>
      <td className={partnersTableGrid.bodyCell}>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onEdit}
            className="rounded p-1 text-[#757575] hover:bg-neutral-100"
            aria-label={`Edit ${row.schoolName}`}
          >
            <Pencil className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="rounded p-1 text-[#d32f2f] hover:bg-red-50"
            aria-label={`Delete ${row.schoolName}`}
            onClick={() => console.log('Delete stub', row.id)}
          >
            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function PartnerTableColGroup() {
  return (
    <colgroup>
      <col className="w-[250px]" />
      <col className="w-[200px]" />
      <col className="w-[250px]" />
      <col className="w-[200px]" />
      <col className="w-[150px]" />
      <col className="w-[250px]" />
      <col className="w-[250px]" />
      <col className="w-[100px]" />
    </colgroup>
  );
}

function PartnerTableHeaderRow() {
  return (
    <tr>
      <th className={partnersTableGrid.headCellWrap}>School name</th>
      <th className={partnersTableGrid.headCell}>Website</th>
      <th className={partnersTableGrid.headCell}>Address</th>
      <th className={`${partnersTableGrid.headCell} max-w-0`}>Category</th>
      <th className={partnersTableGrid.headCell}>Contracts</th>
      <th className={partnersTableGrid.headCellWrap}>Program contact</th>
      <th className={partnersTableGrid.headCellWrap}>Associated Discipline</th>
      <th className={partnersTableGrid.headCell}>Actions</th>
    </tr>
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
