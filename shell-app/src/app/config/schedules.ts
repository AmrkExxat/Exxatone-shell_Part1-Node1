import { prototypeRecentActivities, prototypeScheduleRecords } from '../data/prototype/scheduleRecords';

export type ScheduleTimeline = 'upcoming' | 'current' | 'completed';
export type ScheduleListKind = 'all' | 'group' | 'individual';

export type ScheduleRecord = {
  id: string;
  scheduleId: string;
  assignmentLabel: string;
  /** Student name or group name depending on kind */
  primaryName: string;
  primarySubline?: string;
  kind: 'group' | 'individual';
  schoolName: string;
  availability: string;
  location: string;
  durationLabel: string;
  discipline: string;
  shift: string;
  daysOfWeek: string;
  preceptor: string;
  clinicalInstructor: string;
  programType: string;
  scheduleStatus: string;
  onboardingStatus: string;
  timeline: ScheduleTimeline;
  /** Students on a group schedule. Individual rows use primaryName. */
  memberNames?: string[];
};

export const schedulesOverviewStats = {
  ongoing: { value: 3, sub: 'Across 2 Schools' },
  upcomingConfirmed: { value: 2, sub: 'Across 1 School' },
  upcomingNonConfirmed: { value: 2, sub: 'Across 2 Schools' },
} as const;

export const schedulesNeedsAttentionMetrics = [
  {
    id: 'toBeScheduled' as const,
    count: 6,
    label: 'To be Scheduled',
    iconWrapClass: 'bg-[#fef9c3]',
    iconClass: 'text-[#ca8a04]',
  },
  {
    id: 'notCompliant' as const,
    count: 2,
    label: 'Not Compliant',
    iconWrapClass: 'bg-[#ffedd5]',
    iconClass: 'text-[#ea580c]',
  },
  {
    id: 'canceled' as const,
    count: 1,
    label: 'Canceled',
    iconWrapClass: 'bg-[#fee2e2]',
    iconClass: 'text-[#dc2626]',
  },
] as const;

export type ScheduleActivityItem = {
  id: string;
  text: string;
  discipline?: string;
  location: string;
  updatedOn: string;
  updatedBy: string;
  variant: 'updated' | 'cancelled';
};

/** Recent activity, drawn from the same schools and locations as the schedule list. */
export const schedulesRecentActivities: ScheduleActivityItem[] = prototypeRecentActivities;

/** Slot Approvals bar chart — mock series (Figma Overview). */
export const schedulesSlotApprovalsChart = {
  months: [
    'Oct 2026',
    'Nov 2026',
    'Dec 2026',
    'Jan 2027',
    'Feb 2027',
    'Mar 2027',
    'Apr 2027',
    'May 2027',
    'Jun 2027',
    'Jul 2027',
    'Aug 2027',
    'Sep 2027',
  ],
  /** [approved, confirmed, compliant] heights 0–6 scale per month */
  series: [
    [4, 1, 0],
    [0, 0, 0],
    [0, 0, 0],
    [5, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
} as const;

export const SCHEDULE_MOCK_RECORDS: ScheduleRecord[] = prototypeScheduleRecords;

export function filterSchedulesForList(
  records: ScheduleRecord[],
  listKind: ScheduleListKind,
  timeline: ScheduleTimeline | 'all',
  query: string,
): ScheduleRecord[] {
  let rows = records;
  if (listKind === 'group') rows = rows.filter((r) => r.kind === 'group');
  if (listKind === 'individual') rows = rows.filter((r) => r.kind === 'individual');
  if (timeline !== 'all') rows = rows.filter((r) => r.timeline === timeline);
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) =>
      r.scheduleId.includes(q) ||
      r.primaryName.toLowerCase().includes(q) ||
      r.assignmentLabel.toLowerCase().includes(q),
  );
}
