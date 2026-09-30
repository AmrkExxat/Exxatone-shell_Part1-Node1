import { useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {
  PUBLISH_SCHOOL_PARTNER_OPTIONS,
  schoolPartnerLabel,
  schoolPartnersSummary,
} from '../../../config/availabilityPublishPreferences';
import { partnersDrawer } from '../../partners/partnersTypography';
import { availabilityCreateDrawer } from './availabilityCreateDrawer';

type PickerProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

/** Search + checklist (shared by Who sees nested panel and expanded Selected Schools). */
export function SchoolPartnersPickerContent({ selectedIds, onChange }: PickerProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...PUBLISH_SCHOOL_PARTNER_OPTIONS];
    return PUBLISH_SCHOOL_PARTNER_OPTIONS.filter((s) => s.label.toLowerCase().includes(q));
  }, [query]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedInView = filtered.filter((s) => selectedSet.has(s.id));
  const unselectedInView = filtered.filter((s) => !selectedSet.has(s.id));
  const ordered = [...selectedInView, ...unselectedInView];

  const selectAll = () => onChange(PUBLISH_SCHOOL_PARTNER_OPTIONS.map((s) => s.id));
  const clearAll = () => onChange([]);

  const toggle = (id: string) => {
    if (selectedSet.has(id)) onChange(selectedIds.filter((x) => x !== id));
    else onChange([...selectedIds, id]);
  };

  return (
    <div className={availabilityCreateDrawer.selectedSchoolsPanel}>
      <div className={availabilityCreateDrawer.selectedSchoolsHeader}>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold leading-5 text-[#212121]">Selected Schools</span>
          <span className="flex size-5 items-center justify-center rounded-full bg-[#3f51b5] text-[11px] font-medium leading-none text-white">
            {selectedIds.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className={availabilityCreateDrawer.selectedSchoolsLink} onClick={selectAll}>
            Select All
          </button>
          <button type="button" className={availabilityCreateDrawer.selectedSchoolsLink} onClick={clearAll}>
            Clear All
          </button>
        </div>
      </div>

      <div className="relative mt-3">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#757575]"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search schools"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={availabilityCreateDrawer.selectedSchoolsSearch}
        />
      </div>

      <p className={availabilityCreateDrawer.selectedSchoolsHint}>
        School partners associated with the selected discipline(s) and program type(s) — Art Therapy ·
        Masters
      </p>

      {selectedInView.length > 0 ? (
        <p className={availabilityCreateDrawer.selectedSchoolsSectionLabel}>
          SELECTED ({selectedInView.length})
        </p>
      ) : null}

      <ul className={availabilityCreateDrawer.selectedSchoolsList} aria-label="School partners">
        {ordered.map((school) => {
          const checked = selectedSet.has(school.id);
          return (
            <li key={school.id} className={availabilityCreateDrawer.selectedSchoolsRow}>
              <label className="flex min-h-[40px] cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="size-4 shrink-0 rounded border-[#888] accent-[#3f51b5]"
                  checked={checked}
                  onChange={() => toggle(school.id)}
                />
                <span
                  className={`text-[14px] font-normal leading-5 ${
                    checked ? 'text-[#3f51b5]' : 'text-[#212121]'
                  }`}
                >
                  {schoolPartnerLabel(school.id)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type FieldProps = PickerProps & {
  fieldId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Collapsed summary trigger; expands in place when open (exclusive overlay). */
export function SelectedSchoolsField({ fieldId, selectedIds, onChange, open, onOpenChange }: FieldProps) {
  const hasSelection = selectedIds.length > 0;
  const summary = hasSelection ? schoolPartnersSummary(selectedIds) : 'Please select schools';

  return (
    <div className="mt-4">
      <FieldLabel required htmlFor={fieldId}>
        Selected Schools
      </FieldLabel>
      <div className="relative w-full" data-publish-overlay="selected-schools">
        <button
          id={fieldId}
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          className={`${availabilityCreateDrawer.selectedSchoolsCollapsedTrigger} ${
            open ? 'border-[#3f51b5] ring-2 ring-[#3f51b5]/20' : ''
          }`}
          onClick={() => onOpenChange(!open)}
        >
          <span
            className={`min-w-0 flex-1 truncate text-left text-[14px] font-normal leading-5 ${
              hasSelection ? 'text-[#212121]' : partnersDrawer.programSelectPlaceholder
            }`}
          >
            {summary}
          </span>
          <span className="rounded-[4px] bg-[#e8eaf6] px-1.5 py-0.5 text-[12px] font-medium leading-none text-[#3f51b5]">
            {selectedIds.length}
          </span>
          <ChevronDown
            className={`size-4 shrink-0 text-[#616161] ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {open ? (
          <div className="relative z-10 mt-2">
            <SchoolPartnersPickerContent selectedIds={selectedIds} onChange={onChange} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`${partnersDrawer.fieldLabel} mb-2 flex items-center gap-1`}>
      {children}
      {required ? <span className="text-[#d32f2f]">*</span> : null}
    </label>
  );
}
