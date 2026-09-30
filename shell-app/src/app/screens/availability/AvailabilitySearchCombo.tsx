import { ChevronDown, Search, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { availabilityChrome, partnersFont } from './availabilityTypography';

interface AvailabilitySearchComboProps {
  value: string;
  onChange: (value: string) => void;
  scopeLabel?: string;
}

/** Figma 571:15049 — Availability scope + search in one bordered control. */
export function AvailabilitySearchCombo({
  value,
  onChange,
  scopeLabel = 'Availability',
}: AvailabilitySearchComboProps) {
  return (
    <div className={`${availabilityChrome.searchComboOuter} ${partnersFont}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={availabilityChrome.searchComboScopeBtn}
            aria-label="Search scope"
          >
            <span className="truncate text-[14px] font-normal leading-5 text-[#111827]">
              {scopeLabel}
            </span>
            <ChevronDown className="size-4 shrink-0 text-[#111827]" strokeWidth={1.75} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px]">
          <DropdownMenuItem onSelect={() => console.log('Scope: Availability')}>
            Availability
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('Scope: Location')}>
            Location
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className={availabilityChrome.searchComboDivider} aria-hidden />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by Availability Name"
        className={availabilityChrome.searchComboInput}
        aria-label="Search by Availability Name"
      />

      {value ? (
        <button
          type="button"
          className={availabilityChrome.searchComboClear}
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      ) : (
        <span className={availabilityChrome.searchComboClear} aria-hidden />
      )}

      <div className={availabilityChrome.searchComboSearchIcon} aria-hidden>
        <Search className="size-4 text-[#888888]" strokeWidth={1.75} />
      </div>
    </div>
  );
}
