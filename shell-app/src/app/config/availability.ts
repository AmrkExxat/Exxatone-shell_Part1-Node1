import { prototypeLocations } from '../data/prototype/directory';
import { prototypeSite } from '../data/prototype/site';

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


const loc = Object.fromEntries(prototypeLocations.map((location) => [location.id, location.name]));

const prototypeAvailabilitySeeds: Omit<AvailabilityRecord, 'id'>[] = [
  {
    availabilityId: '7895421',
    name: 'Med-Surg Clinical',
    locationName: loc['med-surg'],
    locationParent: prototypeSite.name,
    disciplines: ['Nursing'],
    experienceType: 'Group',
    totalSlots: 6,
    pendingRequests: 0,
    requestedSlots: 6,
    createdOn: 'Jun 2, 2026',
    durationLabel: 'Sep 8, 2026 - Dec 12, 2026',
    createdBy: 'Danielle Price',
    status: 'Published',
    timeline: 'current',
  },
  {
    availabilityId: '7895422',
    name: 'Telemetry Clinical',
    locationName: loc['med-surg'],
    locationParent: prototypeSite.name,
    disciplines: ['Nursing'],
    experienceType: 'Group',
    totalSlots: 6,
    pendingRequests: 0,
    requestedSlots: 6,
    createdOn: 'Jun 2, 2026',
    durationLabel: 'Sep 8, 2026 - Dec 12, 2026',
    createdBy: 'Danielle Price',
    status: 'Published',
    timeline: 'current',
  },
  {
    availabilityId: '7895423',
    name: 'Emergency Nursing Clinical',
    locationName: loc['ed'],
    locationParent: prototypeSite.name,
    disciplines: ['Nursing'],
    experienceType: 'Group',
    totalSlots: 6,
    pendingRequests: 1,
    requestedSlots: 3,
    createdOn: 'Oct 14, 2026',
    durationLabel: 'Jan 11, 2027 - Apr 2, 2027',
    createdBy: 'Omar Reyes',
    status: 'Published',
    timeline: 'upcoming',
  },
  {
    availabilityId: '7895424',
    name: 'Med-Surg Clinical — Summer',
    locationName: loc['med-surg'],
    locationParent: prototypeSite.name,
    disciplines: ['Nursing'],
    experienceType: 'Group',
    totalSlots: 6,
    pendingRequests: 0,
    requestedSlots: 6,
    createdOn: 'Feb 10, 2026',
    durationLabel: 'May 18, 2026 - Aug 7, 2026',
    createdBy: 'Kierra Mango',
    status: 'Published',
    timeline: 'completed',
  },
  {
    availabilityId: '7895431',
    name: 'Acute Inpatient PT',
    locationName: loc['rehab'],
    locationParent: prototypeSite.name,
    disciplines: ['Physical Therapy'],
    experienceType: 'Individual',
    totalSlots: 2,
    pendingRequests: 0,
    requestedSlots: 2,
    createdOn: 'Sep 16, 2026',
    durationLabel: 'Jan 12, 2027 - Mar 6, 2027',
    createdBy: 'Nina Patel',
    status: 'Published',
    timeline: 'upcoming',
  },
  {
    availabilityId: '7895432',
    name: 'Outpatient Orthopedics',
    locationName: loc['outpatient'],
    locationParent: prototypeSite.name,
    disciplines: ['Physical Therapy'],
    experienceType: 'Individual',
    totalSlots: 2,
    pendingRequests: 0,
    requestedSlots: 2,
    createdOn: 'Sep 16, 2026',
    durationLabel: 'Jan 12, 2027 - Mar 6, 2027',
    createdBy: 'Victor Hale',
    status: 'Published',
    timeline: 'upcoming',
  },
  {
    availabilityId: '7895433',
    name: 'Neurorehabilitation',
    locationName: loc['rehab'],
    locationParent: prototypeSite.name,
    disciplines: ['Physical Therapy'],
    experienceType: 'Individual',
    totalSlots: 1,
    pendingRequests: 1,
    requestedSlots: 1,
    createdOn: 'Oct 20, 2026',
    durationLabel: 'Feb 2, 2027 - Apr 24, 2027',
    createdBy: 'Nina Patel',
    status: 'Draft',
    timeline: 'upcoming',
  },
  {
    availabilityId: '7895434',
    name: 'Acute Inpatient PT — Fall',
    locationName: loc['rehab'],
    locationParent: prototypeSite.name,
    disciplines: ['Physical Therapy'],
    experienceType: 'Individual',
    totalSlots: 1,
    pendingRequests: 0,
    requestedSlots: 1,
    createdOn: 'Jul 8, 2026',
    durationLabel: 'Oct 5, 2026 - Dec 18, 2026',
    createdBy: 'Lisa Hammond, PT',
    status: 'Published',
    timeline: 'current',
  },
];

