import {
  Activity,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clock,
  FilePlus,
  LineChart,
  RotateCcw,
  Users,
} from 'lucide-react';
import {
  availabilityCategoryBreakdown,
  availabilityHighDemand,
  availabilityOverviewStats,
  availabilityRecentActivities,
} from '../../config/availability';
import { availabilityOverviewChrome as oc } from './availabilityOverviewChrome';
import {
  partnersListChrome,
  partnersSurfaces,
  partnersType,
} from './availabilityTypography';
import { partnersTableGrid } from '../partners/partnersTable';

const KPI_ICONS = {
  active: { icon: Activity, className: 'text-[#3f51b5]' },
  awaiting: { icon: Clock, className: 'text-[#ef6c00]' },
  starting: { icon: Calendar, className: 'text-[#2e7d32]' },
  pending: { icon: AlertTriangle, className: 'text-[#d32f2f]' },
} as const;

export function AvailabilityOverviewPage() {
  return (
    <div className={`${partnersListChrome.contentInset} pb-8 pt-4`}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-medium text-[#757575]">Filters:</span>
        <button
          type="button"
          className="flex h-[34px] items-center gap-2 rounded border border-[#d1d5db] bg-white px-2.5 text-[13px] text-[#111827]"
        >
          Discipline
          <ChevronRight className="size-3 rotate-90 text-[#6b7280]" />
        </button>
        <button
          type="button"
          aria-label="Reset filters"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-md text-[#6b7280] hover:bg-white"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              tone="active"
              label="Active Availabilities"
              value={availabilityOverviewStats.active.value}
              sub={availabilityOverviewStats.active.sub}
            />
            <StatCard
              tone="awaiting"
              label="Awaiting Publish"
              value={availabilityOverviewStats.awaitingPublish.value}
              sub={availabilityOverviewStats.awaitingPublish.sub}
            />
            <StatCard
              tone="starting"
              label="Availabilities starting in next 30 Days"
              value={availabilityOverviewStats.startingSoon.value}
              sub={availabilityOverviewStats.startingSoon.sub}
            />
            <StatCard
              tone="pending"
              label="Availabilities with Pending Requests"
              value={availabilityOverviewStats.pendingRequests.value}
              sub={availabilityOverviewStats.pendingRequests.sub}
            />
          </div>

          <section className={`${partnersSurfaces.card} p-5`}>
            <div className="flex items-center gap-2">
              <Users className="size-5 shrink-0 text-[#5c6bc0]" strokeWidth={1.75} aria-hidden />
              <h2 className={oc.sectionTitle}>Category Breakdown</h2>
            </div>
            <div className="mt-5 flex flex-col gap-6 md:flex-row md:gap-0">
              <BreakdownColumn title="Experience Type" items={availabilityCategoryBreakdown.experienceType} />
              <BreakdownColumn title="Publish Type" items={availabilityCategoryBreakdown.publishType} />
              <BreakdownColumn
                title="Slot Number Specification"
                items={availabilityCategoryBreakdown.slotSpec}
              />
            </div>
          </section>

          <section className={`${partnersSurfaces.card} overflow-hidden p-0`}>
            <div className="flex items-start gap-2 border-b border-[#eceef1] px-5 py-4">
              <LineChart className="mt-0.5 size-5 shrink-0 text-[#3f51b5]" strokeWidth={1.75} aria-hidden />
              <div>
                <h2 className={oc.sectionTitle}>Availabilities with high demand (Among Active)</h2>
                <p className={oc.sectionSubtitle}>Top 5 based on number of requested slots</p>
              </div>
            </div>
            <div className="w-full overflow-x-hidden">
            <table
              className={oc.highDemandTable}
              style={{ width: '100%', tableLayout: 'fixed' }}
              data-availability-high-demand-table
            >
              <colgroup>
                <col style={{ width: '24%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '16%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th className={oc.highDemandHead}>Availability name</th>
                  <th className={oc.highDemandHead}>Experience type</th>
                  <th className={oc.highDemandHead}>Requests received</th>
                  <th className={oc.highDemandHead}>Pending requests</th>
                  <th className={oc.highDemandHead}>Requested slots</th>
                  <th className={`${oc.highDemandHead} border-r-0`}>Approved slots</th>
                </tr>
              </thead>
              <tbody>
                {availabilityHighDemand.map((row) => (
                  <tr key={row.name} className={oc.highDemandRow}>
                    <td
                      className={`${partnersTableGrid.bodyCell} ${oc.highDemandBodyCell} ${oc.highDemandNameCell}`}
                    >
                      <button
                        type="button"
                        className={`${oc.highDemandNameLink} ${partnersType.link}`}
                        title={row.name}
                      >
                        {row.name}
                      </button>
                    </td>
                    <td className={`${partnersTableGrid.bodyCell} ${oc.highDemandBodyCell} ${oc.highDemandMetricCell}`}>
                      <span className={oc.experiencePill}>{row.experienceType}</span>
                    </td>
                    <td className={`${partnersTableGrid.bodyCell} ${oc.highDemandBodyCell} ${oc.highDemandMetricCell}`}>
                      <span className={oc.metricBlue}>{row.requestsReceived}</span>
                    </td>
                    <td className={`${partnersTableGrid.bodyCell} ${oc.highDemandBodyCell} ${oc.highDemandMetricCell}`}>
                      <span className={oc.metricBlue}>{row.pendingRequests}</span>
                    </td>
                    <td className={`${partnersTableGrid.bodyCell} ${oc.highDemandBodyCell} ${oc.highDemandMetricCell}`}>
                      <span className="text-[#212121]">{row.requestedSlots}</span>
                    </td>
                    <td
                      className={`${partnersTableGrid.bodyCell} ${oc.highDemandBodyCell} ${oc.highDemandMetricCell} border-r-0`}
                    >
                      <span className={oc.metricGreen}>{row.approvedSlots}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        </div>

        <aside className={`${partnersSurfaces.card} flex max-h-[720px] flex-col p-0`}>
          <div className="border-b border-[#eceef1] px-4 py-3">
            <h2 className={oc.sectionTitle}>Recent Activities</h2>
          </div>
          <ul className="flex-1 overflow-y-auto px-2 py-2">
            {availabilityRecentActivities.map((item) => (
              <li key={item.id} className={oc.activityItem}>
                <div className="flex gap-3">
                  <span className={oc.activityIconWrap} aria-hidden>
                    <FilePlus className="size-[18px] text-[#5e35b1]" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={oc.activityTitle}>{item.title}</p>
                    <p className="mt-1 text-[12px] leading-4 text-[#424242]">
                      <span className={oc.activityLabel}>Discipline:</span> {item.discipline}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-4 text-[#424242]">
                      <span className={oc.activityLabel}>Location:</span> {item.location}
                    </p>
                    <p className={oc.activityMeta}>{item.meta}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  tone,
  label,
  value,
  sub,
}: {
  tone: keyof typeof KPI_ICONS;
  label: string;
  value: number;
  sub: string;
}) {
  const { icon: Icon, className: iconClass } = KPI_ICONS[tone];
  return (
    <div className={oc.kpiCard}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <Icon className={`mt-0.5 size-5 shrink-0 ${iconClass}`} strokeWidth={1.75} aria-hidden />
          <p className={oc.kpiTitle}>{label}</p>
        </div>
        <button type="button" className={oc.kpiCta}>
          View &gt;
        </button>
      </div>
      <p className={oc.kpiValue}>{value}</p>
      <p className={oc.kpiSub}>{sub}</p>
    </div>
  );
}

function BreakdownColumn({
  title,
  items,
}: {
  title: string;
  items: readonly { label: string; count: number; pct: number; color: string }[];
}) {
  return (
    <div className={oc.breakdownColumn}>
      <h3 className={oc.breakdownColumnTitle}>{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex min-w-0 items-center gap-2 text-[#424242]">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="flex shrink-0 items-baseline gap-2">
              <span className={oc.breakdownCount}>{item.count}</span>
              <span className={oc.breakdownPct}>{item.pct}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
