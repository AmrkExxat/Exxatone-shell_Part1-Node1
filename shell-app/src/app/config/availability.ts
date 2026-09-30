export type AvailabilityTimeline = 'upcoming' | 'current' | 'completed';

export type AvailabilityPublishStatus = 'Published' | 'Draft' | 'Scheduled';

export interface AvailabilityRecord {
  id: string;
  availabilityId: string;
  name: string;
  locationName: string;
  locationParent: string;
  disciplines: string[];
  experienceType: 'Individual' | 'Group';
  totalSlots: number;
  pendingRequests: number;
  requestedSlots: number;
  createdOn: string;
  durationLabel: string;
  createdBy: string;
  status: AvailabilityPublishStatus;
  timeline: AvailabilityTimeline;
}

/** Figma Consortium table (1045:7509) row patterns — locations and people anonymized for prototype sharing. */
const prototypeAvailabilitySeeds: Omit<AvailabilityRecord, 'id' | 'timeline'>[] = [
  {
    availabilityId: '7895423099',
    name: 'GroupLC',
    locationName: 'Demo Medical Center — East Campus',
    locationParent: 'Consortium Demo Health System',
    disciplines: ['Physical Therapy', 'Occupational Therapy'],
    experienceType: 'Group',
    totalSlots: 1,
    pendingRequests: 0,
    requestedSlots: 0,
    createdOn: 'Sep 24, 2026',
    durationLabel: 'Sep 24, 2026 - Sep 30, 2026',
    createdBy: 'Level 0 Location Access',
    status: 'Published',
  },
  {
    availabilityId: '8941890903',
    name: 'Group- Shift and Days of week in Basic Info + Days',
    locationName: 'Demo Children\'s Hospital — South',
    locationParent: 'Consortium Demo Health System',
    disciplines: ['Anesthesia Assistant', 'Nursing', 'Radiologic Technology'],
    experienceType: 'Group',
    totalSlots: 5,
    pendingRequests: 1,
    requestedSlots: 2,
    createdOn: 'Sep 15, 2026',
    durationLabel: 'Sep 15, 2026 - Oct 01, 2026',
    createdBy: 'Demo Site Coordinator',
    status: 'Published',
  },
  {
    availabilityId: '2204264744',
    name: 'Group - Shift and Days of week in Basic Info + Day',
    locationName: 'Regional Demo Hospital — Central',
    locationParent: 'Consortium Demo Network',
    disciplines: ['Anesthesia Assistant', 'Respiratory Care', 'Surgical Technology'],
    experienceType: 'Group',
    totalSlots: 5,
    pendingRequests: 1,
    requestedSlots: 2,
    createdOn: 'Sep 15, 2026',
    durationLabel: 'Sep 15, 2026 - Oct 01, 2026',
    createdBy: 'Demo Site Coordinator',
    status: 'Published',
  },
  {
    availabilityId: '8502913639',
    name: 'Group - Shift and Days of week in Basic Info + Day',
    locationName: 'Exxat Demo — Location 3',
    locationParent: 'Consortium Demo Network',
    disciplines: ['Anesthesia Assistant', 'Nursing', 'Physical Therapy', 'Social Work'],
    experienceType: 'Group',
    totalSlots: 5,
    pendingRequests: 0,
    requestedSlots: 0,
    createdOn: 'Sep 12, 2026',
    durationLabel: 'Sep 12, 2026 - Sep 28, 2026',
    createdBy: 'Consortium Admin (Demo)',
    status: 'Published',
  },
  {
    availabilityId: '2862162513',
    name: 'Group - Without Basic Info & EXT - Multi Loc',
    locationName: 'Demo Ambulatory — North Tower',
    locationParent: 'Consortium Demo Health System',
    disciplines: ['Nursing'],
    experienceType: 'Group',
    totalSlots: 10,
    pendingRequests: 0,
    requestedSlots: 4,
    createdOn: 'Sep 10, 2026',
    durationLabel: 'Sep 10, 2026 - Oct 15, 2026',
    createdBy: 'Level 0 Location Access',
    status: 'Published',
  },
  {
    availabilityId: '8076570782',
    name: 'INT-8D8130--',
    locationName: 'Demo Clinical Site — Unit A',
    locationParent: 'Consortium Demo Network',
    disciplines: ['Anesthesia Assistant', 'Nursing', 'Physical Therapy'],
    experienceType: 'Individual',
    totalSlots: 3,
    pendingRequests: 0,
    requestedSlots: 0,
    createdOn: 'Sep 15, 2026',
    durationLabel: 'Sep 15, 2026 - Oct 31, 2026',
    createdBy: 'Demo Site Coordinator',
    status: 'Published',
  },
  {
    availabilityId: '6129045581',
    name: 'INT-B36A0E--',
    locationName: 'Demo Medical Center — West Wing',
    locationParent: 'Consortium Demo Health System',
    disciplines: ['Physical Therapy'],
    experienceType: 'Individual',
    totalSlots: 2,
    pendingRequests: 0,
    requestedSlots: 1,
    createdOn: 'Sep 8, 2026',
    durationLabel: 'Sep 8, 2026 - Sep 30, 2026',
    createdBy: 'Level 0 Location Access',
    status: 'Published',
  },
  {
    availabilityId: '4412087734',
    name: 'INT-981D3B--',
    locationName: 'Regional Demo Clinic — Outpatient',
    locationParent: 'Consortium Demo Network',
    disciplines: ['Occupational Therapy', 'Speech-Language Pathology'],
    experienceType: 'Individual',
    totalSlots: 4,
    pendingRequests: 1,
    requestedSlots: 3,
    createdOn: 'Sep 5, 2026',
    durationLabel: 'Sep 5, 2026 - Nov 1, 2026',
    createdBy: 'Consortium Admin (Demo)',
    status: 'Published',
  },
  {
    availabilityId: '9031148820',
    name: 'INT-BEF235--',
    locationName: 'Exxat Demo — Location 1',
    locationParent: 'Consortium Demo Network',
    disciplines: ['Nursing'],
    experienceType: 'Individual',
    totalSlots: 6,
    pendingRequests: 0,
    requestedSlots: 5,
    createdOn: 'Sep 1, 2026',
    durationLabel: 'Sep 1, 2026 - Sep 26, 2026',
    createdBy: 'Demo Site Coordinator',
    status: 'Published',
  },
  {
    availabilityId: '5583901247',
    name: 'INT-B2C564--',
    locationName: 'Demo Surgical Center',
    locationParent: 'Consortium Demo Health System',
    disciplines: ['Surgical Technology', 'Anesthesia Assistant'],
    experienceType: 'Individual',
    totalSlots: 2,
    pendingRequests: 0,
    requestedSlots: 0,
    createdOn: 'Aug 28, 2026',
    durationLabel: 'Aug 28, 2026 - Sep 20, 2026',
    createdBy: 'Level 0 Location Access',
    status: 'Draft',
  },
  {
    availabilityId: '9690352623',
    name: 'INT-9F94F9--',
    locationName: 'Demo Rehabilitation Institute',
    locationParent: 'Consortium Demo Network',
    disciplines: ['Physical Therapy', 'Occupational Therapy'],
    experienceType: 'Individual',
    totalSlots: 8,
    pendingRequests: 2,
    requestedSlots: 6,
    createdOn: 'Aug 22, 2026',
    durationLabel: 'Aug 22, 2026 - Dec 15, 2026',
    createdBy: 'Consortium Admin (Demo)',
    status: 'Published',
  },
  {
    availabilityId: '7310458892',
    name: 'Group - Standard shifts only (Demo)',
    locationName: 'Metro Demo Hospital — ICU',
    locationParent: 'Consortium Demo Health System',
    disciplines: ['Nursing', 'Respiratory Care'],
    experienceType: 'Group',
    totalSlots: 12,
    pendingRequests: 0,
    requestedSlots: 9,
    createdOn: 'Aug 18, 2026',
    durationLabel: 'Aug 18, 2026 - Oct 30, 2026',
    createdBy: 'Demo Site Coordinator',
    status: 'Scheduled',
  },
];

