/** Schedules list columns. Widths are tighter so status stays easier to reach. */
export const schedulesColumnWidths = {
  scheduleId: 168,
  student: 196,
  groupName: 240,
  schoolName: 180,
  groupSlots: 196,
  groupMembers: 280,
  availability: 176,
  location: 176,
  duration: 204,
  discipline: 264,
  shift: 88,
  daysOfWeek: 148,
  preceptor: 180,
  clinicalInstructor: 210,
  programType: 164,
  groupOnboarding: 284,
  scheduleStatus: 176,
  studentOnboarding: 284,
  onboardingStatus: 220,
  actions: 112,
} as const;

export type SchedulesColumnKey = keyof typeof schedulesColumnWidths;

export const schedulesTableWidthPx = Object.values(schedulesColumnWidths).reduce(
  (sum, w) => sum + w,
  0,
);
