/** Figma Bulk-email Schedules whole-table frames (3:22536, etc.). */
export const schedulesColumnWidths = {
  scheduleId: 200,
  student: 230,
  schoolName: 220,
  availability: 230,
  location: 230,
  duration: 190,
  discipline: 230,
  shift: 190,
  daysOfWeek: 150,
  preceptor: 190,
  clinicalInstructor: 190,
  programType: 250,
  scheduleStatus: 190,
  onboardingStatus: 190,
  actions: 100,
} as const;

export type SchedulesColumnKey = keyof typeof schedulesColumnWidths;

/** Row-select checkbox column — shown for Group / Individual lists only, not All. */
export const schedulesSelectColumnWidth = 48;

export const schedulesTableWidthPx = Object.values(schedulesColumnWidths).reduce(
  (sum, w) => sum + w,
  0,
);

/** Second sticky column starts after schedule ID. */
export const schedulesStickyStudentLeftPx = schedulesColumnWidths.scheduleId;

/** Schedule status column sits left of onboarding + actions. */
export const schedulesStickyScheduleStatusRightPx =
  schedulesColumnWidths.actions + schedulesColumnWidths.onboardingStatus;

export const schedulesStickyOnboardingRightPx = schedulesColumnWidths.actions;
