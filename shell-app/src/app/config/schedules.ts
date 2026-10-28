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
};

export const schedulesOverviewStats = {
  ongoing: { value: 27, sub: 'Across 4 Schools' },
  upcomingConfirmed: { value: 0, sub: 'Across 0 Schools' },
  upcomingNonConfirmed: { value: 5, sub: 'Across 2 Schools' },
} as const;

export const schedulesNeedsAttentionMetrics = [
  {
    id: 'toBeScheduled' as const,
    count: 1213,
    label: 'To be Scheduled',
    iconWrapClass: 'bg-[#fef9c3]',
    iconClass: 'text-[#ca8a04]',
  },
  {
    id: 'notCompliant' as const,
    count: 402,
    label: 'Not Compliant',
    iconWrapClass: 'bg-[#ffedd5]',
    iconClass: 'text-[#ea580c]',
  },
  {
    id: 'canceled' as const,
    count: 146,
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

/** Figma Schedules Overview — Recent Activities rail. */
export const schedulesRecentActivities: ScheduleActivityItem[] = [
  {
    id: 'ra1',
    variant: 'updated',
    text: 'Individual schedule updated for Eastwood State University for Sep 16, 2026 - Sep 21, 2026. (Individual)',
    discipline: 'Art Therapy',
    location: 'Ruchita - Johns Hopkins Hospital',
    updatedOn: 'Oct 23, 2026',
    updatedBy: 'Mr Darp Dhameliya',
  },
  {
    id: 'ra2',
    variant: 'updated',
    text: 'Individual schedule updated for Eastwood State University for Sep 16, 2026 - Sep 21, 2026. (Individual)',
    discipline: 'Art Therapy',
    location: 'Ruchita - Johns Hopkins Hospital +2 more',
    updatedOn: 'Oct 23, 2026',
    updatedBy: 'Mr Darp Dhameliya',
  },
  {
    id: 'ra3',
    variant: 'cancelled',
    text: 'Group schedule cancelled for Eastwood State University for Sep 16, 2026 - Sep 21, 2026. (Group)',
    discipline: 'Art Therapy +3 more',
    location: 'Ruchita - Johns Hopkins Hospital +3 more',
    updatedOn: 'Oct 23, 2026',
    updatedBy: 'Exxat Super Admin',
  },
  {
    id: 'ra4',
    variant: 'cancelled',
    text: 'Individual schedule cancelled for Eastwood State University for Sep 16, 2026 - Sep 21, 2026. (Individual)',
    discipline: 'Art Therapy',
    location: 'Ruchita - Johns Hopkins Hospital',
    updatedOn: 'Oct 23, 2026',
    updatedBy: 'Mr Darp Dhameliya',
  },
  {
    id: 'ra5',
    variant: 'updated',
    text: 'Individual schedule updated for Central City College for May 1, 2026 - May 12, 2026. (Individual)',
    discipline: 'Audiology',
    location: '0011 test no phone no discipline',
    updatedOn: 'Oct 22, 2026',
    updatedBy: 'Mr Darp Dhameliya',
  },
];

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

const baseRows: ScheduleRecord[] = [
  {
    id: 's1',
    scheduleId: '6427314',
    assignmentLabel: 'Direct Assignment - 6427314',
    primaryName: 'Henry Caville',
    primarySubline: 'henry.caville@mailinator.com',
    kind: 'individual',
    schoolName: 'Eastwood State University',
    availability: 'ICU Clinical — Spring 2026',
    location: 'Bedlam Hospital — Main Campus',
    durationLabel: '02/01/2026 – 02/28/2026',
    discipline: 'Nursing (BSN)',
    shift: 'Day',
    daysOfWeek: 'Mon – Fri',
    preceptor: 'Dr. Sarah Chen',
    clinicalInstructor: '—',
    programType: 'Undergraduate',
    scheduleStatus: 'Confirmed',
    onboardingStatus: 'Compliant',
    timeline: 'upcoming',
  },
  {
    id: 's2',
    scheduleId: '6427315',
    assignmentLabel: 'Slot Request - 6427315',
    primaryName: 'Maria Lopez',
    primarySubline: 'maria.lopez@school.edu',
    kind: 'individual',
    schoolName: 'Central City College',
    availability: 'Pediatrics Outpatient',
    location: 'Bedlam Hospital — West Wing',
    durationLabel: '03/10/2026 – 04/04/2026',
    discipline: 'Physician Assistant',
    shift: 'Evening',
    daysOfWeek: 'Tue – Sat',
    preceptor: 'James Porter, PA-C',
    clinicalInstructor: 'Amy Ng',
    programType: 'Graduate',
    scheduleStatus: 'Confirmed',
    onboardingStatus: 'In Progress',
    timeline: 'upcoming',
  },
  {
    id: 's3',
    scheduleId: '6428001',
    assignmentLabel: 'Group Schedule - 6428001',
    primaryName: 'PT Cohort B (12 students)',
    primarySubline: 'Group schedule',
    kind: 'group',
    schoolName: 'Eastwood State University',
    availability: 'Acute Care PT Rotation',
    location: 'Bedlam Hospital — Rehab Center',
    durationLabel: '01/15/2026 – 03/01/2026',
    discipline: 'Physical Therapy (DPT)',
    shift: 'Day',
    daysOfWeek: 'Mon – Thu',
    preceptor: 'Lisa Hammond, PT',
    clinicalInstructor: '—',
    programType: 'Graduate',
    scheduleStatus: 'Ongoing',
    onboardingStatus: 'Not Compliant',
    timeline: 'current',
  },
  {
    id: 's4',
    scheduleId: '6428002',
    assignmentLabel: 'Group Schedule - 6428002',
    primaryName: 'Nursing Block A (8 students)',
    kind: 'group',
    schoolName: 'Riverside Nursing Institute',
    availability: 'Med-Surg Block',
    location: 'Bedlam Hospital — Main Campus',
    durationLabel: '10/01/2025 – 12/15/2025',
    discipline: 'Nursing (BSN)',
    shift: 'Rotating',
    daysOfWeek: 'Varies',
    preceptor: 'Multiple',
    clinicalInstructor: 'Pat Rivera',
    programType: 'Undergraduate',
    scheduleStatus: 'Completed',
    onboardingStatus: 'Compliant',
    timeline: 'completed',
  },
  {
    id: 's5',
    scheduleId: '6427316',
    assignmentLabel: 'Direct Assignment - 6427316',
    primaryName: 'Alex Kim',
    primarySubline: 'alex.kim@university.edu',
    kind: 'individual',
    schoolName: 'ABC University - Nursing',
    availability: 'Emergency Department',
    location: 'Bedlam Hospital — ED',
    durationLabel: '07/28/2026 – 08/26/2026',
    discipline: 'Nursing (BSN)',
    shift: 'Night',
    daysOfWeek: 'Fri – Sun',
    preceptor: 'Pending',
    clinicalInstructor: '—',
    programType: 'Undergraduate',
    scheduleStatus: 'Pending Confirmation',
    onboardingStatus: 'Not Started',
    timeline: 'upcoming',
  },
  {
    id: 's6',
    scheduleId: '6427317',
    assignmentLabel: 'Direct Assignment - 6427317',
    primaryName: 'Jordan Smith',
    primarySubline: 'jordan.smith@mail.edu',
    kind: 'individual',
    schoolName: 'Eastwood State University',
    availability: 'Behavioral Health',
    location: 'Bedlam Hospital — Pavilion B',
    durationLabel: '09/01/2025 – 10/30/2025',
    discipline: 'Social Work (MSW)',
    shift: 'Day',
    daysOfWeek: 'Mon – Wed',
    preceptor: 'Morgan Lee, LCSW',
    clinicalInstructor: '—',
    programType: 'Graduate',
    scheduleStatus: 'Completed',
    onboardingStatus: 'Compliant',
    timeline: 'completed',
  },
];

export const SCHEDULE_MOCK_RECORDS: ScheduleRecord[] = [
  ...baseRows,
  ...baseRows.map((r, i) => ({
    ...r,
    id: `${r.id}-dup-${i}`,
    scheduleId: `${r.scheduleId}${i}`,
  })),
];

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