export const initialAvailabilityRecords: AvailabilityRecord[] = prototypeAvailabilitySeeds.map(
  (seed, index) => ({ ...seed, id: `av-${index + 1}` }),
);

export const availabilityOverviewStats = {
  active: { value: 6, sub: 'across 4 locations' },
  awaitingPublish: { value: 1, sub: '1 draft not yet published' },
  startingSoon: { value: 3, sub: 'Upcoming start dates' },
  pendingRequests: { value: 2, sub: 'Require attention' },
} as const;

export const availabilityCategoryBreakdown = {
  experienceType: [
    { label: 'Individual', count: 4, pct: 50, color: '#3f51b5' },
    { label: 'Group', count: 4, pct: 50, color: '#009688' },
  ],
  publishType: [
    { label: 'Public', count: 2, pct: 25, color: '#9c27b0' },
    { label: 'Partners', count: 6, pct: 75, color: '#e91e63' },
    { label: 'Consortium', count: 0, pct: 0, color: '#4caf50' },
  ],
  slotSpec: [
    { label: 'Slot Number Specified', count: 8, pct: 100, color: '#4caf50' },
    { label: 'Not Specified', count: 0, pct: 0, color: '#9e9e9e' },
  ],
} as const;

export const availabilityHighDemand = [
  {
    name: 'Med-Surg Clinical',
    experienceType: 'Group' as const,
    requestsReceived: 8,
    pendingRequests: 0,
    requestedSlots: 6,
    approvedSlots: 6,
  },
  {
    name: 'Acute Inpatient PT',
    experienceType: 'Individual' as const,
    requestsReceived: 4,
    pendingRequests: 0,
    requestedSlots: 2,
    approvedSlots: 2,
  },
  {
    name: 'Emergency Nursing Clinical',
    experienceType: 'Group' as const,
    requestsReceived: 3,
    pendingRequests: 1,
    requestedSlots: 3,
    approvedSlots: 2,
  },
  {
    name: 'Outpatient Orthopedics',
    experienceType: 'Individual' as const,
    requestsReceived: 2,
    pendingRequests: 0,
    requestedSlots: 2,
    approvedSlots: 2,
  },
] as const;

export const availabilityRecentActivities = [
  {
    id: '1',
    title: 'Availability "Emergency Nursing Clinical" created for Jan 11, 2027 - Apr 2, 2027',
    discipline: 'Nursing',
    location: loc['ed'],
    meta: 'Created on Oct 14, 2026 by Omar Reyes',
  },
  {
    id: '2',
    title: 'Availability "Acute Inpatient PT" published',
    discipline: 'Physical Therapy',
    location: loc['rehab'],
    meta: 'Published on Sep 16, 2026 by Nina Patel',
  },
  {
    id: '3',
    title: 'Availability "Neurorehabilitation" saved as a draft',
    discipline: 'Physical Therapy',
    location: loc['rehab'],
    meta: 'Updated on Oct 20, 2026 by Nina Patel',
  },
  {
    id: '4',
    title: 'Availability "Med-Surg Clinical" published',
    discipline: 'Nursing',
    location: loc['med-surg'],
    meta: 'Published on Jun 2, 2026 by Danielle Price',
  },
] as const;
