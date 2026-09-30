/** Fixed column widths (px) — Figma 571:20809 table header frames. */
export const availabilityColumnWidths = {
  check: 40,
  name: 280,
  availabilityId: 150,
  locationName: 220,
  discipline: 300,
  experienceType: 150,
  totalSlots: 130,
  pendingRequests: 160,
  requestedSlots: 160,
  createdOn: 160,
  duration: 220,
  createdBy: 160,
  status: 200,
  actions: 150,
} as const;

export const availabilityTableWidthPx = Object.values(availabilityColumnWidths).reduce(
  (sum, w) => sum + w,
  0,
);

export const availabilityStickyStatusRightPx = availabilityColumnWidths.actions;

export const availabilityStickyNameLeftPx = availabilityColumnWidths.check;
