import { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck,
  FileX2,
  GraduationCap,
  LineChart,
  RotateCcw,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { schedulesOverviewStats, schedulesRecentActivities } from '../../config/schedules';
import {
  SchedulesPieEmptyPlaceholder,
  SchedulesPieOnboardingEmptyExploded,
  SchedulesPieSchedulesOverview,
  SchedulesSlotApprovalsChart,
} from './SchedulesOverviewCharts';
import {
  partnersListChrome,
  partnersSurfaces,
  schedulesOverviewChrome as oc,
} from './schedulesTypography';

type UpcomingRange = 'next-30' | 'all-upcoming';

const KPI_TONES = {
  ongoing: { icon: Activity, iconClass: 'text-[#3f51b5]' },
  confirmed: { icon: CheckCircle2, iconClass: 'text-[#2e7d32]' },
  nonConfirmed: { icon: Clock, iconClass: 'text-[#ef6c00]' },
} as const;

export function SchedulesOverviewPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const listBase = `/site/${siteId}/schedules/list/all`;
  const [upcomingRange, setUpcomingRange] = useState<UpcomingRange>('next-30');

  return (
    <div className={`${partnersListChrome.contentInset} pb-8 pt-4`}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex w-full flex-wrap items-center gap-2 rounded-lg border border-[#eceef1] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <span className="text-[13px] font-medium text-[#757575]">Filters:</span>
            <button
              type="button"
              className="flex h-[34px] items-center gap-2 rounded border border-[#d1d5db] bg-white px-2.5 text-[13px] text-[#111827]"
            >
              <GraduationCap
                className="size-4 shrink-0 text-[#6b7280]"
                strokeWidth={1.75}
                aria-hidden
              />
              Discipline
              <ChevronRight className="size-3 rotate-90 text-[#6b7280]" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Reset filters"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-transparent bg-white text-[#6b7280] hover:bg-[#f9fafb]"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard
              tone="ongoing"
              title="Ongoing Schedules"
              value={schedulesOverviewStats.ongoing.value}
              sub={schedulesOverviewStats.ongoing.sub}
              href={listBase}
            />
            <KpiCard
              tone="confirmed"
              title="Upcoming Confirmed Schedules"
              value={schedulesOverviewStats.upcomingConfirmed.value}
              sub={schedulesOverviewStats.upcomingConfirmed.sub}
              href={listBase}
            />
            <KpiCard
              tone="nonConfirmed"
              title="Upcoming Non-Confirmed Schedules"
              value={schedulesOverviewStats.upcomingNonConfirmed.value}
              sub={schedulesOverviewStats.upcomingNonConfirmed.sub}
              href={listBase}
            />
          </div>

          <section className={`${partnersSurfaces.card} overflow-hidden p-0`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eceef1] px-5 py-4">
              <h2 className={oc.sectionTitle}>Upcoming Schedules Overview</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUpcomingRange('next-30')}
                  className={`rounded-md px-3 py-2 text-[14px] leading-5 ${
                    upcomingRange === 'next-30'
                      ? 'bg-[#3f51b5] font-medium text-white'
                      : 'bg-transparent font-normal text-[#111827] hover:bg-[#f9fafb]'
                  }`}
                >
                  Next 30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setUpcomingRange('all-upcoming')}
                  className={`rounded-md px-3 py-2 text-[14px] leading-5 ${
                    upcomingRange === 'all-upcoming'
                      ? 'bg-[#3f51b5] font-medium text-white'
                      : 'bg-transparent font-normal text-[#111827] hover:bg-[#f9fafb]'
                  }`}
                >
                  All Upcoming
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:items-stretch">
              {upcomingRange === 'all-upcoming' ? (
                <SchedulesPieSchedulesOverview />
              ) : (
                <SchedulesPieEmptyPlaceholder title="Schedules Overview" />
              )}
              {upcomingRange === 'all-upcoming' ? (
                <SchedulesPieOnboardingEmptyExploded />
              ) : (
                <SchedulesPieEmptyPlaceholder title="Student Onboarding Overview" />
              )}
            </div>
          </section>

          <section className={`${partnersSurfaces.card} overflow-hidden p-0`}>
            <div className="border-b border-[#eceef1] px-5 py-4">
              <div className="flex items-start gap-2">
                <LineChart
                  className="mt-0.5 size-5 shrink-0 text-[#3f51b5]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <div>
                  <h2 className={oc.sectionTitle}>
                    Slot Approvals and Confirmation (Based on start month)
                  </h2>
                  <p className={oc.sectionSubtitle}>
                    Overview of 12 months based on available data: approved schedules, confirmed
                    schedules, and those compliant to start
                  </p>
                </div>
              </div>
            </div>
            <SchedulesSlotApprovalsChart />
          </section>
        </div>

        <aside className={`${partnersSurfaces.card} self-start p-0`}>
          <div className="border-b border-[#eceef1] px-4 py-3">
            <h2 className={oc.sectionTitle}>Recent Activities</h2>
          </div>
          <ul className="space-y-4 px-4 py-3">
            {schedulesRecentActivities.map((item) => (
              <li key={item.id}>
                <div className="flex gap-3">
                  {item.variant === 'cancelled' ? (
                    <FileX2
                      className="mt-0.5 size-5 shrink-0 text-[#ef4444]"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  ) : (
                    <FileCheck
                      className="mt-0.5 size-5 shrink-0 text-[#2e7d32]"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-5 text-[#212121]">{item.text}</p>
                    {item.discipline ? (
                      <p className="mt-1 text-[12px] leading-4 text-[#212121]">
                        <span className="font-semibold text-[#424242]">Discipline:</span>{' '}
                        <ActivityDetailValue value={item.discipline} />
                      </p>
                    ) : null}
                    <p className="mt-1 break-words text-[12px] leading-4 text-[#212121]">
                      <span className="font-semibold text-[#424242]">Location:</span>{' '}
                      <ActivityDetailValue value={item.location} />
                    </p>
                    <p className={`${oc.activityMeta} mt-1`}>
                      Updated on {item.updatedOn} by {item.updatedBy}
                    </p>
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

function ActivityDetailValue({ value }: { value: string }) {
  const match = value.match(/^(.+?)(\s+\+\d+\s+more)$/i);
  if (!match) return <>{value}</>;
  return (
    <>
      {match[1]}
      <button type="button" className="font-normal text-[#2563eb] hover:underline">
        {match[2].trim()}
      </button>
    </>
  );
}

function KpiCard({
  tone,
  title,
  value,
  sub,
  href,
}: {
  tone: keyof typeof KPI_TONES;
  title: string;
  value: number;
  sub: string;
  href: string;
}) {
  const { icon: Icon, iconClass } = KPI_TONES[tone];
  return (
    <div className={oc.kpiCard}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <Icon className={`mt-0.5 size-5 shrink-0 ${iconClass}`} strokeWidth={1.75} aria-hidden />
          <p className={oc.kpiTitle}>{title}</p>
        </div>
        <Link to={href} className={oc.kpiCta}>
          View
          <ChevronRight className="size-3.5" strokeWidth={2} aria-hidden />
        </Link>
      </div>
      <p className={`${oc.kpiValue} mt-3`}>{value}</p>
      <p className={oc.kpiSub}>{sub}</p>
    </div>
  );
}
