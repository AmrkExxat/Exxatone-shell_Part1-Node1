import { ChevronDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { AvailabilityTopTabs } from './AvailabilityTopTabs';
import { availabilityChrome } from './availabilityTypography';

type AvailabilityModuleChromeProps = {
  onCreateSingle?: () => void;
};

export function AvailabilityModuleChrome({ onCreateSingle }: AvailabilityModuleChromeProps) {
  return (
    <div className={availabilityChrome.moduleHeaderInner}>
      <h1 className={availabilityChrome.moduleTitle}>View and Track Availability</h1>

      <div className={availabilityChrome.tabPillWrap}>
        <AvailabilityTopTabs />
      </div>

      <div className={availabilityChrome.addBtnWrap}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={availabilityChrome.addBtn}>
              <span className="inline-flex items-center gap-1.5">
                <Plus className="size-4" strokeWidth={2.25} />
                Add Availability
              </span>
              <ChevronDown className="size-4 shrink-0 opacity-95" strokeWidth={2} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[300px] p-1.5">
            <DropdownMenuItem
              className={availabilityChrome.dropdownItem}
              onSelect={() => onCreateSingle?.()}
            >
              <Plus className="mt-0.5 size-4 shrink-0 text-[#424242]" strokeWidth={2} />
              <span>Create Single Availability</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={availabilityChrome.dropdownItem}
              onSelect={() => console.log('Create bulk availability stub')}
            >
              <Plus className="mt-0.5 size-4 shrink-0 text-[#424242]" strokeWidth={2} />
              <span className="max-w-[240px] whitespace-normal">
                Create Multiple Availabilities in Bulk
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          className={availabilityChrome.bulkHistoryLink}
          onClick={() => console.log('Bulk Creation History stub')}
        >
          Bulk Creation History
        </button>
      </div>
    </div>
  );
}
