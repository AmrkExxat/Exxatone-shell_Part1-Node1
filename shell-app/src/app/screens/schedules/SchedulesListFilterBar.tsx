import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CirclePlus,
  FileOutput,
  RotateCcw,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { ScheduleListKind } from '../../config/schedules';
import { SchedulesListSearchCombo } from './SchedulesListSearchCombo';
import {
  SCHEDULE_FILTER_FACETS,
  schedulesListFilterConfig,
  type ScheduleFilterFacetId,
} from './schedulesListFilters';
import { schedulesChrome } from './schedulesTypography';

type Props = {
  listKind: ScheduleListKind;
  query: string;
  onQueryChange: (value: string) => void;
};

export function SchedulesListFilterBar({ listKind, query, onQueryChange }: Props) {
  const config = schedulesListFilterConfig[listKind];
  const [expanded, setExpanded] = useState(false);
  const overflowCount = config.overflowIds.length;

  return (
    <div className={schedulesChrome.filterBarWrap}>
      <div className={schedulesChrome.filterBarPrimaryRow}>
        <div className={schedulesChrome.filterBarFacetsLine}>
          <SchedulesListSearchCombo
            scopeLabel={config.searchScopeLabel}
            placeholder={config.searchPlaceholder}
            value={query}
            onChange={onQueryChange}
          />
          {config.inlineIds.map((id) => (
            <ScheduleFacetBtn key={id} facetId={id} />
          ))}
          {!expanded && overflowCount > 0 ? (
            <button
              type="button"
              className={schedulesChrome.filterMoreLink}
              onClick={() => setExpanded(true)}
            >
              +{overflowCount} more
            </button>
          ) : null}
        </div>
        <FilterToolbarActions
          expanded={expanded}
          canExpand={overflowCount > 0}
          onToggleExpanded={() => setExpanded((v) => !v)}
        />
      </div>
      {expanded && overflowCount > 0 ? (
        <div className={schedulesChrome.filterBarSecondaryRow}>
          {config.overflowIds.map((id) => (
            <ScheduleFacetBtn key={id} facetId={id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ScheduleFacetBtn({ facetId }: { facetId: ScheduleFilterFacetId }) {
  const { label, icon: Icon } = SCHEDULE_FILTER_FACETS[facetId];
  return (
    <button type="button" className={schedulesChrome.facetBtn}>
      <Icon className="h-4 w-4 shrink-0 text-[#6b7280]" strokeWidth={1.75} aria-hidden />
      {label}
    </button>
  );
}

function FilterToolbarActions({
  expanded,
  canExpand,
  onToggleExpanded,
}: {
  expanded: boolean;
  canExpand: boolean;
  onToggleExpanded: () => void;
}) {
  return (
    <div className={schedulesChrome.filterToolbarCluster}>
      <button type="button" className={schedulesChrome.addFilterBtn}>
        <CirclePlus className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        Add Filter
      </button>
      <IconTileButton icon={RotateCcw} label="Refresh filters" className="-scale-x-100" />
      <IconTileButton
        icon={expanded ? ChevronUp : ChevronDown}
        label={expanded ? 'Collapse filters' : 'Expand filters'}
        onClick={canExpand ? onToggleExpanded : undefined}
        ariaExpanded={expanded}
      />
      <div className={schedulesChrome.filterToolbarDivider} aria-hidden />
      <IconTileButton icon={FileOutput} label="Export" bordered />
      <IconTileButton icon={Wrench} label="Table settings" bordered />
    </div>
  );
}

function IconTileButton({
  icon: Icon,
  label,
  onClick,
  bordered,
  ariaExpanded,
  className = '',
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  bordered?: boolean;
  ariaExpanded?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      className={`${schedulesChrome.filterIconBtn} ${bordered ? schedulesChrome.filterIconBtnBordered : ''}`}
    >
      <Icon className={`h-4 w-4 ${className}`} strokeWidth={1.75} />
    </button>
  );
}
