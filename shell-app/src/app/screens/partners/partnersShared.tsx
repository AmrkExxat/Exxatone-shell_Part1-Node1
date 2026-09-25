import type { ContractCounts } from '../../config/schoolPartners';
import { partnersType } from './partnersTypography';

/** Contract status pills — list table Contracts column (stacked). */
export function ContractPills({ contracts }: { contracts: ContractCounts }) {
  return (
    <div className="flex flex-col gap-1.5 py-0.5">
      {contracts.active > 0 && (
        <span className={partnersType.contractPillGreen}>{contracts.active} Active</span>
      )}
      {contracts.expired > 0 && (
        <span className={partnersType.contractPillOrange}>{contracts.expired} Expired</span>
      )}
    </div>
  );
}

/** Contract summary — partner detail cover (inline with title). */
export function ContractSummaryBadges({ contracts }: { contracts: ContractCounts }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {contracts.active > 0 && (
        <span className={partnersType.contractPillGreen}>
          {contracts.active} Active Contracts
        </span>
      )}
      {contracts.expired > 0 && (
        <span className={partnersType.contractPillOrange}>
          {contracts.expired} Contract{contracts.expired === 1 ? '' : 's'} Expired
        </span>
      )}
    </div>
  );
}