const timelineForIndex = (i: number): AvailabilityTimeline => {
  const t = prototypeAvailabilitySeeds[i % prototypeAvailabilitySeeds.length];
  if (t.status === 'Draft') return 'upcoming';
  if (t.createdOn.startsWith('Aug')) return 'current';
  if (t.durationLabel.includes('Dec')) return 'current';
  return i % 5 === 4 ? 'completed' : 'current';
};

function buildRecords(): AvailabilityRecord[] {
  const rows: AvailabilityRecord[] = [];
  for (let i = 0; i < 41; i++) {
    const seed = prototypeAvailabilitySeeds[i % prototypeAvailabilitySeeds.length];
    rows.push({
      ...seed,
      id: `av-${i + 1}`,
      availabilityId: i < prototypeAvailabilitySeeds.length ? seed.availabilityId : String(Number(seed.availabilityId) + i),
      timeline: timelineForIndex(i),
    });
  }
  return rows;
}

export const initialAvailabilityRecords = buildRecords();

export const availabilityOverviewStats = {
  active: { value: 88, sub: 'across 57 locations' },
  awaitingPublish: { value: 0, sub: '0 scheduled to publish in future' },
  startingSoon: { value: 8, sub: 'Upcoming start dates' },
  pendingRequests: { value: 1, sub: 'Require attention' },
} as const;

