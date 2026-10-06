import { useMemo, useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import {
  PARTNER_CATEGORY_OPTIONS,
  partnerCategoriesSummary,
} from '../../config/schoolPartners';
import { partnersDrawer } from './partnersTypography';
import { PartnerCategoryCollapsedBadges } from './partnerCategoryBadges';

type Props = {
  selected: string[];
  onChange: (next: string[]) => void;
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
  /** Zero selected — red border on trigger / open panel. */
  invalid?: boolean;
};

export function PartnerCategoryMultiSelect({
  selected,
  onChange,
  panelOpen,
  onPanelOpenChange,
  invalid = false,
}: Props) {
  const [query, setQuery] = useState('');

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...PARTNER_CATEGORY_OPTIONS];
    return PARTNER_CATEGORY_OPTIONS.filter((opt) => opt.toLowerCase().includes(q));
  }, [query]);

  const selectedInList = filteredOptions.filter((opt) => selectedSet.has(opt));
  const unselectedInList = filteredOptions.filter((opt) => !selectedSet.has(opt));

  const toggle = (opt: string) => {
    if (selectedSet.has(opt)) {
      onChange(selected.filter((id) => id !== opt));
      return;
    }
    onChange([...selected, opt]);
  };

  const clearAll = () => onChange([]);

  const orderedOptions = [...selectedInList, ...unselectedInList];

  return (
    <div className="relative mt-12">
      <p className={`${partnersDrawer.categoryLabel} mb-1`}>Partner Category</p>
      <button
        type="button"
        onClick={() => onPanelOpenChange(!panelOpen)}
        className={`${partnersDrawer.selectTrigger} ${
          invalid ? 'border-[#d32f2f] focus-visible:outline-[#d32f2f]' : ''
        }`}
        aria-expanded={panelOpen}
        aria-haspopup="listbox"
        aria-invalid={invalid}
      >
        <span className={partnersDrawer.selectValue}>{partnerCategoriesSummary(selected.length)}</span>
        {panelOpen ? (
          <ChevronUp className={partnersDrawer.selectChevron} strokeWidth={2} aria-hidden />
        ) : (
          <ChevronDown className={partnersDrawer.selectChevron} strokeWidth={2} aria-hidden />
        )}
      </button>

      {invalid && !panelOpen ? <CategoryValidationMessage className="mt-1.5" /> : null}

      {selected.length > 0 ? (
        <PartnerCategoryCollapsedBadges
          categories={selected}
          className={panelOpen ? 'mt-2 mb-1' : 'mt-2'}
          onRemoveCategory={(label) => toggle(label)}
        />
      ) : null}

      {panelOpen ? (
        <div
          className={`${partnersDrawer.dropdownPanel} mt-1 ${
            invalid ? 'border-[#d32f2f]' : ''
          }`}
          role="listbox"
          aria-multiselectable
          aria-label="Partner categories"
        >
          <div className="border-b border-[#eceef1] p-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories"
                className="h-[36px] w-full rounded-[6px] border border-[#888888] bg-white py-2 pl-9 pr-3 text-[14px] text-[#212121] outline-none placeholder:text-[#5d5d5d]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#fafafa] px-3 py-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-[#757575]">
              Selected ({selected.length})
            </span>
            {selected.length > 0 ? (
              <button
                type="button"
                className="text-[13px] font-normal text-[#3f51b5] hover:underline"
                onClick={clearAll}
              >
                Clear all
              </button>
            ) : null}
          </div>

          <ul className="max-h-[min(320px,50vh)] overflow-y-auto py-1">
            {orderedOptions.map((opt) => (
              <CategoryRow
                key={opt}
                label={opt}
                checked={selectedSet.has(opt)}
                onToggle={() => toggle(opt)}
              />
            ))}
          </ul>

          <div className={`${partnersDrawer.dropdownFooter} py-2`}>
            {invalid ? (
              <CategoryValidationMessage className="min-w-0 flex-1 pr-3" />
            ) : (
              <span className="flex-1" aria-hidden />
            )}
            <button
              type="button"
              className="shrink-0 text-[13px] font-normal leading-4 text-[#3f51b5] hover:underline"
              onClick={() => onPanelOpenChange(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CategoryValidationMessage({ className = '' }: { className?: string }) {
  return (
    <p
      className={`flex items-center gap-1.5 text-[13px] font-normal leading-5 text-[#d32f2f] ${className}`}
      role="alert"
    >
      <AlertCircle className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      Select at least one category to save.
    </p>
  );
}

function CategoryRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={checked}
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#f5f5f5]"
      >
        <span
          className={`flex size-4 shrink-0 items-center justify-center rounded-[3px] border ${
            checked ? 'border-[#3f51b5] bg-[#3f51b5]' : 'border-[#888888] bg-white'
          }`}
          aria-hidden
        >
          {checked ? (
            <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none">
              <path
                d="M2.5 6l2.5 2.5 4.5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
        <span
          className={`min-w-0 flex-1 truncate ${
            checked ? partnersDrawer.optionSelected : partnersDrawer.optionDefault
          }`}
        >
          {label}
        </span>
      </button>
    </li>
  );
}
