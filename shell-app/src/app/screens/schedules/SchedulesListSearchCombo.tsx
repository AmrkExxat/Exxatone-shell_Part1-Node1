import { ChevronDown, Search, X } from 'lucide-react';
import { partnersFont, schedulesChrome } from './schedulesTypography';

type Props = {
  scopeLabel: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function SchedulesListSearchCombo({ scopeLabel, placeholder, value, onChange }: Props) {
  return (
    <div className={`${schedulesChrome.searchComboOuter} ${partnersFont}`}>
      <button
        type="button"
        className={schedulesChrome.searchComboScopeBtn}
        aria-label="Search scope"
      >
        <span className="truncate text-[14px] font-normal leading-5 text-[#111827]">
          {scopeLabel}
        </span>
        <ChevronDown className="size-4 shrink-0 text-[#111827]" strokeWidth={1.75} aria-hidden />
      </button>
      <div className={schedulesChrome.searchComboDivider} aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={schedulesChrome.searchComboInput}
      />
      {value ? (
        <button
          type="button"
          className={schedulesChrome.searchComboClear}
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      ) : (
        <span className={schedulesChrome.searchComboClear} aria-hidden />
      )}
      <div className={schedulesChrome.searchComboSearchIcon} aria-hidden>
        <Search className="size-4 text-[#888888]" strokeWidth={1.75} />
      </div>
    </div>
  );
}