export const availabilityCategoryBreakdown = {
  experienceType: [
    { label: 'Individual', count: 15, pct: 17, color: '#3f51b5' },
    { label: 'Group', count: 73, pct: 83, color: '#009688' },
  ],
  publishType: [
    { label: 'Public', count: 2, pct: 2, color: '#9c27b0' },
    { label: 'Partners', count: 6, pct: 6, color: '#e91e63' },
    { label: 'Consortium', count: 85, pct: 91, color: '#4caf50' },
  ],
  slotSpec: [
    { label: 'Slot Number Specified', count: 82, pct: 93, color: '#4caf50' },
    { label: 'Not Specified', count: 6, pct: 7, color: '#9e9e9e' },
  ],
} as const;

export const availabilityHighDemand = [
  {
    name: 'Group - Standard shifts only (Demo)',
    experienceType: 'Group' as const,
    requestsReceived: 14,
    pendingRequests: 0,
    requestedSlots: 9,
    approvedSlots: 9,
  },
  {
    name: 'INT-9F94F9--',
    experienceType: 'Individual' as const,
    requestsReceived: 11,
    pendingRequests: 2,
    requestedSlots: 6,
    approvedSlots: 4,
  },
  {
    name: 'INT-BEF235--',
    experienceType: 'Individual' as const,
    requestsReceived: 8,
    pendingRequests: 0,
    requestedSlots: 5,
    approvedSlots: 5,
  },
  {
    name: 'Group - Without Basic Info & EXT - Multi Loc',
    experienceType: 'Group' as const,
    requestsReceived: 6,
    pendingRequests: 0,
    requestedSlots: 4,
    approvedSlots: 4,
  },
  {
    name: 'INT-981D3B--',
    experienceType: 'Individual' as const,
    requestsReceived: 5,
    pendingRequests: 1,
    requestedSlots: 3,
    approvedSlots: 3,
  },
] as const;

export const availabilityRecentActivities = [
  {
    id: '1',
    title: 'Availability "INT-BEF235--" created for Sep 1, 2026 - Sep 26, 2026',
    discipline: 'Nursing',
    location: 'Exxat Demo — Location 1',
    meta: 'Created on Sep 1, 2026 by Demo Site Coordinator',
  },
  {
    id: '2',
    title: 'Availability "GroupLC" published',
    discipline: 'Physical Therapy',
    location: 'Demo Medical Center — East Campus',
    meta: 'Published on Sep 24, 2026 by Level 0 Location Access',
  },
  {
    id: '3',
    title: 'Availability "INT-981D3B--" updated',
    discipline: 'Occupational Therapy',
    location: 'Regional Demo Clinic — Outpatient',
    meta: 'Updated on Sep 5, 2026 by Consortium Admin (Demo)',
  },
  {
    id: '4',
    title: 'Availability "Group- Shift and Days of week in Basic Info + Days" created',
    discipline: 'Anesthesia Assistant',
    location: 'Demo Children\'s Hospital — South',
    meta: 'Created on Sep 15, 2026 by Demo Site Coordinator',
  },
] as const;
